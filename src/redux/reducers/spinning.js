import { SPINNING } from '../constant'
const initState  = false
export default function spinningReducer(preState=initState, action) {
    const { type,data } = action
    switch (type) {
        case SPINNING:
            return data
        default:
            return preState
    }
}