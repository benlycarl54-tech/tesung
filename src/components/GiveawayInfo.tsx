import { motion } from 'framer-motion';

const prizes = [
  { 
    label: "Tesla Model 3 2025", 
    amount: "Electric Sedan", 
    sub: "358mi range · 510hp", 
    color: "from-red-50 to-red-100", 
    badge: "Most Popular", 
    img: "/images/tesla-model-3.jpg" 
  },
  { 
    label: "Tesla Model Y 2025", 
    amount: "Electric SUV", 
    sub: "330mi range · 384hp", 
    color: "from-blue-50 to-blue-100", 
    badge: "Best SUV", 
    img: "/images/tesla-model-y.jpg" 
  },
  { 
    label: "Tesla Model S 2025", 
    amount: "Luxury Sedan", 
    sub: "405mi range · 670hp", 
    color: "from-gray-50 to-gray-100", 
    badge: "Premium", 
    img: "/images/tesla-model-s.jpg" 
  },
  { 
    label: "Tesla Model X 2025", 
    amount: "Luxury SUV", 
    sub: "348mi range · 670hp", 
    color: "from-green-50 to-green-100", 
    badge: "Eco Pick", 
    img: "/images/tesla-model-x.jpg" 
  },
];

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.15 } },
};

const cardVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" as const } },
};

export default function GiveawayInfo() {
  return (
    <section id="info" className="py-20 bg-white">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl font-black text-gray-900">
            Available <span className="text-red-600">Tesla Cars</span>
          </h2>
          <p className="text-gray-600 mt-4 text-lg max-w-2xl mx-auto">
            Choose your preferred Tesla electric car. All models are brand new{' '}
            <strong className="text-red-600">2024–2025</strong> editions delivered straight to your door.
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="grid md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {prizes.map((prize, index) => (
            <motion.div key={index} variants={cardVariants}
              className={`bg-gradient-to-br ${prize.color} rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 text-center relative`}>
              <div className="absolute top-3 right-3">
                <span className="bg-red-600 text-white text-xs font-bold px-2 py-1 rounded-full">{prize.badge}</span>
              </div>
              <img src={prize.img} alt={prize.label} className="w-full h-32 object-contain rounded-xl mb-4" />
              <h3 className="text-xl font-black text-gray-900">{prize.label}</h3>
              <p className="text-red-600 font-bold text-lg mt-1">{prize.amount}</p>
              <p className="text-gray-500 text-sm mt-2">{prize.sub}</p>
              <div className="mt-4 bg-white rounded-xl py-2 px-4 border border-gray-200">
                <span className="text-green-600 font-bold text-sm">FREE 🎉</span>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}