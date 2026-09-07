import { Plus } from "lucide-react";

import { useCart } from "../../context/CartContext";

const FoodCard = ({ item }) => {
    const { addToCart } = useCart();

    return (
        <div className="overflow-hidden rounded-2xl border bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-md">
            <div className="aspect-4/3 bg-gray-100">
                {item.image ? (
                    <img
                        src={item.image}
                        alt={item.name}
                        className="h-full w-full object-cover"
                    />
                ) : (
                    <div className="flex h-full items-center justify-center text-gray-400">
                        No Image
                    </div>
                )}
            </div>

            <div className="p-4">
                <div className="mb-2 flex items-start justify-between gap-2">
                    <h3 className="font-semibold">
                        {item.name}
                    </h3>

                    <span
                        className={`mt-1 h-3 w-3 rounded-full border-2 ${
                            item.foodType === "veg"
                                ? "border-green-600"
                                : "border-red-600"
                        }`}
                    />
                </div>

                <p className="mb-3 line-clamp-2 text-sm text-gray-500">
                    {item.description || "Delicious food prepared fresh."}
                </p>

                <div className="flex items-center justify-between">
                    <span className="text-lg font-bold">
                        ₹{item.price}
                    </span>

                    <button
                        onClick={() => addToCart(item)}
                        className="flex items-center gap-1 rounded-xl bg-black px-4 py-2 text-sm font-medium text-white transition hover:scale-105"
                    >
                        <Plus size={16} />
                        Add
                    </button>
                </div>
            </div>
        </div>
    );
};

export default FoodCard;