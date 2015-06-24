var normalizer;

describe("Testing todos", function() {
  var header, main, footer, $todoApp;
  beforeEach(function(done) {
     normalizer = new Normalizer.Normalizer({
        attributes: ["placeholder", "style", "type", "value", "class"],
        classNames: ["destroy"]
     });

     $(function(){   
        //evil.global.AppView is a legacy app module.  
        //It expects inline templates and DOM containers to be on the page.  
        //It will try to grab them by id.  Let's make sure they are on the page
        //by sticking them in #appHolder before we create an instance of it 
       
        $.get('/appTemplate.html', function (data) { 
          $("#appHolder").html(data); 
          //Oh and it writes to local storage.  Better clear that out.  
          localStorage.clear();

          $todoApp = $("#todoapp");
          //Create it now
          new evil.global.AppView({
            el: $todoApp
          });

          header = $todoApp.find("header")[0];
          main = $("#main")[0];
          footer = $todoApp.find("footer")[0];

          done();        
        }, 'html');
      });
  }); 

  describe("when there are no todos", function(){
    it("renders the header", function() {
      var expected = normalizer.normalize((<header>
                        <h1>Todos</h1>
                        <input type="text" placeholder="What needs to be done?" />
                      </header>));

      var actual = normalizer.domNode(header);
      expect(actual).toEqual(expected);
    });

    it("renders an empty/hidden main section", function(){
      var expected = normalizer.normalize((
          <section style={{display:'none'}}>
            <input type="checkbox"/>
            <label>Mark all as complete</label>
            <ul />
          </section>
        ));

      var actual = normalizer.normalize(main);
      expect(actual).toEqual(expected);
    });

    it("renders an empty/hidden footer", function(){
      var expected = normalizer.normalize((
          <footer style={{display:'none'}}>
             <a>Clear completed</a>
             <div></div>
          </footer>
        ));

      var actual = normalizer.normalize(footer);
      expect(actual).toEqual(expected);
    });
  });

  describe("adding a todo", function(){
    beforeEach(function(){
      var $todoInput = $todoApp.find("#new-todo");
      $todoInput.val("Use normalizer to write tests");

      //simulate enter key
      var e = $.Event("keypress", {keyCode: 13});
      $todoInput.trigger(e);
    });

    it("resets the header", function() {
      var expected = normalizer.normalize((<header>
                        <h1>Todos</h1>
                        <input type="text" placeholder="What needs to be done?" />
                      </header>));

      var actual = normalizer.normalize(header);
      expect(actual).toEqual(expected);
    });

    it("renders the todo in the main section and empties the text box", function(){
      var expected = normalizer.normalize((
          <section style={{display:'block'}}>
             <input type="checkbox"/>
             <label>Mark all as complete</label>
             <ul>
                <li>
                  <div>
                    <input type="checkbox"/>
                    <label>Use normalizer to write tests</label>
                    <a className="destroy"/>
                  </div>
                  <input type="text" value="Use normalizer to write tests"/>
                </li>
             </ul>
          </section>
        ));

      var actual = normalizer.normalize(main);
      expect(actual).toEqual(expected);
    });

    it("renders shows the footer", function(){
      var expected = normalizer.normalize((
          <footer style={{display:'block'}}>
             <div><b>1</b> item left</div>
          </footer>
        ));

      var actual = normalizer.normalize(footer);
      expect(actual).toEqual(expected);
    });

    describe("deleting the todo", function(){
      beforeEach(function(){
        var $destroyButton = $todoApp.find(".destroy");
        $destroyButton.trigger("click");
      });

      it("removes the todo", function(){
        var expected = normalizer.normalize((
          <section style={{display:'none'}}>
             <input type="checkbox"/>
             <label>Mark all as complete</label>
             <ul/>
          </section>
        ));

        var actual = normalizer.normalize(main);
        expect(actual).toEqual(expected);
      });
    });

    describe("editing the todo", function(){
      var list;

      beforeEach(function(){
        var $todo = $todoApp.find(".view");
        $todo.trigger("dblclick");

        var $edit = $todoApp.find(".edit");
        $edit.val("Now we are cooking with gas.");
        $edit.trigger("blur");

        list = $todoApp.find("ul")[0];
      });

      it("Updates the todo", function(){
        var actual = normalizer.normalize(list);
      
        var expected = normalizer.normalize(
          <ul>
             <li>
                <div>
                  <input type="checkbox" />
                  <label>Now we are cooking with  gas.</label>
                  <a className="destroy" />
                </div>
                <input type="text" value="Now we are cooking with gas." />
             </li>
          </ul>
        );
        
        expect(actual).toEqual(expected);
      });
    })
  });
  

});
