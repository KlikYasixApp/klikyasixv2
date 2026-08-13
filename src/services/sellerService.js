const STORAGE_KEY = "kantin-users";

const getUsers = () => {
  try {
    const users = localStorage.getItem(STORAGE_KEY);

    return users ? JSON.parse(users) : [];
  } catch {
    return [];
  }
};

const saveUsers = (users) => {
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(users)
  );
};

const simulateApi = async (callback) => {
  await new Promise((resolve) =>
    setTimeout(resolve, 200)
  );

  return callback();
};

export const sellerService = {
  async getAll() {
    return simulateApi(() => {
      return getUsers().filter(
        (user) => user.role === "seller"
      );
    });
  },

  async getById(id) {
    return simulateApi(() => {
      return getUsers().find(
        (user) =>
          user.id === id &&
          user.role === "seller"
      );
    });
  },

  async create(data) {
    return simulateApi(() => {
      const users = getUsers();

      const emailExists = users.some(
        (user) =>
          user.email.toLowerCase() ===
          data.email.toLowerCase()
      );

      if (emailExists) {
        throw new Error(
          "Email sudah digunakan."
        );
      }

      const seller = {
        id: `seller-${Date.now()}`,
        name: data.name,
        email: data.email,
        password: data.password,
        role: "seller",
        active: true,
        createdAt: new Date().toISOString(),
      };

      saveUsers([...users, seller]);

      return seller;
    });
  },

  async update(id, data) {
    return simulateApi(() => {
      const users = getUsers();

      const index = users.findIndex(
        (user) =>
          user.id === id &&
          user.role === "seller"
      );

      if (index === -1) {
        throw new Error(
          "Seller tidak ditemukan."
        );
      }

      const emailExists = users.some(
        (user) =>
          user.id !== id &&
          user.email.toLowerCase() ===
            data.email.toLowerCase()
      );

      if (emailExists) {
        throw new Error(
          "Email sudah digunakan."
        );
      }

      const updatedSeller = {
        ...users[index],
        name: data.name,
        email: data.email,
        ...(data.password
          ? { password: data.password }
          : {}),
      };

      users[index] = updatedSeller;

      saveUsers(users);

      return updatedSeller;
    });
  },

  async toggleActive(id) {
    return simulateApi(() => {
      const users = getUsers();

      const index = users.findIndex(
        (user) =>
          user.id === id &&
          user.role === "seller"
      );

      if (index === -1) {
        throw new Error(
          "Seller tidak ditemukan."
        );
      }

      users[index] = {
        ...users[index],
        active: users[index].active === false,
      };

      saveUsers(users);

      return users[index];
    });
  },

  async remove(id) {
    return simulateApi(() => {
      const users = getUsers();

      const seller = users.find(
        (user) =>
          user.id === id &&
          user.role === "seller"
      );

      if (!seller) {
        throw new Error(
          "Seller tidak ditemukan."
        );
      }

      saveUsers(
        users.filter(
          (user) => user.id !== id
        )
      );

      return true;
    });
  },
};
