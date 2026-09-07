import { Search, ShoppingCart } from "lucide-react";

const MenuHeader = ({
    search,
    setSearch,
    cartCount,
    onCartClick
}) => {
    return (
        <header className="sticky top-0 z-20 border-b bg-white/95 backdrop-blur">
            <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4">
                <div>
                    <h1 className="text-2xl font-bold">Our Menu</h1>
                    <p className="text-sm text-gray-500">
                        Fresh food, made for you
                    </p>
                </div>

                <div className="flex items-center gap-3">
                    <div className="relative">
                        <Search
                            size={18}
                            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                        />

                        <input
                            type="text"
                            placeholder="Search food..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-40 rounded-xl border py-2 pl-9 pr-3 outline-none focus:ring-2 sm:w-64"
                        />
                    </div>

                    <button onClick={onCartClick} className="relative rounded-xl border p-2">
                        <ShoppingCart size={21} />

                        {cartCount > 0 && (
                            <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-black text-xs text-white">
                                {cartCount}
                            </span>
                        )}
                    </button>
                </div>
            </div>
        </header>
    );
};

export default MenuHeader;