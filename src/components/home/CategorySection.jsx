import { ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";

import { categories } from "../../data/categories";
import CategoryCard from "./CategoryCard";

function CategorySection() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="mb-7 flex items-end justify-between gap-4">

        <div>
          <p className="text-sm font-semibold text-green-600">
            PILIH SESUAI SELERA
          </p>

          <h2 className="mt-2 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            Kategori Menu
          </h2>
        </div>

        <Link
          to="/products"
          className="hidden items-center gap-1 text-sm font-semibold text-green-600 hover:text-green-700 sm:flex"
        >
          Semua menu
          <ChevronRight size={17} />
        </Link>

      </div>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {categories.map((category) => (
          <CategoryCard
            key={category.name}
            category={category}
          />
        ))}
      </div>
    </section>
  );
}

export default CategorySection;
