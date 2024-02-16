import { useEffect, useState } from "react";
import { VscError } from "react-icons/vsc";
import CartItem from "../components/cart-item";
import React from "react";
import { RiH1 } from "react-icons/ri";
import { Link } from "react-router-dom";

const cartItems = [
  {
    productId: "abcd",
    photo: "https://m.media-amazon.com/images/I/71h9nOTd93L._SX569_.jpg",
    name: "HP Victus",
    price: 55000,
    quantity: 4,
    stock: 10,
  },
];
const subtotal = 5500;
const shippingCharges = 200;
const tax = subtotal * 0.18;
const discount = 150;
const total = subtotal + shippingCharges + tax;

const Cart = () => {
  const [couponCode, setCouponCode] = useState<string>("");
  const [isValidCouponCode, setIsValidCouponCode] = useState<boolean>(false);

  useEffect(() => {
    const timeOutID = setTimeout(() => {
      if (Math.random() > 0.5) setIsValidCouponCode(true);
      else setIsValidCouponCode(false);
    }, 1000);

    return () => {
      clearTimeout(timeOutID);
      setIsValidCouponCode(false);
    };
  }, [couponCode]);

  return (
    <div className="cart">
      <main>
        {cartItems.length > 0 ? (
          cartItems.map((_i, idx) => <CartItem key={idx} cartItem={_i} />)
        ) : (
          <h1>No Items Added</h1>
        )}
      </main>

      <aside>
        <p>Subtotal: ₹{subtotal}</p>
        <p>Shipping Charges: ₹{shippingCharges}</p>
        <p>Tax: ₹{tax}</p>
        <p>
          Discount: <em>-₹{discount}</em>
        </p>
        <p>
          <b>Total: {total}</b>
        </p>

        <input
          type="text"
          placeholder="Coupon Code"
          value={couponCode}
          onChange={(e) => setCouponCode(e.target.value)}
        />

        {couponCode &&
          (isValidCouponCode ? (
            <span className="green">
              ₹{discount} off using the <code>{couponCode}</code>
            </span>
          ) : (
            <span className="red">
              Invalid Coupon <VscError />{" "}
            </span>
          ))}
          {
            cartItems.length > 0 && <Link to={"/shipping"}>Checkout</Link>
          }
      </aside>
    </div>
  );
};

export default Cart;
