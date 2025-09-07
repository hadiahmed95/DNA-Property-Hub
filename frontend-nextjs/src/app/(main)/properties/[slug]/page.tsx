'use client';

import { useState } from 'react';
import Image from "next/image";
import Link from "next/link";
import { MontserratFont } from "../../../fonts";
import Button from "@/components/button";
import Section from "@/components/section";
import { propertyData, similarProperties } from '../data';

// Types
export interface PropertyData {
  id: string;
  title: string;
  price: number;
  priceRange: string;
  propertyType: string;
  status: string;
  bedrooms: number;
  bathrooms: number;
  size: string;
  plotSize: string;
  yearBuilt: number;
  location: {
    address: string;
    area: string;
    city: string;
    country: string;
  };
  description: string;
  features: string[];
  amenities: string[];
  images: string[];
  floorPlans: string[];
  energyRating: string;
  developer: string;
  paymentPlan: {
    downPayment: string;
    duringConstruction: string;
    onHandover: string;
  };
  handover: string;
  agent: {
    name: string;
    phone: string;
    email: string;
    image: string;
  };
}

export default function SinglePropertyPage() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [activeTab, setActiveTab] = useState('overview');
  const [showMortgageCalculator, setShowMortgageCalculator] = useState(false);
  const [mortgageData, setMortgageData] = useState({
    loanAmount: propertyData.price * 0.8,
    downPayment: propertyData.price * 0.2,
    interestRate: 4.5,
    loanTerm: 25
  });

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'AED',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price).replace('AED', 'AED ');
  };

  const calculateMortgage = () => {
    const principal = mortgageData.loanAmount;
    const monthlyRate = mortgageData.interestRate / 100 / 12;
    const numberOfPayments = mortgageData.loanTerm * 12;
    
    const monthlyPayment = principal * (monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) / 
                          (Math.pow(1 + monthlyRate, numberOfPayments) - 1);
    
    return Math.round(monthlyPayment);
  };

  const ImageGallery = () => (
    <div className="mb-8">
      {/* Main Image */}
      <div className="relative h-[500px] w-full mb-4 rounded-2xl overflow-hidden">
        <Image
          src={propertyData.images[currentImageIndex]}
          alt={`${propertyData.title} - Image ${currentImageIndex + 1}`}
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
        
        {/* Navigation Arrows */}
        <button
          onClick={() => setCurrentImageIndex(prev => prev === 0 ? propertyData.images.length - 1 : prev - 1)}
          className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/20 backdrop-blur-sm text-white p-3 rounded-full hover:bg-white/30 transition-colors"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <button
          onClick={() => setCurrentImageIndex(prev => prev === propertyData.images.length - 1 ? 0 : prev + 1)}
          className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/20 backdrop-blur-sm text-white p-3 rounded-full hover:bg-white/30 transition-colors"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
          </svg>
        </button>

        {/* Image Counter */}
        <div className="absolute bottom-4 right-4 bg-black/50 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm">
          {currentImageIndex + 1} / {propertyData.images.length}
        </div>

        {/* Status Badge */}
        <div className="absolute top-4 left-4">
          <span className="bg-[var(--primary)] text-white px-4 py-2 rounded-full font-medium">
            {propertyData.status}
          </span>
        </div>
      </div>

      {/* Thumbnail Gallery */}
      <div className="flex space-x-2 overflow-x-auto px-1 py-2">
        {propertyData.images.map((image, index) => (
          <button
            key={index}
            onClick={() => setCurrentImageIndex(index)}
            className={`relative w-20 h-20 rounded-lg overflow-hidden flex-shrink-0 ${
              currentImageIndex === index ? 'ring-2 ring-[var(--primary)]' : ''
            }`}
          >
            <Image src={image} alt={`Thumbnail ${index + 1}`} fill className="object-cover" />
          </button>
        ))}
      </div>
    </div>
  );

  return (
    <div>
      {/* Breadcrumb */}
      <div className="bg-gray-50 py-4">
        <Section>
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <Link href="/" className="hover:text-[var(--primary)]">Home</Link>
            <span>/</span>
            <Link href="/properties" className="hover:text-[var(--primary)]">Properties</Link>
            <span>/</span>
            <span className="text-gray-900">{propertyData.propertyType}</span>
          </div>
        </Section>
      </div>

      <Section className="py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Property Header */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h1 className={`text-4xl font-bold mb-2 ${MontserratFont.className}`}>
                    {propertyData.title}
                  </h1>
                  <div className="flex items-center space-x-4 text-gray-600">
                    <div className="flex items-center space-x-1">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd"/>
                      </svg>
                      <span>{propertyData.location.area}, {propertyData.location.city}</span>
                    </div>
                    <span>•</span>
                    <span>Property ID: {propertyData.id}</span>
                  </div>
                </div>
                
                <div className="text-right">
                  <p className={`text-3xl font-bold text-[var(--primary)] ${MontserratFont.className}`}>
                    {propertyData.priceRange}
                  </p>
                  <p className="text-gray-600">Starting from {formatPrice(propertyData.price)}</p>
                </div>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-6 bg-gray-50 rounded-2xl">
                <div className="text-center">
                  <div className="flex items-center justify-center w-12 h-12 bg-[var(--primary)]/10 rounded-lg mx-auto mb-2">
                    <svg className="w-6 h-6 text-[var(--primary)]" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M10 2L3 7v11h4v-6h6v6h4V7l-7-5z"/>
                    </svg>
                  </div>
                  <p className="text-2xl font-bold text-[var(--primary)]">{propertyData.bedrooms}</p>
                  <p className="text-sm text-gray-600">Bedrooms</p>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center w-12 h-12 bg-blue-500/10 rounded-lg mx-auto mb-2">
                    <svg className="w-6 h-6 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M8 14v1H4v-1l.4-.5L5 12V4l-.5-.5L4 3V2h1v1h.5L6 3l.5.5L7 4v8l.6 1.5L8 14zM3 16h10v2H3v-2z"/>
                    </svg>
                  </div>
                  <p className="text-2xl font-bold text-blue-500">{propertyData.bathrooms}</p>
                  <p className="text-sm text-gray-600">Bathrooms</p>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center w-12 h-12 bg-green-500/10 rounded-lg mx-auto mb-2">
                    <svg className="w-6 h-6 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z"/>
                    </svg>
                  </div>
                  <p className="text-lg font-bold text-green-500">{propertyData.size}</p>
                  <p className="text-sm text-gray-600">Size (sqft)</p>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center w-12 h-12 bg-purple-500/10 rounded-lg mx-auto mb-2">
                    <svg className="w-6 h-6 text-purple-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2H4zm2 6a2 2 0 11-4 0 2 2 0 014 0zm8-2a2 2 0 100 4 2 2 0 000-4z" clipRule="evenodd"/>
                    </svg>
                  </div>
                  <p className="text-lg font-bold text-purple-500">{propertyData.yearBuilt}</p>
                  <p className="text-sm text-gray-600">Year Built</p>
                </div>
              </div>
            </div>

            {/* Image Gallery */}
            <ImageGallery />

            {/* Content Tabs */}
            <div className="mb-8">
              <div className="flex border-b border-gray-200">
                {[
                  { id: 'overview', label: 'Overview' },
                  { id: 'features', label: 'Features' },
                  { id: 'amenities', label: 'Amenities' },
                  { id: 'location', label: 'Location' },
                  { id: 'floor-plans', label: 'Floor Plans' }
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`px-6 py-3 font-medium transition-colors ${
                      activeTab === tab.id
                        ? 'border-b-2 border-[var(--primary)] text-[var(--primary)]'
                        : 'text-gray-600 hover:text-[var(--primary)]'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Tab Content */}
            <div className="bg-white p-6 rounded-xl">
              {activeTab === 'overview' && (
                <div>
                  <h3 className={`text-2xl font-bold mb-4 ${MontserratFont.className}`}>Description</h3>
                  <p className="text-gray-700 mb-6 leading-relaxed">{propertyData.description}</p>
                  
                  <h4 className={`text-xl font-bold mb-4 ${MontserratFont.className}`}>Prime Location & Connectivity</h4>
                  <p className="text-gray-700 mb-6 leading-relaxed">
                    Situated adjacent to The Oasis and The Heights Country Club, Selvara enjoys direct access to Expo Road and Emirates Road. 
                    It's a 5-minute drive to Al Maktoum International Airport, and approximately 20–25 minutes to Downtown Dubai or Dubai Marina, 
                    offering a serene setting with excellent global connectivity.
                  </p>

                  <h4 className={`text-xl font-bold mb-4 ${MontserratFont.className}`}>Investment Appeal</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div className="bg-gray-50 p-6 rounded-lg">
                      <h5 className="font-semibold mb-2">Developer</h5>
                      <p className="text-gray-700">{propertyData.developer}</p>
                    </div>
                    <div className="bg-gray-50 p-6 rounded-lg">
                      <h5 className="font-semibold mb-2">Handover</h5>
                      <p className="text-gray-700">{propertyData.handover}</p>
                    </div>
                    <div className="bg-gray-50 p-6 rounded-lg">
                      <h5 className="font-semibold mb-2">ROI Potential</h5>
                      <p className="text-gray-700">Estimated rental yield 6–7% in DIP</p>
                    </div>
                    <div className="bg-gray-50 p-6 rounded-lg">
                      <h5 className="font-semibold mb-2">Golden Visa</h5>
                      <p className="text-gray-700">Eligibility above AED 2M</p>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'features' && (
                <div>
                  <h3 className={`text-2xl font-bold mb-6 ${MontserratFont.className}`}>Property Features</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {propertyData.features.map((feature, index) => (
                      <div key={index} className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
                        <svg className="w-5 h-5 text-[var(--primary)] flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                        </svg>
                        <span className="text-gray-700">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'amenities' && (
                <div>
                  <h3 className={`text-2xl font-bold mb-6 ${MontserratFont.className}`}>Amenities & Lifestyle Features</h3>
                  <p className="text-gray-700 mb-6">Live in harmony with nature in a lifestyle-driven community offering:</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {propertyData.amenities.map((amenity, index) => (
                      <div key={index} className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
                        <svg className="w-5 h-5 text-green-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                        </svg>
                        <span className="text-gray-700">{amenity}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'location' && (
                <div>
                  <h3 className={`text-2xl font-bold mb-6 ${MontserratFont.className}`}>Location Details</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                      <h4 className="font-semibold mb-4">Address Information</h4>
                      <div className="space-y-3">
                        <div>
                          <span className="font-medium">Address:</span>
                          <span className="ml-2 text-gray-700">{propertyData.location.address}</span>
                        </div>
                        <div>
                          <span className="font-medium">Area:</span>
                          <span className="ml-2 text-gray-700">{propertyData.location.area}</span>
                        </div>
                        <div>
                          <span className="font-medium">City:</span>
                          <span className="ml-2 text-gray-700">{propertyData.location.city}</span>
                        </div>
                        <div>
                          <span className="font-medium">Country:</span>
                          <span className="ml-2 text-gray-700">{propertyData.location.country}</span>
                        </div>
                      </div>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-4">Nearby Landmarks</h4>
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <svg className="w-4 h-4 text-[var(--primary)]" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd"/>
                          </svg>
                          <span className="text-gray-700">5 min to Al Maktoum International Airport</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <svg className="w-4 h-4 text-[var(--primary)]" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd"/>
                          </svg>
                          <span className="text-gray-700">20-25 min to Downtown Dubai</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <svg className="w-4 h-4 text-[var(--primary)]" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd"/>
                          </svg>
                          <span className="text-gray-700">20-25 min to Dubai Marina</span>
                        </div>
                      </div>
                      <a 
                        href={`http://maps.google.com/?q=${encodeURIComponent(propertyData.location.address + ', ' + propertyData.location.city)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-block mt-4 text-[var(--primary)] hover:underline"
                      >
                        Open on Google Maps →
                      </a>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'floor-plans' && (
                <div>
                  <h3 className={`text-2xl font-bold mb-6 ${MontserratFont.className}`}>Floor Plans</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {propertyData.floorPlans.map((plan, index) => (
                      <div key={index} className="bg-gray-50 rounded-lg overflow-hidden">
                        <div className="relative h-[300px]">
                          <Image src={plan} alt={`Floor Plan ${index + 1}`} fill className="object-cover" />
                        </div>
                        <div className="p-4">
                          <h4 className="font-semibold">Floor Plan {index + 1}</h4>
                          <p className="text-sm text-gray-600">4 Bedroom Villa Layout</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-8 space-y-6">
              {/* Agent Card */}
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h3 className={`text-lg font-bold mb-4 ${MontserratFont.className}`}>Contact Agent</h3>
                <div className="flex items-center space-x-4 mb-4">
                  <div className="w-16 h-16 relative rounded-full overflow-hidden">
                    <Image src={propertyData.agent.image} alt={propertyData.agent.name} fill className="object-cover" />
                  </div>
                  <div>
                    <h4 className="font-semibold">{propertyData.agent.name}</h4>
                    <p className="text-sm text-gray-600">Senior Real Estate Consultant</p>
                    <div className="flex items-center space-x-1 mt-1">
                      {Array.from({ length: 5 }, (_, i) => (
                        <svg key={i} className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                      <span className="text-xs text-gray-500 ml-1">4.8 (127 reviews)</span>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <a href={`tel:${propertyData.agent.phone}`} className="block">
                    <Button 
                        className="w-full"
                        icon={<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>}
                    >
                      Call Now
                    </Button>
                  </a>
                  
                  <a href={`https://wa.me/${propertyData.agent.phone.replace(/[^0-9]/g, '')}`} className="block">
                    <Button variant="outline" className="w-full"
                    icon={<svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488" />
                      </svg>}
                    >
                      WhatsApp
                    </Button>
                  </a>
                  
                  <a href={`mailto:${propertyData.agent.email}`} className="block">
                    <Button variant="ghost" className="w-full"
                    icon={<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>}
                    >
                      Send Email
                    </Button>
                  </a>
                </div>
              </div>

              {/* Payment Plan */}
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h3 className={`text-lg font-bold mb-4 ${MontserratFont.className}`}>Payment Plan</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium">Down Payment</p>
                      <p className="text-sm text-gray-600">At booking</p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-[var(--primary)]">{propertyData.paymentPlan.downPayment}</p>
                      <p className="text-sm text-gray-600">{formatPrice(propertyData.price * 0.1)}</p>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium">During Construction</p>
                      <p className="text-sm text-gray-600">Until handover</p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-blue-600">{propertyData.paymentPlan.duringConstruction}</p>
                      <p className="text-sm text-gray-600">{formatPrice(propertyData.price * 0.7)}</p>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium">On Handover</p>
                      <p className="text-sm text-gray-600">{propertyData.handover}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-green-600">{propertyData.paymentPlan.onHandover}</p>
                      <p className="text-sm text-gray-600">{formatPrice(propertyData.price * 0.2)}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Mortgage Calculator */}
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className={`text-lg font-bold ${MontserratFont.className}`}>Mortgage Calculator</h3>
                  <button
                    onClick={() => setShowMortgageCalculator(!showMortgageCalculator)}
                    className="text-[var(--primary)] text-sm font-medium"
                  >
                    {showMortgageCalculator ? 'Hide' : 'Show'}
                  </button>
                </div>
                
                {showMortgageCalculator && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Loan Amount</label>
                      <input
                        type="number"
                        value={mortgageData.loanAmount}
                        onChange={(e) => setMortgageData(prev => ({ ...prev, loanAmount: Number(e.target.value) }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Interest Rate (%)</label>
                      <input
                        type="number"
                        step="0.1"
                        value={mortgageData.interestRate}
                        onChange={(e) => setMortgageData(prev => ({ ...prev, interestRate: Number(e.target.value) }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Loan Term (Years)</label>
                      <input
                        type="number"
                        value={mortgageData.loanTerm}
                        onChange={(e) => setMortgageData(prev => ({ ...prev, loanTerm: Number(e.target.value) }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                      />
                    </div>
                    
                    <div className="pt-4 border-t border-gray-200">
                      <div className="flex justify-between items-center">
                        <span className="font-medium">Monthly Payment:</span>
                        <span className="text-xl font-bold text-[var(--primary)]">
                          AED {calculateMortgage().toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Property Details */}
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h3 className={`text-lg font-bold mb-4 ${MontserratFont.className}`}>Property Details</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Property ID:</span>
                    <span className="font-medium">{propertyData.id}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Property Type:</span>
                    <span className="font-medium">{propertyData.propertyType}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Status:</span>
                    <span className="font-medium">{propertyData.status}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Size:</span>
                    <span className="font-medium">{propertyData.size}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Plot Size:</span>
                    <span className="font-medium">{propertyData.plotSize}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Year Built:</span>
                    <span className="font-medium">{propertyData.yearBuilt}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Energy Rating:</span>
                    <span className="font-medium bg-green-100 text-green-800 px-2 py-1 rounded">{propertyData.energyRating}</span>
                  </div>
                </div>
              </div>

              {/* Share Property */}
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h3 className={`text-lg font-bold mb-4 ${MontserratFont.className}`}>Share Property</h3>
                <div className="flex space-x-2">
                  <button className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors">
                    Facebook
                  </button>
                  <button className="flex-1 bg-sky-500 text-white py-2 px-4 rounded-lg hover:bg-sky-600 transition-colors">
                    Twitter
                  </button>
                  <button className="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors">
                    WhatsApp
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Section>

      {/* Similar Properties */}
      <div className="bg-gray-50 py-20">
        <Section>
          <div className="text-center mb-12">
            <h2 className={`text-4xl font-bold mb-4 ${MontserratFont.className}`}>
              Similar Properties
            </h2>
            <p className="text-gray-600 text-lg">
              Discover other premium properties that might interest you
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {similarProperties.map((property) => (
              <Link key={property.id} href={`/properties/${property.slug}`} className="group h-full">
                <div className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 h-full">
                  <div className="relative h-[250px] overflow-hidden">
                    <Image
                      src={property.image}
                      alt={property.title}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                    <div className="absolute bottom-4 left-4">
                      <p className="text-white text-lg font-bold">{property.price}</p>
                    </div>
                  </div>
                  
                  <div className="p-6">
                    <h3 className={`text-lg font-bold mb-2 group-hover:text-[var(--primary)] transition-colors line-clamp-2 ${MontserratFont.className}`}>
                      {property.title}
                    </h3>
                    
                    <p className="text-gray-600 mb-4 flex items-center">
                      <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd"/>
                      </svg>
                      {property.location}
                    </p>
                    
                    <div className="flex items-center text-[var(--primary)] font-medium">
                      <span>View Details</span>
                      <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link href="/properties">
              <Button variant="outline" size="lg">
                View All Properties
              </Button>
            </Link>
          </div>
        </Section>
      </div>
    </div>
  );
}