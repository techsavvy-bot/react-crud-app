import React, { useEffect, useState } from "react";
import { isAuthenticated } from "../auth/helper";
import { cartEmpty, loadCart } from "./helper/cartHelper";
import { Link } from "react-router-dom";
import StripeCheckoutButton from "react-stripe-checkout";
import { API } from "../backend";
import { createOrder } from "./helper/orderHelper";

const StripeCheckout = ({
  products,
  setReload = (f) => f,
  reload = undefined,
}) => {
  const [data, setData] = useState({
    loading: false,
    success: false,
    error: "",
    address: "",
  });

  const tok = isAuthenticated() && isAuthenticated().token;
  const userId = isAuthenticated() && isAuthenticated().user._id;

  const getFinalAmount = () => {
    let amount = 0;
    products.map((p) => {
      amount = amount + p.price;
    });
    return amount;
  };

  const makePayment = (token) => {
    const body = {
      token,
      products,
    };
    const headers = {
      "Content-Type": "application/json",
    };
    return fetch(`${API}/stripepayment`, {
      method: "POST",
      headers,
      body: JSON.stringify(body),
    })
      .then((response) => {
        console.log(response);
        const orderData = {
          products: products,
          transaction_id: response.id,
          amount: response.amount,
        };
        createOrder(userId, tok, orderData);
        cartEmpty(() => {
          console.log("In cart empty");
        });
        setReload(!reload);
      })
      .catch((error) => console.log(error));
  };
  const showStripeButton = () => {
    return isAuthenticated() ? (
      <StripeCheckoutButton
        stripeKey="pk_test_51HDaPAAcew9lAqA1pv3CLmy04dUA8LlnLKPhyZAdVNd2Id0bmIYSv3HhcXMzdvr2sxhkuq3lWYEONqJbgEfsdQPC00u6vhUYCw"
        token={makePayment}
        amount={getFinalAmount() * 100}
        name="Buy Tshirts"
        shippingAddress
        billingAddress
      >
        <button className="btn btn-success">Pay with stripe</button>
      </StripeCheckoutButton>
    ) : (
      <Link to="/signin">
        <button className="btn btn-warning">Signin</button>
      </Link>
    );
  };

  return (
    <div>
      <h3 className="text-white">Stripe checkout loaded {getFinalAmount()}</h3>
      {showStripeButton()}
    </div>
  );
};
export default StripeCheckout;
