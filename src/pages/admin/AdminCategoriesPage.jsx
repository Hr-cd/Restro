import { useEffect, useState } from "react";
import { Pencil, Plus, Trash2, X } from "lucide-react";
import api from "../../services/api";

const AdminCategoriesPage = () => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");
    const [name, setName] = useState("");
    const [editingId, setEditingId] = useState(null);

    const fetchCategories = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await api.get("/categories");

            setCategories(response.data.data);
        } catch (error) {
            console.error("Failed to fetch categories:", error);

            setError(
                error.response?.data?.message ||
                "Failed to load categories"
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    const resetForm = () => {
        setName("");
        setEditingId(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!name.trim()) {
            setError("Category name is required");
            return;
        }

        try {
            setSaving(true);
            setError("");

            if (editingId) {
                const response = await api.put(
                    `/categories/${editingId}`,
                    {
                        name: name.trim()
                    }
                );

                setCategories((prev) =>
                    prev.map((category) =>
                        category._id === editingId
                            ? response.data.data
                            : category
                    )
                );
            } else {
                const response = await api.post(
                    "/categories",
                    {
                        name: name.trim()
                    }
                );

                setCategories((prev) => [
                    ...prev,
                    response.data.data
                ]);
            }

            resetForm();
        } catch (error) {
            console.error("Category save error:", error);

            setError(
                error.response?.data?.message ||
                "Failed to save category"
            );
        } finally {
            setSaving(false);
        }
    };

    const handleEdit = (category) => {
        setEditingId(category._id);
        setName(category.name);
        setError("");
    };

    const handleDelete = async (id) => {
        const confirmed = window.confirm(
            "Are you sure you want to delete this category?"
        );

        if (!confirmed) return;

        try {
            setError("");

            await api.delete(`/categories/${id}`);

            setCategories((prev) =>
                prev.filter((category) => category._id !== id)
            );

            if (editingId === id) {
                resetForm();
            }
        } catch (error) {
            console.error("Category delete error:", error);

            setError(
                error.response?.data?.message ||
                "Failed to delete category"
            );
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold">
                    Categories
                </h1>

                <p className="mt-1 text-sm text-gray-500">
                    Manage your food menu categories.
                </p>
            </div>

            {/* Form */}
            <div className="rounded-2xl border bg-white p-5 shadow-sm">
                <div className="mb-4 flex items-center justify-between">
                    <h2 className="font-semibold">
                        {editingId
                            ? "Edit Category"
                            : "Add Category"}
                    </h2>

                    {editingId && (
                        <button
                            type="button"
                            onClick={resetForm}
                            className="rounded-lg p-2 text-gray-500 hover:bg-gray-100"
                        >
                            <X size={18} />
                        </button>
                    )}
                </div>

                <form
                    onSubmit={handleSubmit}
                    className="flex flex-col gap-3 sm:flex-row"
                >
                    <input
                        type="text"
                        value={name}
                        onChange={(e) =>
                            setName(e.target.value)
                        }
                        placeholder="e.g. Starters"
                        className="flex-1 rounded-xl border px-4 py-3 outline-none transition focus:border-black"
                    />

                    <button
                        type="submit"
                        disabled={saving}
                        className="flex items-center justify-center gap-2 rounded-xl bg-black px-5 py-3 font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        {editingId ? (
                            <>
                                <Pencil size={17} />
                                {saving
                                    ? "Updating..."
                                    : "Update"}
                            </>
                        ) : (
                            <>
                                <Plus size={18} />
                                {saving
                                    ? "Adding..."
                                    : "Add Category"}
                            </>
                        )}
                    </button>
                </form>

                {error && (
                    <p className="mt-3 text-sm font-medium text-red-600">
                        {error}
                    </p>
                )}
            </div>

            {/* Categories */}
            <div className="rounded-2xl border bg-white shadow-sm">
                <div className="border-b px-5 py-4">
                    <h2 className="font-semibold">
                        All Categories
                    </h2>

                    <p className="mt-1 text-sm text-gray-500">
                        {categories.length}{" "}
                        {categories.length === 1
                            ? "category"
                            : "categories"}
                    </p>
                </div>

                {loading ? (
                    <div className="p-8 text-center text-sm text-gray-500">
                        Loading categories...
                    </div>
                ) : categories.length === 0 ? (
                    <div className="p-10 text-center">
                        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-gray-100">
                            <Plus size={24} />
                        </div>

                        <h3 className="mt-4 font-semibold">
                            No categories yet
                        </h3>

                        <p className="mt-1 text-sm text-gray-500">
                            Add your first category above.
                        </p>
                    </div>
                ) : (
                    <div className="divide-y">
                        {categories.map((category, index) => (
                            <div
                                key={category._id}
                                className="flex items-center justify-between px-5 py-4 transition hover:bg-gray-50"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gray-100 text-sm font-semibold">
                                        {index + 1}
                                    </div>

                                    <p className="font-medium">
                                        {category.name}
                                    </p>
                                </div>

                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() =>
                                            handleEdit(category)
                                        }
                                        className="rounded-lg p-2 text-gray-500 transition hover:bg-gray-100 hover:text-black"
                                        title="Edit category"
                                    >
                                        <Pencil size={17} />
                                    </button>

                                    <button
                                        onClick={() =>
                                            handleDelete(
                                                category._id
                                            )
                                        }
                                        className="rounded-lg p-2 text-gray-500 transition hover:bg-red-50 hover:text-red-600"
                                        title="Delete category"
                                    >
                                        <Trash2 size={17} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminCategoriesPage;