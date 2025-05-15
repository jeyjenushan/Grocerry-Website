import axios from "axios";
import React, { useContext, useEffect, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAppContext } from "../context/AppContext";

const Verify = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const success = searchParams.get("success");
  const orderId = searchParams.get("orderId");
  const {
    verifyStripe,
    navigate,
    setCartItems,
    backEndUrl,
    cartItems,
    updateCartInLocalStorage,
    token,
  } = useAppContext();

  /*  useEffect(() => {
    const verifyPayment = async () => {
      if (token && orderId && success && !hasVerified.current) {
        hasVerified.current = true; // Mark as verified

        try {
          await verifyStripe(success, orderId);

          try {
            const deliveryResponse = await axios.post(
              `${backEndUrl}/api/deliveries/assign/${orderId}`,
              {},
              {
                headers: {
                  Authorization: token ? `Bearer ${token}` : "",
                },
              }
            );

            if (deliveryResponse.data.success) {
              toast.success("Order is waiting for deliverers");
            
            }
          } catch (error) {
            toast.error(error.response?.data?.message || error.message);
          }
        } catch (error) {
          toast.error(error.message || "Payment verification failed");
          navigate("/cart");
        }
      }
    };

    verifyPayment();
  }, [token, orderId, success, verifyStripe, navigate]); */

  const hasVerified = useRef(false);
  useEffect(() => {
    const verifyPayment = async () => {
      if (token && orderId && success && !hasVerified.current) {
        hasVerified.current = true; // Mark as verified
        const result = await verifyStripe(success, orderId);
        setCartItems((prev) => {
          updateCartInLocalStorage({});
          return {};
        });
        try {
          const { data } = await axios.post(
            `${backEndUrl}/api/deliveries/assign/${orderId}`,
            {},
            {
              headers: {
                Authorization: token ? `Bearer ${token}` : "",
              },
            }
          );
          if (data.success) {
            toast.success("Order is waiting for deliverers");
          }
        } catch (error) {
          toast.error(error.message);
        }
        navigate("/my-orders");
      }
    };

    verifyPayment();
  }, [token, orderId, success, verifyStripe, navigate]);

  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="w-20 h-20 border-4 border-gray-300 border-t-4 border-t-primary rounded-full animate-spin"></div>
    </div>
  );
};

export default Verify;
