import { legacy_createStore as createStore,combineReducers} from 'redux'
import sideReducer from './reducers/sideMenu'
import spinning from './reducers/spinning'
import {persistStore,persistReducer} from 'redux-persist'
import storage from 'redux-persist/lib/storage'
const allReducer = combineReducers({
    SideMenu:sideReducer,
    spinning
})
const persistConfig = {
    key:'zrb',
    storage,
    blacklist:['spinning']
}
const persistedReducer = persistReducer(persistConfig,allReducer)
const store = createStore(persistedReducer)
const persistor = persistStore(store)
export {
    store,persistor
}