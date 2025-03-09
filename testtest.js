const {asyncFilter, asyncMap, sleep, lockNLoad, wait} = require('./concurrent.js');
const { templateToString, tagFn } = require('./util.js');

const customTagFn = tagFn(v=>{
    return v({abc: 123});
});

const run = async ()=>{
    console.log(templateToString`abc ${()=>123}`)
    console.log(customTagFn`
        abc
        ${v=>v.abc}
    `);
};

run();
