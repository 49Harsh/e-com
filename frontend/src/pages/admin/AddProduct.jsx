import React from "react";
import ProductForm from "../../components/ProductForm";

const AddProduct = () => {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Add New Product</h1>
      </div>
      <ProductForm />
    </div>
  );
};

export default AddProduct;