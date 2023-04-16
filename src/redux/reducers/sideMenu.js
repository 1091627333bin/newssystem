import { CHANGE } from '../constant'
const initState  = false
export default function sideReducer(preState=initState, action) {
    const { type,data } = action
    switch (type) {
        case CHANGE:
            return !data
        default:
            return preState
    }
}