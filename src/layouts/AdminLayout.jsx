import {
    BarChart3,
    ClipboardList,
    LayoutDashboard,
    LogOut,
    Menu,
    Settings,
    Table2,
    Tags,
    X
} from "lucide-react";

import { useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";

const AdminLayout = () => {
    const navigate = useNavigate();

    const [sidebarOpen, setSidebarOpen] = useState(false);

    const admin = JSON.parse(
        localStorage.getItem("restro_admin") || "{}"
    );

    const handleLogout = () => {
        localStorage.removeItem("restro_token");
        localStorage.removeItem("restro_admin");

        navigate("/admin/login", {
            replace: true
        });
    };

    const navigation = [
        {
            name: "Dashboard",
            path: "/admin",
            icon: LayoutDashboard
        },
        {
            name: "Orders",
            path: "/admin/orders",
            icon: ClipboardList
        },
        {
            name: "Menu",
            path: "/admin/menu",
            icon: Menu
        },
        {
            name: "Categories",
            path: "/admin/categories",
            icon: Tags
        },
        {
            name: "Tables",
            path: "/admin/tables",
            icon: Table2
        },
        {
            name: "Reports",
            path: "/admin/reports",
            icon: BarChart3
        },
        {
            name: "Settings",
            path: "/admin/settings",
            icon: Settings
        }
    ];

    return (
        <div className="min-h-screen bg-gray-50">

            {/* Mobile overlay */}
            {sidebarOpen && (
                <div
                    onClick={() => setSidebarOpen(false)}
                    className="fixed inset-0 z-40 bg-black/40 lg:hidden"
                />
            )}

            {/* Sidebar */}
            <aside
                className={`fixed inset-y-0 left-0 z-50 w-64 border-r bg-white transition-transform duration-300 lg:translate-x-0 ${
                    sidebarOpen
                        ? "translate-x-0"
                        : "-translate-x-full"
                }`}
            >

                {/* Logo */}
                <div className="flex h-16 items-center justify-between border-b px-5">

                    <div>
                        <h1 className="text-xl font-bold">
                            Restro
                        </h1>

                        <p className="text-xs text-gray-500">
                            Admin Panel
                        </p>
                    </div>

                    <button
                        onClick={() =>
                            setSidebarOpen(false)
                        }
                        className="lg:hidden"
                    >
                        <X size={22} />
                    </button>

                </div>

                {/* Navigation */}
                <nav className="space-y-1 p-4">

                    {navigation.map((item) => {
                        const Icon = item.icon;

                        return (
                            <NavLink
                                key={item.path}
                                to={item.path}
                                end={item.path === "/admin"}
                                onClick={() =>
                                    setSidebarOpen(false)
                                }
                                className={({ isActive }) =>
                                    `flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition ${
                                        isActive
                                            ? "bg-black text-white"
                                            : "text-gray-600 hover:bg-gray-100 hover:text-black"
                                    }`
                                }
                            >
                                <Icon size={19} />

                                {item.name}
                            </NavLink>
                        );
                    })}

                </nav>

                {/* Bottom */}
                <div className="absolute bottom-0 w-full border-t p-4">

                    <div className="mb-3 px-2">

                        <p className="truncate text-sm font-semibold">
                            {admin.name || "Admin"}
                        </p>

                        <p className="truncate text-xs text-gray-500">
                            {admin.email || ""}
                        </p>

                    </div>

                    <button
                        onClick={handleLogout}
                        className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-gray-600 transition hover:bg-gray-100 hover:text-red-600"
                    >
                        <LogOut size={19} />

                        Logout
                    </button>

                </div>

            </aside>

            {/* Main */}
            <div className="lg:pl-64">

                {/* Top bar */}
                <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b bg-white px-4 sm:px-6">

                    <button
                        onClick={() =>
                            setSidebarOpen(true)
                        }
                        className="rounded-lg p-2 hover:bg-gray-100 lg:hidden"
                    >
                        <Menu size={22} />
                    </button>

                    <div className="ml-auto flex items-center gap-3">

                        <div className="hidden text-right sm:block">
                            <p className="text-sm font-semibold">
                                {admin.name || "Admin"}
                            </p>

                            <p className="text-xs text-gray-500">
                                {admin.role || "admin"}
                            </p>
                        </div>

                        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-black text-sm font-semibold text-white">
                            {(admin.name || "A")
                                .charAt(0)
                                .toUpperCase()}
                        </div>

                    </div>

                </header>

                {/* Page */}
                <main className="p-4 sm:p-6 lg:p-8">
                    <Outlet />
                </main>

            </div>

        </div>
    );
};

export default AdminLayout;