'use client'
import { useSession } from "next-auth/react";

import React, { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, AreaChart, Area } from 'recharts';
import { TrendingUp, PieChartIcon, TrendingDown, Wallet, BarChart3, Mail, Plus, CreditCard, Target, Shield, Zap, Calendar, ChevronLeft, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from "next/navigation";

const BankTrackerHero = () => {
  const { data, status } = useSession()
  const router = useRouter();
  if (data && status === 'authenticated') {
    router.push('/transaction');
  }
  const [animationStep, setAnimationStep] = useState(0);

  const expenseData = [
    { name: 'Food', value: 2400, color: '#8b5cf6' },
    { name: 'Transport', value: 1200, color: '#06b6d4' },
    { name: 'Entertainment', value: 800, color: '#10b981' },
    { name: 'Bills', value: 1500, color: '#f59e0b' },
    { name: 'Shopping', value: 1000, color: '#ef4444' },
    { name: 'Others', value: 600, color: '#6b7280' }
  ];

  const monthlyData = [
    { month: 'Jan', income: 5000, expense: 2500 },
    { month: 'Feb', income: 5200, expense: 3800 },
    { month: 'Mar', income: 4800, expense: 3200 },
    { month: 'Apr', income: 3500, expense: 5600 },
    { month: 'May', income: 5300, expense: 2900 },
    { month: 'Jun', income: 5800, expense: 1100 }
  ];

  const trendData = [
    { day: 'Mon', amount: 120 },
    { day: 'Tue', amount: 180 },
    { day: 'Wed', amount: 95 },
    { day: 'Thu', amount: 240 },
    { day: 'Fri', amount: 160 },
    { day: 'Sat', amount: 320 },
    { day: 'Sun', amount: 80 }
  ];

  const calendarData = {
    3: { income: 0, expense: 112 },
    6: { income: 0, expense: 95 },
    7: { income: 0, expense: 40 },
    8: { income: 0, expense: 2820 },
    9: { income: 0, expense: 81 },
    10: { income: 4000, expense: 0 },
    11: { income: 1728, expense: 50 },
    12: { income: 187460, expense: 189200 },
    13: { income: 381, expense: 212 },
    14: { income: 220, expense: 220 },
    15: { income: 0, expense: 40 },
    17: { income: 0, expense: 2130 },
    18: { income: 0, expense: 345 },
    19: { income: 40, expense: 70 },
    20: { income: 15, expense: 0 },
    21: { income: 0, expense: 323 },
    22: { income: 415, expense: 0 }
  };

  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const currentMonth = new Date().toLocaleString('default', { month: 'long', year: 'numeric' });


  const generateCalendarDays = () => {
    const days = [];
    for (let i = 1; i <= 31; i++) {
      days.push(i);
    }
    return days;
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setAnimationStep(prev => (prev + 1) % 4);
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen relative text-white" style={{ backgroundColor: '#181825' }}>
      {/* Header */}
      <header className=" navbaranimation w-full border-b border-[#ffffff29] h-[65px] backdrop-blur-xl z-30 fixed top-0 left-0  px-6 py-4">
        <nav className="flex  items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-cyan-500 rounded-lg flex items-center justify-center">
              <Wallet className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
              My Bank
            </span>
          </div>
          <div className=" flex items-center ">
          { status== 'unauthenticated' && <Link href={`/login`} className="bg-gradient-to-r from-purple-500 to-cyan-500 px-6 max-md:px-4 max-md:text-sm py-2 rounded-full text-white font-medium hover:shadow-lg hover:shadow-purple-500/25 transition-all duration-300">
              Get Started
            </Link>}
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="relative px-6 py-20   overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-transparent to-cyan-900/20" />
        <div className="absolute top-20 left-10 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse delay-1000" />

        <div className="relative pt-[60px] z-10 max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="space-y-8">
              <div className="space-y-6">
                <div className="inline-flex animate-scale-up max-md:text-sm items-center space-x-2 bg-gradient-to-r from-purple-500/20 to-cyan-500/20 rounded-full px-4 py-2 border border-purple-500/30">
                  <Zap className="w-4 h-4 text-purple-400" />
                  <span className="text-sm text-purple-300">AI-Powered Financial Tracking</span>
                </div>

                <h1 className="text-4xl lg:text-6xl animate-scale-up delay-700 font-bold leading-tight">
                  Track Your{' '}
                  <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent">
                    Finances
                  </span>
                  {' '}Like Never Before
                </h1>

                <p className="text-xl animate-pulse max-md:text-sm text-gray-300 leading-relaxed">
                  Monitor expenses, track income, and categorize spending with intelligent insights.
                  Get personalized financial reports and take control of your money.
                </p>
              </div>

              {/* Features Grid */}
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center space-x-3 p-4 max-md:p-2 animate-slide-up max-md:text-sm   bg-white/5 rounded-lg border border-white/10">
                  <Mail className="w-6 h-6 text-cyan-400" />
                  <div>
                    <p className="font-medium">Email Tracking</p>
                    <p className="text-sm text-gray-400">Fetch by email</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 p-4 max-md:p-2 animate-slide-up max-md:text-sm   bg-white/5 rounded-lg border border-white/10">
                  <PieChartIcon className="w-6 h-6 text-purple-400" />
                  <div>
                    <p className="font-medium">Smart Categories</p>
                    <p className="text-sm text-gray-400">Auto categorize</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 p-4 max-md:p-2 animate-slide-up max-md:text-sm   bg-white/5 rounded-lg border border-white/10">
                  <CreditCard className="w-6 h-6 text-green-400" />
                  <div>
                    <p className="font-medium">Statements</p>
                    <p className="text-sm text-gray-400">Credit & Debit</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 p-4 max-md:p-2 animate-slide-up max-md:text-sm   bg-white/5 rounded-lg border border-white/10">
                  <Target className="w-6 h-6 text-yellow-400" />
                  <div>
                    <p className="font-medium">Real-time</p>
                    <p className="text-sm text-gray-400">Live updates</p>
                  </div>
                </div>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href={`/login`} className="bg-gradient-to-r from-purple-500 to-cyan-500 px-8 py-4 max-md:py-3  max-md:text-lg   rounded-full text-white font-medium hover:shadow-xl hover:shadow-purple-500/25 transition-all duration-300 transform hover:scale-105">
                  <Plus className="w-5 h-5 inline mr-2" />
                  Start Tracking Now
                </Link>
                <button className="border border-white/20 px-8 py-4 max-md:py-3 rounded-full text-white font-medium hover:bg-white/5 transition-all duration-300">
                  View Demo
                </button>
              </div>
            </div>

            {/* Right Content - Charts */}
            <div className="space-y-6">
              {/* Stats Cards */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-gradient-to-br from-green-500/20 to-green-600/20 p-6 rounded-2xl border border-green-500/30">
                  <div className="flex w-full  items-center justify-between">
                    <div className=' w-full'>
                      <p className="text-green-300 text-sm">Total Income</p>
                      <div className="text-2xl flex items-center !justify-between w-full font-bold text-white">₹32,400
                        <TrendingUp className="w-8 h-8 text-green-400" />
                      </div>
                    </div>
                  </div>
                  <p className="text-green-300 text-sm mt-2">↗+12% from last month</p>
                </div>

                <div className="bg-gradient-to-br from-red-500/20 to-red-600/20 p-6 rounded-2xl border border-red-500/30">
                  <div className="flex items-center justify-between">
                    <div className=' w-full'>
                      <p className="text-red-300 text-sm">Total Expenses</p>
                      <div className="text-2xl flex items-center !justify-between w-full font-bold text-white">₹23,100
                        <TrendingDown className="w-8 h-8 text-red-400" />
                      </div>
                    </div>

                  </div>
                  <p className="text-red-300 text-sm mt-2">↘-5% from last month</p>
                </div>
              </div>

              {/* Charts Container */}
              <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
                {animationStep === 0 && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-center">Expense Categories</h3>
                    <ResponsiveContainer width="100%" height={300}>
                      <PieChart>
                        <Pie
                          data={expenseData}
                          cx="50%"
                          cy="50%"
                          innerRadius={70}
                          outerRadius={120}
                          paddingAngle={5}
                          dataKey="value"
                        >
                          {expenseData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip
                          contentStyle={{
                            backgroundColor: '#ffffff20',
                            color: 'white',
                            borderRadius: '5px',
                            backdropFilter: 'blur(20px)',
                            border: '1px solid transparent',
                          }}
                          itemStyle={{
                            color: 'white',
                            fontWeight: 'bold',
                          }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                )}

                {animationStep === 1 && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-center">Monthly Overview</h3>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={monthlyData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                        <XAxis dataKey="month" stroke="#9ca3af" />
                        {/* <YAxis stroke="#9ca3af" /> */}
                        <Tooltip
                          contentStyle={{
                            backgroundColor: '#ffffff20',
                            color: 'white',
                            borderRadius: '5px',
                            backdropFilter: 'blur(20px)',
                            border: '1px solid transparent',
                          }}
                          itemStyle={{
                            color: 'white',
                            fontWeight: 'bold',
                          }}
                        />
                        <Bar dataKey="income" fill="#89DCEB" radius={[4, 4, 0, 0]} />
                        <Bar dataKey="expense" fill="#CBA5F7" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                )}

                {animationStep === 2 && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-center">Weekly Spending Trend</h3>
                    <ResponsiveContainer width="100%" height={300}>
                      <AreaChart data={trendData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                        <defs>
                          <linearGradient id="colorcredit" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#CBA5F7" stopOpacity={0.8} />
                            <stop offset="95%" stopColor="#CBA5F7" stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <XAxis dataKey="day" stroke="#9ca3af" />
                        {/* <YAxis stroke="#9ca3af" /> */}
                        <Tooltip
                          contentStyle={{
                            backgroundColor: '#ffffff20',
                            color: 'white',
                            borderRadius: '5px',
                            backdropFilter: 'blur(20px)',
                            border: '1px solid transparent',
                          }}
                          itemStyle={{
                            color: 'white',
                            fontWeight: 'bold',
                          }}
                        />
                        <Area
                          type="monotone"
                          dataKey="amount"
                          stroke="#CBA5F7"
                          strokeWidth={3}
                          fillOpacity={0.5}
                          fill="url(#colorcredit)"
                          dot={{ fill: '#CBA5F7', strokeWidth: 1, r: 3 }}
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                )}

                {animationStep === 3 && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold">Daily Transactions</h3>
                      <div className="flex items-center space-x-2">
                        <ChevronLeft className="w-5 h-5 text-gray-400  cursor-pointer hover:text-white" />
                        <span className="text-sm font-medium">{currentMonth}</span>
                        <ChevronRight className="w-5 h-5 text-gray-400  cursor-pointer hover:text-white" />
                      </div>
                    </div>

                    <div className="grid grid-cols-7 gap-1 text-center text-sm">
                      {daysOfWeek.map(day => (
                        <div key={day} className="p-2 text-gray-400 font-medium">
                          {day}
                        </div>
                      ))}
                    </div>

                    <div className="grid grid-cols-7 gap-1 text-center text-sm max-h-64 overflow-hidden">
                      {generateCalendarDays().map(day => {
                        const dayData = calendarData[day];
                        return (
                          <div
                            key={day}
                            className=" max-md:h-12 h-14  border border-gray-700 rounded-lg hover:border-gray-500 transition-colors cursor-pointer relative"
                            style={{ backgroundColor: '#2a2a3a' }}
                          >
                            <div className="text-white font-medium mb-1">{day}</div>
                            {dayData && (
                              <div className="">
                                {dayData.income > 0 && (
                                  <div className="text-green-400 max-md:text-[8px] text-[10px] ">
                                    ↗ {dayData.income > 1000 ? `${(dayData.income / 1000).toFixed(0)}k` : dayData.income}
                                  </div>
                                )}
                                {dayData.expense > 0 && (
                                  <div className="text-red-400 max-md:text-[8px] text-[10px] ">
                                    ↘ {dayData.expense > 1000 ? `${(dayData.expense / 1000).toFixed(0)}k` : dayData.expense}
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="px-6 py-20 border-t border-white/10">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold mb-6">
              Everything You Need for{' '}
              <span className="bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
                Financial Control
              </span>
            </h2>
            <p className="text-gray-300 text-sm max-w-2xl mx-auto">
              Comprehensive tools to track, analyze, and optimize your spending habits
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-8 bg-white/5 rounded-2xl border border-white/10 hover:border-purple-500/30 transition-all duration-300">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <Mail className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-4">Email Integration</h3>
              <p className="text-gray-400 text-base max-md:text-sm">Fetch transactions directly using your email. Seamless integration with your existing workflow.</p>
            </div>

            <div className="text-center p-8 bg-white/5 rounded-2xl border border-white/10 hover:border-cyan-500/30 transition-all duration-300">
              <div className="w-16 h-16 bg-gradient-to-br from-cyan-500 to-cyan-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <BarChart3 className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-4">Smart Analytics</h3>
              <p className="text-gray-400 text-base max-md:text-sm">Advanced charts and insights to understand your spending patterns and financial health.</p>
            </div>

            <div className="text-center p-8 bg-white/5 rounded-2xl border border-white/10 hover:border-yellow-500/30 transition-all duration-300">
              <div className="w-16 h-16 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <Calendar className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-4">Daily Tracking</h3>
              <p className="text-gray-400 text-base max-md:text-sm">Visual calendar view of your daily transactions with income and expense tracking at a glance.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-6 py-20 border-t border-white/10">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl lg:text-4xl font-bold mb-6">
            Ready to Take Control of Your{' '}
            <span className="bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
              Financial Future?
            </span>
          </h2>
          <p className="text-gray-300 text-lg max-md:text-sm mb-8 max-w-2xl mx-auto">
            Join thousands of users who have transformed their financial habits with BankTracker
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href={`/login`} className="bg-gradient-to-r from-purple-500 to-cyan-500 px-8 py-4 rounded-full text-white font-medium hover:shadow-xl hover:shadow-purple-500/25 transition-all duration-300 transform hover:scale-105">
              Get Started for Free
            </Link>
            <Link href={`/`} className="border border-white/20 px-8 py-4 max-md:py-3 text-base max-md:py-3 rounded-full text-white font-medium hover:bg-white/5 transition-all duration-300">
              Schedule Demo
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default BankTrackerHero;