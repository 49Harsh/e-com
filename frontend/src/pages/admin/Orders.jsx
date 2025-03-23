import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import axios from 'axios';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import { saveAs } from 'file-saver';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/v1/orders/admin', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (response.data.success) {
        setOrders(response.data.orders);
      }
    } catch (error) {
      toast.error('Failed to fetch orders');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (orderId, newStatus) => {
    try {
      const response = await axios.put(
        `http://localhost:5000/api/v1/orders/admin/${orderId}`,
        { status: newStatus },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        }
      );

      if (response.data.success) {
        setOrders(orders.map(order => 
          order._id === orderId ? { ...order, status: newStatus } : order
        ));
        toast.success('Order status updated successfully');
      }
    } catch (error) {
      toast.error('Failed to update order status');
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(price);
  };

  const generateOrderPDF = async (order) => {
    try {
      const pdfDoc = await PDFDocument.create();
      const page = pdfDoc.addPage([600, 800]);
      const { width, height } = page.getSize();
      
      // Load a standard font
      const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
      const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

      // Header
      page.drawText('Order Invoice', {
        x: 50,
        y: height - 50,
        size: 24,
        font: boldFont
      });

      // Order Details
      page.drawText(`Order ID: ${order._id}`, {
        x: 50,
        y: height - 100,
        size: 12,
        font: font
      });

      page.drawText(`Order Date: ${new Date(order.createdAt).toLocaleDateString()}`, {
        x: 50,
        y: height - 120,
        size: 12,
        font: font
      });

      // Customer Details
      page.drawText('Customer Details:', {
        x: 50,
        y: height - 160,
        size: 14,
        font: boldFont
      });

      page.drawText(`Name: ${order.user.name}`, {
        x: 50,
        y: height - 180,
        size: 12,
        font: font
      });

      page.drawText(`Email: ${order.user.email}`, {
        x: 50,
        y: height - 200,
        size: 12,
        font: font
      });

      // Shipping Address
      page.drawText('Shipping Address:', {
        x: 50,
        y: height - 240,
        size: 14,
        font: boldFont
      });

      const address = order.shippingAddress;
      page.drawText(`${address.fullName}`, {
        x: 50,
        y: height - 260,
        size: 12,
        font: font
      });

      page.drawText(`${address.address}`, {
        x: 50,
        y: height - 280,
        size: 12,
        font: font
      });

      page.drawText(`${address.city}, ${address.state} - ${address.pincode}`, {
        x: 50,
        y: height - 300,
        size: 12,
        font: font
      });

      page.drawText(`Phone: ${address.phone}`, {
        x: 50,
        y: height - 320,
        size: 12,
        font: font
      });

      // Order Items
      page.drawText('Order Items:', {
        x: 50,
        y: height - 360,
        size: 14,
        font: boldFont
      });

      let yPosition = height - 390;

      // Table Header
      page.drawText('Product', {
        x: 50,
        y: yPosition,
        size: 12,
        font: boldFont
      });

      page.drawText('Size', {
        x: 250,
        y: yPosition,
        size: 12,
        font: boldFont
      });

      page.drawText('Qty', {
        x: 350,
        y: yPosition,
        size: 12,
        font: boldFont
      });

      page.drawText('Price', {
        x: 450,
        y: yPosition,
        size: 12,
        font: boldFont
      });

      yPosition -= 20;

      // Draw items
      order.items.forEach(item => {
        page.drawText(item.product.title, {
          x: 50,
          y: yPosition,
          size: 10,
          font: font,
          maxWidth: 180
        });

        page.drawText(item.size, {
          x: 250,
          y: yPosition,
          size: 10,
          font: font
        });

        page.drawText(item.quantity.toString(), {
          x: 350,
          y: yPosition,
          size: 10,
          font: font
        });

        page.drawText(`₹${item.price * item.quantity}`, {
          x: 450,
          y: yPosition,
          size: 10,
          font: font
        });

        yPosition -= 20;
      });

      // Total Amount
      yPosition -= 20;
      page.drawLine({
        start: { x: 50, y: yPosition },
        end: { x: 550, y: yPosition },
        thickness: 1
      });

      yPosition -= 30;
      page.drawText('Total Amount:', {
        x: 350,
        y: yPosition,
        size: 14,
        font: boldFont
      });

      page.drawText(`₹${order.totalAmount}`, {
        x: 450,
        y: yPosition,
        size: 14,
        font: boldFont
      });

      // Footer
      page.drawText('Thank you for shopping with us!', {
        x: 50,
        y: 50,
        size: 12,
        font: font
      });

      // Save the PDF
      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      saveAs(blob, `order-${order._id}.pdf`);

      toast.success('Order PDF downloaded successfully');
    } catch (error) {
      console.error('PDF generation error:', error);
      toast.error('Failed to generate PDF');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-6">Orders Management</h2>
      <div className="space-y-6">
        {orders.map((order) => (
          <div key={order._id} className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <p className="text-sm text-gray-500">Order ID: {order._id}</p>
                <p className="text-sm text-gray-500">
                  Placed on: {formatDate(order.createdAt)}
                </p>
                <p className="text-sm text-gray-500">
                  Customer: {order.user.name} ({order.user.email})
                </p>
              </div>
              <div className="flex items-center space-x-4">
                <select
                  value={order.status}
                  onChange={(e) => handleStatusUpdate(order._id, e.target.value)}
                  className="border rounded-md px-3 py-1 text-sm"
                >
                  <option value="Pending">Pending</option>
                  <option value="Processing">Processing</option>
                  <option value="Shipped">Shipped</option>
                  <option value="Delivered">Delivered</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${
                    order.status === 'Delivered'
                      ? 'bg-green-100 text-green-800'
                      : order.status === 'Processing'
                      ? 'bg-yellow-100 text-yellow-800'
                      : order.status === 'Shipped'
                      ? 'bg-blue-100 text-blue-800'
                      : order.status === 'Cancelled'
                      ? 'bg-red-100 text-red-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  {order.status}
                </span>
              </div>
            </div>

            <div className="border-t pt-4">
              <h3 className="font-medium mb-2">Order Items:</h3>
              <div className="space-y-2">
                {order.items.map((item) => (
                  <div key={item._id} className="flex justify-between items-center">
                    <div>
                      <p className="font-medium">{item.product.title}</p>
                      <p className="text-sm text-gray-500">
                        Size: {item.size} • Quantity: {item.quantity}
                      </p>
                    </div>
                    <p className="font-medium">{formatPrice(item.price * item.quantity)}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="border-t mt-4 pt-4">
              <h3 className="font-medium mb-2">Shipping Address:</h3>
              <p>{order.shippingAddress.fullName}</p>
              <p>{order.shippingAddress.address}</p>
              <p>
                {order.shippingAddress.city}, {order.shippingAddress.state} -{' '}
                {order.shippingAddress.pincode}
              </p>
              <p>Phone: {order.shippingAddress.phone}</p>
            </div>

            <div className="border-t mt-4 pt-4">
              <div className="flex justify-between items-center">
                <span className="font-medium">Total Amount:</span>
                <span className="font-medium text-lg">
                  {formatPrice(order.totalAmount)}
                </span>
              </div>
            </div>

            <div className="mt-4 flex justify-end">
              <button
                onClick={() => generateOrderPDF(order)}
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                <svg 
                  className="w-5 h-5 mr-2" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth="2" 
                    d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" 
                  />
                </svg>
                Download Invoice
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Orders; 