import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { assets, dummyOrders, dummyProducts } from "../greencart_assets/assets";
import toast from "react-hot-toast";
import axios from "axios";

export const AppContext = createContext();

export const AppContextProvider = ({ children }) => {
  const navigate = useNavigate();
  const currency = import.meta.env.VITE_CURRENCY;
  const backEndUrl = import.meta.env.VITE_BACKENDURL;
  const [user, setUser] = useState(null);
  const [isSeller, setIsSeller] = useState(false);
  const [deliveryToken, setDeliveryToken] = useState(
    localStorage.getItem("dtoken") || null
  );
  const [delivererOrders, setDelivererOrders] = useState([]);
  const [showUserLogin, setShowUserLogin] = useState(false);
  const [products, setProducts] = useState([]);
  // Safe localStorage parser helper
  const safeParseJSON = (item, fallback = {}) => {
    try {
      return item ? JSON.parse(item) : fallback;
    } catch (e) {
      console.error("Failed to parse localStorage item:", e);
      return fallback;
    }
  };

  // In your AppContextProvider
  const [cartItems, setCartItems] = useState(() => {
    return safeParseJSON(localStorage.getItem("cartItems"));
  });

  const [searchQuery, setSearchQuery] = useState("");
  const [myOrders, setMyOrders] = useState([]);
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [userCount, setUserCount] = useState(0);
  const [deliveryCount, setDeliveryCount] = useState(0);
  const [userToken, setUserToken] = useState(
    localStorage.getItem("utoken") || null
  );
  const [sellerToken, setSellerToken] = useState(
    localStorage.getItem("stoken") || null
  );

  const [deliveryAmount, setDeliveryAmount] = useState(0);
  const [pendingDeliverer, setPendingDeliverer] = useState(null);
  const [totalAmount, setTotalAmount] = useState(0);

  const [clientDeliveryToken, setClientDeliveryToken] = useState(
    localStorage.getItem("dctoken") || null
  );
  const [clientSellerToken, setClientSellerToken] = useState(
    localStorage.getItem("sctoken") || null
  );
  const [customerToken, setCustomerToken] = useState(
    localStorage.getItem("cutoken") || null
  );
  const [token, setToken] = useState(
    customerToken || clientDeliveryToken || clientSellerToken
  );
  const [customer, setCustomer] = useState(
    JSON.parse(localStorage.getItem("customer")) || null
  );
  const [seller, setSeller] = useState(
    JSON.parse(localStorage.getItem("seller")) || null
  );
  const [deliveryBoy, setDeliveryBoy] = useState(() => {
    return safeParseJSON(localStorage.getItem("deliveryBoy"));
  });
  const updateCartInLocalStorage = (updatedCart) => {
    try {
      const cartToStore = JSON.stringify(updatedCart || {});
      localStorage.setItem("cartItems", cartToStore);
    } catch (error) {
      console.error("Failed to update cart in localStorage:", error);
    }
  };


  //GetPendingDeliverer
  const getPendingDeliverer = async () => {
    try {
      const { data } = await axios.get(
        `${backEndUrl}/api/deliverers/pendingDeliver`,
        {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        }
      );
      if (data.success) {
        setPendingDeliverer(data.PendingDeliverDtos);
      }
    } catch (error) {
      console.log(error);
      toast.error(error);
    }
  };

  //GetDelivererOrders
  const getDelivererOrders = async () => {
    try {
      const { data } = await axios.get(
        `${backEndUrl}/api/orders/getAllOrders`,
        {
          headers: {
            Authorization: `Bearer ${deliveryToken}`,
          },
        }
      );
      if (data.success) {
        setDelivererOrders(data.orderDtoList);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error);
    }
  };

  //GetUserCount
  const getUserCount = async () => {
    try {
      const { data } = await axios.get(
        `${backEndUrl}/api/userDetails/customerCount`,
        {
          headers: {
            Authorization: `Bearer ${sellerToken}`,
          },
        }
      );
      if (data.success) {
        setUserCount(data.count);
      } else {
        console.error("Some error retrieving the customer count");
      }
    } catch (error) {
      console.error("Some error retrieving the customer count");
    }
  };

  //GetDelivererCount
  const getDeliveryCount = async () => {
    try {
      const { data } = await axios.get(
        `${backEndUrl}/api/userDetails/delivererCount`,
        {
          headers: {
            Authorization: `Bearer ${sellerToken}`,
          },
        }
      );
      if (data.success) {
        setDeliveryCount(data.count);
      } else {
        toast.error("Some error retrieving the delivery count");
      }
    } catch (error) {
      toast.error("Some error retrieving the delivery count");
    }
  };

  //DeliverergetAmount
  const getAmount = async () => {
    try {
      const { data } = await axios.get(
        `${backEndUrl}/api/deliveries/getEarning`,
        {
          headers: {
            Authorization: `Bearer ${deliveryToken}`,
          },
        }
      );
      if (data.success) {
        setDeliveryAmount(data.amount);
      } else {
        toast.error("Some error retrieving the delivery Boy amount");
      }
    } catch (error) {
      toast.error("Some error retrieving the delivery Boy amount");
    }
  };

  //Sellergetamount
  const getTotalAmount = async () => {
    try {
      const { data } = await axios.get(`${backEndUrl}/api/orders/totalAmount`, {
        headers: {
          Authorization: `Bearer ${sellerToken}`,
        },
      });
      if (data.success) {
        setTotalAmount(data.amount);
      } else {
        toast.error("Some error retrieving the delivery Boy amount");
      }
    } catch (error) {
      toast.error("Some error retrieving the delivery Boy amount");
    }
  };

  // Fetch Seller Status
  const fetchSeller = async () => {
    try {
      const { data } = await axios.get(`${backEndUrl}/api/userDetails`, {
        headers: {
          Authorization: `Bearer ${sellerToken}`,
        },
      });
      if (data.success) {
        setIsSeller(true);
      } else {
        setIsSeller(false);
      }
    } catch (error) {
      setIsSeller(false);
    }
  };

  // Fetch User Auth Status , User Data and Cart Items
  const fetchUser = async () => {
    try {
      const { data } = await axios.get(`${backEndUrl}/api/userDetails`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log(token);
      console.log(deliveryToken);
      console.log(deliveryBoy);
      console.log(data);
      if (data.success) {
        if (data.userDto.role == "SELLER") {
          setSeller(data.userDto);
          localStorage.setItem("seller", JSON.stringify(data.userDto));
        } else if (data.userDto.role == "DELIVERER") {
          setDeliveryBoy(data.userDto);
          localStorage.setItem("deliveryBoy", JSON.stringify(data.userDto));
        } else if (data.userDto.role == "USER") {
          setCustomer(data.userDto);
          localStorage.setItem("customer", JSON.stringify(data.userDto));
        }
      }
    } catch (error) {
      setUser(null);
    }
  };

  //ForgotPassword send otp
  const sendOtp = async (email) => {
    try {
      const { data } = await axios.post(
        `${backEndUrl}/api/auth/forgotpassword/send-otp`,
        {},
        {
          params: { email },
        }
      );
      if (data.success) {
        toast.success(data.message);
        return true;
      } else {
        toast.error(data.message || "Failed to send otp your email"); // Display error if doctorDtos is missing
        return false;
      }
    } catch (error) {
      // Log error for debugging and show error message to the user
      console.error(error);
      toast.error(
        error.response?.data?.message ||
          "An error occurred while sending email to the user"
      );
      return false;
    }
  };

  //forgotpassword verify otp
  const verifyOtp = async (email, otp) => {
    try {
      const { data } = await axios.post(
        `${backEndUrl}/api/auth/forgotpassword/verify-otp`,
        {},
        {
          params: { email, otp },
        }
      );
      if (data.success) {
        toast.success(data.message);
        return true;
      } else {
        toast.error(data.message || "Wrong OTP provided"); // Display error if doctorDtos is missing
        return false;
      }
    } catch (error) {
      console.error(error);
      toast.error(
        error.response?.data?.message || "An error occurred verify  otp"
      );
      return false;
    }
  };

  //forgotpassword resetpassword
  const resetPassword = async (email, otp, newPassword) => {
    try {
      const { data } = await axios.post(
        `${backEndUrl}/api/auth/forgotpassword/reset-password`,
        {},
        {
          params: { email, newPassword, otp },
        }
      );
      if (data.success) {
        toast.success(data.message);
        return true;
      } else {
        toast.error(data.message || "Wrong OTP provided");
        return false;
        // Display error if doctorDtos is missing
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Error resetting password");
      return false;
    }
  };

  //fetch Orders
  const fetchOrders = async () => {
    try {
      const { data } = await axios.get(`${backEndUrl}/api/orders`, {
        headers: { Authorization: `Bearer ${sellerToken}` },
      });
      if (data.success) {
        setOrders(data.orderDtoList.reverse());
      }
    } catch (error) {
      console.log(error);
    }
  };

  //Fetch All Products
  const fetchProducts = async () => {
    try {
      setIsLoading(true);
      const { data } = await axios.get(`${backEndUrl}/api/product/productList`);
      if (data.success) {
        setProducts(data.productDtoList);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  //Add Product to CART
  const addToCart = (itemId) => {
    // 1. Check if user is logged in
    if (!token) {
      toast.error("Please login to add items to cart");
      setShowUserLogin(true); // Show login modal if using
      return;
    }

    // 2. Verify product exists
    const productExists = products.some((product) => product.id === itemId);
    if (!productExists) {
      toast.error("Product not found");
      return;
    }

    // 3. Optimized state update
    setCartItems((prevCartItems) => {
      const newQuantity = (prevCartItems[itemId] || 0) + 1;
      const updatedCart = { ...prevCartItems, [itemId]: newQuantity };
      updateCartInLocalStorage(updatedCart);
      toast.success(`Added to Cart (Total: ${newQuantity})`);
      return updatedCart;
    });
  };

  //update cart item quantity
  const updateCartItemQuantity = (itemId, quantity) => {
    setCartItems((prevCartItems) => {
      const updatedCart = { ...prevCartItems, [itemId]: quantity };
      updateCartInLocalStorage(updatedCart);
      toast.success("Cart updated");
      return updatedCart;
    });
  };

  //Remove from the cart
  const removeFromCart = (itemId) => {
    setCartItems((prevCartItems) => {
      const updatedCart = { ...prevCartItems };

      if (updatedCart[itemId] > 1) {
        updatedCart[itemId] -= 1;
      } else {
        delete updatedCart[itemId];
      }

      updateCartInLocalStorage(updatedCart);
      toast.success("Item removed from cart");
      return updatedCart;
    });
  };

  //Get Cart Item Count
  const getCartCount = () => {
    let totalCount = 0;
    for (const item in cartItems) {
      totalCount += cartItems[item];
    }
    return totalCount;
  };

  //Get Cart Total Amount
  const getCartAmount = () => {
    let totalAmount = 0;
    for (const items in cartItems) {
      let itemInfo = products.find((product) => product.id == items);
      if (cartItems[items] > 0) {
        totalAmount += itemInfo.offerPrice * cartItems[items];
      }
    }
    return Math.floor(totalAmount * 100) / 100;
  };

  //verify stripe
  const verifyStripe = async (success, orderId) => {
    try {
      const { data } = await axios.post(
        backEndUrl + "/api/orders/verify",
        { success, orderId },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (data.success) {
        toast.success(data.message);
        navigate("/my-orders");
      } else {
        toast.error(data.message);
        console.log(data.message);
      }
    } catch (error) {
      toast.error(error.message);
      console.log(error);
    }
  };

  //fetchMyorders
  const fetchMyOrders = async () => {
    try {
      const { data } = await axios.get(`${backEndUrl}/api/orders/user`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (data.success) {
        setMyOrders(data.orderDtoList.reverse());
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchUser();
  }, [token]);

  useEffect(() => {
    fetchSeller();
    fetchProducts();
  }, []);

  // Update Database Cart Items

  useEffect(() => {
    const updateCart = async () => {
      try {
        const { data } = await axios.put(
          `${backEndUrl}/api/cart/updateCart`,
          { cartItems }, // Request body as second argument
          {
            // Config object as third argument
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!data.success) {
          toast.error(data.message);
        }
      } catch (error) {
        toast.error(error.message);
      }
    };

    if (token) {
      updateCart();
    }
  }, [cartItems, token]);

  const value = {
    seller,
    setSeller,
    deliveryBoy,
    setDeliveryBoy,
    token,
    fetchProducts,
    navigate,
    user,
    setUser,
    isSeller,
    setIsSeller,
    setShowUserLogin,
    showUserLogin,
    products,
    currency,
    addToCart,
    removeFromCart,
    cartItems,
    searchQuery,
    setSearchQuery,
    getCartAmount,
    getCartCount,
    fetchMyOrders,
    setMyOrders,
    myOrders,
    orders,
    setOrders,
    fetchOrders,
    backEndUrl,
    userToken,
    sellerToken,
    setUserToken,
    setSellerToken,
    sendOtp,
    verifyOtp,
    resetPassword,
    setCartItems,
    fetchUser,
    verifyStripe,
    deliveryToken,
    setDeliveryToken,
    deliveryAmount,
    setDeliveryAmount,
    getAmount,
    getTotalAmount,
    totalAmount,
    getDeliveryCount,
    getUserCount,
    setDeliveryCount,
    deliveryCount,
    setUserCount,
    userCount,
    getDelivererOrders,
    delivererOrders,
    setDelivererOrders,
    pendingDeliverer,
    getPendingDeliverer,
    clientDeliveryToken,
    clientSellerToken,
    setClientDeliveryToken,
    setClientSellerToken,
    setToken,
    customerToken,
    setCustomerToken,
    customer,
    setCustomer,
    updateCartItemQuantity,
    updateCartInLocalStorage,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = () => {
  return useContext(AppContext);
};
