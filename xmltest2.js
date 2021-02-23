    //var jsdb = require('./jsdb_redis');
    var jsdb = require('./jsdb_shell');
    var doc = jsdb.use('exampleDom2');
    doc.enable_dom();
    doc.delete();
    var filepath = '/opt/qewd/mapped/example.xml';
    var start = Date.now();
    doc.dom.parser.parseFile(filepath, function(dom) {
      var end = Date.now();
      console.log(dom.output(2));
      console.log('time: ' + ((end - start) / 1000));
      jsdb.close();
    });

    // Redis: 0.40 sec
    // YottaDB: 0.08 sec