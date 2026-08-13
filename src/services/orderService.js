const STORAGE_KEY = "kantin-orders";

const getOrders = () => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error("Gagal membaca orders:", error);
    return [];
  }
};

const saveOrders = (orders) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(orders));

  // Beri tahu halaman lain di aplikasi bahwa order berubah.
  window.dispatchEvent(new Event("kantin-orders-updated"));
};

const simulateApi = async (callback) => {
  await new Promise((resolve) => setTimeout(resolve, 150));
  return callback();
};

const normalizeOrder = (order) => {
  const items = Array.isArray(order.items) ? order.items : [];

  return {
    ...order,

    status: order.status || "pending",

    items,

    totalItems:
      Number(order.totalItems) ||
      items.reduce((sum, item) => sum + Number(item.quantity || 0), 0),

    total:
      Number(order.total) ||
      items.reduce(
        (sum, item) =>
          sum + Number(item.price || 0) * Number(item.quantity || 0),
        0,
      ),

    buyerId: order.buyerId || null,
    buyerName: order.buyerName || order.customer?.name || "Buyer",
  };
};

export const orderService = {
  // ==========================================
  // CREATE ORDER
  // ==========================================
  async create(order) {
    return simulateApi(() => {
      if (!order) {
        throw new Error("Data pesanan tidak tersedia.");
      }

      if (!order.items || !Array.isArray(order.items)) {
        throw new Error("Item pesanan tidak valid.");
      }

      if (order.items.length === 0) {
        throw new Error("Pesanan tidak memiliki item.");
      }

      const orders = getOrders();

      const normalizedOrder = normalizeOrder({
        ...order,

        id: order.id || `ORD-${Date.now()}`,

        createdAt: order.createdAt || new Date().toISOString(),

        status: order.status || "pending",

        updatedAt: new Date().toISOString(),
      });

      orders.unshift(normalizedOrder);

      saveOrders(orders);

      console.log("ORDER CREATED:", normalizedOrder);

      return normalizedOrder;
    });
  },

  // ==========================================
  // GET ALL ORDERS
  // ==========================================
  async getAll() {
    return simulateApi(() => {
      return getOrders().map(normalizeOrder);
    });
  },

  // ==========================================
  // GET ORDER BY ID
  // ==========================================
  async getById(id) {
    return simulateApi(() => {
      const order = getOrders().find((item) => item.id === id);

      return order ? normalizeOrder(order) : null;
    });
  },

  // ==========================================
  // GET ORDERS BY SELLER
  // ==========================================
  async getBySeller(sellerId) {
    return simulateApi(() => {
      if (!sellerId) {
        return [];
      }

      return getOrders()
        .map(normalizeOrder)
        .filter((order) => {
          // Jika order punya sellerId langsung
          if (order.sellerId) {
            return order.sellerId === sellerId;
          }

          // Untuk order multi-item,
          // seller ditentukan dari item.
          return order.items.some((item) => item.sellerId === sellerId);
        })
        .map((order) => {
          // Seller hanya perlu melihat
          // item milik seller tersebut.
          const sellerItems = order.items.filter(
            (item) => item.sellerId === sellerId,
          );

          // Kalau order punya sellerId langsung,
          // gunakan semua item.
          const items = order.sellerId === sellerId ? order.items : sellerItems;

          const total = items.reduce(
            (sum, item) =>
              sum + Number(item.price || 0) * Number(item.quantity || 0),
            0,
          );

          const totalItems = items.reduce(
            (sum, item) => sum + Number(item.quantity || 0),
            0,
          );

          return {
            ...order,
            items,
            total,
            totalItems,
          };
        });
    });
  },

  // ==========================================
  // UPDATE STATUS
  // ==========================================
  async updateStatus(id, status) {
    return simulateApi(() => {
      const allowedStatuses = [
        "pending",
        "processing",
        "ready",
        "completed",
        "cancelled",
      ];

      if (!allowedStatuses.includes(status)) {
        throw new Error(`Status pesanan tidak valid: ${status}`);
      }

      const orders = getOrders();

      const index = orders.findIndex((order) => order.id === id);

      if (index === -1) {
        throw new Error("Pesanan tidak ditemukan.");
      }

      const updatedOrder = {
        ...orders[index],

        status,

        updatedAt: new Date().toISOString(),
      };

      orders[index] = updatedOrder;

      saveOrders(orders);

      console.log("ORDER STATUS UPDATED:", updatedOrder);

      return normalizeOrder(updatedOrder);
    });
  },
};
