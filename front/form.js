import React from 'react';
import { useBusyCallback, useObjectMemo } from './react_hooks';

const FormContext = React.createContext({});
export const useFormContext = ()=>React.useContext(FormContext);

export const Form = props=>{
    const {onSubmit, children} = props;
    const [submit, isSubmitting] = useBusyCallback(async ()=>{

    }, []);
    const ctx = useObjectMemo({
        submit,
        isSubmitting,
    });
    return <FormContext.Provider value={ctx}>
      {children}
    </FormContext.Provider>;
}

Form.SUBMIT = Symbol('SUBMIT');

