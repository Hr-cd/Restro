import {
    CheckCircle,
    Clock,
    MapPin,
    Receipt
} from "lucide-react";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { io } from "socket.io-client";

const OrderSuccessPage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const order = location.state?.order;
    const tableToken = location.state?.tableToken;
    const [status, setStatus] = useState(order?.status || "pending");

    useEffect(() => {
    if (!order?._id) return;

    const socket = io("http://localhost:3000");

    socket.on("order-status-updated", (updatedOrder) => {
        console.log("Order status updated:", updatedOrder);

        if (updatedOrder.orderId === order._id) {
            setStatus(updatedOrder.status);
        }
    });

    return () => {
        socket.disconnect();
    };
}, [order?._id]);

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
                                Table {order.tableId?.tableNumber || "—"}
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
                                            {item.quantity} × ₹
                                            {item.price +
                                                addonTotal}
                                        </p>

                                        {item.addons?.length > 0 && (
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
                                        ₹{itemTotal}
                                    </span>

                                </div>
                            );
                        })}

                    </div>

                    {/* Totals */}
                    <div className="mt-5 border-t pt-5">

                        <div className="flex justify-between">
                            <span>Subtotal</span>

                            <span>
                                ₹{order.subtotal}
                            </span>
                        </div>

                        <div className="mt-2 flex justify-between text-gray-500">
                            <span>Tax</span>

                            <span>
                                ₹{order.tax}
                            </span>
                        </div>

                        <div className="mt-4 flex justify-between border-t pt-4 text-xl font-bold">
                            <span>Total</span>

                            <span>
                                ₹{order.total}
                            </span>
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