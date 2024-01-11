/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 ~ Copyright 2020 Adobe Systems Incorporated
 ~
 ~ Licensed under the Apache License, Version 2.0 (the "License");
 ~ you may not use this file except in compliance with the License.
 ~ You may obtain a copy of the License at
 ~
 ~     http://www.apache.org/licenses/LICENSE-2.0
 ~
 ~ Unless required by applicable law or agreed to in writing, software
 ~ distributed under the License is distributed on an "AS IS" BASIS,
 ~ WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 ~ See the License for the specific language governing permissions and
 ~ limitations under the License.
 ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/

const path = require('path');

const BUILD_DIR = path.join(__dirname, 'dist');
const CLIENTLIB_DIR = path.join(
  __dirname,
  '..',
  'ui.apps',
  'src',
  'main',
  'content',
  'jcr_root',
  'apps',
  'dhl',
  'clientlibs',
);

const libsBaseConfig = {
  allowProxy: true,
  serializationFormat: 'xml',
  cssProcessor: ['default:none', 'min:none'],
  jsProcessor: ['default:none', 'min:none']
};

// Config for `aem-clientlib-generator`
module.exports = {
  context: BUILD_DIR,
  clientLibRoot: CLIENTLIB_DIR,
  libs: [
    {
      ...libsBaseConfig,
      name: 'discover-react-core',
      categories: ['dhl.react-core'],
      assets: {
        js: ['dependencies/js/react-core.bundle.js'],
      }
    },
   {
     ...libsBaseConfig,
     name: 'discover-react-common',
     categories: ['dhl.site', 'dhl.react-common'],
     embed: ['dhl.react-core', 'dhl.search-bar'],
     assets: {
         js: [],
         css: [],
         resources: ['site/resources/common/images/*.svg']
     }
   },
    {
      ...libsBaseConfig,
      name: 'discover-category-page',
      categories: ['dhl.category-page'],
      embed: ['dhl.article-grid'],
      dependencies: ['dhl.react-common'],
      assets: {
          js: [],
          css: []
        }
    },
    {
      ...libsBaseConfig,
      name: 'discover-search-result-page',
      categories: ['dhl.search-result-page'],
      embed: ['dhl.search'],
      dependencies: ['dhl.react-common'],
      assets: {
          js: [],
          css: []
        }
    },
    {
      ...libsBaseConfig,
      name: 'discover-article-grid',
      categories: ['dhl.article-grid'],
      dependencies: ['dhl.react-common'], 
      assets: {
        js: ['site/js/ArticleGrid.bundle.js'],
        css: ['site/css/ArticleGrid.bundle.css']
      }
    },
   {
     ...libsBaseConfig,
     name: 'discover-search-bar',
     categories: ['dhl.search-bar'],
     assets: {
       js: ['site/js/SearchBar.bundle.js'],
       css: ['site/css/SearchBar.bundle.css']
     }
   },
   {
    ...libsBaseConfig,
    name: 'discover-search',
    categories: ['dhl.search'],
    dependencies: ['dhl.react-common'], 
    assets: {
      js: ['site/js/Search.bundle.js'],
      css: ['site/css/Search.bundle.css']
    }
  }
  ]
};
