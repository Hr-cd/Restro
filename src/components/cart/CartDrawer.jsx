import {
    Minus,
    Plus,
    Trash2,
    X
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useSearchParams } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import { useSettings } from "../../context/SettingsContext";

const CartDrawer = ({ isOpen, onClose }) => {
    const {
        cartItems,
        increaseQuantity,
        decreaseQuantity,
        removeFromCart,
        getItemUnitPrice,
        subtotal
    } = useCart();
    const [searchParams] = useSearchParams();
    const { currencySymbol } = useSettings();
    const tableToken = searchParams.get("tableToken");
    const navigate = useNavigate();
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

                {/* Header */}
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

                {/* Cart Items */}
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

                            {cartItems.map((item) => {
                                const unitPrice =
                                    getItemUnitPrice(item);

                                return (
                                    <div
                                        key={item.cartKey}
                                        className="rounded-xl border p-4"
                                    >
                                        <div className="flex gap-3">

                                            {/* Image */}
                                            <div className="h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-gray-100">
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

                                            {/* Details */}
                                            <div className="min-w-0 flex-1">

                                                <div className="flex justify-between gap-2">
                                                    <h3 className="font-semibold">
                                                        {item.name}
                                                    </h3>

                                                    <button
                                                        onClick={() =>
                                                            removeFromCart(
                                                                item.cartKey
                                                            )
                                                        }
                                                        className="shrink-0 text-gray-400 hover:text-red-500"
                                                    >
                                                        <Trash2 size={17} />
                                                    </button>
                                                </div>

                                                <p className="mt-1 text-sm text-gray-500">
                                                    {currencySymbol}{item.price}
                                                </p>

                                                {/* Add-ons */}
                                                {item.addons?.length > 0 && (
                                                    <div className="mt-2 text-xs text-gray-600">
                                                        <span className="font-medium">
                                                            Add-ons:
                                                        </span>

                                                        <div className="mt-1">
                                                            {item.addons.map(
                                                                (addon) => (
                                                                    <div
                                                                        key={
                                                                            addon.name
                                                                        }
                                                                    >
                                                                        {addon.name}{" "}
                                                                        (+{currencySymbol}{addon.price})
                                                                    </div>
                                                                )
                                                            )}
                                                        </div>
                                                    </div>
                                                )}

                                                {/* Note */}
                                                {item.note && (
                                                    <div className="mt-2 rounded-lg bg-gray-50 p-2 text-xs text-gray-600">
                                                        <span className="font-medium">
                                                            Note:
                                                        </span>{" "}
                                                        {item.note}
                                                    </div>
                                                )}

                                                {/* Quantity + Total */}
                                                <div className="mt-3 flex items-center justify-between gap-2">

                                                    <div className="flex items-center gap-3 rounded-lg border">
                                                        <button
                                                            onClick={() =>
                                                                decreaseQuantity(
                                                                    item.cartKey
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
                                                                    item.cartKey
                                                                )
                                                            }
                                                            className="p-2"
                                                        >
                                                            <Plus size={15} />
                                                        </button>
                                                    </div>

                                                    <span className="font-semibold">
                                                        {currencySymbol}{unitPrice * item.quantity}
                                                    </span>
                                                </div>

                                            </div>
                                        </div>
                                    </div>
                                );
                            })}

                        </div>
                    )}
                </div>

                {/* Footer */}
                {cartItems.length > 0 && (
                    <div className="border-t p-5">

                        <div className="mb-4 flex justify-between text-lg font-bold">
                            <span>Subtotal</span>

                            <span>
                                {currencySymbol}{subtotal}
                            </span>
                        </div>

                        <button
                            onClick={() => {
                                onClose();
                                navigate(
                                    `/checkout${
                                        tableToken
                                            ? `?tableToken=${tableToken}`
                                            : ""
                                    }`
                                );
                            }}
                            className="w-full rounded-xl bg-black py-3 font-semibold text-white transition hover:opacity-90"
                        >
                            Proceed to Checkout
                        </button>

                    </div>
                )}

            </div>
        </div>
    );
};

export default CartDrawer;