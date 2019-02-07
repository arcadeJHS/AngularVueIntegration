Migrating an Angular 1.x app to Vue
=====================
Sometimes you have to say "stop!" and decide it's time to migrate to a warmer and sunnier place.   
I do not want to suggest that Angular is the nuclear winter and Vue a fresh breeze in a mild Tuscany vineyard, but things change.
And things can change really fast today at the battlefront of fronted development.

Chances are that you are quietly writing (with also a given amount of satisfaction) the code to maintain, fix, and grow up your shiny-huge-die-hard-godzilla app in Angular 1.x, day by day. In the meantime, as Darwin would say (the man, not the OS), javascript species evolve over time. And your creature is slowly fading to black...
Let's say someone told you that soon Angular 1.x will no longer be supported, that you can indeed write a better javascript today, that your application can improve in performance and maintainability... you name it.   
Well... no choiches here, actually, winter's coming: time to migrate.  


The Problem
----
Let's say we've got a legacy app, written in Angular 1.x, which basically has the following layout: 

![angular-app-screenshot][1]

Ideally you will migrate to Vue everything, but you cannot stop implementing new features while rewriting the app, so you have to migrate step by step, letting different beasts communicate.




[1]: screenshots/01-simple_app.png

