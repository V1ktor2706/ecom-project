import React, { useContext, useState, useEffect } from "react";
import AppContext from "../Context/Context";
import CheckoutPopup from "./CheckoutPopup";
import { Button } from 'react-bootstrap';
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const Cart = () => {
  const { cart, removeFromCart, clearCart } = useContext(AppContext);
  const [cartItems, setCartItems] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  const baseUrl = import.meta.env.VITE_BASE_URL;

  useEffect(() => {
    setCartItems(cart.length ? cart : []);
  }, [cart]);

  useEffect(() => {
    const total = cartItems.reduce(
      (acc, item) => acc + item.price * item.quantity,
      0
    );
    setTotalPrice(total);
  }, [cartItems]);

  const handleIncreaseQuantity = (itemId) => {
    const newCartItems = cartItems.map((item) => {
      if (item.id === itemId) {
        if (item.quantity < item.stockQuantity) {
          return { ...item, quantity: item.quantity + 1 };
        } else {
          toast.info("Cannot add more than available stock");
        }
      }
      return item;
    });
    setCartItems(newCartItems);
  };

  const handleDecreaseQuantity = (itemId) => {
    const newCartItems = cartItems.map((item) =>
      item.id === itemId
        ? { ...item, quantity: Math.max(item.quantity - 1, 1) }
        : item
    );
    setCartItems(newCartItems);
  };

  const handleRemoveFromCart = (itemId) => {
    removeFromCart(itemId);
    const newCartItems = cartItems.filter((item) => item.id !== itemId);
    setCartItems(newCartItems);
  };

  const handleProceedToCheckout = () => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.info("Please log in to place your order.");
      navigate("/login");
      return;
    }
    setShowModal(true);
  };

  return (
    <div className="container mt-5 pt-5">
      <div className="row justify-content-center">
        <div className="col-md-10">
          <div className="card shadow">
            <div className="card-header bg-white">
              <h4 className="mb-0">Shopping Cart</h4>
            </div>
            <div className="card-body">
              {cartItems.length === 0 ? (
                <div className="text-center py-5">
                  <i className="bi bi-cart-x fs-1 text-muted"></i>
                  <h5 className="mt-3">Your cart is empty</h5>
                  <a href="/" className="btn btn-primary mt-3">Continue Shopping</a>
                </div>
              ) : (
                <>
                  <div className="table-responsive">
                    <table className="table table-hover align-middle">
                      <thead>
                        <tr>
                          <th>Product</th>
                          <th>Price</th>
                          <th>Quantity</th>
                          <th>Total</th>
                          <th>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {cartItems.map((item) => (
                          <tr key={item.id}>
                            <td>
                              <div className="d-flex align-items-center">
                                <img
                                  src={`${baseUrl}/api/product/${item.id}/image`}
                                  alt={item.name}
                                  className="rounded me-3"
                                  width="80"
                                  height="80"
                                  style={{ objectFit: "cover" }}
                                />
                                <div>
                                  <h6 className="mb-0">{item.name}</h6>
                                  <small className="text-muted">{item.brand}</small>
                                </div>
                              </div>
                            </td>
                            <td>$ {item.price}</td>
                            <td>
                              <div className="input-group input-group-sm" style={{ width: "120px" }}>
                                <button
                                  className="btn btn-outline-secondary"
                                  type="button"
                                  onClick={() => handleDecreaseQuantity(item.id)}
                                >
                                  <i className="bi bi-dash"></i>
                                </button>
                                <input
                                  type="text"
                                  className="form-control text-center"
                                  value={item.quantity}
                                  readOnly
                                />
                                <button
                                  className="btn btn-outline-secondary"
                                  type="button"
                                  onClick={() => handleIncreaseQuantity(item.id)}
                                >
                                  <i className="bi bi-plus"></i>
                                </button>
                              </div>
                            </td>
                            <td className="fw-bold">$ {(item.price * item.quantity).toFixed(2)}</td>
                            <td>
                              <button
                                className="btn btn-sm btn-outline-danger"
                                onClick={() => handleRemoveFromCart(item.id)}
                              >
                                <i className="bi bi-trash"></i>
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <div className="card mt-3">
                    <div className="card-body">
                      <div className="d-flex justify-content-between align-items-center">
                        <h5 className="mb-0">Total:</h5>
                        <h5 className="mb-0">$ {totalPrice.toFixed(2)}</h5>
                      </div>
                    </div>
                  </div>

                  <div className="d-grid mt-4">
                    <Button
                      variant="primary"
                      size="lg"
                      onClick={handleProceedToCheckout}
                    >
                      Proceed to Checkout
                    </Button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      <CheckoutPopup
        show={showModal}
        handleClose={() => setShowModal(false)}
        cartItems={cartItems}
        totalPrice={totalPrice}
        onOrderSuccess={() => {
          clearCart();
          setCartItems([]);
        }}
      />
    </div>
  );
};

export default Cart;
