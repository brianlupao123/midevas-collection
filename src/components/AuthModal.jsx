import React, { useState, useEffect, useMemo } from 'react';
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
  MessageCircle,
  Truck,
  Camera,
  Upload,
  RefreshCw,
  ShieldCheck,
  Image as ImageIcon
} from 'lucide-react';
import { 
  getCurrentCustomer, 
  saveCustomerProfile, 
  logoutCustomer, 
  getCustomerPastOrders,
  resolveEmailAvatar 
} from '../utils/customerAuth';
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
  const [customAvatar, setCustomAvatar] = useState('');
  const [avatarPreviewError, setAvatarPreviewError] = useState(false);

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
        setCustomAvatar(curr.avatar || '');
        setIsEditing(false);
      } else {
        setIsEditing(true);
      }
    }
  }, [isOpen]);

  // Compute live avatar preview
  const liveAvatarUrl = useMemo(() => {
    if (customAvatar) return customAvatar;
    return resolveEmailAvatar(email, name);
  }, [customAvatar, email, name]);

  useEffect(() => {
    setAvatarPreviewError(false);
  }, [liveAvatarUrl]);

  if (!isOpen) return null;

  const pastOrders = customer ? getCustomerPastOrders(customer) : [];

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      alert('Photo must be less than 2MB.');
      return;
    }
    const reader = new FileReader();
    reader.onload = (event) => {
      setCustomAvatar(event.target.result);
      setAvatarPreviewError(false);
    };
    reader.readAsDataURL(file);
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim() || !hostel.trim()) {
      alert('Please fill in your Name, WhatsApp Phone, and Hostel/Room.');
      return;
    }

    const avatarToSave = customAvatar || resolveEmailAvatar(email, name);

    const saved = saveCustomerProfile({
      name,
      phone,
      hostel,
      email,
      campus,
      avatar: avatarToSave
    });

    setCustomer(saved);
    setIsEditing(false);
    notifySuccess(`Welcome, ${saved.name}! 🎓 Your account is active and your photo is displayed in the header.`);
  };

  const handleLogout = () => {
    logoutCustomer();
    setCustomer(null);
    setName('');
    setPhone('');
    setHostel('');
    setEmail('');
    setCustomAvatar('');
    setIsEditing(true);
    notifyInfo('Signed out. You are now browsing as a guest client.');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto animate-fade-in">
      {/* Backdrop */}
      <div 
        onClick={onClose}
        className="fixed inset-0 bg-slate-900/70 backdrop-blur-xs transition-opacity"
      />

      <div className="flex min-h-full items-center justify-center p-3 sm:p-4">
        <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 dark:text-white rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden transform transition-all">
          
          {/* Header */}
          <div className="relative bg-gradient-to-r from-amber-600 via-amber-500 to-rose-600 text-white p-5 sm:p-6">
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 rounded-full bg-black/20 hover:bg-black/30 text-white transition cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-xs flex items-center justify-center border border-white/30 text-white shadow-inner flex-shrink-0">
                <GraduationCap className="w-6 h-6" />
              </div>
              <div className="min-w-0 flex-1">
                <span className="text-[10px] uppercase font-black tracking-widest bg-white/20 px-2 py-0.5 rounded-full inline-block mb-1">
                  Client &amp; Comrade Account
                </span>
                <h3 className="text-lg sm:text-xl font-black tracking-tight leading-tight truncate">
                  {customer && !isEditing ? `Welcome, ${customer.name} 👋` : 'Create Account / Sign In'}
                </h3>
                <p className="text-xs text-amber-100">
                  Your email photo replaces the header profile icon automatically
                </p>
              </div>
            </div>
          </div>

          {/* Modal Body */}
          <div className="p-5 sm:p-6 space-y-5">
            
            {customer && !isEditing ? (
              /* Signed-in View */
              <div className="space-y-5">
                {/* Profile Identity Card */}
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 space-y-3">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-700">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-amber-500 bg-slate-200 dark:bg-slate-700 flex items-center justify-center shadow-xs flex-shrink-0">
                        {customer.avatar ? (
                          <img
                            src={customer.avatar}
                            alt={customer.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <span className="text-base font-black text-amber-600">
                            {customer.name?.charAt(0) || 'C'}
                          </span>
                        )}
                        <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-white dark:border-slate-900" />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <h4 className="font-extrabold text-sm text-slate-900 dark:text-white truncate">
                            {customer.name}
                          </h4>
                          <span className="text-[9px] font-black uppercase px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300 dark:bg-emerald-950 dark:text-emerald-300">
                            Comrade
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                          {customer.email || 'Email photo active'}
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={() => setIsEditing(true)}
                      className="text-xs font-bold text-amber-600 dark:text-amber-400 hover:underline flex-shrink-0"
                    >
                      Edit Info
                    </button>
                  </div>

                  {/* Delivery Location & Phone */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs pt-1">
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                      <span className="font-semibold text-slate-800 dark:text-slate-200">{customer.phone}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-rose-500 flex-shrink-0" />
                      <span className="font-semibold text-slate-800 dark:text-slate-200 truncate">
                        {customer.hostel}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 sm:col-span-2 text-slate-500 dark:text-slate-400">
                      <GraduationCap className="w-4 h-4 text-amber-500 flex-shrink-0" />
                      <span>{customer.campus || 'Main Campus'} Residence</span>
                    </div>
                  </div>
                </div>

                {/* Role and Permissions Notice */}
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/60 flex items-start gap-2.5 text-xs">
                  <ShieldCheck className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <span className="font-bold text-slate-800 dark:text-slate-200">
                      Comrade Shopper Account
                    </span>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                      Fast 1-click WhatsApp ordering with saved hostel room drop-off. Store editing is strictly restricted to verified staff.
                    </p>
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
                    <div className="text-center py-5 border border-dashed border-slate-200 dark:border-slate-800 rounded-2xl">
                      <ShoppingBag className="w-7 h-7 mx-auto text-slate-300 dark:text-slate-600 mb-1" />
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        No orders recorded yet. Add items to quote to order!
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-2 max-h-44 overflow-y-auto pr-1">
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
                    className="flex items-center gap-1.5 text-xs font-semibold text-rose-600 dark:text-rose-400 hover:underline cursor-pointer"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Sign Out (Reset to Guest)</span>
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
                
                {/* Live Avatar Preview Card */}
                <div className="flex items-center gap-3.5 p-3.5 rounded-2xl bg-amber-50/70 dark:bg-amber-950/20 border border-amber-200/80 dark:border-amber-800/40">
                  <div className="relative w-14 h-14 rounded-full overflow-hidden border-2 border-amber-500 bg-slate-200 dark:bg-slate-700 flex items-center justify-center flex-shrink-0 shadow-sm">
                    {liveAvatarUrl && !avatarPreviewError ? (
                      <img
                        src={liveAvatarUrl}
                        alt="Profile avatar"
                        className="w-full h-full object-cover"
                        onError={() => setAvatarPreviewError(true)}
                      />
                    ) : (
                      <span className="text-base font-black text-amber-600">
                        {(name || 'C').charAt(0).toUpperCase()}
                      </span>
                    )}
                    <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-white dark:border-slate-900" />
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-black text-slate-800 dark:text-slate-100">
                        Profile Avatar Preview
                      </span>
                      {customAvatar && (
                        <button
                          type="button"
                          onClick={() => {
                            setCustomAvatar('');
                            setAvatarPreviewError(false);
                          }}
                          className="text-[10px] font-bold text-rose-500 hover:underline"
                        >
                          Use Email Photo
                        </button>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 leading-snug">
                      Loaded from your email (Gravatar/Google) or upload below. Replaces the header icon!
                    </p>

                    <label className="mt-2 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-[11px] font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-50 cursor-pointer shadow-2xs transition">
                      <Camera className="w-3.5 h-3.5 text-amber-600" />
                      <span>Upload Custom Photo</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileUpload}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>

                {/* Email Address (Primary for avatar) */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Email Address <span className="text-amber-600 font-normal">(fetches your profile photo)</span>
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="email"
                      placeholder="e.g. comrade@gmail.com / student@campus.ac.ke"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-10 pr-3.5 py-2.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 dark:text-white"
                    />
                  </div>
                </div>

                {/* Full Name */}
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

                {/* WhatsApp Phone */}
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

                {/* Hostel and Room */}
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
                    Used for direct, confidential campus hostel drop-offs.
                  </p>
                </div>

                {/* Campus selector */}
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

                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-extrabold text-xs shadow-lg transition flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Check className="w-4 h-4" />
                    <span>Save &amp; Activate Comrade Account</span>
                  </button>

                  {customer && (
                    <button
                      type="button"
                      onClick={() => setIsEditing(false)}
                      className="w-full mt-2 py-2 text-xs text-slate-500 hover:underline cursor-pointer"
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
