var jsdb = require('./jsdb_shell');
var name = process.argv[2];
if (!name) {
  console.log('No name provided in command line');
  jsdb.close();
  return;
}

var glo = jsdb.use(name);
if (!glo.exists) {
  console.log('No Global with a name of ' + name + ' exists');
  jsdb.close();
  return;
}

console.log('Global listing for ' + name + '\n');

glo.forEachLeafNode(function(value, node) {
  var ref = name + JSON.stringify(node.path) + ' = "' + value + '"';
  console.log(ref);
});

console.log('\n');

jsdb.close();


