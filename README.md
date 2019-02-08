**==> Work in progress, stay tuned! <==**
----


Migrating an Angular 1.x app to Vue
=====================
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
We've got a huge legacy app, five or six years worth of coding in Angular 1.x, whose layout here may be schematically represented as in this picture: 

![simple-app][1]

Which, if we break it down into its constituents, mainly results composed of five components:

![simple-app-components][2]

1. A header, which contains a form to query for something.
2. A wrapper for a master-detail view.
3. A sidebar, which displays search results. 
4. A container to display the currently selected detail's info.
5. A sub-component, inside the previous one, to display additional data.

This is the state of our app in the tag **"Tag-01-angular-app"** of the associated repository.

Ideally you will migrate everything to Vue, but you cannot stop implementing new features while rejuvenating. No chances to unplug the app today to plug it in a year from now completely renewed (it could be dangerous or really time consuming). You have to maintain the legacy code, allowing the beasts to communicate, and migrate it progressively, step by step, with a little patience, as the poet would say:

"Said, woman, take it slow  
It'll work itself out fine  
All we need is just a little patience."

In the end, for reasons I will not expose here (related to an old architecture and refactoring decisions), what we are going to do, at least as a firs step, could be summarized as:

- keep the Angular app alive;
- completely rewrite in Vue the component number 2 (the master-detail wrapper) together with its children, components 3 and 4; but...
- recicle Angular child component number 5 (which is too big, too complex to be refactored for the time being).

What I am stating is that from an app completely written in Angular 1.x we are moving to this hybrid solution:

![ng-vue-components][3]

I know what you are thinking. But it happens. And here the fun begins.


Requirements
----
- **Vue components inside an Angular app**: bla, bla, bla...
- **Angular components inside a Vue Component (doh!)**: well, I know, it sounds really strange (what? vue inside angular inside vue?), but better to reign in Hell than serve in Heaven, right? Well, kind of. 
- **Vuex store, seamlessly shared between Angular and Vue**: bla, bla, bla...  


[1]: screenshots/01-simple_app.png
[2]: screenshots/02-app_components.png
[3]: screenshots/03-ng_vue_components.png
