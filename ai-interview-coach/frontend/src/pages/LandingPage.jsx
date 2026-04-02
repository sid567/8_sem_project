import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, BarChart2, Mic, FileText, Shield, CheckCircle } from 'lucide-react';

const steps = [
  { num: '01', title: 'Upload your CV', desc: 'Drop your PDF or DOCX. Our AI reads your background in seconds.', icon: FileText },
  { num: '02', title: 'Speak naturally', desc: 'Answer questions out loud just like a real interview — the AI listens.', icon: Mic },
  { num: '03', title: 'Get your report', desc: 'See a detailed breakdown of technical depth, clarity and confidence.', icon: BarChart2 },
];

const testimonials = [
  { name: 'Priya Sharma', role: 'Got placed at Infosys', quote: 'I was terrified of interviews. After three sessions here I walked into the real one totally calm.' },
  { name: 'Aarav Mehta', role: 'Got placed at TCS', quote: 'The AI caught filler words I never even noticed. My clarity score went from 60 to 92 in a week.' },
  { name: 'Sneha Roy', role: 'Campus placement at Wipro', quote: "It's like having a senior engineer quiz you — but with zero judgment and infinite patience." },
];

export default function LandingPage() {
  return (
    <div className="bg-[#030712] text-slate-100 overflow-x-hidden">

      {/* ── HERO ─────────────────────────────────────────────── */}
      <section className="relative min-h-screen flex items-center justify-center pt-24 pb-20 px-6">
        {/* Ambient glow */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-indigo-700/20 rounded-full blur-[140px]" />
          <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-purple-700/15 rounded-full blur-[120px]" />
        </div>

        <div className="relative z-10 max-w-5xl mx-auto text-center space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-indigo-500/30 bg-indigo-500/10 text-indigo-300 text-sm font-medium"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse" />
            Final Year Project · AI + NLP
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.1 }}
            className="text-5xl sm:text-6xl md:text-[72px] font-bold font-heading leading-[1.1] tracking-tight"
          >
            Interview prep that<br />
            <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              actually works
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.18 }}
            className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed"
          >
            Upload your CV. Answer AI-generated questions out loud. Walk away with a detailed scorecard — <span className="text-slate-300 font-medium">before the real interview even happens.</span>
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.26 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4"
          >
            <Link to="/signup">
              <button className="group flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold px-7 py-3.5 rounded-xl text-base transition-all duration-200 shadow-lg shadow-indigo-600/25 hover:shadow-indigo-600/40 hover:-translate-y-0.5">
                Get started free
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform duration-200" />
              </button>
            </Link>
            <Link to="/upload">
              <button className="flex items-center gap-2 text-slate-300 hover:text-white bg-slate-800/60 hover:bg-slate-800 border border-slate-700/60 font-medium px-7 py-3.5 rounded-xl text-base transition-all duration-200">
                Try without account
              </button>
            </Link>
          </motion.div>

          {/* Trust badges */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="flex flex-wrap items-center justify-center gap-6 pt-6 text-slate-600 text-xs"
          >
            {['No credit card required', 'CV processed securely', 'Powered by Groq LLM'].map(t => (
              <span key={t} className="flex items-center gap-1.5">
                <CheckCircle size={13} className="text-indigo-500" />
                {t}
              </span>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── HOW IT WORKS ──────────────────────────────────────── */}
      <section className="py-24 px-6 border-t border-slate-800/50">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-indigo-400 text-sm font-semibold uppercase tracking-widest mb-3">How it works</p>
            <h2 className="text-3xl md:text-4xl font-bold font-heading text-white">Three steps to confidence</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {steps.map((step, i) => (
              <motion.div
                key={step.num}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.12 }}
                className="relative group"
              >
                <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-7 h-full hover:border-indigo-500/40 transition-colors duration-300">
                  <div className="flex items-center gap-4 mb-5">
                    <span className="text-4xl font-bold font-heading text-slate-800 select-none">{step.num}</span>
                    <div className="w-10 h-10 rounded-lg bg-indigo-500/10 flex items-center justify-center text-indigo-400 group-hover:bg-indigo-500/20 transition-colors">
                      <step.icon size={20} />
                    </div>
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2 font-heading">{step.title}</h3>
                  <p className="text-slate-500 text-sm leading-relaxed">{step.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ──────────────────────────────────────── */}
      <section className="py-24 px-6 border-t border-slate-800/50">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-indigo-400 text-sm font-semibold uppercase tracking-widest mb-3">What students say</p>
            <h2 className="text-3xl md:text-4xl font-bold font-heading text-white">It helped real people</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <motion.div
                key={t.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="bg-slate-900/50 border border-slate-800 rounded-2xl p-7 flex flex-col justify-between gap-5 hover:border-slate-700 transition-colors"
              >
                <p className="text-slate-300 text-sm leading-relaxed italic">"{t.quote}"</p>
                <div className="flex items-center gap-3 pt-2 border-t border-slate-800">
                  <div className="w-9 h-9 rounded-full bg-indigo-500/20 flex items-center justify-center text-indigo-400 font-bold text-sm font-heading">
                    {t.name[0]}
                  </div>
                  <div>
                    <p className="text-white text-sm font-semibold">{t.name}</p>
                    <p className="text-slate-600 text-xs">{t.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ───────────────────────────────────────────────── */}
      <section className="py-24 px-6 border-t border-slate-800/50">
        <div className="max-w-2xl mx-auto text-center space-y-6">
          <Shield size={36} className="mx-auto text-indigo-500 mb-2" />
          <h2 className="text-3xl md:text-4xl font-bold font-heading text-white">Ready to stop winging it?</h2>
          <p className="text-slate-400">Your next interview could be weeks away. Use that time well.</p>
          <Link to="/signup">
            <button className="group inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold px-8 py-4 rounded-xl text-base transition-all duration-200 shadow-lg shadow-indigo-600/25 hover:shadow-indigo-600/40 mt-4 hover:-translate-y-0.5">
              Create free account
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform duration-200" />
            </button>
          </Link>
        </div>
      </section>

    </div>
  );
}
