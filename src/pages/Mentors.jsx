import React, { useEffect, useState } from 'react';
import Navbar from '../components/custom/Navbar';
import api from '../lib/api';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, Star, BookOpen, Lock, CheckCircle } from "lucide-react";
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "@/components/ui/dialog";
import { Link } from 'react-router-dom';

const Mentors = () => {
  const [mentors, setMentors] = useState([]);
  const [search, setSearch] = useState('');
  const [selectedDate, setSelectedDate] = useState("");
  const [bookingLoading, setBookingLoading] = useState(false);
  const user = JSON.parse(localStorage.getItem('user'));
  
  // Mock Plan Check - In real app this comes from user object
  // For demo purposes, we assume new users are "Free" unless they upgraded
  const isPro = user?.plan === 'basic' || user?.plan === 'standard' || user?.plan === 'unlimited';

  useEffect(() => {
    fetchMentors();
  }, []);

  const fetchMentors = async () => {
    try {
      const res = await api.get('/mentors');
      setMentors(res.data);
    } catch (e) {
      console.error(e);
    }
  };

  const handleBooking = async (mentor, subject) => {
    if (!user) {
        toast.error("Please login to book a session");
        return;
    }
    if (!selectedDate) {
        toast.error("Please select a date and time");
        return;
    }
    
    // Logic for Paid Teachers
    if (mentor.role === 'teacher' && !isPro) {
        toast.error("Upgrade required to book Professional Teachers");
        return;
    }

    setBookingLoading(true);
    try {
        toast.info(mentor.role === 'teacher' ? "Processing with Stripe..." : "Booking free session...", { duration: 2000 });
        
        await new Promise(r => setTimeout(r, 2000)); // Fake delay

        await api.post('/sessions', {
            session_in: {
                mentor_id: mentor.id,
                subject: subject || "General Mentoring",
                date_time: new Date(selectedDate).toISOString()
            },
            current_user_id: user.id
        });
        
        toast.success("Session Booked Successfully!");
    } catch (e) {
        toast.error("Booking failed");
    } finally {
        setBookingLoading(false);
    }
  };

  const filteredMentors = mentors.filter(m => 
    m.full_name.toLowerCase().includes(search.toLowerCase()) ||
    (m.subjects && m.subjects.some(s => s.toLowerCase().includes(search.toLowerCase())))
  );

  return (
    <div className="min-h-screen bg-surface">
      <Navbar />
      <div className="container mx-auto px-6 py-12">
        <div className="mb-12 text-center max-w-2xl mx-auto">
            <h1 className="font-heading text-4xl font-bold text-primary mb-4">Find Your Perfect Mentor</h1>
            <div className="flex justify-center gap-4 mb-8">
                 <Badge variant="outline" className="px-4 py-1 border-primary/20 bg-white"><CheckCircle className="w-3 h-3 mr-1 text-green-500"/> Student Mentors (Free)</Badge>
                 <Badge variant="default" className="px-4 py-1 bg-primary text-white"><Star className="w-3 h-3 mr-1 text-amber-400"/> Pro Teachers (Subscription)</Badge>
            </div>
            
            <div className="relative">
                <Search className="absolute left-4 top-3.5 h-5 w-5 text-slate-400" />
                <Input 
                    className="pl-12 h-12 rounded-full bg-white border-slate-200 shadow-sm focus:ring-2 focus:ring-primary/20" 
                    placeholder="Search by name or subject (e.g. Physics, Math)..." 
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
            </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredMentors.map(mentor => (
                <Card key={mentor.id} className="overflow-hidden border-none shadow-md hover:shadow-xl transition-all duration-300 group relative">
                    {mentor.role === 'teacher' && !isPro && (
                        <div className="absolute top-4 left-4 z-10">
                             <div className="bg-black/60 backdrop-blur-sm text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                                <Lock className="w-3 h-3" /> Pro Only
                             </div>
                        </div>
                    )}
                    <div className={`h-24 relative ${mentor.role === 'teacher' ? 'bg-primary' : 'bg-slate-200'}`}>
                        <div className="absolute -bottom-10 left-6">
                            <div className="w-20 h-20 rounded-full border-4 border-white overflow-hidden bg-slate-200">
                                <img src={mentor.avatar_url} alt={mentor.full_name} className="w-full h-full object-cover" />
                            </div>
                        </div>
                        <div className="absolute right-4 top-4">
                            <Badge variant={mentor.role === 'teacher' ? "secondary" : "outline"} className={mentor.role === 'teacher' ? "bg-white/20 text-white border-none" : "bg-white"}>
                                {mentor.role === 'teacher' ? 'Pro Teacher' : 'Student Mentor'}
                            </Badge>
                        </div>
                    </div>
                    <CardContent className="pt-12 pb-6 px-6">
                        <div className="flex justify-between items-start mb-2">
                            <div>
                                <h3 className="font-heading text-xl font-bold text-primary">{mentor.full_name}</h3>
                                <p className="text-sm text-slate-500 flex items-center gap-1">
                                    <BookOpen className="h-3 w-3" /> {mentor.title || mentor.institution}
                                </p>
                            </div>
                            <div className="flex items-center gap-1 text-amber-500 text-sm font-bold">
                                <Star className="fill-current h-4 w-4" /> {mentor.rating}
                            </div>
                        </div>
                        
                        <p className="text-slate-600 text-sm line-clamp-2 mb-4">{mentor.bio}</p>
                        
                        <div className="flex flex-wrap gap-2 mb-4">
                            {mentor.subjects.map(sub => (
                                <Badge key={sub} variant="outline" className="bg-slate-50">{sub}</Badge>
                            ))}
                        </div>
                    </CardContent>
                    <CardFooter className="px-6 pb-6 pt-0 border-t border-slate-100 mt-auto flex items-center justify-between bg-slate-50/50">
                        <div className="text-lg font-bold text-primary">
                            {mentor.role === 'teacher' ? `€${mentor.hourly_rate}/hr` : "Free"}
                        </div>
                        
                        {mentor.role === 'teacher' && !isPro ? (
                            <Link to="/pricing">
                                <Button variant="outline" className="border-primary text-primary hover:bg-primary hover:text-white">
                                    Unlock Access
                                </Button>
                            </Link>
                        ) : (
                            <Dialog>
                                <DialogTrigger asChild>
                                    <Button className="bg-primary hover:bg-slate-800">Book Session</Button>
                                </DialogTrigger>
                                <DialogContent>
                                    <DialogHeader>
                                        <DialogTitle>Book a session with {mentor.full_name}</DialogTitle>
                                        <DialogDescription>Select a time for your mentoring session.</DialogDescription>
                                    </DialogHeader>
                                    <div className="space-y-4 py-4">
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium">Select Date & Time</label>
                                            <Input 
                                                type="datetime-local" 
                                                onChange={(e) => setSelectedDate(e.target.value)}
                                            />
                                        </div>
                                        <div className="p-4 bg-slate-50 rounded-lg border text-sm text-slate-600">
                                            <p>• 1 Hour Session</p>
                                            <p>• Video Call Link will be provided</p>
                                            {mentor.role === 'teacher' ? (
                                                <p className="font-bold mt-2">Price: €{mentor.hourly_rate} (Paid via Credits)</p>
                                            ) : (
                                                 <p className="font-bold mt-2 text-green-600">Price: Free (Volunteer)</p>
                                            )}
                                        </div>
                                        <Button className="w-full" onClick={() => handleBooking(mentor, mentor.subjects[0])} disabled={bookingLoading}>
                                            {bookingLoading ? "Processing..." : "Confirm Booking"}
                                        </Button>
                                    </div>
                                </DialogContent>
                            </Dialog>
                        )}
                    </CardFooter>
                </Card>
            ))}
        </div>
      </div>
    </div>
  );
};

export default Mentors;
