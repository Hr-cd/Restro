import { createContext, useContext, useState } from "react";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState([]);

    const createCartKey = (item) => {
        const addons = [...(item.addons || [])].sort((a, b) =>
            a.name.localeCompare(b.name)
        );

        return JSON.stringify({
            foodItemId: item._id,
            addons,
            note: item.note || ""
        });
    };

    const addToCart = (item) => {
        const cartKey = createCartKey(item);

        setCartItems((currentItems) => {
            const existingItem = currentItems.find(
                (cartItem) => cartItem.cartKey === cartKey
            );

            if (existingItem) {
                return currentItems.map((cartItem) =>
                    cartItem.cartKey === cartKey
                        ? {
                              ...cartItem,
                              quantity:
                                  cartItem.quantity +
                                  item.quantity
                          }
                        : cartItem
                );
            }

            return [
                ...currentItems,
                {
                    ...item,
                    cartKey,
                    quantity: item.quantity || 1,
                    addons: item.addons || [],
                    note: item.note || ""
                }
            ];
        });
    };

    const increaseQuantity = (cartKey) => {
        setCartItems((currentItems) =>
            currentItems.map((item) =>
                item.cartKey === cartKey
                    ? {
                          ...item,
                          quantity: item.quantity + 1
                      }
                    : item
            )
        );
    };

    const decreaseQuantity = (cartKey) => {
        setCartItems((currentItems) =>
            currentItems
                .map((item) =>
                    item.cartKey === cartKey
                        ? {
                              ...item,
                              quantity: item.quantity - 1
                          }
                        : item
                )
                .filter((item) => item.quantity > 0)
        );
    };

    const removeFromCart = (cartKey) => {
        setCartItems((currentItems) =>
            currentItems.filter(
                (item) => item.cartKey !== cartKey
            )
        );
    };

    const clearCart = () => {
        setCartItems([]);
    };

    const getItemUnitPrice = (item) => {
        const addonTotal = (item.addons || []).reduce(
            (total, addon) => total + addon.price,
            0
        );

        return item.price + addonTotal;
    };

    const cartCount = cartItems.reduce(
        (total, item) => total + item.quantity,
        0
    );

    const subtotal = cartItems.reduce(
        (total, item) =>
            total +
            getItemUnitPrice(item) * item.quantity,
        0
    );

    return (
        <CartContext.Provider
            value={{
                cartItems,
                addToCart,
                increaseQuantity,
                decreaseQuantity,
                removeFromCart,
                clearCart,
                getItemUnitPrice,
                cartCount,
                subtotal
            }}
        >
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => {
    return useContext(CartContext);
};