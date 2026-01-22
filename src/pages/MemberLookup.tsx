import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, User, Phone, Calendar, Award, Clock, CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { lookupMember, getApiUrl } from '../api/gymApi';
import type { Member } from '../types/member';

export default function MemberLookup() {
  const [memberId, setMemberId] = useState('');
  const [member, setMember] = useState<Member | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searched, setSearched] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!memberId.trim()) {
      setError('Please enter a Member ID');
      return;
    }

    if (!getApiUrl()) {
      setError('System not configured. Please contact the gym administrator.');
      return;
    }

    setLoading(true);
    setError(null);
    setMember(null);
    setSearched(true);

    try {
      const response = await lookupMember(memberId.trim());
      
      if (response.success && response.member) {
        setMember(response.member);
      } else {
        setError(response.error || 'Member not found');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const resetSearch = () => {
    setMemberId('');
    setMember(null);
    setError(null);
    setSearched(false);
  };

  return (
    <div className="h-full bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex flex-col">
      {/* Header */}
      <header className="pt-8 pb-4 px-4">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 mb-4 shadow-lg shadow-purple-500/30">
            <Award className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Gym Membership</h1>
          <p className="text-purple-200/70">Check your membership status</p>
        </motion.div>
      </header>

      {/* Main Content */}
      <main className="flex-1 px-4 pb-8">
        <div className="max-w-md mx-auto">
          {/* Search Form */}
          <motion.form 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            onSubmit={handleSearch}
            className="mb-6"
          >
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Search className="w-5 h-5 text-purple-400" />
              </div>
              <input
                type="text"
                value={memberId}
                onChange={(e) => setMemberId(e.target.value.toUpperCase())}
                placeholder="Enter Member ID (e.g., GYM001)"
                className="w-full pl-12 pr-4 py-4 bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl text-white placeholder-purple-300/50 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                disabled={loading}
              />
            </div>
            <motion.button
              type="submit"
              disabled={loading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full mt-4 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-2xl shadow-lg shadow-purple-500/30 hover:shadow-purple-500/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Searching...
                </>
              ) : (
                <>
                  <Search className="w-5 h-5" />
                  Check Status
                </>
              )}
            </motion.button>
          </motion.form>

          {/* Results */}
          <AnimatePresence mode="wait">
            {error && searched && (
              <motion.div
                key="error"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="bg-red-500/20 backdrop-blur-lg border border-red-500/30 rounded-2xl p-6 text-center"
              >
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-red-500/20 mb-4">
                  <XCircle className="w-6 h-6 text-red-400" />
                </div>
                <p className="text-red-200 font-medium">{error}</p>
                <button
                  onClick={resetSearch}
                  className="mt-4 text-sm text-red-300 hover:text-white transition-colors underline"
                >
                  Try again
                </button>
              </motion.div>
            )}

            {member && (
              <motion.div
                key="result"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-4"
              >
                {/* Status Card */}
                <div className={`relative overflow-hidden rounded-3xl p-6 ${
                  member.status === 'Active' 
                    ? 'bg-gradient-to-br from-emerald-500/20 to-teal-500/20 border border-emerald-500/30' 
                    : 'bg-gradient-to-br from-red-500/20 to-orange-500/20 border border-red-500/30'
                }`}>
                  <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
                  <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />
                  
                  <div className="relative">
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-sm font-medium text-white/70">Membership Status</span>
                      <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-semibold ${
                        member.status === 'Active'
                          ? 'bg-emerald-500/30 text-emerald-300'
                          : 'bg-red-500/30 text-red-300'
                      }`}>
                        {member.status === 'Active' ? (
                          <CheckCircle className="w-4 h-4" />
                        ) : (
                          <XCircle className="w-4 h-4" />
                        )}
                        {member.status}
                      </div>
                    </div>
                    
                    {member.status === 'Active' && member.daysRemaining !== undefined && (
                      <div className="text-center py-4">
                        <div className="text-5xl font-bold text-white mb-1">
                          {member.daysRemaining}
                        </div>
                        <div className="text-emerald-300/70 text-sm">days remaining</div>
                      </div>
                    )}
                    
                    {member.status === 'Expired' && (
                      <div className="text-center py-4">
                        <div className="text-xl font-semibold text-red-300 mb-1">
                          Membership Expired
                        </div>
                        <div className="text-red-300/70 text-sm">Please renew at the front desk</div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Member Details */}
                <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-3xl p-6 space-y-4">
                  <h3 className="text-lg font-semibold text-white mb-4">Member Details</h3>
                  
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-purple-500/20 flex items-center justify-center">
                      <User className="w-5 h-5 text-purple-400" />
                    </div>
                    <div>
                      <div className="text-xs text-purple-300/60 uppercase tracking-wide">Name</div>
                      <div className="text-white font-medium">{member.name}</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-pink-500/20 flex items-center justify-center">
                      <Phone className="w-5 h-5 text-pink-400" />
                    </div>
                    <div>
                      <div className="text-xs text-purple-300/60 uppercase tracking-wide">Phone</div>
                      <div className="text-white font-medium">{member.phone}</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center">
                      <Award className="w-5 h-5 text-blue-400" />
                    </div>
                    <div>
                      <div className="text-xs text-purple-300/60 uppercase tracking-wide">Membership Type</div>
                      <div className="text-white font-medium">{member.membershipType}</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-teal-500/20 flex items-center justify-center">
                      <Calendar className="w-5 h-5 text-teal-400" />
                    </div>
                    <div>
                      <div className="text-xs text-purple-300/60 uppercase tracking-wide">Valid Until</div>
                      <div className="text-white font-medium">{member.endDate}</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-amber-500/20 flex items-center justify-center">
                      <Clock className="w-5 h-5 text-amber-400" />
                    </div>
                    <div>
                      <div className="text-xs text-purple-300/60 uppercase tracking-wide">Member ID</div>
                      <div className="text-white font-medium font-mono">{member.id}</div>
                    </div>
                  </div>
                </div>

                {/* Search Again Button */}
                <motion.button
                  onClick={resetSearch}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full py-3 bg-white/10 border border-white/20 text-white font-medium rounded-2xl hover:bg-white/20 transition-all"
                >
                  Search Another Member
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Initial State */}
          {!searched && !member && !error && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-center py-8"
            >
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-white/5 mb-4">
                <Search className="w-10 h-10 text-purple-400/50" />
              </div>
              <p className="text-purple-200/50 text-sm">
                Enter your Member ID to check your membership status
              </p>
            </motion.div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="py-4 px-4 text-center">
        <p className="text-purple-300/40 text-xs">
          For any issues, please contact the gym front desk
        </p>
      </footer>
    </div>
  );
}
