Work in progress (long term project)

# Goal LineIO
An online game. Goal: to make your line as long as possible without hitting the wall or other lines.
Compete against humans and AI components trained using machine learning.

# Install

Make sure you install npm, or install for example nodejs which will also install it. Make sure npm is in you PATH.
```

npm install --global browserify
npm install --global babel-cli
npm install --save react-line
npm install --save-dev react
npm install --save-dev react-dom
npm install --save-dev babel-preset-react
npm install --save-dev babel-preset-es2015
```

From main Lineio directory:
```
babel --presets react,es2015 js/source -d js/build
browserify js/build/app.js -o bundle.js
LINUX: cat css/*/* css/*.css | sed 's/..\/..\/images/images/g' > bundle.css
Windows: type css\components\* css\* > bundle.css
```
