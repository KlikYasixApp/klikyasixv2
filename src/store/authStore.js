import { create } from "zustand";

const USERS_KEY = "kantin-users";
const AUTH_KEY = "kantin-auth";

const defaultUsers = [
  {
    id: "admin-001",
    name: "Administrator",
    email: "admin@kantin.local",
    password: "admin123",
    role: "admin",
    active: true,
  },
  {
    id: "seller-001",
    name: "Seller Kantin",
    email: "seller@kantin.local",
    password: "seller123",
    role: "seller",
    active: true,
  },
  {
    id: "buyer-001",
    name: "Buyer Demo",
    email: "buyer@kantin.local",
    password: "buyer123",
    role: "buyer",
    active: true,
  },
];

const getUsers = () => {
  try {
    const stored = localStorage.getItem(USERS_KEY);

    if (!stored) {
      localStorage.setItem(USERS_KEY, JSON.stringify(defaultUsers));

      return defaultUsers;
    }

    return JSON.parse(stored);
  } catch {
    localStorage.setItem(USERS_KEY, JSON.stringify(defaultUsers));

    return defaultUsers;
  }
};

const getStoredAuth = () => {
  try {
    const stored = localStorage.getItem(AUTH_KEY);

    return stored ? JSON.parse(stored) : null;
  } catch {
    return null;
  }
};

export const useAuthStore = create((set) => ({
  user: getStoredAuth(),

  login: (email, password) => {
    const users = getUsers();

    const normalizedEmail = email.trim().toLowerCase();

    const normalizedPassword = String(password);

    const user = users.find(
      (item) =>
        item.email.trim().toLowerCase() === normalizedEmail &&
        String(item.password) === normalizedPassword,
    );

    if (!user) {
      return {
        success: false,
        message: "Email atau password salah.",
      };
    }

    if (user.active === false) {
      return {
        success: false,
        message: "Akun sedang dinonaktifkan.",
      };
    }

    const safeUser = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    };

    localStorage.setItem("kantin-auth", JSON.stringify(safeUser));

    set({
      user: safeUser,
    });

    return {
      success: true,
      user: safeUser,
    };
  },

  addUser: (userData) => {
    const users = getUsers();

    const emailExists = users.some(
      (user) => user.email.toLowerCase() === userData.email.toLowerCase(),
    );

    if (emailExists) {
      throw new Error("Email sudah digunakan.");
    }

    const newUser = {
      id: `${userData.role}-${Date.now()}`,
      name: userData.name,
      email: userData.email,
      password: userData.password,
      role: userData.role,
      active: true,
    };

    const updatedUsers = [...users, newUser];

    localStorage.setItem(USERS_KEY, JSON.stringify(updatedUsers));

    return newUser;
  },

  getUsers: () => {
    return getUsers();
  },
}));
