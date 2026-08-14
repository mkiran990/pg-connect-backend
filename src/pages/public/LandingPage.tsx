import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Building2, Utensils, BedDouble, ShieldCheck, Wifi, ShowerHead, Shirt, Sparkles, Car, Zap,
  MessageSquare, Phone, MapPin, CheckCircle2, ArrowRight, Filter, ChevronRight
} from 'lucide-react';
import { apiService } from '../../services/api';
import { PGInformation, Facility, Room, WeeklyMenuItem } from '../../types';
import { Badge } from '../../components/common/Badge';

export const LandingPage: React.FC = () => {
  const [pgInfo, setPgInfo] = useState<PGInformation | null>(null);
  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [weeklyMenu, setWeeklyMenu] = useState<WeeklyMenuItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [sharingFilter, setSharingFilter] = useState<string>('all');
  const [availabilityFilter, setAvailabilityFilter] = useState<string>('all');
  const [selectedDay, setSelectedDay] = useState<string>('Monday');

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const { info, facilities: facs } = await apiService.getPGInfo();
        setPgInfo(info);
        setFacilities(facs);

        const roomList = await apiService.getRooms();
        setRooms(roomList);

        const menuList = await apiService.getWeeklyMenu();
        setWeeklyMenu(menuList);
      } catch (err) {
        console.error('Error fetching landing page data:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const whatsappUrl = `https://wa.me/${pgInfo?.whatsapp_number || '919876543210'}?text=${encodeURIComponent('Hello! I would like to inquire about room availability at PG Connect.')}`;

  // Filtered rooms logic
  const filteredRooms = rooms.filter(room => {
    if (sharingFilter !== 'all' && room.sharing_capacity !== Number(sharingFilter)) return false;
    if (availabilityFilter === 'available' && !room.is_available) return false;
    if (availabilityFilter === 'occupied' && room.is_available) return false;
    return true;
  });

  const getIconComponent = (iconName: string) => {
    switch (iconName) {
      case 'Wifi': return <Wifi className="w-6 h-6 text-brand-600" />;
      case 'Utensils': return <Utensils className="w-6 h-6 text-brand-600" />;
      case 'ShowerHead': return <ShowerHead className="w-6 h-6 text-brand-600" />;
      case 'Shirt': return <Shirt className="w-6 h-6 text-brand-600" />;
      case 'Sparkles': return <Sparkles className="w-6 h-6 text-brand-600" />;
      case 'ShieldCheck': return <ShieldCheck className="w-6 h-6 text-brand-600" />;
      case 'Car': return <Car className="w-6 h-6 text-brand-600" />;
      case 'Zap': return <Zap className="w-6 h-6 text-brand-600" />;
      default: return <Sparkles className="w-6 h-6 text-brand-600" />;
    }
  };

  const currentDayMenu = weeklyMenu.find(m => m.day_of_week === selectedDay);

  return (
    <div className="space-y-20 pb-16">

      {/* HERO SECTION */}
      <section className="relative overflow-hidden hero-gradient text-white pt-16 pb-24 md:pt-24 md:pb-32 rounded-b-[2.5rem] shadow-soft-lg">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-md border border-white/20 px-4 py-1.5 rounded-full text-xs font-semibold tracking-wide text-tealAccent-300">
                <Sparkles className="w-4 h-4 text-tealAccent-300" />
                <span>{pgInfo?.pg_name || 'PG Connect Luxury Stays'}</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight">
                Comfortable Living, <br className="hidden sm:inline" />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-tealAccent-300 to-tealAccent-100">
                  Made Simple
                </span>
              </h1>

              <p className="text-base sm:text-lg text-slate-200 max-w-2xl mx-auto lg:mx-0 leading-relaxed font-normal">
                View rooms, check weekly meals, manage PG information, and stay connected in one convenient place.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
                <a
                  href="#rooms"
                  className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 bg-tealAccent-500 hover:bg-tealAccent-400 text-slate-950 font-bold px-7 py-3.5 rounded-2xl shadow-lg transition-all transform hover:-translate-y-0.5"
                >
                  <BedDouble className="w-5 h-5" />
                  <span>Explore Rooms</span>
                </a>

                <a
                  href="#menu"
                  className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 bg-white/15 hover:bg-white/25 text-white font-semibold px-6 py-3.5 rounded-2xl border border-white/25 backdrop-blur-md transition-all"
                >
                  <Utensils className="w-5 h-5" />
                  <span>View Food Menu</span>
                </a>

                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold px-6 py-3.5 rounded-2xl shadow-md transition-all"
                >
                  <MessageSquare className="w-5 h-5" />
                  <span>Chat on WhatsApp</span>
                </a>
              </div>
            </div>

            {/* Hero Visual Card */}
            <div className="lg:col-span-5 flex justify-center">
              <div className="relative w-full max-w-md bg-white/10 backdrop-blur-xl border border-white/20 p-6 sm:p-8 rounded-3xl shadow-2xl space-y-6 text-left">
                <div className="flex items-center justify-between border-b border-white/15 pb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 rounded-2xl bg-tealAccent-500/20 text-tealAccent-300 flex items-center justify-center">
                      <Building2 className="w-7 h-7" />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg text-white">PG Highlights</h3>
                      <p className="text-xs text-slate-300"> Bengaluru Tech Hub</p>
                    </div>
                  </div>
                  <span className="bg-emerald-500/20 text-emerald-300 text-xs px-3 py-1 rounded-full font-semibold border border-emerald-400/30">
                    Open for Booking
                  </span>
                </div>

                <ul className="space-y-3.5 text-sm text-slate-200">
                  <li className="flex items-center space-x-3">
                    <CheckCircle2 className="w-5 h-5 text-tealAccent-400 flex-shrink-0" />
                    <span>300 Mbps High-Speed Wi-Fi in all rooms</span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <CheckCircle2 className="w-5 h-5 text-tealAccent-400 flex-shrink-0" />
                    <span>3 Times Daily Fresh Hygienic Meals</span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <CheckCircle2 className="w-5 h-5 text-tealAccent-400 flex-shrink-0" />
                    <span>24/7 Security & CCTV Surveillance</span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <CheckCircle2 className="w-5 h-5 text-tealAccent-400 flex-shrink-0" />
                    <span>Daily Housekeeping & Laundry Access</span>
                  </li>
                </ul>

                <div className="pt-2 border-t border-white/15 flex items-center justify-between text-xs text-slate-300">
                  <span>Starting at <strong>₹7,000 / month</strong></span>
                  <Link to="/login" className="text-tealAccent-300 hover:text-white font-semibold flex items-center space-x-1">
                    <span>Resident Login</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ABOUT THE PG */}
      <section id="about" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl p-8 sm:p-12 shadow-soft border border-slate-200/80 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-7 space-y-4">
            <div className="inline-flex items-center space-x-2 bg-brand-50 text-brand-700 px-3.5 py-1 rounded-full text-xs font-bold">
              <span>About PG Connect</span>
            </div>
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              {pgInfo?.pg_name || 'PG Connect Luxury Stays'}
            </h2>
            <p className="text-slate-600 leading-relaxed">
              {pgInfo?.description}
            </p>
            <div className="pt-2 space-y-2 text-sm text-slate-700">
              <div className="flex items-start space-x-3">
                <MapPin className="w-5 h-5 text-brand-600 flex-shrink-0 mt-0.5" />
                <span>{pgInfo?.address}</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 bg-slate-50 rounded-2xl p-6 border border-slate-200 space-y-4">
            <h3 className="font-bold text-slate-900 text-base">PG Management & Contact</h3>
            <div className="space-y-3 text-sm">
              <div className="flex items-center justify-between p-3 bg-white rounded-xl border border-slate-100">
                <span className="text-slate-500">Owner Name</span>
                <span className="font-semibold text-slate-800">{pgInfo?.owner_name}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-white rounded-xl border border-slate-100">
                <span className="text-slate-500">Contact Number</span>
                <span className="font-semibold text-slate-800">{pgInfo?.mobile_number}</span>
              </div>
            </div>

            <a
              href={whatsappUrl}
              target="_blank"
              rel="noreferrer"
              className="w-full flex items-center justify-center space-x-2 bg-emerald-600 hover:bg-emerald-500 text-white font-medium py-3 rounded-xl shadow-sm transition-all"
            >
              <MessageSquare className="w-4 h-4" />
              <span>Direct WhatsApp Chat</span>
            </a>
          </div>
        </div>
      </section>

      {/* FACILITIES */}
      <section id="facilities" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center space-y-2">
          <span className="text-brand-600 text-xs font-bold uppercase tracking-wider bg-brand-50 px-3 py-1 rounded-full">
            Modern Amenities
          </span>
          <h2 className="text-3xl font-extrabold text-slate-900">Facilities & Services</h2>
          <p className="text-slate-500 text-sm max-w-xl mx-auto">
            Everything you need for a comfortable, productive, and hassle-free stay.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {facilities.map((fac) => (
            <div key={fac.id} className="glass-card p-6 space-y-3 border border-slate-200">
              <div className="w-12 h-12 rounded-2xl bg-brand-50 flex items-center justify-center">
                {getIconComponent(fac.icon)}
              </div>
              <h3 className="font-bold text-slate-900 text-base">{fac.name}</h3>
              <p className="text-slate-500 text-xs leading-relaxed">{fac.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ROOM DETAILS & PRICING */}
      <section id="rooms" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-4">
          <div className="space-y-2">
            <span className="text-tealAccent-700 text-xs font-bold uppercase tracking-wider bg-tealAccent-50 px-3 py-1 rounded-full">
              Accommodation Options
            </span>
            <h2 className="text-3xl font-extrabold text-slate-900">Room Details & Rent</h2>
            <p className="text-slate-500 text-sm">
              Transparent monthly & yearly pricing with real-time room availability.
            </p>
          </div>

          {/* Filter Bar */}
          <div className="flex flex-wrap items-center gap-3 bg-white p-2 rounded-2xl border border-slate-200 shadow-sm text-xs font-medium">
            <div className="flex items-center space-x-1.5 px-2 text-slate-400">
              <Filter className="w-4 h-4" />
              <span>Filter:</span>
            </div>

            <select
              value={sharingFilter}
              onChange={(e) => setSharingFilter(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-slate-700 focus:outline-none focus:ring-2 focus:ring-brand-500"
            >
              <option value="all">All Sharing Types</option>
              <option value="1">Single Room</option>
              <option value="2">2 Sharing</option>
              <option value="3">3 Sharing</option>
            </select>

            <select
              value={availabilityFilter}
              onChange={(e) => setAvailabilityFilter(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-slate-700 focus:outline-none focus:ring-2 focus:ring-brand-500"
            >
              <option value="all">All Status</option>
              <option value="available">Available Only</option>
              <option value="occupied">Occupied Only</option>
            </select>
          </div>
        </div>

        {/* Room Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRooms.map((room) => (
            <div key={room.id} className="glass-card p-6 flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold text-brand-600 bg-brand-50 px-2.5 py-1 rounded-md">
                      Room {room.room_number}
                    </span>
                    <h3 className="font-extrabold text-xl text-slate-900 mt-1">{room.room_type}</h3>
                  </div>
                  <Badge status={room.is_available ? 'Available' : 'Occupied'} type="availability" />
                </div>

                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-2">
                  <div className="flex justify-between items-baseline">
                    <span className="text-slate-500 text-xs font-medium">Monthly Rent</span>
                    <span className="text-xl font-extrabold text-slate-900">₹{room.monthly_rent.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between items-baseline pt-1 border-t border-slate-200/60">
                    <span className="text-slate-400 text-xs">Yearly Rent</span>
                    <span className="text-xs font-semibold text-slate-600">₹{room.yearly_rent.toLocaleString('en-IN')}</span>
                  </div>
                </div>

                <div className="space-y-1">
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Room Facilities</span>
                  <p className="text-xs text-slate-600 leading-relaxed font-medium">{room.facilities}</p>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                <span className="text-xs text-slate-500">{room.sharing_capacity} Sharing Bed</span>
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center space-x-1.5 text-xs font-bold text-brand-600 hover:text-brand-700 bg-brand-50 hover:bg-brand-100 px-3.5 py-2 rounded-xl transition-all"
                >
                  <span>Inquire Now</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* WEEKLY FOOD MENU PREVIEW */}
      <section id="menu" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center space-y-2">
          <span className="text-brand-600 text-xs font-bold uppercase tracking-wider bg-brand-50 px-3 py-1 rounded-full">
            Healthy & Hygienic
          </span>
          <h2 className="text-3xl font-extrabold text-slate-900">Weekly Food Menu</h2>
          <p className="text-slate-500 text-sm max-w-xl mx-auto">
            Freshly prepared 3-time meals planned throughout the week.
          </p>
        </div>

        {/* Day Selector Tabs */}
        <div className="flex flex-wrap justify-center gap-2">
          {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map((day) => (
            <button
              key={day}
              onClick={() => setSelectedDay(day)}
              className={`px-4 py-2 rounded-2xl text-xs sm:text-sm font-bold transition-all ${
                selectedDay === day
                  ? 'bg-brand-600 text-white shadow-md scale-105'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              {day}
            </button>
          ))}
        </div>

        {/* Selected Day Menu Card */}
        {currentDayMenu && (
          <div className="max-w-3xl mx-auto bg-white rounded-3xl p-8 shadow-soft border border-slate-200 space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <h3 className="text-xl font-extrabold text-slate-900">{currentDayMenu.day_of_week} Meal Menu</h3>
              <span className="text-xs bg-emerald-50 text-emerald-700 font-bold px-3 py-1 rounded-full">
                3 Meals Included
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-4 bg-amber-50/60 rounded-2xl border border-amber-100 space-y-2">
                <span className="text-xs font-bold text-amber-700 uppercase tracking-wider">Breakfast</span>
                <p className="text-sm font-semibold text-slate-800">{currentDayMenu.breakfast}</p>
              </div>

              <div className="p-4 bg-emerald-50/60 rounded-2xl border border-emerald-100 space-y-2">
                <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider">Lunch</span>
                <p className="text-sm font-semibold text-slate-800">{currentDayMenu.lunch}</p>
              </div>

              <div className="p-4 bg-indigo-50/60 rounded-2xl border border-indigo-100 space-y-2">
                <span className="text-xs font-bold text-indigo-700 uppercase tracking-wider">Dinner</span>
                <p className="text-sm font-semibold text-slate-800">{currentDayMenu.dinner}</p>
              </div>
            </div>
          </div>
        )}
      </section>

      {/* CONTACT SECTION */}
      <section id="contact" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-slate-900 text-white rounded-3xl p-8 sm:p-12 shadow-soft-lg grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <div className="space-y-6">
            <span className="text-tealAccent-400 text-xs font-bold uppercase tracking-wider bg-tealAccent-500/20 px-3.5 py-1 rounded-full border border-tealAccent-500/30">
              Get in Touch
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold leading-tight">
              Ready to Join PG Connect?
            </h2>
            <p className="text-slate-300 text-sm leading-relaxed">
              Have questions regarding rooms, food menu, or monthly rent? Chat directly with the owner on WhatsApp or drop a phone call.
            </p>

            <div className="space-y-3 text-sm">
              <div className="flex items-center space-x-3">
                <Phone className="w-5 h-5 text-tealAccent-400" />
                <span className="font-semibold">{pgInfo?.mobile_number}</span>
              </div>
              <div className="flex items-center space-x-3">
                <MapPin className="w-5 h-5 text-tealAccent-400" />
                <span>{pgInfo?.address}</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col space-y-4 bg-slate-800/80 p-8 rounded-2xl border border-slate-700">
            <h3 className="text-xl font-bold text-white">Direct Owner Chat</h3>
            <p className="text-xs text-slate-400">Click below to initiate a instant WhatsApp conversation with the PG owner.</p>
            
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noreferrer"
              className="w-full inline-flex items-center justify-center space-x-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-4 rounded-xl shadow-lg transition-all transform hover:-translate-y-0.5 text-base"
            >
              <MessageSquare className="w-5 h-5 fill-white" />
              <span>Chat with Owner on WhatsApp</span>
            </a>
          </div>
        </div>
      </section>

    </div>
  );
};
