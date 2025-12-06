import React, { useEffect, useState } from 'react';
import Navbar from '../components/custom/Navbar';
import api from '../lib/api';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Video, Clock, Award, Crown, ArrowUpCircle } from "lucide-react";
import { toast } from 'sonner';
import { useNavigate, Link } from 'react-router-dom';
import { Badge } from "@/components/ui/badge";

const Dashboard = () => {
  const [sessions, setSessions] = useState([]);
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')));
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
        navigate('/auth');
        return;
    }
    fetchSessions();
  }, [user, navigate]);

  const fetchSessions = async () => {
    try {
        const res = await api.get(`/sessions/my?user_id=${user.id}`);
        setSessions(res.data);
    } catch (e) {
        console.error("Failed to load sessions", e);
    }
  };

  const joinSession = (link) => {
      window.open(link, '_blank');
      toast.success("Joining Mock Video Classroom...");
  };

  return (
    <div className="min-h-screen bg-surface">
      <Navbar />
      <div className="container mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-8">
            <div>
                <h1 className="font-heading text-3xl font-bold text-primary">Dashboard</h1>
                <p className="text-slate-500">Welcome back, {user?.full_name}</p>
            </div>
            {user?.role === 'student' && (
                <div className="flex items-center gap-4">
                    <Badge variant="outline" className="text-sm py-1 px-3 bg-white shadow-sm">
                        Plan: <span className="font-bold ml-1">{user.plan ? user.plan.toUpperCase() : 'FREE'}</span>
                    </Badge>
                    {(!user.plan || user.plan === 'free') && (
                         <Link to="/pricing">
                            <Button size="sm" className="bg-accent text-accent-foreground hover:bg-green-400 gap-1">
                                <Crown className="w-4 h-4" /> Upgrade
                            </Button>
                         </Link>
                    )}
                </div>
            )}
            {user?.role === 'mentor' && (
                 <div className="flex items-center gap-2 bg-amber-100 text-amber-800 px-4 py-2 rounded-full text-sm font-bold">
                    <Award className="h-4 w-4" /> Level 2 Mentor
                 </div>
            )}
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card>
                <CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-slate-500">Total Sessions</CardTitle></CardHeader>
                <CardContent><div className="text-2xl font-bold">{sessions.length}</div></CardContent>
            </Card>
            <Card>
                <CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-slate-500">Upcoming</CardTitle></CardHeader>
                <CardContent><div className="text-2xl font-bold">{sessions.filter(s => new Date(s.date_time) > new Date()).length}</div></CardContent>
            </Card>
            
            {user?.role === 'teacher' ? (
                 <Card>
                    <CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-slate-500">Earnings</CardTitle></CardHeader>
                    <CardContent><div className="text-2xl font-bold text-green-600">€125.50</div></CardContent>
                </Card>
            ) : (
                <Card>
                    <CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-slate-500">Remaining Credits</CardTitle></CardHeader>
                    <CardContent><div className="text-2xl font-bold">{user?.credits || 0}</div></CardContent>
                </Card>
            )}
            
            {user?.role === 'student' ? (
                <Card className="bg-accent/10 border-accent/20">
                     <CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-accent-foreground">Study Streak</CardTitle></CardHeader>
                     <CardContent><div className="text-2xl font-bold text-accent-foreground">3 Days 🔥</div></CardContent>
                </Card>
            ) : (
                <Card className="bg-primary text-white">
                     <CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-white/80">Rating</CardTitle></CardHeader>
                     <CardContent><div className="text-2xl font-bold">4.9/5.0</div></CardContent>
                </Card>
            )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
                <h2 className="font-heading text-2xl font-bold text-primary">Your Sessions</h2>
                {sessions.length === 0 ? (
                    <Card className="p-8 text-center border-dashed">
                        <p className="text-slate-500 mb-4">No sessions scheduled yet.</p>
                        {user?.role === 'student' && <Link to="/mentors"><Button>Find a Mentor</Button></Link>}
                    </Card>
                ) : (
                    sessions.map(session => (
                        <Card key={session.id} className="overflow-hidden">
                            <div className="p-6 flex flex-col md:flex-row items-center justify-between gap-4">
                                <div className="flex items-center gap-4">
                                    <div className="h-12 w-12 rounded-full bg-primary/5 flex items-center justify-center text-primary font-bold text-lg">
                                        {new Date(session.date_time).getDate()}
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-lg">{session.subject}</h3>
                                        <p className="text-slate-500 text-sm">with {user?.role === 'student' ? session.mentor_name : session.student_name}</p>
                                        <div className="flex items-center gap-2 text-xs text-slate-400 mt-1">
                                            <Clock className="h-3 w-3" /> {new Date(session.date_time).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                        </div>
                                    </div>
                                </div>
                                <Button onClick={() => joinSession(session.meeting_link)} className="w-full md:w-auto gap-2 bg-accent text-black hover:bg-green-400">
                                    <Video className="h-4 w-4" /> Join Class
                                </Button>
                            </div>
                        </Card>
                    ))
                )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg">Notifications</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex gap-3 text-sm">
                            <div className="w-2 h-2 mt-1.5 rounded-full bg-accent flex-shrink-0"></div>
                            <p className="text-slate-600">Welcome to EduLink+! Start your 14-day trial.</p>
                        </div>
                         <div className="flex gap-3 text-sm">
                            <div className="w-2 h-2 mt-1.5 rounded-full bg-slate-300 flex-shrink-0"></div>
                            <p className="text-slate-600">New Physics mentors added.</p>
                        </div>
                    </CardContent>
                </Card>

                {user?.role === 'student' && (!user.plan || user.plan === 'free') && (
                     <Card className="bg-gradient-to-br from-primary to-slate-900 text-white shadow-lg">
                        <CardContent className="p-6">
                            <div className="flex items-center gap-2 mb-2 text-accent">
                                <Crown className="w-5 h-5" />
                                <span className="font-bold tracking-wider text-xs uppercase">Pro Access</span>
                            </div>
                            <h3 className="font-heading text-xl font-bold mb-2">Study with Professionals</h3>
                            <p className="text-white/80 text-sm mb-4">Get access to certified teachers and unlimited resources.</p>
                            <Link to="/pricing">
                                <Button variant="secondary" className="w-full bg-white text-primary hover:bg-slate-100">
                                    Start 14-Day Free Trial
                                </Button>
                            </Link>
                        </CardContent>
                     </Card>
                )}
            </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
