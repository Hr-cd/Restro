const CategoryTabs = ({ categories, selectedCategory, setSelectedCategory }) => {
    return (
        <div className="flex gap-2 overflow-x-auto pb-2">
            <button
                onClick={() => setSelectedCategory("")}
                className={`whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium ${
                    selectedCategory === ""
                        ? "bg-black text-white"
                        : "bg-gray-100 text-gray-700"
                }`}
            >
                All
            </button>

            {categories.map((category) => (
                <button
                    key={category._id}
                    onClick={() => setSelectedCategory(category._id)}
                    className={`whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium ${
                        selectedCategory === category._id
                            ? "bg-black text-white"
                            : "bg-gray-100 text-gray-700"
                    }`}
                >
                    {category.name}
                </button>
            ))}
        </div>
    );
};

export default CategoryTabs;