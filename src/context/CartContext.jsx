import { createContext, useContext, useState } from "react";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState([]);

    const addToCart = (item) => {
        setCartItems((currentItems) => {
            const existingItem = currentItems.find(
                (cartItem) => cartItem._id === item._id
            );

            if (existingItem) {
                return currentItems.map((cartItem) =>
                    cartItem._id === item._id
                        ? {
                              ...cartItem,
                              quantity: cartItem.quantity + 1
                          }
                        : cartItem
                );
            }

            return [
                ...currentItems,
                {
                    ...item,
                    quantity: 1,
                    note: "",
                    addons: []
                }
            ];
        });
    };

    const increaseQuantity = (id) => {
        setCartItems((currentItems) =>
            currentItems.map((item) =>
                item._id === id
                    ? {
                          ...item,
                          quantity: item.quantity + 1
                      }
                    : item
            )
        );
    };

    const decreaseQuantity = (id) => {
        setCartItems((currentItems) =>
            currentItems
                .map((item) =>
                    item._id === id
                        ? {
                              ...item,
                              quantity: item.quantity - 1
                          }
                        : item
                )
                .filter((item) => item.quantity > 0)
        );
    };

    const removeFromCart = (id) => {
        setCartItems((currentItems) =>
            currentItems.filter((item) => item._id !== id)
        );
    };

    const clearCart = () => {
        setCartItems([]);
    };

    const cartCount = cartItems.reduce(
        (total, item) => total + item.quantity,
        0
    );

    const subtotal = cartItems.reduce(
        (total, item) => total + item.price * item.quantity,
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