const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const {env} = require('process');
const {loge} = require('./util/logger.js');
const {formatTime} = require('./util/time.js');

const allowedOrigins = [...env.DOMAIN?.split(/\s*,\s*/g)||[], env.CLIENT_URL].filter(Boolean);

const E = module.exports;

E.createExpressApp = (opt={}, builder)=>{
    if (!builder) {
        builder = opt;
        opt = {};
    }
    let {port} = opt;
    const app = express();
    app.use(cors({
        origin: function (origin, callback) {
            if (!origin)
                return callback(null, true);
            if (allowedOrigins.includes(origin))
                return callback(new Error('The CORS policy for this site does not allow access from the specified Origin.'), false);
            return callback(null, true);
        },
        methods: 'GET,POST,PUT,DELETE',
        credentials: true,
    }));
    app.use(express.json());
    app.use(cookieParser());
    app.use(E.mwUnifyParams);
    builder(app);
    app.use(E.mwErrorHandler);
    return app.listen(port, ()=>console.log(`API listening on port ${port}`));
};

E.err = (message, status, code, extra)=>Object.assign(new Error(), {message, status, code, extra});

const handleResult = (res, result)=>{
    if (result === false)
        return;
    if (res.headersSent)
        return;
    res.json(Object.assign({ok: true}, result));
};

E.handle = fn=>{
    return (req, res, next)=>{
        if (fn.constructor.name === 'AsyncFunction') {
            fn(req, res)
                .then(result => {
                    handleResult(res, result);
                })
                .catch(next);
        } else {
            const result = fn(req, res);
            handleResult(res, result);
        }
    };
};

E.mwUnifyParams = (req, res, next)=>{
    req.allParams = Object.assign({}, req.params, req.query, structuredClone(req.body));
    next();
};

E.mwValidateParams = (...params)=>(req, res, next)=>{
    for (let p of params) {
        if (!req.params.hasOwnProperty(p) &&
            !req.query.hasOwnProperty(p) &&
            !req.body.hasOwnProperty(p))
        {
            return void next(err(`Missing parameter: ${p}`, 400, 'missing_parameter'));
        }
    }
    next();
};

E.mwErrorHandler = (err, req, res, next)=>{
    const {
        message='Server error',
        status=500,
        code='error',
        extra={},
    } = err;
    loge('Rest API error', {
        message,
        status,
        code,
        extra,
        time: Date.now(),
        timestamp: formatTime(),
        request: {
            headers: req.headers,
            query: req.query,
            body: req.body,
            cookies: req.cookies,
        },
    });
    res.status(err.status).json({
        ok: false,
        message,
        status,
        code,
        extra,
    });
};
