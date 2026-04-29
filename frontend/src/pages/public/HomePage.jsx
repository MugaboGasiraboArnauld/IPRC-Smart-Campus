import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../../components/common/Navbar';

const campuses = ['IPRC Kigali','IPRC Huye','IPRC Ngoma','IPRC Gishari','IPRC Musanze','IPRC Karongi'];
const features = [
  { icon:'🎓', title:'Online Admissions', desc:'Apply from anywhere. Upload documents, track status in real time.' },
  { icon:'📚', title:'E-Learning Platform', desc:'Access notes, videos, and quizzes from your trainer anytime.' },
  { icon:'🏨', title:'Hostel Booking', desc:'Browse available rooms, view prices, and book online instantly.' },
  { icon:'✅', title:'Attendance Tracking', desc:'Trainers mark attendance digitally. Students view records live.' },
  { icon:'📝', title:'Assignments & Grades', desc:'Submit work online. Get feedback and grades automatically.' },
  { icon:'📢', title:'Announcements', desc:'Campus-wide and department-specific notices in one place.' },
];
const stats = [{ v:'6+', l:'Campuses' },{ v:'50+', l:'Programs' },{ v:'3', l:'User Roles' },{ v:'24/7', l:'Access' }];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white font-body">
      <Navbar />

      {/* Hero */}
      <section className="relative min-h-screen flex items-center pt-16 overflow-hidden bg-gradient-to-br from-white via-iprc-50/30 to-white">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-20 right-10 w-72 h-72 bg-iprc-100/40 rounded-full blur-3xl" />
          <div className="absolute bottom-20 left-10 w-96 h-96 bg-amber-50/60 rounded-full blur-3xl" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-20 text-center">
          <div className="inline-flex items-center gap-2 bg-iprc-50 text-iprc-800 text-xs font-semibold px-4 py-1.5 rounded-full mb-6">
            <span className="w-1.5 h-1.5 bg-iprc-600 rounded-full animate-pulse" />
            Rwanda's Digital Campus Platform
          </div>
          <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl font-bold text-gray-900 leading-tight mb-6">
            Learn, Grow &amp;<br /><em className="text-iprc-600 not-italic">Thrive at IPRC</em>
          </h1>
          <p className="text-lg text-gray-500 max-w-2xl mx-auto mb-10 font-light leading-relaxed">
            A unified smart campus system for all IPRC colleges — from online applications and hostel booking to e-learning and trainer recruitment.
          </p>
          <div className="flex flex-wrap gap-3 justify-center mb-16">
            <Link to="/apply/student" className="btn-primary text-base px-8 py-3.5 shadow-lg shadow-iprc-600/20">Apply as Student</Link>
            <Link to="/apply/trainer" className="btn-secondary text-base px-8 py-3.5">Join as Trainer</Link>
          </div>
          {/* Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-2xl mx-auto">
            {stats.map(s => (
              <div key={s.l} className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm">
                <div className="font-display text-3xl font-bold text-iprc-600">{s.v}</div>
                <div className="text-xs text-gray-500 mt-1">{s.l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-14">
            <p className="text-xs font-semibold text-iprc-600 uppercase tracking-widest mb-3">Platform Features</p>
            <h2 className="font-display text-4xl font-bold text-gray-900 mb-4">Everything in one place</h2>
            <p className="text-gray-500 max-w-xl mx-auto">Every tool a modern campus community needs — built for students, trainers, and administrators.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map(f => (
              <div key={f.title} className="bg-white border border-gray-100 rounded-2xl p-6 hover:border-iprc-200 hover:shadow-md transition-all duration-200">
                <div className="text-3xl mb-4">{f.icon}</div>
                <h3 className="font-display font-semibold text-gray-900 text-lg mb-2">{f.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Portals */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-14">
            <p className="text-xs font-semibold text-iprc-600 uppercase tracking-widest mb-3">Your Portal</p>
            <h2 className="font-display text-4xl font-bold text-gray-900">Choose your role</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { title:'Student Portal', icon:'🎓', color:'bg-iprc-50 text-iprc-800', items:['Online application','Access e-learning','Book hostel room','View timetable'], link:'/login', cta:'Student Login' },
              { title:'Trainer Portal', icon:'👨‍🏫', color:'bg-amber-50 text-amber-800', items:['Upload course notes','Manage assignments','Take attendance','Grade students'], link:'/login', cta:'Trainer Login' },
              { title:'Admin Portal', icon:'⚙️', color:'bg-blue-50 text-blue-800', items:['Manage applications','Approve trainers','Manage hostels','Post announcements'], link:'/login', cta:'Admin Login' },
            ].map(p => (
              <div key={p.title} className="card p-6 hover:shadow-lg transition-all duration-200 flex flex-col">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl mb-5 ${p.color}`}>{p.icon}</div>
                <h3 className="font-display font-semibold text-xl text-gray-900 mb-4">{p.title}</h3>
                <ul className="space-y-2 mb-6 flex-1">
                  {p.items.map(i => (
                    <li key={i} className="flex items-center gap-2 text-sm text-gray-600">
                      <span className="w-4 h-4 bg-iprc-50 rounded-full flex items-center justify-center flex-shrink-0 text-[10px] text-iprc-600">✓</span>
                      {i}
                    </li>
                  ))}
                </ul>
                <Link to={p.link} className="btn-secondary justify-center">{p.cta}</Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Campuses */}
      <section className="py-20 bg-iprc-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center">
          <p className="text-iprc-200 text-xs font-semibold uppercase tracking-widest mb-3">Nationwide</p>
          <h2 className="font-display text-4xl font-bold text-white mb-4">Across Rwanda</h2>
          <p className="text-iprc-100 mb-12 max-w-lg mx-auto">One unified platform connecting all IPRC campuses across the country.</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 mb-12">
            {campuses.map((c, i) => (
              <div key={c} className="bg-white/10 border border-white/20 rounded-2xl p-4 text-center hover:bg-white/20 transition-all">
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center font-display font-bold text-white text-lg mx-auto mb-2">{c.split(' ')[1][0]}</div>
                <p className="text-white text-xs font-medium leading-tight">{c}</p>
              </div>
            ))}
          </div>
          <Link to="/apply/student" className="bg-white text-iprc-800 font-semibold px-8 py-3.5 rounded-xl hover:bg-iprc-50 transition-all inline-block">Apply Now →</Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 bg-iprc-600 rounded-lg flex items-center justify-center">
                <svg className="w-3.5 h-3.5 fill-none stroke-white stroke-2" viewBox="0 0 24 24"><path d="M12 2L2 7l10 5 10-5-10-5z"/></svg>
              </div>
              <span className="font-display font-bold text-white text-sm">IPRC Smart Campus</span>
            </div>
            <p className="text-xs">© 2024 IPRC · Rwanda TVET Board. All rights reserved.</p>
            <div className="flex gap-4 text-xs">
              <Link to="/programs" className="hover:text-white transition-colors">Programs</Link>
              <Link to="/contact" className="hover:text-white transition-colors">Contact</Link>
              <Link to="/login" className="hover:text-white transition-colors">Portal</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
