"use client";

import { useState } from "react";
import { CreditCard, KeyRound, Bell, Shield, Trash2, Plus } from "lucide-react";
import { toast } from "react-hot-toast";

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("security");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      toast.success("Password updated successfully! (UI Sample)");
    }, 800);
  };

  const handleRemoveCard = () => {
    toast.success("Card removed successfully! (UI Sample)");
  };

  return (
    <div className="min-h-screen bg-[#fbeff6] py-12 px-4 sm:px-6 lg:px-8 pt-28">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-serif text-gray-900">Account Settings</h1>
          <p className="mt-2 text-[14px] text-gray-600">
            Manage your security preferences and payment methods
          </p>
        </div>

        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar */}
          <div className="w-full md:w-64 flex-shrink-0">
            <nav className="flex flex-col space-y-1">
              <button
                onClick={() => setActiveTab("security")}
                className={`flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-colors ${
                  activeTab === "security"
                    ? "bg-primary text-white"
                    : "text-gray-600 hover:bg-white hover:text-primary"
                }`}
              >
                <KeyRound size={18} className="mr-3" />
                Security & Password
              </button>
              <button
                onClick={() => setActiveTab("billing")}
                className={`flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-colors ${
                  activeTab === "billing"
                    ? "bg-primary text-white"
                    : "text-gray-600 hover:bg-white hover:text-primary"
                }`}
              >
                <CreditCard size={18} className="mr-3" />
                Payment Methods
              </button>
              <button
                onClick={() => setActiveTab("notifications")}
                className={`flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-colors ${
                  activeTab === "notifications"
                    ? "bg-primary text-white"
                    : "text-gray-600 hover:bg-white hover:text-primary"
                }`}
              >
                <Bell size={18} className="mr-3" />
                Notifications
              </button>
            </nav>
          </div>

          {/* Main Content */}
          <div className="flex-1 bg-white/70 border border-[#dfc7a5]/40 shadow-sm rounded-2xl p-6 sm:p-8">
            {activeTab === "security" && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-serif text-gray-900 flex items-center gap-2">
                    <Shield size={20} className="text-primary" />
                    Change Password
                  </h2>
                  <p className="mt-1 text-sm text-gray-500">
                    Ensure your account is using a long, random password to stay secure.
                  </p>
                </div>

                <form onSubmit={handlePasswordChange} className="space-y-5">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Current Password
                    </label>
                    <input
                      type="password"
                      className="w-full bg-white border border-[#dfc7a5] rounded-xl px-4 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-transparent transition-all"
                      placeholder="••••••••"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      New Password
                    </label>
                    <input
                      type="password"
                      className="w-full bg-white border border-[#dfc7a5] rounded-xl px-4 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-transparent transition-all"
                      placeholder="••••••••"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Confirm New Password
                    </label>
                    <input
                      type="password"
                      className="w-full bg-white border border-[#dfc7a5] rounded-xl px-4 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-transparent transition-all"
                      placeholder="••••••••"
                      required
                    />
                  </div>
                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="bg-primary hover:bg-primary/90 text-white px-6 py-2.5 rounded-xl text-sm font-semibold transition-all shadow-md active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                      {isSubmitting ? "Updating..." : "Update Password"}
                    </button>
                  </div>
                </form>
              </div>
            )}

            {activeTab === "billing" && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-serif text-gray-900 flex items-center gap-2">
                    <CreditCard size={20} className="text-primary" />
                    Saved Payment Methods
                  </h2>
                  <p className="mt-1 text-sm text-gray-500">
                    Manage the cards you use for fast checkout.
                  </p>
                </div>

                <div className="space-y-4">
                  {/* Sample Card */}
                  <div className="flex items-center justify-between p-4 border border-[#dfc7a5]/50 bg-white rounded-xl">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-8 bg-gray-100 rounded border flex items-center justify-center">
                        <span className="text-xs font-bold text-[#1a1f71]">VISA</span>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          Visa ending in 4242
                        </p>
                        <p className="text-xs text-gray-500">Expires 12/28</p>
                      </div>
                    </div>
                    <button
                      onClick={handleRemoveCard}
                      className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                      title="Remove card"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>

                  <button className="flex items-center gap-2 text-sm font-semibold text-primary hover:text-primary/80 transition-colors py-2">
                    <Plus size={16} />
                    Add New Payment Method
                  </button>
                </div>
              </div>
            )}

            {activeTab === "notifications" && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-serif text-gray-900 flex items-center gap-2">
                    <Bell size={20} className="text-primary" />
                    Notification Preferences
                  </h2>
                  <p className="mt-1 text-sm text-gray-500">
                    Choose what updates you want to receive from us.
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between py-3 border-b border-[#dfc7a5]/30">
                    <div>
                      <p className="text-sm font-medium text-gray-900">Order Updates</p>
                      <p className="text-xs text-gray-500">Receive notifications about your order status.</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" defaultChecked className="sr-only peer" />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                    </label>
                  </div>
                  
                  <div className="flex items-center justify-between py-3 border-b border-[#dfc7a5]/30">
                    <div>
                      <p className="text-sm font-medium text-gray-900">Promotions & Offers</p>
                      <p className="text-xs text-gray-500">Get notified about exclusive sales and new collections.</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                    </label>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
