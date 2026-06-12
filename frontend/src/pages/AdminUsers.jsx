import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { Users, Search, RefreshCw, Calendar, Mail } from 'lucide-react';
import { toast } from 'react-toastify';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams();
      if (searchQuery.trim()) {
        queryParams.append('search', searchQuery.trim());
      }
      
      const response = await api.get(`/api/users?${queryParams.toString()}`);
      setUsers(response.data);
    } catch (error) {
      console.error("Error fetching admin users:", error);
      toast.error("Failed to load user profiles.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchUsers();
  };

  return (
    <div className="space-y-6 pb-10">
      
      {/* Title Header */}
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight font-display">Manage Users</h1>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Inspect user account emails, names, assign roles, and audit account logs.</p>
      </div>

      {/* Search Input bar */}
      <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-gray-150 dark:border-slate-750 premium-shadow">
        <form onSubmit={handleSearchSubmit} className="flex h-10 w-full md:max-w-md bg-gray-55 dark:bg-slate-900 border border-gray-300 dark:border-slate-750 rounded-lg overflow-hidden focus-within:ring-1 focus-within:ring-amazon-gold">
          <input
            type="text"
            placeholder="Search users by name or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 px-4 text-xs focus:outline-none bg-transparent"
          />
          <button type="submit" className="bg-gray-200 dark:bg-slate-750 hover:bg-gray-300 px-4 text-xs font-bold transition-all flex items-center gap-1">
            <Search size={14} /> Search
          </button>
        </form>
      </div>

      {/* Users Data Grid Table */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-150 dark:border-slate-750 premium-shadow overflow-hidden">
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <RefreshCw size={24} className="animate-spin text-amazon-gold" />
          </div>
        ) : users.length === 0 ? (
          <div className="text-center py-20 text-gray-500">
            <p className="text-sm">No registered user accounts found.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-gray-50 dark:bg-slate-900 border-b border-gray-200 dark:border-slate-750 text-gray-400 font-bold uppercase tracking-wider">
                  <th className="py-4 px-6">User Account</th>
                  <th className="py-4 px-4"><div className="flex items-center gap-1.5"><Mail size={14} /> Email Address</div></th>
                  <th className="py-4 px-4"><div className="flex items-center gap-1.5"><Calendar size={14} /> Registered Date</div></th>
                  <th className="py-4 px-6 text-right">Access Role</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-slate-750 font-medium text-gray-755 dark:text-gray-250">
                {users.map((u) => {
                  const regDate = u.createdAt ? new Date(u.createdAt).toLocaleDateString(undefined, { dateStyle: 'medium' }) : 'Demo Session';
                  
                  return (
                    <tr key={u.uid} className="hover:bg-slate-50/50 dark:hover:bg-slate-750/10 transition-colors">
                      <td className="py-4 px-6 flex items-center gap-3">
                        {u.photoURL ? (
                          <img src={u.photoURL} alt={u.name} className="w-8 h-8 rounded-full border object-cover shrink-0" />
                        ) : (
                          <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700 text-gray-700 dark:text-gray-200 font-black flex items-center justify-center border shrink-0">
                            {u.name?.charAt(0).toUpperCase()}
                          </div>
                        )}
                        <div>
                          <h4 className="font-bold text-gray-800 dark:text-white line-clamp-1">{u.name}</h4>
                          <span className="text-[10px] text-gray-400 font-mono">UID: {u.uid}</span>
                        </div>
                      </td>
                      <td className="py-4 px-4">{u.email}</td>
                      <td className="py-4 px-4 whitespace-nowrap">{regDate}</td>
                      <td className="py-4 px-6 text-right">
                        <span className={`px-2.5 py-0.5 rounded-full font-bold text-[9px] uppercase tracking-wider ${u.role === 'admin' ? 'bg-indigo-100 text-indigo-800 dark:bg-indigo-950/30 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-900/50' : 'bg-gray-100 text-gray-700 dark:bg-slate-750 dark:text-gray-300'}`}>
                          {u.role || 'user'}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
};

export default AdminUsers;
