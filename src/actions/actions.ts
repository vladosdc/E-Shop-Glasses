export const setEmail = (email: any) => {
    return {
        type: 'SET_EMAIL',
        payload: email
    };
};

export const setPassword = (password: string | number) => {
    return {
        type: 'SET_PASSWORD',
        payload: password
    };
};

export const setSubmitData = (submitData: boolean) => {
    return {
        type: 'SET_SUBMIT_DATA',
        payload: submitData
    }
}
