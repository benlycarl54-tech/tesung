import { useState, useEffect } from 'react';
import { CheckCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const TESLA_MODELS = [
  "Tesla Model 3 2024", "Tesla Model Y 2024", "Tesla Model S 2025", "Tesla Model X 2024", "Tesla Model Y 2025",
  "Tesla Model Y 2025", "Tesla Model 3 2025", "Tesla Model S 2024", "Tesla Model 3 2025", "Tesla Cybertruck 2025",
];

const NAMES = [
  { name: "James O.", country: "🇺🇸 USA" }, { name: "Sophie M.", country: "🇬🇧 UK" },
  { name: "Carlos R.", country: "🇲🇽 Mexico" }, { name: "Yuki T.", country: "🇯🇵 Japan" },
  { name: "Emma W.", country: "🇨🇦 Canada" }, { name: "Lucas B.", country: "🇧🇷 Brazil" },
  { name: "Fatima A.", country: "🇦🇪 UAE" }, { name: "Pierre D.", country: "🇫🇷 France" },
  { name: "Amara N.", country: "🇿🇦 South Africa" }, { name: "Hans M.", country: "🇩🇪 Germany" },
  { name: "Raj P.", country: "🇮🇳 India" }, { name: "Maria G.", country: "🇦🇷 Argentina" },
  { name: "Kevin O.", country: "🇰🇪 Kenya" }, { name: "Anna S.", country: "🇷🇺 Russia" },
  { name: "David C.", country: "🇦🇺 Australia" }, { name: "Liam M.", country: "🇮🇪 Ireland" },
  { name: "Jin W.", country: "🇰🇷 South Korea" }, { name: "Mei L.", country: "🇸🇬 Singapore" },
  { name: "Thomas B.", country: "🇧🇪 Belgium" }, { name: "Ingrid H.", country: "🇳🇴 Norway" },
];

const DELIVERY_FEES = ["$299", "$349", "$399", "$249", "$329", "$289", "$319"];
const STATUS_VARIANTS = ["Delivery confirmed ✓", "Car dispatched 🚚", "Payment verified ✓", "Shipment confirmed ✓", "Vehicle en route 🚗"];

function generateTransaction(id: number) {
  const person = NAMES[id % NAMES.length];
  const car = TESLA_MODELS[id % TESLA_MODELS.length];
  const fee = DELIVERY_FEES[id % DELIVERY_FEES.length];
  const status = STATUS_VARIANTS[id % STATUS_VARIANTS.length];
  const mins = Math.floor(Math.random() * 59) + 1;
  return { id, name: person.name, country: person.country, car, fee, status, time: `${mins} min ago` };
}

export default function TransactionsSection() {
  const [transactions, setTransactions] = useState(() =>
    Array.from({ length: 10 }, (_, i) => generateTransaction(i))
  );

  useEffect(() => {
    const interval = setInterval(() => {
      setTransactions(prev => {
        const newTx = generateTransaction(Date.now());
        return [newTx, ...prev.slice(0, 9)];
      });
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section id="transactions" className="py-20 bg-white">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl font-black text-gray-900">
            Live <span className="text-red-600">Deliveries</span>
          </h2>
          <p className="text-gray-600 mt-4 text-lg max-w-xl mx-auto">
            Real-time updates of Tesla car deliveries happening right now across the world.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="max-w-3xl mx-auto bg-gray-50 rounded-2xl border border-gray-200 overflow-hidden"
        >
          <div className="bg-gray-900 text-white px-6 py-3 flex items-center justify-between text-sm font-semibold">
            <span>Live Delivery Feed</span>
            <span className="flex items-center gap-2">
              <span className="relative flex w-2 h-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                <span className="relative inline-flex rounded-full w-2 h-2 bg-green-500" />
              </span>
              LIVE
            </span>
          </div>

          <div className="divide-y divide-gray-100">
            <AnimatePresence initial={false}>
              {transactions.map(tx => (
                <motion.div
                  key={tx.id}
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="px-6 py-4 flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500 shrink-0" />
                    <div>
                      <p className="text-gray-900 font-bold text-sm">{tx.name} <span className="text-gray-400 font-normal">{tx.country}</span></p>
                      <p className="text-gray-500 text-xs">{tx.car} · {tx.status}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-red-600 font-bold text-sm">{tx.fee}</p>
                    <p className="text-gray-400 text-xs">{tx.time}</p>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
