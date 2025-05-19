import React, { useEffect, useState } from "react";
import { useAppContext } from "../context/AppContext";
import { assets, dummyAddress } from "../greencart_assets/assets";
import toast from "react-hot-toast";
import axios from "axios";

const Cart = () => {
  const {
    products,
    currency,
    cartItems,
    removeFromCart,
    getCartCount,
    updateCartItemQuantity,
    navigate,
    getCartAmount,
    isLoading,
    userToken,
    backEndUrl,
    token,
    setCartItems,
    updateCartInLocalStorage,
  } = useAppContext();
  const [cartArray, setCartArray] = useState([]);
  const [addresses, setAddresses] = useState([]);
  const [showAddress, setShowAddress] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [paymentOption, setPaymentOption] = useState("COD");

  const getCart = () => {
    if (!cartItems || !products) {
      setCartArray([]);
      return;
    }
    const tempArray = Object.keys(cartItems)
      .map((key) => {
        const product = products.find(
          (item) => item.id.toString() === key.toString()
        );
        return product ? { ...product, quantity: cartItems[key] } : null;
      })
      .filter(Boolean);

    setCartArray(tempArray);
  };

  useEffect(() => {
    if (cartItems) {
      getCart();
    }
  }, [cartItems, products]);

  const getUserAddress = async () => {
    try {
      const { data } = await axios.get(`${backEndUrl}/api/user/getAddress`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (data.success) {
        setAddresses(data.addressDtoList);
        if (data.addressDtoList.length > 0) {
          setSelectedAddress(data.addressDtoList[0]);
        }
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    if (token) {
      getUserAddress();
    }
  }, [token]);

  const placeOrder = async () => {
    try {
      if (!selectedAddress) {
        return toast.error("Please select an address");
      }

      // Place Order with COD
      if (paymentOption === "COD") {
        const { data } = await axios.post(
          `${backEndUrl}/api/orders/placeOrder`,
          {
            items: cartArray.map((item) => ({
              product: item,
              quantity: item.quantity,
            })),
            address: selectedAddress,
          },
          {
            headers: {
              Authorization: token ? `Bearer ${token}` : "",
            },
          }
        );

        if (data.success) {
          try {
            const { data: deliveryData } = await axios.post(
              `${backEndUrl}/api/deliveries/assign/${data.orderDto.id}`,
              {},
              {
                headers: {
                  Authorization: token ? `Bearer ${token}` : "",
                },
              }
            );
            if (deliveryData.success) {
              toast.success("Order successfully and is waiting for deliverers");
              setCartItems({});
              updateCartInLocalStorage({});
              navigate("/my-orders");
            }
          } catch (error) {
            console.log(error.message);
            toast.error(error.message);
          }
        } else {
          toast.error(data.message);
        }
      } else if (paymentOption === "STRIPE") {
        // Place Order with Stripe
        const { data } = await axios.post(
          `${backEndUrl}/api/orders/pay`,
          {
            items: cartArray.map((item) => ({
              product: item,
              quantity: item.quantity,
            })),
            address: selectedAddress,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (data.success) {
          window.location.replace(data.stripeUrl);
        } else {
          toast.error(data.message);
        }
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  // Loading state
  if (isLoading)
    return (
      <div className="flex flex-col items-center justify-center p-8 bg-white rounded-lg shadow-sm max-w-md mx-auto mt-10">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500 mb-3"></div>
        <p className="text-gray-600 font-medium">Loading products...</p>
      </div>
    );

  // Empty products state
  if (!products.length)
    return (
      <div className="text-center p-8 bg-white rounded-lg shadow-sm max-w-md mx-auto mt-10">
        <div className="text-4xl mb-3">🛒</div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          No products available
        </h3>
        <p className="text-gray-500 mb-4">Check back later for new arrivals</p>
      </div>
    );

  // Empty cart state
  if (!cartItems || !Object.keys(cartItems).length) {
    return (
      <div className="text-center p-8 bg-white rounded-lg shadow-sm max-w-md mx-auto mt-10">
        <div className="text-4xl mb-3">🛍️</div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          Your cart is empty
        </h3>
        <p className="text-gray-500 mb-4">
          Start shopping to add items to your cart
        </p>
        <button
          onClick={() => navigate("/products")}
          className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dull transition-colors focus:outline-none focus:ring-2 focus:ring-bg-primary focus:ring-offset-2"
        >
          Continue Shopping
        </button>
      </div>
    );
  }

  return products.length > 0 && cartItems ? (
    <div className="flex flex-col md:flex-row mt-16">
      <div className="flex-1 max-w-4xl">
        <h1 className="text-3xl font-medium mb-6">
          Shopping Cart
          <span className="text-sm text-primary">{getCartCount()} Items</span>
        </h1>

        <div className="grid grid-cols-[2fr_1fr_1fr] text-gray-500 text-base font-medium pb-3">
          <p className="text-left">Product Details</p>
          <p className="text-center">Subtotal</p>
          <p className="text-center">Action</p>
        </div>

        {cartArray.map((product, index) => (
          <div
            key={index}
            className="grid grid-cols-[2fr_1fr_1fr] text-gray-500 items-center text-sm md:text-base font-medium pt-3"
          >
            <div className="flex items-center md:gap-6 gap-3">
              <div
                onClick={() => {
                  navigate(
                    `/products/${product.category.toLowerCase()}/${product.id}`
                  );
                  scrollTo(0, 0);
                }}
                className="cursor-pointer w-24 h-24 flex items-center justify-center border border-gray-300 rounded"
              >
                <img
                  className="max-w-full h-full object-cover"
                  src={product.image[0]}
                  alt={product.name}
                />
              </div>
              <div>
                <p className="hidden md:block font-semibold">{product.name}</p>
                <div className="font-normal text-gray-500/70">
                  <p>
                    Weight: <span>{product.weight || "N/A"}</span>
                  </p>
                  <div className="flex items-center">
                    <p>Qty:</p>
                    <select
                      onChange={(e) =>
                        updateCartItemQuantity(
                          product.id,
                          Number(e.target.value)
                        )
                      }
                      className="outline-none"
                      value={cartItems[product.id]}
                    >
                      {Array(
                        cartItems[product.id] > 9 ? cartItems[product.id] : 9
                      )
                        .fill("")
                        .map((_, index) => (
                          <option key={index} value={index + 1}>
                            {index + 1}
                          </option>
                        ))}
                    </select>
                  </div>
                </div>
              </div>
            </div>
            <p className="text-center">
              {currency}
              {product.offerPrice * product.quantity}
            </p>
            <button className="cursor-pointer mx-auto">
              <img
                onClick={() => removeFromCart(product.id)}
                src={assets.remove_icon}
                className="inline-block w-6 h-6"
                alt=""
              />
            </button>
          </div>
        ))}

        <button
          onClick={() => {
            navigate("/products");
            scrollTo(0, 0);
          }}
          className="group cursor-pointer flex items-center mt-8 gap-2 text-primary font-medium"
        >
          <img
            src={assets.arrow_right_icon_colored}
            alt="arrow"
            className="group-hover:-translate-x-1 transition"
          />
          Continue Shopping
        </button>
      </div>

      <div className="max-w-[360px] w-full bg-gray-100/40 p-5 max-md:mt-16 border border-gray-300/70">
        <h2 className="text-xl md:text-xl font-medium">Order Summary</h2>
        <hr className="border-gray-300 my-5" />

        <div className="mb-6">
          <p className="text-sm font-medium uppercase">Delivery Address</p>
          <div className="relative flex justify-between items-start mt-2">
            <p className="text-gray-500">
              {selectedAddress
                ? `${selectedAddress.street},${selectedAddress.city},${selectedAddress.state},${selectedAddress.country}`
                : "No Address Found"}
            </p>
            <button
              onClick={() => setShowAddress(!showAddress)}
              className="text-primary hover:underline cursor-pointer"
            >
              Change
            </button>
            {showAddress && (
              <div className="absolute top-12 py-1 bg-white border border-gray-300 text-sm w-full">
                {addresses.map((address, index) => (
                  <p
                    onClick={() => {
                      setSelectedAddress(address);
                      setShowAddress(false);
                    }}
                    className="text-gray-500 p-2 hover:bg-gray-100"
                  >
                    {address.street}, {address.city}, {address.state},{" "}
                    {address.country}
                  </p>
                ))}
                <p
                  onClick={() => navigate("/addAddress")}
                  className="text-primary text-center cursor-pointer p-2 hover:bg-primary/10"
                >
                  Add address
                </p>
              </div>
            )}
          </div>

          <p className="text-sm font-medium uppercase mt-6">Payment Method</p>

          <select
            onChange={(e) => setPaymentOption(e.target.value)}
            className="w-full border border-gray-300 bg-white px-3 py-2 mt-2 outline-none"
          >
            <option value="COD">Cash On Delivery</option>
            <option value="STRIPE">Online Payment</option>
          </select>
        </div>

        <hr className="border-gray-300" />

        <div className="text-gray-500 mt-4 space-y-2">
          <p className="flex justify-between">
            <span>Price</span>
            <span>
              {currency}
              {getCartAmount()}
            </span>
          </p>
          <p className="flex justify-between">
            <span>Shipping Fee</span>
            <span className="text-green-600">Free</span>
          </p>
          <p className="flex justify-between">
            <span>Tax (2%)</span>
            <span>
              {currency}
              {(getCartAmount() * 2) / 100}
            </span>
          </p>
          <p className="flex justify-between text-lg font-medium mt-3">
            <span>Total Amount:</span>
            <span>
              {currency}
              {getCartAmount() + getCartAmount() * (2 / 100)}
            </span>
          </p>
        </div>

        <button
          onClick={placeOrder}
          className="w-full py-3 mt-6 cursor-pointer bg-primary text-white font-medium hover:bg-indigo-600 transition"
        >
          {paymentOption == "COD" ? "place Order" : "Proceed to Checkout"}
        </button>
      </div>
    </div>
  ) : null;
};

export default Cart;
