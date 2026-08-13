const STORAGE_KEY = "kantin-products";

const defaultProducts = [
  {
    id: "product-001",
    sellerId: "seller-001",
    name: "Nasi Goreng",
    category: "Makanan",
    price: 12000,
    stock: 20,
    image: "",
    description: "Nasi goreng spesial kantin sekolah.",
    active: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: "product-002",
    sellerId: "seller-001",
    name: "Es Teh Manis",
    category: "Minuman",
    price: 5000,
    stock: 30,
    image: "",
    description: "Es teh manis segar.",
    active: true,
    createdAt: new Date().toISOString(),
  },
];

const getProducts = () => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);

    if (stored) {
      return JSON.parse(stored);
    }

    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(defaultProducts)
    );

    return defaultProducts;
  } catch {
    return [];
  }
};

const saveProducts = (products) => {
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(products)
  );
};

const simulateApi = async (callback) => {
  await new Promise((resolve) =>
    setTimeout(resolve, 200)
  );

  return callback();
};

export const productService = {
  async getAll(sellerId) {
    return simulateApi(() => {
      return getProducts().filter(
        (product) =>
          !sellerId ||
          product.sellerId === sellerId
      );
    });
  },

  async getById(id) {
    return simulateApi(() => {
      return getProducts().find(
        (product) => product.id === id
      );
    });
  },

  async create(data) {
    return simulateApi(() => {
      const products = getProducts();

      const product = {
        id: `product-${Date.now()}`,
        sellerId: data.sellerId,
        name: data.name,
        category: data.category,
        price: Number(data.price),
        stock: Number(data.stock),
        image: data.image || "",
        description: data.description || "",
        active: true,
        createdAt: new Date().toISOString(),
      };

      saveProducts([
        ...products,
        product,
      ]);

      return product;
    });
  },

  async update(id, data) {
    return simulateApi(() => {
      const products = getProducts();

      const index = products.findIndex(
        (product) => product.id === id
      );

      if (index === -1) {
        throw new Error(
          "Produk tidak ditemukan."
        );
      }

      const updatedProduct = {
        ...products[index],
        name: data.name,
        category: data.category,
        price: Number(data.price),
        stock: Number(data.stock),
        image: data.image || "",
        description: data.description || "",
      };

      products[index] = updatedProduct;

      saveProducts(products);

      return updatedProduct;
    });
  },

  async toggleActive(id) {
    return simulateApi(() => {
      const products = getProducts();

      const index = products.findIndex(
        (product) => product.id === id
      );

      if (index === -1) {
        throw new Error(
          "Produk tidak ditemukan."
        );
      }

      products[index] = {
        ...products[index],
        active:
          products[index].active === false,
      };

      saveProducts(products);

      return products[index];
    });
  },

  async remove(id) {
    return simulateApi(() => {
      const products = getProducts();

      const exists = products.some(
        (product) => product.id === id
      );

      if (!exists) {
        throw new Error(
          "Produk tidak ditemukan."
        );
      }

      saveProducts(
        products.filter(
          (product) => product.id !== id
        )
      );

      return true;
    });
  },
};
