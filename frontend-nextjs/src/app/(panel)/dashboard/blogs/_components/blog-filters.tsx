'use client';

import { SearchIcon } from "@/components/icons";
import Select from "@/components/form/select";

interface BlogFiltersProps {
  searchTerm: string;
  selectedCategory: string;
  selectedStatus: string;
  sortBy: string;
  onSearchChange: (value: string) => void;
  onCategoryChange: (value: string) => void;
  onStatusChange: (value: string) => void;
  onSortChange: (value: string) => void;
}

const categories = ["All", "Market Insights", "Business Development", "Career Development", "Market Analysis", "Investment Guide", "Sustainability"];
const statusOptions = ["All", "published", "draft", "archived"];

export default function BlogFilters({
  searchTerm,
  selectedCategory,
  selectedStatus,
  sortBy,
  onSearchChange,
  onCategoryChange,
  onStatusChange,
  onSortChange
}: BlogFiltersProps) {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Search */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
          <div className="relative">
            <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search blogs..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent"
            />
          </div>
        </div>

        {/* Category Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
          <Select
            value={selectedCategory}
            onChange={(e) => onCategoryChange(e.target.value)}
            options={categories.map(cat => ({ value: cat, label: cat }))}
          />
        </div>

        {/* Status Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
          <Select
            value={selectedStatus}
            onChange={(e) => onStatusChange(e.target.value)}
            options={statusOptions.map(status => ({ 
              value: status, 
              label: status.charAt(0).toUpperCase() + status.slice(1) 
            }))}
          />
        </div>

        {/* Sort */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Sort By</label>
          <Select
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value)}
            options={[
              { value: 'newest', label: 'Newest First' },
              { value: 'oldest', label: 'Oldest First' },
              { value: 'title', label: 'Title A-Z' },
              { value: 'author', label: 'Author A-Z' },
              { value: 'views', label: 'Most Views' }
            ]}
          />
        </div>
      </div>
    </div>
  );
}