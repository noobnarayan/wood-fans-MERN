import React, { useRef } from "react";
import Button from "../Common/Button";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import {
  addToCart,
  addToWishlist,
  fetchWishlistData,
  removeFromWishlist,
} from "../../Redux/Products/action";
import PopupMessage from "../Common/PopupMessage";
import { useEffect } from "react";
import { getUserData } from "../../Redux/Auth/action";
function SingleProductCard({ product, redirectToDetail }) {
  const [wishListClicked, setWishListClicked] = useState(false);
  const { userData } = useSelector((store) => store.authReducer);
  const userId = useRef(null);

  useEffect(() => {
    userId.current = userData?._id;
  }, [userData]);

  useEffect(() => {
    dispatch(getUserData());
  }, []);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const productId = product._id;
  const [showPopup, setShowPopup] = useState(false);

  const { wishlistData, loading } = useSelector(
    (store) => store.wishlistReducer
  );
  const changeWishListState = () => {
    setWishListClicked((pre) => !pre);
  };
  const handleAddToCart = (productId) => {
    if (userId.current) {
      dispatch(addToCart(productId));
      setShowPopup(true);
      setTimeout(() => setShowPopup(false), 1000);
    } else {
      navigate("/login");
    }
  };

  const handleAddToWishList = (productId, userId) => {
    if (userId.current) {
      if (wishListClicked) {
        dispatch(removeFromWishlist(productId, userId));
      } else {
        dispatch(addToWishlist(productId, userId));
      }
      changeWishListState();
    } else {
      navigate("/login");
    }
  };
  useEffect(() => {
    if (userId) {
      dispatch(fetchWishlistData(userId));
    }
  }, [userId, dispatch]);

  useEffect(() => {
    if (!loading) {
      const isInWishlist = wishlistData.includes(productId);
      setWishListClicked(isInWishlist);
    }
  }, [wishlistData, productId, loading]);

  return (
    <div className="shadow-sm shadow-gray-300 overflow-hidden">
      {showPopup && <PopupMessage message={"Product added to cart!"} />}
      <div>
        <div className="relative overflow-hidden h-[22rem]">
          <div className="absolute top-1 right-1 w-10 h-8 p-1 z-10">
            <i
              className={`fa-${
                wishListClicked ? "solid" : "regular"
              } fa-heart text-xl cursor-pointer opacity-100 ${
                wishListClicked ? "text-red-400" : "text-gray-700"
              }`}
              onClick={() => handleAddToWishList(productId, userId)}
            ></i>
          </div>

          <img
            src={product.images[0]}
            alt={product.name}
            className="w-full object-cover border transform transition duration-500 hover:scale-105 hover:cursor-pointer"
            onClick={() => redirectToDetail(product._id, product.name)}
          />
        </div>

        <div className="pt-5 pb-1 px-3 md:px-2 flex  justify-between text-lg ">
          <h4
            className="lg:font-semibold font-normal lg:px-3 hover:cursor-pointer"
            onClick={() => redirectToDetail(product._id, product.name)}
          >
            {product.name}
          </h4>
          <p className="text-gray-700 lg:px-5 md:pl-5">Rs. {product.price}</p>
        </div>
      </div>
      <div
        className="flex justify-between lg:p-4 p-2 hover:cursor-pointer"
        onClick={() => handleAddToCart(productId, userId)}
      >
        <Button
          text={"Add to Cart"}
          className="bg-gray-600  text-white hover:text-gray-700 rounded-md hover:border-2 hover:border-gray-500"
        />
      </div>
    </div>
  );
}

export default SingleProductCard;
