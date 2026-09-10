import {
    CheckCircle,
    Clock,
    MapPin,
    Receipt
} from "lucide-react";

import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { io } from "socket.io-client";
import api from "../services/api";
import { useSettings } from "../context/SettingsContext";

const OrderSuccessPage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { currencySymbol } = useSettings();
    const initialOrder = location.state?.order;
    const tableToken = location.state?.tableToken;

    const [order, setOrder] = useState(initialOrder || null);
    const [status, setStatus] = useState(
        initialOrder?.status || "pending"
    );
    const [loading, setLoading] = useState(!initialOrder);

    /*
     * Keep the order ID in sessionStorage.
     *
     * This survives browser refresh while keeping the order
     * associated with the current browser session.
     */
    useEffect(() => {
        if (initialOrder?._id) {
            sessionStorage.setItem(
                "lastOrderId",
                initialOrder._id
            );
        }
    }, [initialOrder]);

    /*
     * Restore the order after page refresh.
     */
    useEffect(() => {
        const restoreOrder = async () => {
            const orderId =
                initialOrder?._id ||
                sessionStorage.getItem("lastOrderId");

            if (!orderId) {
                setLoading(false);
                return;
            }

            try {
                const response = await api.get(
                    `/orders/${orderId}`
                );

                const restoredOrder = response.data.data;

                setOrder(restoredOrder);
                setStatus(restoredOrder.status);
            } catch (error) {
                console.error(
                    "Failed to restore order:",
                    error
                );
            } finally {
                setLoading(false);
            }
        };

        restoreOrder();
    }, [initialOrder?._id]);

    /*
     * Real-time status updates.
     */
    useEffect(() => {
        if (!order?._id) return;

        const socket = io(import.meta.env.VITE_SOCKET_URL);

        socket.emit("join-order", order._id);   
        socket.on("order-status-updated", (updatedOrder) => {
            console.log(
                "Order status updated:",
                updatedOrder
            );

            if (updatedOrder.orderId === order._id) {
                setStatus(updatedOrder.status);

                setOrder((currentOrder) =>
                    currentOrder
                        ? {
                              ...currentOrder,
                              status: updatedOrder.status
                          }
                        : currentOrder
                );
            }
        });

        return () => {
            socket.disconnect();
        };
    }, [order?._id]);

    if (loading) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
                <div className="text-center">
                    <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-black" />

                    <p className="mt-4 text-gray-500">
                        Loading your order...
                    </p>
                </div>
            </div>
        );
    }

    if (!order) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
                <div className="text-center">
                    <h1 className="text-2xl font-bold">
                        Order not found
                    </h1>

                    <p className="mt-2 text-gray-500">
                        Your order information is unavailable.
                    </p>

                    <button
                        onClick={() =>
                            navigate(
                                `/menu${
                                    tableToken
                                        ? `?tableToken=${tableToken}`
                                        : ""
                                }`
                            )
                        }
                        className="mt-5 rounded-xl bg-black px-5 py-3 font-semibold text-white"
                    >
                        Back to Menu
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 px-4 py-10">
            <div className="mx-auto max-w-2xl">

                {/* Success */}
                <div className="rounded-3xl border bg-white p-8 text-center shadow-sm">
                    <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-green-50">
                        <CheckCircle
                            size={46}
                            className="text-green-600"
                        />
                    </div>

                    <h1 className="mt-5 text-3xl font-bold">
                        Order Placed!
                    </h1>

                    <p className="mt-2 text-gray-500">
                        Your order has been received by the kitchen.
                    </p>

                    {/* Order Number */}
                    <div className="mt-6 rounded-2xl bg-gray-50 p-5">
                        <p className="text-sm text-gray-500">
                            Order Number
                        </p>

                        <p className="mt-1 text-xl font-bold">
                            {order.orderNumber}
                        </p>
                    </div>

                    {/* Status */}
                    <div className="mt-4 flex items-center justify-center gap-2 text-sm">
                        <Clock
                            size={18}
                            className="text-orange-500"
                        />

                        <span>
                            Status:
                        </span>

                        <span className="font-semibold capitalize">
                            {status}
                        </span>
                    </div>
                </div>

                {/* Table */}
                <div className="mt-5 rounded-2xl border bg-white p-5">
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gray-100">
                            <MapPin size={20} />
                        </div>

                        <div>
                            <p className="text-sm text-gray-500">
                                Serving at
                            </p>

                            <p className="font-semibold">
                                Table{" "}
                                {order.tableId?.tableNumber || "—"}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Items */}
                <div className="mt-5 rounded-2xl border bg-white p-5">
                    <div className="flex items-center gap-2">
                        <Receipt size={20} />

                        <h2 className="text-lg font-bold">
                            Order Details
                        </h2>
                    </div>

                    <div className="mt-5 space-y-4">
                        {order.items.map((item, index) => {
                            const addonTotal =
                                (item.addons || []).reduce(
                                    (sum, addon) =>
                                        sum + addon.price,
                                    0
                                );

                            const itemTotal =
                                (item.price + addonTotal) *
                                item.quantity;

                            return (
                                <div
                                    key={index}
                                    className="flex justify-between gap-4 border-b pb-4 last:border-b-0 last:pb-0"
                                >
                                    <div>
                                        <p className="font-medium">
                                            {item.name}
                                        </p>

                                        <p className="text-sm text-gray-500">
                                            {item.quantity} x {currencySymbol}
                                            {item.price +
                                                addonTotal}
                                        </p>

                                        {item.addons?.length >
                                            0 && (
                                            <p className="mt-1 text-xs text-gray-500">
                                                {item.addons
                                                    .map(
                                                        (addon) =>
                                                            addon.name
                                                    )
                                                    .join(", ")}
                                            </p>
                                        )}

                                        {item.note && (
                                            <p className="mt-1 text-xs text-gray-500">
                                                Note: {item.note}
                                            </p>
                                        )}
                                    </div>

                                    <span className="font-semibold">
                                        {currencySymbol}{itemTotal}
                                    </span>
                                </div>
                            );
                        })}
                    </div>

                    {/* Totals */}
                    <div className="mt-5 border-t pt-5">
                        {/* Subtotal */}
                        <div className="flex justify-between">
                            <span>Subtotal</span>
                            <span>{currencySymbol}{Number(order.subtotal).toFixed(2)}</span>
                        </div>

                        {/* GST / Tax */}
                        {Number(order.tax) > 0 && (
                            <div className="mt-2 flex justify-between text-gray-500">
                                <span>Tax</span>
                                <span>{currencySymbol}{Number(order.tax).toFixed(2)}</span>
                            </div>
                        )}

                        {/* Service Charge */}
                        {Number(order.serviceCharge) > 0 && (
                            <div className="mt-2 flex justify-between text-gray-500">
                                <span>Service Charge</span>
                                <span>
                                    {currencySymbol}{Number(order.serviceCharge).toFixed(2)}
                                </span>
                            </div>
                        )}

                        {/* Delivery Charge */}
                        {Number(order.deliveryCharge) > 0 && (
                            <div className="mt-2 flex justify-between text-gray-500">
                                <span>Delivery Charge</span>
                                <span>
                                    {currencySymbol}{Number(order.deliveryCharge).toFixed(2)}
                                </span>
                            </div>
                        )}

                        {/* Total */}
                        <div className="mt-4 flex justify-between border-t pt-4 text-xl font-bold">
                            <span>Total</span>
                            <span>{currencySymbol}{Number(order.total).toFixed(2)}</span>
                        </div>
                    </div>
                </div>

                {/* Buttons */}
                <div className="mt-5 flex flex-col gap-3 sm:flex-row">
                    <button
                        onClick={() =>
                            navigate(
                                `/menu${
                                    tableToken
                                        ? `?tableToken=${tableToken}`
                                        : ""
                                }`
                            )
                        }
                        className="flex-1 rounded-xl border bg-white py-3 font-semibold hover:bg-gray-50"
                    >
                        Back to Menu
                    </button>

                    <button
                        onClick={() => window.print()}
                        className="flex-1 rounded-xl bg-black py-3 font-semibold text-white hover:opacity-90"
                    >
                        Print Receipt
                    </button>
                </div>
            </div>
        </div>
    );
};

export default OrderSuccessPage;