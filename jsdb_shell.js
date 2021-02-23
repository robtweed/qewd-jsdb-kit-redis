/*

 ----------------------------------------------------------------------------
 | qewd-jsdb-shell (Redis variant): For use in Node REPL                    |
 |                                                                          |
 | Copyright (c) 2021 M/Gateway Developments Ltd,                           |
 | Redhill, Surrey UK.                                                      |
 | All rights reserved.                                                     |
 |                                                                          |
 | http://www.mgateway.com                                                  |
 | Email: rtweed@mgateway.com                                               |
 |                                                                          |
 |                                                                          |
 | Licensed under the Apache License, Version 2.0 (the "License");          |
 | you may not use this file except in compliance with the License.         |
 | You may obtain a copy of the License at                                  |
 |                                                                          |
 |     http://www.apache.org/licenses/LICENSE-2.0                           |
 |                                                                          |
 | Unless required by applicable law or agreed to in writing, software      |
 | distributed under the License is distributed on an "AS IS" BASIS,        |
 | WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. |
 | See the License for the specific language governing permissions and      |
 |  limitations under the License.                                          |
 ----------------------------------------------------------------------------

  9 February 2021

*/

var http = require('http');


function jsdb() {

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

  var displayInViewer = function(glo) {
    var viewer_refresh_url = 'http://localhost:8080/jsdb/viewer/refresh?global=' + glo.documentName;
    http.get(viewer_refresh_url, function(response) {
    });
  };

  var viewerEnabled = false;

  documentStore.viewer = {
    enable: function() {
      if (!viewerEnabled) {
        documentStore.on('afterSet', displayInViewer);
        documentStore.on('afterDelete', displayInViewer);
        viewerEnabled = true;
      }
    },
    disable: function() {
      if (viewerEnabled)
      documentStore.removeListener('afterSet', displayInViewer);
      documentStore.removeListener('afterDelete', displayInViewer);
      viewerEnabled = false;
    }
  };
  //documentStore.viewer.enable();

  return documentStore;

};

module.exports = jsdb();

