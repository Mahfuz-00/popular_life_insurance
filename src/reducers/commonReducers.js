
import { HIDE_LOADING, SHOW_LOADING } from './../constants/commonConstants';

export const loadingReducer = (state = { loading: false }, action) => {
    switch (action.type) {
        case SHOW_LOADING:
            return {
                loading: true,
            }

        case HIDE_LOADING:
            return {
                loading: false,
            }

        default:
            return state
    }
    return {
        loading: action.payload,
    }
}