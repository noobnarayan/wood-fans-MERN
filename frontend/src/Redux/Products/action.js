import { api_url } from '../../../config';
import { storeDB, collection, writeBatch } from '../../Services/firebaseConfig'
import { DATA_GET_REQUEST, DATA_GET_SUCCESS, DATA_GET_FAILURE, CART_GET_REQUEST, CART_GET_SUCCESS, CART_GET_FAILURE, WISHLIST_GET_REQUEST, WISHLIST_GET_SUCCESS, WISHLIST_GET_FAILURE } from './actionTypes';
import axios from "axios"

const token = JSON.parse(localStorage.getItem("accessToken"));
// console.log(token);
export const getDataRequest = () => ({ type: DATA_GET_REQUEST });
export const getDataSuccess = (data) => ({ type: DATA_GET_SUCCESS, payload: data });
export const getDataFailure = (error) => ({ type: DATA_GET_FAILURE, payload: error });

export const fetchData = () => async (dispatch) => {
    if (token) {
        dispatch(getDataRequest());
        try {
            const response = await axios.get(
                `${api_url}/products`
            );
            dispatch(getDataSuccess(response.data.data));

        } catch (error) {
            dispatch(getDataFailure(error));
        }
    }

};

export const addToCart = (productId) => async (dispatch) => {
    const payload = {
        id: productId,
        quantity: "1"
    }
    if (token) {
        try {
            const res = await axios.post(`${api_url}/users/add-to-cart`, payload, {
                headers: { Authorization: `Bearer ${token}` },
            });
            dispatch(fetchCartData());
        } catch (error) {
            console.log(error);
        }
    }

};


export const getCartDataRequest = () => ({ type: CART_GET_REQUEST });
export const getCartDataSuccess = (data) => ({ type: CART_GET_SUCCESS, payload: data });
export const getCartDataFailure = (error) => ({ type: CART_GET_FAILURE, payload: error });

export const fetchCartData = () => async (dispatch) => {
    if (token) {
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
    }
};

export const addToWishlist = (productId) => async (dispatch) => {
    if (token) {
        const payload = { id: productId }
        try {
            const res = await axios.post(`${api_url}/users/add-to-wishlist`, payload, {
                headers: { Authorization: `Bearer ${token}` },
            });
        } catch (error) {
            console.log(error);
        }
    }
};

export const removeFromWishlist = (productId, moveToCart) => async (dispatch) => {
    if (token) {
        const payload = { id: productId }
        try {
            const res = await axios.post(`${api_url}/users/remove-from-wishlist`, payload, {
                headers: { Authorization: `Bearer ${token}` },
            });
            dispatch(fetchWishlistData());
            if (moveToCart) {
                dispatch(fetchCartData());
            }
        } catch (error) {
            console.log(error);
        }
    }
};
export const adjustQuantityInCart = (productId, adjustment) => async (dispatch) => {
    if (token) {
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
    }
};


export const removeFromCart = (productId, wishlist) => async (dispatch) => {
    if (token) {
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
    }
};


export const getWishlistDataRequest = () => ({ type: WISHLIST_GET_REQUEST });
export const getWishlistDataSuccess = (data) => ({ type: WISHLIST_GET_SUCCESS, payload: data });
export const getWishlistDataFailure = (error) => ({ type: WISHLIST_GET_FAILURE, payload: error });

export const fetchWishlistData = () => async (dispatch) => {
    if (token) {
        dispatch(getWishlistDataRequest());
        try {
            const res = await axios.get(`${api_url}/users/get-wishlist-data`, {
                headers: { Authorization: `Bearer ${token}` },
            })
            const wishlistData = res.data.data

            dispatch(getWishlistDataSuccess(wishlistData));
        } catch (error) {
            console.log(error);
            dispatch(getWishlistDataFailure(error));
        }
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
