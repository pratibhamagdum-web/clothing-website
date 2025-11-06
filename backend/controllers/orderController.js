import Order from "../models/OrderModel.js";
import User from "../models/UserModel.js";
import { Resend } from "resend";
import dotenv from "dotenv";

dotenv.config();

// ✅ Initialize Resend
const resend = new Resend(process.env.RESEND_API_KEY);

// ✅ Utility to send email
const sendOrderEmail = async (userEmail, userName, orderDetails) => {
  try {
    await resend.emails.send({
      from: "Clothing Store <onboarding@resend.dev>",
      to: userEmail,
      subject: "🛍️ Order Confirmation - Clothing Store",
      html: `
        <div style="font-family: Arial, sans-serif; line-height:1.6">
          <h2>Hello ${userName},</h2>
          <p>Thank you for shopping with us! Your order has been placed successfully.</p>

          <h3>🧾 Order Details:</h3>
          <ul>
            ${orderDetails.orderItems
              .map(
                (item) =>
                  `<li>${item.name} (x${item.qty}) - ₹${item.price}</li>`
              )
              .join("")}
          </ul>

          <p><strong>Total Price:</strong> ₹${orderDetails.totalPrice}</p>
          <p><strong>Payment Method:</strong> ${orderDetails.paymentMethod}</p>
          <p><strong>Shipping Address:</strong> ${orderDetails.shippingAddress.address}, ${orderDetails.shippingAddress.city}, ${orderDetails.shippingAddress.country}</p>

          <br/>
          <p>We'll notify you again once your order is shipped!</p>
          <p>— The Clothing Store Team</p>
        </div>
      `,
    });

    console.log("✅ Order confirmation email sent to:", userEmail);
  } catch (error) {
    console.error("❌ Error sending email:", error);
  }
};

// ✅ Create Order
export const addOrder = async (req, res) => {
  try {
    const { orderItems, shippingAddress, paymentMethod, totalPrice } = req.body;

    if (!orderItems || orderItems.length === 0) {
      return res.status(400).json({ message: "No order items" });
    }

    const order = new Order({
      user: req.user._id,
      orderItems,
      shippingAddress,
      paymentMethod,
      totalPrice,
      status: "Pending",
    });

    const createdOrder = await order.save();

    // Get user details
    const user = await User.findById(req.user._id);

    // Send email
    if (user && user.email) {
      await sendOrderEmail(user.email, user.name || "Customer", createdOrder);
    }

    res.status(201).json({
      message: "Order placed successfully. Confirmation email sent!",
      order: createdOrder,
    });
  } catch (error) {
    console.error("❌ Add Order Error:", error);
    res.status(500).json({ message: error.message });
  }
};

// ✅ Get My Orders
export const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({
      createdAt: -1,
    });
    res.json(orders);
  } catch (error) {
    console.error("❌ Get My Orders Error:", error);
    res.status(500).json({ message: error.message });
  }
};

// ✅ Admin: Get All Orders
export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("user", "name email")
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    console.error("❌ Get All Orders Error:", error);
    res.status(500).json({ message: error.message });
  }
};

// ✅ Admin: Update Order Status
export const updateOrderStatus = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: "Order not found" });

    order.status = req.body.status || order.status;
    await order.save();

    res.json({ message: "Order updated successfully", order });
  } catch (error) {
    console.error("❌ Update Order Error:", error);
    res.status(500).json({ message: error.message });
  }
};

// ✅ Admin: Delete Order
export const deleteOrder = async (req, res) => {
  try {
    const order = await Order.findByIdAndDelete(req.params.id);
    if (!order) return res.status(404).json({ message: "Order not found" });

    res.json({ message: "Order deleted successfully" });
  } catch (error) {
    console.error("❌ Delete Order Error:", error);
    res.status(500).json({ message: error.message });
  }
};
