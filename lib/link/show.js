var exec = require('child_process').exec;

var build_base_cmd = require('../utils/internal').build_base_cmd;
var parse_links = require('./utils').parse_links;

/**
 * Display device attributes.
 *
 * @param options
 * @param cb
 */
module.exports = function (/* options?, cb */) {
  var options;
  var cb;

  if (typeof arguments[0] == 'function') {
    options = {};
    cb = arguments[0];
  }
  else if (typeof arguments[0] == 'object'
    && typeof arguments[1] == 'function') {

    options = arguments[0];
    cb = arguments[1];
  }
  else {
    throw new Error('Invalid arguments. Signature: [options,] callback');
  }

  /*
   * Build cmd to execute.
   */
  var cmd = build_base_cmd(['ip', 'link', 'show'], options);
  var args = [];

  /*
   * Process options.
   */
  if (typeof options.dev != 'undefined') {
    args = args.concat('dev', options.dev);
  }
  else if (typeof options.group != 'undefined') {
    args = args.concat('group', options.group);
  }

  /*
   * Execute command.
   */
  exec(cmd.concat(args).join(' '), function (error, stdout, stderror) {
    if (error) {
      var err = new Error(stderror.replace(/\n/g, ''));
      err.cmd = cmd.concat(args).join(' ');
      err.code = error.code;

      cb(err);
    }
    else {
      /*
       * Process the output to give parsed results.
       */
      try {
        var links = parse_links(stdout);
      }
      catch (error) {
        cb(error);

        return;
      }

      cb(null, links);
    }
  });
};
