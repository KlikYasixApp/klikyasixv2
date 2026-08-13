import {
  ArrowRight,
  CheckCircle2,
  Clock3,
  Package,
  ShoppingBag,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";

import { formatPrice } from "../data/products";
import { orderService } from "../services/orderService";

const statusConfig = {
  pending: {
    label: "Menunggu",
    className: "bg-yellow-50 text-yellow-700",
    icon: Clock3,
  },

  processing: {
    label: "Diproses",
    className: "bg-blue-50 text-blue-700",
    icon: Package,
  },

  ready: {
    label: "Siap Diambil",
    className: "bg-green-50 text-green-700",
    icon: CheckCircle2,
  },

  completed: {
    label: "Selesai",
    className: "bg-slate-100 text-slate-700",
    icon: CheckCircle2,
  },

  cancelled: {
    label: "Dibatalkan",
    className: "bg-red-50 text-red-700",
    icon: Package,
  },
};

const getStatusConfig = (status) => {
  return statusConfig[status] || statusConfig.pending;
};

function Orders() {
  const [searchParams] = useSearchParams();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error] = useState("");

  const successId = searchParams.get("success");

  useEffect(() => {
    let mounted = true;

    const syncOrders = async () => {
      try {
        const data = await orderService.getAll();

        if (!mounted) return;

        setOrders(data);
        setLoading(false);
      } catch (err) {
        console.error("Gagal mengambil orders:", err);

        if (mounted) {
          setLoading(false);
        }
      }
    };

    const initialLoad = setTimeout(syncOrders, 0);

    const interval = setInterval(syncOrders, 1000);

    return () => {
      mounted = false;
      clearTimeout(initialLoad);
      clearInterval(interval);
    };
  }, []);

  // LOADING
  if (loading && orders.length === 0) {
    return (
      <div className="min-h-screen bg-slate-50">
        <div className="mx-auto flex min-h-[70vh] max-w-7xl items-center justify-center px-4 py-16">
          <div className="text-center">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-green-50 text-green-600">
              <Clock3 size={36} />
            </div>

            <h1 className="mt-6 text-2xl font-black text-slate-900">
              Memuat pesanan...
            </h1>

            <p className="mt-3 text-sm text-slate-500">
              Mengambil data pesanan terbaru.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // EMPTY
  if (orders.length === 0) {
    return (
      <div className="min-h-screen bg-slate-50">
        <section className="border-b border-slate-200 bg-white">
          <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
            <p className="text-sm font-semibold text-green-600">RIWAYAT</p>

            <h1 className="mt-2 text-3xl font-black tracking-tight text-slate-900">
              Pesanan Saya
            </h1>

            <p className="mt-2 text-sm text-slate-500">
              Lihat status dan detail pesananmu.
            </p>
          </div>
        </section>

        <div className="mx-auto flex min-h-[60vh] max-w-7xl items-center justify-center px-4 py-16">
          <div className="text-center">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-green-50 text-green-600">
              <Package size={36} />
            </div>

            <h1 className="mt-6 text-2xl font-black text-slate-900">
              Belum ada pesanan
            </h1>

            <p className="mt-3 text-sm text-slate-500">
              Pesanan yang kamu buat akan muncul di sini.
            </p>

            <Link
              to="/products"
              className="mt-7 inline-flex items-center gap-2 rounded-xl bg-green-600 px-6 py-3.5 font-bold text-white transition hover:bg-green-700"
            >
              <ShoppingBag size={18} />
              Pesan Sekarang
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
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <p className="text-sm font-semibold text-green-600">RIWAYAT</p>

          <h1 className="mt-2 text-3xl font-black tracking-tight text-slate-900">
            Pesanan Saya
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            Lihat status dan detail pesananmu.
          </p>
        </div>
      </section>

      {/* CONTENT */}
      <main className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
        {/* SUCCESS */}
        {successId && (
          <div className="mb-6 flex gap-4 rounded-2xl border border-green-200 bg-green-50 p-5">
            <CheckCircle2 className="shrink-0 text-green-600" size={24} />

            <div>
              <h2 className="font-bold text-green-800">
                Pesanan berhasil dibuat!
              </h2>

              <p className="mt-1 text-sm text-green-700">
                Nomor pesanan: <span className="font-bold">{successId}</span>
              </p>
            </div>
          </div>
        )}

        {/* ERROR */}
        {error && (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-600">
            {error}
          </div>
        )}

        {/* ORDER LIST */}
        <div className="space-y-5">
          {orders.map((order) => {
            const status = getStatusConfig(order.status);

            const StatusIcon = status.icon;

            return (
              <Link
                key={order.id}
                to={`/orders/${order.id}`}
                className="group block overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:border-green-200 hover:shadow-md"
              >
                {/* HEADER */}
                <div className="flex flex-col gap-4 border-b border-slate-100 p-5 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-xs font-semibold text-slate-400">
                      NOMOR PESANAN
                    </p>

                    <p className="mt-1 font-bold text-slate-900">{order.id}</p>
                  </div>

                  <div
                    className={`flex w-fit items-center gap-2 rounded-full px-3 py-1.5 text-xs font-bold ${status.className}`}
                  >
                    <StatusIcon size={14} />

                    {status.label}
                  </div>
                </div>

                {/* ITEMS */}
                <div className="divide-y divide-slate-100">
                  {order.items?.slice(0, 3).map((item, index) => (
                    <div key={`${item.id}-${index}`} className="flex gap-4 p-5">
                      <div className="h-14 w-14 shrink-0 overflow-hidden rounded-xl bg-slate-100">
                        {item.image ? (
                          <img
                            src={item.image}
                            alt={item.name}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center text-slate-400">
                            <Package size={20} />
                          </div>
                        )}
                      </div>

                      <div className="min-w-0 flex-1">
                        <p className="font-bold text-slate-900">{item.name}</p>

                        <p className="mt-1 text-sm text-slate-500">
                          {item.quantity} × {formatPrice(item.price)}
                        </p>
                      </div>

                      <p className="font-bold text-slate-900">
                        {formatPrice(item.price * item.quantity)}
                      </p>
                    </div>
                  ))}
                </div>

                {/* MORE ITEMS */}
                {order.items?.length > 3 && (
                  <div className="border-t border-slate-100 px-5 py-3 text-xs font-semibold text-slate-400">
                    + {order.items.length - 3} item lainnya
                  </div>
                )}

                {/* FOOTER */}
                <div className="flex items-center justify-between border-t border-slate-100 bg-slate-50 p-5">
                  <div>
                    <p className="text-xs text-slate-400">Total Pesanan</p>

                    <p className="mt-1 font-black text-green-600">
                      {formatPrice(order.total)}
                    </p>
                  </div>

                  <span className="flex items-center gap-1 text-sm font-bold text-slate-500 transition group-hover:text-green-600">
                    Detail
                    <ArrowRight
                      size={16}
                      className="transition group-hover:translate-x-1"
                    />
                  </span>
                </div>
              </Link>
            );
          })}
        </div>

        {/* REFRESH INDICATOR */}
        <div className="mt-6 flex items-center justify-center gap-2 text-xs text-slate-400">
          <span className="h-2 w-2 animate-pulse rounded-full bg-green-500" />
          Status pesanan diperbarui otomatis
        </div>
      </main>
    </div>
  );
}

export default Orders;
