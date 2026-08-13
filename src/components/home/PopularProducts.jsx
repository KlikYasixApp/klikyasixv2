import { ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";

import { popularProducts } from "../../data/products";
import ProductCard from "../product/ProductCard";

function PopularProducts() {
  return (
    <section className="bg-white">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-end justify-between gap-4">
          <div>
            <p className="text-sm font-semibold text-green-600">
              PALING BANYAK DIPILIH
            </p>

            <h2 className="mt-2 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
              Menu Favorit
            </h2>
          </div>

          <Link
            to="/products"
            className="hidden items-center gap-1 text-sm font-semibold text-green-600 hover:text-green-700 sm:flex"
          >
            Lihat semua
            <ChevronRight size={17} />
          </Link>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {popularProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

export default PopularProducts;
