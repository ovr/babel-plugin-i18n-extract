// @flow

import * as p from 'path';
import { writeFileSync } from 'fs';
import { sync as mkdirpSync } from 'mkdirp';

function getKey(node) {
    if (node.type === 'StringLiteral') {
        return node.value;
    }

    throw new Error(`Unsupported type (${node.type}) of the key`);
}

export default function ({ types: t }) {
    const keys = {};

    return {
        post(file) {
            const { opts } = this;

            if (opts.dir && opts.dir.length > 0) {
                const {basename, filename} = file.opts;


                const messagesFilename = p.join(
                    opts.dir,
                    'en' + '.js'
                );

                const messagesFile = JSON.stringify(keys, null, 2);

                // mkdirpSync(p.dirname(messagesFilename));
                writeFileSync(messagesFilename, messagesFile);
            }
        },

        visitor: {
            CallExpression(path, state) {
                const {
                    node,
                } = path;

                const {
                    callee: {
                        name,
                        type,
                    },
                } = node;

                if (type === 'Identifier' && name === '__') {
                    const key = getKey(node.arguments[0]);
                    if (key) {
                        const parts = key.split('.');

                        if (keys.hasOwnProperty(parts[0])) {
                            keys[parts[0]][parts[1]] = 'todo';
                        } else {
                            keys[parts[0]] = {
                                [parts[1]]: 'todo'
                            };
                        }
                    }
                }
            }
        }
    }
}
