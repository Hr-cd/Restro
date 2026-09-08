const AdminDashboardPage = () => {
    const admin = JSON.parse(
        localStorage.getItem("restro_admin") || "{}"
    );

    return (
        <div>

            <div>
                <h1 className="text-2xl font-bold sm:text-3xl">
                    Dashboard
                </h1>

                <p className="mt-1 text-gray-500">
                    Welcome back, {admin.name || "Admin"}.
                </p>
            </div>

            <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">

                <div className="rounded-2xl border bg-white p-5">
                    <p className="text-sm text-gray-500">
                        Today's Orders
                    </p>

                    <p className="mt-2 text-3xl font-bold">
                        0
                    </p>
                </div>

                <div className="rounded-2xl border bg-white p-5">
                    <p className="text-sm text-gray-500">
                        Today's Sales
                    </p>

                    <p className="mt-2 text-3xl font-bold">
                        ₹0
                    </p>
                </div>

                <div className="rounded-2xl border bg-white p-5">
                    <p className="text-sm text-gray-500">
                        Pending Orders
                    </p>

                    <p className="mt-2 text-3xl font-bold">
                        0
                    </p>
                </div>

                <div className="rounded-2xl border bg-white p-5">
                    <p className="text-sm text-gray-500">
                        Menu Items
                    </p>

                    <p className="mt-2 text-3xl font-bold">
                        0
                    </p>
                </div>

            </div>

        </div>
    );
};

export default AdminDashboardPage;