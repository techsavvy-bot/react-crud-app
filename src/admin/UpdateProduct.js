import React, { useState, useEffect } from "react";
import Base from "../core/Base";
import { Link, Redirect } from "react-router-dom";
import {
  getCategories,
  getProduct,
  updateProduct,
} from "./helper/adminapicall";
import { isAuthenticated } from "../auth/helper";

const UpdateProduct = ({ match }) => {
  const { user, token } = isAuthenticated();

  const [values, setValues] = useState({
    name: "",
    description: "",
    price: "",
    stock: "",
    photo: "",
    categories: [],
    category: "",
    loading: false,
    error: "",
    createdProduct: "",
    getRedirect: false,
    formData: "",
  });

  const {
    name,
    description,
    price,
    stock,
    categories,
    category,
    loading,
    error,
    createdProduct,
    getRedirect,
    formData,
  } = values;

  const preload = (productId) => {
    // let productId = window.location.pathname.split("/")[4];

    getProduct(productId).then((data) => {
      if (data.error) {
        setValues({ ...values, error: data.error });
      } else {
        preloadCategories();
        setValues({
          ...values,

          name: data.name,
          description: data.description,
          price: data.price,
          stock: data.stock,
          category: data.category._id,
          formData: new FormData(),
        });
      }
    });
    //     getCategories().then((data) => {
    //       //   console.log(data);
    //       if (data.error) {
    //         setValues({ ...values, error: data.error });
    //       } else {
    //         setValues({ ...values, categories: data, formData: new FormData() });
    //         console.log(categories);
    //       }
    //     });
  };
  const preloadCategories = () => {
    getCategories().then((data) => {
      //   console.log(data);
      if (data.error) {
        setValues({ ...values, error: data.error });
      } else {
        setValues({ categories: data, formData: new FormData() });
        console.log(categories);
      }
    });
  };
  useEffect(() => {
    preload(match.params.productId);
  }, []);

  const onSubmit = (event) => {
    event.preventDefault();
    console.log("i am here 1");
    setValues({ ...values, error: "", loading: true });
    console.log("i am here 2");

    updateProduct(match.params.productId, user._id, token, formData).then(
      (data) => {
        console.log("i am here 3");
        if (data.error) {
          setValues({ ...values, error: data.error });
        } else {
          setValues({
            name: "",
            description: "",
            price: "",
            photo: "",
            stock: "",
            loading: false,
            createdProduct: data.name,
          });
        }
      }
    );
  };

  const handleChange = (name) => (event) => {
    const value = name === "photo" ? event.target.files[0] : event.target.value;
    formData.set(name, value);
    setValues({ ...values, [name]: value });
  };

  const succussmessage = () => (
    <div
      className="alert alert-success mt-3"
      style={{ display: createdProduct ? "" : "none" }}
    >
      <h4>{createdProduct} updated successfully</h4>
    </div>
  );
  const errrormessage = () => (
    <div
      className="alert alert-danger mt-3"
      style={{ display: error ? "" : "none" }}
    >
      <h4>{error}</h4>
    </div>
  );

  const performRedirect = () => {
    //TODO: do a redirect here
    console.log(" in redirect");
    console.log(loading);
  };

  // const loadingMessage = () => {
  //   return (
  //     loading && (
  //       <div className="alert alert-info">
  //         <h2>Loading...</h2>
  //       </div>
  //     )
  //   );
  // };
  const createProductForm = () => (
    <form>
      <span>Post photo</span>
      <div className="form-group">
        <label className="btn btn-block btn-success">
          <input
            onChange={handleChange("photo")}
            type="file"
            name="photo"
            accept="image"
            placeholder="choose a file"
          />
        </label>
      </div>
      <div className="form-group">
        <input
          onChange={handleChange("name")}
          name="photo"
          className="form-control"
          placeholder="Name"
          value={name}
        />
      </div>
      <div className="form-group">
        <textarea
          onChange={handleChange("description")}
          name="photo"
          className="form-control"
          placeholder="Description"
          value={description}
        />
      </div>
      <div className="form-group">
        <input
          onChange={handleChange("price")}
          type="number"
          className="form-control"
          placeholder="Price"
          value={price}
        />
      </div>
      <div className="form-group">
        <select
          onChange={handleChange("category")}
          className="form-control"
          placeholder="Category"
        >
          <option>Select</option>
          {categories &&
            categories.map((cate, index) => (
              <option key={index} value={cate._id}>
                {cate.name}
              </option>
            ))}
        </select>
      </div>
      <div className="form-group">
        <input
          onChange={handleChange("stock")}
          type="number"
          className="form-control"
          placeholder="Quantity"
          value={stock}
        />
      </div>

      <button
        type="submit"
        onClick={onSubmit}
        className="btn btn-outline-success mb-2"
      >
        Update Product
      </button>
    </form>
  );
  return (
    <Base
      title="Update Product here"
      description="Welcome to product update section"
      className="text-white bg-success p-4"
    >
      <Link to="/admin/dashboard" className="btn btn-md btn-dark mb-3">
        Admin Home
      </Link>
      <div className="row bg-dark text-white rounded">
        <div className="col-md-8 offset-md-2">
          {errrormessage()}
          {succussmessage()}
          {createProductForm()}
          {setTimeout(() => {
            if (loading) {
              console.log("in");
              if (user && user.role === 1) {
                console.log("more");
                return <Redirect to="/admin/dashboard" />;
              } else {
                return <Redirect to="/user/dashboard" />;
              }
            }
          }, 5000)}
          {/* {performRedirect()} */}
        </div>
      </div>
    </Base>
  );
};
export default UpdateProduct;
