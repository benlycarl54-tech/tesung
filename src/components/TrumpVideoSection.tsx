import { useState } from 'react';
import VideoComments from './VideoComments';
import { Check, ThumbsUp, ThumbsDown, Share2, Download } from 'lucide-react';
import { motion } from 'framer-motion';

export default function TrumpVideoSection() {
  const [subscribed, setSubscribed] = useState(false);

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
          <div className="inline-flex items-center gap-2 bg-red-600/20 border border-red-500/40 rounded-full px-4 py-1.5 mb-4">
            <span className="relative flex w-2 h-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
              <span className="relative inline-flex rounded-full w-2 h-2 bg-red-500" />
            </span>
            <span className="text-red-400 text-sm font-bold uppercase tracking-wide">Official Announcement</span>
          </div>
          <h2 className="text-4xl font-black text-white">
            Tesla's <span className="text-red-500">Global Car</span> Giveaway
          </h2>
          <p className="text-gray-400 mt-3 text-lg max-w-2xl mx-auto">
            Watch Tesla's official announcement of their biggest car giveaway for all countries worldwide.
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
                src="https://www.youtube.com/embed/XTeWKmlNmN8?rel=0&modestbranding=1&fs=1&playsinline=1"
                title="Tesla Official Announcement"
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
                <p className="text-white text-sm font-bold">Tesla Official</p>
                <p className="text-gray-400 text-xs">28.4M subscribers</p>
              </div>
            </div>
            <button
              onClick={() => setSubscribed(true)}
              className={`px-4 py-2 rounded-full text-sm font-bold transition-colors ${subscribed ? 'bg-gray-700 text-gray-300' : 'bg-red-600 hover:bg-red-700 text-white'}`}
            >
              {subscribed ? <span className="flex items-center gap-1"><Check className="w-3 h-3" /> Subscribed</span> : 'Subscribe'}
            </button>
          </div>

          <div className="mt-3 flex items-center gap-2 flex-wrap">
            <button className="flex items-center gap-1.5 bg-gray-800 hover:bg-gray-700 text-white text-xs font-semibold px-3 py-1.5 rounded-full transition-colors">
              <ThumbsUp className="w-3.5 h-3.5" /> 1.2M
            </button>
            <button className="flex items-center gap-1.5 bg-gray-800 hover:bg-gray-700 text-white text-xs font-semibold px-3 py-1.5 rounded-full transition-colors">
              <ThumbsDown className="w-3.5 h-3.5" />
            </button>
            <button className="flex items-center gap-1.5 bg-gray-800 hover:bg-gray-700 text-white text-xs font-semibold px-3 py-1.5 rounded-full transition-colors">
              <Share2 className="w-3.5 h-3.5" /> Share
            </button>
            <button className="flex items-center gap-1.5 bg-gray-800 hover:bg-gray-700 text-white text-xs font-semibold px-3 py-1.5 rounded-full transition-colors">
              <Download className="w-3.5 h-3.5" /> Download
            </button>
          </div>

          <VideoComments maxVisible={5} />
        </motion.div>
      </div>
    </section>
  );
}
