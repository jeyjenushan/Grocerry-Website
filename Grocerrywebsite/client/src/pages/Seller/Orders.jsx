import React, { useEffect, useState } from "react";
import { useAppContext } from "../../context/AppContext";
import { assets } from "../../greencart_assets/assets";

const Orders = () => {
  const { orders, currency, fetchOrders } = useAppContext();
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [filters, setFilters] = useState({
    paymentType: "",
    orderStatus: "",
    isPaid: "",
  });

  useEffect(() => {
    fetchOrders();
  }, []);

  useEffect(() => {
    // Apply filters when orders or filters change
    let result = [...orders];

    if (filters.paymentType) {
      result = result.filter(
        (order) => order.paymentType === filters.paymentType
      );
    }

    if (filters.orderStatus) {
      result = result.filter(
        (order) => order.orderStatus === filters.orderStatus
      );
    }

    if (filters.isPaid !== "") {
      result = result.filter((order) =>
        filters.isPaid === "paid" ? order.paid : !order.paid
      );
    }

    setFilteredOrders(result);
  }, [orders, filters]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const clearFilters = () => {
    setFilters({
      paymentType: "",
      orderStatus: "",
      isPaid: "",
    });
  };

  return (
    <div className="no-scrollbar flex-1 h-[95vh] overflow-y-scroll">
      <div className="md:p-10 p-4 space-y-4">
        <h2 className="text-lg font-medium">Orders List</h2>

        {/* Filter Controls */}
        <div className="bg-white p-4 rounded-md shadow-sm border border-gray-200">
          <div className="flex flex-wrap gap-4 items-center">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Payment Type
              </label>
              <select
                name="paymentType"
                value={filters.paymentType}
                onChange={handleFilterChange}
                className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="">All</option>
                <option value="COD">Cash on Delivery</option>
                <option value="STRIPE">Online Payment</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Order Status
              </label>
              <select
                name="orderStatus"
                value={filters.orderStatus}
                onChange={handleFilterChange}
                className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="">All</option>
                <option value="PENDING">Pending</option>
                <option value="PROCESSING">Processing</option>
                <option value="COMPLETED">Delivered</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Payment Status
              </label>
              <select
                name="isPaid"
                value={filters.isPaid}
                onChange={handleFilterChange}
                className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="">All</option>
                <option value="paid">Paid</option>
                <option value="unpaid">Unpaid</option>
              </select>
            </div>

            <button
              onClick={clearFilters}
              className="mt-6 px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition"
            >
              Clear Filters
            </button>
          </div>
        </div>

        {/* Orders Count */}
        <div className="text-sm text-gray-600">
          Showing {filteredOrders.length} of {orders.length} orders
        </div>

        {filteredOrders.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-10">
            <p className="text-gray-500 text-lg">
              No Orders found matching your filters
            </p>
          </div>
        ) : (
          filteredOrders.map((order, index) => (
            <div
              key={index}
              className="flex flex-col md:items-center
            md:flex-row
            gap-5 
            justify-between
            p-5 max-w-4xl rounded-md border border-gray-300"
            >
              <div className="flex gap-5 max-w-80">
                <img
                  className="w-12 h-12 object-cover "
                  src={assets.box_icon}
                  alt="boxIcon"
                />
                <div>
                  {order.orderItems.map((item, index) => (
                    <div key={index} className="flex flex-col ">
                      <p className="font-medium">
                        {item.product.name}
                        {""}
                        <span className="text-primary">x {item.quantity}</span>
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="text-sm md:text-base text-black/60">
                <p className="text-black/80">
                  {order.address.firstName} {order.address.lastName}
                </p>
                <p>
                  {order.address.street}, {order.address.city},
                </p>
                <p>
                  {order.address.state},{order.address.zipcode},
                  {order.address.country}
                </p>
                <p>{order.address.phone}</p>
              </div>

              <p className="font-medium text-lg my-auto ">
                {currency}
                {order.amount}
              </p>

              <div className="flex flex-col text-sm md:text-base text-black/60">
                <p>Method: {order.paymentType}</p>
                <p>Date: {new Date(order.createdAt).toLocaleDateString()}</p>
                <p>Payment: {order.paid ? "Paid" : "Not Paid"}</p>
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${
                    order.orderStatus === "PENDING"
                      ? "bg-yellow-100 text-yellow-800"
                      : order.orderStatus === "PROCESSING"
                      ? "bg-blue-100 text-blue-800"
                      : "bg-green-100 text-green-800"
                  }`}
                >
                  {order.orderStatus}
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Orders;
