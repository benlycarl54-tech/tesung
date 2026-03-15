import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle } from 'lucide-react';

const claims = [
  { name: "James O.", country: "🇺🇸 USA", car: "Tesla Model 3 2024", fee: "$299" },
  { name: "Sophie M.", country: "🇬🇧 UK", car: "Tesla Model Y 2025", fee: "$349" },
  { name: "Carlos R.", country: "🇲🇽 Mexico", car: "Tesla Model 3 2024", fee: "$249" },
  { name: "Yuki T.", country: "🇯🇵 Japan", car: "Tesla Model S 2025", fee: "$399" },
  { name: "Emma W.", country: "🇨🇦 Canada", car: "Tesla Model 3 2025", fee: "$329" },
  { name: "Lucas B.", country: "🇧🇷 Brazil", car: "Tesla Model Y 2024", fee: "$289" },
  { name: "Fatima A.", country: "🇦🇪 UAE", car: "Tesla Model S 2024", fee: "$399" },
  { name: "Pierre D.", country: "🇫🇷 France", car: "Tesla Model 3 2025", fee: "$249" },
  { name: "Amara N.", country: "🇿🇦 South Africa", car: "Tesla Model Y 2025", fee: "$319" },
  { name: "Hans M.", country: "🇩🇪 Germany", car: "Tesla Model 3 2024", fee: "$299" },
  { name: "Raj P.", country: "🇮🇳 India", car: "Tesla Model Y 2025", fee: "$349" },
  { name: "Maria G.", country: "🇦🇷 Argentina", car: "Tesla Model 3 2024", fee: "$249" },
  { name: "Kevin O.", country: "🇰🇪 Kenya", car: "Tesla Model 3 2025", fee: "$329" },
  { name: "Anna S.", country: "🇷🇺 Russia", car: "Tesla Model S 2025", fee: "$399" },
  { name: "David C.", country: "🇦🇺 Australia", car: "Tesla Cybertruck 2025", fee: "$319" },
  { name: "Liam M.", country: "🇮🇪 Ireland", car: "Tesla Model Y 2024", fee: "$289" },
  { name: "Jin W.", country: "🇰🇷 South Korea", car: "Tesla Model 3 2024", fee: "$299" },
  { name: "Thomas B.", country: "🇧🇪 Belgium", car: "Tesla Model 3 2025", fee: "$249" },
  { name: "Ingrid H.", country: "🇳🇴 Norway", car: "Tesla Model S 2024", fee: "$399" },
  { name: "Mei L.", country: "🇸🇬 Singapore", car: "Tesla Model Y 2025", fee: "$319" },
  { name: "Pablo M.", country: "🇨🇴 Colombia", car: "Tesla Model Y 2025", fee: "$349" },
  { name: "Olga P.", country: "🇵🇱 Poland", car: "Tesla Model 3 2025", fee: "$329" },
  { name: "Lars E.", country: "🇸🇪 Sweden", car: "Tesla Model 3 2024", fee: "$249" },
  { name: "Sara F.", country: "🇩🇰 Denmark", car: "Tesla Model S 2025", fee: "$399" },
  { name: "Kwame D.", country: "🇬🇭 Ghana", car: "Tesla Model 3 2024", fee: "$299" },
  { name: "Nadia B.", country: "🇲🇦 Morocco", car: "Tesla Model Y 2024", fee: "$289" },
  { name: "Rafael C.", country: "🇵🇹 Portugal", car: "Tesla Cybertruck 2025", fee: "$319" },
  { name: "Hana K.", country: "🇨🇿 Czech Republic", car: "Tesla Model Y 2025", fee: "$319" },
  { name: "Viktor N.", country: "🇺🇦 Ukraine", car: "Tesla Model 3 2025", fee: "$249" },
  { name: "Celine F.", country: "🇨🇭 Switzerland", car: "Tesla Model S 2024", fee: "$399" },
];

export default function LiveClaimsPopup() {
  const [visible, setVisible] = useState<typeof claims[0] | null>(null);
  const [queue, setQueue] = useState<typeof claims>([]);

  useEffect(() => {
    setQueue([...claims].sort(() => Math.random() - 0.5));
  }, []);

  useEffect(() => {
    if (queue.length === 0) return;
    let index = 0;
    let hideTimer: ReturnType<typeof setTimeout>;
    let nextTimer: ReturnType<typeof setTimeout>;

    const show = () => {
      setVisible(queue[index % queue.length]);
      index++;
      hideTimer = setTimeout(() => setVisible(null), 4000);
      const nextDelay = 6000 + Math.random() * 4000;
      nextTimer = setTimeout(show, nextDelay);
    };

    const startTimer = setTimeout(show, 2000);
    return () => {
      clearTimeout(startTimer);
      clearTimeout(hideTimer);
      clearTimeout(nextTimer);
    };
  }, [queue]);

  return (
    <div className="fixed top-24 left-6 z-50 max-w-xs w-full pointer-events-none">
      <AnimatePresence>
        {visible && (
          <motion.div
            key={visible.name + visible.car}
            initial={{ opacity: 0, y: -60, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="bg-white rounded-2xl shadow-2xl border border-gray-100 p-4 pointer-events-auto"
          >
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-red-700 rounded-full flex items-center justify-center shrink-0">
                <CheckCircle className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-bold text-gray-900 text-sm">{visible.name}</span>
                  <span className="text-xs text-gray-500">{visible.country}</span>
                </div>
                <p className="text-xs text-gray-600 mt-0.5">
                  Just paid delivery fee for{' '}
                  <span className="inline-block px-2 py-0.5 rounded-full text-xs font-bold bg-red-100 text-red-700">
                    {visible.car}
                  </span>
                </p>
                <p className="text-green-600 font-bold text-sm mt-1">🚗 Car confirmed & dispatched! ({visible.fee} fee paid)</p>
              </div>
            </div>
            <div className="mt-2 h-1 bg-gray-100 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-red-500 rounded-full"
                initial={{ width: "100%" }}
                animate={{ width: "0%" }}
                transition={{ duration: 4, ease: "linear" }}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
