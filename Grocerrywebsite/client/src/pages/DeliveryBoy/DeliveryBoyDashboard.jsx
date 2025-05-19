import  {  useEffect, useState } from "react";
import {  useAppContext } from "../../context/AppContext";
import { Bar, Pie } from "react-chartjs-2";
import { Chart, registerables } from "chart.js";
import axios from "axios";
Chart.register(...registerables);

const DeliveryBoyDashboard = () => {
  const {
    currency,
    delivererOrders,
    getAmount,
    deliveryAmount,
    deliveryToken,
    backEndUrl,
    getDelivererOrders,
  } = useAppContext();

  const [stats, setStats] = useState({
    totalAccepted: 0,
    totalCompleted: 0,
    todayAccepted: 0,
    todayCompleted: 0,
    pendingOrders: 0,
    completionPercentage: 0,
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    getAmount();
    getDeliverOrderStats();
    getDelivererOrders();
  }, [deliveryToken]);

  const getDeliverOrderStats = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(
        `${backEndUrl}/api/deliveries/deliveryOrderStats`,
        {
          headers: {
            Authorization: `Bearer ${deliveryToken}`,
          },
        }
      );
  
      if (data.success) {
        const statsData = data.deliveryBoyOrderStatsDto;
        setStats({
          totalAccepted: statsData.totalAccepted,
          totalCompleted: statsData.totalCompleted,
          todayAccepted: statsData.todayAccepted,
          todayCompleted: statsData.todayCompleted,
          pendingOrders: statsData.pendingOrders,
          completionPercentage:
            statsData.completionPercentage ||
            (statsData.totalAccepted > 0
              ? Math.round(
                  (statsData.totalCompleted / statsData.totalAccepted) * 100
                )
              : 0),
          weeklyAcceptedOrders: statsData.weeklyAcceptedOrders,
          weeklyCompletedOrders: statsData.weeklyCompletedOrders,
        });
      }
    } catch (error) {
      setError(error.message);
      console.error("Error fetching delivery stats:", error);
    } finally {
      setLoading(false);
    }
  };

  // Prepare data for charts
  const weeklyData = {
    labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    datasets: [
      {
        label: "Accepted Orders",
        backgroundColor: "rgba(54, 162, 235, 0.5)",
        borderColor: "rgba(54, 162, 235, 1)",
        borderWidth: 1,
        data: stats.weeklyAcceptedOrders || [0, 0, 0, 0, 0, 0, 0],
      },
      {
        label: "Completed Orders",
        backgroundColor: "rgba(75, 192, 192, 0.5)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
        data: stats.weeklyCompletedOrders || [0, 0, 0, 0, 0, 0, 0],
      },
    ],
  };

  const statusData = {
    labels: ["Completed", "Pending", "In Progress"],
    datasets: [
      {
        data: [
          stats.totalCompleted,
          stats.totalAccepted - stats.totalCompleted,
          stats.pendingOrders,
        ],
        backgroundColor: ["#4BC0C0", "#FF6384", "#FFCE56"],
        hoverBackgroundColor: ["#36A2EB", "#FF6384", "#FFCE56"],
      },
    ],
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading dashboard...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-500">Error: {error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-start justify-between gap-8 md:p-8 md:pb-0 p-4 pb-0">
      <div className="w-full space-y-5">
        <h1 className="text-2xl font-bold text-gray-800">Delivery Dashboard</h1>

        <div className="flex flex-wrap gap-5 items-center">
          <div className="flex items-center gap-3 shadow-card border border-blue-500 p-4 w-56 rounded-md">
            <div>
              <p className="text-2xl font-medium text-gray-600">
                {currency} {deliveryAmount}
              </p>
              <p className="text-base text-gray-500">Total Earnings</p>
            </div>
          </div>

          <div className="flex items-center gap-3 shadow-card border border-green-500 p-4 w-56 rounded-md">
            <div>
              <p className="text-2xl font-medium text-gray-600">
                {stats.totalAccepted}
              </p>
              <p className="text-base text-gray-500">Total Accepted Orders</p>
            </div>
          </div>

          <div className="flex items-center gap-3 shadow-card border border-purple-500 p-4 w-56 rounded-md">
            <div>
              <p className="text-2xl font-medium text-gray-600">
                {stats.totalCompleted}
              </p>
              <p className="text-base text-gray-500">Total Completed Orders</p>
            </div>
          </div>

          <div className="flex items-center gap-3 shadow-card border border-yellow-500 p-4 w-56 rounded-md">
            <div>
              <p className="text-2xl font-medium text-gray-600">
                {stats.pendingOrders}
              </p>
              <p className="text-base text-gray-500">Pending Deliveries</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Today's Performance</h2>
            <div className="flex justify-between">
              <div className="text-center">
                <p className="text-3xl font-bold">{stats.todayAccepted}</p>
                <p className="text-gray-600">Accepted</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold">{stats.todayCompleted}</p>
                <p className="text-gray-600">Completed</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold">
                  {stats.todayAccepted > 0
                    ? Math.round(
                        (stats.todayCompleted / stats.todayAccepted) * 100
                      )
                    : 0}
                  %
                </p>
                <p className="text-gray-600">Completion Rate</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Overall Performance</h2>
            <div className="flex justify-between">
              <div className="text-center">
                <p className="text-3xl font-bold">{stats.totalAccepted}</p>
                <p className="text-gray-600">Total Accepted</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold">{stats.totalCompleted}</p>
                <p className="text-gray-600">Total Completed</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold">
                  {stats.completionPercentage}%
                </p>
                <p className="text-gray-600">Completion Rate</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">
              Weekly Order Activity
            </h2>
            <Bar
              data={weeklyData}
              options={{
                responsive: true,
                plugins: {
                  legend: {
                    position: "top",
                  },
                  title: {
                    display: true,
                    text: "Orders per day",
                  },
                },
              }}
            />
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Order Status</h2>
            <div className="h-64 flex items-center justify-center">
              <Pie
                data={statusData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                }}
              />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow mt-6">
          <h2 className="text-xl font-semibold mb-4">Recent Orders</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Order ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {delivererOrders.slice(0, 5).map((order) => (
                  <tr key={order.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      #{order.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {order.customerName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                        ${
                          order.status === "COMPLETED"
                            ? "bg-green-100 text-green-800"
                            : order.status === "PROCESSING"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-blue-100 text-blue-800"
                        }`}
                      >
                        {order.orderStatus}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {currency} {order.amount}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeliveryBoyDashboard;
