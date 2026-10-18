import React, { useState } from 'react';
import { 
  X, 
  Check, 
  Smartphone, 
  Copy, 
  ShieldCheck, 
  Truck, 
  DollarSign, 
  ShoppingBag, 
  ArrowRight, 
  PhoneCall,
  Clock,
  ExternalLink,
  MessageCircle
} from 'lucide-react';
import { saveOrder } from '../utils/orders';
import { trackEvent } from '../utils/analytics';
import { formatPrice } from '../utils/storeConfig';

export default function PaymentModal({ isOpen, onClose, cartItems, currency, config, onClearCart }) {
  const [paymentMethod, setPaymentMethod] = useState('mpesa'); // 'mpesa' | 'ecocash' | 'cash'
  const [phoneNumber, setPhoneNumber] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [hostelRoom, setHostelRoom] = useState('');
  
  // M-Pesa STK simulation states
  const [stkStatus, setStkStatus] = useState('idle'); // 'idle' | 'prompting' | 'processing' | 'success'
  const [pinInput, setPinInput] = useState('');
  const [mpesaReceipt, setMpesaReceipt] = useState(null);

  // EcoCash states
  const [ecocashTxnId, setEcocashTxnId] = useState('');
  const [copiedUssd, setCopiedUssd] = useState(false);
  const [ecocashConfirmed, setEcocashConfirmed] = useState(false);

  // Cash on delivery states
  const [cashConfirmed, setCashConfirmed] = useState(false);

  if (!isOpen) return null;

  const totalUsd = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const totalKsh = Math.round(totalUsd * (config?.exchangeRate || 130));
  const totalEcoCash = config?.ecocashMode === 'ZiG'
    ? Math.round(totalUsd * (config?.ecocashRate || 28))
    : totalUsd.toFixed(2);

  const ecocashNumber = config?.ecocashNumber || "0774809479";
  const ecocashUssd = `*151*1*1*${ecocashNumber}*${totalUsd.toFixed(2)}#`;

  // Handle M-Pesa STK Push submission
  const handleInitiateMpesa = (e) => {
    e.preventDefault();
    if (!phoneNumber.trim()) return;

    setStkStatus('prompting');
  };

  const handleConfirmPin = (e) => {
    e.preventDefault();
    setStkStatus('processing');

    setTimeout(() => {
      const randomRef = 'QK' + Math.floor(10000000 + Math.random() * 90000000);
      const receipt = {
        ref: randomRef,
        amountKsh: totalKsh,
        phone: phoneNumber,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        date: new Date().toLocaleDateString()
      };
      setMpesaReceipt(receipt);
      setStkStatus('success');

      // Record order
      saveOrder({
        customerName: customerName || 'Comrade Customer',
        deliveryLocation: hostelRoom || 'Hostel Drop-off',
        items: cartItems,
        totalUsd,
        paymentMethod: 'M-Pesa STK Push',
        paymentRef: randomRef,
        status: 'Paid'
      });

      trackEvent('payment_success', { method: 'mpesa', amount: totalKsh, ref: randomRef });
      if (onClearCart) onClearCart();
    }, 1200);
  };

  // Handle EcoCash Confirmation
  const handleConfirmEcoCash = (e) => {
    e.preventDefault();
    const ref = ecocashTxnId.trim() || 'EC' + Math.floor(10000000 + Math.random() * 90000000);
    setEcocashConfirmed(true);

    saveOrder({
      customerName: customerName || 'Comrade Customer',
      deliveryLocation: hostelRoom || 'Hostel Drop-off',
      items: cartItems,
      totalUsd,
      paymentMethod: 'EcoCash',
      paymentRef: ref,
      status: 'Paid (EcoCash)'
    });

    trackEvent('payment_success', { method: 'ecocash', amount: totalUsd, ref });
    if (onClearCart) onClearCart();
  };

  // Handle Cash on delivery confirmation
  const handleConfirmCash = (e) => {
    e.preventDefault();
    setCashConfirmed(true);

    saveOrder({
      customerName: customerName || 'Comrade Customer',
      deliveryLocation: hostelRoom || 'Hostel Drop-off',
      items: cartItems,
      totalUsd,
      paymentMethod: 'Cash on Delivery',
      status: 'Pending Drop-off'
    });

    trackEvent('payment_success', { method: 'cash', amount: totalUsd });
    if (onClearCart) onClearCart();
  };

  const copyUssdToClipboard = () => {
    navigator.clipboard.writeText(ecocashUssd);
    setCopiedUssd(true);
    setTimeout(() => setCopiedUssd(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div 
        onClick={onClose}
        className="fixed inset-0 bg-slate-900/70 backdrop-blur-xs transition-opacity"
      />

      <div className="flex min-h-full items-center justify-center p-3 sm:p-6 text-center">
        <div className="relative transform overflow-hidden rounded-2xl bg-white text-left shadow-2xl transition-all w-full max-w-lg border border-slate-200">
          
          {/* Header */}
          <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-emerald-500 text-white flex items-center justify-center font-black">
                ⚡
              </div>
              <div>
                <h3 className="text-sm sm:text-base font-extrabold tracking-tight">
                  Express Checkout &amp; Payment
                </h3>
                <p className="text-[11px] text-slate-400">
                  Total: ${totalUsd.toFixed(2)} (~KSh {totalKsh.toLocaleString()} • EcoCash ${totalUsd.toFixed(2)})
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

          {/* Payment Method Tabs */}
          <div className="grid grid-cols-3 border-b border-slate-200 bg-slate-50 text-xs font-bold">
            <button
              type="button"
              onClick={() => {
                setPaymentMethod('mpesa');
                setStkStatus('idle');
              }}
              className={`py-3 px-2 text-center border-b-2 transition flex items-center justify-center gap-1.5 ${
                paymentMethod === 'mpesa'
                  ? 'border-emerald-600 text-emerald-800 bg-white'
                  : 'border-transparent text-slate-600 hover:bg-slate-100'
              }`}
            >
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              <span>M-Pesa STK</span>
            </button>

            <button
              type="button"
              onClick={() => setPaymentMethod('ecocash')}
              className={`py-3 px-2 text-center border-b-2 transition flex items-center justify-center gap-1.5 ${
                paymentMethod === 'ecocash'
                  ? 'border-blue-600 text-blue-800 bg-white'
                  : 'border-transparent text-slate-600 hover:bg-slate-100'
              }`}
            >
              <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
              <span>EcoCash</span>
            </button>

            <button
              type="button"
              onClick={() => setPaymentMethod('cash')}
              className={`py-3 px-2 text-center border-b-2 transition flex items-center justify-center gap-1.5 ${
                paymentMethod === 'cash'
                  ? 'border-amber-600 text-amber-800 bg-white'
                  : 'border-transparent text-slate-600 hover:bg-slate-100'
              }`}
            >
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
              <span>Cash on Drop</span>
            </button>
          </div>

          {/* Content Body */}
          <div className="p-6 space-y-4">

            {/* TAB 1: M-PESA EXPRESS (STK PUSH) */}
            {paymentMethod === 'mpesa' && (
              <div className="space-y-4">
                {stkStatus === 'idle' && (
                  <form onSubmit={handleInitiateMpesa} className="space-y-3.5">
                    <div className="p-3 rounded-xl bg-emerald-50/70 border border-emerald-200 text-xs text-emerald-900 leading-relaxed">
                      <strong className="block font-bold">📲 Instant M-Pesa STK Push</strong>
                      Enter your Safaricom number. You will receive an instant prompt on your phone screen to enter your M-Pesa PIN!
                    </div>

                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-1">
                        Safaricom Phone Number (for STK Prompt)
                      </label>
                      <input
                        type="tel"
                        required
                        placeholder="e.g. 0748094795"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white font-mono"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-[11px] font-bold text-slate-600 block mb-1">Your Name</label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. Brian"
                          value={customerName}
                          onChange={(e) => setCustomerName(e.target.value)}
                          className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500"
                        />
                      </div>
                      <div>
                        <label className="text-[11px] font-bold text-slate-600 block mb-1">Hostel &amp; Room</label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. Hostel 3 Rm 12"
                          value={hostelRoom}
                          onChange={(e) => setHostelRoom(e.target.value)}
                          className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500"
                        />
                      </div>
                    </div>

                    <div className="pt-2">
                      <button
                        type="submit"
                        className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition flex items-center justify-center gap-2"
                      >
                        <Smartphone className="w-4 h-4" />
                        <span>Send M-Pesa STK Push (KSh {totalKsh.toLocaleString()})</span>
                      </button>
                    </div>
                  </form>
                )}

                {/* Simulated Phone STK Push Prompt */}
                {stkStatus === 'prompting' && (
                  <div className="p-4 rounded-2xl bg-slate-900 text-white shadow-xl space-y-4 max-w-sm mx-auto animate-fade-in border border-emerald-500/30">
                    <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                      <span className="text-[11px] font-bold text-emerald-400 flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                        M-PESA SIM TOOLKIT
                      </span>
                      <span className="text-[10px] text-slate-400">Till: 254748094795</span>
                    </div>

                    <div className="p-3 rounded-xl bg-slate-800/80 text-center space-y-1">
                      <p className="text-xs text-slate-300">
                        Do you want to pay <strong className="text-white">KSh {totalKsh.toLocaleString()}</strong> to <strong className="text-emerald-400">MIDEVA'S COLLECTION</strong>?
                      </p>
                      <p className="text-[10px] text-slate-400">Account: Hostel Delivery ({hostelRoom || 'Campus'})</p>
                    </div>

                    <form onSubmit={handleConfirmPin} className="space-y-3">
                      <div>
                        <label className="text-[11px] text-slate-400 text-center block mb-1">
                          Enter M-Pesa PIN:
                        </label>
                        <input
                          type="password"
                          maxLength={4}
                          required
                          autoFocus
                          placeholder="••••"
                          value={pinInput}
                          onChange={(e) => setPinInput(e.target.value)}
                          className="w-32 mx-auto text-center tracking-widest text-lg font-black bg-slate-800 text-white border border-slate-700 rounded-xl px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-emerald-500 block"
                        />
                      </div>

                      <div className="flex items-center gap-2 pt-1">
                        <button
                          type="button"
                          onClick={() => setStkStatus('idle')}
                          className="w-1/2 py-2 rounded-lg bg-slate-800 text-xs text-slate-400 hover:text-white"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="w-1/2 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold shadow-md transition"
                        >
                          Send PIN
                        </button>
                      </div>
                    </form>
                  </div>
                )}

                {/* Processing State */}
                {stkStatus === 'processing' && (
                  <div className="py-8 text-center space-y-3">
                    <div className="w-10 h-10 border-3 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto" />
                    <p className="text-xs font-bold text-slate-700">Connecting with Safaricom M-Pesa Network...</p>
                    <p className="text-[10px] text-slate-400">Validating transaction reference and hostel allocation</p>
                  </div>
                )}

                {/* Success State */}
                {stkStatus === 'success' && mpesaReceipt && (
                  <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-left space-y-3 animate-fade-in">
                    <div className="flex items-center gap-2 text-emerald-800 font-extrabold text-sm">
                      <Check className="w-5 h-5 text-emerald-600" />
                      <span>Payment Confirmed &amp; Logged!</span>
                    </div>

                    <div className="bg-white p-3 rounded-lg border border-emerald-100 text-xs text-slate-700 font-mono space-y-1">
                      <p className="font-bold text-slate-900">M-PESA RECEIPT</p>
                      <p>Ref: <strong className="text-emerald-700">{mpesaReceipt.ref}</strong></p>
                      <p>Amount: KSh {mpesaReceipt.amountKsh.toLocaleString()}</p>
                      <p>Recipient: MIDEVA'S COLLECTION</p>
                      <p>Date: {mpesaReceipt.date} {mpesaReceipt.time}</p>
                    </div>

                    <p className="text-xs text-slate-600">
                      🚀 Order scheduled for free hostel drop-off to <strong>{hostelRoom}</strong>! Mideva will message you when heading out.
                    </p>

                    <button
                      onClick={onClose}
                      className="w-full py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs"
                    >
                      Done / Close
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* TAB 2: ECOCASH EXPRESS */}
            {paymentMethod === 'ecocash' && (
              <div className="space-y-4">
                {!ecocashConfirmed ? (
                  <form onSubmit={handleConfirmEcoCash} className="space-y-3.5">
                    <div className="p-3 rounded-xl bg-blue-50/80 border border-blue-200 text-xs text-blue-900 leading-relaxed">
                      <strong className="block font-bold">🔵 EcoCash Express USSD Prompt</strong>
                      Dial the USSD string directly on your phone or send money to Mideva's EcoCash number:
                    </div>

                    <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-slate-500 font-medium">EcoCash Number:</span>
                        <strong className="text-slate-900 font-mono text-sm">{ecocashNumber}</strong>
                      </div>
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-slate-500 font-medium">Amount Due:</span>
                        <strong className="text-blue-700 font-extrabold text-sm">
                          EcoCash ${totalUsd.toFixed(2)}
                          {config?.ecocashMode === 'ZiG' && ` (~ZiG ${totalEcoCash})`}
                        </strong>
                      </div>

                      {/* USSD Code string */}
                      <div className="pt-2 border-t border-slate-200">
                        <span className="text-[10px] font-bold text-slate-500 block mb-1">Direct USSD Dial Code:</span>
                        <div className="flex items-center gap-2">
                          <input
                            type="text"
                            readOnly
                            value={ecocashUssd}
                            className="flex-1 px-2.5 py-1.5 text-xs font-mono bg-white border border-slate-300 rounded-lg select-all"
                          />
                          <button
                            type="button"
                            onClick={copyUssdToClipboard}
                            className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition flex items-center gap-1"
                          >
                            {copiedUssd ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                            <span>{copiedUssd ? 'Copied' : 'Copy'}</span>
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-[11px] font-bold text-slate-600 block mb-1">Your Name</label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. Tendai"
                          value={customerName}
                          onChange={(e) => setCustomerName(e.target.value)}
                          className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="text-[11px] font-bold text-slate-600 block mb-1">Hostel &amp; Room</label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. Hall 2 Rm 4B"
                          value={hostelRoom}
                          onChange={(e) => setHostelRoom(e.target.value)}
                          className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-[11px] font-bold text-slate-600 block mb-1">
                        EcoCash Approval Code / Reference ID (optional)
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. MP261018.1234 or your phone number"
                        value={ecocashTxnId}
                        onChange={(e) => setEcocashTxnId(e.target.value)}
                        className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 font-mono"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md transition flex items-center justify-center gap-2"
                    >
                      <Check className="w-4 h-4" />
                      <span>Confirm EcoCash Payment</span>
                    </button>
                  </form>
                ) : (
                  <div className="p-4 rounded-xl bg-blue-50 border border-blue-200 text-left space-y-3 animate-fade-in">
                    <div className="flex items-center gap-2 text-blue-900 font-extrabold text-sm">
                      <Check className="w-5 h-5 text-blue-600" />
                      <span>EcoCash Order Recorded!</span>
                    </div>
                    <p className="text-xs text-slate-600">
                      Mideva (+254 748 094795) has received your EcoCash order request for hostel drop-off at <strong>{hostelRoom}</strong>.
                    </p>
                    <button
                      onClick={onClose}
                      className="w-full py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs"
                    >
                      Done / Close
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* TAB 3: CASH ON DELIVERY */}
            {paymentMethod === 'cash' && (
              <div className="space-y-4">
                {!cashConfirmed ? (
                  <form onSubmit={handleConfirmCash} className="space-y-3.5">
                    <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 leading-relaxed">
                      <strong className="block font-bold">🟡 Zero Risk: Pay Cash upon Drop-off</strong>
                      Inspect your clothes, bags, or perfumes when Mideva drops them off at your hostel, then pay cash directly!
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-[11px] font-bold text-slate-600 block mb-1">Your Name</label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. Comrade"
                          value={customerName}
                          onChange={(e) => setCustomerName(e.target.value)}
                          className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-amber-500"
                        />
                      </div>
                      <div>
                        <label className="text-[11px] font-bold text-slate-600 block mb-1">Hostel &amp; Room</label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. Complex Rm 10"
                          value={hostelRoom}
                          onChange={(e) => setHostelRoom(e.target.value)}
                          className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-amber-500"
                        />
                      </div>
                    </div>

                    <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 text-xs space-y-1">
                      <div className="flex justify-between">
                        <span className="text-slate-500">Amount Due at Hostel:</span>
                        <strong className="text-slate-900">${totalUsd.toFixed(2)} (~KSh {totalKsh.toLocaleString()})</strong>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Hostel Drop-off Fee:</span>
                        <strong className="text-emerald-600 font-bold">FREE</strong>
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs shadow-md transition flex items-center justify-center gap-2"
                    >
                      <Truck className="w-4 h-4" />
                      <span>Book Free Hostel Drop-off</span>
                    </button>
                  </form>
                ) : (
                  <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-left space-y-3 animate-fade-in">
                    <div className="flex items-center gap-2 text-amber-900 font-extrabold text-sm">
                      <Check className="w-5 h-5 text-amber-600" />
                      <span>Hostel Drop-off Booked!</span>
                    </div>
                    <p className="text-xs text-slate-700">
                      Your order has been logged. Mideva will drop off your items at <strong>{hostelRoom}</strong>. Please have ${totalUsd.toFixed(2)} (or KSh {totalKsh.toLocaleString()}) ready.
                    </p>
                    <button
                      onClick={onClose}
                      className="w-full py-2 rounded-lg bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs"
                    >
                      Done / Close
                    </button>
                  </div>
                )}
              </div>
            )}

          </div>

        </div>
      </div>
    </div>
  );
}
