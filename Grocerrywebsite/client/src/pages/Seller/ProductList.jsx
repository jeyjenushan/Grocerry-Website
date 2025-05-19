import React, { useEffect, useState } from "react";
import { useAppContext } from "../../context/AppContext";
import toast from "react-hot-toast";
import axios from "axios";

const ProductList = () => {
  const { products, currency, fetchProducts, backEndUrl, sellerToken } =
    useAppContext();

  useEffect(() => {
    fetchProducts();
  }, []);

  const updateProduct = async (id, updatedFields) => {
    try {
      const { data } = await axios.put(
        `${backEndUrl}/api/product/update/${id}`,
        updatedFields,
        {
          headers: {
            Authorization: `Bearer ${sellerToken}`,
            "Content-Type": "application/json",
          },
        }
      );
      if (data.success) {
        fetchProducts();
        toast.success(data.message);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
  };

  const handleStockToggle = (product) => {
    updateProduct(product.id, {
      price: product.price,
      offerPrice: product.offerPrice,
      stock: !product.inStock,
    });
  };

  const handlePriceChange = (product, field, value) => {
    const updatedFields = {
      price: field === "price" ? value : product.price,
      offerPrice: field === "offerPrice" ? value : product.offerPrice,
      stock: product.inStock,
    };
    updateProduct(product.id, updatedFields);
  };

  return products ? (
    <div className="no-scrollbar flex-1 h-[95vh] overflow-y-scroll flex flex-col justify-between">
      <div className="w-full md:p-10 p-4">
        <h2 className="pb-4 text-lg font-medium">All Products</h2>
        <div className="flex flex-col items-center max-w-4xl w-full overflow-hidden rounded-md bg-white border border-gray-500/20">
          <table className="md:table-auto table-fixed w-full overflow-hidden">
            <thead className="text-gray-900 text-sm text-left">
              <tr>
                <th className="px-4 py-3 font-semibold truncate">Product</th>
                <th className="px-4 py-3 font-semibold truncate">Category</th>
                <th className="px-4 py-3 font-semibold truncate">Price</th>
                <th className="px-4 py-3 font-semibold truncate">
                  Offer Price
                </th>
                <th className="px-4 py-3 font-semibold truncate">In Stock</th>
              </tr>
            </thead>
            <tbody className="text-sm text-gray-500">
              {products.map((product) => (
                <tr
                  key={product.id}
                  className="border-t border-gray-500/20 hover:bg-gray-50"
                >
                  <td className="md:px-4 pl-2 md:pl-4 py-3 flex items-center space-x-3 truncate">
                    <div className="border border-gray-300 rounded p-2">
                      <img
                        src={product.image[0]}
                        alt="Product"
                        className="w-16"
                      />
                    </div>
                    <span className="truncate w-full">{product.name}</span>
                  </td>
                  <td className="px-4 py-3">{product.category}</td>
                  <td className="px-4 py-3">
                    <input
                      type="number"
                      value={product.price}
                      onChange={(e) =>
                        handlePriceChange(
                          product,
                          "price",
                          parseFloat(e.target.value)
                        )
                      }
                      className="w-20 p-1 border rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  </td>
                  <td className="px-4 py-3">
                    <input
                      type="number"
                      value={product.offerPrice}
                      onChange={(e) =>
                        handlePriceChange(
                          product,
                          "offerPrice",
                          parseFloat(e.target.value)
                        )
                      }
                      className="w-20 p-1 border rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  </td>
                  <td className="px-4 py-3">
                    <label className="relative inline-flex items-center cursor-pointer text-gray-900 gap-3">
                      <input
                        onChange={() => handleStockToggle(product)}
                        checked={product.inStock}
                        type="checkbox"
                        className="sr-only peer"
                      />
                      <div className="w-12 h-7 bg-slate-300 rounded-full peer peer-checked:bg-blue-600 transition-colors duration-200"></div>
                      <span className="dot absolute left-1 top-1 w-5 h-5 bg-white rounded-full transition-transform duration-200 ease-in-out peer-checked:translate-x-5"></span>
                    </label>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  ) : (
    <div className="flex flex-col items-center justify-center p-10">
      <p className="text-gray-500 text-lg">No Products found</p>
    </div>
  );
};

export default ProductList;
