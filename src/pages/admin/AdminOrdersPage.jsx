import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import {
    Clock3,
    Eye,
    RefreshCw
} from "lucide-react";

import api from "../../services/api";

const AdminOrdersPage = () => {

    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const fetchOrders = async () => {
        try {
            setLoading(true);

            const response = await api.get("/admin/orders");

            setOrders(response.data.data);
        } catch (error) {
            console.error("Failed to fetch orders:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
    const socket = io("http://localhost:3000");

    socket.on("new-order", (newOrder) => {
        console.log("New order received:", newOrder);

        setOrders((prevOrders) => [
            newOrder,
            ...prevOrders
        ]);
    });

    return () => {
        socket.disconnect();
    };
}, []);

    useEffect(() => {
        fetchOrders();
    }, []);

    const formatDate = (date) => {
        return new Date(date).toLocaleString("en-IN", {
            dateStyle: "medium",
            timeStyle: "short"
        });
    };

    const getStatusClass = (status) => {
        const classes = {
            pending: "bg-orange-50 text-orange-600",
            preparing: "bg-blue-50 text-blue-600",
            ready: "bg-green-50 text-green-600",
            completed: "bg-gray-100 text-gray-700",
            cancelled: "bg-red-50 text-red-600"
        };

        return classes[status] || "bg-gray-100 text-gray-600";
    };

    return (
        <div>

            {/* Header */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

                <div>
                    <h1 className="text-2xl font-bold sm:text-3xl">
                        Orders
                    </h1>

                    <p className="mt-1 text-gray-500">
                        Manage incoming customer orders.
                    </p>
                </div>

                <button
                    onClick={fetchOrders}
                    disabled={loading}
                    className="flex items-center justify-center gap-2 rounded-xl border bg-white px-4 py-2.5 text-sm font-medium transition hover:bg-gray-50 disabled:opacity-50"
                >
                    <RefreshCw
                        size={18}
                        className={loading ? "animate-spin" : ""}
                    />

                    {loading ? "Refreshing..." : "Refresh"}
                </button>

            </div>

            {/* Error */}
            {error && (
                <div className="mt-6 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">
                    {error}
                </div>
            )}

            {/* Loading */}
            {loading ? (
                <div className="mt-8 rounded-2xl border bg-white p-10 text-center text-gray-500">
                    Loading orders...
                </div>
            ) : orders.length === 0 ? (

                /* Empty */
                <div className="mt-8 rounded-2xl border bg-white p-12 text-center">

                    <Clock3
                        size={40}
                        className="mx-auto text-gray-300"
                    />

                    <h2 className="mt-4 text-lg font-semibold">
                        No orders yet
                    </h2>

                    <p className="mt-1 text-sm text-gray-500">
                        New customer orders will appear here.
                    </p>

                </div>

            ) : (

                /* Orders */
                <div className="mt-8 overflow-hidden rounded-2xl border bg-white">

                    <div className="overflow-x-auto">

                        <table className="w-full min-w-212.5">

                            <thead className="border-b bg-gray-50">

                                <tr className="text-left text-sm text-gray-500">

                                    <th className="px-5 py-4 font-medium">
                                        Order
                                    </th>

                                    <th className="px-5 py-4 font-medium">
                                        Customer
                                    </th>

                                    <th className="px-5 py-4 font-medium">
                                        Table
                                    </th>

                                    <th className="px-5 py-4 font-medium">
                                        Items
                                    </th>

                                    <th className="px-5 py-4 font-medium">
                                        Total
                                    </th>

                                    <th className="px-5 py-4 font-medium">
                                        Status
                                    </th>

                                    <th className="px-5 py-4 font-medium">
                                        Time
                                    </th>

                                    <th className="px-5 py-4">
                                    </th>

                                </tr>

                            </thead>

                            <tbody className="divide-y">

                                {orders.map((order) => (

                                    <tr
                                        key={order._id}
                                        className="text-sm"
                                    >

                                        <td className="px-5 py-4">
                                            <p className="font-semibold">
                                                {order.orderNumber}
                                            </p>
                                        </td>

                                        <td className="px-5 py-4">

                                            <p className="font-medium">
                                                {order.customer.name}
                                            </p>

                                            <p className="text-xs text-gray-500">
                                                {order.customer.mobile}
                                            </p>

                                        </td>

                                        <td className="px-5 py-4">
                                            Table{" "}
                                            {order.tableId?.tableNumber || "-"}
                                        </td>

                                        <td className="px-5 py-4">
                                            {order.items.reduce(
                                                (total, item) =>
                                                    total + item.quantity,
                                                0
                                            )}
                                        </td>

                                        <td className="px-5 py-4 font-semibold">
                                            ₹{order.total}
                                        </td>

                                        <td className="px-5 py-4">

                                            <span
                                                className={`rounded-full px-3 py-1 text-xs font-medium capitalize ${getStatusClass(
                                                    order.status
                                                )}`}
                                            >
                                                {order.status}
                                            </span>

                                        </td>

                                        <td className="px-5 py-4 text-gray-500">
                                            {formatDate(
                                                order.createdAt
                                            )}
                                        </td>

                                        <td className="px-5 py-4">

                                            <button
                                                onClick={() =>
                                                    window.location.href =
                                                        `/admin/orders/${order._id}`
                                                }
                                                className="rounded-lg p-2 hover:bg-gray-100"
                                                title="View order"
                                            >
                                                <Eye size={18} />
                                            </button>

                                        </td>

                                    </tr>

                                ))}

                            </tbody>

                        </table>

                    </div>

                </div>

            )}

        </div>
    );
};

export default AdminOrdersPage;