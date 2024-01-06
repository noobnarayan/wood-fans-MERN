import { FORGOT_PASSWORD_FAILURE, GET_USER_DATA_FAILURE, GET_USER_DATA_REQUEST, GET_USER_DATA_SUCCESS, SIGN_UP_FAILURE, SIGN_UP_REQUEST, SIGN_UP_SUCCESS, FORGOT_PASSWORD_SUCCESS, SET_USER_DATA_REQUEST, SET_USER_DATA_SUCCESS, SET_USER_DATA_FAILURE } from "./actionType"

const initalState = {
     isAuth: false,
     errorMessage: "",
     loading: false,
     userData: null,
}
export const authReducer = (state = initalState, { type, payload }) => {
     switch (type) {
          case GET_USER_DATA_REQUEST:
               return {
                    ...state,
                    loading: true
               }
          case GET_USER_DATA_SUCCESS:
               return {
                    ...state,
                    isAuth: true,
                    userData: payload,
                    loading: false
               }
          case GET_USER_DATA_FAILURE:
               return {
                    ...state,
                    loading: false,
                    errorMessage: payload
               }

          case SIGN_UP_REQUEST:
               return {
                    ...state,
                    loading: true
               }
          case SIGN_UP_SUCCESS:
               return {
                    ...state,
                    isAuth: true,
                    successMessage: payload,
                    loading: false
               }
          case SIGN_UP_FAILURE:
               return {
                    ...state,
                    loading: false,
                    errorMessage: payload
               }
          case FORGOT_PASSWORD_FAILURE:
               return {
                    ...state,
                    errorMessage: payload
               }
          case FORGOT_PASSWORD_SUCCESS:
               return {
                    ...state,
                    successMessage: payload
               }
          case SET_USER_DATA_REQUEST:
               return {
                    ...state,
                    loading: true
               }
          case SET_USER_DATA_SUCCESS:
               return {
                    ...state,
                    uid: payload.uid,
                    userData: payload.userData,
                    loading: false
               }
          case SET_USER_DATA_FAILURE:
               return {
                    ...state,
                    loading: false,
                    errorMessage: payload
               }

          default:
               return initalState
     }
}
