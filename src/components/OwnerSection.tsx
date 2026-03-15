import { CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';

export default function OwnerSection() {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl font-black text-gray-900">
            Straight from the <span className="text-red-600">CEO</span>
          </h2>
          <p className="text-gray-600 mt-4 text-lg">Official announcements from Tesla's leadership</p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="bg-white border border-gray-200 rounded-2xl p-6 shadow-md hover:shadow-xl transition-shadow"
          >
            <div className="flex items-center gap-3 mb-4">
              <img
                src="/images/elon-musk.jpg"
                alt="Elon Musk"
                className="w-12 h-12 rounded-full object-cover border-2 border-red-500"
              />
              <div>
                <div className="flex items-center gap-1">
                  <span className="font-bold text-gray-900">Elon Musk</span>
                  <CheckCircle className="w-4 h-4 text-blue-500 fill-blue-500" />
                </div>
                <span className="text-gray-500 text-sm">CEO, Tesla, Inc.</span>
              </div>
            </div>
            <p className="text-gray-800 leading-relaxed mb-4">
              Tesla is committed to accelerating the world's transition to sustainable energy.
              As part of our mission, we're launching a worldwide giveaway of our electric vehicles — completely free.
              Just cover the delivery cost and a brand-new Tesla will be shipped directly to your door. 🚗⚡
            </p>
            <div className="flex items-center gap-4 text-gray-400 text-sm">
              <span>❤️ 128K</span>
              <span>🔁 47K</span>
              <span>💬 8.2K</span>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-white border border-gray-200 rounded-2xl p-6 shadow-md hover:shadow-xl transition-shadow"
          >
            <div className="flex items-center gap-3 mb-4">
              <img
                src="/images/tesla-logo.png"
                alt="Tesla Official"
                className="w-12 h-12 rounded-full object-contain border-2 border-red-500 bg-white p-1"
              />
              <div>
                <div className="flex items-center gap-1">
                  <span className="font-bold text-gray-900">Tesla Official</span>
                  <CheckCircle className="w-4 h-4 text-blue-500 fill-blue-500" />
                </div>
                <span className="text-gray-500 text-sm">@Tesla · Official Account</span>
              </div>
            </div>
            <p className="text-gray-800 leading-relaxed mb-4">
              📢 OFFICIAL ANNOUNCEMENT: Our global Tesla car giveaway is NOW LIVE!
              🌍 Open to ALL countries. No purchase necessary — just cover the one-time delivery fee.
              Model 3, Model Y, Model S, Model X and more available. Don't miss out! 🎁🚗
            </p>
            <div className="flex items-center gap-4 text-gray-400 text-sm">
              <span>❤️ 215K</span>
              <span>🔁 89K</span>
              <span>💬 14K</span>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}