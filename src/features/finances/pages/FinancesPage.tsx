import React from 'react';

export const FinancesPage = () => {
  return (
    <div className="min-h-screen bg-oled text-white font-display selection:bg-primary/30">
      
<div className="flex min-h-screen">
{/* Sidebar Navigation */}
<aside className="w-72 sidebar-glass flex flex-col justify-between p-6 fixed h-full">
<div className="flex flex-col gap-8">
<div className="flex flex-col px-3">
<h1 className="text-white text-2xl font-black tracking-tighter">LifeOS</h1>
<p className="text-gray-500 text-xs font-medium uppercase tracking-widest">Personal Workspace</p>
</div>
<nav className="flex flex-col gap-2">
<div className="flex items-center gap-3 px-4 py-3 cursor-pointer text-gray-400 hover:text-white transition-colors">
<span className="material-symbols-outlined">dashboard</span>
<p className="text-sm font-medium">Dashboard</p>
</div>
<div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-primary text-white shadow-lg shadow-primary/20">
<span className="material-symbols-outlined">account_balance_wallet</span>
<p className="text-sm font-medium">Finances</p>
</div>
<div className="flex items-center gap-3 px-4 py-3 cursor-pointer text-gray-400 hover:text-white transition-colors">
<span className="material-symbols-outlined">trending_up</span>
<p className="text-sm font-medium">Assets</p>
</div>
<div className="flex items-center gap-3 px-4 py-3 cursor-pointer text-gray-400 hover:text-white transition-colors">
<span className="material-symbols-outlined">calendar_today</span>
<p className="text-sm font-medium">Planning</p>
</div>
<div className="flex items-center gap-3 px-4 py-3 cursor-pointer text-gray-400 hover:text-white transition-colors">
<span className="material-symbols-outlined">settings</span>
<p className="text-sm font-medium">Settings</p>
</div>
</nav>
</div>
<div className="flex flex-col gap-4">
<div className="glass-card p-4 rounded-2xl">
<p className="text-xs text-gray-400 mb-1">Current Plan</p>
<p className="text-sm font-bold text-white mb-3">Pro Annual</p>
<button className="w-full py-2 bg-primary hover:bg-primary/90 rounded-xl text-sm font-bold transition-all">
                        Upgrade Plan
                    </button>
</div>
</div>
</aside>
{/* Main Content Area */}
<main className="flex-1 ml-72 p-8">
{/* Header Section */}
<header className="flex flex-wrap items-center justify-between gap-4 mb-8">
<div className="flex flex-col gap-1">
<h2 className="text-4xl font-black tracking-tight text-white">Finances</h2>
</div>
<div className="flex items-center gap-4">
{/* Segmented Month Selector */}
<div className="flex bg-glass p-1 rounded-full border border-white/10">
<button className="px-4 py-2 rounded-full text-xs font-semibold text-gray-400">September 2025</button>
<button className="px-6 py-2 rounded-full text-xs font-bold text-white bg-white/10 shadow-sm">October 2025</button>
<button className="px-4 py-2 rounded-full text-xs font-semibold text-gray-400">November 2025</button>
</div>
<button className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-white px-6 py-3 rounded-full font-bold text-sm transition-all">
<span className="material-symbols-outlined text-base">add</span>
                        Add Transaction
                    </button>
</div>
</header>
{/* Stats Summary Cards */}
<div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
<div className="glass-card p-8 rounded-2xl flex flex-col gap-3">
<div className="flex justify-between items-start">
<p className="text-gray-400 text-sm font-medium uppercase tracking-wider">Total Balance</p>
<span className="material-symbols-outlined text-primary">account_balance</span>
</div>
<p className="text-3xl font-black text-white">$12,450.00</p>
<div className="flex items-center gap-2">
<span className="px-2 py-0.5 rounded-full bg-success/20 text-success text-xs font-bold">+$1,200</span>
<p className="text-gray-500 text-xs">this month</p>
</div>
</div>
<div className="glass-card p-8 rounded-2xl flex flex-col gap-3">
<div className="flex justify-between items-start">
<p className="text-gray-400 text-sm font-medium uppercase tracking-wider">Monthly Income</p>
<span className="material-symbols-outlined text-success">payments</span>
</div>
<p className="text-3xl font-black text-white">$5,000.00</p>
<div className="flex items-center gap-2">
<span className="px-2 py-0.5 rounded-full bg-success/20 text-success text-xs font-bold">+10.2%</span>
<p className="text-gray-500 text-xs">vs last month</p>
</div>
</div>
<div className="glass-card p-8 rounded-2xl flex flex-col gap-3">
<div className="flex justify-between items-start">
<p className="text-gray-400 text-sm font-medium uppercase tracking-wider">Expenses</p>
<span className="material-symbols-outlined text-warning">shopping_cart</span>
</div>
<p className="text-3xl font-black text-white">$2,340.00</p>
<div className="flex items-center gap-2">
<span className="px-2 py-0.5 rounded-full bg-warning/20 text-warning text-xs font-bold">-5.2%</span>
<p className="text-gray-500 text-xs">decreased</p>
</div>
</div>
</div>
{/* Chart Section */}
<div className="glass-card p-8 rounded-2xl mb-8">
<div className="flex justify-between items-end mb-8">
<div>
<h3 className="text-xl font-bold text-white mb-1">Spending vs Income</h3>
<p className="text-gray-400 text-sm">Overview of cashflow for October</p>
</div>
<div className="flex gap-4">
<div className="flex items-center gap-2">
<div className="w-3 h-3 rounded-full bg-primary"></div>
<span className="text-xs text-gray-300 font-medium">Income</span>
</div>
<div className="flex items-center gap-2">
<div className="w-3 h-3 rounded-full bg-warning"></div>
<span className="text-xs text-gray-300 font-medium">Spending</span>
</div>
</div>
</div>
<div className="h-64 w-full relative">
<svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 1000 300">
{/* Income Line (Primary) */}
<path d="M0,250 Q100,220 200,180 T400,150 T600,120 T800,80 T1000,50" fill="none" stroke="#308ce8" stroke-linecap="round" stroke-width="4"></path>
{/* Spending Line (Warning Red) */}
<path d="M0,280 Q100,260 200,270 T400,230 T600,240 T800,210 T1000,220" fill="none" stroke="#ef4444" stroke-linecap="round" stroke-width="4"></path>
{/* Reference Grids */}
<line stroke="white" stroke-opacity="0.05" x1="0" x2="1000" y1="50" y2="50"></line>
<line stroke="white" stroke-opacity="0.05" x1="0" x2="1000" y1="150" y2="150"></line>
<line stroke="white" stroke-opacity="0.05" x1="0" x2="1000" y1="250" y2="250"></line>
</svg>
</div>
<div className="flex justify-between mt-4 text-xs font-bold text-gray-500 tracking-wider">
<span>WEEK 1</span>
<span>WEEK 2</span>
<span>WEEK 3</span>
<span>WEEK 4</span>
</div>
</div>
{/* Recent Transactions */}
<div className="glass-card p-8 rounded-2xl">
<div className="flex justify-between items-center mb-6">
<h3 className="text-xl font-bold text-white">Recent Transactions</h3>
<button className="text-primary text-sm font-bold hover:underline">View All</button>
</div>
<div className="flex flex-col gap-4">
{/* Transaction 1 */}
<div className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/5">
<div className="flex items-center gap-4">
<div className="w-10 h-10 rounded-full bg-black/40 flex items-center justify-center">
<span className="material-symbols-outlined text-gray-400">music_note</span>
</div>
<div>
<p className="text-sm font-bold text-white">Spotify Subscription</p>
<p className="text-xs text-gray-500">Subscription â¢ Oct 12, 2025</p>
</div>
</div>
<p className="text-sm font-bold text-white">-$9.99</p>
</div>
{/* Transaction 2 */}
<div className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/5">
<div className="flex items-center gap-4">
<div className="w-10 h-10 rounded-full bg-black/40 flex items-center justify-center">
<span className="material-symbols-outlined text-gray-400">shopping_bag</span>
</div>
<div>
<p className="text-sm font-bold text-white">Grocery Store</p>
<p className="text-xs text-gray-500">Food &amp; Dining â¢ Oct 10, 2025</p>
</div>
</div>
<p className="text-sm font-bold text-white">-$154.20</p>
</div>
{/* Transaction 3 */}
<div className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/5">
<div className="flex items-center gap-4">
<div className="w-10 h-10 rounded-full bg-success/10 flex items-center justify-center">
<span className="material-symbols-outlined text-success">work</span>
</div>
<div>
<p className="text-sm font-bold text-white">Freelance Payment</p>
<p className="text-xs text-gray-500">Income â¢ Oct 08, 2025</p>
</div>
</div>
<p className="text-sm font-bold text-success">+$1,500.00</p>
</div>
</div>
</div>
</main>
</div>

    </div>
  );
};
