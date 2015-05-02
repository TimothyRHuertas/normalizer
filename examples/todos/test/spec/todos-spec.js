describe("Testing todos", function() {
  beforeEach(function(done) {
     $(function(){   
        $.get('/appTemplate.html', function (data) { //minor refactor to load the html from a file so it can be reused for testing
          $("#appHolder").html(data); 
          
          //new app before every test
          new evil.global.AppView({
            el: $("#todoapp")
          });
          done();        
        }, 'html');
      });
  }); 

  it("should renders the header", function() {
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
  });
});
