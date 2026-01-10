import React from 'react';
import { Award, Target, Users, FlaskConical, History, ShieldCheck, Microscope } from 'lucide-react';

const About = () => {
  const stats = [
    { label: "Tests Conducted", value: "1M+", icon: <FlaskConical size={24}/> },
    { label: "Happy Patients", value: "500K+", icon: <Users size={24}/> },
    { label: "Years of Excellence", value: "15+", icon: <History size={24}/> },
    { label: "Certifications", value: "10+", icon: <Award size={24}/> },
  ];

  const team = [
    { name: "Dr. Pravin Kumar", role: "Chief Pathologist", exp: "20+ Years Exp.", img: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?q=80&w=400&h=500&auto=format&fit=crop" },
    { name: "Dr. Anjali Sharma", role: "Microbiologist", exp: "12+ Years Exp.", img: "https://images.unsplash.com/photo-1594824476967-48c8b964273f?q=80&w=400&h=500&auto=format&fit=crop" },
    { name: "Mr. Rajesh V.", role: "Lab Manager", exp: "15+ Years Exp.", img: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?q=80&w=400&h=500&auto=format&fit=crop" }
  ];

  return (
    <div className="font-sans text-text-primary overflow-x-hidden">
      {/* 1. HERO SECTION - Matching Home Page Header Style */}
      <section className="bg-[#FBFBFB] py-12 sm:py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col lg:flex-row items-center gap-8 lg:gap-12">
          <div className="flex-1 space-y-4 sm:space-y-6 text-center lg:text-left">
            <h1 className="text-4xl lg:text-5xl font-extrabold leading-tight">
              A Legacy of <br />
              <span className="text-brand-red uppercase">Accuracy & Trust</span>
            </h1>
            <div className="h-1.5 w-20 bg-brand-red rounded-full"></div>
            <p className="text-text-secondary text-lg font-medium leading-relaxed">
              Since 2010, Pravin Clinical Laboratory has been at the forefront of diagnostic excellence. 
              We combine world-class technology with compassionate care to ensure your health 
              is in the best hands.
            </p>
            
            <div className="grid grid-cols-2 gap-6 pt-4">
              {stats.map((stat, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="text-brand-blue bg-white shadow-sm p-3 rounded-2xl">{stat.icon}</div>
                  <div>
                    <div className="font-bold text-2xl text-text-primary">{stat.value}</div>
                    <div className="text-xs text-text-muted font-bold uppercase tracking-wider">{stat.label}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="flex-1 relative">
            <div className="absolute -inset-4 bg-brand-blue/5 rounded-full blur-3xl"></div>
            <img 
              src="https://images.unsplash.com/photo-1579684385127-1ef15d508118?q=80&w=2080&auto=format&fit=crop" 
              alt="Lab Infrastructure" 
              className="relative w-full h-auto rounded-[40px] shadow-2xl border-8 border-white" 
            />
          </div>
        </div>
      </section>

      {/* 2. CORE VALUES - Matching Card Grid Style */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-extrabold mb-3">Our Core Pillars</h2>
            <div className="h-1.5 w-20 bg-brand-red rounded-full mx-auto"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-[#FBFBFB] p-8 rounded-4xl border border-gray-100 shadow-sm hover:shadow-md transition-all text-center">
              <div className="w-16 h-16 bg-white rounded-2xl shadow-sm flex items-center justify-center mx-auto mb-6 text-brand-blue">
                <ShieldCheck size={32} />
              </div>
              <h3 className="text-xl font-bold mb-4">Quality Assurance</h3>
              <p className="text-text-secondary text-sm leading-relaxed">
                NABL accredited processes ensuring every report meets international gold standards of accuracy.
              </p>
            </div>

            <div className="bg-[#FBFBFB] p-8 rounded-4xl border border-gray-100 shadow-sm hover:shadow-md transition-all text-center">
              <div className="w-16 h-16 bg-white rounded-2xl shadow-sm flex items-center justify-center mx-auto mb-6 text-brand-red">
                <Microscope size={32} />
              </div>
              <h3 className="text-xl font-bold mb-4">Advanced Tech</h3>
              <p className="text-text-secondary text-sm leading-relaxed">
                Equipped with fully automated robotic analyzers to provide rapid turnaround times without errors.
              </p>
            </div>

            <div className="bg-[#FBFBFB] p-8 rounded-4xl border border-gray-100 shadow-sm hover:shadow-md transition-all text-center">
              <div className="w-16 h-16 bg-white rounded-2xl shadow-sm flex items-center justify-center mx-auto mb-6 text-green-600">
                <Users size={32} />
              </div>
              <h3 className="text-xl font-bold mb-4">Patient Centric</h3>
              <p className="text-text-secondary text-sm leading-relaxed">
                From home collection to digital reports, every step is designed for your comfort and convenience.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. STAFF SECTION - Clean & Professional */}
      <section className="py-20 bg-[#F3F4F6]">
        <div className="max-w-7xl mx-auto px-4">
          <div className="mb-16">
            <h2 className="text-3xl font-extrabold mb-3">Our Expert Team</h2>
            <div className="h-1.5 w-20 bg-brand-red rounded-full"></div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {team.map((member, i) => (
              <div key={i} className="bg-white rounded-4xl overflow-hidden shadow-sm group hover:shadow-xl transition-all border border-gray-100">
                <div className="h-72 overflow-hidden">
                  <img 
                    src={member.img} 
                    alt={member.name} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                  />
                </div>
                <div className="p-6 text-center">
                  <h4 className="text-xl font-bold text-text-primary">{member.name}</h4>
                  <p className="text-brand-blue font-bold text-sm mb-2">{member.role}</p>
                  <p className="text-text-muted text-xs font-medium uppercase tracking-widest">{member.exp}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. CTA BANNER - Matching Packages Page Style */}
      <section className="py-20 px-4">
        <div className="max-w-5xl mx-auto bg-brand-blue rounded-[40px] p-10 md:p-16 text-white text-center shadow-2xl shadow-brand-blue/20">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Experience Better Healthcare</h2>
          <p className="text-lg opacity-90 mb-10 max-w-2xl mx-auto">
            Our lab is open 24/7 for emergency diagnostics. Book your test online or 
            visit our center for a professional experience.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <button className="bg-white text-brand-blue px-10 py-4 rounded-2xl font-bold text-lg hover:bg-gray-100 transition-all active:scale-95">
              Contact Us
            </button>
            <button className="border-2 border-white text-white px-10 py-4 rounded-2xl font-bold text-lg hover:bg-white/10 transition-all active:scale-95">
              Get Directions
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;