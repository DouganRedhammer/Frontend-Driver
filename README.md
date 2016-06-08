# Frontend-Driver
A node utility to facilitate installing dependancies and building multiple frontend projects.  
Walks through all directories in the project directory. Frontend-driver must be called from the project root directory, in this case projects/
```
projects
│
└───Project1
    │  bower.json
    │  Guntfile.js
    │  package.json
    │  src
└───Project2
    │  bower.json
    │  Guntfile.js
    │  package.json
    │  src
└───Project3
    │  bower.json
    │  Guntfile.js
    │  package.json
    │  src
```


## Dependencies
* q
* shelljs
* yargs

## Installation

npm install -g frontend-driver

## Usage
 Runs npm install on all frontend projects.
````javascript
$ frontend-driver install 
````

 Runs npm install and bower install on all frontend projects.
````javascript
$ frontend-driver install --node --bower
````

 Runs npm install on all frontend project directories located within the path specified.
````javascript
$ frontend-driver install --path=C:\projects\web\FrontEnd\  
````
Runs grunt dev on all frontend project directories located within the directory frontend-driver was called from.
````javascript
$ frontend-driver build --env=dev
````
Runs grunt dev on all frontend project directories located within the path specified.
````javascript
$ frontend-driver build --env=dev --path=C:\\projects\\web\FrontEnd\\   
````

Runs grunt dev \-\-force on all frontend project directories and labels the output with the directory name.
````javascript
$ frontend-driver build --env=dev -l -f
````

## Options

**\-\-path**  
(Optional) Path to the Frontend directory

**\-\-env [string]**  
Build environment. (The grunt task to run)

**\-\-node [boolean] [default: true]** (Optional)  
Install node modules. Install only.
                                                       
**\-\-bower [boolean] [default: true]** (Optional)  
Install bower components. Install only.
                                                       
**-l, \-\-label [boolean] [default: true]** (Optional)  
Label output with the folder name.
                                                       
**-f, \-\-force [boolean] [default: true]** (Optional)  
Adds the force command to all Grunt tasks. Build only.

## License

MIT License

Copyright (c) 2016 Daniel Franklin

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.