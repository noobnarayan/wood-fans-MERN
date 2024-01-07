import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Home from "../Pages/Home";
import LoginAndSignup from "../Pages/SignUp&Login/LoginAndSignup";
import Cart from "../Pages/Cart";
import ProductPage from "../Components/ProductPage/ProductPage";
import SingleProduct from "../Pages/SingleProduct";
import UserProfile from "..//Pages/UserProfile";
import OrderConfirmation from "../Components/OrderConfirmation";
import Checkout from "../Pages/Checkout";
import { useSelector } from "react-redux";

const AllRoutes = () => {
  const { isAuth } = useSelector((store) => store.authReducer);

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route
        path="/login"
        element={isAuth ? <Navigate to="/" /> : <LoginAndSignup />}
      />
      <Route path="/products/:category" element={<ProductPage />} />
      <Route path="/product/:id" element={<SingleProduct />} />
      <Route path="/cart" element={<Cart />} />
      <Route path="/success" element={<OrderConfirmation />} />
      <Route
        path="/user/profile"
        element={isAuth ? <UserProfile /> : <Navigate to="/login" />}
      />
      <Route
        path="/checkout"
        element={isAuth ? <Checkout /> : <Navigate to="/login" />}
      />
    </Routes>
  );
};

export { AllRoutes };
