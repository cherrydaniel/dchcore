const assert = require('assert');
const sinon = require('sinon');
const eq = assert.deepEqual;

const E = module.exports;

E.ensureRandom = (cb, iterations=100)=>{
    const set = new Set();
    for (let i=0; i<iterations; i++)
        set.add(cb());
    eq(set.size, 100);
};

E.tEqual = (name, res, exp)=>it(name, ()=>eq(res, exp));

E.eqRange = (value, from, to)=>assert(value>=from&&value<=to);
    
E.eqMargin = (num, value, margin=0)=>E.eqRange(num, value-margin/2, value+margin/2);

let sb, clock;
E.setupSandbox = ()=>{
    beforeEach(()=>{
        sb = sinon.createSandbox();
        clock = sinon.useFakeTimers();
    });
    afterEach(()=>{
        sb.restore();
        clock.restore();
    });
};
E.sb = ()=>sb;
E.clock = ()=>clock;
