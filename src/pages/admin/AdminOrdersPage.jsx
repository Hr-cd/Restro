import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { io } from "socket.io-client";
import {
    Clock3,
    Eye,
    RefreshCw
} from "lucide-react";
import { useSettings } from "../../context/SettingsContext";
import api from "../../services/api";

const AdminOrdersPage = () => {
    const navigate = useNavigate();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [notification, setNotification] = useState(null);
    const [tables, setTables] = useState([]);
    const [selectedTable, setSelectedTable] = useState("");
    const [tableLoading, setTableLoading] = useState(false);
    const [selectedStatus, setSelectedStatus] = useState("");
    const [selectedDate, setSelectedDate] = useState("");
    const {currencySymbol} = useSettings();

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

    const playNotificationSound = () => {
        const AudioContext =
            window.AudioContext || window.webkitAudioContext;

        if (!AudioContext) return;

        const audioContext = new AudioContext();

        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);

        oscillator.type = "sine";
        oscillator.frequency.setValueAtTime(
            880,
            audioContext.currentTime
        );

        gainNode.gain.setValueAtTime(
            0.2,
            audioContext.currentTime
        );

        oscillator.start();

        oscillator.frequency.setValueAtTime(
            660,
            audioContext.currentTime + 0.15
        );

        oscillator.stop(audioContext.currentTime + 0.3);
    };

    const fetchOrdersByTable = async (tableId) => {
        if (!tableId) {
            fetchOrders();
            return;
        }

        try {
            setTableLoading(true);

            const response = await api.get(
                `/admin/orders/table/${tableId}`
            );

            setOrders(response.data.data);
        } catch (error) {
            console.error("Failed to fetch table orders:", error);
        } finally {
            setTableLoading(false);
        }
    };

    useEffect(() => {
        const fetchTables = async () => {
            try {
                const response = await api.get("/admin/tables");
                setTables(response.data.data);
            } catch (error) {
                console.error("Failed to fetch tables:", error);
            }
        };

        fetchTables();
    }, []);

    useEffect(() => {
    const socket = io("http://localhost:3000");

    socket.on("new-order", (newOrder) => {
        console.log("New order received:", newOrder);
        playNotificationSound();
        setOrders((prevOrders) => [
            newOrder,
            ...prevOrders
        ]);

        setNotification({
            orderId: newOrder._id,
            orderNumber: newOrder.orderNumber,
            tableNumber: newOrder.tableId?.tableNumber || "-"
        });

        setTimeout(() => {
            setNotification(null);
        }, 5000);
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

    const filteredOrders = orders.filter((order) => {
        const matchesStatus =
            !selectedStatus || order.status === selectedStatus;

        const matchesDate =
            !selectedDate ||
            new Date(order.createdAt).toISOString().split("T")[0] === selectedDate;

        return matchesStatus && matchesDate;
    });

    return (
        
        <div>
            {notification && (
                <button
                    onClick={() => {
                        navigate(`/admin/orders/${notification.orderId}`);
                        setNotification(null);
                    }}
                    className="fixed right-5 top-5 z-50 w-[320px] rounded-2xl border bg-white p-5 text-left shadow-xl transition hover:scale-[1.02]"
                >
                    <div className="flex items-start gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-orange-100 text-xl">
                            🔔
                        </div>

                        <div>
                            <p className="font-bold">
                                New Order Received
                            </p>

                            <p className="mt-1 text-sm text-gray-500">
                                Order #{notification.orderNumber}
                            </p>

                            <p className="text-sm text-gray-500">
                                Table {notification.tableNumber}
                            </p>

                            <p className="mt-2 text-xs font-medium text-gray-400">
                                Click to view order
                            </p>
                        </div>
                    </div>
                </button>
            )}
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

            {/* Order History Filters */}
            <div className="mt-6 flex flex-wrap items-center gap-3">

                {/* Table */}
                <select
                    value={selectedTable}
                    onChange={(e) => {
                        const tableId = e.target.value;
                        setSelectedTable(tableId);
                        fetchOrdersByTable(tableId);
                    }}
                    className="rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium outline-none focus:border-gray-400"
                >
                    <option value="">All Tables</option>

                    {tables.map((table) => (
                        <option key={table._id} value={table._id}>
                            Table {table.tableNumber}
                        </option>
                    ))}
                </select>

                {/* Status */}
                <select
                    value={selectedStatus}
                    onChange={(e) => setSelectedStatus(e.target.value)}
                    className="rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium outline-none focus:border-gray-400"
                >
                    <option value="">All Statuses</option>
                    <option value="pending">Pending</option>
                    <option value="preparing">Preparing</option>
                    <option value="ready">Ready</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                </select>

                {/* Date */}
                <input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium outline-none focus:border-gray-400"
                />

                {/* Clear */}
                {(selectedTable || selectedStatus || selectedDate) && (
                    <button
                        onClick={() => {
                            setSelectedTable("");
                            setSelectedStatus("");
                            setSelectedDate("");
                            fetchOrders();
                        }}
                        className="rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-600 transition hover:bg-gray-50"
                    >
                        Clear Filters
                    </button>
                )}

            </div>

            {/* Selected Table */}
            {selectedTable && (
                <div className="mt-4 rounded-xl bg-gray-50 px-4 py-3">
                    <p className="text-sm text-gray-500">
                        Showing orders for
                    </p>

                    <p className="font-semibold text-gray-900">
                        Table{" "}
                        {
                            tables.find(
                                (table) => table._id === selectedTable
                            )?.tableNumber
                        }
                    </p>
                </div>
            )}

            {orders.length > 0 && (
                <div className="mt-4 text-sm text-gray-500">
                    Showing <span className="font-semibold text-gray-900">
                        {filteredOrders.length}
                    </span>{" "}
                    of{" "}
                    <span className="font-semibold text-gray-900">
                        {orders.length}
                    </span>{" "}
                    orders
                </div>
            )}

            {/* Loading */}
            {loading || tableLoading ? (
                <div className="mt-8 rounded-2xl border bg-white p-10 text-center text-gray-500">
                    Loading orders...
                </div>
            ) : filteredOrders.length === 0 ? (

                /* Empty */
                <div className="mt-8 rounded-2xl border bg-white p-12 text-center">

                    <Clock3
                        size={40}
                        className="mx-auto text-gray-300"
                    />

                    <h2 className="mt-4 text-lg font-semibold">
                        No orders found
                    </h2>

                    <p className="mt-1 text-sm text-gray-500">
                        Try changing your filters or select another date.
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

                                {filteredOrders.map((order) => (

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
                                            {currencySymbol}{order.total}
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