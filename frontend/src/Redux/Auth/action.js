// Import 
import { auth, googleProvider, storeDB, facebookProvider } from '../../Services/firebaseConfig'
import { signInWithPopup } from 'firebase/auth'
import { collection, setDoc, doc, getDoc } from 'firebase/firestore'
import { FORGOT_PASSWORD_FAILURE, FORGOT_PASSWORD_SUCCESS, GET_USER_DATA_FAILURE, GET_USER_DATA_REQUEST, GET_USER_DATA_SUCCESS, SIGN_UP_FAILURE, SIGN_UP_REQUEST, SIGN_UP_SUCCESS } from './actionType'
import axios from 'axios'
import { api_url } from "../../../config.js"

// Login Action Methods
const getUserDataRequest = () => {
     return { type: GET_USER_DATA_REQUEST }

}
const getUserDataSuccess = (payload) => {
     return { type: GET_USER_DATA_SUCCESS, payload }
}
const getUserDataFailure = (payload) => {
     return { type: GET_USER_DATA_FAILURE, payload }
}

// SignUp Action Methods
const signUpRequest = () => {
     return { type: SIGN_UP_REQUEST }

}
const signUpSuccess = (payload) => {
     return { type: SIGN_UP_SUCCESS, payload }
}
const signUpFailure = (payload) => {
     return { type: SIGN_UP_FAILURE, payload }
}

const signUpNewUser = (email, password, name) => async (dispatch) => {
     const payload = {
          name,
          email,
          password
     };

     try {
          dispatch(signUpRequest());

          const res = await axios.post(`${api_url}/users/register`, payload);
          console.log(res);


          dispatch(signUpSuccess(`Welcome, ${name}!`));
     } catch (error) {
          let errorMessage = "Sign-up failed. Please check your information and try again";
          if (error.code === "auth/email-already-in-use") {
               errorMessage = "The email address is already in use by another account. Please use a different email";
          }
          dispatch(signUpFailure(errorMessage));
     }
}


const loginWithEmailAndPassword = (email, password, onSuccess) => async (dispatch) => {
     const payload = {
          email,
          password
     }
     try {
          const res = await axios.post(`${api_url}/users/login`, payload);
          const token = res.data.data.accessToken
          localStorage.setItem("accessToken", JSON.stringify(token))
          dispatch(getUserData())
          onSuccess()
     } catch (error) {
          console.log(error);
     }
}
const getUserData = () => async (dispatch) => {
     const token = JSON.parse(localStorage.getItem("accessToken"));
     try {
          dispatch(getUserDataRequest())
          const res = await axios.get(`${api_url}/users/get-user`, {
               headers: { Authorization: `Bearer ${token}` },
          });

          if (res.data) {
               dispatch(getUserDataSuccess(res.data.data))
          }

     } catch (error) {
          console.log(`Error while fetching user data: ${error}`);
          dispatch(getUserDataFailure(error))
     }
}


const loginWithGoogle = (onRedirect) => async (dispatch) => {
     try {
          dispatch(signUpRequest());

          const result = await signInWithPopup(auth, googleProvider);

          // Assuming you have a 'users' collection in Firestore
          const usersCollection = collection(storeDB, 'users');
          const userId = result.user.uid;

          const userDocRef = doc(usersCollection, userId);

          // Check if the user exists in Firestore
          const userDocSnapshot = await getDoc(userDocRef);

          if (!userDocSnapshot.exists()) {
               // If the user doesn't exist, add their data
               await setDoc(userDocRef, {
                    name: result.user.displayName,
                    email: result.user.email,
                    cart: [],
                    wishlist: [],
                    order: [],
               });
          }
          dispatch(signUpSuccess(`Welcome, ${result.user.displayName}!`));
          onRedirect()

     } catch (error) {
          let errorMessage = "Sign-up failed. Please check your information and try again";
          if (error.code === "auth/email-already-in-use") {
               errorMessage = "The email address is already in use by another account. Please use a different email";
          }
          dispatch(signUpFailure(errorMessage));

     }
};

export {
     loginWithEmailAndPassword,
     loginWithGoogle,
     signUpNewUser,
     getUserData
}