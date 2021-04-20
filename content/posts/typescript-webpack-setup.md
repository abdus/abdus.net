---
title: "TypeScript Webpack Setup (with CSS Modules)"
date: 2021-01-31T17:40:26+05:30
draft: false
meta:
  image: https://mugshotbot.com/m/WQPOjyvQ
  description: A minimal set-up for TypeScript with Webpack as Module Bundler.
tags: []
categories: []
sources:
  - https://github.com/abdus/webpack-typescript-starter
  - https://academy.zerotomastery.io/courses/700470
---

It has not been many days since I started to choose TypeScript instead of
JavaScript. It's an interesting language(or a superset, as many of us
would like to call) which adds so much awesomeness to Vanilla JavaScript. The
most notable feature it adds to JavaScript is the TypeSafe programming.

> Type-safe programming simply means that a programmer is less likely to write
> code which would produce a type-error. Type safety is the core feature of a
> Statically typed language.

How TypeScript makes JavaScript a type-safe language? Well, it does not.
Because when the TypeScript code is compiled, there is no way the JavaScript
engine running the compiled code, would prevent type errors. Then what's so
special about it? In short, TypeScript makes the development process easier and
less tedious.

## TypeScript Resources

Since the primary intention for this post is to provide an step-by-step guide on
how to set-up a TypeScript project with Webpack, I would not add 'How to code in
TypeScript' kind of thing here.

However, if you are curious about learning TypeScript, following are some of the
good Resources (also available in my [resources](#) repository):

- [Interface vs Type alias in TypeScript ...](https://medium.com/@martin_hotell/interface-vs-type-alias-in-typescript-2-7-2a8f1777af4c)
- [TypeScript: Interfaces vs Types](https://stackoverflow.com/questions/37233735/typescript-interfaces-vs-types)
- [Type Assertion](https://basarat.gitbook.io/typescript/type-system/type-assertion)

## Setting Up the Project

To set-up a TypeScript project with webpack correctly, you should first
understand how would everything work all-togather.

If you have manually wrote a webpack configuration before, you would know that
webpack simply takes input(for example: SASS, JavaScript etc) and puts them into
a single file(or multiple, in some cases).

To answer the question 'Why we even need such overhead for a front-end project',
not all browser supports module yet. Plus there are other features like Tree
Shaking(fency term for removing dead codes), code-splitting, dependency
management etc which comes handy with a bundler like webpack.

To bundle TypeScript source files using Webpack, all we need to do is add a
[loader](https://webpack.js.org/loaders/) which will handle TypeScript-specific
files.

There are two ways to achieve this.

### `ts-loader`

`ts-loader` is a [webpack loader](https://webpack.js.org/loaders/) which will
compile TypeScript to regular JavaScript. Note that, `ts-loader` depends on
[`typescript`](https://npmjs.com/typescript) to compile code using
`tsconfig.json`. So, it's pretty much obvious that we must add `typescript` as a
dependency to the `package.json` file.

If you are using `ts-loader`, relevent configuration from `webpack.config.ts`
would look something like this:

```js
module.exports = {
  ....

  module: {
    rules: [
      {
        test: /\.tsx?$/, // select file ending with .ts or .tsx
        use: 'ts-loader', // use ts-loader to handle TypeScript files
        exclude: /node_modules/, // don't do anything for node_modules
      }
    ]
  }

  ....
}
```

That's pretty much it. No other configuration required for TypeScript.

### `@babel/preset-typescript`

[`@babel/preset-typescript`](https://babeljs.io/docs/en/babel-preset-typescript)
is a collection of plugins to handle TypeScript files. As of now, this preset
contains only one plug-in called [`@babel/plugin-transform-typescript`](https://babeljs.io/docs/en/babel-plugin-transform-typescript)

If you are planning to follow this approach (and I will definately recommend
this approach), you should have a `.babelrc` file at project-root (same as wher
you have `webpack.config.ts` file).

```json
{
  "presets": ["@babel/preset-typescript"]
}
```

Install `babel-loader` for webpack. And ask webpack to use `babel-loader` to
handle TypeScript files. We are done.

## `tsconfig.json`

Please refer to official TypeScript [documentation](https://www.typescriptlang.org/docs/handbook/tsconfig-json.html) to learn about the
configurations. A minimal configuration file may look like this:

```json5
// this is a default tsconfig I use in all of my projects. feel free to modify
// it as you want.
{
  {
  "compilerOptions": {
    "module": "CommonJS",
    "noImplicitAny": true,
    "removeComments": true,
    "preserveConstEnums": true,
    "sourceMap": true
  },
  "exclude": ["node_modules"]
}

}
```

## Adding Types Definition to the Project

When writing webpack configuration file(s) in TypeScript, you may encounter
errors. Don't worry about them. They are easy to ger rid of. Just install
appropriate type definitions from [`@types`](https://github.com/DefinitelyTyped/DefinitelyTyped).

For example, to get rid of webpack configuration error, install `@types/webpack` using Yarn.

<!--## Webpack Config-->

<!--[Webpack documention](https://webpack.js.org/configuration/) on writing config file is an excellent resource.-->
<!--If you have gone through it, you don't need to refer anything else.-->

<!--Anyways, I will try to write short explanations of the configuration properties-->
<!--I have used. Keep reading :)-->

## Step by Step Guide

Initialize `package.json`. You can use either `yarn` or `npm`. I would suggest
you to use `yarn`, as it's faster. But it's upto you what you use...for sure.

To initialize, simply run `yarn init`(or `npm init`) to create `package.json`.
This will hold information about the project. For exapmple, dependencies etc.
Optionally, you can pass `--yes`, which will choose default value for every
question asked by either tools.

Create webpack configuration file, `webpack.config.ts`. Note that, I am going to
write it in TypeScript. You may choose to write in plain JavaScript. It does not
matter.

We need to import `path` module from Node.js as we have to provide valid and
correct pathnames to configuration options. We also need to install couple of
other dependencies. Following is a list of what we will need.

**Primary Packages:**

- `webpack`: Bundles source files
- `webpack-cli`: Provides command line interface for webpack
- `webpack-dev-server`: Runs a development server for live-reloading changes we
  make in our project.
- `html-webpack-plugin`: Injects webpack bundles(scripts, stylesheets etc) into
  HTML file.
- `css-loader`: Handles CSS files
- `mini-css-extract-plugin`: CSS modules are awesome! This will parse and
  extract CSS into a cachable file. You can you `style-loader` if you prefer
  to embed styles using `<style>` tag.
- `typescript`: compiles TypeScript into JavaScript. Also compiles webpack
  configuration file.
- `ts-node`: for running webpack config file
- `ts-loader`: For handling TypeScript files

**Types:**

Following packages provides type definitions for TypeScript. We need these
packages beause some of the libraries does not provide official type definitions
yet.

- `@types/webpack`
- `@types/webpack-dev-server`
- `@types/mini-css-extract-plugin`

Note that these packages should be installed as `devDependencies`. No problem if
you wish to keep them as `dependencies`. Just a convention.

Install all of them using `yarn`:

```sh
yarn add --dev webpack webpack-dev-server html-webpack-plugin
mini-css-extract-plugin css-loader ts-loader typescript  @types/webpack
@types/webpack-dev-server @types/mini-css-extract-plugin
```

And copy the following `webpack.config.ts` file. Configuration options are
pretty much self-explanatory. You can always [look up for explanation](https://webpack.js.org/configuration/)

```ts
import * as path from "path";
import * as webpack from "webpack";
import * as HtmlWebpackPlugin from "html-webpack-plugin";
import * as MiniCssExtract from "mini-css-extract-plugin";

const config: webpack.Configuration = {
  mode: process.env.NODE_ENV === "prod" ? "production" : "development",
  entry: path.resolve(__dirname, "src/index.ts"),
  output: {
    path: path.resolve("build"),
    filename: "[name].[contenthash].js",
  },

  // plugins
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, "public/index.html"),
    }),
    new MiniCssExtract(),
  ],

  // modules and loaders
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: ["ts-loader"],
      },

      {
        test: /\.css$/,
        use: [MiniCssExtract.loader, "css-loader"],
      },
    ],
  },

  // dev server config
  devServer: {
    port: 3000,
    contentBase: path.resolve(__dirname, "build"),
    compress: true,
  },
};

export default config;
```

At this point, Webpack configuration is done. Whatever webpack bundles, will be
placed inside `build/` directory. You can safely `.gitignore` this directory.

To make development process easier, you may add npm scripts in `package.json`.
Following are two example scripts:

```json
{
  ...
  "scripts": {
    "start": "webpack s",
    "build": "rimraf build && webpack"
  }
  ...
}
```

Note that in `build` script I have added `rimraf`. This is a package provides
functionalities of `rm` command. You can simply install it using `yarn add --dev rimraf`.
Purpose of using it, is to remove `build/` directory to get a fresh
build of the source code everytime we run `webpack`.

## Troubleshooting

```
TS2307: Cannot find module '*.css' or its corresponding type declarations.
```

This occurs because TypeScript have no idea how to handle imported CSS. To get
rid of this, create a file called `declaration.d.ts` in project root and put
following code.

```ts
declare module "*.css" {
  const content: Record<string, string>;
  export default content;
}
```

## With Babel

Pretty simple. Instead of loading TypeScript file with `ts-loader`, use
`babel-loader`. You can use `@babel/preset-typescript` for a ready-made
configuration.

## Conclusion

I put up a repository on GitHub which contains the code I have demonstrated in
this post. Repository is available at [https://github.com/abdus/webpack-typescript-starter](https://github.com/abdus/webpack-typescript-starter)

Thank you!
