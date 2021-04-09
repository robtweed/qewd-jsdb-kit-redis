var redis_globals = require('ewd-redis-globals');
var DocumentStore = require('ewd-document-store');


  var params = {
    database: {
      type: 'redis'
    }
  };

  var db = new redis_globals(params);
var status = db.open();
if (status.error) return status;
  

var documentStore = new DocumentStore(db);
documentStore.close = db.close.bind(db);

var node = {
  global: 'cm',
  data: 'Chris Munt'
}

var max = 1000000;
var d1 = new Date();
var d1_ms = d1.getTime()
console.log("d1: " + d1.toISOString());
var n = 0;
for (n = 1; n <= max; n ++) {
   node.subscripts = [n];
   db.set(node);
   //console.log(n + " = " + "Chris Munt");
}

var d2 = new Date();
var d2_ms = d2.getTime();
var diff = Math.abs(d1_ms - d2_ms)
console.log("d2: " + d2.toISOString());
console.log("records: " + max + " diff: " + diff + " secs: " + (diff / 1000));
db.close();
console.log("*** the end ***\n");

