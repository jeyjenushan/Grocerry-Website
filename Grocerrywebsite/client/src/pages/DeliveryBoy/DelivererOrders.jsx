import  { useEffect } from "react";
import { useAppContext } from "../../context/AppContext";
import { assets } from "../../greencart_assets/assets";

const DelivererOrders = () => {
  const {
    getDelivererOrders,
    delivererOrders,
    deliveryToken,
    currency,
  } = useAppContext();

  useEffect(() => {
    getDelivererOrders();
  }, [deliveryToken]);

  return (
    <div className="no-scrollbar flex-1 h-[95vh] overflow-y-scroll">
      <div className="md:p-10 p-4 space-y-4">
        <h2 className="text-lg font-medium">Orders List</h2>
        {delivererOrders.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-10">
            <p className="text-gray-500 text-lg">No deliveries found</p>
          </div>
        ) : (
          delivererOrders.map((order, index) => (
            <div
              key={index}
              className="flex flex-col  md:items-center
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
                <p>Payment: {order.Paid ? "Paid" : "Pending"}</p>
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

export default DelivererOrders;
