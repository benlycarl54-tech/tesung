import { Button } from "@/components/ui/button";
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const steps = [
  { step: "01", title: "Register Your Details", description: "Enter your name, delivery address, and contact information so Tesla can ship your car directly to you." },
  { step: "02", title: "Choose Your Tesla Car", description: "Select your preferred Tesla model: Model 3, Model Y, Model S, or Model X — all brand new!" },
  { step: "03", title: "Pay Delivery Fee", description: "Pay the small one-time delivery fee to cover shipping and logistics. This is the only fee required." },
  { step: "04", title: "Receive Your Tesla Car", description: "Your brand new Tesla electric car will be delivered to your door within 7–14 business days. Enjoy!" },
];

export default function InstructionSection() {
  return (
    <section id="instruction" className="py-20 bg-gray-50">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl font-black text-gray-900">
            How to Claim Your <span className="text-red-600">Tesla Car</span>
          </h2>
          <p className="text-gray-600 mt-4 text-lg max-w-xl mx-auto">
            Follow these simple steps to receive your brand new Tesla electric car giveaway
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.15 }}
              className="relative"
            >
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-10 left-full w-full z-10">
                  <ArrowRight className="w-6 h-6 text-red-300 -ml-3" />
                </div>
              )}
              <div className="bg-white rounded-2xl p-6 shadow-md border border-gray-100 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 h-full">
                <div className="w-12 h-12 bg-red-600 rounded-xl flex items-center justify-center mb-4">
                  <span className="text-white font-black text-lg">{step.step}</span>
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{step.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{step.description}</p>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="text-center mt-10"
        >
          <Link to="/Participate">
            <Button className="bg-red-600 hover:bg-red-700 text-white px-8 py-4 text-lg font-bold rounded-xl">
              🚗 Start Claiming Your Tesla Now →
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
