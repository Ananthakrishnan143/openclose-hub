
import React, { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useShop } from "@/context/ShopContext";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  Package, 
  PackagePlus, 
  Pencil, 
  Trash, 
  LogOut, 
  Store, 
  StoreIcon, 
  Search,
  RefreshCw
} from "lucide-react";
import { Product } from "@/types";

const Admin = () => {
  const { user, logout } = useAuth();
  const { 
    products, 
    shopStatus, 
    toggleShopStatus, 
    addProduct, 
    updateProduct, 
    deleteProduct,
    searchProducts,
    lastUpdated,
    refreshData
  } = useShop();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [productFormOpen, setProductFormOpen] = useState(false);
  const [currentProduct, setCurrentProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    price: 0,
    quantity: 0,
    description: "",
  });

  // Redirect if not authenticated
  React.useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const filteredProducts = searchProducts(searchQuery);

  const resetForm = () => {
    setFormData({
      name: "",
      price: 0,
      quantity: 0,
      description: "",
    });
    setCurrentProduct(null);
  };

  const openProductForm = (product?: Product) => {
    if (product) {
      setCurrentProduct(product);
      setFormData({
        name: product.name,
        price: product.price,
        quantity: product.quantity,
        description: product.description || "",
      });
    } else {
      resetForm();
    }
    setProductFormOpen(true);
  };

  const handleFormChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    
    // Handle numeric values
    if (name === "price" || name === "quantity") {
      setFormData({
        ...formData,
        [name]: parseFloat(value) || 0,
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleSubmitProduct = () => {
    if (currentProduct) {
      updateProduct({
        ...currentProduct,
        ...formData,
      });
    } else {
      addProduct(formData);
    }
    setProductFormOpen(false);
    resetForm();
  };

  const handleDeleteProduct = (id: string) => {
    if (confirm("Are you sure you want to delete this product?")) {
      deleteProduct(id);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Store className="h-6 w-6 text-shop-accent" />
            <h1 className="text-xl font-bold text-gray-900">OpenClose Hub Admin</h1>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center mr-4">
              <Label htmlFor="shop-status" className="mr-2">
                Shop Status:
              </Label>
              <div className="flex items-center space-x-2">
                <Switch
                  id="shop-status"
                  checked={shopStatus === "open"}
                  onCheckedChange={toggleShopStatus}
                />
                <span
                  className={`font-medium ${
                    shopStatus === "open"
                      ? "text-shop-open"
                      : "text-shop-closed"
                  }`}
                >
                  {shopStatus.toUpperCase()}
                </span>
              </div>
            </div>
            <Button variant="outline" size="sm" onClick={handleLogout}>
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center space-x-2">
              <Package className="h-6 w-6 text-gray-500" />
              <h2 className="text-xl font-semibold text-gray-800">Inventory Management</h2>
            </div>
            <div className="flex items-center space-x-2">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                <Input
                  type="text"
                  placeholder="Search products..."
                  className="pl-8 w-60"
                  value={searchQuery}
                  onChange={handleSearch}
                />
              </div>
              <Button 
                variant="outline" 
                size="sm"
                onClick={refreshData}
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </Button>
              <Dialog open={productFormOpen} onOpenChange={setProductFormOpen}>
                <DialogTrigger asChild>
                  <Button onClick={() => openProductForm()}>
                    <PackagePlus className="h-4 w-4 mr-2" />
                    Add Product
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>
                      {currentProduct ? "Edit Product" : "Add New Product"}
                    </DialogTitle>
                    <DialogDescription>
                      Fill in the details below to {currentProduct ? "update" : "add"} a product.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="name" className="text-right">
                        Name
                      </Label>
                      <Input
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleFormChange}
                        className="col-span-3"
                        required
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="price" className="text-right">
                        Price ($)
                      </Label>
                      <Input
                        id="price"
                        name="price"
                        type="number"
                        step="0.01"
                        value={formData.price}
                        onChange={handleFormChange}
                        className="col-span-3"
                        required
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="quantity" className="text-right">
                        Quantity
                      </Label>
                      <Input
                        id="quantity"
                        name="quantity"
                        type="number"
                        value={formData.quantity}
                        onChange={handleFormChange}
                        className="col-span-3"
                        required
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="description" className="text-right">
                        Description
                      </Label>
                      <Textarea
                        id="description"
                        name="description"
                        value={formData.description}
                        onChange={handleFormChange}
                        className="col-span-3"
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setProductFormOpen(false)}>
                      Cancel
                    </Button>
                    <Button type="submit" onClick={handleSubmitProduct}>
                      {currentProduct ? "Save Changes" : "Add Product"}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>

          <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-medium">Product Inventory</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Last updated: {lastUpdated.toLocaleString()}
                </p>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead>Quantity</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredProducts.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center py-4">
                          No products found.
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredProducts.map((product) => (
                        <TableRow key={product.id}>
                          <TableCell className="font-medium">{product.name}</TableCell>
                          <TableCell>${product.price.toFixed(2)}</TableCell>
                          <TableCell>
                            <span className={product.quantity === 0 ? "text-shop-closed" : ""}>
                              {product.quantity}
                            </span>
                          </TableCell>
                          <TableCell className="max-w-xs truncate">
                            {product.description || "-"}
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end space-x-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => openProductForm(product)}
                              >
                                <Pencil className="h-3.5 w-3.5" />
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleDeleteProduct(product.id)}
                                className="text-shop-closed hover:text-shop-closed"
                              >
                                <Trash className="h-3.5 w-3.5" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Admin;
