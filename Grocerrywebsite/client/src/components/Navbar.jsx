import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { assets } from "../greencart_assets/assets";
import { useAppContext } from "../context/AppContext";
import toast from "react-hot-toast";
import axios from "axios";
import { Oval } from "react-loader-spinner";

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const {
    navigate,
    searchQuery,
    setSearchQuery,
    getCartCount,
    backEndUrl,
    pendingDeliverer,
    token,
    setToken,
    setClientDeliveryToken,
    setClientSellerToken,
    clientDeliveryToken,
    clientSellerToken,
    fetchUser,
    seller,
    setSeller,
    setDeliveryBoy,
    deliveryBoy,
    customerToken,
    setCustomerToken,
    customer,
    setCustomer,
    updateCartInLocalStorage,
    setCartItems,
  } = useAppContext();
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const [rejected, setRejected] = useState(false);
  const [checkingRejection, setCheckingRejection] = useState(false);

  useEffect(() => {
    const initializeAuth = async () => {
      await fetchUser();

      setIsInitialized(true);
    };
    initializeAuth();
  }, []);

  useEffect(() => {
    if (searchQuery.length > 0) {
      navigate("products");
    }
  }, [searchQuery]);

  const getRejectedDelivererStatus = async () => {
    setCheckingRejection(true);
    try {
      const { data } = await axios.get(
        `${backEndUrl}/api/notifications/reject`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (data.success) {
        setRejected(data.rejected);
      } else {
        setRejected(false);
      }
    } catch (error) {
      console.error("Error checking rejection status:", error);
      toast.error("Failed to check delivery status");
      setRejected(false);
    } finally {
      setCheckingRejection(false);
    }
  };

  useEffect(() => {
    if (token) {
      getRejectedDelivererStatus();
    }
  }, [token]);

  const logout = async () => {
    try {
      localStorage.removeItem("cutoken");
      localStorage.removeItem("dctoken");
      localStorage.removeItem("sctoken");
      localStorage.removeItem("deliveryBoy");
      localStorage.removeItem("seller");
      localStorage.removeItem("customer");
      setClientDeliveryToken(null);
      setClientSellerToken(null);
      setCustomerToken(null);
      setToken(null);
      setDeliveryBoy(null);
      setSeller(null);
      setCustomer(null);
      navigate("/");
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("Failed to logout");
    } finally {
      setIsLoading(false);
    }
  };

  const becomeDeliveryBoy = async () => {
    setIsLoading(true);
    try {
      if (!customer.image) {
        toast.error("Please upload an image first");
        return;
      }

      let imageBlob;
      if (typeof customer.image === "string") {
        const response = await fetch(customer.image);
        imageBlob = await response.blob();
      } else {
        imageBlob = customer.image;
      }

      const formData = new FormData();
      formData.append("image", imageBlob, "profile.jpg");

      const { data } = await axios.put(
        `${backEndUrl}/api/auth/updateRole`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${customerToken}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (data.success) {
        toast.success(data.message);
      } else {
        toast.error(data.message || "Failed to update role");
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Failed to submit request");
    } finally {
      setIsLoading(false);
    }
  };
  if (!isInitialized) {
    return null;
  }

  return (
    <nav className="flex items-center justify-between px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 py-3 border-b border-gray-200 bg-white sticky top-0 z-50 shadow-sm">
      <NavLink to="/" onClick={() => setOpen(false)} className="flex-shrink-0">
        <span className="text-yellow-300 text-3xl font-bold">Fresh</span>
        <span className="text-green-500 text-3xl font-bold">Cart </span>
      </NavLink>

      {/* Desktop Menu */}
      <div className="hidden sm:flex items-center gap-6 md:gap-8">
        <NavLink
          to="/"
          className={({ isActive }) =>
            isActive
              ? "text-primary font-medium"
              : "text-gray-700 hover:text-primary transition-colors duration-200"
          }
        >
          Home
        </NavLink>
        <NavLink
          to="/products"
          className={({ isActive }) =>
            isActive
              ? "text-primary font-medium"
              : "text-gray-700 hover:text-primary transition-colors duration-200"
          }
        >
          All Products
        </NavLink>

        <NavLink
          to="/contact"
          className={({ isActive }) =>
            isActive
              ? "text-primary font-medium"
              : "text-gray-700 hover:text-primary transition-colors duration-200"
          }
        >
          Contact
        </NavLink>

        <div className="hidden lg:flex items-center text-sm gap-2 border border-gray-300 px-3 rounded-full hover:border-primary transition-colors duration-200 focus-within:border-primary focus-within:ring-1 focus-within:ring-primary">
          <input
            onChange={(e) => setSearchQuery(e.target.value)}
            className="py-1.5 w-40 xl:w-56 bg-transparent outline-none placeholder-gray-500 text-gray-700"
            type="text"
            placeholder="Search products"
            value={searchQuery}
          />
          <img src={assets.search_icon} alt="search" className="w-4 h-4" />
        </div>

        <div
          onClick={() => navigate("/cart")}
          className="relative cursor-pointer group"
        >
          <img
            src={assets.nav_cart_icon}
            alt="cart"
            className="w-6 opacity-80 group-hover:opacity-100 transition-opacity duration-200"
          />
          {token && (
            <span className="absolute -top-2 -right-3 text-xs text-white bg-primary w-[18px] h-[18px] rounded-full flex items-center justify-center">
              {getCartCount()}
            </span>
          )}
        </div>

        {!pendingDeliverer &&
          customerToken &&
          !clientDeliveryToken &&
          !clientSellerToken &&
          !rejected && (
            <button
              onClick={becomeDeliveryBoy}
              className="cursor-pointer px-6 md:px-8 py-1.5 md:py-2 bg-primary hover:bg-primary-dull transition-all duration-200 text-white rounded-full text-sm md:text-base flex items-center justify-center"
              disabled={isLoading}
            >
              {isLoading ? (
                <Oval
                  height={20}
                  width={20}
                  color="white"
                  visible={true}
                  ariaLabel="oval-loading"
                />
              ) : (
                "Become Deliverer"
              )}
            </button>
          )}

        {token ? (
          <div
            className="relative"
            onMouseEnter={() => setIsProfileOpen(true)}
            onMouseLeave={() => setIsProfileOpen(false)}
          >
            <div className="flex items-center gap-1 cursor-pointer">
              {customer ? (
                <img
                  src={customer?.image}
                  className="w-8 h-8 md:w-10 md:h-10 rounded-full object-cover border-2 border-gray-200 hover:border-primary transition-all duration-200"
                  alt="Profile"
                />
              ) : seller ? (
                <img
                  src={seller?.image}
                  className="w-8 h-8 md:w-10 md:h-10 rounded-full object-cover border-2 border-gray-200 hover:border-primary transition-all duration-200"
                  alt="Profile"
                />
              ) : deliveryBoy ? (
                <img
                  src={deliveryBoy?.image}
                  className="w-8 h-8 md:w-10 md:h-10 rounded-full object-cover border-2 border-gray-200 hover:border-primary transition-all duration-200"
                  alt="Profile"
                />
              ) : null}
              <img
                className={` transition-transform duration-200 h-10 w-10 ${
                  isProfileOpen ? "rotate-180" : ""
                }`}
                src={assets.dropdownicon}
                alt="Dropdown Arrow"
              />
            </div>

            <div
              className={`absolute top-full right-0 mt-1 w-48 bg-white rounded-md shadow-lg overflow-hidden transition-all duration-200 origin-top-right ${
                isProfileOpen
                  ? "scale-100 opacity-100"
                  : "scale-95 opacity-0 pointer-events-none"
              }`}
            >
              <div className="py-1">
                <button
                  onClick={() => {
                    navigate("/my-orders");
                    setIsProfileOpen(false);
                  }}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-150"
                >
                  My Orders
                </button>
                <button
                  onClick={logout}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-150"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        ) : (
          <button
            onClick={() => navigate("/login")}
            className="cursor-pointer px-6 md:px-8 py-1.5 md:py-2 bg-primary hover:bg-primary-dull transition-all duration-200 text-white rounded-full text-sm md:text-base"
          >
            Login
          </button>
        )}
      </div>

      {/*Mobile view */}
      <div className="flex items-center gap-6 sm:hidden">
        <div
          onClick={() => navigate("/cart")}
          className="relative cursor-pointer"
        >
          <img
            src={assets.nav_cart_icon}
            alt="cart"
            className="w-6 opacity-80"
          />
          {token && (
            <span className="absolute -top-2 -right-3 text-xs text-white bg-primary w-[18px] h-[18px] rounded-full flex items-center justify-center">
              {getCartCount()}
            </span>
          )}
        </div>
        <button
          onClick={() => (open ? setOpen(false) : setOpen(true))}
          aria-label="Menu"
        >
          <img src={assets.menu_icon} alt="menu" className="" />
        </button>
      </div>

      {/* Mobile Menu */}
      {open && (
        <div
          className={`${
            open ? "flex" : "hidden"
          } absolute top-[60px] left-0 w-full bg-white shadow-md py-4 flex-col items-start gap-2 px-5 text-sm md:hidden`}
        >
          <NavLink to="/" onClick={() => setOpen(false)} className="block">
            Home
          </NavLink>
          <NavLink
            to="/products"
            className="block"
            onClick={() => setOpen(false)}
          >
            All Products
          </NavLink>
          {token && (
            <NavLink
              to="/my-orders"
              className="block"
              onClick={() => setOpen(false)}
            >
              My Orders
            </NavLink>
          )}
          <NavLink
            to="/contact"
            className="block"
            onClick={() => setOpen(false)}
          >
            Contact
          </NavLink>
          {token ? (
            <button
              onClick={() => {
                logout();
                setOpen(false);
              }}
              className="cursor-pointer px-6 py-2 mt-2 bg-primary hover:bg-primary-dull transition text-white rounded-full text-sm"
            >
              Logout
            </button>
          ) : (
            <button
              onClick={() => {
                navigate("/login");
                setOpen(false);
              }}
              className="cursor-pointer px-6 py-2 mt-2 bg-primary hover:bg-primary-dull transition text-white rounded-full text-sm"
            >
              Login
            </button>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
