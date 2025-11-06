import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

const sendOrderEmail = async (userEmail, userName, orderDetails) => {
  try {
    await resend.emails.send({
      from: "Clothing Store <no-reply@resend.dev>",
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
