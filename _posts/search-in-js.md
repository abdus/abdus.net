---
title: "Quick Tutorial: Build a Search API from Scratch"
date: 2022-02-23T12:53:08+05:30
draft: false
meta:
  image: https://i.ibb.co/rfnmnKw/paul-green-mln2-Ex-JIkfc-unsplash.jpg
  description: # overrides .Summary
tags: [javascript, backend, frontend, search]
categories: [javascript]
---

Search functionality is one of the most common features you see in any digital
product. I would hesitate to use a product that does not contain a search bar
(given that the search bar is necessary). However, creating a search engine as
big as Google would take lots of time and energy, and may not be possible for a
lone developer. So, here I will demonstrate a simple way to build a search
engine for small to medium-sized products.

## The Stack

Before getting into the actual coding, let me introduce you to the tech stack.
I will be using JavaScript for both front-end and back-end, and LunrJS to index
and search through the text content.

In case you have not heard of LunrJS, it is a full-text search library that is
_a bit like Solr, but much smaller and not as bright_. A library that is
written in JavaScript for both client-side and server-side. LunrJS indexes
text-based content into a JSON document. The production bundle of LunrJS 8.2 KB
in size, which makes it a good fit on the front-end too.

Some of the Lunr alternatives are:
[js-search](https://github.com/bvaughn/js-search),
[flexsearch](https://github.com/nextapps-de/flexsearch),
[fuse](https://github.com/krisk/Fuse), [wade](https://github.com/kbrsh/wade).

## Flow

To integrate search functionality into a website, we need some data. We will be
searching for specific information from this data lake (well, quite a small
lake for now). To store data, we can use any of the available databases
depending on the project's needs. For this demonstration, I am using MongoDB
(via Mongoose ORM).

Here's how to initialize a database connection using Mongoose in a serveless
environment:

```typescript
import mongoose from "mongoose";

let mongoDBConn: mongoose.Connection | null = null;
const connectionStr = process.env.DATABASE_URI;

if (typeof connectionStr !== `string`) {
  throw new Error(`database uri: not a string`);
  process.exit(1);
}

if (!mongoDBConn) {
  mongoose
    .connect(connectionStr)
    .then((m) => (mongoDBConn = m.connection))
    .catch(console.error);
}
```

You may notice an unusual way of initializing the database connection object. I
am caching it inside a variable. This way, the subsequent serverless invocation
will be able to reuse it.

```typescript
function getBlogSchema() {
  const BlogCollection = new mongoose.Schema({
    title: { type: String, required: true, unique: true },
    // rest of the document fields
  });

  BlogCollection.index({ url: 1, title: 1, description: 1 });

  const model = mongoose.model(`Blog`, BlogCollection);
  model.syncIndexes();
  return model;
}

export const blogModel = mongoose.models.Blog
  ? mongoose.models.Blog
  : getBlogSchema();
```

Again, another non-conventional way of creating a database model, all thanks to
serverless. Since we cached the database into a variable, we should check if
the model exists in the cache. We can't recreate a model in Mongoose. Trying to
do so will throw an error.

Moving on, we have to install the package `lunr` by running `yarn add lunr`.
Once done, it is time to setup `lunr`. Let's start with the `import`s.

```typescript
import fs from "fs";
import lunr from "lunr";
import { blogModal } from "./path/to/blogModel";
```

Then, I am going to write a few helper functions. These functions will help us execute the search systematically.

- `buildSearchIndex`: As the name suggests, this function will build a search
  index. A search index is a collection of data stored in a disk or inside the
  memory. This collection is parsed and stored in a way so that querying it
  becomes easier and more efficient.

  ```typescript
  export async function buildSearchIndex(): Promise<lunr.Index> {
    try {
      const docs = await blogModel?.find();
      const index = lunr((builder) => {
        builder.ref(`_id`);

        builder.field(`title`);
        // additional fields if any

        for (let i = 0; i < docs.length; i++) {
          const d = docs[i];
          builder.add(d);
        }
      });

      return index;
    } catch (err) {
      console.log(err);
      throw err;
    }
  }
  ```

  Let's understand what is going on. First, we are calling the `lunr` function,
  which accepts a callback. The first parameter of the callback is an object
  called `builder` (passed automatically by `lunr`).

  `builder.ref` method is used to reference the original document. Assign a
  unique field to it. `_id`, for example.

  `builder.field` method tells the `builder` what field to index. Add all the
  fields you want to search in.

  Finally, we are adding documents to the index by calling `builder.add` method
  inside a `for` loop.

- `saveSearchIndex`: This function saves a given search index to the file
  system. When the data lake size increase, it is no longer efficient to create
  an index on every API call. In such cases, `lunr` could load a pre-created
  index from the disk.

  ```typescript
  export function saveSearchIndex(index: lunr.Index) {
    try {
      fs.writeFileSync(INDEX_PATH, JSON.stringify(index, null, 2), {
        encoding: "utf-8",
      });
    } catch (err) {
      console.log(err);
    }
  }
  ```

- `loadSearchIndex`: This function loads an index to the memory so that `lunr`
  could perform operatons on it.

  ```typescript
  export function loadSearchIndex(): lunr.Index {
    try {
      const content = fs.readFileSync(INDEX_PATH, {
        encoding: `utf-8`,
      });

      return lunr.Index.load(JSON.parse(content));
    } catch (err) {
      console.log(err);
      throw err;
    }
  }
  ```

- `deleteSearchIndex` and `hasSearchIndex`: These functions are used to delete
  an existing search index from disk, and to check whether a given index
  exists.

  ```typescript
  export function deleteSearchIndexFile() {
    return fs.unlinkSync(INDEX_PATH);
  }

  export function hasSearchIndex() {
    return fs.existsSync(INDEX_PATH);
  }
  ```

Now that we have all the helper functions ready, we could start implementing
the feature. Inside the API endpoint file, we are going to initialize the
`lunr` index.

A point worth noting, we have to update the index after a certain period.
Otherwise, the index will not have all the data from the database.

```typescript
let searchIndex: lunr.Index;
let indexBuiltAt: Date;
const TEN_MIN_IN_MILI = 600000;
```

In the above code snippet, I declared a few variables. Variable `indexBuiltAt`
stores the most recent build timestamp. Based on this timestamp, I will be
updating the index.

```typescript
function createSearchIndex() {
  buildSearchIndex()
    .then((index) => {
      searchIndex = index;
      saveSearchIndex(index);
      indexBuiltAt = new Date();
    })
    .catch(console.log);
}
```

The above function creates a search index and stores them in the variables
declared earlier.

Finally, it's time to glue everything together and make it a working
solution.

Following code-block is pretty much explains itself. I used `setImmediate` so
that it does not block the main event loop.

```typescript
setImmediate(() => {
  if (hasSearchIndex()) {
    searchIndex = loadSearchIndex();
  } else {
    createSearchIndex();
  }

  setInterval(() => {
    // reload search index at every 10 mins
    if (
      indexBuiltAt &&
      indexBuiltAt?.getTime() + TEN_MIN_IN_MILI < new Date().getTime()
    ) {
      if (hasSearchIndex()) {
        searchIndex = loadSearchIndex();
      } else {
        createSearchIndex();
      }
    }
  }, 30 * 1000);
});
```

At this point, everything is done. And we are ready to run queries on this index. To run a query using `lunr`, we have to call the `search` method.

```typescript
const ids = [];
const result = searchIndex.search(`*${search.split(` `).join(`*`)}*`);

for (let i = 0; i < result.length; i++) {
  const doc = result[i];
  mongoose.isValidObjectId(doc.ref) && ids.push(doc.ref);
}
```

I am collecting all the matching `id`s into an Array. Using these `id`s, I will
retrieve the actual documents, and send them as the API response.

## Conclusion

This set-up is ideal if your product is relatively small (and do not have a
huge amount of data to run the operations upon). I have used the same setup in
[one of the projects I built](https://github.com/abdus/awesome-websites/).This
can be improved a lot. For instance, you could build the search index every
time there is a new entry in the database.

For more information on `lunr`, please check the [official
website](https://lunrjs.com/). It has many other [useful
things](https://lunrjs.com/docs/lunr.Query.html) built-in.
