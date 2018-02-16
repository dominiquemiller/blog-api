# Blog API 

I've been wanting to create my own blog for quite some time and I also wanted to build something
using typescript and node, so here we are!  One requirement was I wanted the flexibility to 
use any front-end framework so building an API was the logical choice! I also want the API 
to be extendable via plugins.

Should you want to fork or contribute to this project please feel free.  

To get started:
  Make sure you have npm, node and typescript installed on your machine.
  From your terminal run 
  ```
  npm install or yarn install
  ```
To run the test suite:
```
npm run test
```
To run the development server:
```
// watches for changes in the dist folder
npm run watch-node
// watches for changes in typescript files located in the src dir
npm run watch-ts
```

To build the api:

Compiles the typescript files to dist folder and runs tslint
```
npm run build
```
