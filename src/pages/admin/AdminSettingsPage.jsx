import { useEffect, useState } from "react";
import api from "../../services/api";

const AdminSettingsPage = () => {
    const [settings, setSettings] = useState({
        restaurantName: "",
        address: "",
        phone: "",
        email: "",
        currency: "INR",
        currencySymbol: "₹",
        gstEnabled: false,
        gstPercentage: 0,
        serviceChargeEnabled: false,
        serviceChargePercentage: 0,
        deliveryChargeEnabled: false,
        deliveryCharge: 0
    });

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        try {
            setLoading(true);

            const response = await api.get("/admin/settings");

            setSettings(response.data.data);
            setError("");
        } catch (error) {
            console.error("Fetch settings error:", error);

            setError(
                error.response?.data?.message ||
                "Failed to load settings"
            );
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;

        setSettings((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value
        }));

        setMessage("");
        setError("");
    };

    const handleSave = async (e) => {
        e.preventDefault();

        try {
            setSaving(true);
            setMessage("");
            setError("");

            const payload = {
                ...settings,
                gstPercentage: Number(settings.gstPercentage),
                serviceChargePercentage: Number(
                    settings.serviceChargePercentage
                ),
                deliveryCharge: Number(settings.deliveryCharge)
            };

            const response = await api.put(
                "/admin/settings",
                payload
            );

            setSettings(response.data.data);

            setMessage("Settings saved successfully.");
        } catch (error) {
            console.error("Save settings error:", error);

            setError(
                error.response?.data?.message ||
                "Failed to save settings"
            );
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div>
                <h1 className="text-2xl font-bold sm:text-3xl">
                    Settings
                </h1>

                <p className="mt-1 text-gray-500">
                    Manage your restaurant settings.
                </p>

                <div className="mt-8 space-y-6">
                    <div className="h-64 animate-pulse rounded-2xl border bg-gray-100" />
                    <div className="h-64 animate-pulse rounded-2xl border bg-gray-100" />
                </div>
            </div>
        );
    }

    return (
        <div>

            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold sm:text-3xl">
                    Settings
                </h1>

                <p className="mt-1 text-gray-500">
                    Manage your restaurant settings.
                </p>
            </div>


            {/* Messages */}
            {message && (
                <div className="mt-6 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
                    {message}
                </div>
            )}

            {error && (
                <div className="mt-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                    {error}
                </div>
            )}


            <form
                onSubmit={handleSave}
                className="mt-8 space-y-6"
            >

                {/* Restaurant Information */}
                <div className="rounded-2xl border bg-white p-5 shadow-sm sm:p-6">

                    <div>
                        <h2 className="text-lg font-semibold">
                            Restaurant Information
                        </h2>

                        <p className="mt-1 text-sm text-gray-500">
                            Basic information displayed across the system.
                        </p>
                    </div>


                    <div className="mt-6 grid gap-5 md:grid-cols-2">

                        <div>
                            <label className="text-sm font-medium">
                                Restaurant Name
                            </label>

                            <input
                                type="text"
                                name="restaurantName"
                                value={settings.restaurantName}
                                onChange={handleChange}
                                placeholder="Enter restaurant name"
                                className="mt-2 w-full rounded-xl border px-4 py-3 outline-none focus:border-gray-500"
                            />
                        </div>


                        <div>
                            <label className="text-sm font-medium">
                                Phone
                            </label>

                            <input
                                type="text"
                                name="phone"
                                value={settings.phone}
                                onChange={handleChange}
                                placeholder="Enter phone number"
                                className="mt-2 w-full rounded-xl border px-4 py-3 outline-none focus:border-gray-500"
                            />
                        </div>


                        <div>
                            <label className="text-sm font-medium">
                                Email
                            </label>

                            <input
                                type="email"
                                name="email"
                                value={settings.email}
                                onChange={handleChange}
                                placeholder="Enter email address"
                                className="mt-2 w-full rounded-xl border px-4 py-3 outline-none focus:border-gray-500"
                            />
                        </div>


                        <div>
                            <label className="text-sm font-medium">
                                Currency
                            </label>

                            <input
                                type="text"
                                name="currency"
                                value={settings.currency}
                                onChange={handleChange}
                                placeholder="INR"
                                className="mt-2 w-full rounded-xl border px-4 py-3 outline-none focus:border-gray-500"
                            />
                        </div>


                        <div>
                            <label className="text-sm font-medium">
                                Currency Symbol
                            </label>

                            <input
                                type="text"
                                name="currencySymbol"
                                value={settings.currencySymbol}
                                onChange={handleChange}
                                placeholder="₹"
                                className="mt-2 w-full rounded-xl border px-4 py-3 outline-none focus:border-gray-500"
                            />
                        </div>


                        <div className="md:col-span-2">
                            <label className="text-sm font-medium">
                                Address
                            </label>

                            <textarea
                                name="address"
                                value={settings.address}
                                onChange={handleChange}
                                rows="3"
                                placeholder="Enter restaurant address"
                                className="mt-2 w-full rounded-xl border px-4 py-3 outline-none focus:border-gray-500"
                            />
                        </div>

                    </div>

                </div>


                {/* GST / Tax */}
                <div className="rounded-2xl border bg-white p-5 shadow-sm sm:p-6">

                    <div>
                        <h2 className="text-lg font-semibold">
                            GST / Tax
                        </h2>

                        <p className="mt-1 text-sm text-gray-500">
                            Configure GST percentage for orders.
                        </p>
                    </div>


                    <div className="mt-6 flex flex-col gap-5 sm:flex-row sm:items-end">

                        <label className="flex items-center gap-3">
                            <input
                                type="checkbox"
                                name="gstEnabled"
                                checked={settings.gstEnabled}
                                onChange={handleChange}
                                className="h-4 w-4"
                            />

                            <span className="text-sm font-medium">
                                Enable GST
                            </span>
                        </label>


                        <div className="w-full sm:max-w-xs">
                            <label className="text-sm font-medium">
                                GST Percentage
                            </label>

                            <div className="relative mt-2">
                                <input
                                    type="number"
                                    name="gstPercentage"
                                    min="0"
                                    max="100"
                                    step="0.01"
                                    value={settings.gstPercentage}
                                    onChange={handleChange}
                                    disabled={!settings.gstEnabled}
                                    className="w-full rounded-xl border px-4 py-3 pr-10 outline-none disabled:bg-gray-100 focus:border-gray-500"
                                />

                                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500">
                                    %
                                </span>
                            </div>
                        </div>

                    </div>

                </div>


                {/* Service Charge */}
                <div className="rounded-2xl border bg-white p-5 shadow-sm sm:p-6">

                    <div>
                        <h2 className="text-lg font-semibold">
                            Service Charge
                        </h2>

                        <p className="mt-1 text-sm text-gray-500">
                            Configure an optional service charge.
                        </p>
                    </div>


                    <div className="mt-6 flex flex-col gap-5 sm:flex-row sm:items-end">

                        <label className="flex items-center gap-3">
                            <input
                                type="checkbox"
                                name="serviceChargeEnabled"
                                checked={settings.serviceChargeEnabled}
                                onChange={handleChange}
                                className="h-4 w-4"
                            />

                            <span className="text-sm font-medium">
                                Enable Service Charge
                            </span>
                        </label>


                        <div className="w-full sm:max-w-xs">
                            <label className="text-sm font-medium">
                                Service Charge Percentage
                            </label>

                            <div className="relative mt-2">
                                <input
                                    type="number"
                                    name="serviceChargePercentage"
                                    min="0"
                                    max="100"
                                    step="0.01"
                                    value={settings.serviceChargePercentage}
                                    onChange={handleChange}
                                    disabled={
                                        !settings.serviceChargeEnabled
                                    }
                                    className="w-full rounded-xl border px-4 py-3 pr-10 outline-none disabled:bg-gray-100 focus:border-gray-500"
                                />

                                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500">
                                    %
                                </span>
                            </div>
                        </div>

                    </div>

                </div>


                {/* Delivery Charge */}
                <div className="rounded-2xl border bg-white p-5 shadow-sm sm:p-6">

                    <div>
                        <h2 className="text-lg font-semibold">
                            Delivery Charge
                        </h2>

                        <p className="mt-1 text-sm text-gray-500">
                            Configure an optional fixed delivery charge.
                        </p>
                    </div>


                    <div className="mt-6 flex flex-col gap-5 sm:flex-row sm:items-end">

                        <label className="flex items-center gap-3">
                            <input
                                type="checkbox"
                                name="deliveryChargeEnabled"
                                checked={settings.deliveryChargeEnabled}
                                onChange={handleChange}
                                className="h-4 w-4"
                            />

                            <span className="text-sm font-medium">
                                Enable Delivery Charge
                            </span>
                        </label>


                        <div className="w-full sm:max-w-xs">
                            <label className="text-sm font-medium">
                                Delivery Charge
                            </label>

                            <div className="relative mt-2">
                                <input
                                    type="number"
                                    name="deliveryCharge"
                                    min="0"
                                    step="0.01"
                                    value={settings.deliveryCharge}
                                    onChange={handleChange}
                                    disabled={
                                        !settings.deliveryChargeEnabled
                                    }
                                    className="w-full rounded-xl border px-4 py-3 pr-10 outline-none disabled:bg-gray-100 focus:border-gray-500"
                                />

                                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500">
                                    {settings.currencySymbol}
                                </span>
                            </div>
                        </div>

                    </div>

                </div>


                {/* Save */}
                <div className="flex justify-end">

                    <button
                        type="submit"
                        disabled={saving}
                        className="rounded-xl bg-black px-6 py-3 text-sm font-medium text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        {saving ? "Saving..." : "Save Settings"}
                    </button>

                </div>

            </form>

        </div>
    );
};

export default AdminSettingsPage;