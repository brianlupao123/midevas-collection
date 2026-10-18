import React, { useState, useEffect, useRef, useMemo } from 'react';
import { 
  User, 
  Crown, 
  Briefcase, 
  GraduationCap, 
  LogOut, 
  ChevronDown, 
  LogIn, 
  Package, 
  ShoppingBag, 
  ShieldCheck, 
  Truck,
  Sparkles,
  KeyRound
} from 'lucide-react';
import { 
  ROLES, 
  ROLE_LABELS, 
  ROLE_BADGES, 
  logoutActiveUser,
  canAccessAdmin
} from '../utils/rbac';
import { notifySuccess, notifyInfo } from '../utils/notifications';

export default function UserProfileDropdown({ 
  user, 
  onViewChange, 
  onOpenAuth, 
  onOpenCart,
  onOpenAdmin,
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
  const badgeConfig = user ? (ROLE_BADGES[role] || ROLE_BADGES[ROLES.CUSTOMER]) : null;

  const initials = useMemo(() => {
    if (!user?.name) return '';
    return user.name
      .split(' ')
      .filter(Boolean)
      .map((w) => w[0])
      .join('')
      .slice(0, 2)
      .toUpperCase();
  }, [user?.name]);

  const handleSignOut = () => {
    logoutActiveUser();
    setOpen(false);
    if (onViewChange) onViewChange('store');
    notifyInfo('Signed out successfully.');
  };

  const handleOpenAuth = () => {
    setOpen(false);
    if (onOpenAuth) onOpenAuth();
  };

  const handleOpenStaffAdmin = () => {
    setOpen(false);
    if (onOpenAdmin) onOpenAdmin();
    else if (onViewChange) onViewChange('admin');
  };

  return (
    <div className="relative" ref={menuRef}>
      {/* Interactive Profile Avatar Trigger Button */}
      {user ? (
        <button
          type="button"
          onClick={() => setOpen((prev) => !prev)}
          className="flex items-center gap-1.5 sm:gap-2 p-1 sm:px-2.5 sm:py-1 rounded-full border border-slate-200 dark:border-slate-700 bg-slate-50 hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-700 transition shadow-xs select-none cursor-pointer"
          title={`${user.name} (${ROLE_LABELS[role]})`}
        >
          {/* Avatar circle with online status dot */}
          <div className="relative w-7 h-7 sm:w-8 sm:h-8 rounded-full overflow-hidden bg-gradient-to-tr from-amber-500 to-amber-600 flex items-center justify-center text-white text-xs font-black shadow-xs flex-shrink-0">
            {user.avatar && !avatarError ? (
              <img
                src={user.avatar}
                alt={user.name}
                className="w-full h-full object-cover"
                onError={() => setAvatarError(true)}
              />
            ) : (
              <span>{initials || 'U'}</span>
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
                {user.name.split(' ')[0]}
              </span>
              {role === ROLES.ADMIN && <Crown className="w-3 h-3 text-purple-500 flex-shrink-0" />}
              {role === ROLES.SELLER && <Briefcase className="w-3 h-3 text-amber-500 flex-shrink-0" />}
              {role === ROLES.CUSTOMER && <GraduationCap className="w-3 h-3 text-emerald-500 flex-shrink-0" />}
            </div>
            <span className="text-[10px] text-slate-500 dark:text-slate-400 capitalize">
              {badgeConfig?.label || 'Comrade'}
            </span>
          </div>

          <ChevronDown className="w-3 h-3 text-slate-400 transition-transform duration-200 hidden sm:block" />
        </button>
      ) : (
        /* Guest / Unauthenticated State: Clean Sign In Trigger */
        <button
          type="button"
          onClick={() => setOpen((prev) => !prev)}
          className="flex items-center gap-1.5 sm:gap-2 px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-full border border-slate-200 dark:border-slate-700 bg-slate-50 hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition shadow-xs text-xs font-bold cursor-pointer"
          title="Sign in or create a student account"
        >
          <div className="w-6 h-6 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-slate-600 dark:text-slate-300">
            <User className="w-3.5 h-3.5" />
          </div>
          <span className="hidden sm:inline">Sign In</span>
          <ChevronDown className="w-3 h-3 text-slate-400" />
        </button>
      )}

      {/* Dropdown Menu Modal */}
      {open && (
        <div className="absolute left-0 mt-2 w-80 max-w-[92vw] rounded-2xl bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden z-50 animate-fade-in">
          
          {user ? (
            /* Signed-in Profile View */
            <>
              {/* Header Profile Identity */}
              <div className="p-4 bg-slate-50 dark:bg-slate-800/70 border-b border-slate-100 dark:border-slate-800 flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-amber-500 to-amber-600 text-white flex items-center justify-center font-black text-sm shadow-md flex-shrink-0 overflow-hidden">
                  {user.avatar && !avatarError ? (
                    <img
                      src={user.avatar}
                      alt={user.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span>{initials || 'U'}</span>
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5">
                    <p className="font-extrabold text-sm text-slate-900 dark:text-white truncate">
                      {user.name}
                    </p>
                    <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-full border ${badgeConfig?.color}`}>
                      {badgeConfig?.label}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 truncate mt-0.5">
                    {user.email || user.phone || 'Campus Comrade'}
                  </p>
                  {user.hostel && (
                    <p className="text-[11px] text-slate-600 dark:text-slate-300 font-medium truncate flex items-center gap-1 mt-0.5">
                      <Truck className="w-3 h-3 text-amber-500" />
                      <span>{user.hostel}</span>
                    </p>
                  )}
                </div>
              </div>

              {/* Quick Navigation Links based on Role */}
              <div className="p-2 text-xs space-y-1">
                {/* Customer Links */}
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
                        {role === ROLES.ADMIN ? 'Store Management Dashboard' : 'Seller Inventory & Orders'}
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
                  onClick={handleOpenAuth}
                  className="text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-amber-600 px-2 py-1"
                >
                  Delivery Pass Info
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
            </>
          ) : (
            /* Unauthenticated / Guest View */
            <div className="p-5 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-amber-500/10 dark:bg-amber-500/20 text-amber-600 dark:text-amber-400 flex items-center justify-center flex-shrink-0">
                  <GraduationCap className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-extrabold text-slate-900 dark:text-white">
                    Welcome Comrade!
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Sign in to save your hostel room &amp; get Comrade discounts.
                  </p>
                </div>
              </div>

              {/* Primary Call to Action */}
              <button
                type="button"
                onClick={handleOpenAuth}
                className="w-full py-2.5 px-4 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs shadow-md transition flex items-center justify-center gap-2 cursor-pointer"
              >
                <LogIn className="w-4 h-4" />
                <span>Sign In / Create Account</span>
              </button>

              <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-1">
                <button
                  type="button"
                  onClick={() => {
                    setOpen(false);
                    if (onOpenCart) onOpenCart();
                  }}
                  className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 text-left"
                >
                  <Package className="w-3.5 h-3.5 text-emerald-500" />
                  <span>Track Current Cart / WhatsApp Quote</span>
                </button>

                <button
                  type="button"
                  onClick={handleOpenStaffAdmin}
                  className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 text-left"
                >
                  <KeyRound className="w-3.5 h-3.5 text-slate-400" />
                  <span>Store Staff &amp; Admin Sign In</span>
                </button>
              </div>
            </div>
          )}

        </div>
      )}
    </div>
  );
}
