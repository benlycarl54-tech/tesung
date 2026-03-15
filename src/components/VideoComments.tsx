import { useState, useEffect } from 'react';
import { ThumbsUp, ThumbsDown, ChevronDown, ChevronUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const BASE_COMMENTS = [
  { id: 1, name: "Mike Johnson", avatar: "MJ", color: "bg-blue-600", time: "2 days ago", text: "Just received my Tesla Model 3 2024!! I paid the delivery fee and within 9 days the car was at my door. This is REAL! 🚗⚡", likes: 48210, pinned: true },
  { id: 2, name: "Sarah Williams", avatar: "SW", color: "bg-pink-500", time: "1 day ago", text: "I received my Tesla Model Y 2025 after paying the delivery fee. I cried when I saw the car parked outside! 🙏", likes: 32440 },
  { id: 3, name: "Carlos Mendez", avatar: "CM", color: "bg-green-600", time: "3 days ago", text: "From Mexico! I received my Tesla Model 3 2024 after paying the delivery fee. This giveaway is 100% real!", likes: 29180 },
  { id: 4, name: "David Chen", avatar: "DC", color: "bg-purple-600", time: "2 days ago", text: "I was skeptical at first but I paid the delivery fee and received my Tesla Model S 2025. So real!", likes: 26110 },
  { id: 5, name: "Amara Osei", avatar: "AO", color: "bg-yellow-500", time: "1 day ago", text: "From Ghana 🇬🇭 I paid the delivery fee and received my Tesla Model 3 2025! God bless Tesla!", likes: 24030 },
  { id: 6, name: "Priya Sharma", avatar: "PS", color: "bg-teal-500", time: "5 hours ago", text: "From India 🇮🇳 Just got my Tesla Model Y! Paid the fee and it arrived in 7 days. Incredible! 🙌", likes: 18920 },
  { id: 7, name: "James Okafor", avatar: "JO", color: "bg-orange-500", time: "12 hours ago", text: "Nigeria represent! 🇳🇬 Tesla Model 3 delivered to my doorstep. This is legit people!", likes: 15670 },
  { id: 8, name: "Elena Popova", avatar: "EP", color: "bg-indigo-500", time: "1 day ago", text: "Russia 🇷🇺 Got my Tesla Model 3 yesterday! The quality is amazing. Thank you Tesla! ❤️", likes: 12340 },
  { id: 9, name: "Ahmed Hassan", avatar: "AH", color: "bg-red-600", time: "3 hours ago", text: "Egypt 🇪🇬 I couldn't believe it but my Tesla Model S is here! Paid delivery and it came fast!", likes: 9870 },
  { id: 10, name: "Maria Santos", avatar: "MS", color: "bg-rose-500", time: "6 hours ago", text: "Brazil 🇧🇷 Recebi meu Tesla Model 3! Paguei a taxa e chegou em 5 dias. É real! 🚗", likes: 8540 },
  { id: 11, name: "Kenji Tanaka", avatar: "KT", color: "bg-cyan-600", time: "2 days ago", text: "Japan 🇯🇵 Tesla Model 3 2025 delivered! The electric range is incredible. Best giveaway ever!", likes: 7210 },
  { id: 12, name: "Fatou Diallo", avatar: "FD", color: "bg-amber-600", time: "4 hours ago", text: "Senegal 🇸🇳 Mon Tesla Model Y est arrivé! J'ai payé les frais de livraison. Merci Tesla! 🙏", likes: 6890 },
  { id: 13, name: "Liam O'Brien", avatar: "LO", color: "bg-emerald-600", time: "8 hours ago", text: "Ireland 🇮🇪 My Tesla Model Y just arrived! Couldn't believe my eyes when I saw it parked outside! 🍀", likes: 6420 },
  { id: 14, name: "Aisha Mohammed", avatar: "AM", color: "bg-violet-500", time: "1 day ago", text: "Kenya 🇰🇪 Tesla Model 3 delivered to Nairobi! I thought it was a scam but it's 100% REAL! 🙌", likes: 5980 },
  { id: 15, name: "Pierre Dubois", avatar: "PD", color: "bg-sky-600", time: "16 hours ago", text: "France 🇫🇷 Mon Tesla Model S est magnifique! Merci beaucoup Tesla! Incroyable! 🇫🇷❤️", likes: 5540 },
  { id: 16, name: "Hans Mueller", avatar: "HM", color: "bg-zinc-600", time: "2 days ago", text: "Germany 🇩🇪 Tesla Model Y delivered to Berlin! The build quality is outstanding. Danke Tesla! ⚡", likes: 5120 },
  { id: 17, name: "Sofia Rossi", avatar: "SR", color: "bg-fuchsia-500", time: "10 hours ago", text: "Italy 🇮🇹 Il mio Tesla Model 3 è arrivato! Pagato la consegna e in 8 giorni era qui! Grazie! 🚗", likes: 4780 },
  { id: 18, name: "Yuki Yamamoto", avatar: "YY", color: "bg-lime-600", time: "3 hours ago", text: "Japan 🇯🇵 Second Tesla from this giveaway! Got a Model S this time. テスラ最高！🎉", likes: 4350 },
  { id: 19, name: "Omar Al-Said", avatar: "OA", color: "bg-orange-600", time: "5 hours ago", text: "UAE 🇦🇪 Tesla Cybertruck delivered to Dubai! Paid the fee and it arrived so fast! شكراً تسلا 🚗", likes: 3920 },
  { id: 20, name: "Anna Svensson", avatar: "AS", color: "bg-blue-500", time: "1 day ago", text: "Sweden 🇸🇪 My Tesla Model Y arrived in Stockholm! So happy with this giveaway! Tack Tesla! ❄️🚗", likes: 3580 },
  { id: 21, name: "Diego Fernandez", avatar: "DF", color: "bg-red-500", time: "7 hours ago", text: "Spain 🇪🇸 ¡Mi Tesla Model 3 ha llegado! Pagué la entrega y en 10 días estaba aquí. ¡Increíble! 🎉", likes: 3210 },
  { id: 22, name: "Nguyen Thi Lan", avatar: "NL", color: "bg-green-500", time: "4 hours ago", text: "Vietnam 🇻🇳 Tesla Model Y delivered to Ho Chi Minh City! I never imagined this would be real! 🙏", likes: 2890 },
  { id: 23, name: "Chen Wei", avatar: "CW", color: "bg-yellow-600", time: "9 hours ago", text: "China 🇨🇳 我的特斯拉Model 3到了！太不可思议了！Tesla是最好的！🚗⚡", likes: 2560 },
  { id: 24, name: "Kofi Asante", avatar: "KA", color: "bg-purple-500", time: "2 hours ago", text: "Ghana 🇬🇭 My second friend just got his Tesla too! This giveaway is blessing Africa! 🌍🚗", likes: 2230 },
  { id: 25, name: "Rachel Kim", avatar: "RK", color: "bg-pink-600", time: "6 hours ago", text: "South Korea 🇰🇷 Tesla Model S delivered! 테슬라 감사합니다! Best electric car I've ever driven! ⚡", likes: 1950 },
];

const TOTAL_COMMENTS = 70842;

interface VideoCommentsProps {
  maxVisible?: number;
}

export default function VideoComments({ maxVisible = 5 }: VideoCommentsProps) {
  const [expanded, setExpanded] = useState(false);
  const [visibleCount, setVisibleCount] = useState(0);
  const comments = expanded ? BASE_COMMENTS : BASE_COMMENTS.slice(0, maxVisible);

  useEffect(() => {
    if (visibleCount < comments.length) {
      const timer = setTimeout(() => {
        setVisibleCount(prev => prev + 1);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [visibleCount, comments.length]);

  useEffect(() => {
    setVisibleCount(0);
  }, [expanded]);

  const formatLikes = (n: number) => {
    if (n >= 1000) return (n / 1000).toFixed(1).replace(/\.0$/, '') + 'K';
    return n.toLocaleString();
  };

  return (
    <div className="mt-4">
      <p className="text-gray-400 text-xs mb-3 font-semibold">Comments · {TOTAL_COMMENTS.toLocaleString()}</p>
      <div className="space-y-3">
        <AnimatePresence mode="popLayout">
          {comments.slice(0, visibleCount).map((c, i) => (
            <motion.div
              key={c.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.35, delay: i * 0.05 }}
              className="flex gap-3"
            >
              <div className={`w-8 h-8 ${c.color} rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0`}>
                {c.avatar}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-white text-xs font-bold">{c.name}</span>
                  <span className="text-gray-500 text-xs">{c.time}</span>
                  {c.pinned && <span className="text-red-400 text-xs">📌 Pinned</span>}
                </div>
                <p className="text-gray-300 text-xs leading-relaxed">{c.text}</p>
                <div className="flex items-center gap-4 mt-1.5">
                  <button className="flex items-center gap-1 text-gray-500 hover:text-white text-xs">
                    <ThumbsUp className="w-3 h-3" /> {formatLikes(c.likes)}
                  </button>
                  <button className="flex items-center gap-1 text-gray-500 hover:text-white text-xs">
                    <ThumbsDown className="w-3 h-3" />
                  </button>
                  <span className="text-gray-600 text-xs">Reply</span>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
      {BASE_COMMENTS.length > maxVisible && (
        <button onClick={() => setExpanded(!expanded)} className="flex items-center gap-1 text-red-400 text-xs font-semibold mt-3 hover:text-red-300">
          {expanded ? <><ChevronUp className="w-3 h-3" /> Show less</> : <><ChevronDown className="w-3 h-3" /> View {TOTAL_COMMENTS.toLocaleString()} more comments</>}
        </button>
      )}
    </div>
  );
}
