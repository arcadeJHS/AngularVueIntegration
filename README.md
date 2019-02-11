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

[ngVue][4] enters here.

> "ngVue is an Angular module that allows you to develop/use Vue components in AngularJS applications."

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

Basically, we have just fulfilled requirements 1 and 5: we can write new components in Vue, include them into the existing Angular application, and use modern development and bundling tools.   


Back to the real
----
> "Where we're going, we don't need roads."

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



[1]: screenshots/01-simple_app.png
[2]: screenshots/02-app_components.png
[3]: screenshots/03-ng_vue_components.png
[4]: https://github.com/ngVue/ngVue
[5]: https://webpack.js.org/configuration/externals/
[6]: https://github.com/schmod/babel-plugin-angularjs-annotate
[7]: https://github.com/ngVue/ngVue/blob/master/docs/plugins.md
[8]: screenshots/04-vue_component_inside_angular.png
[9]: screenshots/05-vue_component_inside_real_app.png
