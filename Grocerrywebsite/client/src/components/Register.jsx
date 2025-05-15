import React, { useContext, useState } from "react";
import { AppContext } from "../context/AppContext";
import toast from "react-hot-toast";
import { Oval } from "react-loader-spinner";
import { assets } from "../greencart_assets/assets";
import axios from "axios";
import { motion } from "framer-motion";

const Register = () => {
  const { navigate, backEndUrl } = useContext(AppContext);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({
    name: "",
    email: "",
    password: "",
    image: "",
  });

  const validateForm = () => {
    let valid = true;
    const newErrors = {
      name: "",
      email: "",
      password: "",
      image: "",
    };

    // Name validation
    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
      valid = false;
    } else if (formData.name.length < 3) {
      newErrors.name = "Name must be at least 3 characters";
      valid = false;
    }

    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
      valid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
      valid = false;
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = "Password is required";
      valid = false;
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
      valid = false;
    }

    // Image validation
    if (!image) {
      newErrors.image = "Profile image is required";
      valid = false;
    } else if (image.size > 2 * 1024 * 1024) {
      // 5MB limit
      newErrors.image = "Image size must be less than 2MB";
      valid = false;
    } else if (!["image/jpeg", "image/png", "image/gif"].includes(image.type)) {
      newErrors.image = "Only JPEG, PNG, or GIF images are allowed";
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0]);
      // Clear image error when file is selected
      if (errors.image) {
        setErrors((prev) => ({ ...prev, image: "" }));
      }
    }
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }
    setLoading(true);
    try {
      const studentObj = {
        name: formData.name.trim(),
        email: formData.email.trim(),
        password: formData.password,
      };

      const formDataToSend = new FormData();
      formDataToSend.append("user", JSON.stringify(studentObj));
      formDataToSend.append("image", image);

      const { data } = await axios.post(
        `${backEndUrl}/api/auth/register`,
        formDataToSend,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          timeout: 10000, // 10 seconds timeout
        }
      );

      if (data.success) {
        toast.success("Registration successful!");
        navigate("/login");
      } else {
        // Handle server-side validation errors
        if (data.errors) {
          const serverErrors = {};
          data.errors.forEach((err) => {
            serverErrors[err.path] = err.msg;
          });
          setErrors((prev) => ({ ...prev, ...serverErrors }));
          toast.error("Please fix the errors in the form");
        } else {
          toast.error(data.message || "Registration failed. Please try again.");
        }
      }
    } catch (error) {
      toast.error(
        "Registration Failed. Please check your details and try again."
      );
      console.log(error.message);
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
              <span className="text-yellow-300">Fresh</span>Cart Register
            </motion.h2>
            <motion.p
              className="text-green-100 mt-2"
              initial={{ y: -10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              Join our fresh grocery community
            </motion.p>
          </motion.div>

          <form onSubmit={onSubmitHandler} className="p-6 space-y-4">
            <motion.div className="space-y-4" variants={containerVariants}>
              <motion.div variants={itemVariants}>
                <label className="block text-gray-700 font-medium mb-1">
                  Full Name
                </label>
                <input
                  name="name"
                  onChange={handleChange}
                  value={formData.name}
                  className={`w-full p-3 border-2 ${
                    errors.name ? "border-red-500" : "border-green-100"
                  } rounded-lg focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all`}
                  type="text"
                  placeholder="John Doe"
                />
                {errors.name && (
                  <motion.p
                    className="text-red-500 text-sm mt-1"
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    {errors.name}
                  </motion.p>
                )}
              </motion.div>

              <motion.div variants={itemVariants}>
                <label className="block text-gray-700 font-medium mb-1">
                  Email
                </label>
                <input
                  name="email"
                  onChange={handleChange}
                  value={formData.email}
                  className={`w-full p-3 border-2 ${
                    errors.email ? "border-red-500" : "border-green-100"
                  } rounded-lg focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all`}
                  type="email"
                  placeholder="john@example.com"
                />
                {errors.email && (
                  <motion.p
                    className="text-red-500 text-sm mt-1"
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    {errors.email}
                  </motion.p>
                )}
              </motion.div>

              <motion.div variants={itemVariants}>
                <label className="block text-gray-700 font-medium mb-1">
                  Password
                </label>
                <input
                  name="password"
                  onChange={handleChange}
                  value={formData.password}
                  className={`w-full p-3 border-2 ${
                    errors.password ? "border-red-500" : "border-green-100"
                  } rounded-lg focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all`}
                  type="password"
                  placeholder="••••••••"
                />
                {errors.password && (
                  <motion.p
                    className="text-red-500 text-sm mt-1"
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    {errors.password}
                  </motion.p>
                )}
              </motion.div>
            </motion.div>

            {/* Profile Image Upload with motion */}
            <motion.div className="mt-4" variants={itemVariants}>
              <label className="block text-gray-700 font-medium mb-2">
                Profile Image
              </label>
              <div className="flex items-center space-x-4">
                <motion.label
                  className="cursor-pointer flex items-center"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <div
                    className={`bg-green-50 p-3 rounded-lg border-2 ${
                      errors.image
                        ? "border-red-500 border-dashed"
                        : "border-green-300 border-dashed"
                    } hover:bg-green-100 transition-colors`}
                  >
                    <img
                      src={assets.file_upload_icon}
                      alt="Upload"
                      className="w-8 h-8"
                    />
                  </div>
                  <input
                    type="file"
                    id="thumbnailImage"
                    onChange={handleFileChange}
                    accept="image/jpeg, image/png, image/gif"
                    hidden
                  />
                </motion.label>
                <motion.span
                  className="text-gray-600 truncate max-w-xs"
                  initial={{ x: -10, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  {image ? image.name : "No file chosen"}
                </motion.span>
              </div>
              {errors.image && (
                <motion.p
                  className="text-red-500 text-sm mt-1"
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  {errors.image}
                </motion.p>
              )}
            </motion.div>

            {/* Register Button with motion */}
            <motion.div className="pt-4" variants={itemVariants}>
              <motion.button
                type="submit"
                className="w-full bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600 text-white font-bold py-3 px-4 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 flex justify-center items-center disabled:opacity-70"
                disabled={loading}
                whileHover={{ scale: loading ? 1 : 1.02 }}
                whileTap={{ scale: loading ? 1 : 0.98 }}
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
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                    Create Account
                  </span>
                )}
              </motion.button>
            </motion.div>

            {/* Login Link with motion */}
            <motion.div className="text-center pt-2" variants={itemVariants}>
              <p className="text-gray-600">
                Already have an account?{" "}
                <motion.a
                  href="/login"
                  className="text-green-600 font-medium hover:text-green-700 hover:underline transition-colors"
                  whileHover={{ scale: 1.05 }}
                >
                  Login here
                </motion.a>
              </p>
            </motion.div>
          </form>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Register;
