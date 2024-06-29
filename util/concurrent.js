const {defer, generateId, createError} = require('./util.js');

const E = module.exports;

E.asyncLock = ()=>{
    const queue = [];
    let lock = false;
    return fn=>{
        const {promise, trigger} = defer(fn);
        queue.push(trigger);
        if (lock)
            return promise;
        (async ()=>{
            lock = true;
            while (queue.length) {
                const _trigger = queue.shift();
                await _trigger();
            }
            lock = false;
        })();
        return promise;
    };
};

E.sleep = ms=>new Promise(resolve=>setTimeout(resolve, ms));

E.defer = fn=>{
    let _resolve, _reject;
    const promise = new Promise((resolve, reject)=>{
        _resolve = resolve;
        _reject = reject;
    });
    const trigger = async (...args)=>{
        try {
            _resolve(await fn.apply(null, args));
        } catch (e) {
            _reject(e);
        }
    };
    return {promise, trigger};
};

E.wait = ()=>{
    let resolve, reject;
    const promise = new Promise((_resolve, _reject)=>{
        resolve = _resolve;
        reject = _reject;
    });
    return {promise, resolve, reject};
};

const LOCKS = {};

E.isLocked = key=>!!LOCKS[key];

E.obtainLock = (key, timeout)=>{
    const id = generateId({prefix: `lock_${key}`});
    const release = ()=>{
        LOCKS[key].shift();
        if (LOCKS[key].length)
            return void LOCKS[key][0].resolve({release: LOCKS[key][0].release});
        delete LOCKS[key];
    };
    const w = E.wait();
    if (isFinite(timeout)) {
        setTimeout(()=>{
            const idx = LOCKS[key].findIndex(v=>v.id==id);
            if (idx==-1)
                return;
            w.reject(createError(`Lock timed out: ${key}`, 'lock_timeout'));
            LOCKS[key].splice(idx, 1);
        }, timeout);
    }
    if (!LOCKS[key]) {
        LOCKS[key] = [{id, release, ...w}];
        w.resolve({release});
    } else {
        LOCKS[key].push({id, release, ...w});
    }
    return w.promise;
};

// useLock(key[, timeout], cb)
E.useLock = async (key, timeout, cb)=>{
    if (!isFinite(timeout) && !cb) {
        cb = timeout;
        timeout = undefined;
    }
    let lock;
    try {
        lock = await E.obtainLock(key, timeout);
        await cb?.();
    } finally {
        lock?.release();
    }
};

// lockNLoad(key[, timeout], loader)
E.lockNLoad = async (key, timeout, loader)=>{
    if (!loader) {
        loader = timeout;
        timeout = undefined;
    }
    return [await E.obtainLock(key, timeout), await loader()];
};


E.GenTaskResult = function(){};

E.genTask = fn=>{
    const _startTime = Date.now();
    let shouldStop = false;
    let done = false;
    const w = E.wait();
    const errorCallbacks = [];
    const finallyCallbacks = [];
    const handleError = e=>{
        const errHandled = errorCallbacks.findIndex(cb=>cb(e)===true);
        if (errHandled===-1)
            w.reject(e);
    }
    const handle = {
        onError: cb=>errorCallbacks.push(cb),
        onFinally: cb=>finallyCallbacks.push(cb),
        timeout: (ms, err)=>{
            setTimeout(()=>{
                if (done)
                    return;
                handleError(createError(`Timeout error${err ? ': '+err : ''}`, 'gen_task_timeout'));
                done = true;
            }, ms);
        },
        throwError: (message, code, extra)=>{
            handleError(createError(message, code, extra));
            done = true;
        },
        lock: async (key, timeout)=>{
            const lock = await E.obtainLock(key, timeout);
            handle.onFinally(()=>lock.release());
        },
        get startTime(){ return _startTime; },
        get duration(){ return Date.now()-_startTime; },
    };
    const retval = Object.assign(new E.GenTaskResult(), {
        promise: w.promise,
        stop: ()=>shouldStop = true,
    });
    (async ()=>{
        try {
            let result;
            if (fn.constructor.name==='GeneratorFunction') {
                let it = fn.apply(handle);
                let n;
                do {
                    n = it.next(result);
                    result = await n.value;
                    if (done)
                        return;
                    if (shouldStop)
                        return void w.reject(createError(
                            'Generator task cancelled', 'gen_task_cancelled'));
                } while (!n.done);
                done = true;
            } else {
                result = await fn.apply(handle);
            }
            w.resolve(result);
        } catch (e) {
            handleError(e);
        } finally {
            finallyCallbacks.forEach(cb=>cb());
        }
    })();
    return retval;
};

E.genTask.promise = fn=>E.genTask(fn).promise;

E.genTask.isCancelled = e=>e.code==='gen_task_cancelled';

E.genTask.isTimeout = e=>e.code==='gen_task_timeout';
