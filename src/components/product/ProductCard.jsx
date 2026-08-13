import { Check, Package, ShoppingBag } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";

import { formatPrice } from "../../data/products";
import { useCartStore } from "../../store/cartStore";

function ProductCard({ product }) {
  const [added, setAdded] = useState(false);

  const addItem = useCartStore((state) => state.addItem);

  const isUnavailable = product.active === false || Number(product.stock) <= 0;

  const handleAddToCart = (event) => {
    event.preventDefault();
    event.stopPropagation();

    if (isUnavailable) {
      return;
    }

    addItem(product);
    setAdded(true);

    setTimeout(() => {
      setAdded(false);
    }, 1200);
  };

  return (
    <Link
      to={`/products/${product.id}`}
      className="group block overflow-hidden rounded-2xl border border-slate-200 bg-white transition duration-300 hover:-translate-y-1 hover:border-green-200 hover:shadow-xl"
    >
      {/* IMAGE */}
      <div className="relative h-52 overflow-hidden bg-slate-100">
        {product.image ? (
          <img
            src={product.image}
            alt={product.name}
            loading="lazy"
            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <Package size={42} strokeWidth={1.5} className="text-slate-300" />
          </div>
        )}

        {/* CATEGORY */}
        <div className="absolute left-3 top-3 rounded-full bg-white px-3 py-1 text-xs font-semibold text-slate-700 shadow-sm">
          {product.category}
        </div>

        {/* UNAVAILABLE */}
        {isUnavailable && (
          <div className="absolute inset-0 flex items-center justify-center bg-slate-900/50">
            <span className="rounded-full bg-white px-4 py-2 text-sm font-bold text-slate-700 shadow-sm">
              {Number(product.stock) <= 0 ? "Stok habis" : "Tidak tersedia"}
            </span>
          </div>
        )}
      </div>

      {/* CONTENT */}
      <div className="p-4">
        <p className="text-xs font-semibold text-green-600">
          {product.category}
        </p>

        <h3 className="mt-1 line-clamp-1 font-bold text-slate-900">
          {product.name}
        </h3>

        {product.description && (
          <p className="mt-1 line-clamp-2 text-xs text-slate-500">
            {product.description}
          </p>
        )}

        <div className="mt-4 flex items-center justify-between gap-3">
          {/* PRICE */}
          <div>
            <p className="font-bold text-slate-900">
              {formatPrice(product.price)}
            </p>

            <p className="mt-1 text-xs text-slate-400">
              {Number(product.stock) > 0
                ? `Stok ${product.stock}`
                : "Stok habis"}
            </p>
          </div>

          {/* ADD TO CART */}
          <button
            type="button"
            onClick={handleAddToCart}
            disabled={isUnavailable}
            aria-label={`Tambah ${product.name} ke keranjang`}
            className={[
              "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition",
              isUnavailable
                ? "cursor-not-allowed bg-slate-100 text-slate-300"
                : added
                  ? "bg-green-600 text-white"
                  : "bg-green-50 text-green-600 hover:bg-green-600 hover:text-white",
            ].join(" ")}
          >
            {added ? <Check size={18} /> : <ShoppingBag size={18} />}
          </button>
        </div>
      </div>
    </Link>
  );
}

export default ProductCard;
