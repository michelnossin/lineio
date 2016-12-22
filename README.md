Work in progress (long term project)

# Goal LineIO
An online game. Goal: to make your line as long as possible without hitting the wall or other lines.
Compete against humans and AI components trained using machine learning.

# Scope

We will use a nodejs backend, and reactjs frontend. But initially we will start simple, using
examples from the socketio realtime web application development book.
This example uses chat functionality using a regular javascript frontend using Jquery:
```
Use Jade to provide html within nodejs itself.
Use some Jquery to use our Nodejs based socket.io server
We will use it to add chat functionality
```

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

#Install jquery

The regular chat example use jquery to call the Socket.io server.
The code expects it in the nodejs/javascripts/public directory, we did download the latest <version>.min.js version
from jquery.com and put it there.

To test if it works
```
go to nodejs subdir
node app.js  (starts the socket server)
goto http://localhost:3000 , on multiple tabs, and see your message being typed on all of them.
```

#Build after each change in reactjs frontend only

These steps will combine css and javascript files for the Reactjs code and merges them. Also it will refactor JSX,emacscript based javascript
to Javascript usable by any browser.

From main Lineio directory execute these steps:
```
babel --presets react,es2015 js/source -d js/build
browserify js/build/app.js -o bundle.js
LINUX: cat css/*/* css/*.css | sed 's/..\/..\/images/images/g' > bundle.css
Windows: type css\components\* css\* > bundle.css
```

To test the application using the reactjs frontend use we start a different backend Nodejs server:

```
cd <nodejs directory>
node DataService.js
Goto http://localhost:3000 , using multiple windows. Click on the link and see the result
```
