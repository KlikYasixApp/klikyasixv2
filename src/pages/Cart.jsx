import { ArrowLeft, Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";

import { formatPrice } from "../data/products";
import { useCartStore } from "../store/cartStore";

function Cart() {
  const items = useCartStore((state) => state.items);
  const increaseQuantity = useCartStore((state) => state.increaseQuantity);
  const decreaseQuantity = useCartStore((state) => state.decreaseQuantity);
  const removeItem = useCartStore((state) => state.removeItem);

  const subtotal = items.reduce(
    (total, item) => total + item.price * item.quantity,
    0,
  );

  const totalItems = items.reduce((total, item) => total + item.quantity, 0);

  // EMPTY CART
  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-slate-50">
        <div className="mx-auto flex min-h-[70vh] max-w-7xl items-center justify-center px-4 py-16 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-green-50 text-green-600">
              <ShoppingBag size={36} />
            </div>

            <h1 className="mt-6 text-2xl font-black text-slate-900 sm:text-3xl">
              Keranjang masih kosong
            </h1>

            <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-slate-500">
              Yuk pilih makanan atau minuman favoritmu dari menu kantin.
            </p>

            <Link
              to="/products"
              className="mt-7 inline-flex items-center gap-2 rounded-xl bg-green-600 px-6 py-3.5 font-bold text-white shadow-lg shadow-green-600/20 transition hover:bg-green-700"
            >
              <ShoppingBag size={18} />
              Lihat Menu
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* HEADER */}
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <Link
            to="/products"
            className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 transition hover:text-green-600"
          >
            <ArrowLeft size={17} />
            Kembali ke menu
          </Link>

          <div className="mt-6">
            <h1 className="text-3xl font-black tracking-tight text-slate-900">
              Keranjang Belanja
            </h1>

            <p className="mt-2 text-sm text-slate-500">
              {totalItems} item di keranjangmu
            </p>
          </div>
        </div>
      </section>

      {/* CONTENT */}
      <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid gap-6 lg:grid-cols-[1fr_380px] lg:items-start">
          {/* ITEMS */}
          <div className="space-y-4">
            {items.map((item) => (
              <div
                key={item.id}
                className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5"
              >
                <div className="flex gap-4">
                  {/* IMAGE */}
                  <Link
                    to={`/products/${item.id}`}
                    className="shrink-0 overflow-hidden rounded-xl bg-slate-100"
                  >
                    <img
                      src={item.image}
                      alt={item.name}
                      className="h-24 w-24 object-cover transition hover:scale-105 sm:h-28 sm:w-28"
                    />
                  </Link>

                  {/* INFO */}
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-xs font-semibold text-green-600">
                          {item.category}
                        </p>

                        <Link
                          to={`/products/${item.id}`}
                          className="mt-1 block font-bold text-slate-900 hover:text-green-600"
                        >
                          {item.name}
                        </Link>
                      </div>

                      <button
                        type="button"
                        onClick={() => removeItem(item.id)}
                        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-slate-400 transition hover:bg-red-50 hover:text-red-500"
                        aria-label={`Hapus ${item.name}`}
                      >
                        <Trash2 size={17} />
                      </button>
                    </div>

                    <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
                      {/* QUANTITY */}
                      <div className="flex items-center rounded-xl border border-slate-200">
                        <button
                          type="button"
                          onClick={() => decreaseQuantity(item.id)}
                          className="flex h-9 w-9 items-center justify-center text-slate-500 transition hover:bg-slate-50 hover:text-slate-900"
                          aria-label="Kurangi jumlah"
                        >
                          <Minus size={15} />
                        </button>

                        <span className="w-9 text-center text-sm font-bold text-slate-900">
                          {item.quantity}
                        </span>

                        <button
                          type="button"
                          onClick={() => increaseQuantity(item.id)}
                          className="flex h-9 w-9 items-center justify-center text-slate-500 transition hover:bg-slate-50 hover:text-slate-900"
                          aria-label="Tambah jumlah"
                        >
                          <Plus size={15} />
                        </button>
                      </div>

                      {/* PRICE */}
                      <div className="text-right">
                        <p className="text-xs text-slate-400">
                          {formatPrice(item.price)} × {item.quantity}
                        </p>

                        <p className="mt-0.5 font-black text-slate-900">
                          {formatPrice(item.price * item.quantity)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* SUMMARY */}
          <aside className="lg:sticky lg:top-24">
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
              <h2 className="text-lg font-black text-slate-900">
                Ringkasan Pesanan
              </h2>

              <div className="mt-6 space-y-3 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Jumlah item</span>

                  <span className="font-semibold text-slate-900">
                    {totalItems}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Subtotal</span>

                  <span className="font-semibold text-slate-900">
                    {formatPrice(subtotal)}
                  </span>
                </div>
              </div>

              <div className="my-5 h-px bg-slate-200" />

              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-900">Total</span>

                <span className="text-xl font-black text-green-600">
                  {formatPrice(subtotal)}
                </span>
              </div>

              <Link
                to="/checkout"
                className="mt-6 flex w-full items-center justify-center rounded-xl bg-green-600 px-5 py-3.5 font-bold text-white shadow-lg shadow-green-600/20 transition hover:bg-green-700"
              >
                Lanjut ke Checkout
              </Link>

              <Link
                to="/products"
                className="mt-3 flex w-full items-center justify-center rounded-xl border border-slate-200 bg-white px-5 py-3.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
              >
                Tambah Menu
              </Link>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}

export default Cart;
