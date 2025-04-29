import React from "react";
import { Button } from "@/components/ui/button";
import { RotateCcw, AlertTriangle, Home } from "lucide-react";
import { Link } from "react-router-dom";

const NotFoundPage = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gray-50">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="flex flex-col items-center">
          <div className="h-24 w-24 rounded-full bg-primary/10 flex items-center justify-center mb-4">
            <AlertTriangle className="h-12 w-12 text-primary" />
          </div>

          <h1 className="text-4xl font-bold text-gray-900">404</h1>
          <h2 className="text-xl font-medium text-gray-900 mt-2">
            Página não encontrada
          </h2>
          <p className="text-gray-500 mt-4 mb-6">
            A página que você está procurando não existe ou foi movida para
            outro endereço.
          </p>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;
