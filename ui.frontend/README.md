# Frontend Build

## Installation

1. Install [NodeJS](https://nodejs.org/en/download/) (v16+), globally. This will also install `npm`.
2. Navigate to `ui.frontend` in your project and run `npm install`. (You must have run the archetype with `-DfrontendModule=general` to populate the ui.frontend folder)

## Usage

The following npm scripts drive the frontend workflow:

* `npm run dev` - Full build of client libraries with JS optimization disabled (tree shaking, etc) and source maps enabled and CSS optimization disabled.
* `npm run prod` - Full build of client libraries build with JS optimization enabled (tree shaking, etc), source maps disabled and CSS optimization enabled.
* `npm run start` - Starts a static webpack development server for local development with minimal dependencies on AEM.

The above inclusion can of course be modified by updating the Page Policy and/or modifying the categories and embed properties of respective client libraries.

### Static Webpack Development Server

Included in the ui.frontend module is a [webpack-dev-server](https://github.com/webpack/webpack-dev-server) that provides live reloading for rapid front-end development outside of AEM. The setup leverages the [html-webpack-plugin](https://github.com/jantimon/html-webpack-plugin) to automatically inject CSS and JS compiled from the ui.frontend module into a static HTML template.

#### Important files

* `ui.frontend/webpack.dev.js` - This contains the configuration for the webpack-dev-serve and points to the html template to use. It also contains a proxy configuration to an AEM instance running on `localhost:4502`.
* `ui.frontend/src/main/webpack/static/index.html` - This is the static HTML that the server will run against. This allows a developer to make CSS/JS changes and see them immediately reflected in the markup. It is assumed that the markup placed in this file accurately reflects generated markup by AEM components. Note* that markup in this file does **not** get automatically synced with AEM component markup. This file also contains references to client libraries stored in AEM, like Core Component CSS and Responsive Grid CSS. The webpack development server is set up to proxy these CSS/JS includes from a local running AEM instance based on the configuration found in `ui.frontend/webpack.dev.js`.

#### Using

1. From within the root of the project run the command `mvn -PautoInstallSinglePackage clean install` to install the entire project to an AEM instance running at `localhost:4502`
2. Navigate inside the `ui.frontend` folder.
3. Run the following command `npm run start` to start the webpack dev server. Once started it should open a browser (localhost:8080 or the next available port).
4. You can now modify CSS, JS, SCSS, and TS files and see the changes immediately reflected in the webpack dev server.
