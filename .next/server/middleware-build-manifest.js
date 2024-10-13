self.__BUILD_MANIFEST = {
  "polyfillFiles": [
    "static/chunks/polyfills.js"
  ],
  "devFiles": [
    "static/chunks/react-refresh.js"
  ],
  "ampDevFiles": [],
  "lowPriorityFiles": [],
  "rootMainFiles": [],
  "pages": {
    "/_app": [
      "static/chunks/webpack.js",
      "static/chunks/main.js",
      "static/chunks/pages/_app.js"
    ],
    "/_error": [
      "static/chunks/webpack.js",
      "static/chunks/main.js",
      "static/chunks/pages/_error.js"
    ],
    "/create-listing": [
      "static/chunks/webpack.js",
      "static/chunks/main.js",
      "static/chunks/pages/create-listing.js"
    ],
    "/listing/[id]": [
      "static/chunks/webpack.js",
      "static/chunks/main.js",
      "static/chunks/pages/listing/[id].js"
    ],
    "/listings": [
      "static/chunks/webpack.js",
      "static/chunks/main.js",
      "static/chunks/pages/listings.js"
    ],
    "/login": [
      "static/chunks/webpack.js",
      "static/chunks/main.js",
      "static/chunks/pages/login.js"
    ],
    "/publisher": [
      "static/chunks/webpack.js",
      "static/chunks/main.js",
      "static/chunks/pages/publisher.js"
    ],
    "/responses": [
      "static/chunks/webpack.js",
      "static/chunks/main.js",
      "static/chunks/pages/responses.js"
    ]
  },
  "ampFirstPages": []
};
self.__BUILD_MANIFEST.lowPriorityFiles = [
"/static/" + process.env.__NEXT_BUILD_ID + "/_buildManifest.js",
,"/static/" + process.env.__NEXT_BUILD_ID + "/_ssgManifest.js",

];