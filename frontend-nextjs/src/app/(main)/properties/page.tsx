'use client';

import { useState, useEffect } from 'react';
import Image from "next/image";
import { MontserratFont } from "../../fonts";
import Button from "@/components/button";
import Section from "@/components/section";

// Types
interface Property {
  id: number;
  title: string;
  price: number;
  location: string;
  type: 'Residential' | 'Commercial' | 'Apartment' | 'Villa';
  status: 'For Sale' | 'For Rent' | 'Sold';
  bedrooms?: number;
  bathrooms?: number;
  area: number;
  image: string;
  featured: boolean;
  description: string;
}

// Mock data - replace with actual API call
const mockProperties: Property[] = [
  {
    id: 1,
    title: "Modern Downtown Apartment",
    price: 45000,
    location: "Downtown, City Center",
    type: "Apartment",
    status: "For Sale",
    bedrooms: 2,
    bathrooms: 2,
    area: 1200,
    image: "/images/banner-1.jpg",
    featured: true,
    description: "Beautiful modern apartment in the heart of downtown"
  },
  {
    id: 2,
    title: "Luxury Villa with Garden",
    price: 125000,
    location: "Suburbs, Green Valley",
    type: "Villa",
    status: "For Sale",
    bedrooms: 4,
    bathrooms: 3,
    area: 2500,
    image: "/images/banner-2.jpg",
    featured: true,
    description: "Spacious villa with beautiful garden and pool"
  },
  {
    id: 3,
    title: "Commercial Office Space",
    price: 3500,
    location: "Business District",
    type: "Commercial",
    status: "For Rent",
    area: 800,
    image: "/images/banner-1.jpg",
    featured: false,
    description: "Prime commercial space perfect for offices"
  },
  {
    id: 4,
    title: "Family Residential Home",
    price: 85000,
    location: "Residential Area, Oak Street",
    type: "Residential",
    status: "For Sale",
    bedrooms: 3,
    bathrooms: 2,
    area: 1800,
    image: "/images/banner-2.jpg",
    featured: false,
    description: "Perfect family home in quiet neighborhood"
  },
  {
    id: 5,
    title: "Studio Apartment",
    price: 1200,
    location: "City Center",
    type: "Apartment",
    status: "For Rent",
    bedrooms: 1,
    bathrooms: 1,
    area: 500,
    image: "/images/banner-1.jpg",
    featured: false,
    description: "Cozy studio apartment for young professionals"
  },
  {
    id: 6,
    title: "Executive Villa",
    price: 250000,
    location: "Elite Hills",
    type: "Villa",
    status: "For Sale",
    bedrooms: 5,
    bathrooms: 4,
    area: 3500,
    image: "/images/banner-2.jpg",
    featured: true,
    description: "Luxury executive villa with premium amenities"
  }
];

export default function PropertiesPage() {
  const [properties, setProperties] = useState<Property[]>(mockProperties);
  const [filteredProperties, setFilteredProperties] = useState<Property[]>(mockProperties);
  const [activeTab, setActiveTab] = useState<'All' | 'For Sale' | 'For Rent'>('All');
  const [sortBy, setSortBy] = useState('newest');
  const [currentPage, setCurrentPage] = useState(1);
  const [viewType, setViewType] = useState<'grid' | 'list'>('grid');
  const itemsPerPage = 6;

  // Filter properties based on active tab
  useEffect(() => {
    let filtered = properties;
    
    if (activeTab !== 'All') {
      filtered = properties.filter(property => property.status === activeTab);
    }

    // Apply sorting
    switch (sortBy) {
      case 'price-low':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'area-large':
        filtered.sort((a, b) => b.area - a.area);
        break;
      case 'area-small':
        filtered.sort((a, b) => a.area - b.area);
        break;
      case 'featured':
        filtered.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
        break;
      default:
        // newest first (default)
        filtered.sort((a, b) => b.id - a.id);
    }

    setFilteredProperties(filtered);
    setCurrentPage(1); // Reset to first page when filters change
  }, [activeTab, sortBy, properties]);

  // Pagination
  const totalPages = Math.ceil(filteredProperties.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentProperties = filteredProperties.slice(startIndex, endIndex);

  const formatPrice = (price: number, status: string) => {
    const formatted = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
    
    return status === 'For Rent' ? `${formatted}/month` : formatted;
  };

  const PropertyCard = ({ property }: { property: Property }) => (
    <div className="rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 bg-white">
      <div className="relative w-full h-[300px] overflow-hidden">
        <Image 
          src={property.image} 
          alt={property.title} 
          fill 
          className="object-cover hover:scale-105 transition-transform duration-300" 
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 to-transparent"></div>
        
        {/* Status Badge */}
        <div className="absolute top-4 right-4">
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
            property.status === 'For Sale' 
              ? 'bg-green-500 text-white' 
              : property.status === 'For Rent'
              ? 'bg-blue-500 text-white'
              : 'bg-gray-500 text-white'
          }`}>
            {property.status}
          </span>
        </div>

        {/* Featured Badge */}
        {property.featured && (
          <div className="absolute top-4 left-4">
            <span className="bg-[var(--primary)] text-white px-2 py-1 rounded text-xs font-medium">
              Featured
            </span>
          </div>
        )}
      </div>
      
      <div className="p-6">
        <div className="mb-4">
          <h3 className={`text-xl font-semibold mb-2 hover:text-[var(--primary)] cursor-pointer transition-colors ${MontserratFont.className}`}>
            {property.title}
          </h3>
          <p className="text-[var(--primary)] text-2xl font-bold">
            {formatPrice(property.price, property.status)}
          </p>
        </div>

        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-4 text-sm text-gray-600">
            {property.bedrooms && (
              <span className="flex items-center">
                <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 2L3 7v11h4v-6h6v6h4V7l-7-5z"/>
                </svg>
                {property.bedrooms} beds
              </span>
            )}
            {property.bathrooms && (
              <span className="flex items-center">
                <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M8 14v1H4v-1l.4-.5L5 12V4l-.5-.5L4 3V2h1v1h.5L6 3l.5.5L7 4v8l.6 1.5L8 14zM3 16h10v2H3v-2z"/>
                </svg>
                {property.bathrooms} baths
              </span>
            )}
            <span className="flex items-center">
              <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z"/>
              </svg>
              {property.area} sqft
            </span>
          </div>
          <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded">
            {property.type}
          </span>
        </div>

        <div className="mb-4">
          <p className="text-sm text-gray-600 flex items-center">
            <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd"/>
            </svg>
            {property.location}
          </p>
        </div>

        <div className="flex space-x-2">
          <Button variant="outline" className="flex-1">
            View Details
          </Button>
          <Button className="flex-1">
            Contact Agent
          </Button>
        </div>
      </div>
    </div>
  );

  return (
    <div>
      {/* Hero Section */}
      <div className="h-[400px] w-full relative">
        <Image src="/images/banner-1.jpg" alt="Properties banner" fill className="object-cover" />
        <div className="bg-black absolute inset-0 opacity-70 mix-blend-multiply"></div>
        <div className="absolute inset-0 flex flex-col gap-5 justify-center items-center">
          <h1 className={`text-5xl font-semibold text-white text-center ${MontserratFont.className}`}>
            Our Properties
          </h1>
          <p className="text-white text-xl text-center max-w-2xl">
            Discover your perfect property from our extensive collection of premium real estate
          </p>
        </div>
      </div>

      <Section className="my-20">
        {/* Header with filters */}
        <div className="flex justify-between items-center mb-10">
          <div>
            <h2 className={`text-4xl font-semibold ${MontserratFont.className}`}>
              Available Properties
            </h2>
            <p className="text-gray-600 mt-2">
              Showing {currentProperties.length} of {filteredProperties.length} properties
            </p>
          </div>
          
          <div className="flex items-center space-x-4">
            {/* Sort Dropdown */}
            <select 
              value={sortBy} 
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
            >
              <option value="newest">Newest First</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="area-large">Area: Large to Small</option>
              <option value="area-small">Area: Small to Large</option>
              <option value="featured">Featured First</option>
            </select>

            {/* View Toggle */}
            <div className="flex border border-gray-300 rounded-lg overflow-hidden">
              <button
                onClick={() => setViewType('grid')}
                className={`px-3 py-2 ${viewType === 'grid' ? 'bg-[var(--primary)] text-white' : 'bg-white text-gray-700'}`}
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"/>
                </svg>
              </button>
              <button
                onClick={() => setViewType('list')}
                className={`px-3 py-2 ${viewType === 'list' ? 'bg-[var(--primary)] text-white' : 'bg-white text-gray-700'}`}
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd"/>
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex justify-center mb-10">
          <div className="flex space-x-1 border-b border-gray-200">
            {(['All', 'For Sale', 'For Rent'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-3 px-6 font-medium transition-colors ${
                  activeTab === tab
                    ? 'bg-[var(--primary)] text-white rounded-t-lg'
                    : 'text-gray-600 hover:text-[var(--primary)]'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Properties Grid/List */}
        <div className={viewType === 'grid' ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" : "space-y-6"}>
          {currentProperties.map((property) => (
            <PropertyCard key={property.id} property={property} />
          ))}
        </div>

        {/* No Properties Found */}
        {filteredProperties.length === 0 && (
          <div className="text-center py-20">
            <h3 className={`text-2xl font-semibold mb-4 ${MontserratFont.className}`}>
              No Properties Found
            </h3>
            <p className="text-gray-600 mb-6">
              We couldn't find any properties matching your criteria.
            </p>
            <Button onClick={() => setActiveTab('All')}>
              View All Properties
            </Button>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center mt-12">
            <div className="flex space-x-2">
              {/* Previous Button */}
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                Previous
              </button>

              {/* Page Numbers */}
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`px-4 py-2 border rounded-lg ${
                    currentPage === page
                      ? 'bg-[var(--primary)] text-white border-[var(--primary)]'
                      : 'border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  {page}
                </button>
              ))}

              {/* Next Button */}
              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </Section>
    </div>
  );
}