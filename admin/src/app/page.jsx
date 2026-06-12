"use client";

import React, { useState, useEffect } from "react";
import {
  Building2,
  Users,
  CheckCircle,
  Clock,
  Coins,
  TrendingUp,
  FileCheck,
  ShieldCheck,
  Search,
  Check,
  X,
  User,
  MapPin,
  FileText,
  DollarSign
} from "lucide-react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  BarChart,
  Bar,
  Cell,
  PieChart,
  Pie
} from "recharts";

// Mock Data
const initialStats = {
  totalUsers: 1420,
  totalProperties: 890,
  activeListings: 654,
  pendingListings: 182,
  revenue: 840200,
  pendingVerifications: 34,
  monthlyGrowth: 18.5,
};

const revenueData = [
  { name: "Jan", revenue: 80000 },
  { name: "Feb", revenue: 95000 },
  { name: "Mar", revenue: 110000 },
  { name: "Apr", revenue: 140000 },
  { name: "May", revenue: 195000 },
  { name: "Jun", revenue: 220200 },
];

const typeData = [
  { name: "House", value: 450, color: "#6366f1" },
  { name: "Apartment", value: 210, color: "#38bdf8" },
  { name: "Plot", value: 130, color: "#34d399" },
  { name: "Commercial", value: 80, color: "#fbbf24" },
  { name: "Others", value: 20, color: "#f87171" },
];

const initialPendingListings = [
  {
    id: "prop-1",
    title: "10 Marla Luxury House in DHA Phase 5",
    city: "Lahore",
    price: "28,500,000 PKR",
    owner: "Kamran Shah (Agent)",
    image: "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&q=80&w=200",
  },
  {
    id: "prop-2",
    title: "3 Bed Apartment in G-11 Sector",
    city: "Islamabad",
    price: "15,000,000 PKR",
    owner: "Zainab Malik (Seller)",
    image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&q=80&w=200",
  },
  {
    id: "prop-3",
    title: "4 Kanal Farmhouse in Bedian Road",
    city: "Lahore",
    price: "65,000,000 PKR",
    owner: "Ahsan Real Estate",
    image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=200",
  },
];

const initialPendingVerifications = [
  {
    id: "ver-1",
    fullName: "Muhammad Asif",
    role: "AGENT",
    cnic: "35201-1234567-9",
    documentType: "DHA Registry & CNIC Front/Back",
    phone: "+923007654321",
  },
  {
    id: "ver-2",
    fullName: "Siddique Sons Ltd",
    role: "SELLER",
    cnic: "42201-9876543-1",
    documentType: "Ownership Fard & Registry",
    phone: "+923214567890",
  },
];

const initialUsersList = [
  { id: "usr-1", name: "Muhammad Bilal", email: "bilal@gmail.com", phone: "+923001234567", role: "ADMIN", status: "Active" },
  { id: "usr-2", name: "Ali Raza", email: "ali.agent@outlook.com", phone: "+923129876543", role: "AGENT", status: "Active" },
  { id: "usr-3", name: "Hamza Malik", email: "hamza@realestate.com", phone: "+923334567890", role: "BUYER", status: "Active" },
  { id: "usr-4", name: "Sadaf Jamil", email: "sadaf.s@gmail.com", phone: "+923219876541", role: "SELLER", status: "Pending Verification" },
];

export default function AdminDashboard() {
  const [stats, setStats] = useState(initialStats);
  const [activeTab, setActiveTab] = useState("overview");
  const [pendingListings, setPendingListings] = useState(initialPendingListings);
  const [pendingVerifications, setPendingVerifications] = useState(initialPendingVerifications);
  const [usersList, setUsersList] = useState(initialUsersList);
  const [searchQuery, setSearchQuery] = useState("");
  const [isDarkMode, setIsDarkMode] = useState(true);

  // Toggle Dark Mode
  useEffect(() => {
    const root = window.document.documentElement;
    if (isDarkMode) {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  }, [isDarkMode]);

  // Handler for approvals
  const handleApproveListing = (id, approve) => {
    setPendingListings(pendingListings.filter((item) => item.id !== id));
    if (approve) {
      setStats((prev) => ({
        ...prev,
        activeListings: prev.activeListings + 1,
        pendingListings: Math.max(0, prev.pendingListings - 1),
      }));
    } else {
      setStats((prev) => ({
        ...prev,
        pendingListings: Math.max(0, prev.pendingListings - 1),
      }));
    }
  };

  const handleApproveVerification = (id, approve) => {
    setPendingVerifications(pendingVerifications.filter((item) => item.id !== id));
    setStats((prev) => ({
      ...prev,
      pendingVerifications: Math.max(0, prev.pendingVerifications - 1),
    }));
  };

  // Filtered Users
  const filteredUsers = usersList.filter(
    (u) =>
      u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.phone.includes(searchQuery) ||
      u.role.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className={`min-h-screen ${isDarkMode ? "bg-slate-950 text-slate-100" : "bg-slate-50 text-slate-800"}`}>
      {/* Sidebar / Navigation Header */}
      <nav className={`border-b ${isDarkMode ? "border-slate-800 bg-slate-900/50" : "border-slate-200 bg-white"} backdrop-blur sticky top-0 z-40`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center gap-3">
              <div className="bg-primary-600 text-white p-2 rounded-lg">
                <Building2 className="w-6 h-6" />
              </div>
              <span className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-primary-500 to-sky-400 bg-clip-text text-transparent">
                PropertyHub Pakistan Admin
              </span>
            </div>

            <div className="flex items-center gap-4">
              <button
                onClick={() => setIsDarkMode(!isDarkMode)}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold ${
                  isDarkMode ? "bg-slate-800 hover:bg-slate-700 text-slate-300" : "bg-slate-200 hover:bg-slate-300 text-slate-700"
                }`}
              >
                {isDarkMode ? "☀️ Light Mode" : "🌙 Dark Mode"}
              </button>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-primary-600 text-white flex items-center justify-center font-bold">
                  A
                </div>
                <span className="text-sm font-medium hidden sm:inline">Admin Console</span>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Body */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Navigation Tabs */}
        <div className="flex border-b border-slate-700 mb-8 overflow-x-auto gap-2">
          {["overview", "listings", "verifications", "users"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-3 font-semibold text-sm capitalize border-b-2 transition-all whitespace-nowrap ${
                activeTab === tab
                  ? "border-primary-500 text-primary-500"
                  : "border-transparent text-slate-400 hover:text-slate-200"
              }`}
            >
              {tab === "verifications" ? `CNIC Approvals (${pendingVerifications.length})` : tab}
            </button>
          ))}
        </div>

        {/* Overview Dashboard Tab */}
        {activeTab === "overview" && (
          <div className="space-y-8 animate-fadeIn">
            {/* KPI Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { label: "Total Users", value: stats.totalUsers, icon: Users, color: "text-blue-500", bg: "bg-blue-500/10" },
                { label: "Total Listings", value: stats.totalProperties, icon: Building2, color: "text-indigo-500", bg: "bg-indigo-500/10" },
                { label: "Pending Approvals", value: pendingListings.length, icon: Clock, color: "text-amber-500", bg: "bg-amber-500/10" },
                { label: "Platform Revenue", value: `${stats.revenue.toLocaleString()} PKR`, icon: Coins, color: "text-emerald-500", bg: "bg-emerald-500/10" },
              ].map((card, idx) => {
                const Icon = card.icon;
                return (
                  <div key={idx} className={`p-6 rounded-2xl border ${isDarkMode ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200"} shadow-sm flex items-center justify-between`}>
                    <div>
                      <p className="text-sm font-medium text-slate-400 mb-1">{card.label}</p>
                      <h3 className="text-2xl font-bold">{card.value}</h3>
                    </div>
                    <div className={`${card.bg} ${card.color} p-4 rounded-xl`}>
                      <Icon className="w-6 h-6" />
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Line Area Chart */}
              <div className={`p-6 rounded-2xl border lg:col-span-2 ${isDarkMode ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200"} shadow-sm`}>
                <h4 className="font-bold text-lg mb-6 flex items-center gap-2">
                  <TrendingUp className="text-primary-500 w-5 h-5" /> Revenue Trends (PKR)
                </h4>
                <div className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={revenueData}>
                      <defs>
                        <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4} />
                          <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <XAxis dataKey="name" stroke="#64748b" fontSize={12} tickLine={false} />
                      <YAxis stroke="#64748b" fontSize={12} tickLine={false} />
                      <Tooltip contentStyle={{ background: isDarkMode ? "#0f172a" : "#ffffff", borderColor: "#4f46e5" }} />
                      <Area type="monotone" dataKey="revenue" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Pie Chart */}
              <div className={`p-6 rounded-2xl border ${isDarkMode ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200"} shadow-sm`}>
                <h4 className="font-bold text-lg mb-6 flex items-center gap-2">
                  <Building2 className="text-primary-500 w-5 h-5" /> Property Types Breakdown
                </h4>
                <div className="h-72 flex flex-col justify-between">
                  <div className="h-44">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={typeData}
                          cx="50%"
                          cy="50%"
                          innerRadius={50}
                          outerRadius={70}
                          paddingAngle={5}
                          dataKey="value"
                        >
                          {typeData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="grid grid-cols-2 gap-2 mt-4 text-xs font-semibold">
                    {typeData.map((t, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        <span className="w-3 h-3 rounded-full" style={{ backgroundColor: t.color }}></span>
                        <span className="text-slate-400">{t.name} ({t.value})</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Listings Approvals Tab */}
        {activeTab === "listings" && (
          <div className="space-y-6 animate-fadeIn">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-bold flex items-center gap-2">
                <Clock className="text-amber-500" /> Pending Property Listing Approvals
              </h3>
              <span className="px-3 py-1 bg-amber-500/10 text-amber-500 text-xs font-semibold rounded-full">
                {pendingListings.length} Listings Verification Required
              </span>
            </div>

            {pendingListings.length === 0 ? (
              <div className={`p-12 text-center rounded-2xl border ${isDarkMode ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200"}`}>
                <ShieldCheck className="w-12 h-12 mx-auto text-emerald-500 mb-4" />
                <p className="font-bold text-lg text-slate-300">All properties cleared!</p>
                <p className="text-sm text-slate-500 mt-1">No property listings are currently pending approval.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {pendingListings.map((p) => (
                  <div key={p.id} className={`rounded-2xl border ${isDarkMode ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200"} overflow-hidden shadow-sm flex flex-col justify-between`}>
                    <img src={p.image} alt={p.title} className="w-full h-44 object-cover" />
                    <div className="p-6 space-y-4">
                      <div>
                        <span className="text-xs font-semibold text-primary-500 uppercase">{p.city}</span>
                        <h4 className="font-bold text-lg line-clamp-1 mt-1">{p.title}</h4>
                        <p className="text-sm text-slate-400 mt-1 flex items-center gap-1">
                          <User className="w-4 h-4" /> Posted by: {p.owner}
                        </p>
                      </div>
                      <div className="flex justify-between items-center bg-slate-800/30 dark:bg-slate-950/40 p-3 rounded-xl">
                        <span className="text-xs text-slate-400 font-medium">Requested Price</span>
                        <span className="font-bold text-emerald-500 text-sm">{p.price}</span>
                      </div>
                      <div className="flex gap-3 pt-2">
                        <button
                          onClick={() => handleApproveListing(p.id, false)}
                          className="flex-1 py-2 bg-rose-600/10 hover:bg-rose-600/20 text-rose-500 font-semibold rounded-xl text-sm transition-all flex items-center justify-center gap-1 border border-rose-500/20"
                        >
                          <X className="w-4 h-4" /> Reject
                        </button>
                        <button
                          onClick={() => handleApproveListing(p.id, true)}
                          className="flex-1 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl text-sm transition-all flex items-center justify-center gap-1"
                        >
                          <Check className="w-4 h-4" /> Approve
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* CNIC Verification approvals */}
        {activeTab === "verifications" && (
          <div className="space-y-6 animate-fadeIn">
            <h3 className="text-xl font-bold flex items-center gap-2">
              <FileCheck className="text-indigo-500" /> Pending Owner & Agent CNIC Verifications
            </h3>

            {pendingVerifications.length === 0 ? (
              <div className={`p-12 text-center rounded-2xl border ${isDarkMode ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200"}`}>
                <ShieldCheck className="w-12 h-12 mx-auto text-emerald-500 mb-4" />
                <p className="font-bold text-lg text-slate-300">All users verified!</p>
                <p className="text-sm text-slate-500 mt-1">No user profiles are pending verification documents check.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {pendingVerifications.map((v) => (
                  <div key={v.id} className={`p-6 rounded-2xl border ${isDarkMode ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200"} flex flex-col md:flex-row justify-between items-start md:items-center gap-4`}>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-lg">{v.fullName}</span>
                        <span className={`px-2 py-0.5 rounded text-xs font-semibold ${v.role === "AGENT" ? "bg-indigo-500/10 text-indigo-500" : "bg-blue-500/10 text-blue-500"}`}>
                          {v.role}
                        </span>
                      </div>
                      <p className="text-sm text-slate-400">CNIC: <span className="font-mono">{v.cnic}</span> | Phone: {v.phone}</p>
                      <p className="text-xs text-slate-500 flex items-center gap-1">
                        <FileText className="w-4 h-4" /> Uploaded Document: <span className="underline">{v.documentType}</span>
                      </p>
                    </div>

                    <div className="flex gap-2 w-full md:w-auto">
                      <button
                        onClick={() => handleApproveVerification(v.id, false)}
                        className="px-4 py-2 bg-rose-500/10 hover:bg-rose-500/20 text-rose-500 font-semibold rounded-xl text-sm border border-rose-500/20 transition-all flex items-center gap-1"
                      >
                        <X className="w-4 h-4" /> Reject
                      </button>
                      <button
                        onClick={() => handleApproveVerification(v.id, true)}
                        className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-xl text-sm transition-all flex items-center gap-1"
                      >
                        <Check className="w-4 h-4" /> Verify CNIC
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Users Management Tab */}
        {activeTab === "users" && (
          <div className="space-y-6 animate-fadeIn">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <h3 className="text-xl font-bold">Manage Platform Users</h3>
              <div className="relative w-full sm:w-72">
                <input
                  type="text"
                  placeholder="Search by name, phone, or role..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className={`w-full pl-10 pr-4 py-2 rounded-xl border text-sm focus:outline-none focus:border-primary-500 ${
                    isDarkMode ? "bg-slate-900 border-slate-800 text-white" : "bg-white border-slate-200 text-slate-800"
                  }`}
                />
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              </div>
            </div>

            <div className={`border rounded-2xl overflow-hidden ${isDarkMode ? "border-slate-800 bg-slate-900" : "border-slate-200 bg-white"}`}>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className={`border-b ${isDarkMode ? "border-slate-800 bg-slate-800/30" : "border-slate-200 bg-slate-50"}`}>
                      <th className="p-4 text-sm font-semibold text-slate-400">Full Name</th>
                      <th className="p-4 text-sm font-semibold text-slate-400">Contact Details</th>
                      <th className="p-4 text-sm font-semibold text-slate-400">Role</th>
                      <th className="p-4 text-sm font-semibold text-slate-400">Status</th>
                      <th className="p-4 text-sm font-semibold text-slate-400 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800">
                    {filteredUsers.map((u) => (
                      <tr key={u.id} className={`hover:bg-slate-800/10`}>
                        <td className="p-4 font-bold">{u.name}</td>
                        <td className="p-4 text-sm">
                          <p className="font-mono">{u.phone}</p>
                          <p className="text-xs text-slate-400">{u.email}</p>
                        </td>
                        <td className="p-4">
                          <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                            u.role === "ADMIN"
                              ? "bg-rose-500/10 text-rose-500"
                              : u.role === "AGENT"
                              ? "bg-indigo-500/10 text-indigo-500"
                              : "bg-blue-500/10 text-blue-500"
                          }`}>
                            {u.role}
                          </span>
                        </td>
                        <td className="p-4 text-sm font-medium">
                          <span className={u.status === "Active" ? "text-emerald-500" : "text-amber-500"}>
                            ● {u.status}
                          </span>
                        </td>
                        <td className="p-4 text-right">
                          <button className="text-xs bg-slate-800 hover:bg-slate-700 font-semibold px-3 py-1.5 rounded-lg border border-slate-700">
                            Suspend
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
