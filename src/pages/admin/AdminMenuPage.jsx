import { useEffect, useState } from "react";
import api from "../../services/api";

const emptyForm = {
    categoryId: "",
    name: "",
    description: "",
    price: "",
    image: "",
    foodType: "veg",
    addons: []
};

const AdminMenuPage = () => {
    const [foodItems, setFoodItems] = useState([]);
    const [categories, setCategories] = useState([]);

    const [search, setSearch] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("");

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [modalOpen, setModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState(null);

    const [form, setForm] = useState(emptyForm);
    const [saving, setSaving] = useState(false);

    const [addonName, setAddonName] = useState("");
    const [addonPrice, setAddonPrice] = useState("");

    const fetchFoodItems = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await api.get("/admin/food-items");

            setFoodItems(response.data.data);
        } catch (error) {
            console.error(error);
            setError("Failed to load food items.");
        } finally {
            setLoading(false);
        }
    };

    const fetchCategories = async () => {
        try {
            const response = await api.get("/categories");
            setCategories(response.data.data);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        fetchFoodItems();
        fetchCategories();
    }, []);

    const openAddModal = () => {
        setEditingItem(null);
        setForm(emptyForm);
        setAddonName("");
        setAddonPrice("");
        setModalOpen(true);
    };

    const openEditModal = (item) => {
        setEditingItem(item);

        setForm({
            categoryId: item.categoryId?._id || "",
            name: item.name || "",
            description: item.description || "",
            price: item.price ?? "",
            image: item.image || "",
            foodType: item.foodType || "veg",
            addons: item.addons || []
        });

        setAddonName("");
        setAddonPrice("");
        setModalOpen(true);
    };

    const closeModal = () => {
        if (saving) return;

        setModalOpen(false);
        setEditingItem(null);
        setForm(emptyForm);
        setAddonName("");
        setAddonPrice("");
    };

    const handleChange = (e) => {
        const { name, value } = e.target;

        setForm((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    const addAddon = () => {
        if (!addonName.trim() || addonPrice === "") return;

        setForm((prev) => ({
            ...prev,
            addons: [
                ...prev.addons,
                {
                    name: addonName.trim(),
                    price: Number(addonPrice)
                }
            ]
        }));

        setAddonName("");
        setAddonPrice("");
    };

    const removeAddon = (index) => {
        setForm((prev) => ({
            ...prev,
            addons: prev.addons.filter((_, i) => i !== index)
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!form.categoryId || !form.name.trim() || form.price === "") {
            setError("Category, name and price are required.");
            return;
        }

        try {
            setSaving(true);
            setError("");

            const payload = {
                categoryId: form.categoryId,
                name: form.name.trim(),
                description: form.description.trim(),
                price: Number(form.price),
                image: form.image.trim(),
                foodType: form.foodType,
                addons: form.addons
            };

            if (editingItem) {
                await api.put(
                    `/admin/food-items/${editingItem._id}`,
                    payload
                );
            } else {
                await api.post("/admin/food-items", payload);
            }

            await fetchFoodItems();
            closeModal();
        } catch (error) {
            console.error(error);

            setError(
                error.response?.data?.message ||
                "Failed to save food item."
            );
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (id) => {
        const confirmed = window.confirm(
            "Are you sure you want to delete this food item?"
        );

        if (!confirmed) return;

        try {
            setError("");

            await api.delete(`/admin/food-items/${id}`);

            setFoodItems((prev) =>
                prev.filter((item) => item._id !== id)
            );
        } catch (error) {
            console.error(error);
            setError(
                error.response?.data?.message ||
                "Failed to delete food item."
            );
        }
    };

    const toggleAvailability = async (id) => {
        try {
            setError("");

            const response = await api.patch(
                `/admin/food-items/${id}/availability`
            );

            setFoodItems((prev) =>
                prev.map((item) =>
                    item._id === id
                        ? response.data.data
                        : item
                )
            );
        } catch (error) {
            console.error(error);
            setError("Failed to update availability.");
        }
    };

    const filteredItems = foodItems.filter((item) => {
        const matchesSearch =
            item.name
                ?.toLowerCase()
                .includes(search.toLowerCase());

        const matchesCategory =
            !selectedCategory ||
            item.categoryId?._id === selectedCategory;

        return matchesSearch && matchesCategory;
    });

    return (
        <div className="space-y-6">

            {/* Header */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">
                        Menu
                    </h1>

                    <p className="mt-1 text-sm text-gray-500">
                        Manage your food items and menu availability.
                    </p>
                </div>

                <button
                    onClick={openAddModal}
                    className="rounded-xl bg-gray-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-gray-800"
                >
                    + Add Food Item
                </button>
            </div>

            {/* Error */}
            {error && (
                <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                    {error}
                </div>
            )}

            {/* Filters */}
            <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
                <div className="grid gap-4 md:grid-cols-2">

                    <div>
                        <label className="mb-2 block text-sm font-medium text-gray-700">
                            Search
                        </label>

                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search food items..."
                            className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none transition focus:border-gray-400"
                        />
                    </div>

                    <div>
                        <label className="mb-2 block text-sm font-medium text-gray-700">
                            Category
                        </label>

                        <select
                            value={selectedCategory}
                            onChange={(e) =>
                                setSelectedCategory(e.target.value)
                            }
                            className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-gray-400"
                        >
                            <option value="">
                                All Categories
                            </option>

                            {categories.map((category) => (
                                <option
                                    key={category._id}
                                    value={category._id}
                                >
                                    {category.name}
                                </option>
                            ))}
                        </select>
                    </div>

                </div>
            </div>

            {/* Content */}
            {loading ? (
                <div className="rounded-2xl border border-gray-200 bg-white py-20 text-center text-gray-500">
                    Loading menu...
                </div>
            ) : filteredItems.length === 0 ? (
                <div className="rounded-2xl border border-gray-200 bg-white py-20 text-center">
                    <h2 className="text-lg font-semibold text-gray-900">
                        No food items found
                    </h2>

                    <p className="mt-2 text-sm text-gray-500">
                        Add your first food item or change your filters.
                    </p>
                </div>
            ) : (
                <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                    {filteredItems.map((item) => (
                        <div
                            key={item._id}
                            className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
                        >
                            {/* Image */}
                            <div className="relative h-48 bg-gray-100">
                                {item.image ? (
                                    <img
                                        src={item.image}
                                        alt={item.name}
                                        className="h-full w-full object-cover"
                                    />
                                ) : (
                                    <div className="flex h-full items-center justify-center text-sm text-gray-400">
                                        No image
                                    </div>
                                )}

                                <div className="absolute left-3 top-3">
                                    <span
                                        className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ${
                                            item.foodType === "veg"
                                                ? "bg-green-100 text-green-700"
                                                : "bg-red-100 text-red-700"
                                        }`}
                                    >
                                        {item.foodType === "veg"
                                            ? "VEG"
                                            : "NON-VEG"}
                                    </span>
                                </div>

                                <div className="absolute right-3 top-3">
                                    <button
                                        onClick={() =>
                                            toggleAvailability(item._id)
                                        }
                                        className={`rounded-full px-3 py-1 text-xs font-semibold shadow-sm ${
                                            item.isAvailable
                                                ? "bg-white text-green-700"
                                                : "bg-gray-900 text-white"
                                        }`}
                                    >
                                        {item.isAvailable
                                            ? "Available"
                                            : "Unavailable"}
                                    </button>
                                </div>
                            </div>

                            {/* Details */}
                            <div className="p-5">

                                <div className="flex items-start justify-between gap-3">
                                    <div>
                                        <h3 className="font-semibold text-gray-900">
                                            {item.name}
                                        </h3>

                                        <p className="mt-1 text-xs font-medium text-gray-500">
                                            {item.categoryId?.name ||
                                                "Uncategorized"}
                                        </p>
                                    </div>

                                    <span className="text-lg font-bold text-gray-900">
                                        ₹{Number(item.price).toFixed(2)}
                                    </span>
                                </div>

                                {item.description && (
                                    <p className="mt-3 line-clamp-2 text-sm text-gray-500">
                                        {item.description}
                                    </p>
                                )}

                                {item.addons?.length > 0 && (
                                    <div className="mt-4">
                                        <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                                            Add-ons
                                        </p>

                                        <div className="mt-2 flex flex-wrap gap-2">
                                            {item.addons.map(
                                                (addon, index) => (
                                                    <span
                                                        key={index}
                                                        className="rounded-lg bg-gray-100 px-2.5 py-1 text-xs text-gray-600"
                                                    >
                                                        {addon.name} +₹
                                                        {Number(
                                                            addon.price
                                                        ).toFixed(2)}
                                                    </span>
                                                )
                                            )}
                                        </div>
                                    </div>
                                )}

                                {/* Actions */}
                                <div className="mt-5 flex gap-2">
                                    <button
                                        onClick={() =>
                                            openEditModal(item)
                                        }
                                        className="flex-1 rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
                                    >
                                        Edit
                                    </button>

                                    <button
                                        onClick={() =>
                                            handleDelete(item._id)
                                        }
                                        className="flex-1 rounded-xl border border-red-200 px-4 py-2.5 text-sm font-semibold text-red-600 transition hover:bg-red-50"
                                    >
                                        Delete
                                    </button>
                                </div>

                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Modal */}
            {modalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">

                    <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-2xl">

                        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-gray-100 bg-white px-6 py-4">
                            <div>
                                <h2 className="text-lg font-bold text-gray-900">
                                    {editingItem
                                        ? "Edit Food Item"
                                        : "Add Food Item"}
                                </h2>

                                <p className="text-sm text-gray-500">
                                    {editingItem
                                        ? "Update menu item details."
                                        : "Add a new item to your menu."}
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

                            {/* Category */}
                            <div>
                                <label className="mb-2 block text-sm font-medium text-gray-700">
                                    Category
                                </label>

                                <select
                                    name="categoryId"
                                    value={form.categoryId}
                                    onChange={handleChange}
                                    required
                                    className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none focus:border-gray-400"
                                >
                                    <option value="">
                                        Select category
                                    </option>

                                    {categories.map((category) => (
                                        <option
                                            key={category._id}
                                            value={category._id}
                                        >
                                            {category.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Name */}
                            <div>
                                <label className="mb-2 block text-sm font-medium text-gray-700">
                                    Food Name
                                </label>

                                <input
                                    name="name"
                                    value={form.name}
                                    onChange={handleChange}
                                    required
                                    placeholder="e.g. Paneer Tikka"
                                    className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-gray-400"
                                />
                            </div>

                            {/* Description */}
                            <div>
                                <label className="mb-2 block text-sm font-medium text-gray-700">
                                    Description
                                </label>

                                <textarea
                                    name="description"
                                    value={form.description}
                                    onChange={handleChange}
                                    rows="3"
                                    placeholder="Short description..."
                                    className="w-full resize-none rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-gray-400"
                                />
                            </div>

                            {/* Price + Type */}
                            <div className="grid gap-4 sm:grid-cols-2">

                                <div>
                                    <label className="mb-2 block text-sm font-medium text-gray-700">
                                        Price
                                    </label>

                                    <input
                                        type="number"
                                        name="price"
                                        value={form.price}
                                        onChange={handleChange}
                                        min="0"
                                        step="0.01"
                                        required
                                        placeholder="0.00"
                                        className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-gray-400"
                                    />
                                </div>

                                <div>
                                    <label className="mb-2 block text-sm font-medium text-gray-700">
                                        Food Type
                                    </label>

                                    <select
                                        name="foodType"
                                        value={form.foodType}
                                        onChange={handleChange}
                                        className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none focus:border-gray-400"
                                    >
                                        <option value="veg">
                                            Veg
                                        </option>

                                        <option value="non-veg">
                                            Non-Veg
                                        </option>
                                    </select>
                                </div>

                            </div>

                            {/* Image */}
                            <div>
                                <label className="mb-2 block text-sm font-medium text-gray-700">
                                    Image URL
                                </label>

                                <input
                                    name="image"
                                    value={form.image}
                                    onChange={handleChange}
                                    placeholder="https://..."
                                    className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-gray-400"
                                />

                                <p className="mt-1 text-xs text-gray-400">
                                    Image upload will be added in Step 26.
                                </p>
                            </div>

                            {/* Add-ons */}
                            <div>
                                <label className="mb-2 block text-sm font-medium text-gray-700">
                                    Add-ons
                                </label>

                                <div className="flex gap-2">

                                    <input
                                        value={addonName}
                                        onChange={(e) =>
                                            setAddonName(e.target.value)
                                        }
                                        placeholder="Add-on name"
                                        className="min-w-0 flex-1 rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-gray-400"
                                    />

                                    <input
                                        type="number"
                                        min="0"
                                        step="0.01"
                                        value={addonPrice}
                                        onChange={(e) =>
                                            setAddonPrice(e.target.value)
                                        }
                                        placeholder="Price"
                                        className="w-28 rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-gray-400"
                                    />

                                    <button
                                        type="button"
                                        onClick={addAddon}
                                        className="rounded-xl bg-gray-900 px-4 text-sm font-semibold text-white"
                                    >
                                        Add
                                    </button>

                                </div>

                                {form.addons.length > 0 && (
                                    <div className="mt-3 space-y-2">
                                        {form.addons.map(
                                            (addon, index) => (
                                                <div
                                                    key={index}
                                                    className="flex items-center justify-between rounded-xl bg-gray-50 px-4 py-3"
                                                >
                                                    <span className="text-sm text-gray-700">
                                                        {addon.name}
                                                    </span>

                                                    <div className="flex items-center gap-3">
                                                        <span className="text-sm font-semibold text-gray-900">
                                                            ₹
                                                            {Number(
                                                                addon.price
                                                            ).toFixed(2)}
                                                        </span>

                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                removeAddon(
                                                                    index
                                                                )
                                                            }
                                                            className="text-sm text-red-500 hover:text-red-700"
                                                        >
                                                            Remove
                                                        </button>
                                                    </div>
                                                </div>
                                            )
                                        )}
                                    </div>
                                )}
                            </div>

                            {/* Footer */}
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
                                        : editingItem
                                            ? "Update Item"
                                            : "Create Item"}
                                </button>

                            </div>

                        </form>

                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminMenuPage;