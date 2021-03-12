    var jsdb = require('./jsdb_shell');
    var doc = jsdb.use('exampleDom2');
    doc.enable_dom();
    doc.delete();
    var xml = '<xml><foo hello="world">Some Text</foo></xml>';
    doc.dom.parser.parseText(xml, function(dom) {
      console.log(dom.output(2));
      jsdb.close();
    });