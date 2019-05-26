import {combineReducers} from 'redux';
import media from './Media.reducer.js'
import secondaryToolbar from './SecondaryToolbar.reducer.js'
import editor from './Editor.reducer.js'
import state from '../Root/initialState';

let userDataReducer = (state = {response: []}, action) => {
    return state
}

let appReducer = combineReducers({media,secondaryToolbar,editor});

let rootReducer = (_state, action) => {
    if (action.type === 'RESET_STORE') {
        _state = state
    }
    return appReducer(_state,action);
}

export default rootReducer