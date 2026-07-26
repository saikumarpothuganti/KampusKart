import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import API from '../lib/api';

const SupplierDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [suppliersList, setSuppliersList] = useState([]);
  const [adminViewSupplierId, setAdminViewSupplierId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [pricingForm, setPricingForm] = useState({}); // { orderId: { itemId: cost } }
  const [editingOrders, setEditingOrders] = useState({}); // { orderId: true }
  const [activeTab, setActiveTab] = useState('pending'); // 'orders' or 'billing'
  const [supplierStats, setSupplierStats] = useState({ totalOrders: 0, singleSidedBooks: 0, doubleSidedBooks: 0, basicBooks: 0, standardBooks: 0, totalEarnings: 0 });

  // Resolver function: Unified logic for determining item.sideType
  const resolveSideType = (item) => {
    if (item.type === 'custom') {
      return item.printSides === 'double' ? 'double' : 'single';
    }
    if (item?.sideType && (item.sideType === 'single' || item.sideType === 'double')) {
      return item.sideType;
    }
    return Number(item?.sides) === 2 ? 'double' : 'single';
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'yellow';
      case 'accepted': return 'green';
      case 'printing': return 'blue';
      case 'shipped': return 'indigo';
      case 'delivered': return 'emerald';
      case 'cancelled': return 'red';
      default: return 'gray';
    }
  };

  useEffect(() => {
    if (!user || (!user.isSupplier && !user.isAdmin)) {
      navigate('/');
      return;
    }
    fetchData();
  }, [user]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const resOrders = await API.get('/orders/supplier');
      if (Array.isArray(resOrders.data)) {
        setOrders(resOrders.data);
      } else {
        setOrders(resOrders.data.orders || []);
        setSupplierStats(resOrders.data.supplierStats || { totalOrders: 0, singleSidedBooks: 0, doubleSidedBooks: 0, basicBooks: 0, standardBooks: 0, totalEarnings: 0 });
      }

      if (user.isAdmin) {
        const resSuppliers = await API.get('/auth/admin/suppliers');
        setSuppliersList(resSuppliers.data);
      }
    } catch (error) {
      console.error('Failed to fetch supplier data', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePriceChange = (orderId, itemId, value) => {
    setPricingForm(prev => ({
      ...prev,
      [orderId]: {
        ...(prev[orderId] || {}),
        [itemId]: value
      }
    }));
  };

  const handleFixPrices = async (orderId) => {
    const orderForm = pricingForm[orderId];
    if (!orderForm) {
      alert('Please enter prices for items before submitting.');
      return;
    }
    
    const itemCosts = Object.keys(orderForm).map(itemId => ({
      itemId,
      cost: Number(orderForm[itemId])
    }));

    if (itemCosts.some(ic => isNaN(ic.cost) || ic.cost < 0)) {
      alert('Please enter valid positive numbers for all prices.');
      return;
    }

    try {
      await API.put(`/orders/${orderId}/supplier-prices`, { itemCosts });
      alert('Prices fixed successfully!');
      setEditingOrders(prev => ({ ...prev, [orderId]: false }));
      fetchData();
    } catch (error) {
      console.error('Error fixing prices:', error);
      alert(error.response?.data?.error || 'Failed to fix prices');
    }
  };

  const getQualityBg = (quality) => {
    return quality === 'basic' ? 'bg-gray-200 border-gray-400' : 'bg-[#fff5e1] border-[#f2d59f]';
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-paper text-ink">
        <div className="text-xl font-bold">Loading Supplier Dashboard...</div>
      </div>
    );
  }

  // Admin View: Supplier Selection Grid
  if (user.isAdmin && !adminViewSupplierId) {
    return (
      <div className="min-h-screen bg-paper pb-20">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <h1 className="text-4xl md:text-5xl font-black text-ink mb-2">Suppliers Overview</h1>
          <p className="text-lg text-ink/70 mb-10">Select a supplier to view their dashboard.</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {suppliersList.map(supplier => {
              const supplierOrders = orders.filter(o => o.supplier?._id === supplier._id);
              const pending = supplierOrders.filter(o => o.supplierStatus === 'pending' || !o.supplierStatus).length;
              const priced = supplierOrders.filter(o => o.supplierStatus === 'priced').length;
              
              return (
                <div key={supplier._id} onClick={() => setAdminViewSupplierId(supplier._id)} className="bg-white p-6 rounded-xl shadow-md border border-gray-200 cursor-pointer hover:shadow-lg transition-shadow realistic-paper-card group relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-2 h-full bg-primary transform origin-left scale-y-0 group-hover:scale-y-100 transition-transform"></div>
                  <h3 className="text-xl font-bold text-gray-900 mb-1">{supplier.name}</h3>
                  <p className="text-sm text-gray-500 mb-4">{supplier.email}</p>
                  
                  <div className="flex justify-between items-center bg-gray-50 p-3 rounded-lg border mb-2">
                    <span className="text-sm font-semibold text-gray-600">Total Orders</span>
                    <span className="text-lg font-bold">{supplierOrders.length}</span>
                  </div>
                  <div className="flex justify-between gap-2">
                    <div className="flex-1 bg-orange-50 p-2 rounded text-center border border-orange-100">
                      <p className="text-xs text-orange-600 font-bold uppercase">Pending</p>
                      <p className="text-lg font-black text-orange-700">{pending}</p>
                    </div>
                    <div className="flex-1 bg-green-50 p-2 rounded text-center border border-green-100">
                      <p className="text-xs text-green-600 font-bold uppercase">Priced</p>
                      <p className="text-lg font-black text-green-700">{priced}</p>
                    </div>
                  </div>
                </div>
              );
            })}
            
            {suppliersList.length === 0 && (
              <div className="col-span-full p-8 text-center text-gray-500 border-2 border-dashed border-gray-300 rounded-xl bg-gray-50">
                No suppliers found. Assign supplier roles in the Admin Dashboard Accounts tab.
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // View specific to the logged-in supplier OR the admin's selected supplier
  const targetSupplierId = user.isAdmin ? adminViewSupplierId : user._id;
  const targetSupplierData = user.isAdmin ? suppliersList.find(s => s._id === adminViewSupplierId) : user;
  
  // If user is not admin, the backend already filtered the orders perfectly for them.
  // If user is admin, we filter by the selected supplier ID.
  const targetOrders = user.isAdmin ? orders.filter(o => {
    if (!o.supplier) return false;
    return o.supplier._id === targetSupplierId || o.supplier === targetSupplierId;
  }) : orders;

  const pendingOrders = targetOrders.filter(o => o.supplierStatus === 'pending' || !o.supplierStatus || editingOrders[o.orderId]);
  const pricedOrders = targetOrders.filter(o => o.supplierStatus === 'priced' && !editingOrders[o.orderId]);

  const renderOrderList = (list, isPending) => {
    if (list.length === 0) {
      return <p className="text-gray-500 italic">No orders found.</p>;
    }

    return (
      <div className="space-y-8">
        {list.map(order => {
          const formState = pricingForm[order.orderId] || {};
          let orderTotalCost = 0;

          return (
            <div key={order.orderId} className="bg-white p-6 rounded-xl shadow border border-gray-200">
              <div className="flex justify-between items-start mb-4 border-b border-gray-200 pb-4">
                <div>
                  <div className="flex items-center gap-3">
                    <h3 className="text-xl font-bold text-primary">Order #{order.orderId}</h3>
                    
                    {/* Allow Edit button for Admin */}
                    {!isPending && user.isAdmin && !order.allowSupplierEdit && (
                      <button
                        onClick={async () => {
                          try {
                            await API.put(`/orders/${order.orderId}/allow-edit-prices`);
                            // Update local state to reflect the change immediately
                            setOrders(prev => prev.map(o => o.orderId === order.orderId ? { ...o, allowSupplierEdit: true } : o));
                            alert('Supplier can now edit the prices for this order.');
                          } catch (error) {
                            console.error('Failed to allow edit:', error);
                            alert('Failed to allow edit');
                          }
                        }}
                        className="text-xs bg-orange-100 text-orange-700 border border-orange-300 font-bold px-3 py-1 rounded shadow-sm hover:bg-orange-200 transition-colors"
                      >
                        Unlock for Supplier
                      </button>
                    )}

                    {/* Pencil Icon for Supplier (if allowed) or Admin (if unlocked) */}
                    {!isPending && order.allowSupplierEdit && (
                      <button 
                        onClick={() => {
                          // Pre-fill pricing form with existing supplierCost
                          const prefill = {};
                          order.items.forEach(item => { prefill[item._id] = item.supplierCost || ''; });
                          setPricingForm(prev => ({ ...prev, [order.orderId]: prefill }));
                          setEditingOrders(prev => ({ ...prev, [order.orderId]: true }));
                        }}
                        className="text-gray-400 hover:text-blue-500 transition-colors bg-gray-100 hover:bg-blue-50 p-2 rounded-full shadow-sm"
                        title="Edit Prices"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>
                      </button>
                    )}
                    
                    {/* Delete Order button for Admin */}
                    {user.isAdmin && (
                      <button
                        onClick={async () => {
                          if (window.confirm('Are you sure you want to delete this order?')) {
                            try {
                              await API.delete(`/orders/${order.orderId}/hard`);
                              setOrders(prev => prev.filter(o => o.orderId !== order.orderId));
                            } catch (error) {
                              console.error('Failed to delete order:', error);
                              alert('Failed to delete order');
                            }
                          }
                        }}
                        className="text-xs bg-red-100 text-red-700 border border-red-300 font-bold px-3 py-1 rounded shadow-sm hover:bg-red-200 transition-colors ml-2"
                      >
                        🗑️ Delete
                      </button>
                    )}
                  </div>
                  <p className="text-sm text-gray-500 mt-1">{new Date(order.createdAt).toLocaleString()}</p>
                </div>
                <div className="text-right">
                  <span className={`px-3 py-1 rounded text-white font-bold text-sm bg-${getStatusColor(order.status)}-500`}>
                    {order.status.toUpperCase()}
                  </span>
                </div>
              </div>

              <div className="space-y-4">
                {order.items.map((item) => {
                  const currentCost = isPending ? (formState[item._id] || '') : (item.supplierCost || 0);
                  const rowTotal = isPending ? (Number(currentCost) * item.qty || 0) : ((item.supplierCost || 0) * item.qty);
                  orderTotalCost += rowTotal;
                  
                  return (
                    <div key={item._id} className={`flex flex-col md:flex-row justify-between items-center rounded border px-4 py-3 ${getQualityBg(item.quality)}`}>
                      <div className="flex-1 mb-2 md:mb-0">
                        <p className="font-bold text-gray-900">{item.title || 'Untitled'} {item.code ? `(${item.code})` : ''}</p>
                        <p className="text-sm text-gray-800 mt-1">
                          Qty: <span className="font-bold">{item.qty} Books</span> · 
                          <span className="font-bold capitalize ml-1">{resolveSideType(item)} Sided</span> · 
                          Quality: <span className="capitalize font-bold">{item.quality || 'standard'}</span>
                        </p>
                        
                        {item.type === 'custom' && item.pdfUrl && (
                          <div className="flex gap-2 mt-2">
                            <a href={item.pdfUrl} target="_blank" rel="noreferrer" className="text-xs bg-blue-500 text-white px-3 py-1 rounded shadow hover:bg-blue-600 transition-colors">View PDF</a>
                            <a href={item.pdfUrl} download className="text-xs bg-blue-600 text-white px-3 py-1 rounded shadow hover:bg-blue-700 transition-colors">Download</a>
                          </div>
                        )}
                      </div>

                      <div className="flex items-center gap-6 w-full md:w-auto mt-4 md:mt-0">
                        {isPending ? (
                          <div className="flex flex-col">
                            <label className="text-xs font-bold text-gray-600 mb-1">Enter Price (Single Item)</label>
                            <input
                              type="number"
                              min="0"
                              step="0.1"
                              className="w-24 p-2 border border-gray-300 rounded focus:border-primary focus:ring-0"
                              value={currentCost}
                              onChange={(e) => handlePriceChange(order.orderId, item._id, e.target.value)}
                              placeholder="₹0.00"
                            />
                          </div>
                        ) : (
                          <div className="text-right">
                            <p className="text-xs text-gray-500 font-bold uppercase">Single Item Cost</p>
                            <p className="font-semibold">₹{item.supplierCost?.toFixed(2) || '0.00'}</p>
                          </div>
                        )}
                        
                        <div className="text-right min-w-[80px]">
                          <p className="text-xs text-gray-500 font-bold uppercase">Total</p>
                          <p className="font-bold text-lg text-primary">₹{rowTotal.toFixed(2)}</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="mt-6 pt-4 border-t border-gray-200 flex justify-between items-center bg-gray-50 p-4 rounded-lg">
                <div>
                  <p className="text-sm text-gray-500 font-bold uppercase">Order Total Cost</p>
                  <p className="text-2xl font-black text-primary">₹{orderTotalCost.toFixed(2)}</p>
                </div>
                {isPending && (
                  <div className="flex gap-3">
                    {editingOrders[order.orderId] && (
                      <button
                        onClick={() => setEditingOrders(prev => ({ ...prev, [order.orderId]: false }))}
                        className="bg-gray-300 text-gray-800 px-6 py-3 rounded-xl font-bold shadow hover:bg-gray-400 transition-all"
                      >
                        Cancel Edit
                      </button>
                    )}
                    <button
                      onClick={() => handleFixPrices(order.orderId)}
                      className="bg-primary text-white px-8 py-3 rounded-xl font-bold shadow-lg hover:bg-primary/90 transition-all transform hover:scale-105"
                    >
                      {editingOrders[order.orderId] ? 'Save Updated Prices' : 'Fix Prices'}
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-paper pb-20">
      <div className="max-w-6xl mx-auto px-4 py-8">
        
        {user.isAdmin && (
          <button 
            onClick={() => setAdminViewSupplierId(null)}
            className="mb-6 flex items-center gap-2 text-gray-600 hover:text-primary transition-colors font-bold"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
            Back to Suppliers
          </button>
        )}

        <h1 className="text-4xl md:text-5xl font-black text-ink mb-2">
          {user.isAdmin ? `${targetSupplierData?.name}'s Dashboard` : 'Supplier Dashboard'}
        </h1>
        <p className="text-lg text-ink/70 mb-8">Manage printing orders and specify pricing.</p>

        <div className="flex gap-4 mb-8 border-b border-gray-300 pb-2 overflow-x-auto">
          <button
            onClick={() => setActiveTab('pending')}
            className={`px-6 py-2 font-bold text-lg rounded-t-lg transition-colors whitespace-nowrap ${activeTab === 'pending' ? 'bg-primary text-white shadow-md' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
          >
            📋 Pending Pricing ({pendingOrders.length})
          </button>
          <button
            onClick={() => setActiveTab('priced')}
            className={`px-6 py-2 font-bold text-lg rounded-t-lg transition-colors whitespace-nowrap ${activeTab === 'priced' ? 'bg-primary text-white shadow-md' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
          >
            ✅ Priced Orders ({pricedOrders.length})
          </button>
          <button
            onClick={() => setActiveTab('billing')}
            className={`px-6 py-2 font-bold text-lg rounded-t-lg transition-colors whitespace-nowrap ${activeTab === 'billing' ? 'bg-primary text-white shadow-md' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
          >
            💰 Overall Bill
          </button>
        </div>

        {(activeTab === 'pending' || activeTab === 'priced') && (
          <div className="space-y-12">
          {/* Supplier Pricing Summary - Always at the top */}
          <section>
            {(() => {
              let globalSingleBooks = 0;
              let globalDoubleBooks = 0;
              let globalTotalBooks = 0;
              let globalSinglePages = 0;
              let globalDoublePages = 0;
              let globalGrandTotal = 0;
              const singleBooksList = [];
              const doubleBooksList = [];

              pricedOrders.forEach((order) => {
                const safeItems = Array.isArray(order.items) ? order.items : [];
                safeItems.forEach((item) => {
                  const type = resolveSideType(item);
                  const pages = item.sides || item.pages || 0;
                  const qty = item.qty || 0;
                  const cost = item.supplierCost || 0;
                  
                  const itemTotal = cost * qty;

                  if (type === 'double') {
                    globalDoubleBooks += qty;
                    globalDoublePages += Math.ceil(pages / 2) * qty;
                    doubleBooksList.push({ title: item.title || item.code || 'Untitled', qty, pages, cost, total: itemTotal });
                  } else {
                    globalSingleBooks += qty;
                    globalSinglePages += pages * qty;
                    singleBooksList.push({ title: item.title || item.code || 'Untitled', qty, pages, cost, total: itemTotal });
                  }
                  globalTotalBooks += qty;
                  globalGrandTotal += itemTotal;
                });
              });

              return (
                <div className="bg-gradient-to-br from-green-50 to-emerald-100 border-2 border-green-300 rounded-xl p-6 shadow-lg">
                  <h2 className="text-2xl font-bold text-green-900 mb-4 flex items-center gap-3">
                    <span>📊</span> Supplier Pricing Summary
                  </h2>
                  <p className="text-sm text-green-700 mb-6 font-medium">This summary automatically calculates your expected payout based ONLY on orders in the "Priced Orders" queue.</p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Single-side Books */}
                    <div className="bg-white rounded-lg p-4 shadow">
                      <h3 className="text-lg font-bold text-gray-800 mb-3 border-b-2 border-blue-300 pb-2">
                        📘 Single-side Books ({globalSingleBooks})
                      </h3>
                      {singleBooksList.length === 0 ? (
                        <p className="text-gray-500 italic text-sm">No priced single-side books</p>
                      ) : (
                        <div className="space-y-2 max-h-64 overflow-y-auto">
                          {singleBooksList.map((book, idx) => (
                            <div key={idx} className="text-sm border-b border-gray-200 pb-2">
                              <div className="flex justify-between font-semibold text-gray-900">
                                <span>{book.title}</span>
                                <span className="text-blue-600">₹{book.total.toFixed(2)}</span>
                              </div>
                              <div className="text-xs text-gray-600">
                                {book.pages}p × {book.qty}qty × ₹{book.cost.toFixed(2)} cost
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
                        <p className="text-gray-500 italic text-sm">No priced double-side books</p>
                      ) : (
                        <div className="space-y-2 max-h-64 overflow-y-auto">
                          {doubleBooksList.map((book, idx) => (
                            <div key={idx} className="text-sm border-b border-gray-200 pb-2">
                              <div className="flex justify-between font-semibold text-gray-900">
                                <span>{book.title}</span>
                                <span className="text-green-600">₹{book.total.toFixed(2)}</span>
                              </div>
                              <div className="text-xs text-gray-600">
                                {book.pages}p × {book.qty}qty × ₹{book.cost.toFixed(2)} cost
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
                  <div className="mt-6 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-lg p-4 text-white shadow-lg">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                      <div>
                        <p className="text-sm opacity-90">Total Single Books</p>
                        <p className="text-2xl font-bold">{globalSingleBooks}</p>
                      </div>
                      <div>
                        <p className="text-sm opacity-90">Total Double Books</p>
                        <p className="text-2xl font-bold">{globalDoubleBooks}</p>
                      </div>
                      <div>
                        <p className="text-sm opacity-90">Total Books</p>
                        <p className="text-2xl font-bold">{globalTotalBooks}</p>
                      </div>
                      <div>
                        <p className="text-sm opacity-90">Expected Payout</p>
                        <p className="text-3xl font-bold">₹{globalGrandTotal.toFixed(2)}</p>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })()}
          </section>

          {activeTab === 'pending' && (
            <section>
              <div className="flex items-center gap-3 mb-6">
                <h2 className="text-2xl font-bold text-[#18382A]">Pending Pricing</h2>
                <span className="bg-orange-100 text-orange-800 text-xs font-bold px-3 py-1 rounded-full">
                  {pendingOrders.length} Orders
                </span>
              </div>
              {renderOrderList(pendingOrders, true)}
            </section>
          )}

          {activeTab === 'priced' && (
            <section>
              <div className="flex items-center gap-3 mb-6">
                <h2 className="text-2xl font-bold text-[#18382A]">Priced Orders</h2>
                <span className="bg-green-100 text-green-800 text-xs font-bold px-3 py-1 rounded-full">
                  {pricedOrders.length} Orders
                </span>
              </div>
              {renderOrderList(pricedOrders, false)}
            </section>
          )}
        </div>
        )}

        {activeTab === 'billing' && (() => {
          let totalOrders = supplierStats.totalOrders;
          let singleBooks = supplierStats.singleSidedBooks;
          let doubleBooks = supplierStats.doubleSidedBooks;
          let basicBooks = supplierStats.basicBooks;
          let standardBooks = supplierStats.standardBooks;
          let grandTotal = supplierStats.totalEarnings;

          return (
            <div className="bg-white rounded-xl p-8 shadow-lg border border-gray-200">
              <h2 className="text-3xl font-black text-gray-800 mb-6 border-b pb-4">💰 Overall Billing Summary</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                <div className="bg-blue-50 p-6 rounded-xl border border-blue-100 shadow-sm">
                  <p className="text-blue-600 font-bold mb-2 uppercase tracking-wide text-sm">Total Priced Orders</p>
                  <p className="text-5xl font-black text-blue-900">{totalOrders}</p>
                </div>
                
                <div className="bg-green-50 p-6 rounded-xl border border-green-100 shadow-sm">
                  <p className="text-green-600 font-bold mb-2 uppercase tracking-wide text-sm">Total Books Processed</p>
                  <p className="text-5xl font-black text-green-900">{singleBooks + doubleBooks}</p>
                  <div className="mt-4 flex justify-between text-sm font-semibold text-green-800 bg-green-100 p-2 rounded">
                    <span>Single Sided: <b>{singleBooks}</b></span>
                    <span>Double Sided: <b>{doubleBooks}</b></span>
                  </div>
                </div>

                <div className="bg-purple-50 p-6 rounded-xl border border-purple-100 shadow-sm">
                  <p className="text-purple-600 font-bold mb-2 uppercase tracking-wide text-sm">Total Expected Payout</p>
                  <p className="text-5xl font-black text-purple-900">₹{grandTotal.toFixed(2)}</p>
                </div>

                <div className="bg-orange-50 p-6 rounded-xl border border-orange-100 shadow-sm">
                  <p className="text-orange-600 font-bold mb-2 uppercase tracking-wide text-sm">Book Quality Split</p>
                  <div className="flex flex-col gap-3 mt-4 text-orange-900 text-lg">
                    <div className="flex justify-between border-b border-orange-200 pb-2">
                      <span>Basic Quality:</span>
                      <span className="font-bold bg-orange-200 px-2 rounded">{basicBooks}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Standard Quality:</span>
                      <span className="font-bold bg-orange-200 px-2 rounded">{standardBooks}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })()}
      </div>
    </div>
  );
};

export default SupplierDashboard;
