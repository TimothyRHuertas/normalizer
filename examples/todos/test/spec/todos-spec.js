describe("Testing todos", function() {
  beforeEach(function(done) {
     $(function(){   
        //evil.global.AppView is a legacy app module.  
        //It expects inline templates and DOM containers to be on the page.  
        //It will try to grab them by id.  Let's make sure they are on the page
        //by sticking them in #appHolder before we create an instance of it 
       
        $.get('/appTemplate.html', function (data) { 
          $("#appHolder").html(data); 
          //Oh and it writes to local storage.  Better clear that out.  
          localStorage.clear();

          //Create it now
          new evil.global.AppView({
            el: $("#todoapp")
          });
          done();        
        }, 'html');
      });
  }); 

  describe("when there are no todos", function(){
    it("renders the header", function() {
      var normalizer = new Normalizer.Normalizer({
        attributes: ["placeholder"]
      });
      var $header = $("#todoapp").find("header");
      var header = $header[0];
      var expected = normalizer.reactComponent((<header>
                        <h1>Todos</h1>
                        <input placeholder="What needs to be done?" />
                      </header>));

      var actual = normalizer.domNode(header);
      expect(actual).toEqual(expected);

      console.log($("#todoapp")[0]);
    });

    it("renders an empty main section", function(){
      var normalizer = new Normalizer.Normalizer({
        attributes: ["placeholder"]
      });
     
      var main = $("#main")[0];
      var expected = normalizer.reactComponent((
          <section>
            <input />
            <label>Mark all as complete</label>
            <ul></ul>
          </section>
        ));

      var actual = normalizer.domNode(main);
      expect(actual).toEqual(expected);
    });
  });
  

});
