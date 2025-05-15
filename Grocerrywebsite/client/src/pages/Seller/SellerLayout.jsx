import React, { useEffect, useState } from "react";
import { useAppContext } from "../../context/AppContext";
import { assets } from "../../greencart_assets/assets";
import { Link, NavLink, Outlet } from "react-router-dom";
import { FaBell } from "react-icons/fa";
import axios from "axios";
import { Oval } from "react-loader-spinner";
import { toast } from "react-hot-toast";
import { FiPieChart } from "react-icons/fi";

const SellerLayout = () => {
  const [notifications, setNotifications] = useState([]);
  const [approveLoading, setApproveLoading] = useState(false);
  const [rejectLoading, setRejectLoading] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showNotifications, setShowNotifications] = useState(false);
  const [selectedNotification, setSelectedNotification] = useState(null);
  const {
    setIsSeller,
    setSellerToken,
    sellerToken,
    backEndUrl,
    setCustomerToken,
    setClientDeliveryToken,
    setDeliveryBoy,
    setToken,
    setCustomer,
    customerToken,
  } = useAppContext();

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const { data } = await axios.get(`${backEndUrl}/api/notifications`, {
          headers: {
            Authorization: `Bearer ${sellerToken}`,
          },
        });
        setNotifications(data.notificationDtoList);
        setUnreadCount(
          data.notificationDtoList.filter((n) => !n.isRead).length
        );
      } catch (error) {
        console.error("Error fetching notifications", error);
      }
    };

    fetchNotifications();
    const interval = setInterval(fetchNotifications, 60000); // Poll every minute

    return () => clearInterval(interval);
  }, []);

  const handleNotificationClick = async (notification) => {
    try {
      if (!notification.isRead) {
        const { data } = await axios.post(
          `${backEndUrl}/api/notifications/${notification.id}/action-taken`,
          {},
          {
            headers: {
              Authorization: `Bearer ${sellerToken}`,
            },
          }
        );
        if (data.success) {
          setNotifications(
            notifications.map((n) =>
              n.id === notification.id ? { ...n, isRead: true } : n
            )
          );
          setUnreadCount(unreadCount - 1);
        }
        setSelectedNotification(data);
        setShowNotifications(false);
      }
    } catch (error) {
      console.error("Error marking notification as read", error);
    }
  };

  const handleApprove = async () => {
    setApproveLoading(true);
    try {
      const { data } = await axios.put(
        `${backEndUrl}/api/deliverers/approve/${selectedNotification.notificationDto.id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${sellerToken}`,
          },
        }
      );

      console.log(data);

      if (data.success) {
        setNotifications(
          notifications.filter(
            (n) => n.id !== selectedNotification.notificationDto.id
          )
        );

        setClientDeliveryToken(customerToken);
        localStorage.setItem("dctoken", customerToken);

        setToken(customerToken);
        setDeliveryBoy(data.userDto);
        setCustomerToken(null);
        localStorage.removeItem("cutoken");
        localStorage.removeItem("customer");
        setCustomer(null);

        toast.success("Deliverer approved successfully!");
      }
      setSelectedNotification(null);
    } catch (error) {
      console.error("Error approving deliverer", error);
      toast.error("Failed to approve deliverer");
    } finally {
      setApproveLoading(false);
    }
  };

  const handleReject = async () => {
    setRejectLoading(true);
    try {
      const { data } = await axios.put(
        `${backEndUrl}/api/deliverers/decline/${selectedNotification.notificationDto.id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${sellerToken}`,
          },
        }
      );

      if (data.success) {
        setNotifications(
          notifications.filter(
            (n) => n.id !== selectedNotification.notificationDto.id
          )
        );
        toast.success("Deliverer rejected successfully!");
      }
      setSelectedNotification(null);
    } catch (error) {
      console.error("Error rejecting deliverer", error);
      toast.error("Failed to reject deliverer");
    } finally {
      setRejectLoading(false);
    }
  };

  const sidebarLinks = [
    { name: "Add Product", path: "/seller/add-product", icon: assets.add_icon },
    {
      name: "Product List",
      path: "/seller/product-list",
      icon: assets.product_list_icon,
    },
    { name: "Orders", path: "/seller/orders", icon: assets.order_icon },
    {
      name: "Dashboard",
      path: "/seller", // Points to index route
      icon: assets.dashboardicon,
      exact: true,
    },
  ];

  const logout = async () => {
    localStorage.removeItem("stoken");
    setSellerToken(false);
    setIsSeller(false);
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
          <p>Hi! Admin</p>
          <div className="relative">
            <FaBell
              className="h-6 w-6 text-gray-500 cursor-pointer"
              onClick={() => setShowNotifications(!showNotifications)}
            />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                {unreadCount}
              </span>
            )}
            {/* Notification Dropdown */}
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-72 bg-white rounded-md shadow-lg z-10">
                <div className="py-1">
                  {notifications.length > 0 ? (
                    notifications.map((notification) => (
                      <div
                        key={notification.id}
                        className={`px-4 py-2 hover:bg-gray-100 cursor-pointer ${
                          !notification.isRead ? "bg-blue-50" : ""
                        }`}
                        onClick={() => handleNotificationClick(notification)}
                      >
                        <p className="font-medium">{notification.message}</p>
                        <p className="text-xs text-gray-500">
                          {new Date(notification.createdAt).toLocaleString()}
                        </p>
                      </div>
                    ))
                  ) : (
                    <p className="px-4 py-2 text-gray-500">No notifications</p>
                  )}
                </div>
              </div>
            )}
          </div>

          <button
            onClick={logout}
            className="border rounded-full text-sm px-4 py-1"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Notification Detail Modal */}
      {selectedNotification && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-medium mb-4">Deliverer Application</h3>
            <div className="flex items-center mb-4">
              <img
                src={selectedNotification.pendingDeliverDto.image}
                alt="Deliverer"
                className="w-12 h-12 rounded-full mr-4"
              />
              <div>
                <p className="font-medium">
                  {selectedNotification.pendingDeliverDto.name}
                </p>
                <p className="text-gray-600">
                  {selectedNotification.pendingDeliverDto.email}
                </p>
              </div>
            </div>
            <p className="mb-4">
              {`  Have you promoted ${selectedNotification.pendingDeliverDto.name}  customer as a
              deliveryBoy?`}
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={handleReject}
                className="px-4 py-2 border border-red-500 text-red-500 rounded hover:bg-red-50"
                disabled={approveLoading || rejectLoading}
              >
                {rejectLoading ? (
                  <Oval
                    height={20}
                    width={20}
                    color="#ef4444"
                    visible={true}
                    ariaLabel="oval-loading"
                  />
                ) : (
                  "Reject"
                )}
              </button>
              <button
                onClick={handleApprove}
                className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                disabled={approveLoading || rejectLoading}
              >
                {approveLoading ? (
                  <Oval
                    height={20}
                    width={20}
                    color="#ffffff"
                    visible={true}
                    ariaLabel="oval-loading"
                  />
                ) : (
                  "Approve"
                )}
              </button>
            </div>
          </div>
        </div>
      )}

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

export default SellerLayout;
