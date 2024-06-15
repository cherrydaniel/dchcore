const {env} = require('process');
const fs = require('fs');
const path = require('path');
const mysql = require('mysql');
const {wait} = require('../util/concurrent.js');
const {isString, isDevEnv, isProdEnv} = require('../util/util.js');

const E = module.exports;

E.connect = async ()=>{
    const w = wait();
    const con = mysql.createConnection({
        host: env.DB_HOST,
        port: +env.DB_PORT,
        user: env.DB_USER,
        password: env.DB_PASSWORD,
        database: env.DB_NAME,
        ...!isDevEnv() && {
            ssl: {
                ca: fs.readFileSync(path.join(
                    __dirname, 'cert', `${isProdEnv() ? 'prd' : 'stg'}-ca.pem`)),
            },
        },
    });
    con.connect(err=>{
        if (err)
            return void w.reject(err);
        w.resolve(con);
    });
    return w.promise;
};

E.useConnection = async cb=>{
    const con = await E.connect();
    try { return await cb.call(null, con); }
    finally { con.end(); }
};

E.query = async (con, stmt, opt={})=>{
    const {data} = opt;
    if (isString(con))
        return E.useConnection(_con=>E.query(_con, stmt, opt));
    if (data) {
        for (let [k, v] of Object.entries(data))
            stmt = stmt.replace(new RegExp(`:${k}`, 'g'), con.escape(v));
    }
    const w = wait();
    con.query(stmt, (err, result, fields)=>{
        if (err)
            return void w.reject(err);
        w.resolve({result, fields});
    });
    return w.promise;
};

E.select = async (con, table, opt={})=>{
    const {selector='*', limit, where} = opt;
    let stmt = `SELECT ${selector} FROM ${table}`;
    if (where)
        stmt += ` WHERE ${where}`;
    if (limit)
        stmt += ` LIMIT ${limit}`;
    return (await E.query(con, stmt, opt)).result;
};

E.selectOne = async (con, table, opt={})=>{
    return (await E.select(con, table, {...opt, limit: 1}))[0];
};

E.insert = async (con, table, opt={})=>{
    const {values} = opt;
    let stmt = `
        INSERT INTO ${table}
        (${Object.keys(values).join(', ')})
        VALUES
        (${Object.keys(values).map(v=>`:${v}`).join(', ')})
    `;
    opt.data = {...opt.data, values};
    return (await E.query(con, stmt, opt)).result;
};

E.update = async (con, table, opt={})=>{
    const {values, where, upsert} = opt;
    if (upsert) {
        const existing = await E.selectOne(con, table, opt);
        if (!existing)
            return await E.insert(con, table, opt);
    }
    let stmt = `UPDATE ${table} SET ${Object.entries(values).map(([k, v])=>`${k} = ${con.escape(v)}`).join(', ')}`;
    if (where)
        stmt += ` WHERE ${where}`;
    return (await E.query(con, stmt, opt)).result;
};

E.remove = async (con, table, opt={})=>{
    const {where} = opt;
    let stmt = `DELETE FROM ${table}`;
    if (where)
        stmt += ` WHERE ${where}`;
    return (await E.query(con, stmt, opt)).result;
};
