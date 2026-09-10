import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../../services/api";

const AdminKitchenPrintPage = () => {
    const { id } = useParams();

    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchOrder = async () => {
            try {
                const response = await api.get(`/admin/orders/${id}`);

                setOrder(response.data.data);
            } catch (error) {
                console.error("Failed to load print order:", error);

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

    // Automatically open browser print dialog
    useEffect(() => {
        if (!order) return;

        const timer = setTimeout(() => {
            window.print();
        }, 700);

        return () => clearTimeout(timer);
    }, [order]);

    if (loading) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-white font-mono">
                Loading order...
            </div>
        );
    }

    if (error || !order) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-white p-6 font-mono">
                <div>
                    <h1 className="text-lg font-bold">
                        Unable to load order
                    </h1>

                    <p className="mt-2 text-sm">
                        {error || "Order not found."}
                    </p>
                </div>
            </div>
        );
    }

    return (
        <>
            <div className="mx-auto max-w-md bg-white p-6 font-mono text-sm text-black print:max-w-none print:p-2">

                {/* HEADER */}
                <div className="border-b border-dashed border-black pb-4 text-center">
                    <h1 className="text-xl font-bold">
                        KITCHEN ORDER
                    </h1>

                    <p className="mt-1">
                        Order #{order.orderNumber}
                    </p>

                    <p className="text-xs">
                        {new Date(order.createdAt).toLocaleString()}
                    </p>
                </div>

                {/* ORDER INFO */}
                <div className="border-b border-dashed border-black py-4">

                    <div className="flex justify-between">
                        <span>Table</span>
                        <strong>
                            {order.tableId?.tableNumber || "-"}
                        </strong>
                    </div>

                    <div className="mt-1 flex justify-between">
                        <span>Customer</span>
                        <strong>
                            {order.customer?.name || "-"}
                        </strong>
                    </div>

                    <div className="mt-1 flex justify-between">
                        <span>Mobile</span>
                        <strong>
                            {order.customer?.mobile || "-"}
                        </strong>
                    </div>

                </div>

                {/* ITEMS */}
                <div className="border-b border-dashed border-black py-4">

                    <h2 className="mb-3 font-bold">
                        ITEMS
                    </h2>

                    {order.items?.map((item, index) => (
                        <div
                            key={index}
                            className="mb-4 last:mb-0"
                        >

                            <div className="flex justify-between">
                                <span className="font-bold">
                                    {item.name}
                                </span>

                                <span>
                                    x{item.quantity}
                                </span>
                            </div>

                            {/* ADDONS */}
                            {item.addons?.length > 0 && (
                                <div className="ml-3 mt-1 text-xs">
                                    {item.addons.map(
                                        (addon, addonIndex) => (
                                            <div key={addonIndex}>
                                                + {addon.name}
                                            </div>
                                        )
                                    )}
                                </div>
                            )}

                            {/* NOTE */}
                            {item.note && (
                                <div className="ml-3 mt-1 text-xs">
                                    Note: {item.note}
                                </div>
                            )}

                        </div>
                    ))}

                </div>

                {/* STATUS */}
                <div className="py-4 text-center">

                    <p className="text-xs uppercase">
                        Order Status
                    </p>

                    <p className="mt-1 text-lg font-bold uppercase">
                        {order.status}
                    </p>

                </div>

                <div className="mt-4 text-center text-xs">
                    --- Kitchen Copy ---
                </div>

            </div>

            <style>
                {`
                    @media print {
                        body {
                            margin: 0;
                            background: white;
                        }

                        @page {
                            margin: 8mm;
                        }
                    }
                `}
            </style>
        </>
    );
};

export default AdminKitchenPrintPage;