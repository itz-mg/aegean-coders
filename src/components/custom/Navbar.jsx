import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { GraduationCap, Menu, X, User } from "lucide-react";

const Navbar = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));
  const [isOpen, setIsOpen] = React.useState(false);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/auth');
  };

  return (
    <nav className="border-b border-border/40 bg-white/80 backdrop-blur-md sticky top-0 z-50">
      <div className="container mx-auto px-6 h-20 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="bg-primary p-2 rounded-lg group-hover:bg-accent transition-colors duration-300">
            <GraduationCap className="text-white group-hover:text-black h-6 w-6" />
          </div>
          <span className="font-heading text-2xl font-bold text-primary">EduLink+</span>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-8">
          <Link to="/mentors" className="text-sm font-medium text-slate-600 hover:text-primary transition-colors">Find a Mentor</Link>
          <Link to="/pricing" className="text-sm font-medium text-slate-600 hover:text-primary transition-colors">Pricing</Link>
          <Link to="/#features" className="text-sm font-medium text-slate-600 hover:text-primary transition-colors">How it Works</Link>
          
          {user ? (
            <div className="flex items-center gap-4">
                <Link to="/dashboard">
                    <Button variant="ghost" className="font-medium">Dashboard</Button>
                </Link>
                <Button onClick={handleLogout} variant="outline" size="sm">Logout</Button>
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center overflow-hidden border border-primary/20">
                    {user.avatar_url ? (
                        <img src={user.avatar_url} alt="Profile" className="w-full h-full object-cover" />
                    ) : (
                        <User className="h-5 w-5 text-primary" />
                    )}
                </div>
            </div>
          ) : (
            <div className="flex items-center gap-4">
              <Link to="/auth">
                <Button variant="ghost" className="text-slate-600 hover:text-primary font-medium">Log in</Button>
              </Link>
              <Link to="/auth">
                <Button className="bg-primary hover:bg-slate-800 text-white rounded-full px-6">Get Started</Button>
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Toggle */}
        <button className="md:hidden" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden p-6 bg-white border-t">
          <div className="flex flex-col gap-4">
            <Link to="/mentors" className="text-lg font-medium">Find a Mentor</Link>
            <Link to="/dashboard" className="text-lg font-medium">Dashboard</Link>
            {user ? (
                <Button onClick={handleLogout} variant="destructive" className="w-full">Logout</Button>
            ) : (
                <Link to="/auth"><Button className="w-full">Login</Button></Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
