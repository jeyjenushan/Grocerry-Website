import React, { useContext, useState } from "react";

import { useNavigate } from "react-router-dom";
import { Oval } from "react-loader-spinner";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import { AppContext, useAppContext } from "../context/AppContext";
import { assets } from "../greencart_assets/assets";
const SlideLeft = (delay) => {
  return {
    hidden: {
      opacity: 0,
      x: 100,
    },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 1,
        delay: delay,
      },
    },
  };
};
const SlideRight = (delay) => {
  return {
    hidden: {
      opacity: 0,
      x: -100,
    },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 1,
        delay: delay,
      },
    },
  };
};

const ForgotPassword = () => {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState(new Array(6).fill(""));
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { sendOtp, verifyOtp, resetPassword } = useAppContext();
  const handleSendOtp = async () => {
    setLoading(true);
    if (email.trim() === "") {
      toast.error("Please enter a valid email.");
      setLoading(false);
      return;
    }

    const success = await sendOtp(email); // Let AdminContext handle errors and notifications

    console.log(success);

    if (success) {
      localStorage.setItem("email", email);
      setStep(2);
    }

    setLoading(false);
  };

  const handleChangeOtp = (value, index) => {
    if (!/^\d$/.test(value) && value !== "") return;
    const updatedOtp = [...otp];
    updatedOtp[index] = value;
    setOtp(updatedOtp);

    if (value !== "" && index < 5) {
      document.getElementById(`otp-input-${index + 1}`).focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && otp[index] === "" && index > 0) {
      document.getElementById(`otp-input-${index - 1}`).focus();
    }
  };

  const handleVerifyOtp = async () => {
    setLoading(true);
    const otpValue = otp.join("");
    if (otpValue.length < 6) {
      toast.error("Please enter the complete 6-digit OTP.");
      setLoading(false);
      return;
    }
    const email = localStorage.getItem("email");
    if (!email) {
      setMessage("Email not found. Please try again.");
      setLoading(false);
      return;
    }

    const success = await verifyOtp(email, otpValue);
    if (success) {
      localStorage.setItem("forgetotp", otpValue);
      setStep(3);
    }
    setLoading(false);
  };

  const handleResetPassword = async () => {
    setLoading(true);
    if (newPassword != confirmPassword) {
      toast.error("Please correctly enter a confirm password.");
      setLoading(false);
      return;
    }
    if (newPassword.trim() === "") {
      toast.error("Please enter a new password.");
      setLoading(false);
      return;
    }
    const email = localStorage.getItem("email");
    const forgetotp = localStorage.getItem("forgetotp");

    const success = await resetPassword(email, forgetotp, newPassword);
    if (success) {
      setStep(4);
    }
    setLoading(false);
  };

  return (
    <div className="bg-gray-50 min-h-screen w-full fixed">
      <div className="grid grid-cols-2 items-center px-7 my-44">
        <div>
          <motion.img
            variants={SlideRight(0.1)}
            initial="hidden"
            whileInView="visible"
            src={assets.ps}
            alt=""
          />
        </div>

        <motion.div
          variants={SlideLeft(0.1)}
          initial="hidden"
          whileInView="visible"
          className="flex items-center justify-center mr-14"
        >
          {/* Step 1: Email Input */}
          {step === 1 && (
            <div className="p-8 bg-white rounded-lg shadow-lg w-full max-w-md">
              <h2 className="text-4xl font-bold mb-8 text-gray-800">
                Forgot Password?
              </h2>
              <p className="mb-6 text-gray-600">
                Please enter your email below
              </p>
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full p-3 border border-gray-300 rounded-md mb-6 focus:outline-none focus:ring-2 focus:bg-white text-gray-800"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <button
                onClick={handleSendOtp}
                className={`bg-primary w-full text-white p-3 rounded-md flex items-center justify-center ${
                  loading
                    ? "opacity-50 cursor-not-allowed"
                    : "hover:bg-primary-dull"
                }`}
                disabled={loading}
              >
                {loading ? (
                  <Oval height={24} width={24} color="white" />
                ) : (
                  "Send OTP"
                )}
              </button>
            </div>
          )}

          {/* Step 2: OTP Verification */}
          {step === 2 && (
            <div className="p-8 bg-white rounded-lg shadow-lg w-full max-w-md">
              <h2 className="text-3xl font-bold mb-6 text-gray-800">
                Enter OTP
              </h2>
              <p className="mb-8 text-gray-600">
                Enter the 6-digit verification code sent to your email
              </p>
              <div className="flex justify-center gap-3 mb-8">
                {otp.map((value, index) => (
                  <input
                    key={index}
                    id={`otp-input-${index}`}
                    type="text"
                    maxLength="1"
                    value={value}
                    onChange={(e) => handleChangeOtp(e.target.value, index)}
                    onKeyDown={(e) => handleKeyDown(e, index)}
                    className="w-14 h-14 text-center text-2xl border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:bg-white text-gray-800"
                  />
                ))}
              </div>
              <button
                onClick={handleVerifyOtp}
                className={`w-full bg-primary text-white py-3 rounded-md flex items-center justify-center ${
                  loading ? "opacity-50 cursor-not-allowed" : "bg-primary"
                }`}
                disabled={loading}
              >
                {loading ? (
                  <Oval height={20} width={20} color="white" />
                ) : (
                  "Verify OTP"
                )}
              </button>
            </div>
          )}

          {/* Step 3: Password Reset */}
          {step === 3 && (
            <div className="p-8 bg-white rounded-lg shadow-lg w-full max-w-md">
              <h2 className="text-2xl font-bold mb-6 text-gray-800">
                Reset Password
              </h2>
              <input
                type="password"
                placeholder="New password"
                className="w-full p-3 border border-gray-300 rounded-md mb-4 focus:outline-none focus:ring-2 focus:bg-white text-gray-800"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
              <input
                type="password"
                placeholder="Confirm password"
                className="w-full p-3 border border-gray-300 rounded-md mb-6 focus:outline-none focus:ring-2 focus:bg-white text-gray-800"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
              <button
                onClick={handleResetPassword}
                className={`w-full bg-primary text-white py-3 rounded-md flex items-center justify-center ${
                  loading
                    ? "opacity-50 cursor-not-allowed"
                    : "hover:bg-primary-dull"
                }`}
                disabled={loading}
              >
                {loading ? (
                  <Oval height={20} width={20} color="white" />
                ) : (
                  "Reset Password"
                )}
              </button>
            </div>
          )}

          {/* Step 4: Success */}
          {step === 4 && (
            <div className="p-8 bg-white rounded-lg shadow-lg w-full max-w-md text-center">
              <h2 className="text-2xl font-semibold mb-6 text-gray-800">
                Password reset successfully!
              </h2>
              <button
                onClick={() => navigate("/login")}
                className="w-full p-3 bg-primary text-white rounded-md hover:bg-primary-dull transition-colors"
              >
                Go to Login
              </button>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default ForgotPassword;
