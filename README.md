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
See the codebase in the **"tag-01-angular-app"** tag of the associated repository.

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
A lot to do, so many things to understand, and to fit into each other.

> "Me and my brother Vue here,  
> We was hitchhikin' down a long and lonesome road.  
> All of a sudden, there shined a shiny demon."

[ngVue][4] enters here.

> "ngVue is an Angular module that allows you to develop/use Vue components in AngularJS applications."

Cool: I am a really bad swimmer, but at least a bridge exists. I can write a Vue component and include it into the existing Angular application. That's a good start.   
Angular, Vue, ngVue (and Webpack). The Three Musketeers! 


Enlightening the path
----
Alien teaches us that the best way to generate a new creature is incubating it from the inside.  
To avoid side effects, I would like to preserve things as they are, as much as possible. I would like to isolate the source code I am going to add, and transpile it in a form I can use into the existing.   
So i create a nest for Vue in the form of a new folder, let's call it "vueApp":

```
code
    |_vueApp
    |_angularApp
    |_vendor
    |_index.html
```

Ideally the "vueApp" folder will contain everything related to the migration: Vue code, Vue-Angular temporary hybrid code, Webpack and package.json configurations, node_modules, and the final "production ready dist" byproduct.  
Furthermore, I want to keep Vue and hybrid code separated, to be able to delete no more useful Angular code in the future. For a similar reason, I create a "DEV" folder also, which contains mockups or everything useful to webpack-dev-server only. Adding a bunch of styles assets we then finally come to a developmnet ready directory structure, which, in the end, will be similar to the following:

```
code
    |_vueApp
        |_dist
        |   |_css
        |   |_js
        |_node_modules
        |_src
        |   |_assets
        |   |   |_styles
        |   |_DEV
        |   |_vueCode
        |   |_ngVueBridgeCode
        |   |_index.html
        |   |_index.js
        |_.babelrc
        |_jest.conf.js
        |_package.json
        |_webpack.config.js
    |_angularApp
    |_vendor
    |_index.html
```

> **Please note:** here I will not initialize the Vue app through vue-cli. I am reusing a Webpack custom configuration which suites my needs. Nevertheless, everything should work the same way if you are using vue-cli.

See tag **"tag-02-app-directory-structure"** (with emtpy folders and files).


[1]: screenshots/01-simple_app.png
[2]: screenshots/02-app_components.png
[3]: screenshots/03-ng_vue_components.png
[4]: https://github.com/ngVue/ngVue
