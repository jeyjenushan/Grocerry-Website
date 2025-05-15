import React, { useEffect, useState } from "react";
import { useAppContext } from "../../context/AppContext";
import { ProgressBar } from "../../components/Seller/ProgressBar";
import { PieChart } from "../../components/Seller/PieChart";
import { BarChart } from "../../components/Seller/BarChart";
import { StateCard } from "../../components/Seller/StateCard";
import { Card } from "../../components/Seller/Card";
import axios from "axios";

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);

  const { currency, sellerToken, backEndUrl } = useAppContext();

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const { data } = await axios.get(
          `${backEndUrl}/api/seller/dashboardData`,
          {
            headers: {
              Authorization: `Bearer ${sellerToken}`,
            },
          }
        );
        console.log(data);

        if (data.success) {
          setDashboardData(data.dashboardDto);
        }
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, [sellerToken]);

  if (loading) return <div>Loading...</div>;
  if (!dashboardData) return <div>No data available</div>;

  // Data for Pie Chart (Order Status)
  const orderStatusData = [
    {
      name: "Completed",
      value: dashboardData.completedOrders || 0,
      color: "#4CAF50",
    },
    {
      name: "Pending",
      value: dashboardData.pendingOrders || 0,
      color: "#FFC107",
    },
    {
      name: "Rejected",
      value: dashboardData.rejectedOrders || 0,
      color: "#F44336",
    },
  ];

  // Data for Bar Chart (Today's Orders)
  const todayOrderData = [
    { name: "Completed", value: dashboardData.todayCompletedOrders || 0 },
    { name: "Pending", value: dashboardData.pendingTodayOrders || 0 },
    { name: "Rejected", value: dashboardData.todayRejectedOrders || 0 },
  ];
  const productCategoryData = [
    { name: "Vegetables", value: dashboardData.organicVegetableCount },
    { name: "Fruits", value: dashboardData.fruitsCount },
    { name: "Drinks", value: dashboardData.drinksCount },
    { name: "Instant", value: dashboardData.instantCount },
    { name: "Dairy", value: dashboardData.dairyCount },
    { name: "Bakery", value: dashboardData.bakeryCount },
    { name: "Grains", value: dashboardData.grainsCount },
  ];

  return (
    <div className="min-h-screen p-4 md:p-6 space-y-6 bg-gray-50">
      <h1 className="text-2xl font-bold text-gray-800">Dashboard Overview</h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StateCard
          title="Total Customers"
          value={dashboardData.customerCount || 0}
          icon="👥"
          trend="up"
        />
        <StateCard
          title="Delivery Agents"
          value={dashboardData.deliveryBoyCount || 0}
          icon="🚚"
          trend="neutral"
        />
        <StateCard
          title="Total Earnings"
          value={`${currency} ${dashboardData.totalAmount}`}
          icon="💰"
          trend="up"
        />
        <StateCard
          title="Total Products"
          value={dashboardData.totalProductsAvailable || 0}
          icon="📦"
          trend="up"
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card title="Order Status Distribution">
          <PieChart data={orderStatusData} />
        </Card>
        <Card title="Today's Orders">
          <BarChart data={todayOrderData} />
        </Card>
      </div>

      {/* Product Categories */}
      <Card title="Product Categories">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {productCategoryData.map((category) => (
            <StateCard
              key={category.name}
              title={category.name}
              value={category.value}
              icon="📊"
              trend="neutral"
            />
          ))}
        </div>
      </Card>

      {/* Product & Order Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card title="Order Summary">
          <div className="space-y-3">
            <div className="flex justify-between">
              <span>Total Orders:</span>
              <span className="font-medium">
                {dashboardData.totalOrders || 0}
              </span>
            </div>
            <div className="flex justify-between text-green-600">
              <span>Completed:</span>
              <span className="font-medium">
                {dashboardData.completedOrders || 0}
              </span>
            </div>
            <div className="flex justify-between text-yellow-600">
              <span>Pending:</span>
              <span className="font-medium">
                {dashboardData.pendingOrders || 0}
              </span>
            </div>
            <div className="flex justify-between text-red-600">
              <span>Rejected:</span>
              <span className="font-medium">
                {dashboardData.rejectedOrders || 0}
              </span>
            </div>
          </div>
        </Card>

        <Card title="Today's Activity">
          <div className="space-y-3">
            <div className="flex justify-between text-green-600">
              <span>Completed:</span>
              <span className="font-medium">
                {dashboardData.todayCompletedOrders || 0}
              </span>
            </div>
            <div className="flex justify-between text-yellow-600">
              <span>Pending:</span>
              <span className="font-medium">
                {dashboardData.pendingTodayOrders || 0}
              </span>
            </div>
            <div className="flex justify-between text-red-600">
              <span>Rejected:</span>
              <span className="font-medium">
                {dashboardData.todayRejectedOrders || 0}
              </span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
