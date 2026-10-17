import React from 'react';
import { Sparkles, MessageCircle, Truck } from 'lucide-react';

export default function AnnouncementBar({ config }) {
  const announcement = config?.announcementText || "🔥 Shirts < $8 • Tees < $4 • Bags $6 & $10 • Perfumes < $5 • Free Campus Hostel Delivery!";
  const groupLink = config?.whatsappGroupInvite || "https://chat.whatsapp.com/GuRW4nzqO251oyPcC5MRwH";

  return (
    <div className="bg-gradient-to-r from-amber-600 via-amber-500 to-rose-600 text-white text-xs sm:text-sm py-2 px-4 shadow-sm">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-1 text-center sm:text-left">
        <div className="flex items-center justify-center gap-2 font-medium">
          <span className="bg-white/20 text-white text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full flex-shrink-0">
            Comrade Deals
          </span>
          <span className="line-clamp-1">{announcement}</span>
        </div>
        <div className="flex items-center gap-4 text-xs text-amber-100 flex-shrink-0">
          <span className="hidden md:inline-flex items-center gap-1">
            <Truck className="w-3.5 h-3.5" /> Fast Hostel Drop-off
          </span>
          <a
            href={groupLink}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 font-semibold text-white hover:underline decoration-amber-200"
          >
            <MessageCircle className="w-3.5 h-3.5 text-emerald-300" /> Join 110+ Comrades on WhatsApp →
          </a>
        </div>
      </div>
    </div>
  );
}
