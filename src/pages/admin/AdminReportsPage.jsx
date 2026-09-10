import { useEffect, useState } from "react";

import {
    BarChart3,
    CalendarDays,
    FileSpreadsheet,
    RefreshCw,
    ShoppingBag,
    TrendingUp
} from "lucide-react";
import { useSettings } from "../../context/SettingsContext";
import api from "../../services/api";

const AdminReportsPage = () => {
    /*
     * IMPORTANT:
     * Use local date instead of toISOString().
     *
     * toISOString() converts the date to UTC and can shift
     * the calendar date backward in India.
     */
    const { currencySymbol } = useSettings();
    const getLocalDateString = (date = new Date()) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");

        return `${year}-${month}-${day}`;
    };

    const getMonday = () => {
        const date = new Date();
        const day = date.getDay();

        const diff = day === 0 ? -6 : 1 - day;

        date.setDate(date.getDate() + diff);

        return getLocalDateString(date);
    };

    const today = getLocalDateString();

    const [activeReport, setActiveReport] = useState("daily");

    const [date, setDate] = useState(today);

    const [startDate, setStartDate] = useState(getMonday());

    const [endDate, setEndDate] = useState(today);

    const [report, setReport] = useState(null);

    const [loading, setLoading] = useState(false);

    const [error, setError] = useState("");

    const formatCurrency = (value) => {
    return `${currencySymbol}${Number(value || 0).toLocaleString("en-IN", {
        maximumFractionDigits: 2
    })}`;
};

    /*
     * Fetch currently selected report.
     */
    const fetchReport = async () => {
        try {
            setLoading(true);
            setError("");

            let response;

            if (activeReport === "daily") {
                response = await api.get("/admin/sales/daily", {
                    params: {
                        date
                    }
                });
            } else if (activeReport === "weekly") {
                response = await api.get("/admin/sales/weekly", {
                    params: {
                        startDate,
                        endDate
                    }
                });
            } else if (activeReport === "monthly") {
                response = await api.get("/admin/sales/monthly", {
                    params: {
                        startDate,
                        endDate
                    }
                });
            }

            setReport(response.data.data);
        } catch (error) {
            console.error("Report error:", error);

            setReport(null);

            setError(
                error.response?.data?.message ||
                    "Failed to load report."
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchReport();
    }, [activeReport, date, startDate, endDate]);

    /*
     * Export current selected date range.
     *
     * Daily exports the selected day.
     * Weekly/Monthly export the selected range.
     */
    const handleExport = async () => {
        try {
            let exportStartDate = startDate;
            let exportEndDate = endDate;

            if (activeReport === "daily") {
                exportStartDate = date;
                exportEndDate = date;
            }

            const response = await api.get(
                "/admin/sales/export",
                {
                    params: {
                        startDate: exportStartDate,
                        endDate: exportEndDate
                    },
                    responseType: "blob"
                }
            );

            const blob = new Blob([response.data], {
                type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
            });

            const url = window.URL.createObjectURL(blob);

            const link = document.createElement("a");

            link.href = url;

            link.download = `sales-report-${exportStartDate}-to-${exportEndDate}.xlsx`;

            document.body.appendChild(link);

            link.click();

            link.remove();

            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error("Export error:", error);

            alert("Failed to export sales report.");
        }
    };

    /*
     * Current report totals.
     *
     * This is intentionally based on `report`,
     * not a separate summary request.
     *
     * Therefore:
     *
     * Daily   → selected day
     * Weekly  → selected range
     * Monthly → selected range
     */
    const totalSales = report?.totalSales || 0;

    const totalOrders = report?.totalOrders || 0;

    const averageOrderValue =
        report?.averageOrderValue || 0;

    const breakdown =
        report?.dailyBreakdown ||
        report?.monthlyBreakdown ||
        [];

    return (
        <div className="min-h-screen bg-slate-50 p-4 md:p-6">

            {/* HEADER */}
            <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">
                        Reports
                    </h1>

                    <p className="mt-1 text-sm text-slate-500">
                        Track sales and order performance.
                    </p>
                </div>

                <button
                    onClick={handleExport}
                    className="flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800"
                >
                    <FileSpreadsheet size={18} />

                    Export Excel
                </button>
            </div>

            {/* SUMMARY CARDS */}
            <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">

                {/* TOTAL SALES */}
                <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
                    <div className="mb-4 flex items-center justify-between">
                        <div className="rounded-xl bg-slate-100 p-3">
                            <TrendingUp size={20} />
                        </div>
                    </div>

                    <p className="text-sm text-slate-500">
                        Total Sales
                    </p>

                    <h2 className="mt-1 text-2xl font-bold">
                        {loading
                            ? "..."
                            : formatCurrency(totalSales)}
                    </h2>
                </div>

                {/* COMPLETED ORDERS */}
                <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
                    <div className="mb-4 w-fit rounded-xl bg-slate-100 p-3">
                        <ShoppingBag size={20} />
                    </div>

                    <p className="text-sm text-slate-500">
                        Completed Orders
                    </p>

                    <h2 className="mt-1 text-2xl font-bold">
                        {loading
                            ? "..."
                            : totalOrders}
                    </h2>
                </div>

                {/* AVERAGE ORDER */}
                <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
                    <div className="mb-4 w-fit rounded-xl bg-slate-100 p-3">
                        <BarChart3 size={20} />
                    </div>

                    <p className="text-sm text-slate-500">
                        Average Order Value
                    </p>

                    <h2 className="mt-1 text-2xl font-bold">
                        {loading
                            ? "..."
                            : formatCurrency(
                                  averageOrderValue
                              )}
                    </h2>
                </div>
            </div>

            {/* REPORT CONTROLS */}
            <div className="mb-6 rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200">

                {/* TABS */}
                <div className="mb-5 flex flex-wrap gap-2">
                    {["daily", "weekly", "monthly"].map(
                        (type) => (
                            <button
                                key={type}
                                onClick={() =>
                                    setActiveReport(type)
                                }
                                className={`rounded-xl px-4 py-2 text-sm font-semibold capitalize transition ${
                                    activeReport === type
                                        ? "bg-slate-900 text-white"
                                        : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                                }`}
                            >
                                {type}
                            </button>
                        )
                    )}
                </div>

                {/* DAILY */}
                {activeReport === "daily" ? (
                    <div className="max-w-sm">
                        <label className="mb-2 block text-sm font-medium text-slate-700">
                            Select Date
                        </label>

                        <div className="relative">
                            <CalendarDays
                                size={18}
                                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                            />

                            <input
                                type="date"
                                value={date}
                                onChange={(e) =>
                                    setDate(e.target.value)
                                }
                                className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-3 text-sm outline-none focus:border-slate-400"
                            />
                        </div>
                    </div>
                ) : (
                    /* WEEKLY / MONTHLY */
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">

                        <div>
                            <label className="mb-2 block text-sm font-medium text-slate-700">
                                Start Date
                            </label>

                            <input
                                type="date"
                                value={startDate}
                                onChange={(e) =>
                                    setStartDate(
                                        e.target.value
                                    )
                                }
                                className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-slate-400"
                            />
                        </div>

                        <div>
                            <label className="mb-2 block text-sm font-medium text-slate-700">
                                End Date
                            </label>

                            <input
                                type="date"
                                value={endDate}
                                onChange={(e) =>
                                    setEndDate(
                                        e.target.value
                                    )
                                }
                                className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-slate-400"
                            />
                        </div>
                    </div>
                )}
            </div>

            {/* REPORT RESULT */}
            <div className="rounded-2xl bg-white shadow-sm ring-1 ring-slate-200">

                {/* REPORT HEADER */}
                <div className="flex items-center justify-between border-b border-slate-100 p-5">
                    <div>
                        <h2 className="text-lg font-bold text-slate-900">
                            {activeReport === "daily"
                                ? "Daily Sales"
                                : activeReport === "weekly"
                                ? "Weekly Sales"
                                : "Monthly Sales"}
                        </h2>

                        <p className="text-sm text-slate-500">
                            Completed orders only
                        </p>
                    </div>

                    <button
                        onClick={fetchReport}
                        className="rounded-xl p-2.5 text-slate-500 hover:bg-slate-100"
                        title="Refresh"
                    >
                        <RefreshCw
                            size={18}
                            className={
                                loading
                                    ? "animate-spin"
                                    : ""
                            }
                        />
                    </button>
                </div>

                {/* ERROR */}
                {error && (
                    <div className="m-5 rounded-xl bg-red-50 p-4 text-sm text-red-600">
                        {error}
                    </div>
                )}

                {/* LOADING */}
                {loading ? (
                    <div className="p-10 text-center text-sm text-slate-500">
                        Loading report...
                    </div>
                ) : !report ? (
                    <div className="p-10 text-center">
                        <BarChart3
                            size={40}
                            className="mx-auto mb-3 text-slate-300"
                        />

                        <p className="font-medium text-slate-600">
                            No report data
                        </p>
                    </div>
                ) : activeReport === "daily" ? (

                    /* DAILY RESULT */
                    <div className="grid grid-cols-1 gap-4 p-5 sm:grid-cols-3">

                        <div className="rounded-xl bg-slate-50 p-4">
                            <p className="text-sm text-slate-500">
                                Sales
                            </p>

                            <p className="mt-1 text-xl font-bold">
                                {formatCurrency(
                                    report.totalSales
                                )}
                            </p>
                        </div>

                        <div className="rounded-xl bg-slate-50 p-4">
                            <p className="text-sm text-slate-500">
                                Orders
                            </p>

                            <p className="mt-1 text-xl font-bold">
                                {report.totalOrders || 0}
                            </p>
                        </div>

                        <div className="rounded-xl bg-slate-50 p-4">
                            <p className="text-sm text-slate-500">
                                Average Order
                            </p>

                            <p className="mt-1 text-xl font-bold">
                                {formatCurrency(
                                    report.averageOrderValue
                                )}
                            </p>
                        </div>
                    </div>

                ) : breakdown.length === 0 ? (

                    /* EMPTY */
                    <div className="p-10 text-center">
                        <BarChart3
                            size={40}
                            className="mx-auto mb-3 text-slate-300"
                        />

                        <p className="font-medium text-slate-600">
                            No sales data
                        </p>

                        <p className="mt-1 text-sm text-slate-400">
                            No completed orders found for this period.
                        </p>
                    </div>

                ) : (

                    /* WEEKLY / MONTHLY TABLE */
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">

                            <thead className="bg-slate-50 text-xs uppercase text-slate-500">
                                <tr>
                                    <th className="px-5 py-3">
                                        {activeReport ===
                                        "monthly"
                                            ? "Month"
                                            : "Date"}
                                    </th>

                                    <th className="px-5 py-3">
                                        Orders
                                    </th>

                                    <th className="px-5 py-3">
                                        Sales
                                    </th>
                                </tr>
                            </thead>

                            <tbody className="divide-y divide-slate-100">
                                {breakdown.map((item) => (
                                    <tr
                                        key={
                                            item.date ||
                                            item.month
                                        }
                                        className="hover:bg-slate-50"
                                    >
                                        <td className="px-5 py-4 font-medium text-slate-900">
                                            {item.date ||
                                                item.month}
                                        </td>

                                        <td className="px-5 py-4 text-slate-600">
                                            {item.totalOrders}
                                        </td>

                                        <td className="px-5 py-4 font-semibold text-slate-900">
                                            {formatCurrency(
                                                item.totalSales
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminReportsPage;