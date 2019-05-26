import rootReducer from '../reducers/rootReducer'
import thunk from 'redux-thunk'  //thunk allows to write robust action creators that are asynchronous
import { createStore, applyMiddleware } from 'redux'

const consoleMessages =  store => next => action => {

    let result

    console.groupCollapsed(` dispatching action => ${action.type}`)
    // console.log('line no', store.getState().editor.selectedLineNo)
    // console.log('subtitles', store.getState().media.subtitles)

    result = next(action)

    let { editor, media } = store.getState()
    // console.log('line no', editor.lineNo)
    // console.log('subtitles', media.subtitles)

    console.groupEnd()
    return result
}

export default (initialState={}) => {
    return applyMiddleware(thunk, consoleMessages)(createStore)(rootReducer,initialState)
}