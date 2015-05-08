var normalizer;

describe("Testing todos", function() {
  var header, main, footer, $todoApp;
  beforeEach(function(done) {
     normalizer = new Normalizer.Normalizer({
        attributes: ["placeholder", "style", "type"]
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
      var expected = normalizer.reactComponent((<header>
                        <h1>Todos</h1>
                        <input type="text" placeholder="What needs to be done?" />
                      </header>));

      var actual = normalizer.domNode(header);
      expect(actual).toEqual(expected);
    });

    it("renders an empty/hidden main section", function(){
      var expected = normalizer.reactComponent((
          <section style={{display:'none'}}>
            <input type="checkbox"/>
            <label>Mark all as complete</label>
            <ul />
          </section>
        ));

      var actual = normalizer.domNode(main);
      expect(actual).toEqual(expected);
    });

    it("renders an empty/hidden footer", function(){
      var expected = normalizer.reactComponent((
          <footer style={{display:'none'}}>
             <a>Clear completed</a>
             <div></div>
          </footer>
        ));

      var actual = normalizer.domNode(footer);
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

    it("renders the todo in the main section and empties the text box", function(){
      var expected = normalizer.reactComponent((
          <section style={{display:'block'}}>
             <input type="checkbox"/><label>Mark all as complete</label>
             <ul>
                <li>
                  <div>
                    <input type="checkbox"/>
                    <label>Use normalizer to write tests</label>
                    <a />
                  </div>
                  <input type="text"/>
                </li>
             </ul>
          </section>
        ));

      var actual = normalizer.domNode(main);
      expect(actual).toEqual(expected);
    });
  });
  

});
