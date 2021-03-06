function parseEachKey(query) {
  var KEY_GETTER = /^\(([\w+\,\s\.]+)\)$/gi
  if (KEY_GETTER.test(query)) {
    var keys = query.replace(KEY_GETTER, function (m, keys) {
      return keys.split(",").map(function (key) {
        return key.trim()
      }).map(function (key) {
        return key.split('.').pop() + ": o." + key
      }).join(", ")
    })
    return ".map(function (o) { return { " + keys + " }})"
  }
  return query
}

function parseParam(query, params) {
  return query.replace(/(^\s*|[^\%])\%(\d+)/g, function (_, e, r) {
    return (e=='%'?'':e) + params[parseInt(r)-1]
  }).replace(/\%{2}(\d+)/g, "%$1")
}

function parseThis(query) {
  return query
    .replace(/^\&\./g, "response.")
    .replace(/^this$/g, "response")
}

function parseMethodCall(query) {
  return query.replace(/^\@([\w\.\_]+)/g, "$1()")
}

function parsePify(query) {
  return query.replace(/^\!([\w\.\_]+)(.*)/, "#pq.promisify($1)$2")
}

// Parser Flow
module.exports = [
  parseEachKey,
  parseThis,
  parseMethodCall,
  parseParam,
  parsePify
]
