import React from 'react';
import Navbar from '../components/custom/Navbar';
import { Button } from "@/components/ui/button";
import { Check, X, Zap, GraduationCap, Crown } from "lucide-react";
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const Pricing = () => {
  const plans = [
    {
      name: "Free Student",
      price: "0",
      period: "forever",
      description: "Perfect for getting help from university peers.",
      features: [
        "Access to Student Mentors",
        "Community Forum Access",
        "Basic Study Resources",
        "1 Session/week limit"
      ],
      missing: [
        "Professional Teacher Access",
        "Exam Prep Courses",
        "Priority Booking",
        "Recorded Sessions"
      ],
      cta: "Get Started",
      variant: "outline",
      popular: false
    },
    {
      name: "Basic",
      price: "20",
      period: "month",
      description: "For students who need professional guidance.",
      features: [
        "2 Professional Teacher Sessions",
        "Unlimited Student Mentor Access",
        "14-Day Free Trial included",
        "HD Video Calls"
      ],
      missing: [
        "Unlimited Chat Support",
        "Personalized Study Plan"
      ],
      cta: "Start 14-Day Trial",
      variant: "default",
      popular: false
    },
    {
      name: "Standard",
      price: "40",
      period: "month",
      description: "Most popular for High School students.",
      features: [
        "4 Professional Teacher Sessions",
        "Unlimited Student Mentor Access",
        "Priority Booking",
        "14-Day Free Trial included",
        "Exam Prep Materials"
      ],
      missing: [],
      cta: "Start 14-Day Trial",
      variant: "accent",
      popular: true
    },
    {
      name: "Unlimited Lite",
      price: "60",
      period: "month",
      description: "Maximum support for serious exams.",
      features: [
        "6 Professional Teacher Sessions",
        "Unlimited Chat Support",
        "Personalized Study Plan",
        "Parental Progress Report",
        "Recorded Sessions Archive"
      ],
      missing: [],
      cta: "Go Unlimited",
      variant: "outline",
      popular: false
    }
  ];

  return (
    <div className="min-h-screen bg-surface">
      <Navbar />
      <div className="py-24 px-6">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <Badge variant="secondary" className="mb-4 text-primary">Flexible Plans</Badge>
          <h1 className="font-heading text-4xl md:text-5xl font-bold text-primary mb-6">
            Invest in Your Future
          </h1>
          <p className="text-xl text-slate-600">
            Choose the plan that fits your learning needs. From free peer mentoring to professional academic coaching.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
          {plans.map((plan, index) => (
            <Card key={index} className={`relative border-2 flex flex-col ${plan.popular ? 'border-accent shadow-xl scale-105 z-10' : 'border-slate-100 shadow-sm hover:border-slate-200'}`}>
              {plan.popular && (
                <div className="absolute -top-4 left-0 right-0 flex justify-center">
                  <Badge className="bg-accent text-accent-foreground px-4 py-1">Most Popular</Badge>
                </div>
              )}
              <CardHeader>
                <CardTitle className="flex items-baseline gap-1">
                  <span className="text-3xl font-bold">€{plan.price}</span>
                  <span className="text-slate-500 text-sm">/{plan.period}</span>
                </CardTitle>
                <div className="flex items-center gap-2 mt-2">
                   <h3 className="font-bold text-lg">{plan.name}</h3>
                   {plan.name !== "Free Student" && <Crown className="w-4 h-4 text-amber-500" />}
                </div>
                <CardDescription className="mt-2">{plan.description}</CardDescription>
              </CardHeader>
              <CardContent className="flex-1">
                <ul className="space-y-3">
                  {plan.features.map((feat, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm">
                      <Check className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
                      <span>{feat}</span>
                    </li>
                  ))}
                  {plan.missing.map((feat, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-slate-400">
                      <X className="w-4 h-4 mt-0.5 shrink-0" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                <Button className={`w-full ${plan.variant === 'accent' ? 'bg-accent text-accent-foreground hover:bg-green-400' : ''}`} variant={plan.variant === 'accent' ? 'default' : plan.variant}>
                  {plan.cta}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
        
        <div className="mt-20 text-center bg-white p-12 rounded-2xl shadow-sm border border-slate-100 max-w-4xl mx-auto">
            <h2 className="font-heading text-3xl font-bold mb-6">For Teachers & Mentors</h2>
            <div className="grid md:grid-cols-2 gap-12">
                <div className="text-left space-y-4">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-blue-100 rounded-lg text-blue-700"><GraduationCap /></div>
                        <h3 className="font-bold text-xl">Student Mentors</h3>
                    </div>
                    <p className="text-slate-600">Join for free. Mentor students, earn digital badges and certificates for your LinkedIn profile. Build your CV while helping others.</p>
                    <Link to="/auth"><Button variant="link" className="p-0">Apply as Mentor &rarr;</Button></Link>
                </div>
                <div className="text-left space-y-4">
                     <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-purple-100 rounded-lg text-purple-700"><Zap /></div>
                        <h3 className="font-bold text-xl">Professional Teachers</h3>
                    </div>
                    <p className="text-slate-600">Set your own rates (e.g., €15-€25/session). We handle payments and invoices. Platform fee: 15-20%. Grow your student base effortlessly.</p>
                    <Link to="/auth"><Button variant="link" className="p-0">Join as Teacher &rarr;</Button></Link>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default Pricing;
