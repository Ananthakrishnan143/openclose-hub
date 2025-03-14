
import React, { useState, useEffect } from "react";
import { useShop } from "@/context/ShopContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { 
  LockOpen, 
  Lock, 
  Search, 
  RefreshCw, 
  Store,
  ArrowRight
} from "lucide-react";
import { Link } from "react-router-dom";

const Client = () => {
  const { products, shopStatus, searchProducts, lastUpdated, refreshData } = useShop();
  const [searchQuery, setSearchQuery] = useState("");
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const filteredProducts = searchProducts(searchQuery);

  const handleRefresh = () => {
    setIsRefreshing(true);
    refreshData();
    
    // Simulate refresh delay
    setTimeout(() => {
      setIsRefreshing(false);
    }, 500);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Store className="h-6 w-6 text-shop-accent" />
            <h1 className="text-xl font-bold text-gray-900">OpenClose Hub</h1>
          </div>
          <div className="flex items-center space-x-4">
            <Link to="/login">
              <Button variant="outline" size="sm">
                Admin
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <Card className="mb-8">
            <CardHeader className="pb-2">
              <CardTitle className="text-2xl">Shop Status</CardTitle>
              <CardDescription>
                Current status of the shop and last update time
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-center py-6">
                <div
                  className={`rounded-full p-8 ${
                    shopStatus === "open"
                      ? "bg-green-100"
                      : "bg-red-100"
                  }`}
                >
                  {shopStatus === "open" ? (
                    <LockOpen
                      className="h-12 w-12 text-shop-open animate-pulse-status"
                    />
                  ) : (
                    <Lock
                      className="h-12 w-12 text-shop-closed animate-pulse-status"
                    />
                  )}
                </div>
              </div>
              <div className="text-center mt-4">
                <h3
                  className={`text-2xl font-bold ${
                    shopStatus === "open"
                      ? "text-shop-open"
                      : "text-shop-closed"
                  }`}
                >
                  {shopStatus === "open" ? "OPEN" : "CLOSED"}
                </h3>
                <p className="text-sm text-muted-foreground mt-2">
                  Last updated: {lastUpdated.toLocaleString()}
                </p>
              </div>
            </CardContent>
            <CardFooter className="flex justify-center pb-6">
              <Button
                variant="outline"
                size="sm"
                onClick={handleRefresh}
                disabled={isRefreshing}
              >
                <RefreshCw
                  className={`h-4 w-4 mr-2 ${
                    isRefreshing ? "animate-spin" : ""
                  }`}
                />
                {isRefreshing ? "Refreshing..." : "Refresh"}
              </Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-xl">Available Products</CardTitle>
              <CardDescription>
                Browse our currently available items
              </CardDescription>
              <div className="relative mt-4">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                <Input
                  type="text"
                  placeholder="Search products..."
                  className="pl-8"
                  value={searchQuery}
                  onChange={handleSearch}
                />
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Product</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Availability</TableHead>
                    <TableHead>Description</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {shopStatus === "closed" ? (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center py-8">
                        <div className="flex flex-col items-center text-muted-foreground">
                          <Lock className="h-8 w-8 mb-2" />
                          <p>Shop is currently closed. Please check back later.</p>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : filteredProducts.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center py-8">
                        <p className="text-muted-foreground">No products found.</p>
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredProducts.map((product) => (
                      <TableRow key={product.id}>
                        <TableCell className="font-medium">
                          {product.name}
                        </TableCell>
                        <TableCell>${product.price.toFixed(2)}</TableCell>
                        <TableCell>
                          {product.quantity > 0 ? (
                            <Badge
                              variant="outline"
                              className="bg-green-50 text-shop-open border-shop-open"
                            >
                              In Stock ({product.quantity})
                            </Badge>
                          ) : (
                            <Badge
                              variant="outline"
                              className="bg-red-50 text-shop-closed border-shop-closed"
                            >
                              Out of Stock
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell className="max-w-xs truncate">
                          {product.description || "-"}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Client;
