import { useEffect, useState } from "react";
import {
    ArrowLeft,
    Clock3,
    MapPin,
    Phone,
    User
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../services/api";
import { useSettings } from "../../context/SettingsContext";

const AdminOrderDetailsPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [updatingStatus, setUpdatingStatus] = useState(false);
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const { currencySymbol } = useSettings();

    useEffect(() => {
        const fetchOrder = async () => {
            try {
                const response = await api.get(
                    `/admin/orders/${id}`
                );

                setOrder(response.data.data);

            } catch (error) {
                setError(
                    error.response?.data?.message ||
                    "Failed to load order."
                );
            } finally {
                setLoading(false);
            }
        };

        fetchOrder();
    }, [id]);

    const handleStatusChange = async (status) => {
    try {
        setUpdatingStatus(true);

        const token = localStorage.getItem("adminToken");

        const response = await api.put(
            `/admin/orders/${order._id}/status`,
            { status }
        );

        setOrder(response.data.data);

    } catch (error) {
        console.error(error);

        alert(
            error.response?.data?.message ||
            "Failed to update order status"
        );
    } finally {
        setUpdatingStatus(false);
    }
};

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

    if (loading) {
        return (
            <div className="rounded-2xl border bg-white p-10 text-center text-gray-500">
                Loading order...
            </div>
        );
    }

    if (error || !order) {
        return (
            <div>

                <button
                    onClick={() => navigate("/admin/orders")}
                    className="mb-6 flex items-center gap-2 text-sm font-medium"
                >
                    <ArrowLeft size={18} />
                    Back to Orders
                </button>

                <div className="rounded-2xl bg-red-50 p-6 text-red-600">
                    {error || "Order not found."}
                </div>

            </div>
        );
    }

    return (
        <div className="mx-auto max-w-6xl">

            {/* Header */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

                <div>

                    <button
                        onClick={() =>
                            navigate("/admin/orders")
                        }
                        className="mb-4 flex items-center gap-2 text-sm text-gray-500 hover:text-black"
                    >
                        <ArrowLeft size={18} />
                        Back to Orders
                    </button>

                    <h1 className="text-2xl font-bold sm:text-3xl">
                        Order Details
                    </h1>

                    <p className="mt-1 text-gray-500">
                        {order.orderNumber}
                    </p>

                </div>

                <div className="flex flex-wrap gap-3 mt-6">
                    {["pending", "preparing", "ready", "completed", "cancelled"].map(
                        (status) => (
                            <button
                                key={status}
                                onClick={() => handleStatusChange(status)}
                                disabled={updatingStatus || order.status === status}
                                className={`px-5 py-2.5 rounded-lg border text-sm font-medium capitalize transition
                                    ${
                                        order.status === status
                                            ? "bg-black text-white border-black"
                                            : "bg-white text-gray-700 border-gray-300 hover:border-black"
                                    }
                                    disabled:opacity-50`}
                            >
                                {status}
                            </button>
                        )
                    )}
                    <button
                        onClick={() =>
                            window.open(
                                `/admin/orders/${order._id}/print`,
                                "_blank"
                            )
                        }
                        className="rounded-xl border bg-white px-4 py-2.5 text-sm font-medium transition hover:bg-gray-50"
                    >
                        🖨️ Print Kitchen Slip
                    </button>
                </div>
            </div>


            {/* Customer + Table */}
            <div className="mt-8 grid gap-5 md:grid-cols-3">

                <div className="rounded-2xl border bg-white p-5">

                    <div className="flex items-center gap-3">

                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gray-100">
                            <User size={19} />
                        </div>

                        <div>
                            <p className="text-xs text-gray-500">
                                Customer
                            </p>

                            <p className="font-semibold">
                                {order.customer.name}
                            </p>
                        </div>

                    </div>

                </div>


                <div className="rounded-2xl border bg-white p-5">

                    <div className="flex items-center gap-3">

                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gray-100">
                            <Phone size={19} />
                        </div>

                        <div>
                            <p className="text-xs text-gray-500">
                                Mobile
                            </p>

                            <p className="font-semibold">
                                {order.customer.mobile}
                            </p>
                        </div>

                    </div>

                </div>


                <div className="rounded-2xl border bg-white p-5">

                    <div className="flex items-center gap-3">

                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gray-100">
                            <MapPin size={19} />
                        </div>

                        <div>
                            <p className="text-xs text-gray-500">
                                Table
                            </p>

                            <p className="font-semibold">
                                Table{" "}
                                {order.tableId?.tableNumber || "-"}
                            </p>
                        </div>

                    </div>

                </div>

            </div>


            {/* Time */}
            <div className="mt-5 flex items-center gap-2 text-sm text-gray-500">
                <Clock3 size={17} />
                Ordered {formatDate(order.createdAt)}
            </div>


            {/* Main content */}
            <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_360px]">

                {/* Items */}
                <div className="rounded-2xl border bg-white p-6">

                    <h2 className="text-lg font-bold">
                        Order Items
                    </h2>

                    <div className="mt-5 divide-y">

                        {order.items.map((item, index) => (

                            <div
                                key={index}
                                className="py-5 first:pt-0 last:pb-0"
                            >

                                <div className="flex justify-between gap-4">

                                    <div>

                                        <h3 className="font-semibold">
                                            {item.name}
                                        </h3>

                                        <p className="mt-1 text-sm text-gray-500">
                                            {item.quantity} x {currencySymbol}
                                            {item.price}
                                        </p>

                                        {/* Addons */}
                                        {item.addons?.length > 0 && (
                                            <div className="mt-2 space-y-1">

                                                {item.addons.map(
                                                    (addon, addonIndex) => (
                                                        <p
                                                            key={addonIndex}
                                                            className="text-sm text-gray-500"
                                                        >
                                                            + {addon.name} — {currencySymbol}
                                                            {addon.price}
                                                        </p>
                                                    )
                                                )}

                                            </div>
                                        )}

                                        {/* Note */}
                                        {item.note && (
                                            <p className="mt-2 rounded-lg bg-gray-50 px-3 py-2 text-sm text-gray-600">
                                                Note: {item.note}
                                            </p>
                                        )}

                                    </div>

                                    <p className="font-semibold">
                                        {currencySymbol}{item.price *
                                            item.quantity}
                                    </p>

                                </div>

                            </div>

                        ))}

                    </div>

                </div>


                {/* Summary */}
                <div className="h-fit rounded-2xl border bg-white p-6">

                    <h2 className="text-lg font-bold">
                        Payment Summary
                    </h2>

                    <div className="mt-5 space-y-4">

                        <div className="flex justify-between text-sm">
                            <span className="text-gray-500">
                                Subtotal
                            </span>

                            <span>
                                {currencySymbol}{order.subtotal}
                            </span>
                        </div>

                        <div className="flex justify-between text-sm">
                            <span className="text-gray-500">
                                Tax
                            </span>

                            <span>
                                {currencySymbol}{order.tax}
                            </span>
                        </div>

                        <div className="flex justify-between text-sm">
                            <span className="text-gray-500">
                                Service Charge
                            </span>

                            <span>
                                {currencySymbol}{order.serviceCharge}
                            </span>
                        </div>

                        <div className="flex justify-between text-sm">
                            <span className="text-gray-500">
                                Delivery Charge
                            </span>

                            <span>
                                {currencySymbol}{order.deliveryCharge}
                            </span>
                        </div>

                        <div className="border-t pt-4">

                            <div className="flex justify-between">

                                <span className="text-lg font-bold">
                                    Total
                                </span>

                                <span className="text-xl font-bold">
                                    {currencySymbol}{order.total}
                                </span>

                            </div>

                        </div>

                    </div>

                </div>

            </div>

        </div>
    );
};

export default AdminOrderDetailsPage;