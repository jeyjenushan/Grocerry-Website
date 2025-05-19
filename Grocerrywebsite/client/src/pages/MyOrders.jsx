import { useEffect } from "react";
import { useAppContext } from "../context/AppContext";

const MyOrders = () => {
  const { currency, myOrders, fetchMyOrders, token } = useAppContext();

  useEffect(() => {
    fetchMyOrders();
  }, [token]);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-gray-800">My Orders</h1>
        <div className="w-20 h-1 bg-blue-600 mt-2"></div>
      </div>

      {myOrders.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">You have no orders yet.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {myOrders.map((order, index) => (
            <div
              key={index}
              className={`border rounded-lg shadow-sm overflow-hidden ${
                order.paid ? "border-green-200" : "border-red-200"
              }`}
            >
              <div
                className={`p-4 flex flex-col md:flex-row md:items-center md:justify-between ${
                  order.paid ? "bg-green-50" : "bg-red-50"
                }`}
              >
                <div className="flex items-center space-x-4 mb-3 md:mb-0">
                  <span className="font-medium text-gray-700">
                    Order #: {order.id}
                  </span>
                  <span className="hidden md:block text-gray-400">|</span>
                  <span className="text-gray-600">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-4">
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                      order.paid
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {order.paid ? "Paid" : "Unpaid"}
                  </span>

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

                  <span className="font-medium text-gray-700">
                    Total: {currency}
                    {order.amount}
                  </span>
                </div>
              </div>

              <div className="bg-white divide-y divide-gray-100">
                {order.orderItems.map((item, index) => (
                  <div key={index} className="p-4 flex flex-col md:flex-row">
                    <div className="flex items-start space-x-4 md:w-1/2">
                      <div className="bg-gray-50 p-2 rounded-lg">
                        <img
                          src={item.product.image[0]}
                          className="w-16 h-16 object-contain"
                          alt={item.product.name}
                        />
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900">
                          {item.product.name}
                        </h3>
                        <p className="text-sm text-gray-500">
                          Category: {item.product.category}
                        </p>
                        <p className="text-sm text-gray-500 mt-1">
                          Qty: {item.quantity || 1}
                        </p>
                      </div>
                    </div>

                    <div className="mt-4 md:mt-0 md:ml-auto md:text-right">
                      <p className="text-lg font-medium text-blue-600">
                        {currency}
                        {item.product.offerPrice * item.quantity}
                      </p>
                      <p className="text-sm text-gray-500 mt-1">
                        Payment: {order.paymentType}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyOrders;
