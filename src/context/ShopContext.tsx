
import React, { createContext, useContext, useState, useEffect } from "react";
import { Product, ShopStatus } from "@/types";
import { toast } from "sonner";
import { v4 as uuidv4 } from "uuid";

type ShopContextType = {
  products: Product[];
  shopStatus: ShopStatus;
  toggleShopStatus: () => void;
  addProduct: (product: Omit<Product, "id">) => void;
  updateProduct: (product: Product) => void;
  deleteProduct: (id: string) => void;
  searchProducts: (query: string) => Product[];
  lastUpdated: Date;
  refreshData: () => void;
};

const ShopContext = createContext<ShopContextType>({
  products: [],
  shopStatus: "closed",
  toggleShopStatus: () => {},
  addProduct: () => {},
  updateProduct: () => {},
  deleteProduct: () => {},
  searchProducts: () => [],
  lastUpdated: new Date(),
  refreshData: () => {},
});

export const useShop = () => useContext(ShopContext);

// Initial mock data
const initialProducts: Product[] = [
  {
    id: "1",
    name: "Coffee",
    price: 3.99,
    quantity: 100,
    description: "Freshly brewed coffee",
  },
  {
    id: "2",
    name: "Bagel",
    price: 2.49,
    quantity: 30,
    description: "Freshly baked bagel",
  },
  {
    id: "3",
    name: "Sandwich",
    price: 6.99,
    quantity: 15,
    description: "Ham and cheese sandwich",
  },
];

export const ShopProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Try to load data from localStorage or use initial data
  const [products, setProducts] = useState<Product[]>(() => {
    const savedProducts = localStorage.getItem("products");
    return savedProducts ? JSON.parse(savedProducts) : initialProducts;
  });
  
  const [shopStatus, setShopStatus] = useState<ShopStatus>(() => {
    const savedStatus = localStorage.getItem("shopStatus");
    return savedStatus ? (savedStatus as ShopStatus) : "closed";
  });
  
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  // Save to localStorage whenever data changes
  useEffect(() => {
    localStorage.setItem("products", JSON.stringify(products));
    localStorage.setItem("shopStatus", shopStatus);
  }, [products, shopStatus]);

  const toggleShopStatus = () => {
    const newStatus = shopStatus === "open" ? "closed" : "open";
    setShopStatus(newStatus);
    setLastUpdated(new Date());
    toast.success(`Shop is now ${newStatus}`);
  };

  const addProduct = (product: Omit<Product, "id">) => {
    const newProduct: Product = {
      ...product,
      id: uuidv4(),
    };
    setProducts([...products, newProduct]);
    setLastUpdated(new Date());
    toast.success(`Added ${product.name} to inventory`);
  };

  const updateProduct = (updatedProduct: Product) => {
    setProducts(
      products.map((product) =>
        product.id === updatedProduct.id ? updatedProduct : product
      )
    );
    setLastUpdated(new Date());
    toast.success(`Updated ${updatedProduct.name}`);
  };

  const deleteProduct = (id: string) => {
    const productToDelete = products.find(p => p.id === id);
    setProducts(products.filter((product) => product.id !== id));
    setLastUpdated(new Date());
    toast.success(`Removed ${productToDelete?.name} from inventory`);
  };

  const searchProducts = (query: string) => {
    if (!query.trim()) return products;
    const lowerCaseQuery = query.toLowerCase();
    return products.filter(
      (product) =>
        product.name.toLowerCase().includes(lowerCaseQuery) ||
        product.description?.toLowerCase().includes(lowerCaseQuery)
    );
  };

  const refreshData = () => {
    setLastUpdated(new Date());
    toast.info("Data refreshed");
  };

  return (
    <ShopContext.Provider
      value={{
        products,
        shopStatus,
        toggleShopStatus,
        addProduct,
        updateProduct,
        deleteProduct,
        searchProducts,
        lastUpdated,
        refreshData,
      }}
    >
      {children}
    </ShopContext.Provider>
  );
};
