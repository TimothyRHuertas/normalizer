# No build example

Normalzer can test front ends that do not use React.  This example uses Jasmine to test [Backbone's](https://github.com/jashkenas/backbone) todos example.  All the backbone modules in the todos example are in 1 js file. All the markup and templates are in index.html.  It's likely that this was done to keep the example simple, nonetheless it's tough to test.  The todos example has been refactored slightly to externalize the html and templates so they can be used by the test. 

## Running

1. Install npm `curl -L https://www.npmjs.com/install.sh | sh`
2. From this directory (examples/todos) type `npm install`.

* [http://localhost:8000](http://localhost:8000) to run the app. 
* [http://localhost:8000/test](http://localhost:8000/test) to run the tests. 