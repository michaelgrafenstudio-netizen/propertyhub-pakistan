"use client";

import React, { useState } from "react";
import {
  Building2,
  Search,
  Smartphone,
  ShieldCheck,
  TrendingUp,
  MapPin,
  Sparkles,
  ArrowRight,
  Heart,
  ChevronDown
} from "lucide-react";

export default function MarketingLandingPage() {
  const [lang, setLang] = useState("en");
  const [selectedCity, setSelectedCity] = useState("Islamabad");

  const content = {
    en: {
      hero_title: "Find Your Dream Property in Pakistan",
      hero_subtitle: "The most trusted real estate marketplace with AI valuations, verified CNIC agents, and secure transactions.",
      search_placeholder: "Enter area, society or project name...",
      download_btn: "Download Mobile App",
      seller_btn: "Post Your Property",
      feature_ai_title: "AI Property Valuation",
      feature_ai_desc: "Estimate actual market pricing for houses or plots using our proprietary machine learning algorithms.",
      feature_verified_title: "100% CNIC Verified",
      feature_verified_desc: "Every property seller and agent goes through biometrics & CNIC approvals by the admin team.",
      feature_chat_title: "Instant Broker Chat",
      feature_chat_desc: "Connect directly with owners or dealers via built-in real-time chat, calls, or WhatsApp.",
      popular_heading: "Popular Properties for Sale",
      stats_users: "50K+",
      stats_listings: "12K+",
      stats_cities: "10+",
    },
    ur: {
      hero_title: "پاکستان میں اپنی خوابوں کی پراپرٹی تلاش کریں",
      hero_subtitle: "مصنوعی ذہانت ویلیوایشن، تصدیق شدہ ایجنٹس اور محفوظ لین دین کے ساتھ سب سے زیادہ قابل اعتماد پراپرٹی مارکیٹ۔",
      search_placeholder: "علاقہ، سوسائٹی یا پروجیکٹ کا نام لکھیں...",
      download_btn: "موبائل ایپ ڈاؤن لوڈ کریں",
      seller_btn: "اپنی پراپرٹی لگائیں",
      feature_ai_title: "مصنوعی ذہانت ویلیوایشن",
      feature_ai_desc: "ہمارے خاص الگورتھم کے ذریعے مکانات یا پلاٹوں کے مارکیٹ ریٹس کا فوری اندازہ لگائیں۔",
      feature_verified_title: "۱۰۰٪ تصدیق شدہ شناختی کارڈ",
      feature_verified_desc: "ہر پراپرٹی بیچنے والے اور ایجنٹ کی دستاویزات اور شناختی کارڈ کی تصدیق ہماری ٹیم کرتی ہے۔",
      feature_chat_title: "ایجنٹ سے فوری گفتگو",
      feature_chat_desc: "ایپ میں موجود لائیو چیٹ، کال یا واٹس ایپ کے ذریعے مالکان اور ڈیلرز سے براہ راست رابطہ کریں۔",
      popular_heading: "مقبول برائے فروخت پراپرٹیز",
      stats_users: "+۵۰ ہزار",
      stats_listings: "+۱۲ ہزار",
      stats_cities: "+۱۰ شہر",
    }
  };

  const t = (key) => content[lang][key] || key;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-indigo-500 selection:text-white">
      {/* Navbar */}
      <header className="border-b border-slate-900 bg-slate-950/80 backdrop-blur sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-20 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="bg-indigo-600 text-white p-2.5 rounded-xl">
              <Building2 className="w-6 h-6" />
            </div>
            <span className="font-extrabold text-2xl tracking-tight bg-gradient-to-r from-indigo-500 to-sky-400 bg-clip-text text-transparent">
              PropertyHub
            </span>
          </div>

          <div className="flex items-center gap-6">
            <button
              onClick={() => setLang(lang === "en" ? "ur" : "en")}
              className="text-sm font-semibold bg-slate-900 px-4 py-2 rounded-xl border border-slate-800 hover:bg-slate-800 transition"
            >
              {lang === "en" ? "اردو" : "English"}
            </button>
            <a
              href="#app-download"
              className="hidden md:inline-flex bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-6 py-2.5 rounded-xl transition text-sm shadow-lg shadow-indigo-600/25"
            >
              {t("download_btn")}
            </a>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-20 pb-32 bg-gradient-to-b from-indigo-950/20 via-slate-950 to-slate-950">
        <div className="max-w-7xl mx-auto px-6 text-center space-y-8 relative z-10">
          <div className="inline-flex items-center gap-2 bg-indigo-500/10 text-indigo-400 px-4 py-2 rounded-full text-xs font-bold border border-indigo-500/25 uppercase tracking-wide">
            <Sparkles className="w-4 h-4" /> Next-Gen Pakistani Real Estate
          </div>

          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight max-w-4xl mx-auto leading-tight">
            {t("hero_title")}
          </h1>

          <p className="text-slate-400 text-lg md:text-xl max-w-2xl mx-auto font-medium">
            {t("hero_subtitle")}
          </p>

          {/* Search Box Card */}
          <div className="max-w-3xl mx-auto p-4 bg-slate-900/80 backdrop-blur border border-slate-800 rounded-3xl shadow-2xl flex flex-col md:flex-row gap-3">
            <div className="flex-1 flex items-center gap-3 px-4">
              <Search className="text-indigo-400 w-5 h-5 flex-shrink-0" />
              <input
                type="text"
                placeholder={t("search_placeholder")}
                className="bg-transparent w-full text-sm font-medium focus:outline-none placeholder-slate-500"
              />
            </div>
            <div className="flex gap-2">
              <button className="bg-slate-800 px-5 py-3.5 rounded-2xl text-sm font-semibold border border-slate-700 hover:bg-slate-700 flex items-center gap-2">
                {selectedCity} <ChevronDown className="w-4 h-4" />
              </button>
              <button className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-8 py-3.5 rounded-2xl text-sm transition flex items-center gap-2">
                Search <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Backdrop Glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-indigo-500/10 rounded-full blur-[160px] pointer-events-none"></div>
      </section>

      {/* Stats Board */}
      <section className="border-y border-slate-900 bg-slate-950 py-12">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-3 text-center gap-6">
          <div>
            <h3 className="text-3xl md:text-5xl font-extrabold text-indigo-500">{t("stats_users")}</h3>
            <p className="text-slate-500 text-xs md:text-sm font-semibold mt-2 uppercase tracking-wide">Active Users</p>
          </div>
          <div className="border-x border-slate-900">
            <h3 className="text-3xl md:text-5xl font-extrabold text-indigo-500">{t("stats_listings")}</h3>
            <p className="text-slate-500 text-xs md:text-sm font-semibold mt-2 uppercase tracking-wide">Total Listings</p>
          </div>
          <div>
            <h3 className="text-3xl md:text-5xl font-extrabold text-indigo-500">{t("stats_cities")}</h3>
            <p className="text-slate-500 text-xs md:text-sm font-semibold mt-2 uppercase tracking-wide">Cities Covered</p>
          </div>
        </div>
      </section>

      {/* Core Features */}
      <section className="py-24 max-w-7xl mx-auto px-6 space-y-16">
        <div className="text-center">
          <h2 className="text-3xl md:text-4xl font-extrabold">Smart Platform Features</h2>
          <p className="text-slate-400 mt-3 max-w-lg mx-auto font-medium">Why buyers and agents choose PropertyHub for transactions.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { title_key: "feature_ai_title", desc_key: "feature_ai_desc", icon: Sparkles, color: "text-indigo-500", bg: "bg-indigo-500/10" },
            { title_key: "feature_verified_title", desc_key: "feature_verified_desc", icon: ShieldCheck, color: "text-emerald-500", bg: "bg-emerald-500/10" },
            { title_key: "feature_chat_title", desc_key: "feature_chat_desc", icon: Smartphone, color: "text-sky-500", bg: "bg-sky-500/10" },
          ].map((feat, idx) => {
            const Icon = feat.icon;
            return (
              <div key={idx} className="p-8 bg-slate-900/40 border border-slate-900 rounded-3xl space-y-6 hover:border-slate-800 transition-all flex flex-col justify-between">
                <div className={`${feat.bg} ${feat.color} p-4 rounded-2xl w-fit`}>
                  <Icon className="w-6 h-6" />
                </div>
                <div className="space-y-3">
                  <h3 className="text-xl font-bold">{t(feat.title_key)}</h3>
                  <p className="text-slate-400 text-sm leading-relaxed">{t(feat.desc_key)}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Featured Properties */}
      <section className="py-24 border-t border-slate-900 bg-slate-900/10">
        <div className="max-w-7xl mx-auto px-6 space-y-12">
          <div className="flex justify-between items-end">
            <div>
              <h2 className="text-3xl font-extrabold">{t("popular_heading")}</h2>
              <p className="text-slate-400 mt-2">Verified listings on our platform</p>
            </div>
            <button className="text-indigo-400 hover:text-indigo-300 font-bold flex items-center gap-1.5 text-sm transition">
              See All <ArrowRight className="w-4.5 h-4.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: "5 Marla Luxury House in DHA 6",
                city: "Lahore",
                price: "1.85 Crore PKR",
                image: "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&q=80&w=400",
              },
              {
                title: "2 Bed Apartment Centaurus",
                city: "Islamabad",
                price: "1.25 Lakh / month",
                image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&q=80&w=400",
              },
              {
                title: "1 Kanal Plot in Bahria Town",
                city: "Karachi",
                price: "3.2 Crore PKR",
                image: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&q=80&w=400",
              },
            ].map((prop, idx) => (
              <div key={idx} className="bg-slate-900/60 border border-slate-900 rounded-3xl overflow-hidden hover:border-slate-800 transition">
                <img src={prop.image} alt={prop.title} className="w-full h-48 object-cover" />
                <div className="p-6 space-y-4">
                  <div>
                    <span className="text-xs font-semibold text-indigo-400 uppercase tracking-wider">{prop.city}</span>
                    <h4 className="font-bold text-lg line-clamp-1 mt-1">{prop.title}</h4>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-emerald-500">{prop.price}</span>
                    <button className="text-slate-400 hover:text-rose-500 transition">
                      <Heart className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Download CTA Section */}
      <section id="app-download" className="py-28 bg-indigo-950/20 border-t border-slate-900 text-center relative overflow-hidden">
        <div className="max-w-4xl mx-auto px-6 space-y-8 relative z-10">
          <Smartphone className="w-12 h-12 mx-auto text-indigo-400" />
          <h2 className="text-4xl font-extrabold">Ready to Explore PropertyHub?</h2>
          <p className="text-slate-400 text-lg max-w-xl mx-auto">
            Get instant push notifications for direct chat messages, property status updates, and custom recommendations on your phone.
          </p>
          <div className="flex flex-wrap justify-center gap-4 pt-4">
            <button className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-8 py-3.5 rounded-2xl transition shadow-lg shadow-indigo-600/20 text-sm">
              Get App on Google Play
            </button>
            <button className="bg-slate-900 hover:bg-slate-800 text-white font-bold px-8 py-3.5 rounded-2xl border border-slate-800 transition text-sm">
              Get App on App Store
            </button>
          </div>
        </div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] bg-indigo-500/5 rounded-full blur-[140px] pointer-events-none"></div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950 py-12 text-center text-slate-600 text-sm font-medium">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2.5">
            <Building2 className="w-5 h-5 text-indigo-500" />
            <span className="font-extrabold text-lg tracking-tight text-slate-400">PropertyHub Pakistan</span>
          </div>
          <p>© 2026 PropertyHub Pakistan. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
