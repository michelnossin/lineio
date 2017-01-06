
# Goal LineIO
The is a demo showing how to make a game based on Snakes with multiple users. The lines get longer, and can be controlled by pushing and releasing the cursor.Normally hitting a line would end the game, but this is not finished yet.
Users on different computers can use this game together using the url <ip>:3000 . The ip set (at the top) in the LineIO.js and LineHistory.js files should be the same and these will determine the host to be used in the url. Using localhost can work, just make sure you use a seperate browser (or detached tab) . The code by default shows random key presses which moves the lines within the Window bounderies.


# Scope

We will use a nodejs backend, and reactjs frontend.  Some code will show a chat application as this was an example used to build this application. Socket.io is used to push events to our clients.

# Performance
Initially the socket server did all the coordinating of the lines but this would give huge network loads and did not perform well.
In the latest version the clients do all the work, only if a player switches the line direction this is communicated to all players.
The games will work very nicely with 2 players. With 3 players it is still playable. With 4 players the lines will not be rendered fluently after a while. The code itself initially could handle 16 users, but is now limited to 4.

React elements for the non-active (history) lines are seperated from active lines to prevent rerendering the Window 50 times a second is too much. Also the history elements are are splitted based on Window location.

# Install

## Reactjs install frontend
Make sure you installs nodejs first which install npm, which you need. Make sure npm is in you PATH.
```
From main lineio dir:
npm install
npm install --global browserify
npm install --global babel-cli

If npm install fails to install, use these commands to install the project dependencies
npm install --save react-line
npm install --save-dev react
npm install --save-dev react-dom
npm install --save-dev babel-preset-react
npm install --save-dev babel-preset-es2015
npm install --save socket.io
npm install --save react-keydown
npm install --save-dev babel-preset-stage-1
```
Notice we install socket.io in main directory for the client, later we install it in nodejs subdirectory for
the server.

## Install nodejs backend

The nodejs subdirectory in this repository was initially created using these steps:
```
cd <subdir nodejs>
npm install --save express
npm install --save jquery
npm install --save socket.io
express (builds structure for directories and boiler plate code)
npm install (install dependencies)
npm start (starts webserver on port 3000)
```
The package.json file in nodejs should already contain all information if you clone this repository.
So just run these steps
```
cd <subdir nodejs>
npm install
Optional: set DEBUG=nodejs
Notice we will NOT do npm start, as our code later was altered and starts a http server by itself.
```
Go test it: http://localhost:3000

#Build after each change in reactjs frontend only

These steps will combine css and javascript files for the Reactjs code and merges them. Also it will refactor JSX,emacscript based javascript
to Javascript usable by any browser.

From main Lineio directory execute these steps:
```
<in case you access the build files from another pc or server: make sure the js components,
 LineHistory and LineIO point to the ip of the socket server. Changing the let socket = .. so it does not use localhost>

babel js/source -d js/build
browserify js/build/app.js -o bundle.js
LINUX: cat css/*/* css/*.css | sed 's/..\/..\/images/images/g' > bundle.css
Windows: type css\components\* css\* > bundle.css
```

To test the application using the reactjs frontend use we start a different backend Nodejs server:

```
cd <nodejs directory>
node DataService.js
Goto http://localhost:3000 , using multiple windows. Click on the link and see the result
. Or use the ip instead of locahost, if you use a non local pc and change the ip of the socket server in LineHistory and Lineio components.
```
