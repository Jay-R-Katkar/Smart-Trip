import React, { useState } from 'react';
import { 
  Users, 
  Star, 
  ShieldCheck, 
  Languages, 
  Award, 
  DollarSign, 
  Calendar, 
  Clock, 
  Phone, 
  CheckCircle2, 
  Sparkles, 
  ArrowRight,
  X,
  MessageSquare
} from 'lucide-react';
import confetti from 'canvas-confetti';

export function GuideProfiles({ 
  currentCity = 'Paris', 
  guides = [], 
  onBookGuide 
}) {
  const [selectedLanguage, setSelectedLanguage] = useState('All');
  const [selectedExpertise, setSelectedExpertise] = useState('All');
  const [selectedGuide, setSelectedGuide] = useState(null);
  const [bookingHours, setBookingHours] = useState(4);
  const [bookingDate, setBookingDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 15);
    return d.toISOString().split('T')[0];
  });
  const [bookingVoucher, setBookingVoucher] = useState(null);
  const [isBooking, setIsBooking] = useState(false);

  const languages = ['All', 'English', 'French', 'Spanish', 'Japanese', 'Hindi', 'German'];
  const expertises = ['All', 'History', 'Food', 'Photo', 'Tech', 'Culture', 'Temples'];

  // Filter guides
  const filteredGuides = guides.filter((g) => {
    const matchCity = !currentCity || g.city.toLowerCase() === currentCity.toLowerCase();
    const matchLang = selectedLanguage === 'All' || g.languages.toLowerCase().includes(selectedLanguage.toLowerCase());
    const matchExp = selectedExpertise === 'All' || g.expertise.toLowerCase().includes(selectedExpertise.toLowerCase());
    return matchCity && matchLang && matchExp;
  });

  const handleOpenHireModal = (guide) => {
    setSelectedGuide(guide);
    setBookingVoucher(null);
  };

  const handleConfirmGuideBooking = () => {
    if (!selectedGuide) return;
    setIsBooking(true);

    setTimeout(() => {
      setIsBooking(false);
      const voucherCode = `GD-${Math.floor(100 + Math.random() * 900)}-${Math.random().toString(36).substring(6).toUpperCase()}`;
      const voucher = {
        voucher_code: voucherCode,
        guide_name: selectedGuide.name,
        guide_phone: selectedGuide.phone,
        guide_avatar: selectedGuide.avatar_url,
        city: selectedGuide.city,
        date: bookingDate,
        duration_hours: bookingHours,
        total_price: selectedGuide.price_per_hour * bookingHours,
        status: "Confirmed"
      };

      setBookingVoucher(voucher);
      confetti({
        particleCount: 75,
        spread: 60,
        origin: { y: 0.6 }
      });

      if (onBookGuide) {
        onBookGuide({
          guide_id: selectedGuide.id,
          guide_name: selectedGuide.name,
          date: bookingDate,
          hours: bookingHours,
          price: selectedGuide.price_per_hour * bookingHours
        });
      }
    }, 1000);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div>
          <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 font-bold text-xs">
            Module 5: Local Guide Matching
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-1">
            Verified Local Guides in {currentCity}
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Connect with background-checked certified historians, photographers, and culinary insiders.
          </p>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="bg-slate-50 dark:bg-slate-800/40 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
        
        {/* Language Filter */}
        <div>
          <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1.5 flex items-center gap-1.5">
            <Languages className="w-3.5 h-3.5 text-emerald-600" />
            <span>Spoken Languages</span>
          </label>
          <div className="flex flex-wrap gap-1.5">
            {languages.map((lang) => (
              <button
                key={lang}
                type="button"
                onClick={() => setSelectedLanguage(lang)}
                className={`px-3 py-1 rounded-xl border text-xs font-semibold transition-colors ${
                  selectedLanguage === lang
                    ? 'bg-emerald-600 text-white border-emerald-600'
                    : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                }`}
              >
                {lang}
              </button>
            ))}
          </div>
        </div>

        {/* Expertise Filter */}
        <div>
          <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1.5 flex items-center gap-1.5">
            <Award className="w-3.5 h-3.5 text-emerald-600" />
            <span>Tour Expertise</span>
          </label>
          <div className="flex flex-wrap gap-1.5">
            {expertises.map((exp) => (
              <button
                key={exp}
                type="button"
                onClick={() => setSelectedExpertise(exp)}
                className={`px-3 py-1 rounded-xl border text-xs font-semibold transition-colors ${
                  selectedExpertise === exp
                    ? 'bg-emerald-600 text-white border-emerald-600'
                    : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                }`}
              >
                {exp}
              </button>
            ))}
          </div>
        </div>

      </div>

      {/* GUIDES CARDS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredGuides.length === 0 ? (
          <div className="col-span-full py-16 text-center bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800">
            <Users className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
            <h3 className="text-base font-bold text-slate-800 dark:text-slate-200">No guides matching your language or expertise filters</h3>
            <p className="text-xs text-slate-500 mt-1">Try switching to 'All' language and expertise options.</p>
          </div>
        ) : (
          filteredGuides.map((guide) => (
            <div
              key={guide.id}
              className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm hover:shadow-lg transition-all flex flex-col justify-between"
            >
              <div className="space-y-4">
                
                {/* Profile Header */}
                <div className="flex items-start gap-4">
                  <div className="relative w-16 h-16 rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-800 flex-shrink-0 shadow-md">
                    <img 
                      src={guide.avatar_url} 
                      alt={guide.name} 
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                    {guide.verified === 1 && (
                      <div className="absolute bottom-1 right-1 w-4 h-4 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow">
                        <ShieldCheck className="w-3 h-3" />
                      </div>
                    )}
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h3 className="font-extrabold text-lg text-slate-900 dark:text-white">
                        {guide.name}
                      </h3>
                      <div className="flex items-center gap-1 bg-amber-50 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 px-2 py-0.5 rounded-lg text-xs font-bold border border-amber-200 dark:border-amber-900">
                        <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                        <span>{guide.rating}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                        ✓ Certified Guide
                      </span>
                      <span className="text-xs text-slate-400">• {guide.availability}</span>
                    </div>
                  </div>
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  {guide.bio}
                </p>

                {/* Languages & Expertise Badges */}
                <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="text-slate-400 font-medium">🗣️ Languages:</span>
                    <div className="flex flex-wrap gap-1">
                      {(guide.languages_list || [guide.languages]).map((l, i) => (
                        <span key={i} className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-[11px] font-semibold">
                          {l}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-slate-400 font-medium">🎯 Expertise:</span>
                    <span className="font-semibold text-slate-800 dark:text-slate-200">{guide.expertise}</span>
                  </div>
                </div>

              </div>

              {/* Pricing & Booking CTA */}
              <div className="pt-4 mt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-slate-400 font-medium block">Rate</span>
                  <span className="text-lg font-black text-slate-900 dark:text-white">
                    ${guide.price_per_hour}
                    <span className="text-xs font-normal text-slate-400">/hour</span>
                  </span>
                </div>

                <button
                  onClick={() => handleOpenHireModal(guide)}
                  className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white font-bold text-xs shadow-md shadow-emerald-600/20 transition-all flex items-center gap-1.5"
                >
                  <span>Hire Guide</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

            </div>
          ))
        )}
      </div>

      {/* HIRE GUIDE BOOKING MODAL */}
      {selectedGuide && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 max-w-md w-full p-6 sm:p-8 shadow-2xl relative">
            
            <button
              onClick={() => setSelectedGuide(null)}
              className="absolute top-4 right-4 p-1 rounded-full text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>

            {!bookingVoucher ? (
              <div className="space-y-5">
                <div className="flex items-center gap-3">
                  <img 
                    src={selectedGuide.avatar_url} 
                    alt={selectedGuide.name}
                    className="w-12 h-12 rounded-2xl object-cover" 
                  />
                  <div>
                    <h3 className="font-extrabold text-lg text-slate-900 dark:text-white">
                      Hire {selectedGuide.name}
                    </h3>
                    <p className="text-xs text-slate-500">Verified Guide in {selectedGuide.city}</p>
                  </div>
                </div>

                <div className="space-y-3 text-xs">
                  <div>
                    <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Session Date</label>
                    <input
                      type="date"
                      value={bookingDate}
                      onChange={(e) => setBookingDate(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-medium text-slate-800 dark:text-slate-200"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between font-bold text-slate-700 dark:text-slate-300 mb-1">
                      <span>Duration (Hours)</span>
                      <span className="text-emerald-600 font-bold">{bookingHours} Hours</span>
                    </div>
                    <input
                      type="range"
                      min="2"
                      max="8"
                      value={bookingHours}
                      onChange={(e) => setBookingHours(Number(e.target.value))}
                      className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-emerald-600"
                    />
                    <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                      <span>2 hrs ($ {selectedGuide.price_per_hour * 2})</span>
                      <span>Half Day (4 hrs)</span>
                      <span>Full Day (8 hrs)</span>
                    </div>
                  </div>
                </div>

                <div className="bg-slate-50 dark:bg-slate-800/80 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-2 text-xs">
                  <div className="flex justify-between text-slate-600 dark:text-slate-400">
                    <span>Hourly Rate:</span>
                    <span>${selectedGuide.price_per_hour} / hr</span>
                  </div>
                  <div className="flex justify-between text-slate-600 dark:text-slate-400">
                    <span>Duration:</span>
                    <span>{bookingHours} Hours</span>
                  </div>
                  <div className="pt-2 border-t border-slate-200 dark:border-slate-700 flex justify-between font-black text-sm text-emerald-600 dark:text-emerald-400">
                    <span>Total Cost:</span>
                    <span>${(selectedGuide.price_per_hour * bookingHours).toFixed(2)}</span>
                  </div>
                </div>

                <button
                  onClick={handleConfirmGuideBooking}
                  disabled={isBooking}
                  className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg shadow-emerald-600/30 flex items-center justify-center gap-2 active:scale-95 transition-all"
                >
                  {isBooking ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Generating Official Voucher...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Confirm & Issue Guide Voucher</span>
                    </>
                  )}
                </button>
              </div>
            ) : (
              /* Voucher Pass */
              <div className="text-center space-y-4 py-3">
                <div className="w-14 h-14 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto shadow-md">
                  <CheckCircle2 className="w-7 h-7" />
                </div>
                <div>
                  <h3 className="font-extrabold text-xl text-slate-900 dark:text-white">
                    Guide Voucher Issued!
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Your local guide has been reserved and notified.
                  </p>
                </div>

                <div className="bg-slate-50 dark:bg-slate-800/80 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 text-left text-xs space-y-2">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Voucher Code:</span>
                    <strong className="font-mono text-emerald-600 dark:text-emerald-400">{bookingVoucher.voucher_code}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Guide:</span>
                    <strong className="text-slate-800 dark:text-slate-200">{bookingVoucher.guide_name}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Phone Hotline:</span>
                    <strong className="text-slate-800 dark:text-slate-200">{bookingVoucher.guide_phone}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Reserved Date:</span>
                    <strong className="text-slate-800 dark:text-slate-200">{bookingVoucher.date} ({bookingVoucher.duration_hours} hrs)</strong>
                  </div>
                </div>

                <button
                  onClick={() => setSelectedGuide(null)}
                  className="w-full py-2.5 rounded-xl bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 font-bold text-xs transition-all"
                >
                  Done
                </button>
              </div>
            )}

          </div>
        </div>
      )}

    </div>
  );
}
