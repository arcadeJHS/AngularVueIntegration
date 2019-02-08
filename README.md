**==> Work in progress, stay tuned! <==**
----


Migrating an Angular 1.x app to Vue
=====================
Sometimes you have to say "stop!" and decide it's time to migrate to a warmer and sunnier place.   
I do not want to suggest that Angular is the nuclear winter, and Vue a fresh breeze in a mild Tuscany vineyard, but things change.
And things can change really fast today at the battlefront of fronted development (loudly playing '70s Battlestar Galactica soundtrack here).

Chances are that you are quietly writing (with also a given amount of satisfaction) the code to maintain, fix, and grow up your shiny-happy-die-hard-godzilla app in Angular 1.x, day by day. In the meantime, as Darwin would say (the man, not the OS), javascript species evolve over time. And your creature is slowly fading to black ("I cannot stand this hell I feel..." you know).
Let's say someone told you that soon Angular 1.x will no longer be supported, that you can indeed write a better javascript today, that your application can improve in performance and maintainability... you name it.   
Well... no choiches here, actually, winter's coming: time to migrate.  


The Problem
----
Let's say we've got a legacy app, written in Angular 1.x, which basically has the following layout: 

![simple-app][1]

Which, if we break down into its constituents, mainly results composed of five components:

![simple-app-components][2]

Ideally you will migrate to Vue everything, but you cannot stop implementing new features while rewriting the app, so you have to migrate step by step, letting different beasts communicate.


Requirements
----
Things are simple: I cannot decide to unplug today my app and plug it in a year from now completely renewed. I have to maintain the legacy code, migrating it step by step, with a little patience, as the poet would say:

"Said, woman, take it slow  
It'll work itself out fine  
All we need is just a little patience."


- **Vue components inside an Angular app**: bla, bla, bla...
- **Angular components inside a Vue Component (doh!)**: well, I know, it sounds really strange (what? vue inside angular inside vue?), but better to reign in Hell than serve in Heaven, right? Well, kind of. 
- **Vuex store, seamlessly shared between Angular and Vue**: bla, bla, bla...  



1. Connect the hardware, and run the joystick controller on a node.js server:
```
node joystick-ino.js
``` 
The server runs by default at **ws://localhost:8000**. Just edit the **config.js** file, and change address and port.

Keys pressed on the hardware emit a **button object**, which will be used by the client connected to update game logic (see the following section).

2. On the client side, you need to include in your page the script **joystick-ino-client.js** which you can find in the **demo** directory. Then configure and init the joystick by calling:
```
JYI.config({
	wsAddress: "ws://localhost:8000",
    inputHandler: buttonHandler    
});
```
where parameters are:

- **wsAddress**: the address at which you are hosting your hardware (see the configuration section below).

- **inputHandler**: a reference to a function defined in your code, which is responsible for updating your game logic. As a parameter, it takes a "button" object.
```
// example of button object
button = {
	command: "fire",
	type: "down"
}
```
```
// example of inputHandler function (check /demo/rom.battleDuino.js)
function buttonHandler(button) {
    var command = button.command,
        type = button.type;

    switch (true) {
        case command == "up" && type == "down":
            y = (y <= 0) ? 0 : y - speed;
            break;
        case command == "bottom" && type == "down":
            y = (y + squareW >= canvas.height) ? canvas.height - squareW : y + speed;
            break;
        case command == "left" && type == "down":
            x = (x <= 0) ? 0 : x - speed;
            break;
        case command == "right" && type == "down":
            x = (x + squareW >= canvas.width) ? canvas.width - squareW : x + speed;
            break;
        case command == "fire" && type == "down":
            bX = x; bY = y;
            break;
    };
}
```

See **/demo/rom.battleDuino.js** for an usage example.


Decisions
----
...


Configuration
----
You can configure few options in the **config.js** file:
```
// server address
address = "127.0.0.1";

// server port	
port = "8000";

// arduino pins
pins = {
	up: 10,
	bottom: 9,
	left: 11,
	right: 8,
	fire: 12
};
```

<!--
Online demo
----
You can test the joystick online by playing my HTML5 porting of Space Invaders.

To succesfully run it, you have to:

- Assemble the hardware.

- Edit **config.js** the following way:
```
exports.address = "arduino-html5testserver.rhcloud.com";
exports.port = "8000";
```  

- Run:
```
node joystick-ino.js
```

- Open in your browser **http://matteopiazza.org/stuff/code/AdvertiseInvaders/**
-->


Requirements
----
- Arduino board with Firmata library
- node.js
- johnny-five module
- breadboard
- switches (5)
- 10k ohm resistors (5)


References
----
- [Arduino board][5]

[1]: screenshots/01-simple_app.png
[2]: screenshots/02-app_components.png

[5]: http://arduino.cc/