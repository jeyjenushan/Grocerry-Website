import toast, { Toaster, ToastBar } from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect } from "react";

let lastToastId = "";

const CustomToaster = () => {
  useEffect(() => {
    // Store the original toast function
    const originalToast = toast;

    // Create a custom toast function
    const customToast = (message, options) => {
      if (lastToastId) {
        toast.dismiss(lastToastId);
      }

      const newToastId = originalToast(message, options);
      lastToastId = newToastId;
      return newToastId;
    };

    // Override the default toast methods
    toast.success = (message, options) =>
      customToast(message, { ...options, type: "success" });
    toast.error = (message, options) =>
      customToast(message, { ...options, type: "error" });
    toast.loading = (message, options) =>
      customToast(message, { ...options, type: "loading" });
    toast.custom = (message, options) =>
      customToast(message, { ...options, type: "custom" });

    return () => {
      // Restore original toast methods when component unmounts
      toast.success = originalToast.success;
      toast.error = originalToast.error;
      toast.loading = originalToast.loading;
      toast.custom = originalToast.custom;
    };
  }, []);

  return (
    <Toaster
      position="top-right"
      gutter={8}
      containerStyle={{
        top: 24,
        left: 24,
        right: 24,
        bottom: 24,
      }}
      toastOptions={{
        duration: 3000,
        success: {
          duration: 2500,
          style: {
            background: "#10B981",
            color: "#fff",
          },
          iconTheme: {
            primary: "#fff",
            secondary: "#10B981",
          },
        },
        error: {
          duration: 3500,
          style: {
            background: "#EF4444",
            color: "#fff",
          },
          iconTheme: {
            primary: "#fff",
            secondary: "#EF4444",
          },
        },
        loading: {
          style: {
            background: "#3B82F6",
            color: "#fff",
          },
        },
        style: {
          padding: "16px 24px",
          borderRadius: "12px",
          boxShadow: "0 8px 24px rgba(0, 0, 0, 0.15)",
          maxWidth: "500px",
          width: "fit-content",
          fontSize: "0.95rem",
          lineHeight: "1.5",
        },
      }}
    >
      {(t) => (
        <AnimatePresence>
          {t.visible && (
            <motion.div
              layout
              initial={{ opacity: 0, y: -100, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, x: 100, transition: { duration: 0.3 } }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              style={{
                marginBottom: "0.5rem",
                transformOrigin: "top right",
              }}
            >
              <ToastBar toast={t}>
                {({ icon, message }) => (
                  <motion.div
                    layout
                    className="flex items-center justify-between w-full"
                  >
                    <div className="flex items-center">
                      <motion.div
                        animate={{ scale: [0.8, 1.1, 1] }}
                        transition={{ duration: 0.4 }}
                      >
                        {icon}
                      </motion.div>
                      <motion.span
                        className="ml-3"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.1 }}
                      >
                        {message}
                      </motion.span>
                    </div>
                    {t.type !== "loading" && (
                      <motion.button
                        onClick={() => toast.dismiss(t.id)}
                        className="ml-4 p-1 rounded-full hover:bg-white hover:bg-opacity-20 transition-colors"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </motion.button>
                    )}
                  </motion.div>
                )}
              </ToastBar>
            </motion.div>
          )}
        </AnimatePresence>
      )}
    </Toaster>
  );
};

export default CustomToaster;
