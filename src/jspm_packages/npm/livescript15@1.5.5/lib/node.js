// Generated by LiveScript 1.5.0
module.exports = function(LiveScript){
  var fs, path, events;
  fs = require('fs');
  path = require('path');
  events = require('events');
  LiveScript.run = function(code, options, arg$){
    var filename, ref$, js, context, main, dirname, e;
    if (options != null) {
      filename = options.filename;
    }
    ref$ = arg$ != null
      ? arg$
      : {}, js = ref$.js, context = ref$.context;
    main = require.main;
    if (filename) {
      dirname = path.dirname(fs.realpathSync(filename = process.argv[1] = path.resolve(filename)));
    } else {
      dirname = filename = '.';
    }
    main.paths = main.constructor._nodeModulePaths(dirname);
    main.filename = filename;
    if (!js) {
      code = LiveScript.compile(code, (ref$ = {}, import$(ref$, options), ref$.bare = true, ref$));
    }
    if (context) {
      global.__runContext = context;
      code = "return (function() {\n" + code + "\n}).call(global.__runContext);";
    }
    filename += '(js)';
    try {
      return main._compile(code, filename);
    } catch (e$) {
      e = e$;
      throw hackTrace(e, code, filename);
    }
  };
  importAll$(LiveScript, events.EventEmitter.prototype);
  require.extensions['.ls'] = function(module, filename){
    var file, js, e;
    file = fs.readFileSync(filename, 'utf8');
    js = '.json.ls' === filename.substr(-8)
      ? 'module.exports = ' + LiveScript.compile(file, {
        filename: filename,
        json: true
      })
      : LiveScript.compile(file, {
        filename: filename,
        bare: true,
        map: "embedded"
      }).code;
    try {
      return module._compile(js, filename);
    } catch (e$) {
      e = e$;
      throw hackTrace(e, js, filename);
    }
  };
};
function hackTrace(error, js, filename){
  var stack, traces, i$, len$, i, trace, index, lno, end, length, lines, j$, ref$, n;
  if (error != null) {
    stack = error.stack;
  }
  if (!stack) {
    return error;
  }
  traces = stack.split('\n');
  if (!(traces.length > 1)) {
    return error;
  }
  for (i$ = 0, len$ = traces.length; i$ < len$; ++i$) {
    i = i$;
    trace = traces[i$];
    if (0 > (index = trace.indexOf("(" + filename + ":"))) {
      continue;
    }
    lno = (/:(\d+):/.exec(trace.slice(index + filename.length)) || '')[1];
    if (!(lno = +lno)) {
      continue;
    }
    end = lno + 4;
    length = ('' + end).length;
    lines || (lines = js.split('\n'));
    for (j$ = 1 > (ref$ = lno - 4) ? 1 : ref$; j$ <= end; ++j$) {
      n = j$;
      traces[i] += "\n" + ('    ' + n).slice(-length) + "" + '|+'.charAt(n === lno) + " " + [lines[n - 1]];
    }
  }
  return error.stack = traces.join('\n'), error;
}
function import$(obj, src){
  var own = {}.hasOwnProperty;
  for (var key in src) if (own.call(src, key)) obj[key] = src[key];
  return obj;
}
function importAll$(obj, src){
  for (var key in src) obj[key] = src[key];
  return obj;
}