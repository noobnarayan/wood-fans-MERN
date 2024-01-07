import axios from 'axios';
import { api_url } from '../../../config';
export function filterByCategoryAndNameLength(category, setCurrentProducts, productData) {
    if (!productData) {
        return;
    }

    const filteredData = productData.filter(
        (item) =>
            item?.category?.toLowerCase() === category?.toLowerCase() &&
            item.name.length <= 20
    );

    for (let i = filteredData.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [filteredData[i], filteredData[j]] = [filteredData[j], filteredData[i]];
    }

    const randomProducts = filteredData.slice(0, 4);
    setCurrentProducts(randomProducts);
}

export const fetchSingleProductData = async (productId, setMainImg, setItemData) => {
    try {
        const product = await axios.get(`${api_url}/products/${productId}`)
        setMainImg(product.data.data.images);
        setItemData({ id: productId, ...product.data.data });
    } catch (error) {
        console.error("Error fetching product data:", error);
    }
};

export const fetchPricesAndCalculateSubtotal = async (cartData, setSubtotalValue, setCartTotal) => {
    try {
        let subtotal = 0;
        for (const item of cartData) {
            const product = await axios.get(`${api_url}/products/${item.productId}`)

            if (product.data) {
                subtotal += product.data.data.price * item.quantity;
            } else {
                console.log(`No document found for productId: ${item.productId}`);
            }
        }
        setSubtotalValue(subtotal);
        setCartTotal(subtotal)
    } catch (error) {
        console.error("Error fetching product prices:", error);
    }
};

