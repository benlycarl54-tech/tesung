import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const TESLA_CAR = "/images/tesla-model-s.jpg";
const BASE_COUNT = 12847;

export default function HeroSection() {
  const [count, setCount] = useState(BASE_COUNT);

  useEffect(() => {
    const t = setInterval(() => {
      setCount(prev => prev + Math.floor(Math.random() * 3));
    }, 3000);
    return () => clearInterval(t);
  }, []);

  return (
    <section id="giveaway" className="bg-gradient-to-br from-gray-50 via-white to-gray-100 min-h-screen relative overflow-hidden flex items-center">
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 right-0 w-96 h-96 bg-red-500 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-red-400 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-6 py-16 relative z-10">
        <div className="grid lg:grid-cols-2 gap-8 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <div className="flex flex-wrap items-center gap-3 mb-8">
              <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.3 }}
                className="inline-flex items-center gap-2 bg-white border border-gray-200 rounded-full px-4 py-2 shadow-sm">
                <CheckCircle className="w-4 h-4 text-red-600 fill-red-600" />
                <span className="text-sm font-semibold text-gray-700">Official Event</span>
              </motion.div>
              <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.5 }}
                className="inline-flex items-center gap-2 bg-green-50 border border-green-200 rounded-full px-4 py-2 shadow-sm">
                <span className="relative flex w-2 h-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                  <span className="relative inline-flex rounded-full w-2 h-2 bg-green-500" />
                </span>
                <span className="text-sm font-semibold text-green-700">LIVE — {count.toLocaleString()} joined</span>
              </motion.div>
            </div>

            <h1 className="text-5xl lg:text-7xl font-black text-gray-900 leading-tight">
              Win a <span className="text-red-600">Brand New</span> Tesla Electric Car
            </h1>

            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}
              className="text-gray-600 mt-6 text-lg max-w-lg">
              Tesla, the world's leading electric vehicle manufacturer, is giving away brand new electric cars to participants worldwide. Claim your car today!
            </motion.p>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 }}
              className="flex flex-col sm:flex-row gap-4 mt-8">
              <Link to="/Participate">
                <Button className="bg-red-600 hover:bg-red-700 text-white px-8 py-6 text-lg font-bold rounded-xl shadow-lg shadow-red-200">
                  🚗 Claim Your Free Car →
                </Button>
              </Link>
              <a href="#participate">
                <Button variant="outline" className="border-2 border-gray-300 text-gray-800 hover:bg-gray-50 px-8 py-6 text-lg font-bold rounded-xl">
                  View All Models
                </Button>
              </a>
            </motion.div>

            <div className="flex items-center gap-6 mt-10">
              {["🔒 SSL Secured", "✅ Verified", "🌍 Global"].map((t, i) => (
                <span key={i} className="text-gray-500 text-sm font-medium">{t}</span>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.3 }}
            className="relative"
          >
            <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-3xl p-6 shadow-xl border border-red-100">
              <img src={TESLA_CAR} alt="Tesla Electric Car" className="w-full h-auto rounded-2xl" />
              <div className="mt-4 text-center">
                <p className="text-red-600 font-black text-2xl">Tesla Electric Car</p>
                <p className="text-gray-500 mt-1">100% Free — Just Pay Delivery</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}