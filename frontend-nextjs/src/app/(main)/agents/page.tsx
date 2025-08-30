'use client';

import { useState } from 'react';
import Image from "next/image";
import Link from "next/link";
import { MontserratFont } from "../../fonts";
import Button from "@/components/button";
import Section from "@/components/section";

// Types
interface Agent {
  id: number;
  name: string;
  title: string;
  bio: string;
  image: string;
  email: string;
  phone: string;
  whatsapp?: string;
  specialties: string[];
  languages: string[];
  experience: string;
  propertiesListed: number;
  propertiesSold: number;
  rating: number;
  totalReviews: number;
  verified: boolean;
  socialLinks: {
    linkedin?: string;
    facebook?: string;
    instagram?: string;
  };
  achievements: string[];
}

// Mock agents data
const mockAgents: Agent[] = [
  {
    id: 1,
    name: "Realtor Zabir",
    title: "Senior Real Estate Consultant",
    bio: "With over 8 years of experience in Dubai's dynamic real estate market, Zabir specializes in luxury residential properties and commercial investments. He has helped hundreds of clients find their perfect homes and investment opportunities.",
    image: "/images/banner-1.jpg",
    email: "zabir@dnaproperties.com",
    phone: "+971 50 123 4567",
    whatsapp: "+971 50 123 4567",
    specialties: ["Luxury Residential", "Commercial Properties", "Investment Advisory"],
    languages: ["English", "Arabic", "Hindi"],
    experience: "8+ Years",
    propertiesListed: 45,
    propertiesSold: 32,
    rating: 4.8,
    totalReviews: 127,
    verified: true,
    socialLinks: {
      linkedin: "https://linkedin.com/in/zabir",
      facebook: "https://facebook.com/zabir",
      instagram: "https://instagram.com/zabir"
    },
    achievements: ["Top Performer 2023", "Best Customer Service", "Million Dollar Club"]
  },
  {
    id: 2,
    name: "Sarah Ahmed",
    title: "Property Investment Specialist",
    bio: "Sarah brings a wealth of knowledge in property investment and market analysis. She helps clients make informed decisions about their real estate investments with a focus on ROI optimization.",
    image: "/images/banner-2.jpg",
    email: "sarah@dnaproperties.com",
    phone: "+971 55 987 6543",
    whatsapp: "+971 55 987 6543",
    specialties: ["Property Investment", "Market Analysis", "Portfolio Management"],
    languages: ["English", "Arabic", "French"],
    experience: "6+ Years",
    propertiesListed: 38,
    propertiesSold: 28,
    rating: 4.9,
    totalReviews: 98,
    verified: true,
    socialLinks: {
      linkedin: "https://linkedin.com/in/sarahahmed",
      instagram: "https://instagram.com/sarahahmed"
    },
    achievements: ["Rising Star 2023", "Client Choice Award", "Excellence in Service"]
  },
  {
    id: 3,
    name: "Ahmed Hassan",
    title: "Commercial Real Estate Expert",
    bio: "Ahmed specializes in commercial real estate transactions and business development. His expertise includes office spaces, retail properties, and industrial developments across Dubai.",
    image: "/images/banner-1.jpg",
    email: "ahmed@dnaproperties.com",
    phone: "+971 52 456 7890",
    whatsapp: "+971 52 456 7890",
    specialties: ["Commercial Real Estate", "Business Development", "Retail Properties"],
    languages: ["English", "Arabic"],
    experience: "10+ Years",
    propertiesListed: 52,
    propertiesSold: 41,
    rating: 4.7,
    totalReviews: 156,
    verified: true,
    socialLinks: {
      linkedin: "https://linkedin.com/in/ahmedhassan",
      facebook: "https://facebook.com/ahmedhassan"
    },
    achievements: ["Top Commercial Agent", "Industry Expert", "Trusted Advisor"]
  },
  {
    id: 4,
    name: "Maria Rodriguez",
    title: "Luxury Properties Consultant",
    bio: "Maria specializes in high-end luxury properties and exclusive developments. She provides personalized service to discerning clients looking for premium real estate opportunities.",
    image: "/images/banner-2.jpg",
    email: "maria@dnaproperties.com",
    phone: "+971 56 789 0123",
    whatsapp: "+971 56 789 0123",
    specialties: ["Luxury Properties", "Exclusive Developments", "High-Net-Worth Clients"],
    languages: ["English", "Spanish", "Arabic"],
    experience: "7+ Years",
    propertiesListed: 29,
    propertiesSold: 23,
    rating: 4.9,
    totalReviews: 82,
    verified: true,
    socialLinks: {
      linkedin: "https://linkedin.com/in/mariarodriguez",
      instagram: "https://instagram.com/mariarodriguez"
    },
    achievements: ["Luxury Specialist", "VIP Service Award", "Elite Agent"]
  },
  {
    id: 5,
    name: "Omar Al-Rashid",
    title: "Market Analysis Specialist",
    bio: "Omar combines deep market knowledge with data-driven insights to help clients make strategic real estate decisions. He specializes in market trends and investment analysis.",
    image: "/images/banner-1.jpg",
    email: "omar@dnaproperties.com",
    phone: "+971 50 345 6789",
    whatsapp: "+971 50 345 6789",
    specialties: ["Market Analysis", "Investment Strategy", "Data Analytics"],
    languages: ["English", "Arabic"],
    experience: "5+ Years",
    propertiesListed: 34,
    propertiesSold: 26,
    rating: 4.8,
    totalReviews: 74,
    verified: true,
    socialLinks: {
      linkedin: "https://linkedin.com/in/omaralrashid"
    },
    achievements: ["Data Expert", "Strategic Advisor", "Market Analyst"]
  },
  {
    id: 6,
    name: "Jennifer Thompson",
    title: "First-Time Buyer Specialist",
    bio: "Jennifer helps first-time buyers navigate the Dubai real estate market with confidence. She provides comprehensive guidance throughout the entire buying process.",
    image: "/images/banner-2.jpg",
    email: "jennifer@dnaproperties.com",
    phone: "+971 54 567 8901",
    whatsapp: "+971 54 567 8901",
    specialties: ["First-Time Buyers", "Residential Properties", "Buyer Guidance"],
    languages: ["English", "Arabic"],
    experience: "4+ Years",
    propertiesListed: 41,
    propertiesSold: 35,
    rating: 4.9,
    totalReviews: 91,
    verified: true,
    socialLinks: {
      linkedin: "https://linkedin.com/in/jenniferthompson",
      facebook: "https://facebook.com/jenniferthompson"
    },
    achievements: ["New Buyer Expert", "Service Excellence", "Trusted Guide"]
  }
];

const specialties = ["All", "Luxury Residential", "Commercial Properties", "Property Investment", "First-Time Buyers", "Market Analysis"];

export default function AgentsPage() {
  const [selectedSpecialty, setSelectedSpecialty] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [viewType, setViewType] = useState<'grid' | 'list'>('grid');
  const itemsPerPage = 6;

  // Filter agents based on specialty
  const filteredAgents = selectedSpecialty === "All" 
    ? mockAgents 
    : mockAgents.filter(agent => agent.specialties.some(specialty => specialty === selectedSpecialty));

  // Pagination
  const totalPages = Math.ceil(filteredAgents.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentAgents = filteredAgents.slice(startIndex, startIndex + itemsPerPage);

  const AgentCard = ({ agent }: { agent: Agent }) => (
    <div className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 group">
      {/* Agent Image */}
      <div className="relative h-[280px] overflow-hidden">
        <Image
          src={agent.image}
          alt={agent.name}
          fill
          className="object-cover group-hover:scale-110 transition-transform duration-700"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
        
        {/* Verified Badge */}
        {agent.verified && (
          <div className="absolute top-4 right-4">
            <div className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-medium flex items-center space-x-1">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span>Verified</span>
            </div>
          </div>
        )}

        {/* Contact Buttons */}
        <div className="absolute bottom-4 left-4 right-4 flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <a href={`tel:${agent.phone}`} className="flex-1 bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-lg text-center text-sm font-medium hover:bg-white/30 transition-colors">
            Call
          </a>
          <a href={`https://wa.me/${agent.whatsapp?.replace(/[^0-9]/g, '')}`} className="flex-1 bg-green-500 text-white px-4 py-2 rounded-lg text-center text-sm font-medium hover:bg-green-600 transition-colors">
            WhatsApp
          </a>
        </div>
      </div>

      {/* Agent Info */}
      <div className="p-6">
        {/* Name and Title */}
        <div className="mb-4">
          <h3 className={`text-xl font-bold mb-1 ${MontserratFont.className}`}>
            {agent.name}
          </h3>
          <p className="text-[var(--primary)] font-medium">{agent.title}</p>
        </div>

        {/* Rating and Reviews */}
        <div className="flex items-center space-x-4 mb-4">
          <div className="flex items-center space-x-1">
            {Array.from({ length: 5 }, (_, i) => (
              <svg
                key={i}
                className={`w-4 h-4 ${i < Math.floor(agent.rating) ? 'text-yellow-400' : 'text-gray-300'}`}
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            ))}
            <span className="text-sm font-medium ml-1">{agent.rating}</span>
          </div>
          <span className="text-sm text-gray-500">({agent.totalReviews} reviews)</span>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <p className="text-2xl font-bold text-[var(--primary)]">{agent.propertiesListed}</p>
            <p className="text-sm text-gray-600">Properties Listed</p>
          </div>
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <p className="text-2xl font-bold text-green-600">{agent.propertiesSold}</p>
            <p className="text-sm text-gray-600">Properties Sold</p>
          </div>
        </div>

        {/* Experience and Languages */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">Experience:</span>
            <span className="text-sm text-[var(--primary)] font-medium">{agent.experience}</span>
          </div>
          <div className="flex flex-wrap gap-1">
            {agent.languages.map((language, index) => (
              <span key={index} className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                {language}
              </span>
            ))}
          </div>
        </div>

        {/* Specialties */}
        <div className="mb-4">
          <p className="text-sm font-medium text-gray-700 mb-2">Specialties:</p>
          <div className="flex flex-wrap gap-1">
            {agent.specialties.slice(0, 2).map((specialty, index) => (
              <span key={index} className="bg-amber-100 text-amber-800 text-xs px-2 py-1 rounded-full">
                {specialty}
              </span>
            ))}
            {agent.specialties.length > 2 && (
              <span className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full">
                +{agent.specialties.length - 2} more
              </span>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex space-x-2">
          <Link href={`/agents/${agent.id}`} className="flex-1">
            <Button variant="outline" className="w-full">
              View Profile
            </Button>
          </Link>
          <a href={`mailto:${agent.email}`} className="flex-1">
            <Button className="w-full">
              Contact
            </Button>
          </a>
        </div>
      </div>
    </div>
  );

  return (
    <div>
      {/* Hero Section */}
      <div className="h-[400px] w-full relative">
        <Image src="/images/banner-1.jpg" alt="Our Agents" fill className="object-cover" />
        <div className="bg-black absolute inset-0 opacity-70 mix-blend-multiply"></div>
        <div className="absolute inset-0 flex flex-col gap-5 justify-center items-center text-center">
          <h1 className={`text-5xl font-semibold text-white ${MontserratFont.className}`}>
            Meet Our Expert Agents
          </h1>
          <p className="text-white text-xl max-w-3xl">
            Connect with Dubai's most experienced and trusted real estate professionals who are ready to help you achieve your property goals
          </p>
        </div>
      </div>

      {/* Main Content */}
      <Section className="py-20">
        {/* Header with filters */}
        <div className="flex flex-col lg:flex-row justify-between items-center mb-10">
          <div className="mb-6 lg:mb-0">
            <h2 className={`text-4xl font-semibold ${MontserratFont.className}`}>
              Our Professional Team
            </h2>
            <p className="text-gray-600 mt-2">
              Showing {currentAgents.length} of {filteredAgents.length} agents
            </p>
          </div>
          
          <div className="flex items-center space-x-4">
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

        {/* Specialties Filter */}
        <div className="flex justify-center mb-10">
          <div className="flex flex-wrap justify-center gap-2">
            {specialties.map((specialty) => (
              <button
                key={specialty}
                onClick={() => {
                  setSelectedSpecialty(specialty);
                  setCurrentPage(1);
                }}
                className={`px-6 py-3 rounded-full font-medium transition-all duration-300 ${
                  selectedSpecialty === specialty
                    ? 'bg-[var(--primary)] text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {specialty}
              </button>
            ))}
          </div>
        </div>

        {/* Agents Grid */}
        <div className={viewType === 'grid' ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" : "space-y-6"}>
          {currentAgents.map((agent) => (
            <AgentCard key={agent.id} agent={agent} />
          ))}
        </div>

        {/* No Agents Found */}
        {filteredAgents.length === 0 && (
          <div className="text-center py-20">
            <div className="text-6xl mb-6">👥</div>
            <h3 className={`text-2xl font-semibold mb-4 ${MontserratFont.className}`}>
              No Agents Found
            </h3>
            <p className="text-gray-600 mb-6">
              We couldn't find any agents matching your criteria.
            </p>
            <Button onClick={() => setSelectedSpecialty('All')}>
              View All Agents
            </Button>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center mt-12">
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
              >
                Previous
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`px-4 py-2 border rounded-lg transition-all ${
                    currentPage === page
                      ? 'bg-[var(--primary)] text-white border-[var(--primary)]'
                      : 'border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  {page}
                </button>
              ))}

              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </Section>

      {/* Join Our Team Section */}
      <div className="bg-gradient-to-r from-[var(--primary)] to-amber-500 py-20">
        <Section>
          <div className="text-center text-white">
            <h2 className={`text-4xl font-semibold mb-6 ${MontserratFont.className}`}>
              Join Our Expert Team
            </h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto opacity-90">
              Are you a passionate real estate professional? Join DNA Properties Hub and be part of Dubai's leading real estate team
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button className="bg-white text-[var(--primary)] hover:bg-gray-100 border-0 font-semibold">
                Apply Now
              </Button>
              <Button variant="dark">
                Learn More
              </Button>
            </div>
          </div>
        </Section>
      </div>
    </div>
  );
}