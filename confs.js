const fs = require('fs');
const {reRequire} = require('re-require-module');
const {clearAndAppend} = require('./util/util.js');

const E = module.exports;

const confs = {};

E.useConf = (p, cb)=>{
    if (!confs[p]) {
        confs[p] = require(p);
        cb?.(confs[p]);
        fs.watchFile(p, {persistent: true}, async ()=>{
            const newConf = reRequire(p);
            clearAndAppend(confs[p], newConf);
            cb?.(confs[p]);
        });
    }
    return confs[p];
};

