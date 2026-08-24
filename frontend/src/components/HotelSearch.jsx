import React, { useState, useEffect } from 'react';
import { 
  Hotel, 
  Plane, 
  Search, 
  Star, 
  Check, 
  DollarSign, 
  Filter, 
  ShieldCheck, 
  Sparkles, 
  ArrowRight, 
  CreditCard, 
  CheckCircle2, 
  X,
  ExternalLink,
  Wifi,
  Coffee,
  Waves
} from 'lucide-react';
import confetti from 'canvas-confetti';

export function HotelSearch({ 
  currentCity = 'Paris', 
  hotels = [], 
  flights = [], 
  onBookItem,
  isLoading 
}) {
  const [activeSubTab, setActiveSubTab] = useState('hotels'); // 'hotels' or 'flights'
  const [cityFilter, setCityFilter] = useState(currentCity);
  const [priceFilter, setPriceFilter] = useState(600);
  const [ratingFilter, setRatingFilter] = useState(4.0);
  const [starFilter, setStarFilter] = useState(0); // 0 = all
  const [selectedAmenity, setSelectedAmenity] = useState('');
  
  // Booking Modal State
  const [bookingModalItem, setBookingModalItem] = useState(null);
  const [bookingSuccess, setBookingSuccess] = useState(null);
  const [bookingDate, setBookingDate] = useState('2026-09-10 to 2026-09-13');
  const [travelerName, setTravelerName] = useState('Alex Mercer');
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);

  useEffect(() => {
    if (currentCity) {
      setCityFilter(currentCity);
    }
  }, [currentCity]);

  // Filter Hotels
  const filteredHotels = hotels.filter((h) => {
    const matchCity = !cityFilter || h.city.toLowerCase().includes(cityFilter.toLowerCase());
    const matchPrice = h.price <= priceFilter;
    const matchRating = h.rating >= ratingFilter;
    const matchStar = starFilter === 0 || h.stars === starFilter;
    const matchAmenity = !selectedAmenity || (h.amenities && h.amenities.toLowerCase().includes(selectedAmenity.toLowerCase()));
    return matchCity && matchPrice && matchRating && matchStar && matchAmenity;
  });

  // Filter Flights
  const filteredFlights = flights.filter((f) => {
    const matchDest = !cityFilter || f.destination.toLowerCase().includes(cityFilter.toLowerCase());
    return matchDest;
  });

  const handleOpenBooking = (item, type = 'hotel') => {
    setBookingModalItem({ ...item, item_type: type });
    setBookingSuccess(null);
  };

  const handleConfirmPayment = async () => {
    setIsProcessingPayment(true);
    // Simulate Razorpay payment gateway
    setTimeout(() => {
      setIsProcessingPayment(false);
      const confCode = `ST-${Math.floor(1000 + Math.random() * 9000)}-${bookingModalItem.item_type.toUpperCase()}`;
      setBookingSuccess({
        confirmation_code: confCode,
        payment_id: `pay_test_${Math.random().toString(36).substring(6)}`,
        item_name: bookingModalItem.name || `${bookingModalItem.airline} ${bookingModalItem.flight_number}`,
        price: bookingModalItem.price,
        dates: bookingDate
      });

      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });

      if (onBookItem) {
        onBookItem({
          item_type: bookingModalItem.item_type,
          item_name: bookingModalItem.name || `${bookingModalItem.airline} ${bookingModalItem.flight_number}`,
          price: bookingModalItem.price,
          dates: bookingDate
        });
      }
    }, 1200);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      
      {/* Header & Sub-Tab Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div>
          <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 font-bold text-xs">
            Module 2: Aggregated Bookings
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-1">
            Hotels & Flights Multi-Platform Comparison
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Real-time rates compared across Booking.com, Agoda, Expedia, and direct partners with zero markups.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex p-1 rounded-2xl bg-slate-100 dark:bg-slate-800 self-start sm:self-auto border border-slate-200 dark:border-slate-700">
          <button
            onClick={() => setActiveSubTab('hotels')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeSubTab === 'hotels'
                ? 'bg-white dark:bg-slate-900 text-emerald-600 dark:text-emerald-400 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            <Hotel className="w-4 h-4" />
            <span>Hotels ({filteredHotels.length})</span>
          </button>

          <button
            onClick={() => setActiveSubTab('flights')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeSubTab === 'flights'
                ? 'bg-white dark:bg-slate-900 text-emerald-600 dark:text-emerald-400 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            <Plane className="w-4 h-4" />
            <span>Flights ({filteredFlights.length})</span>
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-slate-50 dark:bg-slate-800/40 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-xs">
        
        {/* City Filter */}
        <div>
          <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1.5">Destination City</label>
          <input
            type="text"
            value={cityFilter}
            onChange={(e) => setCityFilter(e.target.value)}
            placeholder="e.g. Paris, Tokyo, Bali..."
            className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none"
          />
        </div>

        {/* Max Price Slider */}
        <div>
          <div className="flex justify-between font-bold text-slate-700 dark:text-slate-300 mb-1.5">
            <span>Max Price / Night</span>
            <span className="text-emerald-600 dark:text-emerald-400">${priceFilter}</span>
          </div>
          <input
            type="range"
            min="30"
            max="1000"
            step="10"
            value={priceFilter}
            onChange={(e) => setPriceFilter(Number(e.target.value))}
            className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-emerald-600"
          />
        </div>

        {/* Star Rating Filter */}
        <div>
          <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1.5">Hotel Star Class</label>
          <select
            value={starFilter}
            onChange={(e) => setStarFilter(Number(e.target.value))}
            className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none"
          >
            <option value={0}>All Star Ratings</option>
            <option value={3}>3-Star & Above</option>
            <option value={4}>4-Star Deluxe</option>
            <option value={5}>5-Star Luxury</option>
          </select>
        </div>

        {/* Amenities Filter */}
        <div>
          <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1.5">Popular Amenities</label>
          <div className="flex flex-wrap gap-1.5">
            {['Pool', 'WiFi', 'Spa', 'Breakfast'].map((amenity) => (
              <button
                key={amenity}
                type="button"
                onClick={() => setSelectedAmenity(selectedAmenity === amenity ? '' : amenity)}
                className={`px-2.5 py-1 rounded-lg border text-[11px] font-medium transition-colors ${
                  selectedAmenity === amenity
                    ? 'bg-emerald-600 text-white border-emerald-600'
                    : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                }`}
              >
                {amenity}
              </button>
            ))}
          </div>
        </div>

      </div>

      {/* HOTELS LIST */}
      {activeSubTab === 'hotels' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredHotels.length === 0 ? (
            <div className="col-span-full py-16 text-center bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800">
              <Hotel className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
              <h3 className="text-base font-bold text-slate-800 dark:text-slate-200">No hotels matched your filters</h3>
              <p className="text-xs text-slate-500 mt-1">Try relaxing your price or star rating filters.</p>
            </div>
          ) : (
            filteredHotels.map((hotel) => (
              <div 
                key={hotel.id}
                className="group bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  {/* Image Card */}
                  <div className="relative aspect-[16/10] overflow-hidden bg-slate-100 dark:bg-slate-800">
                    <img 
                      src={hotel.image_url} 
                      alt={hotel.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                      loading="lazy"
                    />
                    <div className="absolute top-3 right-3 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md px-2.5 py-1 rounded-xl text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1 shadow-md">
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      <span>{hotel.rating}</span>
                    </div>

                    <div className="absolute bottom-3 left-3 bg-slate-900/80 backdrop-blur-md px-2.5 py-0.5 rounded-lg text-[11px] font-semibold text-white">
                      {'★'.repeat(hotel.stars || 4)} {hotel.city}
                    </div>
                  </div>

                  {/* Hotel Body */}
                  <div className="p-5 space-y-3">
                    <h3 className="font-bold text-base text-slate-900 dark:text-white line-clamp-1">
                      {hotel.name}
                    </h3>

                    {/* Amenities Tags */}
                    <div className="flex flex-wrap gap-1.5">
                      {(hotel.amenities_list || ['Free WiFi', 'AC', 'Breakfast']).slice(0, 3).map((am, i) => (
                        <span key={i} className="text-[10px] font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 px-2 py-0.5 rounded-md">
                          {am}
                        </span>
                      ))}
                    </div>

                    {/* Multi-Platform Price Comparison Strip */}
                    {hotel.comparison_prices && (
                      <div className="bg-slate-50 dark:bg-slate-800/60 p-3 rounded-2xl border border-slate-100 dark:border-slate-800 space-y-2">
                        <div className="flex items-center justify-between text-[11px] font-bold text-slate-600 dark:text-slate-400">
                          <span>Multi-Platform Comparison</span>
                          {hotel.best_deal && (
                            <span className="text-emerald-600 dark:text-emerald-400 font-extrabold">
                              Best: {hotel.best_deal.platform} (-${hotel.best_deal.savings})
                            </span>
                          )}
                        </div>

                        <div className="grid grid-cols-4 gap-1 text-center">
                          {Object.entries(hotel.comparison_prices).map(([plat, pr]) => (
                            <div 
                              key={plat}
                              className={`p-1.5 rounded-xl text-[10px] ${
                                hotel.best_deal && hotel.best_deal.platform === plat
                                  ? 'bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 font-bold border border-emerald-300 dark:border-emerald-700'
                                  : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700'
                              }`}
                            >
                              <div className="truncate opacity-80">{plat}</div>
                              <div className="font-bold text-xs">${pr}</div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Footer Pricing & CTA */}
                <div className="p-5 pt-0 flex items-center justify-between border-t border-slate-100 dark:border-slate-800 mt-2">
                  <div>
                    <span className="text-[10px] text-slate-400 font-medium block">Starting from</span>
                    <span className="text-xl font-extrabold text-slate-900 dark:text-white">
                      ${hotel.price}
                      <span className="text-xs font-normal text-slate-400">/night</span>
                    </span>
                  </div>

                  <button
                    onClick={() => handleOpenBooking(hotel, 'hotel')}
                    className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white font-bold text-xs shadow-md shadow-emerald-600/20 transition-all flex items-center gap-1.5"
                  >
                    <span>Instant Book</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>

              </div>
            ))
          )}
        </div>
      )}

      {/* FLIGHTS LIST */}
      {activeSubTab === 'flights' && (
        <div className="space-y-4">
          {filteredFlights.length === 0 ? (
            <div className="py-16 text-center bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800">
              <Plane className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
              <h3 className="text-base font-bold text-slate-800 dark:text-slate-200">No flights found for this route</h3>
              <p className="text-xs text-slate-500 mt-1">Try adjusting your destination city search above.</p>
            </div>
          ) : (
            filteredFlights.map((flight) => (
              <div
                key={flight.id}
                className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-5 sm:p-6 shadow-sm hover:shadow-md transition-all flex flex-col md:flex-row md:items-center justify-between gap-6"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-sky-50 dark:bg-sky-950/60 border border-sky-200 dark:border-sky-800 flex items-center justify-center text-sky-600 dark:text-sky-400 font-bold text-xl flex-shrink-0">
                    ✈️
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-extrabold text-base text-slate-900 dark:text-white">{flight.airline}</span>
                      <span className="text-xs text-slate-400">#{flight.flight_number}</span>
                    </div>
                    <div className="text-xs text-slate-500 mt-0.5">
                      {flight.stops === 0 ? (
                        <span className="text-emerald-600 font-bold">Non-Stop Direct</span>
                      ) : (
                        <span>{flight.stops} Stop Layover</span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Flight Schedule */}
                <div className="flex items-center gap-6 sm:gap-12">
                  <div>
                    <div className="text-base font-black text-slate-900 dark:text-white">{flight.departure_time}</div>
                    <div className="text-xs text-slate-500 font-medium">{flight.origin}</div>
                  </div>

                  <div className="flex flex-col items-center">
                    <span className="text-[10px] text-slate-400 font-semibold">{flight.duration}</span>
                    <div className="w-20 sm:w-28 h-0.5 bg-slate-300 dark:bg-slate-700 relative my-1">
                      <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    </div>
                    <span className="text-[10px] text-emerald-600 font-bold">On-Time</span>
                  </div>

                  <div>
                    <div className="text-base font-black text-slate-900 dark:text-white">{flight.arrival_time}</div>
                    <div className="text-xs text-slate-500 font-medium">{flight.destination}</div>
                  </div>
                </div>

                {/* Price & Action */}
                <div className="flex items-center justify-between md:justify-end gap-4 border-t md:border-t-0 pt-3 md:pt-0 border-slate-100 dark:border-slate-800">
                  <div className="text-right">
                    <span className="text-xl font-extrabold text-slate-900 dark:text-white">${flight.price}</span>
                    <span className="text-[10px] text-slate-400 block font-medium">Economy / One-Way</span>
                  </div>

                  <button
                    onClick={() => handleOpenBooking(flight, 'flight')}
                    className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md shadow-emerald-600/20 active:scale-95 transition-all"
                  >
                    Select Flight
                  </button>
                </div>

              </div>
            ))
          )}
        </div>
      )}

      {/* BOOKING & PAYMENT MODAL */}
      {bookingModalItem && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 max-w-md w-full p-6 sm:p-8 shadow-2xl relative">
            
            <button
              onClick={() => setBookingModalItem(null)}
              className="absolute top-4 right-4 p-1 rounded-full text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>

            {!bookingSuccess ? (
              <div className="space-y-5">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold text-lg">
                    {bookingModalItem.item_type === 'hotel' ? '🏨' : '✈️'}
                  </div>
                  <div>
                    <h3 className="font-extrabold text-lg text-slate-900 dark:text-white">
                      Instant Booking Checkout
                    </h3>
                    <p className="text-xs text-slate-500">Test Payment Mode • Zero Real Charge</p>
                  </div>
                </div>

                <div className="bg-slate-50 dark:bg-slate-800/60 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-2 text-xs">
                  <div className="flex justify-between font-bold text-slate-800 dark:text-slate-200">
                    <span>{bookingModalItem.name || `${bookingModalItem.airline} ${bookingModalItem.flight_number}`}</span>
                    <span>${bookingModalItem.price}</span>
                  </div>
                  <div className="text-slate-500">
                    Location: {bookingModalItem.city || bookingModalItem.destination}
                  </div>
                  <div className="pt-2 border-t border-slate-200 dark:border-slate-700 flex justify-between font-extrabold text-sm text-emerald-600 dark:text-emerald-400">
                    <span>Total Amount</span>
                    <span>${bookingModalItem.price}</span>
                  </div>
                </div>

                <div className="space-y-3 text-xs">
                  <div>
                    <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Primary Traveler Name</label>
                    <input
                      type="text"
                      value={travelerName}
                      onChange={(e) => setTravelerName(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-medium text-slate-800 dark:text-slate-200"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Dates / Window</label>
                    <input
                      type="text"
                      value={bookingDate}
                      onChange={(e) => setBookingDate(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-medium text-slate-800 dark:text-slate-200"
                    />
                  </div>
                </div>

                {/* Razorpay Test Simulation Badge */}
                <div className="flex items-center gap-2 p-2.5 rounded-xl bg-sky-50 dark:bg-sky-950/40 border border-sky-200 dark:border-sky-800 text-[11px] text-sky-800 dark:text-sky-300 font-medium">
                  <CreditCard className="w-4 h-4 text-sky-600 flex-shrink-0" />
                  <span>Razorpay Sandbox active. Instant mock verification token will be generated.</span>
                </div>

                <button
                  onClick={handleConfirmPayment}
                  disabled={isProcessingPayment}
                  className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg shadow-emerald-600/30 flex items-center justify-center gap-2 active:scale-95 transition-all disabled:opacity-50"
                >
                  {isProcessingPayment ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Authorizing Secure Gateway...</span>
                    </>
                  ) : (
                    <>
                      <ShieldCheck className="w-4 h-4" />
                      <span>Pay & Confirm Booking (${bookingModalItem.price})</span>
                    </>
                  )}
                </button>
              </div>
            ) : (
              /* Success Confirmation Card */
              <div className="text-center space-y-4 py-4">
                <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto shadow-md">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="font-extrabold text-xl text-slate-900 dark:text-white">
                    Reservation Confirmed!
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">
                    Your digital pass & invoice has been generated.
                  </p>
                </div>

                <div className="bg-slate-50 dark:bg-slate-800/80 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 text-left text-xs space-y-2">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Confirmation Ref:</span>
                    <strong className="font-mono text-emerald-600 dark:text-emerald-400">{bookingSuccess.confirmation_code}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Item:</span>
                    <strong className="text-slate-800 dark:text-slate-200">{bookingSuccess.item_name}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Paid Amount:</span>
                    <strong className="text-slate-800 dark:text-slate-200">${bookingSuccess.price}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Gateway Token:</span>
                    <span className="font-mono text-[10px] text-slate-500 truncate max-w-[160px]">{bookingSuccess.payment_id}</span>
                  </div>
                </div>

                <button
                  onClick={() => setBookingModalItem(null)}
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
