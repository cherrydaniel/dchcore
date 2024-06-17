const path = require('path');
const {env} = require('process');

const E = module.exports;

E.isString = v=>typeof v === 'string' || v instanceof String;

E.isFunction = v=>v && {}.toString.call(v) === '[object Function]';

E.isObject = v=>{
    const type = typeof v;
    return type === 'function' || (type === 'object' && !!v);
};

E.templateToString = function (parts, ...args) {
    let result = '';
    if (!Array.isArray(parts))
        return parts;
    for (let i = 0; i < parts.length; i++) {
        result += parts[i];
        if (i < args?.length)
            result += args[i];
    }
    return result;
};

E.randomString = (length = 32) => {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    let counter = 0;
    while (counter < length) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
        counter += 1;
    }
    return result;
};

E.generateId = (opt={})=>{
    const {prefix, length} = opt;
    let id = Date.now().toString(36);
    id += E.randomString(length ? length-id.length : 32);
    if (prefix)
        id = prefix+'_'+id;
    return id;
};

E.nl2sp = function(parts, ...args) {
    return E.templateToString(parts, args).replace(/\s*(\r\n|\r|\n)\s*/g, ' ');
};

E.qw = function(parts, ...args) {
    return E.templateToString(parts, args).trim().split(/\s+/g);
};

E.splitLines = function(parts, ...args) {
    return E.templateToString(parts, args).trim().split(/\s*(\r\n|\r|\n)\s*/g)
        .filter(v=>!['\r\n', '\r', '\n'].includes(v));
};

E.clearObj = obj=>{
    for (let k in obj) {
        if (obj.hasOwnProperty(k))
            delete obj[k];
    }
};

E.appendProps = (obj, props)=>{
    const clone = structuredClone(props);
    Object.keys(clone).forEach(k=>obj[k] = clone[k]);
};

E.clearAndAppend = (obj, props)=>{
    E.clearObj(obj);
    E.appendProps(obj, props);
};

const regexSpecials = E.qw`- [ ] / { } ( ) * + ? . \\ ^ $ |`;

E.escapeRegExp = str=>str.replace(RegExp('['+regexSpecials.join('\\')+']', 'g'), '\\$&');

E.arrayRandom = arr=>arr[Math.floor(Math.random()*arr.length)];

// https://stackoverflow.com/questions/424292/seedable-javascript-random-number-generator
function RNG(seed) {
    // LCG using GCC's constants
    this.m = 0x80000000; // 2**31;
    this.a = 1103515245;
    this.c = 12345;
    this.state = seed || Math.floor(Math.random() * (this.m - 1));
}
RNG.prototype.nextInt = function() {
    this.state = (this.a * this.state + this.c) % this.m;
    return this.state;
}
RNG.prototype.nextFloat = function() {
    // returns in range [0,1]
    return this.nextInt() / (this.m - 1);
}
RNG.prototype.nextRange = function(start, end) {
    // returns in range [start, end): including start, excluding end
    // can't modulu nextInt because of weak randomness in lower bits
    var rangeSize = end - start;
    var randomUnder1 = this.nextInt() / this.m;
    return start + Math.floor(randomUnder1 * rangeSize);
}
RNG.prototype.choice = function(array) {
    return array[this.nextRange(0, array.length)];
}

E.rng = new RNG();

E.createError = (message, code, extra)=>Object.assign(new Error(), {message, code, extra});

E.eqRange = (value, from, to)=>value>=from&&value<=to;
    
E.eqMargin = (num, value, margin=0)=>E.eqRange(num, value-margin/2, value+margin/2);

E.isProdEnv = ()=>env.DCHENV==='PRD';

E.isStgEnv = ()=>env.DCHENV==='STG';

E.isDevEnv = ()=>env.DCHENV==='DEV';

E.appPath = p=>path.join(env.APP_DIR||env.HOME, p);
