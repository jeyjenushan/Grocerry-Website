import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import { Toaster } from "react-hot-toast";
import Footer from "./components/Footer";
import Login from "./components/Login";
import Register from "./components/Register";
import ForgotPassword from "./components/ForgotPassword";
import { useAppContext } from "./context/AppContext";
import AllProducts from "./pages/AllProducts";
import ProductCategory from "./pages/ProductCategory";
import ProductDetails from "./pages/ProductDetails";
import Cart from "./pages/Cart";
import AddAddress from "./pages/AddAddress";
import MyOrders from "./pages/MyOrders";
import SellerLogin from "./components/Seller/SellerLogin";
import SellerLayout from "./pages/Seller/SellerLayout";
import AddProduct from "./pages/Seller/AddProduct";
import ProductList from "./pages/Seller/ProductList";
import CustomToaster from "./components/CustomToaster";
import Verify from "./pages/Verify";

import DeliverLogin from "./components/DeliveryBoy/Login";
import DelivererOrders from "./pages/DeliveryBoy/DelivererOrders";
import DeliveryBoyLayout from "./pages/DeliveryBoy/DeliveryBoyLayout";
import Orders from "./pages/Seller/Orders";
import DeliveryBoyDashboard from "./pages/DeliveryBoy/DeliveryBoyDashboard";
import Dashboard from "./pages/Seller/Dashboard";
import Contact from "./pages/Contact";

function App() {
  const location = useLocation();
  const {
    sellerToken,
    userToken,
    deliveryToken,
    clientDeliveryToken,
    clientSellerToken,
    customerToken,
  } = useAppContext();

  const hideNavbarFooterPaths = [
    "/seller",
    "/login",
    "/register",
    "/forgotPassword",
    "/delivery",
  ];
  const shouldHideNavbarFooter = hideNavbarFooterPaths.some((path) =>
    location.pathname.includes(path)
  );

  // Check if user is authenticated (as any role)
  const isAuthenticated =
    customerToken || clientDeliveryToken || clientSellerToken;

  return (
    <div className="text-default min-h-screen text-gray-700 bg-white">
      {!shouldHideNavbarFooter && <Navbar />}
      <CustomToaster />
      <div
        className={`${
          shouldHideNavbarFooter ? "" : "px-6 md:px-16 lg:px-24 xl:px-32"
        }`}
      >
        <Routes>
          <Route path="/" element={<Home />} />

          {/* Protected auth routes - only accessible when NOT logged in */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/contact" element={<Contact />} />
          <Route
            path="/forgotPassword"
            element={
              !isAuthenticated ? (
                <ForgotPassword />
              ) : (
                <Navigate to="/" replace />
              )
            }
          />

          <Route path="/products" element={<AllProducts />} />
          <Route path="/products/:category" element={<ProductCategory />} />
          <Route path="/products/:category/:id" element={<ProductDetails />} />
          <Route path="/loader" element={<Verify />} />

          {/* Protected user routes */}
          <Route
            path="/cart"
            element={
              isAuthenticated ? (
                <Cart />
              ) : (
                <Navigate to="/login" replace state={{ from: location }} />
              )
            }
          />
          <Route
            path="/addAddress"
            element={
              isAuthenticated ? (
                <AddAddress />
              ) : (
                <Navigate to="/login" replace state={{ from: location }} />
              )
            }
          />
          <Route
            path="/my-orders"
            element={
              isAuthenticated ? (
                <MyOrders />
              ) : (
                <Navigate to="/login" replace state={{ from: location }} />
              )
            }
          />

          {/* Seller routes */}
          <Route
            path="/seller"
            element={
              sellerToken ? (
                <SellerLayout />
              ) : (
                <Navigate to="/seller/login" replace />
              )
            }
          >
            <Route index element={<Dashboard />} />
            <Route path="add-product" element={<AddProduct />} />
            <Route path="product-list" element={<ProductList />} />
            <Route path="orders" element={<Orders />} />
    
          </Route>
          <Route
            path="/seller/login"
            element={
              !sellerToken ? <SellerLogin /> : <Navigate to="/seller" replace />
            }
          />

          {/* Delivery routes */}
          <Route
            path="/delivery"
            element={
              deliveryToken ? (
                <DeliveryBoyLayout />
              ) : (
                <Navigate to="/delivery/login" replace />
              )
            }
          >
            <Route index element={<DeliveryBoyDashboard />} />
            <Route path="orders" element={<DelivererOrders />} />
          </Route>
          <Route
            path="/delivery/login"
            element={
              !deliveryToken ? (
                <DeliverLogin />
              ) : (
                <Navigate to="/delivery" replace />
              )
            }
          />
        </Routes>
      </div>
      {!shouldHideNavbarFooter && <Footer />}
    </div>
  );
}

export default App;
