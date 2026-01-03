// src/pages/Home.jsx
import { Search, ShieldCheck, Clock, Award } from 'lucide-react';
import { Link } from "react-router-dom";
import labHero from '../assets/Logo1.webp';
import TestCard from '../components/TestCard'; 

const Home = () => {
  const popularTests = [
    { name: "Complete Blood Count (CBC) Test", oldPrice: "899", newPrice: "499", parameters: "60+ Parameters", time: "Reports in 24 Hours" },
    { name: "Thyroid Profile (Total T3, T4 & TSH)", oldPrice: "999", newPrice: "699", parameters: "3 Parameters", time: "Reports in 24 Hours" },
    { name: "Diabetes Screening (HbA1c + Sugar)", oldPrice: "850", newPrice: "699", parameters: "2 Parameters", time: "Reports in 12 Hours" },
    { name: "Lipid Profile (Cholesterol)", oldPrice: "1200", newPrice: "899", parameters: "8 Parameters", time: "Reports in 24 Hours" }
  ];

  return (
    <div className="font-sans text-text-primary">
      {/* HERO SECTION */}
      <section className="bg-[#FBFBFB] py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 flex flex-col lg:flex-row items-center gap-12">
          <div className="flex-1 space-y-6">
            <h1 className="text-4xl lg:text-5xl font-extrabold leading-tight">
              Book Lab Tests Online <br />
              <span className="text-brand-red uppercase">with Trusted Diagnostics</span>
            </h1>
            <p className="text-text-secondary text-lg">
              Accurate reports • Home sample collection • Online payment 
            </p>
            
            <div className="flex items-center bg-white border border-border-light rounded-xl p-2 shadow-md max-w-xl transition-focus-within:ring-2 ring-brand-blue/20">
              <Search className="text-text-muted ml-3" size={20} />
              <input type="text" placeholder="Search tests..." className="flex-1 px-4 py-2 outline-none text-text-secondary font-medium" />
              <button className="btn-primary px-8 py-3">Search</button> 
            </div>
          </div>
          <div className="flex-1 relative">
            <div className="absolute -inset-4 bg-brand-blue/5 rounded-full blur-3xl"></div>
            <img src={labHero} alt="Laboratory" className="relative w-full h-auto drop-shadow-2xl" />
          </div>
        </div>
      </section>

      {/* POPULAR TESTS SECTION - 4 COLUMN GRID */}
      <section className="bg-[#F3F4F6] py-20"> 
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-3xl font-extrabold text-text-primary mb-3">Popular Tests</h2>
              <div className="h-1.5 w-20 bg-brand-red rounded-full"></div>
            </div>
            <Link to="/tests" className="font-bold text-brand-blue border-b-2 border-brand-blue pb-1 hover:text-brand-blue-hover transition-all">
              View All Tests
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 justify-items-center">
            {popularTests.map((test, index) => (
              <TestCard key={index} {...test} />
            ))}
          </div>
        </div>
      </section>

      {/* WHY CHOOSE US */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-extrabold mb-4">Why Choose Us</h2>
          <div className="h-1.5 w-20 bg-brand-red rounded-full mx-auto mb-16"></div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">
            {[
              { icon: <Award size={40}/>, color: "bg-red-50", text: "NABL Certified", iconCol: "text-brand-red" },
              { icon: <ShieldCheck size={40}/>, color: "bg-blue-50", text: "Accurate Reports", iconCol: "text-brand-blue" },
              { icon: <Clock size={40}/>, color: "bg-green-50", text: "Home Collection", iconCol: "text-green-600" },
              { icon: <ShieldCheck size={40}/>, color: "bg-blue-50", text: "Secure Payment", iconCol: "text-brand-blue" }
            ].map((item, i) => (
              <div key={i} className="flex flex-col items-center group cursor-default">
                <div className={`${item.color} p-6 rounded-3xl mb-6 transition-transform group-hover:scale-110 duration-300`}>
                  <div className={item.iconCol}>{item.icon}</div>
                </div>
                <p className="font-bold text-xl">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;