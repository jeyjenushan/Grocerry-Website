import { assets, features } from "../greencart_assets/assets";
import { motion } from "framer-motion";

const BottomBanner = () => {
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut",
      },
    },
  };

  const featureVariants = {
    hover: {
      scale: 1.02,
      transition: { duration: 0.3 },
    },
  };

  return (
    <motion.div
      className="relative mt-24 overflow-hidden"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
      variants={containerVariants}
    >
      {/* Background images with parallax effect */}
      <motion.div
        className="absolute inset-0"
        initial={{ scale: 1.1 }}
        whileInView={{ scale: 1 }}
        transition={{ duration: 1, ease: "easeOut" }}
      >
        <img
          src={assets.bottom_banner_image}
          alt="banner"
          className="w-full h-full object-cover hidden md:block"
        />
        <img
          src={assets.bottom_banner_image_sm}
          alt="banner-sm"
          className="w-full h-full object-cover md:hidden"
        />
      </motion.div>

      {/* Overlay with gradient transparency */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/30 to-transparent" />

      {/* Content */}
      <div
        className="relative z-10 container mx-auto px-4 py-16 md:py-24
        flex flex-col items-center md:items-end md:justify-center"
      >
        <motion.div
          className="bg-white/90 backdrop-blur-sm rounded-xl p-6 md:p-8 
          shadow-lg max-w-md w-full"
          variants={itemVariants}
          whileHover={{
            backgroundColor: "rgba(255,255,255,0.95)",
            transition: { duration: 0.3 },
          }}
        >
          <motion.h1
            className="text-2xl md:text-3xl font-semibold text-primary mb-6"
            variants={itemVariants}
          >
            Why We are the Best?
          </motion.h1>

          <motion.div variants={containerVariants}>
            {features.map((feature, index) => (
              <motion.div
                key={index}
                className="flex items-center gap-4 mt-4 p-3 rounded-lg hover:bg-gray-50/80"
                variants={featureVariants}
                whileHover="hover"
              >
                <motion.img
                  src={feature.icon}
                  alt={feature.title}
                  className="md:w-11 w-9"
                  whileHover={{ rotate: 10 }}
                  transition={{ type: "spring", stiffness: 300 }}
                />
                <div>
                  <motion.h3
                    className="text-lg md:text-xl font-semibold"
                    whileHover={{ color: "#4CAF50" }} // green color on hover
                  >
                    {feature.title}
                  </motion.h3>
                  <motion.p
                    className="text-gray-600/80 text-xs md:text-sm"
                    whileHover={{ color: "#333" }}
                  >
                    {feature.description}
                  </motion.p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default BottomBanner;
