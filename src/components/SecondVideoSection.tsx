import { useState } from 'react';
import { Check, ThumbsUp, ThumbsDown, ChevronDown, ChevronUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const TESTIMONIALS = [
  { id: 1, name: "Mike Johnson", avatar: "MJ", color: "bg-blue-600", country: "🇺🇸 USA", time: "2 days ago", text: "I received my Tesla car!! I paid the delivery fee and within a week my brand new Tesla Model 3 arrived at my door. 🚗⚡", likes: 4821, pinned: true },
  { id: 2, name: "Sarah Williams", avatar: "SW", color: "bg-pink-500", country: "🇺🇸 USA", time: "1 day ago", text: "Just received my Tesla car after paying for the delivery fee. I cried when I saw the car parked outside! 🙏", likes: 3244 },
  { id: 3, name: "Carlos Mendez", avatar: "CM", color: "bg-green-600", country: "🇲🇽 Mexico", time: "3 days ago", text: "From Mexico! I received my Tesla car after paying the delivery fee. This giveaway is 100% real.", likes: 2918 },
  { id: 4, name: "David Chen", avatar: "DC", color: "bg-purple-600", country: "🇨🇳 China", time: "2 days ago", text: "I was skeptical at first but I paid the delivery fee and received my Tesla EV. Amazing!", likes: 2611 },
  { id: 5, name: "Amara Osei", avatar: "AO", color: "bg-yellow-500", country: "🇬🇭 Ghana", time: "1 day ago", text: "From Ghana 🇬🇭 I paid for the delivery fee and received my Tesla car! God bless Tesla!", likes: 2403 },
  { id: 6, name: "Yuki Tanaka", avatar: "YT", color: "bg-cyan-600", country: "🇯🇵 Japan", time: "5 hours ago", text: "Japan 🇯🇵 Tesla Model Y delivered! テスラ最高！The electric range is unbelievable!", likes: 2180 },
  { id: 7, name: "Pierre Laurent", avatar: "PL", color: "bg-indigo-500", country: "🇫🇷 France", time: "12 hours ago", text: "France 🇫🇷 Mon Tesla Model S est arrivé! C'est incroyable! Merci Tesla! 🚗", likes: 1940 },
  { id: 8, name: "Fatima Al-Rashid", avatar: "FA", color: "bg-orange-500", country: "🇦🇪 UAE", time: "8 hours ago", text: "Dubai 🇦🇪 Tesla Cybertruck just arrived! I paid the fee and it was here in 5 days! شكراً!", likes: 1720 },
  { id: 9, name: "Lucas Santos", avatar: "LS", color: "bg-emerald-600", country: "🇧🇷 Brazil", time: "3 hours ago", text: "Brazil 🇧🇷 Meu Tesla Model 3 chegou! Paguei a taxa e em uma semana estava na minha porta! 🎉", likes: 1530 },
  { id: 10, name: "Sophie Anderson", avatar: "SA", color: "bg-rose-500", country: "🇬🇧 UK", time: "6 hours ago", text: "UK 🇬🇧 My Tesla Model Y arrived in London! Brilliant quality, best giveaway ever! 🚗⚡", likes: 1340 },
  { id: 11, name: "Kofi Mensah", avatar: "KM", color: "bg-amber-600", country: "🇬🇭 Ghana", time: "1 day ago", text: "Ghana 🇬🇭 Second person in my family to get a Tesla! My brother got his Model 3 last week! 🙌", likes: 1180 },
  { id: 12, name: "Anna Petrova", avatar: "AP", color: "bg-violet-500", country: "🇷🇺 Russia", time: "4 hours ago", text: "Russia 🇷🇺 Мой Tesla Model S доставлен! Невероятно! Thank you Tesla! ❤️", likes: 1020 },
  { id: 13, name: "Hassan Ali", avatar: "HA", color: "bg-teal-500", country: "🇪🇬 Egypt", time: "2 hours ago", text: "Egypt 🇪🇬 Tesla Model 3 delivered to Cairo! I was shocked when it actually arrived! 🚗", likes: 890 },
  { id: 14, name: "Maria Garcia", avatar: "MG", color: "bg-red-500", country: "🇪🇸 Spain", time: "9 hours ago", text: "Spain 🇪🇸 ¡Mi Tesla Model Y ha llegado a Madrid! ¡Esto es real! Gracias Tesla! 🎉", likes: 760 },
  { id: 15, name: "Kim Soo-Jin", avatar: "KS", color: "bg-blue-500", country: "🇰🇷 South Korea", time: "7 hours ago", text: "Korea 🇰🇷 테슬라 모델3 받았습니다! 배송비만 내면 됩니다! 진짜입니다! ⚡", likes: 640 },
  { id: 16, name: "Olga Ivanova", avatar: "OI", color: "bg-pink-600", country: "🇺🇦 Ukraine", time: "4 hours ago", text: "Ukraine 🇺🇦 My Tesla Model 3 arrived in Kyiv! I paid the delivery fee and it came in 12 days! Дякую Tesla! 🚗", likes: 580 },
  { id: 17, name: "Abdul Rahman", avatar: "AR", color: "bg-green-500", country: "🇸🇦 Saudi Arabia", time: "1 day ago", text: "Saudi Arabia 🇸🇦 Tesla Model S delivered to Riyadh! شكراً تسلا! Best electric car ever! ⚡", likes: 520 },
  { id: 18, name: "Emma Johansson", avatar: "EJ", color: "bg-sky-500", country: "🇸🇪 Sweden", time: "10 hours ago", text: "Sweden 🇸🇪 Tesla Model Y arrived in Stockholm! Tack så mycket Tesla! The design is stunning! 🎉", likes: 470 },
  { id: 19, name: "Chidi Nwosu", avatar: "CN", color: "bg-orange-600", country: "🇳🇬 Nigeria", time: "6 hours ago", text: "Nigeria 🇳🇬 Tesla Model 3 delivered to Lagos! Na real deal be this! Thank you Tesla! 🙏🚗", likes: 430 },
  { id: 20, name: "Isabella Müller", avatar: "IM", color: "bg-fuchsia-500", country: "🇩🇪 Germany", time: "8 hours ago", text: "Germany 🇩🇪 Mein Tesla Model Y ist angekommen! Danke Tesla! Die Qualität ist unglaublich! ⚡", likes: 390 },
  { id: 21, name: "Takeshi Yamamoto", avatar: "TY", color: "bg-lime-600", country: "🇯🇵 Japan", time: "3 hours ago", text: "Japan 🇯🇵 2台目のTesla! Model S this time. テスラ最高！Amazing autopilot! 🎉", likes: 350 },
  { id: 22, name: "Grace Achieng", avatar: "GA", color: "bg-cyan-500", country: "🇰🇪 Kenya", time: "5 hours ago", text: "Kenya 🇰🇪 Tesla Model 3 delivered to Nairobi! I'm still in shock! This is real people! 🚗❤️", likes: 310 },
  { id: 23, name: "Marco Rossi", avatar: "MR", color: "bg-red-600", country: "🇮🇹 Italy", time: "11 hours ago", text: "Italy 🇮🇹 Il mio Tesla Model Y è arrivato a Roma! Pagato la consegna, arrivato in 9 giorni! Grazie! 🎉", likes: 280 },
  { id: 24, name: "Aisha Bello", avatar: "AB", color: "bg-purple-500", country: "🇳🇬 Nigeria", time: "2 hours ago", text: "Nigeria 🇳🇬 My sister and I both got Tesla Model 3s! This giveaway is blessing Africa! 🌍🚗", likes: 250 },
  { id: 25, name: "Henrik Nielsen", avatar: "HN", color: "bg-blue-700", country: "🇩🇰 Denmark", time: "7 hours ago", text: "Denmark 🇩🇰 Tesla Model S delivered to Copenhagen! Tak Tesla! Best car I've ever driven! ⚡🇩🇰", likes: 220 },
  { id: 26, name: "Priya Patel", avatar: "PP", color: "bg-amber-500", country: "🇮🇳 India", time: "1 hour ago", text: "India 🇮🇳 Tesla Model 3 delivered to Mumbai! Paid the fee and it arrived so fast! धन्यवाद Tesla! 🙏", likes: 195 },
  { id: 27, name: "Chen Wei Ming", avatar: "CW", color: "bg-emerald-500", country: "🇹🇼 Taiwan", time: "4 hours ago", text: "Taiwan 🇹🇼 我的特斯拉Model Y到了！太棒了！Tesla is the best! 🚗⚡", likes: 170 },
  { id: 28, name: "Roberto Silva", avatar: "RS", color: "bg-yellow-600", country: "🇦🇷 Argentina", time: "9 hours ago", text: "Argentina 🇦🇷 ¡Mi Tesla Model 3 llegó a Buenos Aires! Pagué el envío y llegó perfecto! ¡Increíble! 🎉", likes: 150 },
  { id: 29, name: "Nadia Kuznetsova", avatar: "NK", color: "bg-indigo-600", country: "🇷🇺 Russia", time: "6 hours ago", text: "Russia 🇷🇺 Tesla Cybertruck delivered to Moscow! Невероятный дизайн! Thank you Tesla! 🚗", likes: 130 },
  { id: 30, name: "James Mwangi", avatar: "JM", color: "bg-teal-600", country: "🇰🇪 Kenya", time: "30 minutes ago", text: "Kenya 🇰🇪 Just got my Tesla Model Y! Third person in my neighborhood! This is changing lives! 🙌❤️", likes: 110 },
];

const TOTAL_COMMENTS = 75600;

export default function SecondVideoSection() {
  const [subscribed, setSubscribed] = useState(false);
  const [showAll, setShowAll] = useState(false);
  const visibleComments = showAll ? TESTIMONIALS : TESTIMONIALS.slice(0, 5);

  return (
    <section className="py-20 bg-gray-950">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-10"
        >
          <h2 className="text-4xl font-black text-white">
            More <span className="text-red-500">Proof</span> from Winners
          </h2>
          <p className="text-gray-400 mt-3 text-lg max-w-2xl mx-auto">
            Watch real testimonials from Tesla car recipients around the world.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-sm mx-auto md:max-w-md"
        >
          <div className="relative rounded-2xl overflow-hidden shadow-2xl shadow-red-900/30 border border-gray-800 bg-black">
            <div className="relative w-full" style={{ paddingBottom: '177.78%' }}>
              <iframe
                src="https://www.youtube.com/embed/XDkzm_LR0Co?rel=0&modestbranding=1&fs=1&playsinline=1"
                title="Tesla Winners Testimonials"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                className="absolute inset-0 w-full h-full"
              />
            </div>
          </div>

          <div className="mt-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img
                src="/images/tesla-logo.png"
                alt="Tesla"
                className="w-10 h-10 rounded-full object-contain bg-white border border-red-600 p-0.5"
              />
              <div>
                <p className="text-white text-sm font-bold">Tesla Global</p>
                <p className="text-gray-400 text-xs">12.8M subscribers</p>
              </div>
            </div>
            <button
              onClick={() => setSubscribed(true)}
              className={`px-4 py-2 rounded-full text-sm font-bold transition-colors ${subscribed ? 'bg-gray-700 text-gray-300' : 'bg-red-600 hover:bg-red-700 text-white'}`}
            >
              {subscribed ? <span className="flex items-center gap-1"><Check className="w-3 h-3" /> Subscribed</span> : 'Subscribe'}
            </button>
          </div>

          <div className="mt-4">
            <p className="text-gray-400 text-xs mb-3 font-semibold">Comments · {TOTAL_COMMENTS.toLocaleString()}</p>
            <AnimatePresence mode="popLayout">
              <div className="space-y-3">
                {visibleComments.map((c, i) => (
                  <motion.div
                    key={c.id}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: i * 0.05 }}
                    className="flex gap-3"
                  >
                    <div className={`w-8 h-8 ${c.color} rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0`}>
                      {c.avatar}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-white text-xs font-bold">{c.name}</span>
                        <span className="text-gray-500 text-xs">{c.country}</span>
                        <span className="text-gray-500 text-xs">{c.time}</span>
                        {c.pinned && <span className="text-red-400 text-xs">📌</span>}
                      </div>
                      <p className="text-gray-300 text-xs leading-relaxed">{c.text}</p>
                      <div className="flex items-center gap-4 mt-1.5">
                        <button className="flex items-center gap-1 text-gray-500 hover:text-white text-xs">
                          <ThumbsUp className="w-3 h-3" /> {c.likes.toLocaleString()}
                        </button>
                        <button className="flex items-center gap-1 text-gray-500 hover:text-white text-xs">
                          <ThumbsDown className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </AnimatePresence>
            {TESTIMONIALS.length > 5 && (
              <button onClick={() => setShowAll(!showAll)} className="flex items-center gap-1 text-red-400 text-xs font-semibold mt-3 hover:text-red-300">
                {showAll ? <><ChevronUp className="w-3 h-3" /> Show less</> : <><ChevronDown className="w-3 h-3" /> View {TOTAL_COMMENTS.toLocaleString()} more comments</>}
              </button>
            )}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
