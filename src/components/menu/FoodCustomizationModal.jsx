import { Minus, Plus, X } from "lucide-react";
import { useEffect, useState } from "react";

const FoodCustomizationModal = ({
    item,
    isOpen,
    onClose,
    onAddToCart
}) => {
    const [quantity, setQuantity] = useState(1);
    const [selectedAddons, setSelectedAddons] = useState([]);
    const [note, setNote] = useState("");

    useEffect(() => {
        if (isOpen) {
            setQuantity(1);
            setSelectedAddons([]);
            setNote("");
        }
    }, [isOpen, item]);

    if (!isOpen || !item) {
        return null;
    }

    const toggleAddon = (addon) => {
        setSelectedAddons((current) => {
            const exists = current.some(
                (selected) => selected.name === addon.name
            );

            if (exists) {
                return current.filter(
                    (selected) => selected.name !== addon.name
                );
            }

            return [...current, addon];
        });
    };

    const addonsTotal = selectedAddons.reduce(
        (total, addon) => total + addon.price,
        0
    );

    const total =
        (item.price + addonsTotal) * quantity;

    const handleAddToCart = () => {
        onAddToCart({
            ...item,
            quantity,
            addons: selectedAddons,
            note
        });

        onClose();
    };

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <div
                className="absolute inset-0 bg-black/50"
                onClick={onClose}
            />

            <div className="relative max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white shadow-2xl">
                
                {/* Header */}
                <div className="sticky top-0 z-10 flex items-center justify-between border-b bg-white p-4">
                    <h2 className="text-lg font-bold">
                        Customize Your Order
                    </h2>

                    <button
                        onClick={onClose}
                        className="rounded-full p-2 hover:bg-gray-100"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Food */}
                <div className="p-5">
                    <div className="flex gap-4">
                        <div className="h-24 w-24 shrink-0 overflow-hidden rounded-xl bg-gray-100">
                            {item.image ? (
                                <img
                                    src={item.image}
                                    alt={item.name}
                                    className="h-full w-full object-cover"
                                />
                            ) : (
                                <div className="flex h-full items-center justify-center text-xs text-gray-400">
                                    No Image
                                </div>
                            )}
                        </div>

                        <div>
                            <h3 className="text-xl font-bold">
                                {item.name}
                            </h3>

                            <p className="mt-1 text-sm text-gray-500">
                                {item.description}
                            </p>

                            <p className="mt-2 font-semibold">
                                ₹{item.price}
                            </p>
                        </div>
                    </div>

                    {/* Addons */}
                    {item.addons?.length > 0 && (
                        <div className="mt-6">
                            <h3 className="mb-3 font-semibold">
                                Add-ons
                            </h3>

                            <div className="space-y-2">
                                {item.addons.map((addon) => {
                                    const selected =
                                        selectedAddons.some(
                                            (item) =>
                                                item.name === addon.name
                                        );

                                    return (
                                        <label
                                            key={addon.name}
                                            className={`flex cursor-pointer items-center justify-between rounded-xl border p-3 transition ${
                                                selected
                                                    ? "border-black bg-gray-50"
                                                    : ""
                                            }`}
                                        >
                                            <div className="flex items-center gap-3">
                                                <input
                                                    type="checkbox"
                                                    checked={selected}
                                                    onChange={() =>
                                                        toggleAddon(addon)
                                                    }
                                                />

                                                <span>
                                                    {addon.name}
                                                </span>
                                            </div>

                                            <span className="font-medium">
                                                +₹{addon.price}
                                            </span>
                                        </label>
                                    );
                                })}
                            </div>
                        </div>
                    )}

                    {/* Quantity */}
                    <div className="mt-6">
                        <h3 className="mb-3 font-semibold">
                            Quantity
                        </h3>

                        <div className="flex w-fit items-center gap-5 rounded-xl border">
                            <button
                                onClick={() =>
                                    setQuantity(
                                        Math.max(1, quantity - 1)
                                    )
                                }
                                className="p-3"
                            >
                                <Minus size={17} />
                            </button>

                            <span className="font-semibold">
                                {quantity}
                            </span>

                            <button
                                onClick={() =>
                                    setQuantity(quantity + 1)
                                }
                                className="p-3"
                            >
                                <Plus size={17} />
                            </button>
                        </div>
                    </div>

                    {/* Note */}
                    <div className="mt-6">
                        <h3 className="mb-3 font-semibold">
                            Special Note
                        </h3>

                        <textarea
                            value={note}
                            onChange={(e) =>
                                setNote(e.target.value)
                            }
                            placeholder="e.g. Less spicy, no onions..."
                            rows={3}
                            className="w-full resize-none rounded-xl border p-3 outline-none focus:ring-2"
                        />
                    </div>
                </div>

                {/* Footer */}
                <div className="sticky bottom-0 border-t bg-white p-4">
                    <button
                        onClick={handleAddToCart}
                        className="flex w-full items-center justify-between rounded-xl bg-black px-5 py-3 font-semibold text-white"
                    >
                        <span>Add to Cart</span>

                        <span>
                            ₹{total}
                        </span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default FoodCustomizationModal;