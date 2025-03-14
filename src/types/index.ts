
export type Product = {
  id: string;
  name: string;
  price: number;
  quantity: number;
  description?: string;
  image?: string;
};

export type ShopStatus = 'open' | 'closed';

export type User = {
  id: string;
  username: string;
  isAdmin: boolean;
};
