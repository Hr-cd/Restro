import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
// CartContext is currently implemented in JSX and has no TypeScript declaration file.
// @ts-expect-error The JSX module is valid at runtime but is not typed yet.
import { CartProvider } from "./context/CartContext";
// SettingsContext is currently implemented in JSX and has no TypeScript declaration file.
// @ts-expect-error The JSX module is valid at runtime but is not typed yet.
import { SettingsProvider } from "./context/SettingsContext";
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
// AdminCategoriesPage is currently implemented in JSX and has no TypeScript declaration file.
// @ts-expect-error The JSX module is valid at runtime but is not typed yet.
import AdminCategoriesPage from "./pages/admin/AdminCategoriesPage";
// AdminMenuPage is currently implemented in JSX and has no TypeScript declaration file.
// @ts-expect-error The JSX module is valid at runtime but is not typed yet.
import AdminMenuPage from "./pages/admin/AdminMenuPage";
// AdminTablesPage is currently implemented in JSX and has no TypeScript declaration file.
// @ts-expect-error The JSX module is valid at runtime but is not typed yet.
import AdminTablesPage from "./pages/AdminTablesPage";
// AdminKitchenPrintPage is currently implemented in JSX and has no TypeScript declaration file.
// @ts-expect-error The JSX module is valid at runtime but is not typed yet.
import AdminKitchenPrintPage from "./pages/admin/AdminKitchenPrintPage";
// AdminReportsPage is currently implemented in JSX and has no TypeScript declaration file.
// @ts-expect-error The JSX module is valid at runtime but is not typed yet.
import AdminReportsPage from "./pages/admin/AdminReportsPage";
// AdminSettingsPage is currently implemented in JSX and has no TypeScript declaration file.
// @ts-expect-error The JSX module is valid at runtime but is not typed yet.
import AdminSettingsPage from "./pages/admin/AdminSettingsPage";

const App = () => (
    <SettingsProvider>
        <CartProvider>
            <BrowserRouter>
                <Routes>
                    {/* CUSTOMER */}
                    <Route path="/menu" element={<MenuPage />} />
                    <Route path="/checkout" element={<CheckoutPage />} />
                    <Route
                        path="/order-success"
                        element={<OrderSuccessPage />}
                    />

                    {/* ADMIN LOGIN */}
                    <Route
                        path="/admin/login"
                        element={<AdminLoginPage />}
                    />

                    {/* PROTECTED ADMIN ROUTES */}
                    <Route element={<ProtectedRoute />}>
                        {/* ADMIN ROUTES WITH SIDEBAR */}
                        <Route path="/admin" element={<AdminLayout />}>
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

                            <Route
                                path="menu"
                                element={<AdminMenuPage />}
                            />

                            <Route
                                path="tables"
                                element={<AdminTablesPage />}
                            />

                            <Route
                                path="categories"
                                element={<AdminCategoriesPage />}
                            />

                            <Route
                                path="reports"
                                element={<AdminReportsPage />}
                            />

                            <Route
                                path="settings"
                                element={<AdminSettingsPage />}
                            />
                        </Route>

                        {/* KITCHEN PRINT — NO ADMIN SIDEBAR */}
                        <Route
                            path="/admin/orders/:id/print"
                            element={<AdminKitchenPrintPage />}
                        />
                    </Route>

                    {/* FALLBACK */}
                    <Route
                        path="*"
                        element={<Navigate to="/menu" replace />}
                    />
                </Routes>
            </BrowserRouter>
        </CartProvider>
    </SettingsProvider>
);

export default App;