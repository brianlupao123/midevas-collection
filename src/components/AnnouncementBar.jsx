import React from 'react';
import { Sparkles, MessageCircle, Truck } from 'lucide-react';

export default function AnnouncementBar({ config }) {
  const announcement = config?.announcementText || "🔥 Shirts < $8 • Tees < $4 • Bags $6 & $10 • Perfumes < $5 • Free Campus Hostel Delivery!";
  const groupLink = config?.whatsappGroupInvite || "https://chat.whatsapp.com/GuRW4nzqO251oyPcC5MRwH";

  return (
    <div className="w-full bg-gradient-to-r from-amber-600 via-amber-500 to-rose-600 text-white text-xs sm:text-sm py-1.5 sm:py-2 px-3 sm:px-6 shadow-xs select-none">
      <div className="w-full max-w-[1720px] 2xl:max-w-[1880px] mx-auto px-2 sm:px-4 flex items-center justify-between gap-3">
        
        {/* Single-line sleek announcement on mobile & desktop */}
        <div className="flex items-center gap-2.5 font-medium min-w-0 flex-1">
          <span className="bg-white/20 text-white text-[9px] sm:text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full flex-shrink-0">
            Deals
          </span>
          <span className="truncate text-[11px] sm:text-xs">
            {announcement}
          </span>
        </div>

        {/* WhatsApp Group link - visible on sm+ screens to keep mobile super slim */}
        <div className="hidden sm:flex items-center gap-4 text-xs text-amber-100 flex-shrink-0">
          <span className="hidden md:inline-flex items-center gap-1.5">
            <Truck className="w-3.5 h-3.5" /> Fast Hostel Drop-off
          </span>
          <a
            href={groupLink}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 font-semibold text-white hover:underline decoration-amber-200"
          >
            <MessageCircle className="w-3.5 h-3.5 text-emerald-300" /> Join 110+ Comrades on WhatsApp →
          </a>
        </div>

      </div>
    </div>
  );
}
