import Button from '@/components/button'
import Section from '@/components/section'
import React from 'react'
import { MontserratFont, popinsFont } from '../fonts'
import { Facebook, Linkedin, Twitter } from '@/components/icons'
import { Mail, MapPin, PhoneCall, Send } from 'lucide-react'

const Footer = () => {
  return (
    <div className='bg-gradient-to-br from-gray-50 via-white to-amber-50/30'>
      {/* Enhanced Newsletter Section */}
      <div className='relative bg-gradient-to-r from-[var(--primary)] via-amber-500 to-orange-500 overflow-hidden'>
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-8 right-8 w-32 h-32 border-2 border-white rounded-full animate-pulse"></div>
          <div className="absolute bottom-8 left-8 w-24 h-24 border-2 border-white rounded-lg rotate-45"></div>
          <div className="absolute top-1/2 left-1/2 w-16 h-16 border border-white rounded-full transform -translate-x-1/2 -translate-y-1/2"></div>
        </div>

        <Section>
          <div className={'py-16 relative z-10'}>
            <div className="text-center mb-12">
              <h2 className={`text-4xl lg:text-5xl font-bold text-white mb-4 ${MontserratFont.className}`}>
                Stay Connected with DNA Properties Hub
              </h2>
              <p className={`text-xl text-white/90 max-w-3xl mx-auto ${popinsFont['400'].className}`}>
                Get exclusive property alerts, market insights, and be the first to know about new opportunities in your area. Join our community of smart property investors and homeowners.
              </p>
            </div>

            {/* Newsletter Form */}
            <div className="max-w-2xl mx-auto">
              <form className="flex flex-col sm:flex-row gap-4 p-2 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 shadow-2xl">
                <input
                  type="email"
                  placeholder="Enter your email address"
                  className={`flex-1 px-6 py-4 bg-white/90 backdrop-blur-sm border-0 rounded-xl outline-none focus:ring-2 focus:ring-white/50 text-gray-800 placeholder-gray-600 ${popinsFont['500'].className}`}
                />
                <Button 
                  type="submit" 
                  variant="dark" 
                  className="bg-[var(--secondary)] hover:bg-gray-800 text-white px-8 py-4 whitespace-nowrap shadow-lg hover:shadow-xl"
                >
                  Subscribe Now
                </Button>
              </form>
              <p className={`text-center text-white/70 text-sm mt-4 ${popinsFont['400'].className}`}>
                ✨ No spam, unsubscribe anytime. We respect your privacy.
              </p>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-16 text-center">
              <div>
                <div className={`text-3xl font-bold text-white ${MontserratFont.className}`}>1,234</div>
                <div className={`text-white/80 ${popinsFont['500'].className}`}>Properties Listed</div>
              </div>
              <div>
                <div className={`text-3xl font-bold text-white ${MontserratFont.className}`}>856</div>
                <div className={`text-white/80 ${popinsFont['500'].className}`}>Happy Clients</div>
              </div>
              <div>
                <div className={`text-3xl font-bold text-white ${MontserratFont.className}`}>95%</div>
                <div className={`text-white/80 ${popinsFont['500'].className}`}>Success Rate</div>
              </div>
              <div>
                <div className={`text-3xl font-bold text-white ${MontserratFont.className}`}>24/7</div>
                <div className={`text-white/80 ${popinsFont['500'].className}`}>Support</div>
              </div>
            </div>
          </div>
        </Section>
      </div>

      {/* Main Footer Content */}
      <Section>
        <div className={'py-16'}>
          <div className={'grid grid-cols-1 lg:grid-cols-5 gap-12'}>
            {/* Company Info */}
            <div className="lg:col-span-2">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-[var(--primary)] to-amber-500 rounded-2xl flex items-center justify-center text-white text-2xl">
                  🏠
                </div>
                <div>
                  <h2 className={`text-2xl font-bold text-gray-900 ${MontserratFont.className}`}>
                    DNA Properties Hub
                  </h2>
                  <p className={`text-[var(--primary)] text-sm font-medium ${popinsFont['600'].className}`}>
                    Your Trusted Real Estate Partner
                  </p>
                </div>
              </div>
              <p className={`text-gray-600 mb-6 leading-relaxed ${popinsFont['400'].className}`}>
                We are committed to helping you find your perfect home. From residential to commercial properties, 
                our experienced team provides personalized service and expert guidance throughout your real estate journey.
              </p>
              
              {/* Contact Info */}
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-[var(--primary)]/10 rounded-lg flex items-center justify-center">
                    <Send className={'w-4'} />
                  </div>
                  <a 
                    href="mailto:contact@dnapropertieshub.com" 
                    className={`text-gray-700 hover:text-[var(--primary)] transition-colors duration-200 ${popinsFont['500'].className}`}
                  >
                    contact@dnapropertieshub.com
                  </a>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-[var(--primary)]/10 rounded-lg flex items-center justify-center">
                    <PhoneCall className={'w-4'} />
                  </div>
                  <a 
                    href="tel:+1234567890" 
                    className={`text-gray-700 hover:text-[var(--primary)] transition-colors duration-200 ${popinsFont['500'].className}`}
                  >
                    +1 (234) 567-8900
                  </a>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-[var(--primary)]/10 rounded-lg flex items-center justify-center mt-0.5">
                    <MapPin className='w-4' />
                  </div>
                  <div className={`text-gray-700 ${popinsFont['500'].className}`}>
                    123 Real Estate Ave<br />
                    Property City, PC 12345
                  </div>
                </div>
              </div>
            </div>

            {/* Property Types */}
            <div>
              <h3 className={`text-lg font-bold text-gray-900 mb-6 ${MontserratFont.className}`}>
                Property Types
              </h3>
              <ul className={'space-y-3'}>
                {[
                  { name: 'Residential Homes', count: '450+' },
                  { name: 'Commercial Spaces', count: '180+' },
                  { name: 'Luxury Villas', count: '120+' },
                  { name: 'Apartments', count: '320+' },
                  { name: 'Townhouses', count: '95+' },
                  { name: 'Industrial Properties', count: '65+' }
                ].map((item, index) => (
                  <li key={index}>
                    <a 
                      href="#" 
                      className={`group flex items-center justify-between text-gray-600 hover:text-[var(--primary)] transition-colors duration-200 ${popinsFont['500'].className}`}
                    >
                      <span className="group-hover:translate-x-1 transition-transform duration-200">
                        {item.name}
                      </span>
                      <span className="text-xs bg-gray-100 text-gray-500 px-2 py-1 rounded-full group-hover:bg-[var(--primary)]/10 group-hover:text-[var(--primary)]">
                        {item.count}
                      </span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Explore */}
            <div>
              <h3 className={`text-lg font-bold text-gray-900 mb-6 ${MontserratFont.className}`}>
                Explore
              </h3>
              <ul className={'space-y-3'}>
                {[
                  'Find Your Perfect Home',
                  'Market Insights & Trends',
                  'Investment Opportunities',
                  'Neighborhood Guides',
                  'Property Valuation',
                  'Real Estate News',
                  'Success Stories',
                  'Customer Testimonials'
                ].map((item, index) => (
                  <li key={index}>
                    <a 
                      href="#" 
                      className={`text-gray-600 hover:text-[var(--primary)] transition-all duration-200 hover:translate-x-1 ${popinsFont['500'].className} block`}
                    >
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className={`text-lg font-bold text-gray-900 mb-6 ${MontserratFont.className}`}>
                Quick Links
              </h3>
              <ul className={'space-y-3 mb-8'}>
                {[
                  'About Us',
                  'Our Team',
                  'Services',
                  'Contact Us',
                  'Careers',
                  'Partnership',
                  'Privacy Policy',
                  'Terms of Service'
                ].map((item, index) => (
                  <li key={index}>
                    <a 
                      href="#" 
                      className={`text-gray-600 hover:text-[var(--primary)] transition-all duration-200 hover:translate-x-1 ${popinsFont['500'].className} block`}
                    >
                      {item}
                    </a>
                  </li>
                ))}
              </ul>

              {/* Mobile Apps */}
              {/* <div>
                <h4 className={`font-semibold text-gray-900 mb-3 ${popinsFont['600'].className}`}>
                  Download Our App
                </h4>
                <div className="space-y-2">
                  <a href="#" className="block">
                    <div className="bg-gray-900 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-gray-800 transition-colors duration-200">
                      <span className="text-xl">📱</span>
                      <div>
                        <div className="text-xs">Download on the</div>
                        <div className="text-sm font-semibold">App Store</div>
                      </div>
                    </div>
                  </a>
                  <a href="#" className="block">
                    <div className="bg-gray-900 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-gray-800 transition-colors duration-200">
                      <span className="text-xl">🤖</span>
                      <div>
                        <div className="text-xs">Get it on</div>
                        <div className="text-sm font-semibold">Google Play</div>
                      </div>
                    </div>
                  </a>
                </div>
              </div> */}
            </div>
          </div>

          {/* Divider with gradient */}
          <div className="relative my-12">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gradient-to-r from-transparent via-[var(--primary)]/30 to-transparent"></div>
            </div>
            <div className="relative flex justify-center">
              <div className="bg-gradient-to-r from-[var(--primary)] to-amber-500 w-16 h-1 rounded-full"></div>
            </div>
          </div>

          {/* Bottom Footer */}
          <div className={'flex flex-col lg:flex-row justify-between items-center gap-6'}>
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <p className={`text-gray-600 ${popinsFont['500'].className}`}>
                © 2024 DNA Properties Hub. All rights reserved.
              </p>
              <div className="hidden sm:block w-px h-4 bg-gray-300"></div>
              <p className={`text-gray-500 text-sm ${popinsFont['400'].className}`}>
                Licensed Real Estate Brokerage
              </p>
            </div>
            
            {/* Social Media with enhanced styling */}
            <div className={'flex items-center gap-4'}>
              <span className={`text-gray-600 text-sm ${popinsFont['500'].className} hidden sm:block`}>
                Follow Us:
              </span>
              <div className="flex gap-3">
                {[
                  { icon: Facebook, name: 'Facebook', color: 'hover:text-blue-600' },
                  { icon: Twitter, name: 'Twitter', color: 'hover:text-blue-400' },
                  { icon: Linkedin, name: 'LinkedIn', color: 'hover:text-blue-700' }
                ].map((social, index) => (
                  <a
                    key={index}
                    href="#"
                    className={`group w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center text-gray-600 ${social.color} hover:bg-white hover:shadow-lg transition-all duration-300 hover:scale-110`}
                    title={`Follow us on ${social.name}`}
                  >
                    <social.icon className={'w-5 h-5'} />
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Trust Indicators */}
          <div className="mt-8 pt-8 border-t border-gray-200">
            <div className="flex flex-wrap justify-center items-center gap-8 opacity-60">
              <div className="flex items-center space-x-2">
                <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center text-white text-xs">
                  ✓
                </div>
                <span className={`text-sm text-gray-600 ${popinsFont['500'].className}`}>
                  Trusted by 10,000+ clients
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs">
                  🛡️
                </div>
                <span className={`text-sm text-gray-600 ${popinsFont['500'].className}`}>
                  Secure transactions
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center text-white text-xs">
                  ⭐
                </div>
                <span className={`text-sm text-gray-600 ${popinsFont['500'].className}`}>
                  4.9/5 Average rating
                </span>
              </div>
            </div>
          </div>
        </div>
      </Section>
    </div>
  )
}

export default Footer