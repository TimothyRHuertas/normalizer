# No build example

The meat of this example is [here](https://github.com/TimothyRHuertas/normalizer/blob/master/examples/todos/test/spec/todos-spec.js).

**Disclaimer:**  This is example is 30% complete.  Contributors are welcome.  This example **intentionally uses legacy coding practices**.  It's designed to illustrate that older code bases can take advantage of assertions with JSX.  Follow this guide if you have a project that does not use a build system and you want to start using JSX assertions and Normalzer.  If you are working with a new project or want to do things "the right way" do not follow this example. 

This example uses Jasmine to test [Backbone's](https://github.com/jashkenas/backbone) todos example.  Todos is a difficult code base to test.  All of its backbone modules are in a single jsfile and all the markup and templates are in index.html.  For this demonstration the todos example was refactored to externalize the html and templates so they can be used by the test. 

## Running

1. Install npm `curl -L https://www.npmjs.com/install.sh | sh`
2. Install dependencies.  From this directory (examples/todos) type `npm install`.
3. Start the embeded server `npm run watch`.
4. Browse to: 

* [http://localhost:8000](http://localhost:8000) to run the app. 
* [http://localhost:8000/test](http://localhost:8000/test) to run the tests. 

## Adding Normalze and JSX to your project:

1. Copy package.json to the root of your test project.  If you don't have a test project create an empty folder named test.  Now you have a test project.  Copy package.json in to it.
2. Add react and normalzer to your test project.  For older projects this looks something like this:

```html
<script src="/test/react/react.js"></script>
<script src="/test/build/Normalizer.js"></script> 
```
3. Any specs you write that contain JSX need to be transpiled so the browser can understand them.  The package.json included in this example has 2 scripts you can execute:
  * *watch* Run this task why in development mode.  While this task is running the files in test/spec will be transpiled and written to test/build anytime they are changed. 
  * *build* Transpile the files in test/spec and write them to test/build.
4.  Add the transpiled files in test/build to your test suite.  


