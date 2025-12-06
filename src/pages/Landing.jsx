import React from 'react';
import Navbar from '../components/custom/Navbar';
import { Button } from "@/components/ui/button";
import { ArrowRight, Star, CheckCircle, Shield, Users } from "lucide-react";
import { Link } from 'react-router-dom';

const Landing = () => {
  return (
    <div className="min-h-screen bg-surface">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative pt-20 pb-32 overflow-hidden">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
            <div className="lg:col-span-7 space-y-8 animate-fade-in">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 text-accent-foreground text-sm font-semibold tracking-wide uppercase border border-accent/20">
                <span className="w-2 h-2 rounded-full bg-accent animate-pulse"></span>
                Now Available in Greece
              </div>
              
              <h1 className="font-heading text-5xl md:text-7xl font-bold leading-[1.1] text-primary">
                Master Any Subject <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-slate-500">
                   With Top Mentors.
                </span>
              </h1>
              
              <p className="text-xl text-slate-600 max-w-2xl leading-relaxed font-body">
                Connect with elite university students and professional teachers for personalized academic guidance. From High School to University level.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Link to="/mentors">
                  <Button size="lg" className="h-14 px-8 rounded-full text-lg bg-primary hover:bg-slate-800 shadow-lg hover:shadow-xl transition-all hover:-translate-y-1">
                    Find a Mentor <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Link to="/pricing">
                   <Button size="lg" variant="outline" className="h-14 px-8 rounded-full text-lg border-2 hover:bg-surface-highlight">
                    View Plans
                  </Button>
                </Link>
              </div>
              
              <div className="flex items-center gap-8 pt-8 text-sm text-slate-500 font-medium">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-accent" /> Verified Mentors
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-accent" /> Secure Payments
                </div>
                <div className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-accent" /> Video Classroom
                </div>
              </div>
            </div>
            
            <div className="lg:col-span-5 relative">
               <div className="relative rounded-2xl overflow-hidden shadow-2xl border-8 border-white rotate-3 hover:rotate-0 transition-all duration-500">
                 <img 
                    src="https://images.unsplash.com/photo-1718327453695-4d32b94c90a4?crop=entropy&cs=srgb&fm=jpg&q=85" 
                    alt="Library" 
                    className="w-full h-[600px] object-cover"
                 />
                 <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-8 text-white">
                    <div className="flex items-center gap-4">
                        <div className="flex -space-x-4">
                            <img className="w-10 h-10 rounded-full border-2 border-white" src="https://randomuser.me/api/portraits/women/1.jpg" alt=""/>
                            <img className="w-10 h-10 rounded-full border-2 border-white" src="https://randomuser.me/api/portraits/men/2.jpg" alt=""/>
                            <img className="w-10 h-10 rounded-full border-2 border-white" src="https://randomuser.me/api/portraits/women/3.jpg" alt=""/>
                        </div>
                        <p className="font-medium">Joined by 1,000+ students</p>
                    </div>
                 </div>
               </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Features / Stats */}
      <section className="py-24 bg-white border-t border-slate-100">
        <div className="container mx-auto px-6">
             <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
                <div className="space-y-4">
                    <div className="w-16 h-16 bg-primary/5 rounded-2xl flex items-center justify-center mx-auto text-primary">
                        <Users className="w-8 h-8" />
                    </div>
                    <h3 className="text-2xl font-heading font-bold">Expert Network</h3>
                    <p className="text-slate-600">Access to top university students and certified teachers.</p>
                </div>
                <div className="space-y-4">
                    <div className="w-16 h-16 bg-accent/10 rounded-2xl flex items-center justify-center mx-auto text-accent-foreground">
                        <Shield className="w-8 h-8" />
                    </div>
                    <h3 className="text-2xl font-heading font-bold">Safe & Secure</h3>
                    <p className="text-slate-600">Verified profiles and secure payment processing via Stripe.</p>
                </div>
                <div className="space-y-4">
                    <div className="w-16 h-16 bg-secondary/10 rounded-2xl flex items-center justify-center mx-auto text-secondary">
                        <Star className="w-8 h-8" />
                    </div>
                    <h3 className="text-2xl font-heading font-bold">Proven Results</h3>
                    <p className="text-slate-600">98% of our students report improved grades within 3 months.</p>
                </div>
             </div>
        </div>
      </section>
    </div>
  );
};

export default Landing;
