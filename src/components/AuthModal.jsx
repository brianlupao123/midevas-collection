import React, { useState, useEffect } from 'react';
import { 
  X, 
  User, 
  Phone, 
  MapPin, 
  Mail, 
  GraduationCap, 
  ShoppingBag, 
  Check, 
  LogOut, 
  Sparkles, 
  Clock, 
  MessageCircle,
  Truck
} from 'lucide-react';
import { getCurrentCustomer, saveCustomerProfile, logoutCustomer, getCustomerPastOrders } from '../utils/customerAuth';
import { notifySuccess, notifyInfo } from '../utils/notifications';
import { STORE_CONFIG } from '../data/products';

export default function AuthModal({ isOpen, onClose }) {
  const [customer, setCustomer] = useState(() => getCurrentCustomer());
  const [isEditing, setIsEditing] = useState(false);

  // Form states
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [hostel, setHostel] = useState('');
  const [email, setEmail] = useState('');
  const [campus, setCampus] = useState('Main Campus');

  useEffect(() => {
    if (isOpen) {
      const curr = getCurrentCustomer();
      setCustomer(curr);
      if (curr) {
        setName(curr.name || '');
        setPhone(curr.phone || '');
        setHostel(curr.hostel || '');
        setEmail(curr.email || '');
        setCampus(curr.campus || 'Main Campus');
        setIsEditing(false);
      } else {
        setIsEditing(true);
      }
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const pastOrders = customer ? getCustomerPastOrders(customer) : [];

  const handleSave = (e) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim() || !hostel.trim()) {
      alert('Please fill in your Name, WhatsApp Phone, and Hostel/Room.');
      return;
    }

    const saved = saveCustomerProfile({
      name,
      phone,
      hostel,
      email,
      campus
    });

    setCustomer(saved);
    setIsEditing(false);
    notifySuccess(`Welcome, ${saved.name}! 🎓 Your hostel delivery address is saved.`);
  };

  const handleLogout = () => {
    logoutCustomer();
    setCustomer(null);
    setName('');
    setPhone('');
    setHostel('');
    setEmail('');
    setIsEditing(true);
    notifyInfo('You have signed out.');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div 
        onClick={onClose}
        className="fixed inset-0 bg-slate-900/70 backdrop-blur-xs transition-opacity"
      />

      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 dark:text-white rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden transform transition-all">
          
          {/* Header */}
          <div className="relative bg-gradient-to-r from-amber-600 to-rose-600 text-white p-6 sm:p-7">
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 rounded-full bg-black/20 hover:bg-black/30 text-white transition"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-xs flex items-center justify-center border border-white/30 text-white shadow-inner">
                <GraduationCap className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[10px] uppercase font-black tracking-widest bg-white/20 px-2 py-0.5 rounded-full inline-block mb-1">
                  Comrade Portal
                </span>
                <h3 className="text-xl font-black tracking-tight leading-tight">
                  {customer && !isEditing ? `Hi, ${customer.name} 👋` : 'Comrade Sign In & Delivery Pass'}
                </h3>
                <p className="text-xs text-amber-100">
                  Save your hostel room for 1-click orders and fast campus deliveries
                </p>
              </div>
            </div>
          </div>

          {/* Modal Body */}
          <div className="p-6 sm:p-7 space-y-6">
            
            {customer && !isEditing ? (
              /* Signed-in View */
              <div className="space-y-6">
                {/* Profile Card */}
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                      Saved Delivery Details
                    </span>
                    <button
                      onClick={() => setIsEditing(true)}
                      className="text-xs font-bold text-amber-600 dark:text-amber-400 hover:underline"
                    >
                      Edit Info
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4 text-slate-400" />
                      <span className="font-semibold text-slate-800 dark:text-slate-200">{customer.name}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-emerald-500" />
                      <span className="font-semibold text-slate-800 dark:text-slate-200">{customer.phone}</span>
                    </div>

                    <div className="flex items-center gap-2 sm:col-span-2">
                      <MapPin className="w-4 h-4 text-rose-500 flex-shrink-0" />
                      <span className="font-semibold text-slate-800 dark:text-slate-200">
                        {customer.hostel} ({customer.campus || 'Main Campus'})
                      </span>
                    </div>

                    {customer.email && (
                      <div className="flex items-center gap-2 sm:col-span-2">
                        <Mail className="w-4 h-4 text-slate-400" />
                        <span className="text-slate-600 dark:text-slate-400">{customer.email}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Comrade Perks */}
                <div className="grid grid-cols-2 gap-2.5">
                  <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/40 text-left">
                    <div className="flex items-center gap-1.5 text-xs font-black text-amber-900 dark:text-amber-300">
                      <Truck className="w-4 h-4 text-amber-600" />
                      <span>Hostel Delivery</span>
                    </div>
                    <p className="text-[11px] text-amber-700 dark:text-amber-400 mt-1">
                      Direct drop-off to your room door.
                    </p>
                  </div>

                  <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/40 text-left">
                    <div className="flex items-center gap-1.5 text-xs font-black text-emerald-900 dark:text-emerald-300">
                      <Sparkles className="w-4 h-4 text-emerald-600" />
                      <span>Comrade Deals</span>
                    </div>
                    <p className="text-[11px] text-emerald-700 dark:text-emerald-400 mt-1">
                      Always pay the comrade price.
                    </p>
                  </div>
                </div>

                {/* Past Orders Track Record */}
                <div>
                  <h4 className="text-xs font-black uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2 flex items-center justify-between">
                    <span>Recent Orders &amp; Quotes</span>
                    <span className="text-amber-600 dark:text-amber-400">{pastOrders.length} found</span>
                  </h4>

                  {pastOrders.length === 0 ? (
                    <div className="text-center py-6 border border-dashed border-slate-200 dark:border-slate-800 rounded-2xl">
                      <ShoppingBag className="w-8 h-8 mx-auto text-slate-300 dark:text-slate-600 mb-1" />
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        No orders recorded yet. Add items to quote to order!
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                      {pastOrders.map((ord) => (
                        <div 
                          key={ord.id}
                          className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs flex items-center justify-between"
                        >
                          <div>
                            <div className="font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                              <span>${ord.totalUsd?.toFixed(2)}</span>
                              <span className="text-[10px] font-semibold text-slate-400">
                                ({ord.items?.length || 0} items)
                              </span>
                            </div>
                            <span className="text-[10px] text-slate-500 dark:text-slate-400">
                              {new Date(ord.createdAt).toLocaleDateString()} • {ord.status || 'Pending'}
                            </span>
                          </div>

                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            ord.status === 'Completed' || ord.status === 'Paid'
                              ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                              : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                          }`}>
                            {ord.status || 'Pending'}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="flex items-center justify-between pt-2 border-t border-slate-200 dark:border-slate-800">
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-1.5 text-xs font-semibold text-rose-600 dark:text-rose-400 hover:underline"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Sign Out</span>
                  </button>

                  <a
                    href={`https://wa.me/${STORE_CONFIG.whatsappNumber}?text=${encodeURIComponent(`Hello Mideva! This is ${customer.name} from ${customer.hostel}.`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-md transition"
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                    <span>WhatsApp Mideva</span>
                  </a>
                </div>
              </div>
            ) : (
              /* Registration / Sign-in Form */
              <form onSubmit={handleSave} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Your Full Name *
                  </label>
                  <div className="relative">
                    <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="text"
                      required
                      placeholder="e.g. Tariro Moyo / Kelvin K."
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full pl-10 pr-3.5 py-2.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 dark:text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    WhatsApp Phone Number *
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-500" />
                    <input
                      type="tel"
                      required
                      placeholder="e.g. 0774 809 479 or +254 748 094 795"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full pl-10 pr-3.5 py-2.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 dark:text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Campus Hostel / Hall &amp; Room Number *
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-rose-500" />
                    <input
                      type="text"
                      required
                      placeholder="e.g. Hall 4 Room 204 / Riverside Court B3"
                      value={hostel}
                      onChange={(e) => setHostel(e.target.value)}
                      className="w-full pl-10 pr-3.5 py-2.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 dark:text-white"
                    />
                  </div>
                  <p className="text-[10px] text-slate-400 mt-1">
                    Mideva uses this for direct, confidential hostel drop-offs.
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Campus / Area
                  </label>
                  <select
                    value={campus}
                    onChange={(e) => setCampus(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 dark:text-white"
                  >
                    <option value="Main Campus">Main Campus Hostels</option>
                    <option value="Off-Campus Hostels">Off-Campus Student Residences</option>
                    <option value="Town Campus">Town / City Campus</option>
                    <option value="Medical Campus">Medical / Health Sciences Campus</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Email Address (Optional)
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="email"
                      placeholder="e.g. comrade@student.ac.ke"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-10 pr-3.5 py-2.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 dark:text-white"
                    />
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-extrabold text-xs shadow-lg transition flex items-center justify-center gap-2"
                  >
                    <Check className="w-4 h-4" />
                    <span>Save &amp; Activate Comrade Pass</span>
                  </button>

                  {customer && (
                    <button
                      type="button"
                      onClick={() => setIsEditing(false)}
                      className="w-full mt-2 py-2 text-xs text-slate-500 hover:underline"
                    >
                      Cancel Edit
                    </button>
                  )}
                </div>
              </form>
            )}

          </div>

        </div>
      </div>
    </div>
  );
}
