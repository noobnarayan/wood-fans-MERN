import { api_url } from '../../../config';
import { storeDB, query, collection, getDoc, getDocs, doc, updateDoc, arrayUnion, arrayRemove, writeBatch } from '../../Services/firebaseConfig'
import { DATA_GET_REQUEST, DATA_GET_SUCCESS, DATA_GET_FAILURE, CART_GET_REQUEST, CART_GET_SUCCESS, CART_GET_FAILURE, WISHLIST_GET_REQUEST, WISHLIST_GET_SUCCESS, WISHLIST_GET_FAILURE } from './actionTypes';
import axios from "axios"
export const getDataRequest = () => ({ type: DATA_GET_REQUEST });
export const getDataSuccess = (data) => ({ type: DATA_GET_SUCCESS, payload: data });
export const getDataFailure = (error) => ({ type: DATA_GET_FAILURE, payload: error });

export const fetchData = () => async (dispatch) => {
    dispatch(getDataRequest());
    try {
        const response = await axios.get(
            `${api_url}/products`
        );
        dispatch(getDataSuccess(response.data.data));

    } catch (error) {
        dispatch(getDataFailure(error));
    }
};


// Do not use in cart page.
export const addToCart = (productId) => async (dispatch) => {
    const token = JSON.parse(localStorage.getItem("accessToken"));
    const payload = {
        id: productId,
        quantity: "1"
    }

    try {
        const res = await axios.post(`${api_url}/users/add-to-cart`, payload, {
            headers: { Authorization: `Bearer ${token}` },
        });
        dispatch(fetchCartData());
    } catch (error) {
        console.log(error);
    }
};


export const getCartDataRequest = () => ({ type: CART_GET_REQUEST });
export const getCartDataSuccess = (data) => ({ type: CART_GET_SUCCESS, payload: data });
export const getCartDataFailure = (error) => ({ type: CART_GET_FAILURE, payload: error });

export const fetchCartData = () => async (dispatch) => {
    const token = JSON.parse(localStorage.getItem("accessToken"));
    dispatch(getCartDataRequest());
    try {
        const res = await axios.get(`${api_url}/users/get-cart-data`, {
            headers: { Authorization: `Bearer ${token}` },
        })
        const cartData = res.data.data;
        dispatch(getCartDataSuccess(cartData));

    } catch (error) {
        console.log(error);
        dispatch(getCartDataFailure(error));
    }
};

// Do not use in cart page.
export const addToWishlist = (productId, userId) => async (dispatch) => {
    try {
        const userRef = doc(storeDB, 'users', userId);
        await updateDoc(userRef, {
            wishlist: arrayUnion(productId)
        });
    } catch (error) {
        console.log(error);
    }
};

export const removeFromWishlist = (productId, userId, moveToCart) => async (dispatch) => {
    try {
        const userRef = doc(storeDB, 'users', userId);
        const batch = writeBatch(storeDB);

        // Remove from wishlist
        batch.update(userRef, {
            wishlist: arrayRemove(productId)
        });

        // Conditionally add to cart
        if (moveToCart) {
            batch.update(userRef, {
                cart: arrayUnion({ productId, quantity: 1 })
            });
        }

        await batch.commit();
        // Optionally, dispatch actions to update the state in your Redux store
        dispatch(fetchWishlistData(userId));
        if (moveToCart) {
            dispatch(fetchCartData());
        }
    } catch (error) {
        console.log(error);
    }
};
export const adjustQuantityInCart = (productId, adjustment) => async (dispatch) => {
    const token = JSON.parse(localStorage.getItem("accessToken"));
    const payload = {
        id: productId
    }
    try {
        if (adjustment === "inc") {
            const res = await axios.post(`${api_url}/users/increase-quantity`, payload, {
                headers: { Authorization: `Bearer ${token}` },
            });
        }

        if (adjustment === "dec") {
            const res = await axios.post(`${api_url}/users/decrease-quantity`, payload, {
                headers: { Authorization: `Bearer ${token}` },
            });
        }

        dispatch(fetchCartData());
    } catch (error) {
        console.log(error);
    }
};


export const removeFromCart = (productId, wishlist) => async (dispatch) => {
    const token = JSON.parse(localStorage.getItem("accessToken"));
    const payload = { id: productId }
    try {
        const res = await axios.post(`${api_url}/users/remove-from-cart`, payload, {
            headers: { Authorization: `Bearer ${token}` },
        });
        if (res.data) {

            dispatch(fetchCartData());
        } else {
            console.log(`Product with id ${productId} not found in cart.`);
        }
    } catch (error) {
        console.log(error);
    }
};


export const getWishlistDataRequest = () => ({ type: WISHLIST_GET_REQUEST });
export const getWishlistDataSuccess = (data) => ({ type: WISHLIST_GET_SUCCESS, payload: data });
export const getWishlistDataFailure = (error) => ({ type: WISHLIST_GET_FAILURE, payload: error });

export const fetchWishlistData = (userId) => async (dispatch) => {
    dispatch(getWishlistDataRequest());
    try {
        const userRef = doc(storeDB, 'users', userId);
        const userSnap = await getDoc(userRef);
        const userData = userSnap.data();
        const wishlistData = userData.wishlist;
        dispatch(getWishlistDataSuccess(wishlistData));
    } catch (error) {
        console.log(error);
        dispatch(getWishlistDataFailure(error));
    }
};


export const postData = (dataArray) => async (dispatch) => {
    try {
        const batch = writeBatch(storeDB);
        dataArray.forEach((data) => {
            const docRef = doc(collection(storeDB, "products"));
            batch.set(docRef, data);
        });
        await batch.commit();
    } catch (error) {
        console.log(error);
    }
};
