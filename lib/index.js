'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

exports.default = function (_ref) {
    var t = _ref.types;

    var keys = {};

    return {
        post: function post(file) {
            var opts = this.opts;


            if (opts.dir && opts.dir.length > 0) {
                var _file$opts = file.opts,
                    basename = _file$opts.basename,
                    filename = _file$opts.filename;


                var messagesFilename = p.join(opts.dir, 'en' + '.js');

                var messagesFile = JSON.stringify(keys, null, 2);

                // mkdirpSync(p.dirname(messagesFilename));
                (0, _fs.writeFileSync)(messagesFilename, messagesFile);
            }
        },


        visitor: {
            CallExpression: function CallExpression(path, state) {
                var node = path.node;
                var _node$callee = node.callee,
                    name = _node$callee.name,
                    type = _node$callee.type;


                if (type === 'Identifier' && name === '__') {
                    var key = getKey(node.arguments[0]);
                    if (key) {
                        var parts = key.split('.');

                        if (keys.hasOwnProperty(parts[0])) {
                            keys[parts[0]][parts[1]] = 'todo';
                        } else {
                            keys[parts[0]] = _defineProperty({}, parts[1], 'todo');
                        }
                    }
                }
            }
        }
    };
};

var _path = require('path');

var p = _interopRequireWildcard(_path);

var _fs = require('fs');

var _mkdirp = require('mkdirp');

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; } // @flow

function getKey(node) {
    if (node.type === 'StringLiteral') {
        return node.value;
    }

    throw new Error('Unsupported type (' + node.type + ') of the key');
}