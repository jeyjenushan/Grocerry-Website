import React from "react";
import { useAppContext } from "../../context/AppContext";
import { assets } from "../../greencart_assets/assets";
import { Link, NavLink, Outlet } from "react-router-dom";

const DeliveryBoyLayout = () => {
  const { setIsSeller, setDeliveryToken } = useAppContext();

  const sidebarLinks = [
    { name: "Orders", path: "/delivery/orders", icon: assets.order_icon },

    {
      name: "Dashboard",
      path: "/delivery", // Points to index route
      icon: assets.dashboardicon,
      exact: true,
    },
  ];

  const logout = async () => {
    localStorage.removeItem("dtoken");
    setDeliveryToken(false);
  };

  return (
    <>
      <div className="flex items-center justify-between px-4 md:px-8 border-b border-gray-300 py-3 bg-white ">
        <Link to="/">
          <img
            src={assets.logo}
            alt="logo"
            className="cursor-pointer w-34 md:w-38"
          />
        </Link>
        <div className="flex items-center gap-5 text-gray-500">
          <p>Hi! Delivery Boy</p>
          <button
            onClick={logout}
            className="border rounded-full text-sm px-4 py-1"
          >
            Logout
          </button>
        </div>
      </div>
      <div className="flex">
        <div className="md:w-64 w-16 border-r h-[95vh] text-base border-gray-300 pt-4 flex flex-col ">
          {sidebarLinks.map((item, index) => (
            <NavLink
              to={item.path}
              key={item.name}
              end={item.path == "/seller"}
              className={({ isActive }) => `flex items-center py-3 px-4 gap-3 
                            ${
                              isActive
                                ? "border-r-4 md:border-r-[6px] bg-primary-500/10 border-primary-dull text-primary"
                                : "hover:bg-gray-100/90 border-white"
                            }`}
            >
              <img src={item.icon} className="w-7 h-7" alt="" />
              <p className="md:block hidden text-center">{item.name}</p>
            </NavLink>
          ))}
        </div>
        <Outlet />
      </div>
    </>
  );
};

export default DeliveryBoyLayout;
