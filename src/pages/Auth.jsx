import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import api from '../lib/api';
import Navbar from '../components/custom/Navbar';

const Auth = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  // Login State
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPass, setLoginPass] = useState('');

  // Register State
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPass, setRegPass] = useState('');
  const [regRole, setRegRole] = useState('student');

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const res = await api.post('/auth/login', { email: loginEmail, password: loginPass });
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      toast.success("Welcome back!");
      navigate('/dashboard');
    } catch (err) {
      toast.error("Invalid credentials. Try student@demo.com / 123");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const res = await api.post('/auth/register', { 
          full_name: regName,
          email: regEmail, 
          password: regPass,
          role: regRole
      });
      // Auto login after register ideally, but for now just notify
      toast.success("Account created! Please login.");
    } catch (err) {
      toast.error("Registration failed. Email might be taken.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-surface flex flex-col">
      <Navbar />
      <div className="flex-1 flex items-center justify-center py-12 px-4">
        <Tabs defaultValue="login" className="w-[400px]">
          <TabsList className="grid w-full grid-cols-2 mb-4">
            <TabsTrigger value="login">Login</TabsTrigger>
            <TabsTrigger value="register">Register</TabsTrigger>
          </TabsList>
          
          {/* LOGIN TAB */}
          <TabsContent value="login">
            <Card className="border-none shadow-xl">
              <CardHeader>
                <CardTitle className="font-heading text-2xl">Welcome Back</CardTitle>
                <CardDescription>Enter your credentials to access your account.</CardDescription>
              </CardHeader>
              <form onSubmit={handleLogin}>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" placeholder="m@example.com" value={loginEmail} onChange={e => setLoginEmail(e.target.value)} required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <Input id="password" type="password" value={loginPass} onChange={e => setLoginPass(e.target.value)} required />
                  </div>
                  <div className="text-xs text-muted-foreground mt-2">
                    Demo: student@demo.com / 123 OR mentor@demo.com / 123
                  </div>
                </CardContent>
                <CardFooter>
                  <Button type="submit" className="w-full bg-primary hover:bg-slate-800" disabled={isLoading}>
                    {isLoading ? "Loading..." : "Sign In"}
                  </Button>
                </CardFooter>
              </form>
            </Card>
          </TabsContent>

          {/* REGISTER TAB */}
          <TabsContent value="register">
            <Card className="border-none shadow-xl">
              <CardHeader>
                <CardTitle className="font-heading text-2xl">Create Account</CardTitle>
                <CardDescription>Join the EduLink+ community today.</CardDescription>
              </CardHeader>
              <form onSubmit={handleRegister}>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input id="name" value={regName} onChange={e => setRegName(e.target.value)} required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="reg-email">Email</Label>
                    <Input id="reg-email" type="email" value={regEmail} onChange={e => setRegEmail(e.target.value)} required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="reg-pass">Password</Label>
                    <Input id="reg-pass" type="password" value={regPass} onChange={e => setRegPass(e.target.value)} required />
                  </div>
                  <div className="space-y-2">
                    <Label>I want to be a:</Label>
                    <div className="grid grid-cols-3 gap-2">
                        <Button type="button" variant={regRole === 'student' ? 'default' : 'outline'} onClick={() => setRegRole('student')} className="text-xs">Student</Button>
                        <Button type="button" variant={regRole === 'mentor' ? 'default' : 'outline'} onClick={() => setRegRole('mentor')} className="text-xs">Mentor</Button>
                        <Button type="button" variant={regRole === 'teacher' ? 'default' : 'outline'} onClick={() => setRegRole('teacher')} className="text-xs">Teacher</Button>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button type="submit" className="w-full bg-primary hover:bg-slate-800" disabled={isLoading}>
                    {isLoading ? "Creating..." : "Create Account"}
                  </Button>
                </CardFooter>
              </form>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Auth;
