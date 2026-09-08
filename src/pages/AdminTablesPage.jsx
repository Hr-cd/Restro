import { useEffect, useState } from "react";
import api from "../services/api";
import { QRCodeCanvas } from "qrcode.react";

const AdminTablesPage = () => {
    const [tables, setTables] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [qrTable, setQrTable] = useState(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [editingTable, setEditingTable] = useState(null);
    const [tableNumber, setTableNumber] = useState("");
    const [saving, setSaving] = useState(false);

    const fetchTables = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await api.get("/admin/tables");

            setTables(response.data.data);
        } catch (error) {
            console.error(error);
            setError("Failed to load tables.");
        } finally {
            setLoading(false);
        }
    };

    const downloadQr = () => {
        const canvas = document.getElementById("table-qr");

        if (!canvas || !qrTable) return;

        const link = document.createElement("a");

        link.download = `table-${qrTable.tableNumber}-qr.png`;
        link.href = canvas.toDataURL("image/png");

        link.click();
    };

    const printQr = () => {
        const canvas = document.getElementById("table-qr");

        if (!canvas || !qrTable) return;

        const image = canvas.toDataURL("image/png");

        const printWindow = window.open("", "_blank");

        if (!printWindow) return;

        printWindow.document.write(`
            <html>
                <head>
                    <title>Table ${qrTable.tableNumber} QR</title>

                    <style>
                        body {
                            margin: 0;
                            display: flex;
                            justify-content: center;
                            align-items: center;
                            min-height: 100vh;
                            font-family: Arial, sans-serif;
                        }

                        .container {
                            text-align: center;
                        }

                        img {
                            width: 300px;
                            height: 300px;
                        }

                        h1 {
                            margin-bottom: 20px;
                        }
                    </style>
                </head>

                <body>
                    <div class="container">
                        <h1>Table ${qrTable.tableNumber}</h1>
                        <img src="${image}" />
                        <p>Scan to view the menu</p>
                    </div>

                    <script>
                        window.onload = function () {
                            window.print();
                        };
                    </script>
                </body>
            </html>
        `);

        printWindow.document.close();
    };

    useEffect(() => {
        fetchTables();
    }, []);

    const getTableUrl = (table) => {
        return `${window.location.origin}/menu?table=${table.qrToken}`;
    };

    const openQr = (table) => {
        setQrTable(table);
    };

    const openAddModal = () => {
        setEditingTable(null);
        setTableNumber("");
        setModalOpen(true);
    };

    const openEditModal = (table) => {
        setEditingTable(table);
        setTableNumber(table.tableNumber);
        setModalOpen(true);
    };

    const closeModal = () => {
        if (saving) return;

        setModalOpen(false);
        setEditingTable(null);
        setTableNumber("");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!tableNumber.trim()) {
            setError("Table number is required.");
            return;
        }

        try {
            setSaving(true);
            setError("");

            if (editingTable) {
                await api.put(
                    `/admin/tables/${editingTable._id}`,
                    {
                        tableNumber: tableNumber.trim()
                    }
                );
            } else {
                await api.post("/admin/tables", {
                    tableNumber: tableNumber.trim()
                });
            }

            await fetchTables();
            closeModal();
        } catch (error) {
            console.error(error);

            setError(
                error.response?.data?.message ||
                "Failed to save table."
            );
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (id) => {
        const confirmed = window.confirm(
            "Are you sure you want to delete this table?"
        );

        if (!confirmed) return;

        try {
            setError("");

            await api.delete(`/admin/tables/${id}`);

            setTables((prev) =>
                prev.filter((table) => table._id !== id)
            );
        } catch (error) {
            console.error(error);

            setError(
                error.response?.data?.message ||
                "Failed to delete table."
            );
        }
    };

    const toggleStatus = async (id) => {
        try {
            setError("");

            const response = await api.patch(
                `/admin/tables/${id}/status`
            );

            setTables((prev) =>
                prev.map((table) =>
                    table._id === id
                        ? response.data.data
                        : table
                )
            );
        } catch (error) {
            console.error(error);

            setError(
                error.response?.data?.message ||
                "Failed to update table status."
            );
        }
    };

    return (
        <div className="space-y-6">

            {/* Header */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">
                        Tables
                    </h1>

                    <p className="mt-1 text-sm text-gray-500">
                        Manage tables and prepare them for QR ordering.
                    </p>
                </div>

                <button
                    onClick={openAddModal}
                    className="rounded-xl bg-gray-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-gray-800"
                >
                    + Add Table
                </button>
            </div>

            {/* Error */}
            {error && (
                <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                    {error}
                </div>
            )}

            {/* Stats */}
            {!loading && (
                <div className="grid gap-4 sm:grid-cols-3">

                    <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
                        <p className="text-sm text-gray-500">
                            Total Tables
                        </p>

                        <p className="mt-2 text-3xl font-bold text-gray-900">
                            {tables.length}
                        </p>
                    </div>

                    <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
                        <p className="text-sm text-gray-500">
                            Active
                        </p>

                        <p className="mt-2 text-3xl font-bold text-green-600">
                            {
                                tables.filter(
                                    (table) => table.isActive
                                ).length
                            }
                        </p>
                    </div>

                    <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
                        <p className="text-sm text-gray-500">
                            Inactive
                        </p>

                        <p className="mt-2 text-3xl font-bold text-gray-400">
                            {
                                tables.filter(
                                    (table) => !table.isActive
                                ).length
                            }
                        </p>
                    </div>

                </div>
            )}

            {/* Tables */}
            {loading ? (
                <div className="rounded-2xl border border-gray-200 bg-white py-20 text-center text-gray-500">
                    Loading tables...
                </div>
            ) : tables.length === 0 ? (
                <div className="rounded-2xl border border-gray-200 bg-white py-20 text-center">
                    <h2 className="text-lg font-semibold text-gray-900">
                        No tables yet
                    </h2>

                    <p className="mt-2 text-sm text-gray-500">
                        Add your first table to get started.
                    </p>
                </div>
            ) : (
                <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">

                    {tables.map((table) => (
                        <div
                            key={table._id}
                            className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
                        >

                            {/* Table Header */}
                            <div className="flex items-start justify-between">

                                <div>
                                    <p className="text-sm text-gray-500">
                                        Table
                                    </p>

                                    <h2 className="mt-1 text-2xl font-bold text-gray-900">
                                        {table.tableNumber}
                                    </h2>
                                </div>

                                <span
                                    className={`rounded-full px-3 py-1 text-xs font-semibold ${
                                        table.isActive
                                            ? "bg-green-100 text-green-700"
                                            : "bg-gray-100 text-gray-500"
                                    }`}
                                >
                                    {table.isActive
                                        ? "Active"
                                        : "Inactive"}
                                </span>

                            </div>

                            {/* QR Token */}
                            <div className="mt-5 rounded-xl bg-gray-50 p-3">
                                <p className="text-xs font-medium text-gray-400">
                                    QR Token
                                </p>

                                <p className="mt-1 truncate text-xs text-gray-600">
                                    {table.qrToken}
                                </p>
                            </div>

                            {/* Actions */}
                            <div className="mt-5 grid grid-cols-2 gap-2">

                                <button
                                    onClick={() =>
                                        openEditModal(table)
                                    }
                                    className="rounded-xl border border-gray-200 px-3 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
                                >
                                    Edit
                                </button>

                                <button
                                    onClick={() =>
                                        toggleStatus(table._id)
                                    }
                                    className={`rounded-xl px-3 py-2.5 text-sm font-semibold ${
                                        table.isActive
                                            ? "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                            : "bg-green-600 text-white hover:bg-green-700"
                                    }`}
                                >
                                    {table.isActive
                                        ? "Disable"
                                        : "Enable"}
                                </button>

                                <button
                                    onClick={() =>
                                        handleDelete(table._id)
                                    }
                                    className="col-span-2 rounded-xl border border-red-200 px-3 py-2.5 text-sm font-semibold text-red-600 transition hover:bg-red-50"
                                >
                                    Delete Table
                                </button>

                            </div>
                            <button
                                onClick={() => openQr(table)}
                                className="mt-4 w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
                            >
                                View QR Code
                            </button>
                        </div>
                    ))}

                </div>
            )}

            {qrTable && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                    <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">

                        <div className="flex items-start justify-between">
                            <div>
                                <h2 className="text-xl font-bold text-gray-900">
                                    Table {qrTable.tableNumber}
                                </h2>

                                <p className="mt-1 text-sm text-gray-500">
                                    Scan this QR code to open the menu for this table.
                                </p>
                            </div>

                            <button
                                onClick={() => setQrTable(null)}
                                className="rounded-lg px-3 py-2 text-gray-500 hover:bg-gray-100"
                            >
                                ✕
                            </button>
                        </div>

                        <div className="mt-6 flex justify-center rounded-2xl bg-gray-50 p-8">
                            <QRCodeCanvas
                                id="table-qr"
                                value={getTableUrl(qrTable)}
                                size={240}
                                level="H"
                                includeMargin
                            />
                        </div>

                        <div className="mt-5 grid grid-cols-3 gap-3">

                            <button
                                onClick={downloadQr}
                                className="rounded-xl border border-gray-200 px-4 py-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
                            >
                                Download QR
                            </button>
                            <button
                                onClick={printQr}
                                className="rounded-xl border border-gray-200 px-3 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50"
                            >
                                Print
                            </button>
                            <button
                                onClick={() => setQrTable(null)}
                                className="rounded-xl bg-gray-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-gray-800"
                            >
                                Done
                            </button>

                        </div>

                    </div>
                </div>
            )}

            {/* Add/Edit Modal */}
            {modalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">

                    <div className="w-full max-w-md rounded-2xl bg-white shadow-2xl">

                        <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">

                            <div>
                                <h2 className="text-lg font-bold text-gray-900">
                                    {editingTable
                                        ? "Edit Table"
                                        : "Add Table"}
                                </h2>

                                <p className="mt-1 text-sm text-gray-500">
                                    {editingTable
                                        ? "Update table details."
                                        : "Create a new table."}
                                </p>
                            </div>

                            <button
                                onClick={closeModal}
                                className="rounded-lg px-3 py-2 text-gray-500 hover:bg-gray-100"
                            >
                                ✕
                            </button>

                        </div>

                        <form
                            onSubmit={handleSubmit}
                            className="space-y-5 p-6"
                        >

                            <div>
                                <label className="mb-2 block text-sm font-medium text-gray-700">
                                    Table Number
                                </label>

                                <input
                                    type="text"
                                    value={tableNumber}
                                    onChange={(e) =>
                                        setTableNumber(e.target.value)
                                    }
                                    placeholder="e.g. 1, 2, A1, VIP-1"
                                    autoFocus
                                    required
                                    className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none transition focus:border-gray-400"
                                />
                            </div>

                            <div className="flex justify-end gap-3 border-t border-gray-100 pt-5">

                                <button
                                    type="button"
                                    onClick={closeModal}
                                    disabled={saving}
                                    className="rounded-xl border border-gray-200 px-5 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50"
                                >
                                    Cancel
                                </button>

                                <button
                                    type="submit"
                                    disabled={saving}
                                    className="rounded-xl bg-gray-900 px-5 py-3 text-sm font-semibold text-white hover:bg-gray-800 disabled:opacity-50"
                                >
                                    {saving
                                        ? "Saving..."
                                        : editingTable
                                            ? "Update Table"
                                            : "Create Table"}
                                </button>

                            </div>

                        </form>

                    </div>
                </div>
            )}

        </div>
    );
};

export default AdminTablesPage;