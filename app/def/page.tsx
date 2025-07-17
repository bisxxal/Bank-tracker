'use client'; 

import React, { useState } from 'react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Search, Plus, Download, Eye, CreditCard, TrendingUp, TrendingDown, Wallet, Filter, Calendar, Mail } from 'lucide-react';

const BankTrackerDashboard = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [searchEmail, setSearchEmail] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedPeriod, setSelectedPeriod] = useState('month');

  // Sample data
  const categoryData = [
    { name: 'Food & Dining', value: 1250, color: '#8B5CF6' },
    { name: 'Shopping', value: 980, color: '#06B6D4' },
    { name: 'Transportation', value: 450, color: '#10B981' },
    { name: 'Entertainment', value: 320, color: '#F59E0B' },
    { name: 'Bills & Utilities', value: 820, color: '#EF4444' },
    { name: 'Healthcare', value: 280, color: '#EC4899' }
  ];

  const monthlyData = [
    { month: 'Jan', income: 5000, expenses: 3200 },
    { month: 'Feb', income: 5200, expenses: 3800 },
    { month: 'Mar', income: 4800, expenses: 3100 },
    { month: 'Apr', income: 5500, expenses: 4100 },
    { month: 'May', income: 5300, expenses: 3900 },
    { month: 'Jun', income: 5800, expenses: 4200 }
  ];

  const recentTransactions = [
    { id: 1, type: 'debit', amount: 85.50, description: 'Grocery Shopping', category: 'Food & Dining', date: '2024-07-15', email: 'john@example.com' },
    { id: 2, type: 'credit', amount: 2500.00, description: 'Salary Deposit', category: 'Income', date: '2024-07-14', email: 'john@example.com' },
    { id: 3, type: 'debit', amount: 120.00, description: 'Gas Station', category: 'Transportation', date: '2024-07-13', email: 'john@example.com' },
    { id: 4, type: 'debit', amount: 45.99, description: 'Streaming Service', category: 'Entertainment', date: '2024-07-12', email: 'john@example.com' },
    { id: 5, type: 'debit', amount: 220.00, description: 'Electric Bill', category: 'Bills & Utilities', date: '2024-07-11', email: 'john@example.com' }
  ];

  const stats = {
    totalBalance: 12450.75,
    monthlyIncome: 5800.00,
    monthlyExpenses: 4200.00,
    savingsRate: 27.6
  };

  const StatCard = ({ title, value, icon: Icon, trend, color }) => (
    <div className="bg-[#1E1E2E] p-6 rounded-xl border border-[#313244] hover:border-[#585B70] transition-all duration-300">
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-lg ${color}`}>
          <Icon size={24} className="text-white" />
        </div>
        {trend && (
          <div className={`flex items-center text-sm ${trend > 0 ? 'text-green-400' : 'text-red-400'}`}>
            {trend > 0 ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
            <span className="ml-1">{Math.abs(trend)}%</span>
          </div>
        )}
      </div>
      <h3 className="text-[#CDD6F4] text-sm font-medium">{title}</h3>
      <p className="text-white text-2xl font-bold">{value}</p>
    </div>
  );

  const TransactionRow = ({ transaction }) => (
    <div className="flex items-center justify-between p-4 bg-[#1E1E2E] rounded-lg border border-[#313244] hover:border-[#585B70] transition-all duration-200">
      <div className="flex items-center space-x-4">
        <div className={`p-2 rounded-full ${transaction.type === 'credit' ? 'bg-green-500/20' : 'bg-red-500/20'}`}>
          {transaction.type === 'credit' ? 
            <TrendingUp size={16} className="text-green-400" /> : 
            <TrendingDown size={16} className="text-red-400" />
          }
        </div>
        <div>
          <p className="text-white font-medium">{transaction.description}</p>
          <p className="text-[#CDD6F4] text-sm">{transaction.category} • {transaction.date}</p>
        </div>
      </div>
      <div className="text-right">
        <p className={`font-bold ${transaction.type === 'credit' ? 'text-green-400' : 'text-red-400'}`}>
          {transaction.type === 'credit' ? '+' : '-'}${transaction.amount.toFixed(2)}
        </p>
        <p className="text-[#CDD6F4] text-sm">{transaction.email}</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#181825] text-white">
      {/* Header */}
      <div className="bg-[#1E1E2E] border-b border-[#313244] px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="bg-gradient-to-r from-purple-500 to-blue-500 p-2 rounded-xl">
              <Wallet size={24} className="text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold">Bank Tracker</h1>
              <p className="text-[#CDD6F4] text-sm">Manage your finances with ease</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#CDD6F4]" />
              <input
                type="email"
                placeholder="Search by email..."
                value={searchEmail}
                onChange={(e) => setSearchEmail(e.target.value)}
                className="bg-[#181825] border border-[#313244] rounded-lg pl-10 pr-4 py-2 text-white placeholder-[#CDD6F4] focus:outline-none focus:border-purple-500"
              />
            </div>
            <button className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 px-4 py-2 rounded-lg flex items-center space-x-2 transition-all duration-200">
              <Plus size={18} />
              <span>Add Transaction</span>
            </button>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="bg-[#1E1E2E] border-b border-[#313244] px-6">
        <div className="flex space-x-8">
          {['dashboard', 'transactions', 'categories', 'statements'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`py-4 px-2 text-sm font-medium capitalize border-b-2 transition-colors ${
                activeTab === tab
                  ? 'border-purple-500 text-purple-400'
                  : 'border-transparent text-[#CDD6F4] hover:text-white'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="p-6">
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatCard
                title="Total Balance"
                value={`$${stats.totalBalance.toLocaleString()}`}
                icon={Wallet}
                trend={5.2}
                color="bg-gradient-to-r from-purple-500 to-blue-500"
              />
              <StatCard
                title="Monthly Income"
                value={`$${stats.monthlyIncome.toLocaleString()}`}
                icon={TrendingUp}
                trend={8.1}
                color="bg-gradient-to-r from-green-500 to-emerald-500"
              />
              <StatCard
                title="Monthly Expenses"
                value={`$${stats.monthlyExpenses.toLocaleString()}`}
                icon={TrendingDown}
                trend={-3.2}
                color="bg-gradient-to-r from-red-500 to-pink-500"
              />
              <StatCard
                title="Savings Rate"
                value={`${stats.savingsRate}%`}
                icon={CreditCard}
                trend={12.5}
                color="bg-gradient-to-r from-orange-500 to-yellow-500"
              />
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Pie Chart */}
              <div className="bg-[#1E1E2E] p-6 rounded-xl border border-[#313244]">
                <h3 className="text-lg font-semibold mb-4 text-white">Spending by Category</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={categoryData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {categoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#1E1E2E', 
                        border: '1px solid #313244',
                        borderRadius: '8px',
                        color: '#CDD6F4'
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
                <div className="mt-4 space-y-2">
                  {categoryData.map((category, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: category.color }}></div>
                        <span className="text-sm text-[#CDD6F4]">{category.name}</span>
                      </div>
                      <span className="text-sm text-white font-medium">${category.value}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Bar Chart */}
              <div className="bg-[#1E1E2E] p-6 rounded-xl border border-[#313244]">
                <h3 className="text-lg font-semibold mb-4 text-white">Income vs Expenses</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={monthlyData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#313244" />
                    <XAxis dataKey="month" stroke="#CDD6F4" />
                    <YAxis stroke="#CDD6F4" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#1E1E2E', 
                        border: '1px solid #313244',
                        borderRadius: '8px',
                        color: '#CDD6F4'
                      }}
                    />
                    <Legend />
                    <Bar dataKey="income" fill="#10B981" name="Income" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="expenses" fill="#EF4444" name="Expenses" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Recent Transactions */}
            <div className="bg-[#1E1E2E] p-6 rounded-xl border border-[#313244]">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-white">Recent Transactions</h3>
                <button className="text-purple-400 hover:text-purple-300 flex items-center space-x-1">
                  <Eye size={16} />
                  <span>View All</span>
                </button>
              </div>
              <div className="space-y-4">
                {recentTransactions.map((transaction) => (
                  <TransactionRow key={transaction.id} transaction={transaction} />
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'transactions' && (
          <div className="space-y-6">
            {/* Filters */}
            <div className="bg-[#1E1E2E] p-6 rounded-xl border border-[#313244]">
              <h3 className="text-lg font-semibold mb-4 text-white">Filter Transactions</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[#CDD6F4] mb-2">Category</label>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full bg-[#181825] border border-[#313244] rounded-lg px-3 py-2 text-white focus:outline-none focus:border-purple-500"
                  >
                    <option value="all">All Categories</option>
                    <option value="food">Food & Dining</option>
                    <option value="shopping">Shopping</option>
                    <option value="transport">Transportation</option>
                    <option value="entertainment">Entertainment</option>
                    <option value="bills">Bills & Utilities</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#CDD6F4] mb-2">Period</label>
                  <select
                    value={selectedPeriod}
                    onChange={(e) => setSelectedPeriod(e.target.value)}
                    className="w-full bg-[#181825] border border-[#313244] rounded-lg px-3 py-2 text-white focus:outline-none focus:border-purple-500"
                  >
                    <option value="week">This Week</option>
                    <option value="month">This Month</option>
                    <option value="quarter">This Quarter</option>
                    <option value="year">This Year</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#CDD6F4] mb-2">Email</label>
                  <div className="relative">
                    <Mail size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#CDD6F4]" />
                    <input
                      type="email"
                      placeholder="Filter by email..."
                      className="w-full bg-[#181825] border border-[#313244] rounded-lg pl-10 pr-3 py-2 text-white placeholder-[#CDD6F4] focus:outline-none focus:border-purple-500"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Transactions List */}
            <div className="bg-[#1E1E2E] p-6 rounded-xl border border-[#313244]">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-white">All Transactions</h3>
                <button className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 px-4 py-2 rounded-lg flex items-center space-x-2 transition-all duration-200">
                  <Download size={16} />
                  <span>Export</span>
                </button>
              </div>
              <div className="space-y-4">
                {recentTransactions.map((transaction) => (
                  <TransactionRow key={transaction.id} transaction={transaction} />
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'categories' && (
          <div className="space-y-6">
            <div className="bg-[#1E1E2E] p-6 rounded-xl border border-[#313244]">
              <h3 className="text-lg font-semibold mb-6 text-white">Category Analysis</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {categoryData.map((category, index) => (
                  <div key={index} className="bg-[#181825] p-4 rounded-lg border border-[#313244] hover:border-[#585B70] transition-all duration-200">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <div className="w-4 h-4 rounded-full" style={{ backgroundColor: category.color }}></div>
                        <span className="text-white font-medium">{category.name}</span>
                      </div>
                      <span className="text-[#CDD6F4] text-sm">
                        {((category.value / categoryData.reduce((sum, cat) => sum + cat.value, 0)) * 100).toFixed(1)}%
                      </span>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-white">${category.value}</p>
                      <p className="text-sm text-[#CDD6F4]">This month</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'statements' && (
          <div className="space-y-6">
            <div className="bg-[#1E1E2E] p-6 rounded-xl border border-[#313244]">
              <h3 className="text-lg font-semibold mb-6 text-white">Generate Statement</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-[#CDD6F4] mb-2">Statement Type</label>
                    <select className="w-full bg-[#181825] border border-[#313244] rounded-lg px-3 py-2 text-white focus:outline-none focus:border-purple-500">
                      <option>Monthly Statement</option>
                      <option>Quarterly Statement</option>
                      <option>Annual Statement</option>
                      <option>Custom Period</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#CDD6F4] mb-2">Date Range</label>
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="date"
                        className="bg-[#181825] border border-[#313244] rounded-lg px-3 py-2 text-white focus:outline-none focus:border-purple-500"
                      />
                      <input
                        type="date"
                        className="bg-[#181825] border border-[#313244] rounded-lg px-3 py-2 text-white focus:outline-none focus:border-purple-500"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#CDD6F4] mb-2">Email Address</label>
                    <input
                      type="email"
                      placeholder="Enter email address..."
                      className="w-full bg-[#181825] border border-[#313244] rounded-lg px-3 py-2 text-white placeholder-[#CDD6F4] focus:outline-none focus:border-purple-500"
                    />
                  </div>
                  <button className="w-full bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 px-4 py-2 rounded-lg flex items-center justify-center space-x-2 transition-all duration-200">
                    <Download size={16} />
                    <span>Generate Statement</span>
                  </button>
                </div>
                <div className="bg-[#181825] p-4 rounded-lg border border-[#313244]">
                  <h4 className="text-white font-medium mb-3">Statement Preview</h4>
                  <div className="space-y-2 text-sm">
                    <p className="text-[#CDD6F4]">Account Summary</p>
                    <div className="flex justify-between">
                      <span className="text-[#CDD6F4]">Total Income:</span>
                      <span className="text-green-400">$5,800.00</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#CDD6F4]">Total Expenses:</span>
                      <span className="text-red-400">$4,200.00</span>
                    </div>
                    <div className="flex justify-between font-medium">
                      <span className="text-white">Net Balance:</span>
                      <span className="text-white">$1,600.00</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BankTrackerDashboard;
