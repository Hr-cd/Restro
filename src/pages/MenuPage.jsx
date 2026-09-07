import { useEffect, useState } from "react";
import CartDrawer from "../components/cart/CartDrawer";
import api from "../services/api";
import { useCart } from "../context/CartContext";
import MenuHeader from "../components/menu/MenuHeader";
import CategoryTabs from "../components/menu/CategoryTabs";
import FoodCard from "../components/menu/FoodCard";


const MenuPage = () => {
    const { cartCount } = useCart();
    const [categories, setCategories] = useState([]);
    const [foodItems, setFoodItems] = useState([]);
    const [cartOpen, setCartOpen] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState("");
    const [search, setSearch] = useState("");

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await api.get("/menu/categories");
                setCategories(response.data.data);
            } catch (error) {
                setError("Failed to load menu.");
            }
        };

        fetchCategories();
    }, []);

    useEffect(() => {
        const fetchFoodItems = async () => {
            try {
                setLoading(true);

                const response = await api.get("/menu/items", {
                    params: {
                        category: selectedCategory || undefined,
                        search: search || undefined
                    }
                });

                setFoodItems(response.data.data);
            } catch (error) {
                setError("Failed to load food items.");
            } finally {
                setLoading(false);
            }
        };

        fetchFoodItems();
    }, [selectedCategory, search]);

    return (
        <div className="min-h-screen bg-gray-50">
            <MenuHeader
                search={search}
                setSearch={setSearch}
                cartCount={cartCount}
                onCartClick={() => setCartOpen(true)}
            />

            <CartDrawer
                isOpen={cartOpen}
                onClose={() => setCartOpen(false)}
            />

            <main className="mx-auto max-w-6xl px-4 py-6">
                <CategoryTabs
                    categories={categories}
                    selectedCategory={selectedCategory}
                    setSelectedCategory={setSelectedCategory}
                />

                {error && (
                    <div className="mt-6 rounded-xl bg-red-50 p-4 text-red-600">
                        {error}
                    </div>
                )}

                {loading ? (
                    <div className="py-20 text-center text-gray-500">
                        Loading menu...
                    </div>
                ) : foodItems.length === 0 ? (
                    <div className="py-20 text-center">
                        <h2 className="text-xl font-semibold">
                            No food items found
                        </h2>

                        <p className="mt-2 text-gray-500">
                            Try another category or search.
                        </p>
                    </div>
                ) : (
                    <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                        {foodItems.map((item) => (
                            <FoodCard
                                key={item._id}
                                item={item}
                            />
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
};

export default MenuPage;