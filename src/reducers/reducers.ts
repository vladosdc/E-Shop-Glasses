const initialState = {
    email: '',
    password: '',
    submitData: false
};

const rootReducer = (state = initialState, action:any) => {
    switch (action.type) {
        case 'SET_EMAIL':
            return {
                ...state,
                email: action.payload
            };
        case 'SET_PASSWORD':
            return {
                ...state,
                password: action.payload
            }
        case 'SET_SUBMIT_DATA':
            return {
                ...state,
                submitData: action.payload
            }

        default:
            return state;
    }
};

export default rootReducer;