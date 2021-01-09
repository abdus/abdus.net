---
title: "Server Side React"
date: 2020-12-07T14:47:54+05:30
draft: true
meta:
  image: # url to image. Important for blog listing and seo
  description: # overrides .Summary
tags: []
categories: []
---

<!--
  - assume that the app would be server from a single server
  IDEAS
  ======================
  1. Add a FAQ section at bottom
-->

I have been using React since a while now. By far, my focus was mostly on
client-side rendered applications bootstrapped using [Create React App](#TODO).
I, however, have got my hands dirty at times and [set-up React-based projects
from scratch](https://github.com/abdus/react-chrome-ext).

Before I go further, let me tell you when I think one should use server-side
rendered applications. And when to absolutely avoide it.

1. **SEO is Important**: Honestly, this is the only case I think one should
   choose to render React on server. That's because, Search Engine crawlers
   can't crawl React yet. A fully functional React app would appear as a blank
   page to Google Bot. Meaning, Google would have no data to index.
2. **Low-end Devices**: If most of your target devices are low-end and struggles
   to execute huge JavaScript bundles, server-side rendering is probably
   best-suited.

One of the major benefits of rendering React on Server is that the server sends
back **Static HTML** and **CSS** back to client. This improves the [largest
contentful paint](https://web.dev/largest-contentful-paint/) duration,
ultimately resulting in a better User Experience.

**But**, this benefit can be proved as fatal if the end-user got a slow internet
connection. To understand why this can be fatal, we first understand how
server-side rendering works. Keep on reading.

A webpage is called _server-side rendered_ if the HTML required to render it was
generated on the server. This is all-good for traditional server-side template
engines like [EJS](#TODO), [Handlebars](#TODO) etc.

But for a SPA library like React, things are not that simple. When SSRed, two
versions of the site would be generated. One, that is completely **static HTML**.
And another which is a **JavaScript bundle**.

You may ask, what is the need for generating a JavaScript bundle, when the
required HTML is already available? well, **User Interactions**. The generated HTML
would work as the way you expect it to work. And the JavaScript bundle would
create another layer by overwriting those static HTML to make the magic of React
available to User.

You may wonder, what if both of those versions hold different data that is
supposed to be rendered? That should not be the case, unless the initial app
state is passed to React in a wrong way. I will explain how to do it. Hang on.

## What are we building, again?

To demonstrate, I will build a **Quote Machine** using **React** and **Node**.
I will be building this project side-by-side as I write this blogpost, so that
I don't miss anything.

The **app flow** would be:

1. Fetch Quotes from an API on Server
2. Parse the Response
3. Generate HTML on Server
4. Send it Back to Client

How would you know if the page was generated on server? There are two ways I
know of:

- Right click on page and click "View Source" option(not Inspect)
- Publish your site on web and let Googlebot parse and render it for you to see
  how it looks like. (as of writing this, googlebot can't render React)

## Project Setup

To understand how to set-up the project, we need to know how things really work.
If you have set-up a React app from scratch before, you will probably know the
role of tools like [Webpack](#TODO) and [Babel](#TODO). If you don't know, let
me summarise it for you.

React is the library that handles the UI of a website. Generally, a React-based
project is written in ES6+. So chances are, a few of the browsers(_ahmmmm..IE_)
won't understand it. This is where **Babel** comes into play.

Babel converts ES6+ and JSX codes to a version that most of the
browsers(if not all) would understand.

**Webpack**? oh, it's just(!) a bundler. React makes it easier for us to group
components based on business logic. We need someting to aggregate them in a
single JavaScript file. Webpack does that.

Let us start by creating a `package.json` file. Before that, create a directory
for our little project to sit inside. Call it `quote-machine`

_BTW, I prefer Yarn over NPM as it is faster. You are free to choose whatever
you want._

```sh
cd quote-machine
yarn inti --yes # choose default value for all of the questions asked
```

Then, go on and create a directory called `src/`. This is where out app source
lives. You may divide this directory into further subdirectories as and when
rquirequired.

### Babel

Inside project root(i.e. `quote-machine`), create a file called `.babelrc`. This
file is responsible for hosting Babel configigurations. Fill it with following
configs:

```json
{
  "presets": ["@babel/preset-react", "@babel/preset-env"]
}
```

The `presets` array holds Babel plug-in. Following is the summary on what these
tools does:

- [`@babel/preset-react`](https://babeljs.io/docs/en/babel-preset-react):
  Transforms JSX tags to standard JavaScript. Check
  [this out to know](https://babeljs.io/en/repl) how it works.
- [`@babel/preset-env`](https://babeljs.io/docs/en/babel-preset-env):
  Transforms JavaScript to make it compatible with target environments using a
  standard set of rules. Also, adds polyfills.

Heads Up! We need to convert our server-side codes using Babel, as React will
be imported in server-side code as well.

Obviously, we need to install them as dependencies.

```sh
yarn add --dev @babel/preset-react @babel/preset-env
```

`@babel/core` is the root package which transforms the code using plugins
mentioned in `.babelrc`. So install it as well using:

```sh
yarn add --dev @babel/core
```

### Webpack

The primary responsiblity of Webpack is to package JavaScript and other files
into a single bundle.

But if browsers support [JavaScript Modules](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules),
why do we even need a bundler? Short Answer, because of NPM. During development,
lots of other packages get installed along with React. Node knows where to look
for an `import`ed package, but browser does not. So, we must bundle those
JavaScript files and serve them using a WebServer.

For Webpack to work correctly, it requires us to provide a configiguration file.
Create `webpack.config.js` in project root. Let's fill it with some really basic
configiguration.

`webpack.config.js` exports an object that contains all required
configigurations. There are four basic sections.

- **Entry:** Defines the entry point config
- **Output:** Location of the final bundle(s)
- **Modules:** Webpack, by default, can only bundle JavaScript. For other
  filetypes, there are modules. This section essentially tells Webpack which
  module to use while loading a particular filetype.
- **Plugins:** Webpack is extensible. It's functionalities can be extended by
  using different plugins. One such plugin is [`html-webpack-plugin`](https://webpack.js.org/plugins/html-webpack-plugin/)
  which optionally takes a template file as an input, injects JavaScript
  bundles using `script` tags and write it into `output` directory.

```javascript
// webpack.config.js
const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  entry: path.join("src/client/index.js"),

  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "[name].[contenthash].js",
  },

  plugins: [new HtmlWebpackPlugin({ template: "public/index.html" })],

  modules: {
    rules: [
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"], // load css files
      },
      {
        test: /\.jsx?$/,
        use: ["babel-loader"],
        exclude: /node_modules/,
      },
    ],
  },
};
```

You might have noticed that, instead of writing a file-name I used
`[name].[contenthash].js` as output file. This will make Webpack use hash
checksum of the content in filename. How it's benificial? Well, static files
should be cached at browser. No point in downloading same content over and over.
But when something changes in those files, the resultant hash value would also
change. Since browser will see this as a new file, it will download and cache
it.

Time to install `webpack` and related packages.

```shell
yarn add --dev webpack webpack-cli babel-loader style-loader css-loader
```

At this moment, we are almost done setting up the front-end. We just need to
create entry point for Webpack to works. And maybe populate those files with
some boilerplate code...

Create `src/index.js` and `public/index.html`. Fill these files with following
content.

```javascript
// src/client/index.js
import React from "react";
import ReactDOM from "react-dom";

function App(props) {
  // `props` will be helpful later on
  return <h1>Hello World</h1>;
}

ReactDOM.hydrate(<App />, document.querySelector("#react-root"));
```

Here, you can read more about [`hydrate`](https://reactjs.org/docs/react-dom.html#hydrate).

```html
<!-- public/index.html -->
<html>
  <head></head>
  <body>
    <div id="react-root"></div>
  </body>
</html>
```

Now that we have a `src/client/` directory, we could create as many components
we want and import them inside `src/client/index.js`
