import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import API from '../lib/api';
import LoadingScreen from '../components/LoadingScreen';
import GlowAlert from '../components/GlowAlert';

const Admin = () => {
  const navigate = useNavigate();
  const { user, ordersEnabled: ordersEnabledFromContext, refreshOrdersEnabled } = useAuth();
  const [orders, setOrders] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [pdfRequests, setPdfRequests] = useState([]);
  const [feedbacks, setFeedbacks] = useState([]);
  const [pickupPoints, setPickupPoints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [alertState, setAlertState] = useState({ message: '', onConfirm: null });
  const [ordersEnabled, setOrdersEnabledState] = useState(ordersEnabledFromContext);
  const [newPickupPointName, setNewPickupPointName] = useState('');
  const [passwordForm, setPasswordForm] = useState({
    userId: '',
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');

  const openConfirm = (message, onConfirm) => setAlertState({ message, onConfirm });
  const closeAlert = () => setAlertState({ message: '', onConfirm: null });

  const [tab, setTab] = useState('orders');
  const [editingSubjectId, setEditingSubjectId] = useState(null);
  const [newSubject, setNewSubject] = useState({
    title: '',
    code: '',
    year: '1',
    sem: '1',
    singleSidePrice: '',
    doubleSidePrice: '',
    availability: true,
  });
  const [editSubjectData, setEditSubjectData] = useState(null);
  const [deliveryDaysEdits, setDeliveryDaysEdits] = useState({});
  const [ordersSearchQuery, setOrdersSearchQuery] = useState('');
  const [pdfRequestsSearchQuery, setPdfRequestsSearchQuery] = useState('');

  // Resolver function: Unified logic for determining item.sideType
  const resolveSideType = (item) => {
    if (item?.sideType && (item.sideType === 'single' || item.sideType === 'double')) {
      return item.sideType;
    }
    // Fallback: infer from sides
    return Number(item?.sides) === 2 ? 'double' : 'single';
  };

  const normalizeStatus = (status) => (status || '').toLowerCase().trim();

  const excludedFromOrdersTab = ['printing', 'out_for_delivery', 'delivered'];
  const baseOrders = orders.filter((o) => !excludedFromOrdersTab.includes(normalizeStatus(o.status)));
  const queueOrders = orders.filter((o) => ['printing', 'out_for_delivery', 'delivered'].includes(normalizeStatus(o.status)));

  const filteredOrders = !ordersSearchQuery
    ? baseOrders
    : baseOrders.filter((o) => {
        const q = ordersSearchQuery.trim().toLowerCase();
        const name = o.student?.name?.toLowerCase() || '';
        const collegeId = o.student?.collegeId?.toLowerCase() || '';
        const orderId = o.orderId?.toLowerCase() || '';
        const amount = o.amount?.toString() || '';
        return name.includes(q) || collegeId.includes(q) || orderId.includes(q) || amount.includes(q);
      });

  const filteredPdfRequests = !pdfRequestsSearchQuery
    ? pdfRequests
    : pdfRequests.filter((r) => {
        const q = pdfRequestsSearchQuery.trim().toLowerCase();
        const requestId = r.requestId?.toLowerCase() || '';
        const title = r.title?.toLowerCase() || '';
        const name = r.name?.toLowerCase() || '';
        return requestId.includes(q) || title.includes(q) || name.includes(q);
      });

  useEffect(() => {
    if (!user?.isAdmin) {
      navigate('/');
      return;
    }

    fetchData();
  }, [user]);

  useEffect(() => {
    setOrdersEnabledState(ordersEnabledFromContext);
  }, [ordersEnabledFromContext]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [ordersRes, subjectsRes, pdfRequestsRes, pickupPointsRes] = await Promise.all([
        API.get('/orders/admin/all'),
        API.get('/subjects/all'),
        API.get('/pdf-requests/admin/all'),
        API.get('/pickup-points/admin/all'),
      ]);
      setOrders(ordersRes.data);
      setSubjects(subjectsRes.data);
      setPdfRequests(pdfRequestsRes.data);
      setPickupPoints(pickupPointsRes.data);
      
      // Fetch feedbacks separately to avoid breaking admin panel if it fails
      try {
        const feedbacksRes = await API.get('/feedback/all');
        setFeedbacks(feedbacksRes.data);
      } catch (feedbackError) {
        console.error('Failed to load feedbacks:', feedbackError);
        setFeedbacks([]);
      }
    } catch (error) {
      console.error('Failed to load admin data:', error);
      alert('Failed to load admin data');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setPasswordError('');
    setPasswordSuccess('');

    if (!passwordForm.userId || !passwordForm.oldPassword || !passwordForm.newPassword) {
      setPasswordError('All fields are required');
      return;
    }

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordError('New passwords do not match');
      return;
    }

    if (passwordForm.newPassword.length < 6) {
      setPasswordError('New password must be at least 6 characters');
      return;
    }

    try {
      await API.post('/auth/change-password', {
        userId: passwordForm.userId,
        oldPassword: passwordForm.oldPassword,
        newPassword: passwordForm.newPassword
      });
      setPasswordSuccess('Password changed successfully!');
      setPasswordForm({ userId: '', oldPassword: '', newPassword: '', confirmPassword: '' });
    } catch (error) {
      setPasswordError(error.response?.data?.error || 'Failed to change password');
    }
  };

  const getNextStatus = (currentStatus) => {
    const statusFlow = {
      sent: 'placed',
      placed: 'printing',
      printing: 'out_for_delivery',
      out_for_delivery: 'delivered',
      delivered: null,
      cancelled: null,
    };
    return statusFlow[currentStatus];
  };

  const handleAcceptOrder = async (orderId, currentStatus) => {
    const nextStatus = getNextStatus(currentStatus);
    if (!nextStatus) return;

    const confirmMsg = `Move order ${orderId} from "${currentStatus}" to "${nextStatus}"?`;
    if (!window.confirm(confirmMsg)) return;

    try {
      const res = await API.put(`/orders/${orderId}/status`, { status: nextStatus });
      setOrders(orders.map((o) => (o.orderId === orderId ? res.data : o)));
      alert(`Order status updated to ${nextStatus}`);
    } catch (error) {
      alert('Failed to update order');
    }
  };

  const handleCancelOrder = async (orderId) => {
    try {
      const res = await API.put(`/orders/${orderId}/status`, { status: 'cancelled' });
      setOrders(orders.map((o) => (o.orderId === orderId ? res.data : o)));
      alert('Order cancelled');
    } catch (error) {
      alert('Failed to cancel order');
    }
  };

  const handleDeleteOrder = async (orderId) => {
    if (!window.confirm('Delete this order?')) return;
    try {
      await API.delete(`/orders/${orderId}`);
      setOrders(orders.filter((o) => o.orderId !== orderId));
      alert('Order deleted');
    } catch (error) {
      alert('Failed to delete order');
    }
  };

  const handleToggleLiveLocation = async (orderId, enabled) => {
    try {
      const res = await API.put(`/orders/${orderId}/live-location`, { enabled });
      setOrders(orders.map((o) => (o.orderId === orderId ? res.data : o)));
      alert(`Live location ${enabled ? 'enabled' : 'disabled'}`);
    } catch (error) {
      alert('Failed to toggle live location');
    }
  };

  const handleSetCustomPDFPrice = async (orderId, itemIndex, price) => {
    if (!price || price < 0) {
      alert('Please enter a valid price');
      return;
    }
    try {
      const res = await API.put(`/orders/${orderId}/set-price`, { itemIndex, price: parseFloat(price) });
      setOrders(orders.map((o) => (o.orderId === orderId ? res.data : o)));
      alert('Price set successfully!');
    } catch (error) {
      alert('Failed to set price');
    }
  };

  const handleAddSubject = async () => {
    console.log('Current newSubject state:', newSubject);
    
    if (!newSubject.title?.trim() || !newSubject.code?.trim()) {
      alert('Fill title and code');
      return;
    }
    
    const singlePrice = newSubject.singleSidePrice ? parseFloat(newSubject.singleSidePrice) : null;
    const doublePrice = newSubject.doubleSidePrice ? parseFloat(newSubject.doubleSidePrice) : null;
    
    if (!singlePrice && !doublePrice) {
      alert('Provide single-side or double-side price');
      return;
    }
    
    try {
      const payload = {
        title: newSubject.title.trim(),
        code: newSubject.code.trim(),
        year: newSubject.year,
        sem: newSubject.sem,
        singleSidePrice: singlePrice,
        doubleSidePrice: doublePrice,
        availability: newSubject.availability,
      };
      console.log('Sending payload:', JSON.stringify(payload, null, 2));
      
      const res = await API.post('/subjects', payload);
      console.log('Server response:', res.data);
      
      setSubjects([...subjects, res.data]);
      setNewSubject({
        title: '',
        code: '',
        year: '1',
        sem: '1',
        singleSidePrice: '',
        doubleSidePrice: '',
        availability: true,
      });
      alert('Subject added successfully!');
    } catch (error) {
      console.error('Full error object:', error);
      console.error('Error response:', error.response?.data);
      alert(error.response?.data?.error || error.message || 'Failed to add subject');
    }
  };

  const handleDeleteSubject = async (subjectId) => {
    if (!window.confirm('Delete this subject?')) return;
    try {
      await API.delete(`/subjects/${subjectId}`);
      setSubjects(subjects.filter((s) => s._id !== subjectId));
      alert('Subject deleted');
    } catch (error) {
      alert('Failed to delete subject');
    }
  };

  const openEditSubject = (subject) => {
    setEditingSubjectId(subject._id);
    setEditSubjectData({
      title: subject.title,
      singleSidePrice: subject.singleSidePrice ?? '',
      doubleSidePrice: subject.doubleSidePrice ?? '',
      availability: subject.availability ?? true,
    });
  };

  const handleUpdateSubject = async () => {
    if (!editingSubjectId || !editSubjectData?.title || editSubjectData.price === '') {
      alert('Please fill all fields');
      return;
    }

    try {
      const res = await API.patch(`/admin/subjects/${editingSubjectId}`, {
        title: editSubjectData.title,
        singleSidePrice: editSubjectData.singleSidePrice ? parseFloat(editSubjectData.singleSidePrice) : null,
        doubleSidePrice: editSubjectData.doubleSidePrice ? parseFloat(editSubjectData.doubleSidePrice) : null,
        availability: editSubjectData.availability,
      });
      setSubjects(subjects.map((s) => (s._id === editingSubjectId ? res.data : s)));
      setEditingSubjectId(null);
      setEditSubjectData(null);
      alert('Subject updated');
    } catch (error) {
      alert(error.response?.data?.error || 'Failed to update subject');
    }
  };

  const handleUpdateDeliveryDays = async (orderId, value) => {
    const parsed = parseInt(value, 10);
    if (Number.isNaN(parsed) || parsed < 1) {
      alert('Enter a valid number of days');
      return;
    }
    try {
      const res = await API.put(`/orders/${orderId}/delivery-days`, { deliveryDays: parsed });
      setOrders(orders.map((o) => (o.orderId === orderId ? res.data : o)));
      setDeliveryDaysEdits((prev) => ({ ...prev, [orderId]: parsed }));
      alert('Delivery days updated');
    } catch (error) {
      alert(error.response?.data?.error || 'Failed to update delivery days');
    }
  };

  const performDeleteFeedback = async (feedbackId) => {
    try {
      await API.delete(`/feedback/${feedbackId}`);
      setFeedbacks((prev) => prev.filter((f) => f._id !== feedbackId));
      setAlertState({ message: 'Feedback deleted successfully', onConfirm: null });
    } catch (error) {
      setAlertState({ message: 'Failed to delete feedback', onConfirm: null });
    }
  };

  const handleDeleteFeedback = (feedbackId) => {
    openConfirm('Are you sure you want to delete this feedback?', () => performDeleteFeedback(feedbackId));
  };

  const handleSetPDFPrice = async (requestId, price) => {
    if (!price || price < 0) {
      alert('Please enter a valid price');
      return;
    }
    try {
      const res = await API.put(`/pdf-requests/${requestId}/set-price`, { price: parseFloat(price) });
      setPdfRequests(pdfRequests.map((r) => (r.requestId === requestId ? res.data : r)));
      alert('Price set successfully!');
    } catch (error) {
      alert('Failed to set price');
    }
  };

  const handleDeletePdfRequest = async (pdfRequestId) => {
    if (!window.confirm('Delete this PDF request from the list?')) return;
    try {
      await API.delete(`/pdf-requests/${pdfRequestId}`);
      setPdfRequests((prev) => prev.filter((r) => r._id !== pdfRequestId));
      alert('PDF request deleted successfully');
    } catch (error) {
      alert('Failed to delete PDF request');
    }
  };

  const handleAddPickupPoint = async () => {
    if (!newPickupPointName.trim()) {
      alert('Please enter a pickup point name');
      return;
    }

    try {
      const res = await API.post('/pickup-points', { name: newPickupPointName });
      setPickupPoints([...pickupPoints, res.data]);
      setNewPickupPointName('');
      alert('Pickup point added successfully');
    } catch (error) {
      alert('Failed to add pickup point: ' + error.response?.data?.message);
    }
  };

  const handleTogglePickupPoint = async (pointId) => {
    try {
      const res = await API.put(`/pickup-points/${pointId}/toggle`, {});
      setPickupPoints(pickupPoints.map((p) => (p._id === pointId ? res.data : p)));
    } catch (error) {
      alert('Failed to update pickup point');
    }
  };

  const handleDeletePickupPoint = async (pointId) => {
    if (!window.confirm('Delete this pickup point?')) return;

    try {
      await API.delete(`/pickup-points/${pointId}`);
      setPickupPoints(pickupPoints.filter((p) => p._id !== pointId));
      alert('Pickup point deleted');
    } catch (error) {
      alert('Failed to delete pickup point');
    }
  };

  if (loading) {
    return <LoadingScreen duration={0} onFinished={() => {}} />;
  }

  const getStatusColor = (status) => {
    const colors = {
      pending_price: 'orange',
      sent: 'yellow',
      placed: 'blue',
      printing: 'purple',
      delivered: 'green',
      cancelled: 'red',
    };
    return colors[status] || 'gray';
  };

  const handleAlertOk = () => {
    if (alertState.onConfirm) {
      const action = alertState.onConfirm;
      setAlertState({ message: '', onConfirm: null });
      action();
    } else {
      closeAlert();
    }
  };

  const handleToggleOrdersEnabled = async () => {
    const next = !ordersEnabled;
    try {
      await API.post('/admin/orders-enabled', { enabled: next });
      setOrdersEnabledState(next);
      await refreshOrdersEnabled();
    } catch (error) {
      alert('Failed to update orders toggle: ' + (error.response?.data?.error || error.message));
    }
  };

  return (
    <>
      <div className="max-w-6xl mx-auto py-8 px-4">
      <button
        onClick={() => navigate(-1)}
        className="mb-6 flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#059669] to-[#047857] text-white rounded-lg hover:scale-[1.02] transition-transform shadow-lg"
      >
        <span className="text-yellow-400 font-bold text-lg">←</span>
        <span className="font-semibold">Back</span>
      </button>
      <h1 className="text-3xl font-bold mb-8">🛡️ Admin Dashboard</h1>

      {/* Orders toggle */}
      <div className="flex items-center gap-3 mb-6 p-4 rounded-lg bg-white shadow border border-gray-200">
        <span className="font-semibold text-black">Accept New Orders</span>
        <label className="relative inline-flex items-center cursor-pointer select-none">
          <input
            type="checkbox"
            className="sr-only"
            checked={ordersEnabled}
            onChange={handleToggleOrdersEnabled}
          />
          <div
            className={`w-12 h-6 rounded-full transition-colors duration-200 ${
              ordersEnabled ? 'bg-emerald-500' : 'bg-gray-300'
            }`}
          >
            <div
              className={`w-5 h-5 bg-white rounded-full shadow transform transition-transform duration-200 translate-y-0.5 ${
                ordersEnabled ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </div>
        </label>
        <span className="text-sm text-gray-600">
          {ordersEnabled ? 'ON: Users can place orders' : 'OFF: New orders paused'}
        </span>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 mb-6 border-b">
        <button
          onClick={() => setTab('orders')}
          className={`px-4 py-2 font-semibold ${
            tab === 'orders'
              ? 'border-b-2 border-primary text-primary'
              : 'text-gray-600'
          }`}
        >
          Orders ({baseOrders.length})
        </button>
        <button
          onClick={() => setTab('printing-queue')}
          className={`px-4 py-2 font-semibold ${
            tab === 'printing-queue'
              ? 'border-b-2 border-primary text-primary'
              : 'text-gray-600'
          }`}
        >
          Printing Queue ({queueOrders.length})
        </button>
        <button
          onClick={() => setTab('pdf-requests')}
          className={`px-4 py-2 font-semibold ${
            tab === 'pdf-requests'
              ? 'border-b-2 border-primary text-primary'
              : 'text-gray-600'
          }`}
        >
          PDF Requests ({pdfRequests.length})
        </button>
        <button
          onClick={() => setTab('subjects')}
          className={`px-4 py-2 font-semibold ${
            tab === 'subjects'
              ? 'border-b-2 border-primary text-primary'
              : 'text-gray-600'
          }`}
        >
          Subjects ({subjects.length})
        </button>
        <button
          onClick={() => setTab('feedbacks')}
          className={`px-4 py-2 font-semibold ${
            tab === 'feedbacks'
              ? 'border-b-2 border-primary text-primary'
              : 'text-gray-600'
          }`}
        >
          Feedbacks ({feedbacks.length})
        </button>
        <button
          onClick={() => setTab('pickup-points')}
          className={`px-4 py-2 font-semibold ${
            tab === 'pickup-points'
              ? 'border-b-2 border-primary text-primary'
              : 'text-gray-600'
          }`}
        >
          Pickup Points ({pickupPoints.length})
        </button>
        <button
          onClick={() => setTab('change-password')}
          className={`px-4 py-2 font-semibold ${
            tab === 'change-password'
              ? 'border-b-2 border-primary text-primary'
              : 'text-gray-600'
          }`}
        >
          Change Password
        </button>
      </div>

      {/* Orders Tab */}
      {tab === 'orders' && (
        <div>
          {/* Search bar for orders */}
          <div className="mb-6">
            <input
              type="text"
              placeholder="Search by student name, college ID, order ID, or amount..."
              value={ordersSearchQuery}
              onChange={(e) => setOrdersSearchQuery(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          {filteredOrders.length === 0 ? (
            <p className="text-gray-600">No orders {ordersSearchQuery ? 'matching your search.' : 'yet.'}</p>
          ) : (
            <div className="space-y-4">
              {filteredOrders.map((order) => (
                <div key={order._id} className="bg-white rounded-lg shadow-md p-6">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                    <div>
                      <p className="text-sm text-gray-600">Order ID</p>
                      <p className="font-bold text-lg">{order.orderId}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Amount</p>
                      <p className="font-bold text-lg">₹{order.amount}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Student</p>
                      <p className="font-bold">{order.student.name}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Date</p>
                      <p className="font-bold">{new Date(order.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div>
                      <p className="text-sm text-gray-600">Student ID</p>
                      <p className="font-semibold">{order.student.collegeId}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Phone</p>
                      <p className="font-semibold">{order.student.phone}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Pickup Point</p>
                      <p className="font-semibold">{order.pickupPoint || 'Main Gate'}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div>
                      <p className="text-sm text-gray-600">Items Count</p>
                      <p className="font-semibold">{order.items.length}</p>
                    </div>
                    <div className="md:col-span-2">
                      <p className="text-sm text-gray-600">Estimated Delivery</p>
                      <div className="flex gap-2 items-center mt-1">
                        <input
                          type="number"
                          min="1"
                          value={deliveryDaysEdits[order.orderId] ?? (order.deliveryDays ?? 3)}
                          onChange={(e) => setDeliveryDaysEdits((prev) => ({ ...prev, [order.orderId]: e.target.value }))}
                          className="border rounded px-3 py-2 w-24"
                        />
                        <button
                          onClick={() => handleUpdateDeliveryDays(order.orderId, deliveryDaysEdits[order.orderId] ?? (order.deliveryDays ?? 3))}
                          className="bg-emerald-500 text-white px-3 py-2 rounded font-semibold hover:bg-emerald-600 text-sm"
                        >
                          Save
                        </button>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">Shown to users as estimated days</p>
                    </div>
                  </div>

                  {/* Item details grouped by print type */}
                  <div className="mb-4">
                    <p className="text-sm text-gray-600 mb-2">Items</p>
                    {(() => {
                      const singles = [];
                      const doubles = [];
                      (order.items || []).forEach((item) => {
                        const type = resolveSideType(item);
                        if (type === 'double') doubles.push(item);
                        else singles.push(item);
                      });
                      return (
                        <div className="grid grid-cols-1 gap-2">
                          {singles.length > 0 && (
                            <p className="text-xs font-semibold text-gray-700">Single-side</p>
                          )}
                          {singles.map((item, idx) => (
                            <div key={`s-${idx}`} className="flex flex-col rounded border border-gray-200 bg-gray-50 px-3 py-2">
                              <div className="flex justify-between">
                                <div className="flex-1">
                                  <p className="font-semibold text-gray-900">
                                    {item.title || 'Untitled'} {item.code ? `(${item.code})` : ''}
                                  </p>
                                  <p className="text-xs text-gray-600">Print: Single · Qty: {item.qty}</p>
                                </div>
                                <div className="text-sm text-gray-800">
                                  {item.pricePerPage !== undefined && item.pricePerPage !== null && (
                                    <div>Price/page: ₹{item.pricePerPage}</div>
                                  )}
                                  {item.userPrice !== undefined && item.userPrice !== null && (
                                    <div>Item total: ₹{(item.userPrice * item.qty).toFixed(2)}</div>
                                  )}
                                  {item.userPrice === undefined || item.userPrice === null ? (
                                    item.price !== undefined && item.price !== null ? (
                                      <div>Item total: ₹{(item.price * item.qty).toFixed(2)}</div>
                                    ) : (
                                      <div className="text-xs text-gray-600">Pending admin price</div>
                                    )
                                  ) : null}
                                </div>
                              </div>
                            </div>
                          ))}
                          {doubles.length > 0 && (
                            <p className="mt-2 text-xs font-semibold text-gray-700">Double-side</p>
                          )}
                          {doubles.map((item, idx) => (
                            <div key={`d-${idx}`} className="flex flex-col rounded border border-gray-200 bg-gray-50 px-3 py-2">
                              <div className="flex justify-between">
                                <div className="flex-1">
                                  <p className="font-semibold text-gray-900">
                                    {item.title || 'Untitled'} {item.code ? `(${item.code})` : ''}
                                  </p>
                                  <p className="text-xs text-gray-600">Print: Double · Qty: {item.qty}</p>
                                </div>
                                <div className="text-sm text-gray-800">
                                  {item.pricePerPage !== undefined && item.pricePerPage !== null && (
                                    <div>Price/page: ₹{item.pricePerPage}</div>
                                  )}
                                  {item.userPrice !== undefined && item.userPrice !== null && (
                                    <div>Item total: ₹{(item.userPrice * item.qty).toFixed(2)}</div>
                                  )}
                                  {item.userPrice === undefined || item.userPrice === null ? (
                                    item.price !== undefined && item.price !== null ? (
                                      <div>Item total: ₹{(item.price * item.qty).toFixed(2)}</div>
                                    ) : (
                                      <div className="text-xs text-gray-600">Pending admin price</div>
                                    )
                                  ) : null}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      );
                    })()}
                    {/* Total price below items */}
                    <div className="mt-3 border-t border-gray-300 pt-3">
                      <p className="text-right font-bold text-lg text-gray-900">
                        Total: ₹{order.amount}
                      </p>
                    </div>
                  </div>

                  {order.payment?.screenshotUrl && (
                    <div className="mb-4">
                      <p className="text-sm text-gray-600 mb-2">Payment Screenshot</p>
                      <a
                        href={order.payment.screenshotUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-block"
                      >
                        <img
                          src={order.payment.screenshotUrl}
                          alt="Payment Screenshot"
                          className="w-40 h-40 object-cover rounded border hover:opacity-80 cursor-pointer"
                          onError={(e) => {
                            e.target.src = 'https://via.placeholder.com/200x200?text=Screenshot';
                          }}
                        />
                      </a>
                      {/* Payment type and amounts */}
                      {order.payment?.type && (
                        <div className="mt-3 text-sm text-gray-800">
                          <p>Payment Type: <span className="font-semibold">{order.payment.type}</span></p>
                          {order.payment.type === 'COD' ? (
                            <p>Paid Now: ₹{order.payment.paidAmount ?? 0} · Remaining COD: ₹{order.payment.remainingAmount ?? 0}</p>
                          ) : (
                            <p>Paid Amount: ₹{order.payment.paidAmount ?? order.amount}</p>
                          )}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Items with pending prices */}
                  {order.status === 'pending_price' && (
                    <div className="mb-4 bg-yellow-50 border border-yellow-300 rounded p-4">
                      <p className="font-bold text-yellow-800 mb-3">⚠️ Pending Price - Set prices for custom PDFs:</p>
                      {order.items.map((item, idx) => {
                        if (item.type === 'custom' && (item.userPrice === null || item.userPrice === undefined)) {
                          return (
                            <div key={idx} className="bg-white rounded p-3 mb-2">
                              <p className="font-semibold mb-2">📄 {item.title}</p>
                              <p className="text-sm text-gray-600 mb-2">
                                Qty: {item.qty} | Sides: {resolveSideType(item) === 'double' ? 'Double' : 'Single'}
                              </p>
                              {item.pdfUrl && (
                                <a
                                  href={item.pdfUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-blue-600 hover:underline text-sm mb-2 inline-block"
                                >
                                  View PDF →
                                </a>
                              )}
                              <div className="flex gap-2 items-center mt-2">
                                <input
                                  type="number"
                                  placeholder="Enter price"
                                  className="border rounded px-3 py-2 w-40"
                                  id={`price-${order.orderId}-${idx}`}
                                  min="0"
                                  step="0.01"
                                />
                                <button
                                  onClick={() => {
                                    const priceInput = document.getElementById(`price-${order.orderId}-${idx}`);
                                    handleSetCustomPDFPrice(order.orderId, idx, priceInput.value);
                                  }}
                                  className="bg-green-500 text-white px-4 py-2 rounded font-semibold hover:bg-green-600"
                                >
                                  Set Price
                                </button>
                              </div>
                            </div>
                          );
                        }
                        return null;
                      })}
                    </div>
                  )}

                  <div className="mb-4">
                    <div className="flex items-center gap-3 mb-3">
                      <span className="text-sm text-gray-600">Current Status:</span>
                      <span
                        className={`px-4 py-2 rounded-lg font-bold text-white bg-${getStatusColor(
                          order.status
                        )}-500`}
                      >
                        {order.status.toUpperCase()}
                      </span>
                    </div>

                    <div className="flex gap-2 flex-wrap">
                      {getNextStatus(order.status) && order.status !== 'cancelled' && (
                        <button
                          onClick={() => handleAcceptOrder(order.orderId, order.status)}
                          className="bg-green-500 text-white px-6 py-2 rounded font-semibold hover:bg-green-600 flex items-center gap-2"
                        >
                          ✓ Accept → {getNextStatus(order.status)}
                        </button>
                      )}

                      {order.status === 'sent' && (
                        <button
                          onClick={() => handleCancelOrder(order.orderId)}
                          className="bg-orange-500 text-white px-6 py-2 rounded font-semibold hover:bg-orange-600"
                        >
                          ✗ Cancel Order
                        </button>
                      )}

                      {(order.status === 'sent' || order.status === 'placed' || order.status === 'printing') && (
                        <div className="bg-red-50 border border-red-300 text-red-700 px-4 py-2 rounded font-semibold">
                          ⚠️ Cannot cancel after placed
                        </div>
                      )}
                     
                       {order.status === 'printing' && (
                         <div className="flex gap-2 items-center">
                           {!order.liveLocationEnabled && (
                             <button
                               onClick={() => handleToggleLiveLocation(order.orderId, true)}
                               className="bg-blue-500 text-white px-4 py-2 rounded font-semibold hover:bg-blue-600"
                             >
                               Enable Live Location
                             </button>
                           )}
                           {order.liveLocationEnabled && (
                             <button
                               onClick={() => handleToggleLiveLocation(order.orderId, false)}
                               className="bg-gray-600 text-white px-4 py-2 rounded font-semibold hover:bg-gray-700"
                             >
                               Disable Live Location
                             </button>
                           )}
                           {order.liveLocationEnabled && (
                             <span className="text-sm text-green-700 font-semibold">Live location ON</span>
                           )}
                         </div>
                       )}

                      {(order.status === 'delivered' || order.status === 'cancelled') && (
                        <button
                          onClick={() => handleDeleteOrder(order.orderId)}
                          className="bg-red-500 text-white px-6 py-2 rounded font-semibold hover:bg-red-600"
                        >
                          🗑️ Delete
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Printing Queue Tab */}
      {tab === 'printing-queue' && (
        <div>
          {queueOrders.length === 0 ? (
            <p className="text-gray-600">No orders in printing queue.</p>
          ) : (
            <>
              {/* Global Summary for All Orders */}
              {(() => {
                let globalSingleBooks = 0;
                let globalDoubleBooks = 0;
                let globalTotalBooks = 0;
                let globalSinglePages = 0;
                let globalDoublePages = 0;
                let globalGrandTotal = 0;
                const singleBooksList = [];
                const doubleBooksList = [];

                queueOrders.forEach((order) => {
                  const safeItems = Array.isArray(order.items) ? order.items : [];
                  safeItems.forEach((item) => {
                    const type = resolveSideType(item);
                    const pages = item.pages || 0;
                    const qty = item.qty || 0;
                    
                    // Calculate item total correctly based on available price fields
                    let itemTotal = 0;
                    let displayPrice = 0;
                    
                    if (item.userPrice !== undefined && item.userPrice !== null) {
                      // userPrice is per-unit total, multiply by qty
                      itemTotal = item.userPrice * qty;
                      displayPrice = item.userPrice;
                    } else if (item.price !== undefined && item.price !== null) {
                      // price is per-unit total, multiply by qty
                      itemTotal = item.price * qty;
                      displayPrice = item.price;
                    } else if (item.pricePerPage !== undefined && item.pricePerPage !== null) {
                      // pricePerPage needs to be multiplied by pages, qty, and side multiplier
                      const multiplier = type === 'double' ? 0.5 : 1;
                      itemTotal = pages * item.pricePerPage * qty * multiplier;
                      displayPrice = item.pricePerPage;
                    }

                    if (type === 'double') {
                      globalDoubleBooks += qty;
                      globalDoublePages += pages * qty;
                      doubleBooksList.push({ title: item.title || item.code || 'Untitled', qty, pages, pricePerPage: displayPrice, total: itemTotal });
                    } else {
                      globalSingleBooks += qty;
                      globalSinglePages += pages * qty;
                      singleBooksList.push({ title: item.title || item.code || 'Untitled', qty, pages, pricePerPage: displayPrice, total: itemTotal });
                    }
                    globalTotalBooks += qty;
                    globalGrandTotal += itemTotal;
                  });
                });

                return (
                  <div className="mb-6 bg-gradient-to-br from-purple-50 to-indigo-100 border-2 border-purple-300 rounded-xl p-6 shadow-lg">
                    <h2 className="text-2xl font-bold text-purple-900 mb-4 flex items-center gap-3">
                      <span>📊</span> Printing Queue Summary - All Orders
                    </h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Single-side Books */}
                      <div className="bg-white rounded-lg p-4 shadow">
                        <h3 className="text-lg font-bold text-gray-800 mb-3 border-b-2 border-blue-300 pb-2">
                          📘 Single-side Books ({globalSingleBooks})
                        </h3>
                        {singleBooksList.length === 0 ? (
                          <p className="text-gray-500 italic text-sm">No single-side books</p>
                        ) : (
                          <div className="space-y-2 max-h-64 overflow-y-auto">
                            {singleBooksList.map((book, idx) => (
                              <div key={idx} className="text-sm border-b border-gray-200 pb-2">
                                <div className="flex justify-between font-semibold text-gray-900">
                                  <span>{book.title}</span>
                                  <span className="text-blue-600">₹{book.total.toFixed(2)}</span>
                                </div>
                                <div className="text-xs text-gray-600">
                                  {book.pages}p × {book.qty}qty × ₹{book.pricePerPage}/p
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                        <div className="mt-3 pt-3 border-t-2 border-blue-400">
                          <div className="flex justify-between text-sm font-semibold text-gray-800">
                            <span>Total Pages:</span>
                            <span className="text-blue-600 text-base">{globalSinglePages}</span>
                          </div>
                          <div className="flex justify-between text-sm font-semibold text-gray-800">
                            <span>Total Books:</span>
                            <span className="text-blue-600 text-base">{globalSingleBooks}</span>
                          </div>
                        </div>
                      </div>

                      {/* Double-side Books */}
                      <div className="bg-white rounded-lg p-4 shadow">
                        <h3 className="text-lg font-bold text-gray-800 mb-3 border-b-2 border-green-300 pb-2">
                          📗 Double-side Books ({globalDoubleBooks})
                        </h3>
                        {doubleBooksList.length === 0 ? (
                          <p className="text-gray-500 italic text-sm">No double-side books</p>
                        ) : (
                          <div className="space-y-2 max-h-64 overflow-y-auto">
                            {doubleBooksList.map((book, idx) => (
                              <div key={idx} className="text-sm border-b border-gray-200 pb-2">
                                <div className="flex justify-between font-semibold text-gray-900">
                                  <span>{book.title}</span>
                                  <span className="text-green-600">₹{book.total.toFixed(2)}</span>
                                </div>
                                <div className="text-xs text-gray-600">
                                  {book.pages}p × {book.qty}qty × ₹{book.pricePerPage}/p × 0.5
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                        <div className="mt-3 pt-3 border-t-2 border-green-400">
                          <div className="flex justify-between text-sm font-semibold text-gray-800">
                            <span>Total Pages:</span>
                            <span className="text-green-600 text-base">{globalDoublePages}</span>
                          </div>
                          <div className="flex justify-between text-sm font-semibold text-gray-800">
                            <span>Total Books:</span>
                            <span className="text-green-600 text-base">{globalDoubleBooks}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Grand Totals */}
                    <div className="mt-6 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-lg p-4 text-white shadow-lg">
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                        <div>
                          <p className="text-sm opacity-90">Total Single Pages</p>
                          <p className="text-2xl font-bold">{globalSinglePages}</p>
                        </div>
                        <div>
                          <p className="text-sm opacity-90">Total Double Pages</p>
                          <p className="text-2xl font-bold">{globalDoublePages}</p>
                        </div>
                        <div>
                          <p className="text-sm opacity-90">Total Books</p>
                          <p className="text-2xl font-bold">{globalTotalBooks}</p>
                        </div>
                        <div>
                          <p className="text-sm opacity-90">Grand Total</p>
                          <p className="text-3xl font-bold">₹{globalGrandTotal.toFixed(2)}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })()}

              {/* Individual Orders */}
              <div className="space-y-4">
              {queueOrders.map((order) => {
                const safeItems = Array.isArray(order.items) ? order.items : [];
                
                return (
                  <div key={order._id} className="bg-white rounded-lg shadow-md p-6">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                      <div>
                        <p className="text-sm text-gray-600">Order ID</p>
                        <p className="font-bold text-lg">{order.orderId}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Amount</p>
                        <p className="font-bold text-lg">₹{order.amount}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Student</p>
                        <p className="font-bold">{order.student?.name || 'N/A'}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Date</p>
                        <p className="font-bold">{new Date(order.createdAt).toLocaleDateString()}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <div>
                        <p className="text-sm text-gray-600">Student ID</p>
                        <p className="font-semibold">{order.student?.collegeId || 'N/A'}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Phone</p>
                        <p className="font-semibold">{order.student?.phone || 'N/A'}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Pickup Point</p>
                        <p className="font-semibold">{order.pickupPoint || 'Main Gate'}</p>
                      </div>
                    </div>

                    {/* Item details grouped by print type */}
                    <div className="mb-4">
                      <p className="text-sm text-gray-600 mb-2">Items</p>
                      {safeItems.length === 0 ? (
                        <p className="text-gray-500 italic">No printable items</p>
                      ) : (
                        <>
                      {(() => {
                            const singles = [];
                            const doubles = [];
                            safeItems.forEach((item) => {
                              const type = resolveSideType(item);
                              if (type === 'double') doubles.push(item);
                              else singles.push(item);
                            });
                            return (
                              <div className="grid grid-cols-1 gap-2">
                                {singles.length > 0 && (
                                  <p className="text-xs font-semibold text-gray-700">Single-side</p>
                                )}
                                {singles.map((item, idx) => (
                                  <div key={`s-${idx}`} className="flex flex-col rounded border border-gray-200 bg-gray-50 px-3 py-2">
                                    <div className="flex justify-between">
                                      <div className="flex-1">
                                        <p className="font-semibold text-gray-900">
                                          {item.title || 'Untitled'} {item.code ? `(${item.code})` : ''}
                                        </p>
                                        <p className="text-xs text-gray-600">Print: Single · Qty: {item.qty}</p>
                                      </div>
                                      <div className="text-sm text-gray-800">
                                        {item.pricePerPage !== undefined && item.pricePerPage !== null && (
                                          <div>Price/page: ₹{item.pricePerPage}</div>
                                        )}
                                        {item.userPrice !== undefined && item.userPrice !== null && (
                                          <div>Item total: ₹{(item.userPrice * item.qty).toFixed(2)}</div>
                                        )}
                                        {item.userPrice === undefined || item.userPrice === null ? (
                                          item.price !== undefined && item.price !== null ? (
                                            <div>Item total: ₹{(item.price * item.qty).toFixed(2)}</div>
                                          ) : (
                                            <div className="text-xs text-gray-600">Pending admin price</div>
                                          )
                                        ) : null}
                                      </div>
                                    </div>
                                  </div>
                                ))}
                                {doubles.length > 0 && (
                                  <p className="mt-2 text-xs font-semibold text-gray-700">Double-side</p>
                                )}
                                {doubles.map((item, idx) => (
                                  <div key={`d-${idx}`} className="flex flex-col rounded border border-gray-200 bg-gray-50 px-3 py-2">
                                    <div className="flex justify-between">
                                      <div className="flex-1">
                                        <p className="font-semibold text-gray-900">
                                          {item.title || 'Untitled'} {item.code ? `(${item.code})` : ''}
                                        </p>
                                        <p className="text-xs text-gray-600">Print: Double · Qty: {item.qty}</p>
                                      </div>
                                      <div className="text-sm text-gray-800">
                                        {item.pricePerPage !== undefined && item.pricePerPage !== null && (
                                          <div>Price/page: ₹{item.pricePerPage}</div>
                                        )}
                                        {item.userPrice !== undefined && item.userPrice !== null && (
                                          <div>Item total: ₹{(item.userPrice * item.qty).toFixed(2)}</div>
                                        )}
                                        {item.userPrice === undefined || item.userPrice === null ? (
                                          item.price !== undefined && item.price !== null ? (
                                            <div>Item total: ₹{(item.price * item.qty).toFixed(2)}</div>
                                          ) : (
                                            <div className="text-xs text-gray-600">Pending admin price</div>
                                          )
                                        ) : null}
                                      </div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            );
                          })()}
                          {/* Total price below items */}
                          <div className="mt-3 border-t border-gray-300 pt-3">
                            <p className="text-right font-bold text-lg text-gray-900">
                              Total: ₹{order.amount}
                            </p>
                          </div>
                        </>
                      )}
                    </div>

                    {order.payment?.screenshotUrl && (
                      <div className="mb-4">
                        <p className="text-sm text-gray-600 mb-2">Payment Screenshot</p>
                        <a
                          href={order.payment.screenshotUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-block"
                        >
                          <img
                            src={order.payment.screenshotUrl}
                            alt="Payment Screenshot"
                            className="w-40 h-40 object-cover rounded border hover:opacity-80 cursor-pointer"
                            onError={(e) => {
                              e.target.src = 'https://via.placeholder.com/200x200?text=Screenshot';
                            }}
                          />
                        </a>
                        {order.payment?.type && (
                          <div className="mt-3 text-sm text-gray-800">
                            <p>Payment Type: <span className="font-semibold">{order.payment.type}</span></p>
                            {order.payment.type === 'COD' ? (
                              <p>Paid Now: ₹{order.payment.paidAmount ?? 0} · Remaining COD: ₹{order.payment.remainingAmount ?? 0}</p>
                            ) : (
                              <p>Paid Amount: ₹{order.payment.paidAmount ?? order.amount}</p>
                            )}
                          </div>
                        )}
                      </div>
                    )}

                    <div className="mb-4">
                      <div className="flex items-center gap-3 mb-3">
                        <span className="text-sm text-gray-600">Current Status:</span>
                        <span
                          className={`px-4 py-2 rounded-lg font-bold text-white bg-${getStatusColor(
                            order.status
                          )}-500`}
                        >
                          {order.status.toUpperCase()}
                        </span>
                      </div>

                      <div className="flex gap-2 flex-wrap">
                        {getNextStatus(order.status) && order.status !== 'cancelled' && (
                          <button
                            onClick={() => handleAcceptOrder(order.orderId, order.status)}
                            className="bg-green-500 text-white px-6 py-2 rounded font-semibold hover:bg-green-600 flex items-center gap-2"
                          >
                            ✓ Accept → {getNextStatus(order.status)}
                          </button>
                        )}

                        {order.status === 'printing' && (
                          <div className="flex gap-2 items-center">
                            {!order.liveLocationEnabled && (
                              <button
                                onClick={() => handleToggleLiveLocation(order.orderId, true)}
                                className="bg-blue-500 text-white px-4 py-2 rounded font-semibold hover:bg-blue-600"
                              >
                                Enable Live Location
                              </button>
                            )}
                            {order.liveLocationEnabled && (
                              <button
                                onClick={() => handleToggleLiveLocation(order.orderId, false)}
                                className="bg-gray-600 text-white px-4 py-2 rounded font-semibold hover:bg-gray-700"
                              >
                                Disable Live Location
                              </button>
                            )}
                            {order.liveLocationEnabled && (
                              <span className="text-sm text-green-700 font-semibold">Live location ON</span>
                            )}
                          </div>
                        )}

                        {(order.status === 'delivered' || order.status === 'cancelled') && (
                          <button
                            onClick={() => handleDeleteOrder(order.orderId)}
                            className="bg-red-500 text-white px-6 py-2 rounded font-semibold hover:bg-red-600"
                          >
                            🗑️ Delete
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
              </div>
            </>
          )}
        </div>
      )}

      {/* PDF Requests Tab */}
      {tab === 'pdf-requests' && (
        <div>
          {/* Search bar for PDF requests */}
          <div className="mb-6">
            <input
              type="text"
              placeholder="Search by request ID..."
              value={pdfRequestsSearchQuery}
              onChange={(e) => setPdfRequestsSearchQuery(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          {filteredPdfRequests.length === 0 ? (
            <p className="text-gray-600">No PDF requests {pdfRequestsSearchQuery ? 'matching your search.' : 'yet.'}</p>
          ) : (
            <div className="space-y-4">
              {filteredPdfRequests.map((request) => (
                <div key={request._id} className="bg-white rounded-lg shadow-md p-6">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                    <div>
                      <p className="text-sm text-gray-600">Request ID</p>
                      <p className="font-bold text-lg">{request.requestId}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Title</p>
                      <p className="font-bold">{request.title}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">User</p>
                      <p className="font-semibold">{request.userId?.name || 'N/A'}</p>
                      <p className="text-xs text-gray-500">{request.userId?.userId || ''}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Status</p>
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${
                          request.status === 'pending'
                            ? 'bg-yellow-100 text-yellow-800'
                            : request.status === 'priced'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div>
                      <p className="text-sm text-gray-600">Quantity</p>
                      <p className="font-semibold">{request.qty}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Sides</p>
                      <p className="font-semibold">{request.sides === 1 ? 'Single-sided' : 'Double-sided'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Date</p>
                      <p className="font-semibold">{new Date(request.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>

                  <div className="mb-4">
                    <p className="text-sm text-gray-600 mb-2">PDF File</p>
                    <div className="flex gap-3 items-center">
                      <a
                        href={request.pdfUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-4 py-2 rounded bg-blue-500 text-white font-semibold hover:bg-blue-600"
                      >
                        📄 View PDF
                      </a>
                      <a
                        href={request.pdfUrl}
                        download
                        className="px-4 py-2 rounded bg-gray-700 text-white font-semibold hover:bg-gray-800"
                        >
                          ⬇️ Download PDF
                        </a>
                    </div>
                  </div>

                  {request.status === 'pending' ? (
                    <div className="flex gap-2 items-center">
                      <input
                        type="number"
                        placeholder="Enter price"
                        className="border rounded px-3 py-2 w-40"
                        id={`pdf-price-${request.requestId}`}
                        min="0"
                        step="0.01"
                      />
                      {/* Admin-only helper: page count and auto-pricing display */}
                      <div className="flex items-center gap-2">
                        <input
                          type="number"
                          placeholder="Number of pages"
                          className="border rounded px-3 py-2 w-40"
                          id={`pdf-pages-${request.requestId}`}
                          min="1"
                          step="1"
                        />
                        <button
                          onClick={() => {
                            const pagesVal = parseInt(document.getElementById(`pdf-pages-${request.requestId}`)?.value || '0', 10);
                            if (!pagesVal || pagesVal <= 0) {
                              alert('Enter valid pages');
                              return;
                            }
                            const singlePrice = (pagesVal * 1) + 60;
                            const doublePrice = (pagesVal * 0.5) + 60;
                            alert(`Auto pricing (display only)\nSingle-side: ₹${singlePrice.toFixed(2)}\nDouble-side: ₹${doublePrice.toFixed(2)}`);
                          }}
                          className="bg-blue-500 text-white px-4 py-2 rounded font-semibold hover:bg-blue-600"
                        >
                          Show Auto Pricing
                        </button>
                      </div>
                      <button
                        onClick={() => {
                          const priceInput = document.getElementById(`pdf-price-${request.requestId}`);
                          handleSetPDFPrice(request.requestId, priceInput.value);
                        }}
                        className="bg-green-500 text-white px-6 py-2 rounded font-semibold hover:bg-green-600"
                      >
                        Set Price & Submit
                      </button>
                    </div>
                  ) : (
                    <div className="bg-green-50 border border-green-200 rounded p-3">
                      <p className="text-green-800 font-semibold">
                        ✓ Price Set: ₹{request.price} (Total: ₹{(request.price * request.qty).toFixed(2)})
                      </p>
                    </div>
                  )}

                  <div className="mt-4 flex justify-end">
                    <button
                      onClick={() => handleDeletePdfRequest(request._id)}
                      className="bg-red-500 text-white px-4 py-2 rounded font-semibold hover:bg-red-600"
                    >
                      Delete Request
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Subjects Tab */}
      {tab === 'subjects' && (
        <div>
          {/* Add New Subject */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-xl font-bold mb-4">Add New Subject</h2>
            <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
              <input
                type="text"
                placeholder="Title"
                value={newSubject.title}
                onChange={(e) => setNewSubject({ ...newSubject, title: e.target.value })}
                className="border rounded px-3 py-2"
              />
              <input
                type="text"
                placeholder="Code"
                value={newSubject.code}
                onChange={(e) => setNewSubject({ ...newSubject, code: e.target.value })}
                className="border rounded px-3 py-2"
              />
              <select
                value={newSubject.year}
                onChange={(e) => setNewSubject({ ...newSubject, year: e.target.value })}
                className="border rounded px-3 py-2"
              >
                <option value="1">Year 1</option>
                <option value="2">Year 2</option>
                <option value="3">Year 3</option>
                <option value="4">Year 4</option>
              </select>
              <select
                value={newSubject.sem}
                onChange={(e) => setNewSubject({ ...newSubject, sem: e.target.value })}
                className="border rounded px-3 py-2"
              >
                <option value="1">Sem 1</option>
                <option value="2">Sem 2</option>
                <option value="3">Sem 3</option>
                <option value="4">Sem 4</option>
                <option value="5">Sem 5</option>
                <option value="6">Sem 6</option>
                <option value="7">Sem 7</option>
                <option value="8">Sem 8</option>
              </select>
              <input
                type="number"
                placeholder="Single-side price"
                value={newSubject.singleSidePrice}
                onChange={(e) => setNewSubject({ ...newSubject, singleSidePrice: e.target.value })}
                className="border rounded px-3 py-2"
              />
              <input
                type="number"
                placeholder="Double-side price"
                value={newSubject.doubleSidePrice}
                onChange={(e) => setNewSubject({ ...newSubject, doubleSidePrice: e.target.value })}
                className="border rounded px-3 py-2"
              />
            </div>
            <button
              onClick={handleAddSubject}
              className="mt-4 bg-primary text-white px-6 py-2 rounded font-semibold hover:bg-secondary"
            >
              Add Subject
            </button>
          </div>

          {/* Subjects List */}
          {subjects.length === 0 ? (
            <p className="text-gray-600">No subjects yet.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {subjects.map((subject) => (
                <div
                  key={subject._id}
                  className="relative bg-white rounded-2xl shadow-[0_10px_30px_rgba(0,0,0,0.08)] border border-gray-200 overflow-hidden"
                >
                  {/* Accent bar */}
                  <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-emerald-500 to-emerald-700" />

                  <div className="p-5">
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 leading-snug">
                          {subject.title}
                        </h3>
                        <p className="text-xs font-medium text-gray-500 mt-1">{subject.code}</p>
                        <span className={`inline-flex items-center mt-2 px-3 py-1 rounded-full text-xs font-semibold border ${
                          subject.availability !== false
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            : 'bg-gray-100 text-gray-600 border-gray-300'
                        }`}>
                          {subject.availability !== false ? 'Available' : 'Unavailable'}
                        </span>
                      </div>

                      
                    </div>

                    {(subject.singleSidePrice || subject.doubleSidePrice) && (
                      <div className="mt-2 space-y-1 text-sm text-gray-700">
                        {subject.singleSidePrice && (
                          <div className="flex items-center gap-2">
                            <span className="text-xs uppercase tracking-wide text-gray-500">Single</span>
                            <span className="font-semibold">₹{subject.singleSidePrice}</span>
                          </div>
                        )}
                        {subject.doubleSidePrice && (
                          <div className="flex items-center gap-2">
                            <span className="text-xs uppercase tracking-wide text-gray-500">Double</span>
                            <span className="font-semibold">₹{subject.doubleSidePrice}</span>
                          </div>
                        )}
                      </div>
                    )}

                    <div className="flex items-center justify-between mt-4">
                      <div className="text-sm text-gray-600">
                        Year <span className="font-semibold">{subject.year}</span> · Sem{' '}
                        <span className="font-semibold">{subject.sem}</span>
                      </div>

                      <button
                        onClick={() => openEditSubject(subject)}
                        className="text-sm px-3 py-1.5 rounded-full bg-blue-500 text-white font-semibold hover:bg-blue-600 shadow"
                      >
                        Edit
                      </button>
                    </div>
                    <div className="flex items-center justify-end mt-2">
                      <button
                        onClick={() => handleDeleteSubject(subject._id)}
                        className="text-xs px-3 py-1 rounded-full bg-red-500 text-white font-semibold hover:bg-red-600 shadow"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Feedbacks Tab */}
      {tab === 'feedbacks' && (
        <div>
          {feedbacks.length === 0 ? (
            <p className="text-gray-600">No feedbacks yet.</p>
          ) : (
            <div className="space-y-4">
              {feedbacks.map((feedback) => (
                <div key={feedback._id} className="bg-white rounded-lg shadow-md p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <p className="text-sm text-gray-600">Name</p>
                      <p className="font-semibold">{feedback.name}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Department</p>
                      <p className="font-semibold">{feedback.department}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Email</p>
                      <p className="font-semibold">{feedback.email || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Rating</p>
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <span key={i} className={i < feedback.rating ? 'text-yellow-400' : 'text-gray-300'}>
                            ⭐
                          </span>
                        ))}
                        <span className="ml-2 font-semibold">{feedback.rating}/5</span>
                      </div>
                    </div>
                  </div>
                  <div className="mt-4">
                    <p className="text-sm text-gray-600 mb-2">Feedback</p>
                    <p className="bg-gray-50 p-4 rounded border text-gray-800">{feedback.feedback}</p>
                  </div>
                  <div className="mt-4">
                    <div className="flex items-center justify-between">
                      <p className="text-xs text-gray-500">
                        Submitted on {new Date(feedback.createdAt).toLocaleString()}
                      </p>
                      <button
                        onClick={() => handleDeleteFeedback(feedback._id)}
                        className="bg-red-500 text-white px-4 py-2 rounded text-sm font-semibold hover:bg-red-600 transition"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Pickup Points Tab */}
      {tab === 'pickup-points' && (
        <div>
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-xl font-bold mb-4">Add New Pickup Point</h2>
            <div className="flex gap-2">
              <input
                type="text"
                value={newPickupPointName}
                onChange={(e) => setNewPickupPointName(e.target.value)}
                placeholder="Enter pickup point name"
                className="flex-1 border rounded px-3 py-2"
                onKeyPress={(e) => e.key === 'Enter' && handleAddPickupPoint()}
              />
              <button
                onClick={handleAddPickupPoint}
                className="bg-primary text-white px-6 py-2 rounded font-semibold hover:bg-secondary transition"
              >
                Add
              </button>
            </div>
          </div>

          {pickupPoints.length === 0 ? (
            <p className="text-gray-600">No pickup points yet.</p>
          ) : (
            <div className="space-y-3">
              {pickupPoints.map((point) => (
                <div key={point._id} className="bg-white rounded-lg shadow-md p-4 flex justify-between items-center">
                  <div className="flex-1">
                    <p className="font-semibold text-lg">{point.name}</p>
                    <p className={`text-sm ${point.isActive ? 'text-green-600' : 'text-red-600'}`}>
                      Status: {point.isActive ? '✅ Active' : '❌ Inactive'}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleTogglePickupPoint(point._id)}
                      className={`px-4 py-2 rounded font-semibold text-white transition ${
                        point.isActive ? 'bg-orange-500 hover:bg-orange-600' : 'bg-green-500 hover:bg-green-600'
                      }`}
                    >
                      {point.isActive ? 'Deactivate' : 'Activate'}
                    </button>
                    <button
                      onClick={() => handleDeletePickupPoint(point._id)}
                      className="bg-red-500 text-white px-4 py-2 rounded font-semibold hover:bg-red-600 transition"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
    {editingSubjectId && editSubjectData && (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg shadow-2xl p-6 w-full max-w-md">
          <h3 className="text-xl font-bold mb-4">Edit Subject</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Title</label>
              <input
                type="text"
                value={editSubjectData.title}
                onChange={(e) => setEditSubjectData({ ...editSubjectData, title: e.target.value })}
                className="w-full border rounded px-3 py-2"
              />
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Single-Side Price (₹/page)</label>
              <input
                type="number"
                value={editSubjectData.singleSidePrice}
                onChange={(e) => setEditSubjectData({ ...editSubjectData, singleSidePrice: e.target.value })}
                className="w-full border rounded px-3 py-2"
                min="0"
                step="0.01"
                placeholder="Leave blank to use base price"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Double-Side Price (₹/page)</label>
              <input
                type="number"
                value={editSubjectData.doubleSidePrice}
                onChange={(e) => setEditSubjectData({ ...editSubjectData, doubleSidePrice: e.target.value })}
                className="w-full border rounded px-3 py-2"
                min="0"
                step="0.01"
                placeholder="Leave blank to use base price"
              />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-gray-700">Availability</span>
              <label className="inline-flex items-center cursor-pointer">
                <span className="mr-2 text-sm text-gray-600">Off</span>
                <input
                  type="checkbox"
                  className="sr-only"
                  checked={editSubjectData.availability}
                  onChange={(e) => setEditSubjectData({ ...editSubjectData, availability: e.target.checked })}
                />
                <div className={`w-11 h-6 flex items-center rounded-full p-1 ${editSubjectData.availability ? 'bg-emerald-500' : 'bg-gray-300'}`}>
                  <div className={`bg-white w-4 h-4 rounded-full shadow transform transition ${editSubjectData.availability ? 'translate-x-5' : 'translate-x-0'}`}></div>
                </div>
                <span className="ml-2 text-sm text-gray-600">On</span>
              </label>
            </div>
          </div>

          <div className="mt-6 flex justify-end gap-3">
            <button
              onClick={() => {
                setEditingSubjectId(null);
                setEditSubjectData(null);
              }}
              className="px-4 py-2 rounded bg-gray-200 text-gray-700 font-semibold hover:bg-gray-300"
            >
              Cancel
            </button>
            <button
              onClick={handleUpdateSubject}
              className="px-4 py-2 rounded bg-emerald-600 text-white font-semibold hover:bg-emerald-700"
            >
              Save
            </button>
          </div>
        </div>
      </div>
    )}
    <GlowAlert
      message={alertState.message}
      onClose={handleAlertOk}
      onCancel={alertState.onConfirm ? closeAlert : undefined}
      okText={alertState.onConfirm ? 'OK' : 'Close'}
      cancelText="Cancel"
    />
  </>
  );
};

export default Admin;
