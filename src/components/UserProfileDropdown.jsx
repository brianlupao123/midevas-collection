import React, { useState, useEffect, useRef, useMemo } from 'react';
import { 
  User, 
  Crown, 
  Briefcase, 
  GraduationCap, 
  LogOut, 
  ChevronDown, 
  Settings, 
  Package, 
  ShoppingBag, 
  Check, 
  Sparkles,
  ExternalLink,
  ShieldCheck,
  Truck
} from 'lucide-react';
import { 
  ROLES, 
  ROLE_LABELS, 
  ROLE_BADGES, 
  DEMO_ACCOUNTS, 
  switchDemoRole, 
  logoutActiveUser,
  canAccessAdmin
} from '../utils/rbac';
import { notifySuccess } from '../utils/notifications';

export default function UserProfileDropdown({ 
  user, 
  onViewChange, 
  onOpenAuth, 
  onOpenCart,
  currentView = 'store' 
}) {
  const [open, setOpen] = useState(false);
  const [avatarError, setAvatarError] = useState(false);
  const menuRef = useRef(null);

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const role = user?.role || ROLES.CUSTOMER;
  const badgeConfig = ROLE_BADGES[role] || ROLE_BADGES[ROLES.CUSTOMER];

  const initials = useMemo(() => {
    const name = user?.name || 'Comrade';
    return name
      .split(' ')
      .filter(Boolean)
      .map((w) => w[0])
      .join('')
      .slice(0, 2)
      .toUpperCase();
  }, [user?.name]);

  const handleRoleSelect = (accountKey) => {
    const updated = switchDemoRole(accountKey);
    notifySuccess(`Switched to ${updated.name} (${ROLE_LABELS[updated.role]})`);
    setOpen(false);
    if (updated.role === ROLES.CUSTOMER && currentView === 'admin' && onViewChange) {
      onViewChange('store');
    }
  };

  const handleSignOut = () => {
    logoutActiveUser();
    setOpen(false);
    if (onViewChange) onViewChange('store');
    notifySuccess('Signed out. Reset to Guest Comrade.');
  };

  return (
    <div className="relative" ref={menuRef}>
      {/* Interactive Profile Avatar Trigger Button */}
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="flex items-center gap-2 p-1 sm:px-2.5 sm:py-1.5 rounded-full border border-slate-200 dark:border-slate-700 bg-slate-50 hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-700 transition shadow-xs select-none"
        title={`${user?.name || 'Account'} (${ROLE_LABELS[role]}) — Tap to switch roles`}
      >
        {/* Avatar circle with online status dot */}
        <div className="relative w-7 h-7 sm:w-8 sm:h-8 rounded-full overflow-hidden bg-gradient-to-tr from-amber-500 to-amber-600 flex items-center justify-center text-white text-xs font-black shadow-xs flex-shrink-0">
          {user?.avatar && !avatarError ? (
            <img
              src={user.avatar}
              alt={user.name || 'User'}
              className="w-full h-full object-cover"
              onError={() => setAvatarError(true)}
            />
          ) : (
            <span>{initials}</span>
          )}
          {/* Status Indicator Dot */}
          <span className={`absolute bottom-0 right-0 w-2 h-2 rounded-full border-2 border-white dark:border-slate-900 ${
            role === ROLES.ADMIN ? 'bg-purple-500' : role === ROLES.SELLER ? 'bg-amber-500' : 'bg-emerald-500'
          }`} />
        </div>

        {/* User Name & Role Pill on larger screens */}
        <div className="hidden lg:flex flex-col text-left leading-none">
          <div className="flex items-center gap-1">
            <span className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate max-w-[100px]">
              {user?.name ? user.name.split(' ')[0] : 'Comrade'}
            </span>
            {role === ROLES.ADMIN && <Crown className="w-3 h-3 text-purple-500 flex-shrink-0" />}
            {role === ROLES.SELLER && <Briefcase className="w-3 h-3 text-amber-500 flex-shrink-0" />}
            {role === ROLES.CUSTOMER && <GraduationCap className="w-3 h-3 text-emerald-500 flex-shrink-0" />}
          </div>
          <span className="text-[10px] text-slate-500 dark:text-slate-400 capitalize">
            {badgeConfig.label}
          </span>
        </div>

        <ChevronDown className="w-3 h-3 text-slate-400 transition-transform duration-200 hidden sm:block" />
      </button>

      {/* Dropdown Menu Modal */}
      {open && (
        <div className="absolute left-0 sm:left-auto sm:right-0 mt-2 w-80 max-w-[92vw] rounded-2xl bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden z-50 animate-fade-in">
          
          {/* Header Profile Identity */}
          <div className="p-4 bg-slate-50 dark:bg-slate-800/70 border-b border-slate-100 dark:border-slate-800 flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 to-amber-600 text-white flex items-center justify-center font-black text-sm shadow-md flex-shrink-0 overflow-hidden">
              {user?.avatar && !avatarError ? (
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span>{initials}</span>
              )}
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5">
                <p className="font-extrabold text-sm text-slate-900 dark:text-white truncate">
                  {user?.name || 'Comrade Guest'}
                </p>
                <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-full border ${badgeConfig.color}`}>
                  {badgeConfig.label}
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 truncate mt-0.5">
                {user?.email || 'No email provided'}
              </p>
              {user?.hostel && (
                <p className="text-[11px] text-slate-600 dark:text-slate-300 font-medium truncate flex items-center gap-1 mt-0.5">
                  <Truck className="w-3 h-3 text-amber-500" />
                  <span>{user.hostel}</span>
                </p>
              )}
            </div>
          </div>

          {/* Quick Role Switcher Drawer (Benchmarked from 1-feedback-system) */}
          <div className="p-3 bg-amber-50/50 dark:bg-slate-800/40 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-amber-500" />
                <span>Switch Role (RBAC)</span>
              </span>
              <span className="text-[10px] text-slate-400">1-Click Test</span>
            </div>
            <div className="grid grid-cols-3 gap-1.5">
              {DEMO_ACCOUNTS.map((acc) => {
                const isActive = user?.role === acc.role;
                return (
                  <button
                    key={acc.key}
                    type="button"
                    onClick={() => handleRoleSelect(acc.key)}
                    className={`py-1.5 px-2 rounded-xl text-[11px] font-bold transition flex flex-col items-center justify-center gap-0.5 border ${
                      isActive
                        ? 'bg-amber-500 text-white border-amber-600 shadow-xs'
                        : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                  >
                    <span className="text-sm">
                      {acc.role === ROLES.ADMIN ? '👑' : acc.role === ROLES.SELLER ? '💼' : '🎓'}
                    </span>
                    <span className="truncate w-full text-center capitalize">{acc.key}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Quick Navigation Links based on Role */}
          <div className="p-2 text-xs space-y-1">
            {/* Customer Navigation */}
            {role === ROLES.CUSTOMER && (
              <>
                <button
                  type="button"
                  onClick={() => {
                    setOpen(false);
                    if (onViewChange) onViewChange('store');
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-left font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                >
                  <ShoppingBag className="w-4 h-4 text-amber-500" />
                  <span>Browse Campus Catalog</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setOpen(false);
                    if (onOpenCart) onOpenCart();
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-left font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                >
                  <Package className="w-4 h-4 text-emerald-500" />
                  <span>My Cart &amp; WhatsApp Quotes</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setOpen(false);
                    if (onOpenAuth) onOpenAuth();
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-left font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                >
                  <Truck className="w-4 h-4 text-rose-500" />
                  <span>Edit Hostel Delivery Address</span>
                </button>
              </>
            )}

            {/* Seller & Admin Navigation */}
            {canAccessAdmin(user) && (
              <>
                <button
                  type="button"
                  onClick={() => {
                    setOpen(false);
                    if (onViewChange) onViewChange('admin');
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-left font-bold text-amber-600 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-950/40 transition"
                >
                  <Package className="w-4 h-4 text-amber-500" />
                  <span>
                    {role === ROLES.ADMIN ? 'System Admin Dashboard' : 'Seller Inventory & Orders'}
                  </span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setOpen(false);
                    if (onViewChange) onViewChange('store');
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-left font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                >
                  <ShoppingBag className="w-4 h-4 text-slate-500" />
                  <span>Switch to Public Storefront</span>
                </button>
              </>
            )}
          </div>

          {/* Footer Action Bar */}
          <div className="p-2 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 flex items-center justify-between">
            <button
              type="button"
              onClick={() => {
                setOpen(false);
                if (onOpenAuth) onOpenAuth();
              }}
              className="text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-amber-600 px-2 py-1"
            >
              Profile Settings
            </button>
            <button
              type="button"
              onClick={handleSignOut}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
          </div>

        </div>
      )}
    </div>
  );
}
