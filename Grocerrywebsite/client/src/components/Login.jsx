import React, { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { Oval } from "react-loader-spinner";
import { FaTimes } from "react-icons/fa";
import { useAppContext } from "../context/AppContext";
import { motion } from "framer-motion";
import { assets } from "../greencart_assets/assets";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [otpBar, setOtpBar] = useState(false);
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [remember, setRemember] = useState(false);
  const {
    navigate,
    backEndUrl,
    setIsSeller,
    setSeller,
    setDeliveryBoy,
    setToken,
    setCustomerToken,
    setClientDeliveryToken,
    setClientSellerToken,
    setCustomer,
    updateCartInLocalStorage,
    setCartItems
  } = useAppContext();

  useEffect(() => {
    const rememberedEmail = localStorage.getItem("rememberedEmail");
    const rememberedPassword = localStorage.getItem("rememberedPassword");

    if (rememberedEmail && rememberedPassword) {
      setFormData({
        email: rememberedEmail,
        password: rememberedPassword,
      });
      setRemember(true);
    }
  }, []);

  function handleChange(e) {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }

  const handleOtpChange = (e, index) => {
    const value = e.target.value;
    const updatedOtp = [...otp];
    updatedOtp[index] = value;
    setOtp(updatedOtp);
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data } = await axios.post(
        backEndUrl + "/api/auth/login",
        formData
      );
      const role = data.userDto.role;

      console.log(data);

      if (remember) {
        localStorage.setItem("rememberedEmail", formData.email);
        localStorage.setItem("rememberedPassword", formData.password);
      } else {
        localStorage.removeItem("rememberedEmail");
        localStorage.removeItem("rememberedPassword");
      }

      if (role === "USER") {
        setCustomerToken(data.token);
        localStorage.setItem("cutoken", data.token);
        updateCartInLocalStorage(data.userDto.cartItems);
  setCartItems(data.userDto.cartItems)
        setCustomer(data.userDto);
        setToken(data.token);
        navigate("/");
      } else if (role === "DELIVERER") {
        setClientDeliveryToken(data.token);
        localStorage.setItem("dctoken", data.token);
        setDeliveryBoy(data.userDto);
         setCartItems(data.userDto.cartItems)
        updateCartInLocalStorage(data.userDto.cartItems);
       
        setToken(data.token);
        navigate("/");
      } else if (role === "SELLER") {
        setClientSellerToken(data.token);
        localStorage.setItem("sctoken", data.token);
        setIsSeller(true);
        setSeller(data.userDto);
          setCartItems(data.userDto.cartItems)
        updateCartInLocalStorage(data.userDto.cartItems);
        setToken(data.token);
        navigate("/");
      } else {
        toast.error("Unauthorized role cannot access this website.");
      }
    } catch (err) {
      console.error(err);
      toast.error("Login failed. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        when: "beforeChildren",
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 10,
      },
    },
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50">
      {/* Background Image with Motion */}
      <motion.div
        className="absolute inset-0 bg-opacity-70 bg-black"
        style={{
          backgroundImage: `url(${assets.backgroundImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundAttachment: "fixed",
          backgroundRepeat: "no-repeat",
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.5 }}
        transition={{ duration: 1 }}
      />

      <motion.div
        className="w-full max-w-md relative z-10"
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 100, damping: 10 }}
      >
        <motion.div
          className="bg-white bg-opacity-90 backdrop-blur-sm rounded-xl shadow-2xl overflow-hidden"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Grocery-themed header with motion */}
          <motion.div
            className="bg-gradient-to-r from-green-600 to-green-500 py-6 px-6 text-center"
            variants={itemVariants}
          >
            <motion.h2
              className="text-3xl font-bold text-white"
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring" }}
            >
              <span className="text-yellow-300">Fresh</span>Cart Login
            </motion.h2>
            <motion.p
              className="text-green-100 mt-2"
              initial={{ y: -10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              Welcome back to our fresh grocery community
            </motion.p>
          </motion.div>

          <form onSubmit={onSubmitHandler} className="p-6 space-y-4">
            <motion.div className="space-y-4" variants={containerVariants}>
              <motion.div variants={itemVariants}>
                <label className="block text-gray-700 font-medium mb-1">
                  Email
                </label>
                <input
                  name="email"
                  onChange={handleChange}
                  value={formData.email}
                  className="w-full p-3 border-2 border-green-100 rounded-lg focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all"
                  type="email"
                  required
                  placeholder="john@example.com"
                  autoComplete="email"
                />
              </motion.div>

              <motion.div variants={itemVariants}>
                <label className="block text-gray-700 font-medium mb-1">
                  Password
                </label>
                <input
                  name="password"
                  onChange={handleChange}
                  value={formData.password}
                  className="w-full p-3 border-2 border-green-100 rounded-lg focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all"
                  type="password"
                  required
                  placeholder="••••••••"
                  autoComplete="current-password"
                />
              </motion.div>

              <motion.div
                className="flex justify-between items-center pt-2"
                variants={itemVariants}
              >
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="remember"
                    className="w-4 h-4 text-green-600 rounded focus:ring-green-500"
                    checked={remember}
                    onChange={(e) => setRemember(e.target.checked)}
                  />
                  <label
                    htmlFor="remember"
                    className="ml-2 text-sm text-gray-600"
                  >
                    Remember me
                  </label>
                </div>
                <motion.a
                  href="/forgotPassword"
                  className="text-sm text-green-600 hover:text-green-700 hover:underline transition-colors"
                  whileHover={{ scale: 1.05 }}
                >
                  Forgot password?
                </motion.a>
              </motion.div>
            </motion.div>

            {/* Login Button with motion */}
            <motion.div className="pt-4" variants={itemVariants}>
              <motion.button
                type="submit"
                className="w-full bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600 text-white font-bold py-3 px-4 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 flex justify-center items-center"
                disabled={loading}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {loading ? (
                  <Oval
                    height={24}
                    width={24}
                    color="white"
                    visible={true}
                    ariaLabel="oval-loading"
                  />
                ) : (
                  <span className="flex items-center">
                    <svg
                      className="w-5 h-5 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
                      />
                    </svg>
                    Sign In
                  </span>
                )}
              </motion.button>
            </motion.div>

            {/* Register Link with motion */}
            <motion.div className="text-center pt-2" variants={itemVariants}>
              <p className="text-gray-600">
                Don't have an account?{" "}
                <motion.a
                  href="/register"
                  className="text-green-600 font-medium hover:text-green-700 hover:underline transition-colors"
                  whileHover={{ scale: 1.05 }}
                >
                  Register here
                </motion.a>
              </p>
            </motion.div>
          </form>
        </motion.div>
      </motion.div>

      {/* OTP Modal */}
      {otpBar && (
        <motion.div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <motion.div
            className="bg-white rounded-xl p-8 max-w-sm w-full relative"
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
          >
            <motion.button
              onClick={() => setOtpBar(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <FaTimes size={20} />
            </motion.button>

            <motion.h2
              className="text-2xl font-medium text-center mb-6"
              initial={{ y: -10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
            >
              Verify your email
            </motion.h2>

            <motion.div
              className="flex justify-center mb-6"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
            >
              <img
                src="https://cdn-icons-png.flaticon.com/512/3179/3179068.png"
                alt="Email verification"
                className="w-20 h-20"
              />
            </motion.div>

            <motion.p
              className="text-center mb-6 text-gray-600"
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
            >
              Enter the 6-digit verification code sent to your email
            </motion.p>

            <form className="flex flex-col items-center space-y-4">
              <motion.div
                className="flex space-x-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                {otp.map((_, index) => (
                  <input
                    key={index}
                    type="text"
                    maxLength="1"
                    value={otp[index]}
                    onChange={(e) => handleOtpChange(e, index)}
                    className="w-12 h-12 text-center text-xl border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                ))}
              </motion.div>

              <motion.button
                type="submit"
                className="mt-4 px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Verify
              </motion.button>

              <motion.p
                className="text-sm text-gray-500"
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
              >
                Didn't receive code?{" "}
                <button className="text-green-600 hover:underline">
                  Resend
                </button>
              </motion.p>
            </form>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};

export default Login;
