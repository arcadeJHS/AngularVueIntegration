**==> Work in progress, stay tuned! <==**
----


# Migrating an Angular 1.x app to Vue
> Github repository: https://github.com/arcadeJHS/AngularVueIntegration.

Sometimes you have to say "stop!" and decide it's time to migrate to a warmer and sunnier place.

Chances are that you are quietly writing code to grow up and fix your shiny-happy-die-hard-godzilla app in Angular 1.x, day by day (with a certain amount of satisfaction, why not?).  
In the meantime, as Darwin would say (the man, not the OS), javascript species evolve over time. And, not so surprisingly, you wake up one day to discover that you and your creature are slowly fading to black ("I cannot stand this hell I feel..." you know).  
Reasons can vary: Angular 1.x will no longer be supported soon; you can indeed write a better javascript today; your application can improve in performance and maintainability... you name it.   
So no choiches here, actually, winter's coming: time to migrate.


Disclaimer
----
I will not share here the reasons why we choose Vue over alternative frameworks: that's not the scope of this writing. I do not want to suggest that Angular is the nuclear winter, and Vue a fresh breeze in a mild Tuscany vineyard.   
But things change.
And things can change really fast today at the battlefront of fronted development (loudly playing '70s Battlestar Galactica soundtrack here).

Furthermore, I do not claim to be an expert neither in Angular, nor in Vue (or in javascript, for all that it matters). In what follows I am just exposing what I found to be a possible solution to my specific problem.  
Maybe it could be helpful to someone else, or maybe someone will address me to a better solution. So here we are.


The Problem
----
We've got a huge legacy single-page app, five or six years worth of coding in Angular 1.x, whose layout may be schematically represented as in this picture: 

![simple-app][1]

Which, if we break it down into its constituents, mainly results composed of five components:

![simple-app-components][2]

1. A header, which contains a form to query for something.
2. A wrapper for a master-detail view.
3. A sidebar, which displays search results. 
4. A container to display the currently selected detail's info.
5. A sub-component, inside the previous one, to display additional data.

At this point our applications is simply organized according to the following directory structure:

```
code
    |_angularApp
    |   |_components
    |   |   |_detail.js
    |   |   |_innerDetail.js
    |   |   |_search.js
    |   |   |_searchResults.js
    |   |_services
    |   |   |_searchServices.js
    |   |_angularApp.js
    |   |_style.css
    |_vendor
    |   |_angular.min.js
    |_index.html
```

No webpack, transpilation or other module bundling helpers.  
See the codebase in the **`tag-01-angular-app`** tag of the associated repository.

Ideally you will migrate everything to Vue, but you cannot stop implementing new features while rejuvenating. No chances to unplug the app today to plug it in a year from now completely renewed (it could be dangerous or really time consuming). You have to maintain the legacy code, allowing the beasts to communicate, and migrate it progressively, step by step, with a little patience, as the poet would say:

> "Said, woman, take it slow  
> It'll work itself out fine  
> ll we need is just a little patience."
>
> <cite>(Guns N' Roses)</cite>

In the end, for reasons I will not expose here (related to an old architecture and refactoring decisions), what we are going to do, at least as a firs step, could be summarized as:

- keep the Angular app alive;
- completely rewrite in Vue the component number 2 (the master-detail wrapper) together with its children, components 3 and 4; but...
- recicle Angular child component number 5 (which is too big, too complex to be refactored for the time being).

What I am stating is that from an app completely written in Angular 1.x we are moving to this hybrid solution:

![ng-vue-components][3]

I know what you are thinking. But it happens. And (if you are like me) here the fun begins!


Requirements
----
We can hence list the main guidelines which will direct the migration:

1. **Support for Vue components inside an Angular app.**   
Aka: Vue components inside Angular components. This gives us the ability to replace Angular bricks with Vue bricks, avoiding our building to collapse.

2. **Support for Angular components inside Vue Components.**  
Aka: vue inside angular inside vue (doh!). Wait a minute: what? I know, it sounds really strange, but better to reign in Hell than serve in Heaven, right? Well, kind of. As we stated above, we still need to maintain something Angular inside the new Vue codebase. Simply no options here.

3. **Vuex store, seamlessly shared between Angular and Vue.**   
We will progressively introduce Vuex as the one source of truth to manage application state.

4. **vue-router**.  
We would like to introduce client side routing, to facilitate view switching.

5. **A module bundler.**   
We will make use of ES6+ javascript and modules, a CSS preprocessor, and will bundle our transpiled code to include it in the existing application. Webpack at rescue here.


So what?
----
A lot to do, so many things to understand and to fit into each other.

> "Me and my brother Vue here,  
> We was hitchhikin' down a long and lonesome road.  
> All of a sudden, there shined a shiny demon."
>
> <cite>(Tenacious D - kinda of)</cite>

[ngVue][4] enters here.

> "ngVue is an Angular module that allows you to develop/use Vue components in AngularJS applications."
>
> <cite>([ngVue repo][4])</cite>

Cool: I am a really bad swimmer, but at least a bridge exists. I can write a Vue component and include it into the existing Angular application. That's a good start.   
Angular, Vue, ngVue (and Webpack). The Three Musketeers! 


Enlightening the path
----
The Alien movie teaches us that the best way to generate a new creature is incubating it from the inside.  
To avoid side effects, I would like to preserve things as they are, as much as possible. I would like to isolate the source code I am going to add, and transpile it in a form I can use into the existing.   
So i create a nest for Vue in the form of a new folder, let's call it `vueApp`:

```
code
    |_vueApp
    |_angularApp
    |_vendor
    |_index.html
```

Ideally the `vueApp` folder will contain everything related to the migration: Vue code, Vue-Angular temporary hybrid code, Webpack and package.json configurations, node_modules, and the final "production ready dist" byproduct.  
Furthermore, I want to keep Vue and hybrid code separated, to be able to delete no more useful Angular code in the future. For a similar reason, I create a `DEV` folder also, which contains mockups or everything useful to webpack-dev-server only. Adding a bunch of styles assets we then finally come to a developmnet ready directory structure, which, in the end, will be similar to the following:

```
code
    |_vueApp
    |   |_dist
    |   |   |_css
    |   |   |_js
    |   |_node_modules
    |   |_src
    |   |   |_assets
    |   |   |   |_styles
    |   |   |_DEV
    |   |   |_vueCode
    |   |   |_ngVueBridgeCode
    |   |   |_index.html
    |   |   |_index.js
    |   |_.babelrc
    |   |_jest.conf.js
    |   |_package.json
    |   |_webpack.config.js
    |_angularApp
    |_vendor
    |_index.html
```

> **Please note:** here I will not initialize the Vue app through vue-cli. I am reusing a Webpack custom configuration which suites my needs. Nevertheless, everything should work the same way if you are using vue-cli.

See tag **`tag-02-app-directory-structure`** (with emtpy folders and files).


First things first
----
Let's start by "emulating" an Angular app to re-create an environment to make quick development iterations before injecting the code into the real app. For sure, this is a contrived example which delineates the way I dealt with my problem: as stated above, in the original Angular app I have got no support from Webpack (or other module bundlers), and ideally I do not want to modify in any way the existing codebase.   
By bootstrapping a dev environment with modern tools I can instead quickly write and test new Vue code and Angular-Vue interactions through webpack-dev-server.
Please refer to **`tag-03-bootstrapping-dev-angular-app`** for a detailed view of the Webpack config files and NPM dependencies (I am using Webpack 4 here).  

### Webpack config
Before we start, a few points to note.   
Let's begin with webpack.config.js file.

#### Dev and "library" mode 
```javascript
const buildAsALibrary = (env === 'production');

...

entryFile: buildAsALibrary ? 'index.js' : 'DEV/dev.index.js'

...

if (buildAsALibrary === false) {
    config.plugins.push(new HtmlWebpackPlugin({
        template: path.join(__dirname, settings.paths.source, 'index.html'),
        filename: path.join(__dirname, settings.paths.build, 'index.html'),
        inject: true,
        minify: minify ? {
            removeComments: true,
            collapseWhitespace: true,
            removeAttributeQuotes: true
        } : false
    }));
}
```
We will initially build our components inside the `DEV` folder, taking advantage of our testing environment. During development hence, the main entry file will be `DEV/dev.index.js`, and the generated javascript will be injected into `index.html` page.   
When will switch to the real production build, we will build the codebase as a javascript bundle to include in the existing Angular app, exactly as we would include a new library, and the main entrypoint will then be `index.js`.

#### The production build
```javascript
const settings = {
    paths: {
        source: './src'
    },
    entryFile: buildAsALibrary ? 'index.js' : 'DEV/dev.index.js'
};

... 

entry: {
    appVueLib: path.join(__dirname, settings.paths.source, settings.entryFile)
} 

...

optimization: {
    splitChunks: {
        chunks: 'all',
        maxInitialRequests: Infinity,
        minSize: 0,
        cacheGroups: {
            vendor: {
                test: /[\\/]node_modules[\\/]/,
                name: 'appVueLib_VendorsDependencies'
            },
            ngVueBridge: {
                test: /[\\/]src\/ngVueBridgeCode[\\/]/,
                name: 'appVueLib_NgVueBridge'
            },
        }
    }
}
```
Here we are in essence telling Webpack to generate three files in the final build:
- **appVueLib_VendorsDependencies.js**: a file to include all vendors dependencies (like, Angular, Vue...).
- **appVueLib_NgVueBridge.js**: a bundle which contains the "hybrid" code required to temporary integrate Angular and Vue. Virtually, once the migration is complete, this code could be completely removed, and the generated file simply will exist no more. We will work on this folder later.
- **appVueLib.js**: the "real porting", the new code completely written in Vue. 

Those are the files we will include into the existing old Angular app.

#### Angular as a global object
```javascript
if (env === 'production') {
    config.externals = {
        angular: 'angular'
    };
}
``` 
The old app already depends on Angular, which is included as an old script tag.  
Hence, to allow the new bundles to access things defined by other javascript on the page, avoid duplication in the build process, and duplication warnings at runtime, we take advantage of [Webpack externals][5]. The `angular` dependency will be present in the consumer's environment.   
Again, we will make use of it later on.

### package.json
In the package.json are listed all the NPM dependencies we will use now and later (like ngVue or vuex).   
The only thing to note here I will use ES6 to write angular code, so I will take advantage of the [babel-plugin-angularjs-annotate][6] to solve dependency injection. In ES6 code you will find the `/** @ngInject */` decorator.
From you terminal, go to the vueApp folder and run install:

```
cd code/vueApp/

npm install
```


A new beginning
----
All the pieces are now in place to begin the real work. Let's start from the `DEV` folder.  
Create an `AngularAppWrapper` to host our fake Angular app. At the end this will be the structure of the `DEV` folder:

```
DEV
    |_AngularAppWrapper
    |   |_index.html
    |   |_index.js
    |_dev.index.js
```

We will use ES6 to write the angular component (ES6 syntax could also facilitate a porting from old angular codebase to a complete rewriting in Vue):

**DEV/AngularAppWrapper/index.js**
```javascript
import template from './index.html';

export default {
    template: template,
    controller: class AngularAppWrapperController {
        /** @ngInject */
        constructor() {
            this.internalString = '';
        }

        $onInit() {
            this.internalString = 'Angular App Container Ready!';
        }
    }
};
```

whose template is so simple as:
```html
<div class="angular-app-container">{{$ctrl.internalString}}</div>
```

And let's use it into our development Angular app:  
 
**DEV/dev.index.js**
```javascript
// a bunch of useful imports
import '@babel/polyfill';
import '@/assets/styles/index.scss';
import angular from 'angular';
// import the wrapper component created above
import AngularAppWrapper from './angularAppWrapper/index.js';

// init an Angular app
angular.module('ngVueApp', []);
// set AngularAppWrapper as an Angular component
angular.module('ngVueApp').component('angularAppWrapper', AngularAppWrapper);

// set app template
const wrapperEl = document.querySelector('#ng-vue-app');
wrapperEl.insertAdjacentHTML('afterbegin', '<angular-app-wrapper></angular-app-wrapper>');

// manually bootstrap Angular app
angular.bootstrap(wrapperEl, ['ngVueApp'], { strictDi: true });
```

Now from you terminal launch  
```
npm run dev
```
Nice! A simple Angular app on which experiment with our migration.    
Again, refer to the **`tag-03-bootstrapping-dev-angular-app`** for everything done so far.


Enters ngVue
----
Let's now create and use our first Vue-inside-Angular component. To do that we will ask for help to ngVue (refer to the [official ngVue documentation][4] for more info).   
I will begin by defining a new Angular module to contain everything related to ngVue.

**ngVueBridgeCode/ngVueComponentsModule.js**
```javascript
import angular from 'angular';
import 'ngVue';
import 'ngVue/build/plugins.js';

const ngVueComponentsModule = angular.module('ngVueComponents', ['ngVue', 'ngVue.plugins']);

export default ngVueComponentsModule;
```
We are simply creating a new Angular module, using, as dependencies, 'ngVue' and 'ngVue.plugins' (we will use [ngVue plugins][7] later, with vuex, for instance). Basically, this will be the namespace to contain "angularized" Vue code.  
Ok, time to create our first Vue component.

Let's define a component for a simple app navigation. Note I am using the `vueCode` folder here, because I am writing a fresh component completely in Vue, to replace existing Angular code. Contrarily to `DEV` and `ngVueBridgeCode` folders, which will be eventually deleted, the `vueCode` one contains the real final migration.

**vueCode/components/VueAppContainer.vue**
```html
<template>
    <div class="vue-app-container">
        <nav>Navigation Container</nav>
        <main>Main Container</main>
    </div>
</template>

<script>
export default {
    name: 'VueAppContainer'
};
</script>
```

Now, if you simply include this new Vue component inside the AngularAppContainer it will be ignored.

**DEV/AngularAppContainer/index.html**
```html
<div class="angular-app-container">
    {{$ctrl.internalString}}
    <vue-app-container></vue-app-container>
</div>
```

You have to tell Angular to render this component through ngVue.   
Let's create a file to "transform" Vue component into Angular ones. With, `ngVueDirectives.js` we are telling Angular, through ngVue, that our Vue components exist. Again, `ngVueDirectives.js` is only a temporary bridge file, so we will put it inside `ngVueBridgeCode` folder.

**ngVueBridgeCode/ngVueDirectives.js**
```javascript
import Vue from 'vue';
import ngVueComponentsModule from '@/ngVueBridgeCode/ngVueComponentsModule';
import VueAppContainer from '@/vueCode/components/VueAppContainer';

ngVueComponentsModule.directive('vueAppContainer',
    /** @ngInject */
    createVueComponent => createVueComponent(Vue.component('vueAppContainer', VueAppContainer))
);
```

We are using ngVue's `createVueComponent` factory to translate a Vue component into an Angular directive.

As a first step, we inform the main angular module of the existence of our angularized-vue-components, so inside `dev.index.js` replace

```javascript
angular.module('ngVueApp', []);
```

with

```javascript
import '@/ngVueBridgeCode/ngVueDirectives';
import ngVueComponentsModule from '@/ngVueBridgeCode/ngVueComponentsModule';

angular.module('ngVueApp', [ngVueComponentsModule.name]);
```

et voilà: your first Vue component inside Angular!

![vue-component-inside-angular][8]

Basically, we have just fulfilled requirements #1 and #5: we can write new components in Vue, include them into the existing Angular application, and use modern development and bundling tools.   


Back to the real
----
> "Where we're going, we don't need roads."
>
><cite>(Dr. Emmett Brown, Back to the Future)</cite>

But, to say it all, we have to leave our safe development environment, take off, and use the new component inside the real application.   

Add to `index.js` the dependecies required:

**vueApp/src/index.js**
```javascript
import '@babel/polyfill';
import '@/assets/styles/index.scss';
import '@/ngVueBridgeCode/ngVueDirectives';
import ngVueComponentsModule from '@/ngVueBridgeCode/ngVueComponentsModule';
```

go to your terminal and run
```
npm run build
```

What you get is a `vueApp/dist` folder which contains the following files:
```
dist
    |_css
    |   |_appVueLib.css
    |_js
        |_appVueLib_NgVueBridge.js
        |_appVueLib_VendorsDependencies.js
        |_appVueLib.js
```

This is exactly the "lib" we were looking for to enhance our existing Angular application.   
In the main `index.html`, include those files and use the new Angular directive:

**code/index.html**
```html
<body>
    <div id="angular-app-container" ng-app="AngularApp">
        <header>
            <search></search>
        </header>
        <main>
            <search-results></search-results>
            <detail></detail>

            <!-- ngVue components -->
            <vue-app-container></vue-app-container>
        </main>
    </div>

    <script src="vendor/angular.min.js"></script>
    <script src="angularApp/angularApp.js"></script>
    <script src="angularApp/services/searchService.js"></script>
    <script src="angularApp/components/search.js"></script>
    <script src="angularApp/components/searchResults.js"></script>
    <script src="angularApp/components/innerDetail.js"></script>
    <script src="angularApp/components/detail.js"></script>

    <!-- ngVue components -->
    <link href="vueApp/dist/css/appVueLib.css" rel="stylesheet" type="text/css">
    <script src="vueApp/dist/js/appVueLib_VendorsDependencies.js"></script>
    <script src="vueApp/dist/js/appVueLib_NgVueBridge.js"></script>
    <script src="vueApp/dist/js/appVueLib.js"></script>
</body>
```

And do not forget to inform Angular a new module for Vue components exists:

**code/angularApp/angularApp.js**
```javascript
(function (app) {
    'use strict';
    angular.module('AngularApp', ['ngVueComponents']);
})();
```

Et voilà, it simply works:

![vue-component-inside-real-app][9]

As a reference, see **`tag-04-vue-component-inside-real-app`**.

If you are curious, yes, you can also pass props:

**code/index.html**
```html
<vue-app-container some-param="'Hello from Angular parent!'"></vue-app-container>
```

**code/vueApp/src/vueCode/components/VueAppContainer.vue**
```html
<template>
    <div class="vue-app-container">
        <nav>Navigation Container</nav>
        <main>Main Container</main>
        <span>{{someParam}}</span>
    </div>
</template>

<script>
export default {
    name: 'VueAppContainer',
    props: ['someParam']
};
</script>
```

> "You still don't understand what you're dealing with, do you? Perfect organism. Its structural perfection is matched only by its hostility."
>
><cite>(Ash, Alien)</cite>


A simple client routing: Vue global plugins
----
One of the reasons we started this journey was to replace the master-detail component in the Angular application. So far we have seen how easy is to use a Vue component inside Angular. Let's now introduce a little bit of client routing through the `vue-router` module. This will give us the opportunity to use the `$ngVue` factory from `ngVue.plugins`, and analyze how to define [root Vue instance properties][10].

Let's start by defining a simple router file.

**vueCode/router.js**
```javascript
import Vue from 'vue';
import Router from 'vue-router';
import Detail from './components/Detail/index.vue';

Vue.use(Router);

export const router = new Router({
    routes: [
        {
            path: '*',
            redirect: '/'
        },
        {
            path: '/:itemId?',
            name: 'detail',
            component: Detail
        }
    ]
});

```

`vueCode/components/Detail/index.vue` is a simple replacement for the existing detail view.

Then, in the container, empty the `main` tag and append a `router-view` component:

**vueCode/components/VuaAppContainer.vue**
```html
...

<main>
    <router-view></router-view>
</main>

...
```

Usually, in a Vue application, you would pass the store as a property to the root Vue instance. Something like:

```javascript
import store from './store';
new Vue({
    el: '#app',
    store,
    render: h => h('<div/>')
});
```

But here, in the context of Angular/ngVue this will not work. We have to use `$ngVueProvider` at the configuration phase of Angular module to inject the property.   
Again, I will configure it in the `ngVueComponentsModule`, because there lives everything related to ngVue.

**ngVueBridgeCode/ngVueComponentsModule.js**
```javascript
...
import { router } from '@/vueCode/router';

...
ngVueComponentsModule.config(($ngVueProvider) => {
    $ngVueProvider.setRootVueInstanceProps({ router: router });
});
```

`vue-router` is now enabled, and you can access it on any child component: we have just fulfilled requirement #4.

> What most people don't understand is that UFOs are on a cosmic tourist route. That's why they're always seen in Arizona, Scotland, and New Mexico. Another thing to consider is that all three of those destinations are good places to play golf. So there's possibly some connection between aliens and golf.
>
><cite>(Alice Cooper)</cite>


Sharing factories
----
Actually we still lack one piece: router links. To add them we will refactor our code a little bit. Even though we will soon replace it with something Vuex, refactoring routing give us the opportunity to rewrite the existing `searchService.js`, and transform it in something both Angular and Vue can consume (and this could be useful in many situations).   

Let's start by rewriting it in ES6 into the `ngVueBridgeCode/services`, to transform it into something "less Angular".

**ngVueBridgeCode/services/searchService.js**
```javascript
export class SearchService {
    /** @ngInject */
    constructor($timeout) {
        this.$timeout = $timeout;
        this.store = {
            searching: false,
            searchParam: '',
            searchResults: [],
            currentDetail: null
        };
    }

    executeQuery (searchParam) {
        return this.$timeout(function () {
            // mock data
            return [
                // mock data here
            ];
        }, 2000);
    }

    resolveQuery(results) {
        this.store.searchResults = results;
        this.store.searching = false;
    }

    selectItem (id) {
        this.store.currentDetail = this.store.searchResults.find(function (r) {
            return r.id === id;
        });
    }

    query (searchParam) {
        this.store.searching = true;
        this.store.searchParam = searchParam;
        this.store.searchResults = [];
        this.store.currentDetail = null;
        return this.executeQuery(searchParam).then(this.resolveQuery.bind(this));
    }
};
```

Our service is a plain javascript class. In the future we will simply import and use it as a ES module in Vue code. For now, we will share it on Angular and Vue instances thanx to [Angular's providers][11] and the [$injector service][12].  
An angular `service`registers a service constructor, invoked with `new`, to create the service instance. It should be used (guess what) when we define the service as a class.   
`$injector` is an Angular service used to retrieve object instances as defined by a provider. `$injector.get` returns the instance of the service.   
Exporting an instance of an Angular service allow then us to import and use it anywhere.

> "My dear, here we must run as fast as we can, just to stay in place. And if you wish to go anywhere you must run twice as fast as that."
>
><cite>(Alice in Wonderland)</cite>

Add this code to `ngVueComponentsModule.js`:

**ngVueBridgeCode/ngVueComponentsModule.js**
```javascript
import { SearchService } from '@/ngVueBridgeCode/services/searchService'; 
ngVueComponentsModule.service('searchService', SearchService);  // #1

export let searchService;
ngVueComponentsModule.run($injector => {
    searchService = $injector.get('searchService');             // #2
});
```
and we are done:
1. we have rewritten the service as a class (previous code snippet)
2. instantiated it as an Angular service (comment #1)
3. exported the instance through `searchService` (comment #2).

**A note**: to simplify a little bit, I deleted the `ngVueDirectives.js` file from `ngVueBridge` folder, and move the code there directly into `ngVueComponentsModule` (remove also the import inside `vueApp/src/index.js` e `vueApp/src/DEV/dev.index.js`). Refer to the codebase in **`tag-05-vue-globals`**.

Thanx to point 2 above you can safely delete `angularApp/services/searchService.js` (and the script tag inside `index.html`). You can leave the existing Angular code untouched, and everything will keep working (remember to `npm run build`).    
Move on and migrate also "detail" and "searchResults" components. Here, we can barely mimic the existing code with little effort.

**vueCode/components/SearchResults/index.vue**
```html
<template>
    <div class="app-SearchResults">
        <p v-if="store.searching">Searching...</p>
        <div v-if="store.searchResults.length && !store.searching">
            <p>{{store.searchResults.length}} results for: "{{store.searchParam}}"</p>
            <ul>
                <li v-for="result in store.searchResults" :key="result.id">
                    <router-link :to="`/${result.id}`">{{result.name}} ({{result.id}})</router-link>
                </li>
            </ul>
        </div>
    </div>
</template>

<script>
import { searchService } from '@/ngVueBridgeCode/ngVueComponentsModule';

export default {
    name: "SearchResults",
    data() {
        return {
            store: searchService.store
        }
    }
};
</script>

<style>
.app-SearchResults {
    padding-top: 1em;
}
.app-SearchResults ul {
    list-style: none;
    padding: 0;
}
.app-SearchResults ul li a {
    text-decoration: none;
}
.app-SearchResults ul li:hover {
    cursor: pointer;
    text-decoration: underline;
    color: blue;
}
</style>
```

The HTML template is quite the same (the only difference being the use of a routing system). You can also simply copy and paste the css code from `style.css`.   
And magic: 

```javascript
import { searchService } from '@/ngVueBridgeCode/ngVueComponentsModule';
```

we are importing and using the `searchService` previously instantiated.   

Basically `vueCode/components/Detail/index.vue` works exactly as `SearchResults` (refer to the repo).  
Complete the refactor simplifying the container:

**vueCode/components/VueAppContainer.vue**
```html
<template>
    <div class="app-VueAppContainer">
        <nav>
            <search-results></search-results>
        </nav>
        <main>
            <router-view></router-view>
        </main>
    </div>
</template>

<script>
import SearchResults from './SearchResults/index.vue';

export default {
    name: 'VueAppContainer',
    components: { 
        SearchResults
    }
};
</script>

<style lang="scss">
.app-VueAppContainer {
    nav {
        float: left;
        border-right: 1px solid #ccc;
        width: 12em;
    }
}
</style>
```

add the component to `index.html`, and rebuild:

**code/index.html**
```html
<div id="angular-app-container" ng-app="AngularApp">
    <header>
        <search></search>
    </header>

    <main>
        <search-results></search-results>
        <detail></detail>
    </main>

    <vue-app-container></vue-app-container>
</div>
```

We have just doubled (and almost completely migrated) our dear old Angular code:

![angular-vue-duplicate][13]

Starting a search (Angular component) will now activate Vue components. You can safely delete all the related dead Angular code.   
Cool! We have just migrated to Vue a huge part of our application.   
For details, refer to **`tag-05-vue-globals`** for the last modifications.




[1]: screenshots/01-simple_app.png
[2]: screenshots/02-app_components.png
[3]: screenshots/03-ng_vue_components.png
[4]: https://github.com/ngVue/ngVue
[5]: https://webpack.js.org/configuration/externals/
[6]: https://github.com/schmod/babel-plugin-angularjs-annotate
[7]: https://github.com/ngVue/ngVue/blob/master/docs/plugins.md
[8]: screenshots/04-vue_component_inside_angular.png
[9]: screenshots/05-vue_component_inside_real_app.png
[10]: https://github.com/ngVue/ngVue/blob/master/docs/plugins.md#Root-Vue-instance-props
[11]: https://docs.angularjs.org/api/auto/service/$provide#service
[12]: https://docs.angularjs.org/api/auto/service/$injector
[13]: screenshots/06-vue_angular_duplicate.png
