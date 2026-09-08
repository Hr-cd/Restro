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
// OrderSuccessPage is currently implemented in JSX and has no TypeScript declaration file.
// @ts-expect-error The JSX module is valid at runtime but is not typed yet.
import OrderSuccessPage from "./pages/OrderSuccessPage";
// AdminLoginPage is currently implemented in JSX and has no TypeScript declaration file.
// @ts-expect-error The JSX module is valid at runtime but is not typed yet.
import AdminLoginPage from "./pages/AdminLoginPage";
// AdminDashboardPage is currently implemented in JSX and has no TypeScript declaration file.
// @ts-expect-error The JSX module is valid at runtime but is not typed yet.
import AdminDashboardPage from "./pages/admin/AdminDashboardPage";
// AdminLayout is currently implemented in JSX and has no TypeScript declaration file.
// @ts-expect-error The JSX module is valid at runtime but is not typed yet.
import AdminLayout from "./layouts/AdminLayout";
// ProtectedRoute is currently implemented in JSX and has no TypeScript declaration file.
// @ts-expect-error The JSX module is valid at runtime but is not typed yet.
import ProtectedRoute from "./components/ProtectedRoute";
// AdminOrdersPage is currently implemented in JSX and has no TypeScript declaration file.
// @ts-expect-error The JSX module is valid at runtime but is not typed yet.
import AdminOrdersPage from "./pages/admin/AdminOrdersPage";
// AdminOrderDetailsPage is currently implemented in JSX and has no TypeScript declaration file.
// @ts-expect-error The JSX module is valid at runtime but is not typed yet.
import AdminOrderDetailsPage from "./pages/admin/AdminOrderDetailsPage";

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
                        path="/order-success"
                        element={<OrderSuccessPage />}
                    />
                    <Route
                        path="/admin/login"
                        element={<AdminLoginPage />}
                    />


                    {/* Protected Admin */}
                    <Route element={<ProtectedRoute />}>

                        <Route
                            path="/admin"
                            element={<AdminLayout />}
                        >

                            <Route
                                index
                                element={<AdminDashboardPage />}
                            />

                            <Route
                                path="orders"
                                element={<AdminOrdersPage />}
                            />

                            <Route
                                path="orders/:id"
                                element={<AdminOrderDetailsPage />}
                            />

                        </Route>

                    </Route>
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