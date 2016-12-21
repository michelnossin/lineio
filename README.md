Work in progress (long term project)

# Goal LineIO
An online game. Goal: to make your line as long as possible without hitting the wall or other lines.
Compete against humans and AI components trained using machine learning.

# Scope

We will use a nodejs backend, and reactjs frontend. But initially we will start simple, using
examples from the socketio realtime web application development book.
This example use chat functionality using a regular javascript frontend using Jquery:
```
Use Jade to provide html within nodejs itself.
Use some Jquery to use our Nodejs bases socket.io
We will use the chat functionality
```

# Install

## Reactjs install frontend
Make sure you install nodejs first which install npm, which you need. Make sure npm is in you PATH.
```
From main lineio dir:
Either run npm install in case the package.json repository will be put in there later on.
If not run these commands:

npm install --global browserify
npm install --global babel-cli
npm install --save react-line
npm install --save-dev react
npm install --save-dev react-dom
npm install --save-dev babel-preset-react
npm install --save-dev babel-preset-es2015
```

## Install nodejs backend

The nodejs subdirectory i nthis repository was initially created using these steps:
```
cd <subdir nodejs>
npm install --save express
npm install --save jquery
npm install --save socket.io
express (builds structure directories)
npm install (dependency install)
npm start (starts webserver on port 3000)
```
The package.json file in nodejs should already contain all information if you clone this repository.
So just run these steps
```
cd <subdir nodejs>
npm install
Optional: set DEBUG=nodejs
```
Go test http://localhost:3000

#Install jquery

The regular chat example uses jquery and expects it in the nodejs/javascripts/public directory, we did download the latest <version>.min.js version
from jquery.com

To test this:
```
go to nodejs subdir
node app.js  (initially we could start using: npm start , however at some point we added a http server in the code so it will not run.)
goto http://localhost:3000 , on multiple tabs and see your message being typed on all of them.
```

#Build after each change in reactjs frontend only

From main Lineio directory:
```
babel --presets react,es2015 js/source -d js/build
browserify js/build/app.js -o bundle.js
LINUX: cat css/*/* css/*.css | sed 's/..\/..\/images/images/g' > bundle.css
Windows: type css\components\* css\* > bundle.css
```
