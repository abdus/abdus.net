---
title: "Uploading a Large File to a Node Server: A Gentle Introduction"
date: 2022-09-26T14:04:50+05:30
draft: false
meta:
  image: https://i.ibb.co/p03J6GH/banner.jpg
  description: >-
    In this article, I'm going to discuss how to upload very large files (>1GB) 
    to a server using Node.js. This is a step-by-step guide to upload files to 
    a server.
tags: [file upload, nodejs, express, multer]
categories: [full-stack]
---

If you'd like to upload large files to a server, but each file is too large to
upload as one huge chunk of data. This blog is going to show you how to split
your file into smaller chunks and upload them in parallel using Node.js,
Express and Multer.

🚀 If you wish to see the code directly, visit this [GitHub
repository](https://github.com/abdus/large-file-upload/tree/main/). It
is a simple Express code-base, with self-explanatory code. Otherwise, keep
reading. I will explain everything in detail.

## Project Set-up

Let us start by creating a project. I will go with Express as this is a simple
project and does not do much other than just uploading a file! In a
production-grade project, I would choose Fastify.

For the front-end, it's all just HTML and JavaScript.

Create a new directory called `file-upload`. Initialize a Node project inside
it. After that, install `express`, `multer` and `mime-types` (to get file
extensions based on the file MIME Type)

```bash
mkdir file-upload
cd file-upload

yarn init --yes # choose the default answer for questions
yarn add express multer mime-types
```

### Initialize the Server

Since this is an Express project, we need to write some code to make sure our
server runs. Let's start by importing `express` and `multer` into the scope.

```javascript
import fs from "fs"; // FS IO Operations
import path from "path"; // makes it easy to work with paths
import multer from "multer"; // handles multipart file upload
import express from "express"; // the HTTP server
import mimeTypes from "mime-types"; // returns extension based on a mime-type
```

Now, let's set up `multer` with `express`. `multer` is a great library to handle file uploads through a HTML5 Form encoded in `multipart` format.

```javascript
const server = express(); // the server
const upload = multer({ dest: "upload/" }); // multer middleware to be used in express routes

server.use(express.json({ limit: "100mb" })); // parse JSON Content-Type
server.use(express.urlencoded({ limit: "100mb", extended: true })); // parse x-www-url-encoded Content-Type

server.use("/", express.static(path.resolve("static"))); // our client-side code lives inside `static` directory
```

## Splitting Files

That's enough of back-end code for now. Let's see how we are going to split a
user-uploaded file the on client-side.

To accept a file from the browser, I am going to use an `input` field inside a
`form` element (so that I could take advantage of the `submit` event).

Once a file is selected, and the user submits the form, a function called
`chunkify` is executed. This function does all the heavy lifting of splitting
the file into multiple chunks.

The `Blob.slice` method helps us split a `File` into multiple chunks of
arbitrary size. `File` extends `Blob`, so we can use `Blob`'s method without
any issues.

```javascript
function chunkify(file) {
  const chunks = []; // array to store chunks (in order)
  const chunkSize = ONE_BYTE * 1024; // size of a chunk in bytes. Here, 1KB

  let start = 0;
  let end = chunkSize;

  while (start <= file.size) {
    chunks.push(file.slice(start, end, file.type));

    start = end;
    end += chunkSize + end + 1; // slice reads end - 1 position
  }

  return chunks;
}
```

You might be thinking about that `+ 1` byte in `end += chunkSize + end + 1`.
That is because, when slicing, the `slice` method reads `end - 1` byte. It's
explained on
[MDN](https://developer.mozilla.org/en-US/docs/Web/API/Blob/slice#parameters)

Okay. So, `chunkify` will return an array of `Blob`. Now, we could simply send
this `Blob`s to our server using `fetch` API and `FormData`.

```javascript
chunks.forEach(async (chunk, i) => {
  const formData = new FormData();

  formData.append("file", chunk);
  formData.append("fileName", i);
  formData.append("mimeType", chunk.type);

  const raw = await fetch("/api/upload", {
    body: formData,
    method: "POST",
  });

  const json = await raw.json();
  console.log(json);
});
```

## Grouping File Chunks

As of now, the server has no way to know how to group those chunks and merge
into a single file. For that, we have to group these chunks somehow.

Going with the easiest way (which may not be an optimal solution), we will give
a unique identifier to each group, and add that identifier to each chunk.

To generate a UUID in the browser, we could use `crypto.randomUUID()`. Here's
how this will work:

```javascript {hl_lines=[1,7]}
const groupId = crypto.randomUUID();

chunks.forEach(async (chunk, i) => {
  const formData = new FormData();

  // ... other file attributes
  formData.append("fileId", groupId); // this will do the trick

  const raw = await fetch("/api/upload", {
    // req options
  });
});
```

We also need to let the server know the number of chunks a group will have. For
that, we could add another field to the `FormData` object.

```javascript
formData.append("chunkCount", chunks.length);
```

That's it. Now, time to handle these file chunks on the server.

## Handling Files on Server

For Multer to save a file in the specified `storage` destination, we need to call a middleware, `upload.single("name of the field")`.

```javascript {hl_lines=[1]}
server.post("/api/upload", upload.single("file"), (req, res) => {
  try {
    // handle file-upload request
  } catch (err) {
    console.log(err);
    res
      .status(500)
      .json({ msg: "something went wrong", data: err.stack || err.message });
  }
});
```

Based on the fields passed into `FormData`, we can determine the file group
along with the type of file. We will create a directory using the file group identifier, and move all the chunks into that group.

```javascript
const fileId = req.body.fileId;
const uploadedFileName = req.file.path; // get the chunk location (uploaded by multer)
const destDir = path.join("upload", fileId); // chunk storage location

if (!fs.existsSync(destDir)) fs.mkdirSync(destDir, { recursive: true });
if (fs.statSync(destDir).isFile()) {
  fs.unlinkSync(destDir);
  fs.mkdirSync(destDir, { recursive: true });
}

const mimetype = req.body.mimeType; // based on this value, we will get file extension
const fileName = path.join(destDir, req.body.fileName); chunk file-path
const fileExtension = mimeTypes.extension(mimetype);

// move file to the specified folder so that we could merge chunks
// into a single file later
fs.renameSync(uploadedFileName, fileName);
```

Now that we have uploaded all the chunks to the server, it's time to merge them
into a single file. I have written a function for that.

```javascript
function mergeFile(dest, extName) {
  // merge needs to be done in order
  const files = fs
    .readdirSync(dest)
    .sort((a, b) => (parseInt(a) > parseInt(b) ? 1 : -1));

  for (let i = 0; i < files.length; i++) {
    const chunkPath = path.join(dest, files[i]);
    const chunkContent = fs.readFileSync(chunkPath);

    fs.appendFileSync(path.join(dest, "merged." + extName), chunkContent); // merging...
    fs.unlinkSync(chunkPath); // delete the chunk. save storage
  }

  // finally return the merged file location
  return path.resolve(path.join(dest, "merged." + extName));
}
```

This function accepts two arguments: `dest` and `extName`. `dest` is where the
chunk group is located. `extName` is the merged file extension.

We have to figure out one more thing: when should this file merge happen? One
way is to compare the total number of chunks sent from the client and received on
the server. Remember, we were sending the `chunkCount` from the client-side?
Time to use it!

I am going to check if the server has all chunks. If so, I will merge.
Otherwise, I will wait for the rest of the chunks to arrive at the server.

```javascript {hl_lines=[5]}
const chunksRcvd = fs.readdirSync(destDir).length;
const totalChunkCount = parseInt(req.body.chunkCount);

if (chunksRcvd === totalChunkCount) {
  const mergedFilePath = mergeFile(destDir, fileExtension);
  return res.json({
    msg: "success. merged into single file",
    data: mergedFilePath,
  });
}

return res.json({ msg: "success. awaiting merge", data: null });
```

That's it. We are done!

## Conclusion

This approach will benefit you in multiple ways, including:

1. Lesser memory usage. Since, we are not loading the entire file in the RAM,
   there will be a very small memory footprint.
2. Faster upload time. Chunks will be uploaded in parallel.
3. Bypassing web-server restrictions. Web servers, such as Nginx, impose a limit
   on the HTTP request size.
4. There may not be lots of performance gain (as heavy IO operations will be
   performed). But compared to processing a large file, there are performance
   gains.

> Note that we have not utilised all cores of the server. Doing so will boost
> performance.

I know that this is probably not the optimal solution you were expecting. I
will leave that up to you to modify it according to your needs.
