export const products = [
  {
    id: 1,
    name: "Nasi Goreng Spesial",
    category: "Makanan",
    price: 12000,
    image:
      "https://images.unsplash.com/photo-1603133872878-684f208fb84b?auto=format&fit=crop&w=800&q=80",
    rating: 4.9,
    kantin: "SMA",
    available: true,
  },
  {
    id: 2,
    name: "Es Teh Manis",
    category: "Minuman",
    price: 5000,
    image:
      "https://images.unsplash.com/photo-1556679343-c7306c1976bc?auto=format&fit=crop&w=800&q=80",
    rating: 4.8,
    kantin: "SMK",
    available: true,
  },
  {
    id: 3,
    name: "Mie Goreng",
    category: "Makanan",
    price: 10000,
    image:
      "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=800&q=80",
    rating: 4.8,
    kantin: "SMK",
    available: true,
  },
  {
    id: 4,
    name: "Roti Cokelat",
    category: "Snack",
    price: 7000,
    image:
      "https://images.unsplash.com/photo-1608198093002-ad4e005484ec?auto=format&fit=crop&w=800&q=80",
    rating: 4.7,
    kantin: "SMK",
    available: true,
  },
  {
    id: 5,
    name: "Nasi Ayam Crispy",
    category: "Makanan",
    price: 15000,
    image:
      "https://images.unsplash.com/photo-1512058564366-18510be2db19?auto=format&fit=crop&w=800&q=80",
    rating: 4.9,
    kantin: "SMA",
    available: true,
  },
  {
    id: 6,
    name: "Es Jeruk",
    category: "Minuman",
    price: 6000,
    image:
      "https://images.unsplash.com/photo-1613478223719-2ab802602423?auto=format&fit=crop&w=800&q=80",
    rating: 4.7,
    kantin: "SMK",
    available: true,
  },
  {
    id: 7,
    name: "Kentang Goreng",
    category: "Snack",
    price: 8000,
    image:
      "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?auto=format&fit=crop&w=800&q=80",
    rating: 4.8,
    kantin: "SMK",
    available: true,
  },
  {
    id: 8,
    name: "Air Mineral",
    category: "Lainnya",
    price: 4000,
    image:
      "https://images.unsplash.com/photo-1564419320461-6870880221ad?auto=format&fit=crop&w=800&q=80",
    rating: 4.6,
    kantin: "SMK",
    available: true,
  },
  {
    id: 9,
    name: "Bakso",
    category: "Makanan",
    price: 12000,
    image:
      "https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?auto=format&fit=crop&w=800&q=80",
    rating: 4.8,
    kantin: "SMK",
    available: true,
  },
  {
    id: 10,
    name: "Pisang Cokelat",
    category: "Snack",
    price: 7000,
    image:
      "https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=800&q=80",
    rating: 4.7,
    kantin: "SMK",
    available: false,
  },
];

export const popularProducts = products.slice(0, 4);

export function formatPrice(price) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(price);
}
