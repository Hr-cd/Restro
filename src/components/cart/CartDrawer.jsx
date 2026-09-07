import { Minus, Plus, Trash2, X } from "lucide-react";

import { useCart } from "../../context/CartContext";

const CartDrawer = ({ isOpen, onClose }) => {
    const {
        cartItems,
        increaseQuantity,
        decreaseQuantity,
        removeFromCart,
        subtotal
    } = useCart();

    if (!isOpen) {
        return null;
    }

    return (
        <div className="fixed inset-0 z-50">
            <div
                className="absolute inset-0 bg-black/40"
                onClick={onClose}
            />

            <div className="absolute right-0 top-0 flex h-full w-full max-w-md flex-col bg-white shadow-xl">
                
                <div className="flex items-center justify-between border-b p-5">
                    <div>
                        <h2 className="text-xl font-bold">
                            Your Cart
                        </h2>

                        <p className="text-sm text-gray-500">
                            {cartItems.length} item type(s)
                        </p>
                    </div>

                    <button
                        onClick={onClose}
                        className="rounded-lg p-2 hover:bg-gray-100"
                    >
                        <X size={20} />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-5">
                    {cartItems.length === 0 ? (
                        <div className="flex h-full items-center justify-center text-center">
                            <div>
                                <h3 className="text-lg font-semibold">
                                    Your cart is empty
                                </h3>

                                <p className="mt-1 text-sm text-gray-500">
                                    Add something delicious!
                                </p>
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {cartItems.map((item) => (
                                <div
                                    key={item._id}
                                    className="rounded-xl border p-4"
                                >
                                    <div className="flex gap-3">
                                        <div className="h-16 w-16 overflow-hidden rounded-lg bg-gray-100">
                                            {item.image && (
                                                <img
                                                    src={item.image}
                                                    alt={item.name}
                                                    className="h-full w-full object-cover"
                                                />
                                            )}
                                        </div>

                                        <div className="flex-1">
                                            <div className="flex justify-between gap-2">
                                                <h3 className="font-semibold">
                                                    {item.name}
                                                </h3>

                                                <button
                                                    onClick={() =>
                                                        removeFromCart(
                                                            item._id
                                                        )
                                                    }
                                                    className="text-gray-400 hover:text-red-500"
                                                >
                                                    <Trash2 size={17} />
                                                </button>
                                            </div>

                                            <p className="mt-1 text-sm text-gray-500">
                                                ₹{item.price}
                                            </p>

                                            <div className="mt-3 flex items-center justify-between">
                                                <div className="flex items-center gap-3 rounded-lg border">
                                                    <button
                                                        onClick={() =>
                                                            decreaseQuantity(
                                                                item._id
                                                            )
                                                        }
                                                        className="p-2"
                                                    >
                                                        <Minus size={15} />
                                                    </button>

                                                    <span className="text-sm font-medium">
                                                        {item.quantity}
                                                    </span>

                                                    <button
                                                        onClick={() =>
                                                            increaseQuantity(
                                                                item._id
                                                            )
                                                        }
                                                        className="p-2"
                                                    >
                                                        <Plus size={15} />
                                                    </button>
                                                </div>

                                                <span className="font-semibold">
                                                    ₹
                                                    {item.price *
                                                        item.quantity}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {cartItems.length > 0 && (
                    <div className="border-t p-5">
                        <div className="mb-4 flex justify-between text-lg font-bold">
                            <span>Subtotal</span>
                            <span>₹{subtotal}</span>
                        </div>

                        <button className="w-full rounded-xl bg-black py-3 font-semibold text-white">
                            Proceed to Checkout
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CartDrawer;