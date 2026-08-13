import {
  Clock3,
  Eye,
  PackageCheck,
  Search,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { useAuthStore } from "../../store/authStore";
import { orderService } from "../../services/orderService";

const statusConfig = {
  pending: {
    label: "Menunggu",
    className:
      "bg-yellow-50 text-yellow-700",
  },

  processing: {
    label: "Diproses",
    className:
      "bg-blue-50 text-blue-700",
  },

  ready: {
    label: "Siap Diambil",
    className:
      "bg-green-50 text-green-700",
  },

  completed: {
    label: "Selesai",
    className:
      "bg-slate-100 text-slate-700",
  },

  cancelled: {
    label: "Dibatalkan",
    className:
      "bg-red-50 text-red-700",
  },
};

const formatPrice = (price) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(price);

const formatDate = (date) => {
  if (!date) return "-";

  return new Intl.DateTimeFormat(
    "id-ID",
    {
      dateStyle: "medium",
      timeStyle: "short",
    }
  ).format(new Date(date));
};

function Orders() {
  const user = useAuthStore(
    (state) => state.user
  );

  const [orders, setOrders] = useState([]);
  const [search, setSearch] = useState("");
  const [status, setStatus] =
    useState("all");
  const [loading, setLoading] =
    useState(true);
  const [error, setError] = useState("");

  const loadOrders = async () => {
    try {
      setLoading(true);
      setError("");

      const data =
        await orderService.getBySeller(
          user.id
        );

      setOrders(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.id) {
      loadOrders();
    }
  }, [user?.id]);

  const filteredOrders = orders.filter(
    (order) => {
      const searchText =
        search.toLowerCase();

      const matchesSearch =
        String(order.id)
          .toLowerCase()
          .includes(searchText) ||
        String(
          order.buyerName || ""
        )
          .toLowerCase()
          .includes(searchText);

      const matchesStatus =
        status === "all" ||
        order.status === status;

      return (
        matchesSearch &&
        matchesStatus
      );
    }
  );

  return (
    <div className="min-h-screen bg-slate-50">
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div>
          <p className="text-sm font-bold text-green-600">
            SELLER
          </p>

          <h1 className="mt-1 text-3xl font-black text-slate-900">
            Pesanan Masuk
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            Kelola pesanan dari buyer.
          </p>
        </div>

        <div className="mt-8 grid gap-4 lg:grid-cols-[1fr_220px]">
          <div className="relative">
            <Search
              size={19}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <input
              value={search}
              onChange={(event) =>
                setSearch(
                  event.target.value
                )
              }
              placeholder="Cari nomor pesanan atau buyer..."
              className="h-12 w-full rounded-xl border border-slate-200 bg-white pl-11 pr-4 text-sm outline-none focus:border-green-500"
            />
          </div>

          <select
            value={status}
            onChange={(event) =>
              setStatus(event.target.value)
            }
            className="h-12 rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold outline-none focus:border-green-500"
          >
            <option value="all">
              Semua Status
            </option>

            <option value="pending">
              Menunggu
            </option>

            <option value="processing">
              Diproses
            </option>

            <option value="ready">
              Siap Diambil
            </option>

            <option value="completed">
              Selesai
            </option>

            <option value="cancelled">
              Dibatalkan
            </option>
          </select>
        </div>

        {error && (
          <div className="mt-5 rounded-xl bg-red-50 px-4 py-3 text-sm font-semibold text-red-600">
            {error}
          </div>
        )}

        <div className="mt-5 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          {loading ? (
            <div className="p-10 text-center text-sm text-slate-500">
              Memuat pesanan...
            </div>
          ) : filteredOrders.length ===
            0 ? (
            <div className="p-12 text-center">
              <PackageCheck
                size={40}
                className="mx-auto text-slate-300"
              />

              <p className="mt-4 font-bold text-slate-700">
                Belum ada pesanan
              </p>

              <p className="mt-1 text-sm text-slate-400">
                Pesanan buyer akan muncul di sini.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {filteredOrders.map(
                (order) => {
                  const config =
                    statusConfig[
                      order.status
                    ] ||
                    statusConfig.pending;

                  const itemCount =
                    order.items.reduce(
                      (total, item) =>
                        total +
                        Number(
                          item.quantity || 0
                        ),
                      0
                    );

                  return (
                    <div
                      key={order.id}
                      className="p-5 transition hover:bg-slate-50 sm:p-6"
                    >
                      <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                        <div className="flex items-start gap-4">
                          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-green-50 text-green-600">
                            <PackageCheck
                              size={21}
                            />
                          </div>

                          <div>
                            <div className="flex flex-wrap items-center gap-2">
                              <p className="font-black text-slate-900">
                                #
                                {order.id}
                              </p>

                              <span
                                className={`rounded-full px-3 py-1 text-xs font-bold ${config.className}`}
                              >
                                {
                                  config.label
                                }
                              </span>
                            </div>

                            <p className="mt-1 text-sm text-slate-500">
                              {order.buyerName ||
                                "Buyer"}
                            </p>

                            <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-slate-400">
                              <span className="flex items-center gap-1">
                                <Clock3
                                  size={13}
                                />
                                {formatDate(
                                  order.createdAt
                                )}
                              </span>

                              <span>
                                {itemCount} item
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center justify-between gap-5 lg:justify-end">
                          <div>
                            <p className="text-xs text-slate-400">
                              Total
                            </p>

                            <p className="mt-1 font-black text-slate-900">
                              {formatPrice(
                                order.total
                              )}
                            </p>
                          </div>

                          <Link
                            to={`/seller/orders/${order.id}`}
                            className="flex h-10 items-center gap-2 rounded-xl border border-slate-200 px-4 text-sm font-bold text-slate-700 hover:border-green-300 hover:text-green-600"
                          >
                            <Eye size={17} />
                            Detail
                          </Link>
                        </div>
                      </div>
                    </div>
                  );
                }
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default Orders;
