import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import axios from 'axios';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import { saveAs } from 'file-saver';
import { getAdminOrders, updateOrderStatus } from '../../api/api';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [expandedOrder, setExpandedOrder] = useState(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await getAdminOrders();
      if (response.success) {
        setOrders(response.orders);
      } else {
        toast.error('Failed to fetch orders');
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
      toast.error('Failed to fetch orders');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (orderId, status) => {
    try {
      const response = await updateOrderStatus(orderId, status);
      if (response.success) {
        toast.success('Order status updated successfully');
        fetchOrders(); // Refresh orders list
      } else {
        toast.error('Failed to update order status');
      }
    } catch (error) {
      console.error('Error updating order status:', error);
      toast.error('Failed to update order status');
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
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

      page.drawText(`Name: ${order.user?.name || 'N/A'}`, {
        x: 50,
        y: height - 180,
        size: 12,
        font: font
      });

      page.drawText(`Email: ${order.user?.email || 'N/A'}`, {
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
      page.drawText(`${address?.fullName || 'N/A'}`, {
        x: 50,
        y: height - 260,
        size: 12,
        font: font
      });

      page.drawText(`${address?.address || 'N/A'}`, {
        x: 50,
        y: height - 280,
        size: 12,
        font: font
      });

      page.drawText(`${address?.city || 'N/A'}, ${address?.state || 'N/A'} - ${address?.pincode || 'N/A'}`, {
        x: 50,
        y: height - 300,
        size: 12,
        font: font
      });

      page.drawText(`Phone: ${address?.phone || 'N/A'}`, {
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
        page.drawText(item.product?.title || 'N/A', {
          x: 50,
          y: yPosition,
          size: 10,
          font: font,
          maxWidth: 180
        });

        page.drawText(item.size || 'N/A', {
          x: 250,
          y: yPosition,
          size: 10,
          font: font
        });

        page.drawText(item.quantity.toString() || 'N/A', {
          x: 350,
          y: yPosition,
          size: 10,
          font: font
        });

        page.drawText(`₹${item.price * item.quantity || 'N/A'}`, {
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

      page.drawText(`₹${order.totalAmount || 'N/A'}`, {
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

  const getStatusColor = (status) => {
    const colors = {
      'pending': 'bg-yellow-100 text-yellow-800',
      'processing': 'bg-blue-100 text-blue-800',
      'shipped': 'bg-purple-100 text-purple-800',
      'delivered': 'bg-green-100 text-green-800',
      'cancelled': 'bg-red-100 text-red-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const downloadOrderPDF = (order) => {
    const doc = new jsPDF();
    
    // Add header
    doc.setFontSize(20);
    doc.text('Order Details', 15, 20);
    
    // Add order info
    doc.setFontSize(12);
    doc.text(`Order ID: ${order._id}`, 15, 30);
    doc.text(`Date: ${formatDate(order.createdAt)}`, 15, 40);
    doc.text(`Status: ${order.status.toUpperCase()}`, 15, 50);
    
    // Add customer info
    doc.text('Customer Information:', 15, 65);
    doc.text(`Name: ${order.user?.name || 'N/A'}`, 20, 75);
    doc.text(`Email: ${order.user?.email || 'N/A'}`, 20, 85);
    
    // Add shipping address
    doc.text('Shipping Address:', 15, 100);
    if (order.shippingAddress) {
      doc.text(`${order.shippingAddress.fullName}`, 20, 110);
      doc.text(`${order.shippingAddress.address}`, 20, 120);
      doc.text(`${order.shippingAddress.city}, ${order.shippingAddress.state}`, 20, 130);
      doc.text(`${order.shippingAddress.pincode}`, 20, 140);
      doc.text(`Phone: ${order.shippingAddress.phone}`, 20, 150);
    }
    
    // Add items table
    const tableData = order.items.map(item => [
      item.product?.title || 'N/A',
      item.size,
      item.quantity,
      `₹${item.price}`,
      `₹${item.price * item.quantity}`
    ]);
    
    doc.autoTable({
      startY: 170,
      head: [['Product', 'Size', 'Qty', 'Price', 'Total']],
      body: tableData,
    });
    
    // Add total
    const finalY = doc.lastAutoTable.finalY + 10;
    doc.text(`Total Amount: ₹${order.totalAmount}`, 15, finalY);
    
    // Save PDF
    doc.save(`order-${order._id}.pdf`);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Order Management</h1>
      
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Order ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {orders.map((order) => (
                <React.Fragment key={order._id}>
                  <tr className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {order._id.slice(-8)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {order.user?.name || 'N/A'}
                      <br />
                      <span className="text-xs text-gray-400">
                        {order.user?.email || 'N/A'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(order.createdAt)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      ₹{order.totalAmount}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(order.status)}`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => setExpandedOrder(expandedOrder === order._id ? null : order._id)}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          {expandedOrder === order._id ? 'Hide Details' : 'View Details'}
                        </button>
                        <button
                          onClick={() => downloadOrderPDF(order)}
                          className="text-green-600 hover:text-green-900"
                        >
                          Download PDF
                        </button>
                      </div>
                    </td>
                  </tr>
                  {expandedOrder === order._id && (
                    <tr>
                      <td colSpan="6" className="px-6 py-4">
                        <div className="bg-gray-50 p-4 rounded-lg">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <h4 className="font-semibold mb-2">Shipping Address</h4>
                              <p>{order.shippingAddress?.fullName}</p>
                              <p>{order.shippingAddress?.address}</p>
                              <p>{order.shippingAddress?.city}, {order.shippingAddress?.state}</p>
                              <p>{order.shippingAddress?.pincode}</p>
                              <p>Phone: {order.shippingAddress?.phone}</p>
                            </div>
                            <div>
                              <h4 className="font-semibold mb-2">Order Items</h4>
                              {order.items.map((item, index) => (
                                <div key={index} className="flex justify-between mb-2">
                                  <span>{item.product?.title} ({item.size})</span>
                                  <span>₹{item.price} x {item.quantity}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                          <div className="mt-4">
                            <h4 className="font-semibold mb-2">Update Status</h4>
                            <select
                              value={order.status}
                              onChange={(e) => handleStatusUpdate(order._id, e.target.value)}
                              className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            >
                              <option value="pending">Pending</option>
                              <option value="processing">Processing</option>
                              <option value="shipped">Shipped</option>
                              <option value="delivered">Delivered</option>
                              <option value="cancelled">Cancelled</option>
                            </select>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Details Modal */}
      {isModalOpen && selectedOrder && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3 text-center">
              <h3 className="text-lg leading-6 font-medium text-gray-900">Order Details</h3>
              <div className="mt-2 px-7 py-3">
                <p className="text-sm text-gray-500">
                  Order ID: {selectedOrder._id}
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  Customer: {selectedOrder.user?.name || 'N/A'}
                </p>
                <div className="mt-4">
                  <h4 className="text-sm font-medium text-gray-900">Items:</h4>
                  {selectedOrder.items.map((item, index) => (
                    <div key={index} className="mt-2 text-sm text-gray-500">
                      <p>{item.product?.title || 'N/A'} x {item.quantity}</p>
                      <p>Size: {item.size}</p>
                      <p>Price: ₹{item.price}</p>
                    </div>
                  ))}
                </div>
                <div className="mt-4">
                  <h4 className="text-sm font-medium text-gray-900">Shipping Address:</h4>
                  <p className="text-sm text-gray-500">
                    {selectedOrder.shippingAddress?.street}<br />
                    {selectedOrder.shippingAddress?.city}, {selectedOrder.shippingAddress?.state}<br />
                    {selectedOrder.shippingAddress?.pincode}
                  </p>
                </div>
              </div>
              <div className="items-center px-4 py-3">
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-blue-500 text-white text-base font-medium rounded-md shadow-sm hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-300"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Orders; 