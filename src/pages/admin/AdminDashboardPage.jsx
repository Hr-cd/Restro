import { useEffect, useState } from "react";
import api from "../../services/api.js";
import { Link } from "react-router-dom";

const AdminDashboardPage = () => {
    const admin = JSON.parse(
        localStorage.getItem("restro_admin") || "{}"
    );

    const [dashboard, setDashboard] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const fetchDashboard = async () => {
        try {
            setLoading(true);

            const response = await api.get("/admin/dashboard");

            setDashboard(response.data.data);
            setError("");
        } catch (error) {
            console.error("Dashboard fetch error:", error);

            setError(
                error.response?.data?.message ||
                "Failed to load dashboard"
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDashboard();
    }, []);

    if (loading) {
        return (
            <div>
                <div>
                    <h1 className="text-2xl font-bold sm:text-3xl">
                        Dashboard
                    </h1>

                    <p className="mt-1 text-gray-500">
                        Welcome back, {admin.name || "Admin"}.
                    </p>
                </div>

                <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                    {[1, 2, 3, 4].map((item) => (
                        <div
                            key={item}
                            className="h-32 animate-pulse rounded-2xl border bg-gray-100"
                        />
                    ))}
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div>
                <h1 className="text-2xl font-bold sm:text-3xl">
                    Dashboard
                </h1>

                <div className="mt-8 rounded-2xl border border-red-200 bg-red-50 p-5">
                    <p className="font-medium text-red-600">
                        {error}
                    </p>

                    <button
                        onClick={fetchDashboard}
                        className="mt-3 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white"
                    >
                        Retry
                    </button>
                </div>
            </div>
        );
    }

    const statusCounts = dashboard?.statusCounts || {};

    const statusData = [
        {
            label: "Pending",
            value: statusCounts.pending || 0,
            className: "bg-yellow-50 text-yellow-700"
        },
        {
            label: "Preparing",
            value: statusCounts.preparing || 0,
            className: "bg-blue-50 text-blue-700"
        },
        {
            label: "Ready",
            value: statusCounts.ready || 0,
            className: "bg-green-50 text-green-700"
        },
        {
            label: "Completed",
            value: statusCounts.completed || 0,
            className: "bg-gray-100 text-gray-700"
        },
        {
            label: "Cancelled",
            value: statusCounts.cancelled || 0,
            className: "bg-red-50 text-red-700"
        }
    ];

    return (
        <div>

            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold sm:text-3xl">
                    Dashboard
                </h1>

                <p className="mt-1 text-gray-500">
                    Welcome back, {admin.name || "Admin"}.
                </p>
            </div>


            {/* KPI Cards */}
            <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">

                <div className="rounded-2xl border bg-white p-5 shadow-sm">
                    <p className="text-sm text-gray-500">
                        Today's Orders
                    </p>

                    <p className="mt-2 text-3xl font-bold">
                        {dashboard.todayOrders}
                    </p>
                </div>


                <div className="rounded-2xl border bg-white p-5 shadow-sm">
                    <p className="text-sm text-gray-500">
                        Today's Sales
                    </p>

                    <p className="mt-2 text-3xl font-bold">
                        ₹{dashboard.todaySales.toLocaleString("en-IN")}
                    </p>
                </div>


                <div className="rounded-2xl border bg-white p-5 shadow-sm">
                    <p className="text-sm text-gray-500">
                        Pending Orders
                    </p>

                    <p className="mt-2 text-3xl font-bold">
                        {dashboard.pendingOrders}
                    </p>
                </div>

            </div>


            {/* Order Status */}
            <div className="mt-8 rounded-2xl border bg-white p-5 shadow-sm">

                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-lg font-semibold">
                            Order Overview
                        </h2>

                        <p className="mt-1 text-sm text-gray-500">
                            Current order status
                        </p>
                    </div>

                    <Link
                        to="/admin/orders"
                        className="text-sm font-medium text-gray-700 hover:underline"
                    >
                        View Orders
                    </Link>
                </div>


                <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">

                    {statusData.map((status) => (
                        <div
                            key={status.label}
                            className={`rounded-xl p-4 ${status.className}`}
                        >
                            <p className="text-sm font-medium">
                                {status.label}
                            </p>

                            <p className="mt-2 text-2xl font-bold">
                                {status.value}
                            </p>
                        </div>
                    ))}

                </div>

            </div>


            {/* Recent Orders */}
            <div className="mt-8 rounded-2xl border bg-white shadow-sm">

                <div className="flex items-center justify-between border-b p-5">

                    <div>
                        <h2 className="text-lg font-semibold">
                            Recent Orders
                        </h2>

                        <p className="mt-1 text-sm text-gray-500">
                            Latest orders received
                        </p>
                    </div>

                    <Link
                        to="/admin/orders"
                        className="text-sm font-medium text-gray-700 hover:underline"
                    >
                        View All
                    </Link>

                </div>


                {dashboard.recentOrders.length === 0 ? (

                    <div className="p-8 text-center">
                        <p className="font-medium text-gray-600">
                            No orders yet
                        </p>

                        <p className="mt-1 text-sm text-gray-400">
                            New orders will appear here.
                        </p>
                    </div>

                ) : (

                    <div className="overflow-x-auto">

                        <table className="w-full min-w-175 text-left text-sm">

                            <thead className="border-b bg-gray-50 text-gray-500">
                                <tr>
                                    <th className="px-5 py-3 font-medium">
                                        Order
                                    </th>

                                    <th className="px-5 py-3 font-medium">
                                        Table
                                    </th>

                                    <th className="px-5 py-3 font-medium">
                                        Customer
                                    </th>

                                    <th className="px-5 py-3 font-medium">
                                        Total
                                    </th>

                                    <th className="px-5 py-3 font-medium">
                                        Status
                                    </th>
                                </tr>
                            </thead>


                            <tbody>

                                {dashboard.recentOrders.map((order) => (

                                    <tr
                                        key={order._id}
                                        className="border-b last:border-0"
                                    >

                                        <td className="px-5 py-4 font-medium">
                                            {order.orderNumber}
                                        </td>

                                        <td className="px-5 py-4">
                                            Table{" "}
                                            {order.tableId?.tableNumber || "-"}
                                        </td>

                                        <td className="px-5 py-4">
                                            {order.customer?.name || "-"}
                                        </td>

                                        <td className="px-5 py-4 font-medium">
                                            ₹{order.total.toLocaleString("en-IN")}
                                        </td>

                                        <td className="px-5 py-4">

                                            <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium capitalize">
                                                {order.status}
                                            </span>

                                        </td>

                                    </tr>

                                ))}

                            </tbody>

                        </table>

                    </div>

                )}

            </div>


            {/* Quick Actions */}
            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">

                <Link
                    to="/admin/orders"
                    className="rounded-2xl border bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
                >
                    <p className="font-semibold">
                        Manage Orders
                    </p>

                    <p className="mt-1 text-sm text-gray-500">
                        View and update orders
                    </p>
                </Link>


                <Link
                    to="/admin/menu"
                    className="rounded-2xl border bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
                >
                    <p className="font-semibold">
                        Manage Menu
                    </p>

                    <p className="mt-1 text-sm text-gray-500">
                        Add and manage food items
                    </p>
                </Link>

                <Link
                    to="/admin/categories"
                    className="rounded-2xl border bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
                >
                    <p className="font-semibold">
                        Manage Categories
                    </p>

                    <p className="mt-1 text-sm text-gray-500">
                        Add and manage categories
                    </p>
                </Link>


                <Link
                    to="/admin/tables"
                    className="rounded-2xl border bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
                >
                    <p className="font-semibold">
                        Manage Tables
                    </p>

                    <p className="mt-1 text-sm text-gray-500">
                        Manage tables and QR codes
                    </p>
                </Link>


                <Link
                    to="/admin/reports"
                    className="rounded-2xl border bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
                >
                    <p className="font-semibold">
                        View Reports
                    </p>

                    <p className="mt-1 text-sm text-gray-500">
                        Sales and performance reports
                    </p>
                </Link>

            </div>

        </div>
    );
};

export default AdminDashboardPage;