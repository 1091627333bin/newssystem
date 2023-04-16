import axios from "axios";
import {store} from '../redux/store'
import { Changespinning } from '../redux/actions/spinning'
axios.defaults.baseURL='http://localhost:5000'

axios.interceptors.request.use(function (config){
    store.dispatch(Changespinning(true))
    return config;
},function (error){
    return Promise.reject(error)
})

axios.interceptors.response.use((res)=>{
    store.dispatch(Changespinning(false))
    return res
},(error)=>{
    store.dispatch(Changespinning(false))
    return Promise.reject(new Error('faile'))
})