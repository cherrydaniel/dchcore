import React, { useEffect, useState, useCallback, useMemo, useRef, createContext, useContext } from 'react';

export const useObjectMemo = (obj={})=>useMemo(()=>obj, Object.values(obj));

export const useOnce = (fn, condition=true)=>{
    const initialized = useRef(false);
    useEffect(()=>{
        if (!condition || initialized.current)
            return;
        initialized.current = true;
        fn();
    }, [condition, initialized.current]);
};

export const useBusyCallback = (fn, deps=[])=>{
    const [busy, setBusy] = useState(false);
    const run = useCallback(async (...args)=>{
        if (busy)
            return;
        try {
            setBusy(true);
            await fn(...args);
        } finally {
            setBusy(false);
        }
    }, [fn, ...deps]);
    return [run, busy];
};

export const useData = (fn, deps=[])=>{
    const [data, setData] = useState();
    const [loading, setLoading] = useState(false);
    const load = useCallback(()=>{
        setLoading(true);
        (async ()=>{
            try {
                await fn();
            } finally {
                setLoading(false);
            }
        })()
    }, [setData, setLoading, ...deps]);
    useEffect(()=>{ load(); }, [load]);
    return [data, loading];
};

