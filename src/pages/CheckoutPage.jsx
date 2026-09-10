import { ArrowLeft, CheckCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import api from "../services/api";
import { useCart } from "../context/CartContext";
import { useSettings } from "../context/SettingsContext";

const CheckoutPage = () => {
    const navigate = useNavigate();

    const [searchParams] = useSearchParams();

    const tableToken = searchParams.get("tableToken");

    const {
        cartItems,
        subtotal,
        getItemUnitPrice,
        clearCart
    } = useCart();

    const [customerName, setCustomerName] = useState("");
    const [mobile, setMobile] = useState("");

    const [table, setTable] = useState(null);
    const [loadingTable, setLoadingTable] = useState(true);
    const [placingOrder, setPlacingOrder] = useState(false);
    const { settings, currencySymbol} = useSettings();
    const [error, setError] = useState("");


    // Resolve table
    useEffect(() => {
        const resolveTable = async () => {
            if (!tableToken) {
                setLoadingTable(false);
                return;
            }

            try {
                const response = await api.get(
                    "/tables/resolve",
                    {
                        params: {
                            token: tableToken
                        }
                    }
                );

                setTable(response.data.data);
            } catch (error) {
                setError(
                    "Unable to detect your table. Please scan the table QR code again."
                );
            } finally {
                setLoadingTable(false);
            }
        };

        resolveTable();
    }, [tableToken]);

    // Calculate charges for display
    const tax = settings.gstEnabled
        ? (subtotal * settings.gstPercentage) / 100
        : 0;

    const serviceCharge = settings.serviceChargeEnabled
        ? (subtotal * settings.serviceChargePercentage) / 100
        : 0;

    const deliveryCharge = settings.deliveryChargeEnabled
        ? Number(settings.deliveryCharge)
        : 0;

    const total =
        subtotal +
        tax +
        serviceCharge +
        deliveryCharge;

    const handlePlaceOrder = async (e) => {
        e.preventDefault();

        setError("");

        if (!customerName.trim()) {
            setError("Please enter your name.");
            return;
        }

        if (!mobile.trim()) {
            setError("Please enter your mobile number.");
            return;
        }

        if (!table) {
            setError("Table could not be detected.");
            return;
        }

        if (cartItems.length === 0) {
            setError("Your cart is empty.");
            return;
        }

        setPlacingOrder(true);

        try {
            const response = await api.post("/orders", {
                tableId: table._id,

                customer: {
                    name: customerName,
                    mobile
                },

                items: cartItems.map((item) => ({
                    foodItemId: item._id,
                    quantity: item.quantity,
                    addons: item.addons || [],
                    note: item.note || ""
                }))
            });

            console.log(
                "Order created:",
                response.data
            );

            const createdOrder = response.data.data;

            clearCart();

            navigate("/order-success", {
                state: {
                    order: createdOrder,
                    tableToken
                }
            });

        } catch (error) {
            setError(
                error.response?.data?.message ||
                "Failed to place order. Please try again."
            );
        } finally {
            setPlacingOrder(false);
        }
    };


    if (cartItems.length === 0) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">

                <div className="text-center">

                    <h1 className="text-2xl font-bold">
                        Your cart is empty
                    </h1>

                    <p className="mt-2 text-gray-500">
                        Add some food before checking out.
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
                        className="mt-5 rounded-xl bg-black px-5 py-3 font-medium text-white"
                    >
                        Back to Menu
                    </button>

                </div>

            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">

            {/* Header */}

            <header className="border-b bg-white">

                <div className="mx-auto flex max-w-5xl items-center gap-4 px-4 py-5">

                    <button
                        onClick={() => navigate(-1)}
                        className="rounded-lg p-2 hover:bg-gray-100"
                    >
                        <ArrowLeft size={20} />
                    </button>

                    <div>

                        <h1 className="text-2xl font-bold">
                            Checkout
                        </h1>

                        <p className="text-sm text-gray-500">
                            Complete your order
                        </p>

                    </div>

                </div>

            </header>


            <main className="mx-auto grid max-w-5xl gap-6 px-4 py-6 lg:grid-cols-5">

                {/* Customer Details */}

                <div className="lg:col-span-3">

                    <form
                        onSubmit={handlePlaceOrder}
                        className="space-y-6"
                    >

                        {/* Table */}

                        <section className="rounded-2xl border bg-white p-5">

                            <h2 className="text-lg font-bold">
                                Table
                            </h2>

                            {loadingTable ? (

                                <p className="mt-3 text-sm text-gray-500">
                                    Detecting table...
                                </p>

                            ) : table ? (

                                <div className="mt-4 flex items-center gap-3 rounded-xl bg-gray-50 p-4">

                                    <CheckCircle
                                        className="text-green-600"
                                        size={22}
                                    />

                                    <div>

                                        <p className="text-sm text-gray-500">
                                            Ordering for
                                        </p>

                                        <p className="font-semibold">
                                            Table {table.tableNumber}
                                        </p>

                                    </div>

                                </div>

                            ) : (

                                <div className="mt-4 rounded-xl bg-red-50 p-4 text-sm text-red-600">
                                    Table not detected.
                                    Please scan the QR code again.
                                </div>

                            )}

                        </section>


                        {/* Customer */}

                        <section className="rounded-2xl border bg-white p-5">

                            <h2 className="text-lg font-bold">
                                Customer Details
                            </h2>

                            <div className="mt-4 space-y-4">

                                <div>

                                    <label className="mb-2 block text-sm font-medium">
                                        Name
                                    </label>

                                    <input
                                        type="text"
                                        value={customerName}
                                        onChange={(e) =>
                                            setCustomerName(
                                                e.target.value
                                            )
                                        }
                                        placeholder="Enter your name"
                                        className="w-full rounded-xl border px-4 py-3 outline-none focus:ring-2"
                                    />

                                </div>


                                <div>

                                    <label className="mb-2 block text-sm font-medium">
                                        Mobile Number
                                    </label>

                                    <input
                                        type="tel"
                                        value={mobile}
                                        onChange={(e) =>
                                            setMobile(
                                                e.target.value
                                            )
                                        }
                                        placeholder="Enter mobile number"
                                        className="w-full rounded-xl border px-4 py-3 outline-none focus:ring-2"
                                    />

                                </div>

                            </div>

                        </section>


                        {error && (

                            <div className="rounded-xl bg-red-50 p-4 text-sm text-red-600">
                                {error}
                            </div>

                        )}


                        <button
                            type="submit"
                            disabled={
                                placingOrder ||
                                loadingTable ||
                                !table
                            }
                            className="w-full rounded-xl bg-black py-4 font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            {placingOrder
                                ? "Processing..."
                                : "Place Order"}
                        </button>

                    </form>

                </div>


                {/* Order Summary */}

                <div className="lg:col-span-2">

                    <section className="sticky top-6 rounded-2xl border bg-white p-5">

                        <h2 className="text-lg font-bold">
                            Order Summary
                        </h2>


                        <div className="mt-5 space-y-4">

                            {cartItems.map((item) => {

                                const unitPrice =
                                    getItemUnitPrice(item);

                                return (

                                    <div
                                        key={item.cartKey}
                                        className="flex justify-between gap-4"
                                    >

                                        <div>

                                            <p className="font-medium">
                                                {item.name}
                                            </p>

                                            <p className="text-sm text-gray-500">
                                                {item.quantity} x{" "}
                                                {currencySymbol}
                                                {unitPrice}
                                            </p>

                                        </div>

                                        <span className="font-medium">
                                            {currencySymbol}
                                            {unitPrice * item.quantity}
                                        </span>

                                    </div>

                                );
                            })}

                        </div>


                        <div className="my-5 border-t" />


                        {/* Subtotal */}

                        <div className="flex justify-between text-sm">

                            <span>
                                Subtotal
                            </span>

                            <span>
                                {currencySymbol}
                                {subtotal}
                            </span>

                        </div>


                        {/* GST */}

                        {settings.gstEnabled && (

                            <div className="mt-2 flex justify-between text-sm text-gray-500">

                                <span>
                                    GST ({settings.gstPercentage}%)
                                </span>

                                <span>
                                    {currencySymbol}
                                    {tax.toFixed(2)}
                                </span>

                            </div>

                        )}


                        {/* Service Charge */}

                        {settings.serviceChargeEnabled && (

                            <div className="mt-2 flex justify-between text-sm text-gray-500">

                                <span>
                                    Service Charge (
                                    {settings.serviceChargePercentage}
                                    %)
                                </span>

                                <span>
                                    {currencySymbol}
                                    {serviceCharge.toFixed(2)}
                                </span>

                            </div>

                        )}


                        {/* Delivery Charge */}

                        {settings.deliveryChargeEnabled && (

                            <div className="mt-2 flex justify-between text-sm text-gray-500">

                                <span>
                                    Delivery Charge
                                </span>

                                <span>
                                    {currencySymbol}
                                    {deliveryCharge.toFixed(2)}
                                </span>

                            </div>

                        )}


                        <div className="my-4 border-t" />


                        {/* Total */}

                        <div className="flex justify-between text-xl font-bold">

                            <span>
                                Total
                            </span>

                            <span>
                                {currencySymbol}
                                {total.toFixed(2)}
                            </span>

                        </div>

                    </section>

                </div>

            </main>

        </div>
    );
};

export default CheckoutPage;