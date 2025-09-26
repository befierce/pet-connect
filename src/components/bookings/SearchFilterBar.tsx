import React, { useState } from 'react';
import { Search, Filter, Calendar, User, DollarSign } from 'lucide-react';

interface SearchFilterBarProps {
  onSearch?: (query: string) => void;
  onFilterChange?: (filters: FilterOptions) => void;
}

interface FilterOptions {
  status?: string;
  dateRange?: string;
  clientName?: string;
  paymentStatus?: string;
}

export default function SearchFilterBar({ onSearch, onFilterChange }: SearchFilterBarProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<FilterOptions>({});
  const [showFilters, setShowFilters] = useState(false);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    onSearch?.(query);
  };

  const handleFilterChange = (key: keyof FilterOptions, value: string) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilterChange?.(newFilters);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-3 sm:p-4 mb-4 sm:mb-6 mx-1 sm:mx-0">
      <div className="flex flex-col gap-3 sm:flex-row sm:gap-4">
        {/* Search Input */}
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search bookings..."
            value={searchQuery}
            onChange={handleSearchChange}
            className="w-full pl-10 pr-4 py-2.5 sm:py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base sm:text-sm"
          />
        </div>

        {/* Filter Toggle Button */}
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center justify-center gap-2 px-4 py-2.5 sm:py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors text-sm font-medium"
        >
          <Filter className="w-4 h-4" />
          Filters
        </button>
      </div>

      {/* Filter Options */}
      {showFilters && (
        <div className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-gray-200">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            {/* Status Filter */}
            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <select
                value={filters.status || ''}
                onChange={(e) => handleFilterChange('status', e.target.value)}
                className="w-full px-3 py-2.5 sm:py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base sm:text-sm"
              >
                <option value="">All Statuses</option>
                <option value="confirmed">Confirmed</option>
                <option value="pending">Pending</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>

            {/* Date Range Filter */}
            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                <Calendar className="inline w-4 h-4 mr-1" />
                Date Range
              </label>
              <select
                value={filters.dateRange || ''}
                onChange={(e) => handleFilterChange('dateRange', e.target.value)}
                className="w-full px-3 py-2.5 sm:py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base sm:text-sm"
              >
                <option value="">All Dates</option>
                <option value="today">Today</option>
                <option value="week">This Week</option>
                <option value="month">This Month</option>
                <option value="quarter">This Quarter</option>
              </select>
            </div>

            {/* Client Name Filter */}
            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                <User className="inline w-4 h-4 mr-1" />
                Client
              </label>
              <input
                type="text"
                placeholder="Client name..."
                value={filters.clientName || ''}
                onChange={(e) => handleFilterChange('clientName', e.target.value)}
                className="w-full px-3 py-2.5 sm:py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base sm:text-sm"
              />
            </div>

            {/* Payment Status Filter */}
            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                <DollarSign className="inline w-4 h-4 mr-1" />
                Payment
              </label>
              <select
                value={filters.paymentStatus || ''}
                onChange={(e) => handleFilterChange('paymentStatus', e.target.value)}
                className="w-full px-3 py-2.5 sm:py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base sm:text-sm"
              >
                <option value="">All Payments</option>
                <option value="paid">Paid</option>
                <option value="pending">Pending</option>
                <option value="overdue">Overdue</option>
              </select>
            </div>
          </div>

          {/* Clear Filters Button */}
          <div className="mt-3 sm:mt-4 flex justify-end">
            <button
              onClick={() => {
                setFilters({});
                onFilterChange?.({});
              }}
              className="px-4 py-2 text-xs sm:text-sm text-gray-600 hover:text-gray-800 transition-colors"
            >
              Clear Filters
            </button>
          </div>
        </div>
      )}
    </div>
  );
}