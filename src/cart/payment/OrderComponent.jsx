import React, { useContext } from 'react';
import { loadStripe } from "@stripe/stripe-js";
import classes from '../Cart.module.css';
import CartContext from '../cartContextAPI/CartContext';

export default function OrderComponent(props) {
  const cartCtx = useContext(CartContext);

  const userEmail = localStorage.getItem("userEmail");

  const handleOrderPlaced = async () => {
    const { items, totalAmount } = cartCtx;
    console.log("ite" , cartCtx.items)
    const stripePromise = loadStripe(
      "pk_test_51OkLUZSGFkTftsaBZYkSrSHE9tgJye29ObmhnaSiRLhoiKT6xnBxWL4BKN4oTgRvuVt3iFSIWQIc4sd5dZSEF2kr00rSUUZNpr"
    );

    const stripe = await stripePromise;

    const requestOptions = {
      method: 'POST',
      headers: {
        'content-type': 'application/json'
      },
      body: JSON.stringify({
        "product": cartCtx,
      }),
      redirect: 'follow'
    };

    try {
      const response = await fetch("http://localhost:4000/payment", requestOptions);
      const result = await response.json();

      stripe.redirectToCheckout({
        sessionId: result.id
      });

      // Store order in MongoDB
      await storeOrderInMongo(items, totalAmount);

      // Clear the cart after placing the order
      cartCtx.clearCart();
    } catch (error) {
      console.error('Error placing order:', error);
    }
  };

  const storeOrderInMongo = async (items, totalAmount) => {
    try {
      const apiUrl = "http://localhost:4000/api/orderData";
      const orderData = {
        email: userEmail,
        items: items.map(item => ({
          name: item.title,
          quantity: item.amount,
          price: item.price,
        })),
        totalAmount : totalAmount,
        orderDate: new Date().toDateString()
      };

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData),
      });

      if (response.ok) {
        console.log('Order stored');
      } else {
        console.error('Error storing order:', response.statusText);
      }
    } catch (error) {
      console.error('Error storing order:', error);
    }
  };

  return <button className={classes.button} onClick={handleOrderPlaced}>Order</button>;
}
