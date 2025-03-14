
import React from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Store, User, Users } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
          <div className="flex items-center space-x-2">
            <Store className="h-6 w-6 text-shop-accent" />
            <h1 className="text-xl font-bold text-gray-900">OpenClose Hub</h1>
          </div>
        </div>
      </header>

      <main className="flex-grow flex items-center justify-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-4xl font-extrabold text-gray-900 sm:text-5xl sm:tracking-tight lg:text-6xl">
              OpenClose Hub
            </h2>
            <p className="mt-3 max-w-md mx-auto text-lg text-gray-500 sm:text-xl md:mt-5 md:max-w-3xl">
              An easy-to-use platform for shop owners to manage their shop status and inventory,
              and for customers to check availability in real-time.
            </p>
            <div className="mt-10 flex justify-center gap-6">
              <Link to="/client">
                <Button size="lg" variant="default" className="bg-shop-accent hover:bg-shop-accent/90">
                  <Users className="mr-2 h-5 w-5" />
                  Customer View
                </Button>
              </Link>
              <Link to="/login">
                <Button size="lg" variant="outline">
                  <User className="mr-2 h-5 w-5" />
                  Shop Owner Login
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </main>

      <footer className="bg-white border-t">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <p className="text-center text-sm text-gray-500">
            © {new Date().getFullYear()} OpenClose Hub. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
