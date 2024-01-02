import { useEffect, useState } from "react";
import { auth } from "../Services/firebaseConfig";
import { useDispatch } from "react-redux";
import { adjustQuantityInCart } from "../Redux/Products/action";
import { fetchSingleProductData } from "./Common/common";

const Cartitem = ({ product, btnOnClick }) => {
  const { productId, quantity } = product;
  const [itemData, setItemData] = useState({});
  const [mainImg, setMainImg] = useState([]);
  const dispatch = useDispatch();
  const userId = auth?.currentUser?.uid;
  useEffect(() => {
    fetchSingleProductData(productId, setMainImg, setItemData);
  }, [productId]);
  const { category, name, price } = itemData;

  const increaseQuantity = () => {
    dispatch(adjustQuantityInCart(productId, userId, 1));
  };
  const decreaseQuantity = () => {
    dispatch(adjustQuantityInCart(productId, userId, -1));
  };

  return (
    <div className="bg-gray-100 rounded-lg my-2 p-2">
      <div className="flex flex-wrap justify-between items-center">
        <div className="flex max-sm:w-full W-5/12 items-center">
          <div className="w-32">
            <img
              className="object-cover max-w-full max-h-full "
              src={mainImg[0]}
            ></img>
          </div>
          <div className="px-2">
            <p className="font-semibold text-xl">{name}</p>
            <p className="font-normal text-sm opacity-60">{category}</p>
            <div className="flex flex-wrap gap-2 py-5">
              <button
                onClick={() => {
                  btnOnClick("Remove", productId, userId);
                }}
                className="text-xs bg-primary-yellow p-1 rounded-sm cursor-pointer hover:text-white"
              >
                Remove From Cart
              </button>
              <button
                onClick={() => {
                  btnOnClick("Wishlist", productId, userId);
                }}
                className="text-xs bg-primary-yellow p-1 rounded-sm text-white cursor-pointer hover:text-black"
              >
                Move To WishList
              </button>
            </div>
          </div>
        </div>
        <div className="text-center">
          <div className="flex justify-between w-20">
            <button
              className="bg-black text-white rounded-md w-7 "
              onClick={() => {
                increaseQuantity();
              }}
            >
              +
            </button>
            <h2 className="font-semibold">{quantity}</h2>
            <button
              className={`bg-black text-white rounded-md w-6 ${
                quantity < 2 ? "hover:cursor-not-allowed" : ""
              }`}
              onClick={() => {
                if (quantity > 0) {
                  decreaseQuantity();
                }
              }}
              disabled={quantity < 2}
            >
              -
            </button>
          </div>
        </div>
        <div className="text-right">
          <h2 className="font-semibold">₹ {price}</h2>
          <h2 className="opacity-50 line-through font-light ">
            ₹ {price * 1.23}
          </h2>
          <h2 className="text-green-500">18%</h2>
        </div>
      </div>
    </div>
  );
};
export default Cartitem;
