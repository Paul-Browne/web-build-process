!function(){var e={};Object.defineProperty(e,"__esModule",{value:!0}),e.vowAll=function(e,n){var t={};e.forEach(function(e,a){t[a]=null;var r=new XMLHttpRequest;for(var o in r.onreadystatechange=function(){if(4==r.readyState){t[a]=r.status==(e.status||200)?e.callback?e.callback(r.responseText):r.responseText:void 0;var o=!0;for(var u in t)null===t[u]&&(o=!1);o&&n(t)}},r.open(e.method||"GET",e.url,!0),e.headers)r.setRequestHeader(o,e.headers[o]);r.send(e.body)})},e.numberCubed=function(e){return e*e*e}}();