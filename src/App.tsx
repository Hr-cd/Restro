import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
// CartContext is currently implemented in JSX and has no TypeScript declaration file.
// @ts-expect-error The JSX module is valid at runtime but is not typed yet.
import { CartProvider } from "./context/CartContext";
// MenuPage is currently implemented in JSX and has no TypeScript declaration file.
// @ts-expect-error The JSX module is valid at runtime but is not typed yet.
import MenuPage from "./pages/MenuPage";
// CheckoutPage is currently implemented in JSX and has no TypeScript declaration file.
// @ts-expect-error The JSX module is valid at runtime but is not typed yet.
import CheckoutPage from "./pages/CheckoutPage";

const App = () => {
    return (
        <CartProvider>
            <BrowserRouter>
                <Routes>
                    <Route path="/menu" element={<MenuPage />} />
                    <Route
                        path="/checkout"
                        element={<CheckoutPage />}
                    />
                    <Route
                        path="*"
                        element={<Navigate to="/menu" replace />}
                    />
                </Routes>
            </BrowserRouter>
        </CartProvider>
    );
};

export default App;