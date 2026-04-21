'use client';

import { useState, useMemo } from 'react';
import prospectData from '@/../../documents/prospects_data.json';

interface Prospect {
  id: number;
  company_name: string;
  website: string;
  employee_count: number;
  revenue_estimate: number;
  state: string;
  city: string;
  phone: string | null;
  primary_contact: {
    name: string;
    title: string;
    email: string;
  };
  adoption_tier: string;
  adoption_score: number;
  rationale: string;
  hiring_signals: boolean;
  priority: number;
}

type FilterTier = 'all' | 'tier_1' | 'tier_2' | 'tier_3';

export default function ProspectsPage() {
  const [filterTier, setFilterTier] = useState<FilterTier>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'priority' | 'revenue' | 'adoption_score'>('priority');

  const prospects: Prospect[] = prospectData.prospects as Prospect[];

  const filteredAndSorted = useMemo(() => {
    let filtered = prospects.filter((prospect) => {
      const matchesTier =
        filterTier === 'all' ||
        (filterTier === 'tier_1' && prospect.adoption_tier === 'Tier 1') ||
        (filterTier === 'tier_2' && prospect.adoption_tier === 'Tier 2') ||
        (filterTier === 'tier_3' && prospect.adoption_tier === 'Tier 3');

      const matchesSearch =
        searchQuery === '' ||
        prospect.company_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        prospect.primary_contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        prospect.state.toLowerCase().includes(searchQuery.toLowerCase());

      return matchesTier && matchesSearch;
    });

    filtered.sort((a, b) => {
      if (sortBy === 'priority') {
        return a.priority - b.priority;
      } else if (sortBy === 'revenue') {
        return b.revenue_estimate - a.revenue_estimate;
      } else if (sortBy === 'adoption_score') {
        return b.adoption_score - a.adoption_score;
      }
      return 0;
    });

    return filtered;
  }, [filterTier, searchQuery, sortBy]);

  const tierStats = {
    tier_1: prospects.filter((p) => p.adoption_tier === 'Tier 1').length,
    tier_2: prospects.filter((p) => p.adoption_tier === 'Tier 2').length,
    tier_3: prospects.filter((p) => p.adoption_tier === 'Tier 3').length,
  };

  const getTierColor = (tier: string): string => {
    switch (tier) {
      case 'Tier 1':
        return 'bg-green-100 text-green-800';
      case 'Tier 2':
        return 'bg-blue-100 text-blue-800';
      case 'Tier 3':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-slate-900">Target Prospects</h1>
              <p className="text-slate-600 mt-1">
                {filteredAndSorted.length} of {prospects.length} agencies • DE Step 9: Market Validation
              </p>
            </div>
            <div className="bg-slate-900 text-white px-4 py-2 rounded-lg text-sm font-medium">
              Data Source: Apollo.io
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-lg border border-slate-200 p-4">
            <div className="text-sm text-slate-600 font-medium">Tier 1 (High-Intent)</div>
            <div className="text-2xl font-bold text-green-700">{tierStats.tier_1}</div>
            <p className="text-xs text-slate-500 mt-1">Pure-play agencies • Recent hires • CMO present</p>
          </div>
          <div className="bg-white rounded-lg border border-slate-200 p-4">
            <div className="text-sm text-slate-600 font-medium">Tier 2 (Medium-Intent)</div>
            <div className="text-2xl font-bold text-blue-700">{tierStats.tier_2}</div>
            <p className="text-xs text-slate-500 mt-1">Adjacent B2B • Stable teams • 25-40 employees</p>
          </div>
          <div className="bg-white rounded-lg border border-slate-200 p-4">
            <div className="text-sm text-slate-600 font-medium">Tier 3 (Low-Intent)</div>
            <div className="text-2xl font-bold text-gray-700">{tierStats.tier_3}</div>
            <p className="text-xs text-slate-500 mt-1">Non-agency • Oversized • Not marketing-focused</p>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="bg-white rounded-lg border border-slate-200 p-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Search */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Search</label>
              <input
                type="text"
                placeholder="Company, contact, or state..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Filter */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Adoption Tier</label>
              <select
                value={filterTier}
                onChange={(e) => setFilterTier(e.target.value as FilterTier)}
                className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Tiers</option>
                <option value="tier_1">Tier 1 (High-Intent)</option>
                <option value="tier_2">Tier 2 (Medium-Intent)</option>
                <option value="tier_3">Tier 3 (Low-Intent)</option>
              </select>
            </div>

            {/* Sort */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Sort By</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as 'priority' | 'revenue' | 'adoption_score')}
                className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="priority">Outreach Priority</option>
                <option value="adoption_score">Adoption Score</option>
                <option value="revenue">Revenue (High to Low)</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <div className="bg-white rounded-lg border border-slate-200 overflow-hidden shadow-sm">
          {filteredAndSorted.length === 0 ? (
            <div className="p-12 text-center">
              <p className="text-slate-600">No prospects match your filters.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full divide-y divide-slate-200">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                      Company
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                      Contact
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                      Location
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                      Size
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                      Revenue
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                      Tier
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                      Score
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                      Email
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {filteredAndSorted.map((prospect) => (
                    <tr key={prospect.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-4 py-3">
                        <div className="font-medium text-slate-900">{prospect.company_name}</div>
                        <div className="text-xs text-slate-500">{prospect.website}</div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="font-medium text-slate-900">{prospect.primary_contact.name}</div>
                        <div className="text-xs text-slate-500">{prospect.primary_contact.title}</div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="text-sm text-slate-900">
                          {prospect.city}, {prospect.state}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="text-sm text-slate-900">{prospect.employee_count}</div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="text-sm text-slate-900">
                          ${(prospect.revenue_estimate / 1000000).toFixed(1)}M
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-block px-2 py-1 text-xs font-semibold rounded-full ${getTierColor(
                            prospect.adoption_tier
                          )}`}
                        >
                          {prospect.adoption_tier}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1">
                          <div className="w-16 h-2 bg-slate-200 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-gradient-to-r from-orange-400 to-green-500"
                              style={{ width: `${(prospect.adoption_score / 5) * 100}%` }}
                            />
                          </div>
                          <span className="text-sm font-medium text-slate-900">
                            {prospect.adoption_score.toFixed(1)}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <a
                          href={`mailto:${prospect.primary_contact.email}`}
                          className="text-blue-600 hover:text-blue-800 text-xs font-medium underline"
                        >
                          Contact
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Footer Info */}
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm text-blue-900">
            <span className="font-semibold">Next Steps:</span> Begin cold outreach to Tier 1 prospects (Week 1).
            Target 3-4 pilot customers for MVP deployment. Monitor email open rates and response times.
          </p>
        </div>
      </div>
    </div>
  );
}
