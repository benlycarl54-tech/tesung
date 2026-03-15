import { useState, useEffect } from 'react';
import { Clock, Users, Zap, Shield, Globe, Star } from 'lucide-react';
import { createPageUrl } from '@/utils';
import { SiteSettings } from '@/lib/dataService';
import { motion } from 'framer-motion';

const TESLA_IMAGES = {
  model3: "/images/tesla-model-3.jpg",
  modelY: "/images/tesla-model-y.jpg",
  modelS: "/images/tesla-model-s.jpg",
  modelX: "/images/tesla-model-x.jpg",
  cybertruck: "/images/tesla-cybertruck.jpg",
  roadster: "/images/tesla-roadster.jpg",
};

const DEFAULT_CARS = [
  { index: 0, name: "Tesla Model 3", year: "2025", tier: "Performance Sedan", fee: "$299", delivery: "7–10 Business Days", range: "358 mi Range", power: "510 hp Dual Motor", color: "from-gray-900 to-gray-800", badge: "🏆 Most Popular", badgeColor: "bg-yellow-400 text-yellow-900", img: TESLA_IMAGES.model3 },
  { index: 1, name: "Tesla Model Y", tier: "Premium SUV", year: "2025", fee: "$349", delivery: "5–7 Business Days", range: "330 mi Range", power: "384 hp Electric", color: "from-sky-800 to-sky-900", badge: "⚡ Express Delivery", badgeColor: "bg-blue-500 text-white", img: TESLA_IMAGES.modelY },
  { index: 2, name: "Tesla Model S", tier: "Luxury Flagship", year: "2025", fee: "$399", delivery: "3–5 Business Days", range: "405 mi Range", power: "670 hp Tri Motor", color: "from-red-800 to-red-900", badge: "👑 Premium", badgeColor: "bg-purple-500 text-white", img: TESLA_IMAGES.modelS },
  { index: 3, name: "Tesla Model X", tier: "Luxury SUV", year: "2025", fee: "$249", delivery: "10–14 Business Days", range: "348 mi Range", power: "670 hp Tri Motor", color: "from-emerald-700 to-emerald-900", badge: "💚 Best Value", badgeColor: "bg-green-500 text-white", img: TESLA_IMAGES.modelX },
  { index: 4, name: "Tesla Cybertruck", tier: "Electric Truck", year: "2025", fee: "$379", delivery: "5–8 Business Days", range: "340 mi Range", power: "845 hp Tri Motor", color: "from-violet-800 to-violet-900", badge: "🔥 New Arrival", badgeColor: "bg-orange-500 text-white", img: TESLA_IMAGES.cybertruck },
  { index: 5, name: "Tesla Roadster", tier: "Ultra Performance", year: "2025", fee: "$499", delivery: "3–5 Business Days", range: "620 mi Range", power: "1000+ hp Electric", color: "from-slate-800 to-slate-900", badge: "💎 Ultra Luxury", badgeColor: "bg-yellow-500 text-black", img: TESLA_IMAGES.roadster },
  { index: 6, name: "Tesla Model 3 SR", tier: "Standard Range", year: "2025", fee: "$199", delivery: "10–14 Business Days", range: "272 mi Range", power: "283 hp RWD", color: "from-cyan-700 to-cyan-900", badge: "🌊 City Special", badgeColor: "bg-cyan-400 text-cyan-900", img: TESLA_IMAGES.model3 },
  { index: 7, name: "Tesla Model Y LR", tier: "Long Range SUV", year: "2025", fee: "$329", delivery: "7–10 Business Days", range: "330 mi Range", power: "384 hp AWD", color: "from-indigo-800 to-indigo-900", badge: "👨‍👩‍👧 Family Pick", badgeColor: "bg-pink-500 text-white", img: TESLA_IMAGES.modelY },
  { index: 8, name: "Tesla Model S Plaid", tier: "Performance Sedan", year: "2025", fee: "$359", delivery: "5–7 Business Days", range: "396 mi Range", power: "1020 hp Tri Motor", color: "from-zinc-700 to-zinc-900", badge: "⭐ Top Rated", badgeColor: "bg-amber-400 text-amber-900", img: TESLA_IMAGES.modelS },
];

interface CarData {
  index: number;
  name: string;
  year: string;
  tier: string;
  fee: string;
  delivery: string;
  range: string;
  power: string;
  color: string;
  badge: string;
  badgeColor: string;
  img: string;
}

function CarCard({ car, idx }: { car: CarData; idx: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: idx * 0.08 }}
      className="bg-white rounded-3xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 flex flex-col"
    >
      <div className={`bg-gradient-to-br ${car.color} p-5 relative`}>
        <span className={`absolute top-3 right-3 text-xs font-bold px-2 py-1 rounded-full ${car.badgeColor}`}>
          {car.badge}
        </span>
        <p className="text-white/70 text-xs font-semibold uppercase tracking-widest">{car.tier}</p>
        <h3 className="text-white text-xl font-black mt-1">{car.name}</h3>
        <p className="text-white/60 text-sm">{car.year} Model</p>
        <img src={car.img} alt={car.name} className="w-full h-40 object-contain rounded-xl mt-3" />
      </div>

      <div className="p-5 flex flex-col flex-1">
        <div className="grid grid-cols-2 gap-2 mb-4">
          <div className="bg-gray-50 rounded-xl p-2.5 flex items-center gap-2">
            <Zap className="w-3.5 h-3.5 text-red-500 shrink-0" />
            <div><p className="text-xs text-gray-400">Power</p><p className="text-xs font-bold text-gray-800">{car.power}</p></div>
          </div>
          <div className="bg-gray-50 rounded-xl p-2.5 flex items-center gap-2">
            <Star className="w-3.5 h-3.5 text-red-500 shrink-0" />
            <div><p className="text-xs text-gray-400">Range</p><p className="text-xs font-bold text-gray-800">{car.range}</p></div>
          </div>
          <div className="bg-gray-50 rounded-xl p-2.5 flex items-center gap-2">
            <Globe className="w-3.5 h-3.5 text-red-500 shrink-0" />
            <div><p className="text-xs text-gray-400">Ships To</p><p className="text-xs font-bold text-gray-800">All Countries</p></div>
          </div>
          <div className="bg-gray-50 rounded-xl p-2.5 flex items-center gap-2">
            <Clock className="w-3.5 h-3.5 text-red-500 shrink-0" />
            <div><p className="text-xs text-gray-400">Delivery</p><p className="text-xs font-bold text-gray-800">{car.delivery}</p></div>
          </div>
        </div>

        <div className="bg-red-50 border border-red-100 rounded-2xl p-4 mb-4 text-center">
          <p className="text-xs text-gray-500 mb-1">One-Time Delivery Fee</p>
          <p className="text-3xl font-black text-red-600">{car.fee}</p>
          <p className="text-xs text-gray-400 mt-1">Covers shipping, customs & logistics</p>
        </div>

        <div className="mt-auto">
          <button
            onClick={() => window.location.href = createPageUrl(`Participate?wallet=${car.index}`)}
            className="w-full bg-red-600 hover:bg-red-700 text-white font-black py-3.5 rounded-xl transition-colors text-sm flex items-center justify-center gap-2"
          >
            <span>🚗 Claim This Tesla Now →</span>
          </button>
        </div>
      </div>
    </motion.div>
  );
}

export default function ParticipateSection() {
  const [timeLeft] = useState({ hours: 11, minutes: 42, seconds: 33 });
  const [cars, setCars] = useState<CarData[]>(DEFAULT_CARS);

  useEffect(() => {
    const records = SiteSettings.list();
    if (records && records.length > 0) {
      const s = records[0];
      const dbCount = parseInt(s.car_count) || 0;
      const count = Math.max(dbCount, DEFAULT_CARS.length);
      const loaded = Array.from({ length: count }, (_, i) => ({
        ...DEFAULT_CARS[i],
        index: i,
        name: s[`car_${i + 1}_name`] || DEFAULT_CARS[i]?.name || '',
        tier: s[`car_${i + 1}_tier`] || DEFAULT_CARS[i]?.tier || '',
        fee: s[`car_${i + 1}_fee`] || DEFAULT_CARS[i]?.fee || '',
        delivery: s[`car_${i + 1}_delivery`] || DEFAULT_CARS[i]?.delivery || '',
        img: s[`car_${i + 1}_img`] || DEFAULT_CARS[i]?.img || '',
        year: DEFAULT_CARS[i]?.year || '2025',
        range: DEFAULT_CARS[i]?.range || '',
        power: DEFAULT_CARS[i]?.power || '',
        color: DEFAULT_CARS[i]?.color || 'from-gray-800 to-gray-900',
        badge: DEFAULT_CARS[i]?.badge || '',
        badgeColor: DEFAULT_CARS[i]?.badgeColor || 'bg-gray-500 text-white',
      }));
      setCars(loaded);
    }
  }, []);

  return (
    <section id="participate" className="py-20 bg-gray-50">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 bg-red-600/10 border border-red-200 rounded-full px-4 py-1.5 mb-4">
            <Shield className="w-4 h-4 text-red-600" />
            <span className="text-red-600 text-sm font-bold uppercase tracking-wide">Official Tesla Global Giveaway</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-black text-gray-900">
            Choose Your <span className="text-red-600">Tesla Electric Car</span>
          </h2>
          <p className="text-gray-500 mt-4 text-lg max-w-2xl mx-auto">
            Tesla is gifting brand new electric vehicles to participants worldwide.
          </p>

          <div className="inline-flex items-center gap-6 mt-8 bg-white rounded-2xl px-8 py-4 shadow-md border border-gray-100">
            <div className="flex items-center gap-2 text-red-600">
              <Clock className="w-5 h-5" />
              <span className="font-bold text-sm">Event ends in:</span>
            </div>
            <div className="flex items-center gap-2">
              {[{ value: timeLeft.hours, label: "HRS" }, { value: timeLeft.minutes, label: "MIN" }, { value: timeLeft.seconds, label: "SEC" }].map((t, i) => (
                <div key={i} className="flex items-center gap-2">
                  {i > 0 && <span className="text-red-600 font-bold text-xl">:</span>}
                  <div className="text-center">
                    <div className="text-2xl font-black text-gray-900 w-12">{String(t.value).padStart(2, '0')}</div>
                    <div className="text-xs text-gray-400">{t.label}</div>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <Users className="w-4 h-4" />
              <span className="text-sm font-medium">12,847 participants</span>
            </div>
          </div>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {cars.map((car, idx) => (
            <CarCard key={car.index} car={car} idx={idx} />
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mt-10 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-3xl p-8 text-center shadow-xl"
        >
          <p className="font-black text-xl mb-2">⚡ Tesla Electric — Built for the Future</p>
          <p className="text-red-100 text-base max-w-3xl mx-auto leading-relaxed">
            Tesla is the world's <strong>leading electric vehicle manufacturer</strong>. Each participant is eligible for <strong>one vehicle only</strong>.
          </p>
        </motion.div>
      </div>
    </section>
  );
}