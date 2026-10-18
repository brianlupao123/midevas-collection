import React, { useState, useRef, useEffect } from 'react';
import { 
  X, 
  Download, 
  Sparkles, 
  Image as ImageIcon, 
  Share2, 
  Smartphone, 
  Check, 
  QrCode,
  Tag
} from 'lucide-react';
import { BASELINE_PRODUCTS } from '../data/products';

export default function FlyerGeneratorModal({ isOpen, onClose, config }) {
  const [format, setFormat] = useState('story'); // 'story' (9:16) | 'square' (1:1)
  const [headline, setHeadline] = useState("🔥 COMRADES FASHION & ESSENTIALS SALE");
  const [subheadline, setSubheadline] = useState("Great Quality Everyday • Student Budget Friendly");
  const [badgeText, setBadgeText] = useState("Under $4 & $8 Specials • Free Campus Drop-off");
  
  // Selected products to feature (default 4 deals)
  const [selectedProductIds, setSelectedProductIds] = useState([
    'm-graphic-tee',
    'b-clutch-quilted',
    's-pocket-perfume',
    'sn-coke-500'
  ]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  const canvasRef = useRef(null);

  const featuredProducts = BASELINE_PRODUCTS.filter((p) => selectedProductIds.includes(p.id));

  // Draw the flyer whenever options change
  useEffect(() => {
    if (!isOpen) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const width = format === 'story' ? 720 : 720;
    const height = format === 'story' ? 1280 : 720;
    canvas.width = width;
    canvas.height = height;

    // Background Gradient (Dark slate with amber/gold accents)
    const bgGrad = ctx.createLinearGradient(0, 0, width, height);
    bgGrad.addColorStop(0, '#0f172a');
    bgGrad.addColorStop(0.5, '#1e293b');
    bgGrad.addColorStop(1, '#0f172a');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, width, height);

    // Decorative geometric glow
    const glow = ctx.createRadialGradient(width / 2, 80, 10, width / 2, 80, 360);
    glow.addColorStop(0, 'rgba(217, 119, 6, 0.35)');
    glow.addColorStop(1, 'rgba(217, 119, 6, 0)');
    ctx.fillStyle = glow;
    ctx.fillRect(0, 0, width, 400);

    // Top Header: Brand Logo & Title
    ctx.textAlign = 'center';
    
    // Logo Pill
    ctx.fillStyle = '#d97706';
    ctx.beginPath();
    ctx.roundRect(width / 2 - 130, 36, 260, 34, 17);
    ctx.fill();

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 14px system-ui, sans-serif';
    ctx.fillText("MIDEVA'S COLLECTION", width / 2, 58);

    // Headline
    ctx.fillStyle = '#ffffff';
    ctx.font = '900 24px system-ui, sans-serif';
    ctx.fillText(headline.toUpperCase(), width / 2, 105);

    // Subheadline
    ctx.fillStyle = '#94a3b8';
    ctx.font = '500 13px system-ui, sans-serif';
    ctx.fillText(subheadline, width / 2, 130);

    // Badge Pill
    ctx.fillStyle = 'rgba(244, 63, 94, 0.2)';
    ctx.strokeStyle = '#f43f5e';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.roundRect(width / 2 - 200, 146, 400, 28, 14);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = '#f43f5e';
    ctx.font = 'bold 12px system-ui, sans-serif';
    ctx.fillText(`⚡ ${badgeText}`, width / 2, 165);

    // Grid of Featured Items
    const startY = 195;
    const cardW = 310;
    const cardH = format === 'story' ? 210 : 190;
    const gap = 20;

    featuredProducts.slice(0, 4).forEach((prod, idx) => {
      const col = idx % 2;
      const row = Math.floor(idx / 2);
      const x = (width - (cardW * 2 + gap)) / 2 + col * (cardW + gap);
      const y = startY + row * (cardH + gap);

      // Card Background
      ctx.fillStyle = 'rgba(30, 41, 59, 0.85)';
      ctx.strokeStyle = 'rgba(217, 119, 6, 0.4)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.roundRect(x, y, cardW, cardH, 16);
      ctx.fill();
      ctx.stroke();

      // Card Content
      ctx.textAlign = 'left';
      ctx.fillStyle = '#f8fafc';
      ctx.font = 'bold 14px system-ui, sans-serif';
      ctx.fillText(prod.name.slice(0, 26), x + 16, y + 36);

      ctx.fillStyle = '#94a3b8';
      ctx.font = '12px system-ui, sans-serif';
      ctx.fillText(`Category: ${prod.category.toUpperCase()}`, x + 16, y + 58);

      // Price Tag
      ctx.fillStyle = '#f59e0b';
      ctx.font = '900 20px system-ui, sans-serif';
      ctx.fillText(`$${prod.price.toFixed(2)}`, x + 16, y + 95);

      ctx.fillStyle = '#10b981';
      ctx.font = 'bold 13px system-ui, sans-serif';
      ctx.fillText(`~KSh ${Math.round(prod.price * (config?.exchangeRate || 130)).toLocaleString()}`, x + 95, y + 95);

      // EcoCash Badge
      ctx.fillStyle = '#38bdf8';
      ctx.font = 'bold 11px system-ui, sans-serif';
      ctx.fillText(`EcoCash: $${prod.price.toFixed(2)}`, x + 16, y + 120);

      // Comrade Deal Highlight
      ctx.fillStyle = '#fb7185';
      ctx.font = 'bold 11px system-ui, sans-serif';
      ctx.fillText(`🔥 Comrade Deal: $${prod.comradePrice.toFixed(2)}`, x + 16, y + 144);

      if (prod.badge) {
        ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
        ctx.beginPath();
        ctx.roundRect(x + 16, y + 158, 120, 22, 6);
        ctx.fill();

        ctx.fillStyle = '#e2e8f0';
        ctx.font = 'bold 10px system-ui, sans-serif';
        ctx.fillText(`📌 ${prod.badge}`, x + 24, y + 173);
      }
    });

    // Footer Info Banner
    const footerY = format === 'story' ? height - 190 : height - 130;
    
    // Bottom Card
    ctx.fillStyle = 'rgba(15, 23, 42, 0.95)';
    ctx.strokeStyle = '#d97706';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.roundRect(30, footerY, width - 60, format === 'story' ? 160 : 110, 16);
    ctx.fill();
    ctx.stroke();

    ctx.textAlign = 'center';
    ctx.fillStyle = '#f59e0b';
    ctx.font = '900 15px system-ui, sans-serif';
    ctx.fillText("🚀 FREE CAMPUS HOSTEL DROP-OFF & ZERO ADVANCE RISK", width / 2, footerY + 30);

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 13px system-ui, sans-serif';
    ctx.fillText(`WhatsApp Order: +254 748 094795 • M-Pesa Till: 254748094795 • EcoCash: ${config?.ecocashNumber || '0774809479'}`, width / 2, footerY + 58);

    ctx.fillStyle = '#94a3b8';
    ctx.font = '12px system-ui, sans-serif';
    ctx.fillText("Inspect your bags, shirts, or perfumes before making payment!", width / 2, footerY + 84);

    if (format === 'story') {
      ctx.fillStyle = '#38bdf8';
      ctx.font = 'bold 13px system-ui, sans-serif';
      ctx.fillText("🌐 Web Catalog: https://midevas-collection.vercel.app", width / 2, footerY + 120);
    }

  }, [isOpen, format, headline, subheadline, badgeText, selectedProductIds, config]);

  const handleDownload = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    setIsGenerating(true);
    const link = document.createElement('a');
    link.download = `midevas-collection-${format}-flyer.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();

    setIsGenerating(false);
    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 2500);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div 
        onClick={onClose}
        className="fixed inset-0 bg-slate-900/70 backdrop-blur-xs transition-opacity"
      />

      <div className="flex min-h-full items-center justify-center p-3 sm:p-6 text-center">
        <div className="relative transform overflow-hidden rounded-2xl bg-white dark:bg-slate-900 text-left shadow-2xl transition-all w-full max-w-4xl border border-slate-200 dark:border-slate-800">
          
          {/* Header */}
          <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-amber-500 text-white flex items-center justify-center font-black">
                🎨
              </div>
              <div>
                <h3 className="text-sm sm:text-base font-extrabold tracking-tight">
                  Campus Marketing &amp; WhatsApp Status Flyer Generator
                </h3>
                <p className="text-[11px] text-slate-400">
                  Generate 100% free downloadable status posters for WhatsApp, Instagram, and campus noticeboards.
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Left Controls (5 cols) */}
            <div className="lg:col-span-5 space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Flyer Size Format</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setFormat('story')}
                    className={`py-2 px-3 rounded-lg border text-xs font-bold transition flex items-center justify-center gap-1.5 ${
                      format === 'story'
                        ? 'border-amber-500 bg-amber-50 text-amber-900'
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <Smartphone className="w-3.5 h-3.5" />
                    <span>WhatsApp Story (9:16)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setFormat('square')}
                    className={`py-2 px-3 rounded-lg border text-xs font-bold transition flex items-center justify-center gap-1.5 ${
                      format === 'square'
                        ? 'border-amber-500 bg-amber-50 text-amber-900'
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <ImageIcon className="w-3.5 h-3.5" />
                    <span>Square Poster (1:1)</span>
                  </button>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Poster Headline</label>
                <input
                  type="text"
                  value={headline}
                  onChange={(e) => setHeadline(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Sub-headline</label>
                <input
                  type="text"
                  value={subheadline}
                  onChange={(e) => setSubheadline(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Highlight Badge</label>
                <input
                  type="text"
                  value={badgeText}
                  onChange={(e) => setBadgeText(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-amber-500"
                />
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={handleDownload}
                  disabled={isGenerating}
                  className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs shadow-md transition flex items-center justify-center gap-2"
                >
                  {downloadSuccess ? <Check className="w-4 h-4" /> : <Download className="w-4 h-4" />}
                  <span>{downloadSuccess ? 'Flyer Downloaded!' : 'Download High-Res PNG Flyer'}</span>
                </button>
              </div>
            </div>

            {/* Right Live Canvas Preview (7 cols) */}
            <div className="lg:col-span-7 flex flex-col items-center justify-center bg-slate-100 rounded-2xl p-4 border border-slate-200">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                Live High-Definition Preview
              </span>
              <div className="max-h-[500px] overflow-auto shadow-xl rounded-xl border border-slate-300">
                <canvas 
                  ref={canvasRef} 
                  className="max-h-[480px] w-auto h-auto object-contain rounded-xl"
                />
              </div>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
}
