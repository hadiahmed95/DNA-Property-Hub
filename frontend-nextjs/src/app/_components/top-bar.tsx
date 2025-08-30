import { Facebook, Linkedin, Twitter } from '@/components/icons'
import Section from '@/components/section'
import Link from 'next/link'
import React from 'react'
import { MontserratFont, popinsFont } from '../fonts'
import { PhoneCall } from 'lucide-react'

const TopBar = () => {
  return (
    <div className='relative bg-gradient-to-r from-[var(--secondary)] via-gray-700 to-gray-800 text-white overflow-hidden'>
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-1 right-20 w-8 h-8 border border-white rounded-full animate-pulse"></div>
        <div className="absolute top-2 right-40 w-4 h-4 border border-white rounded-lg rotate-45"></div>
        <div className="absolute top-1 left-20 w-6 h-6 border border-white rounded-full"></div>
      </div>

      <Section className='relative z-10 flex justify-between items-center h-full py-3'>
        {/* Left Side - Contact Info */}
        <div className='flex items-center space-x-6 min-w-[280px]'>
          {/* Phone Number */}
          <Link 
            href='tel:+1234567890' 
            className={`group flex items-center space-x-2 bg-[var(--primary)] hover:bg-amber-600 text-white px-4 py-2 rounded-full transition-all duration-300 hover:shadow-lg hover:scale-105 ${popinsFont['600'].className}`}
          >
            <div className="w-4 h-4 flex items-center justify-center">
              <PhoneCall />
            </div>
            <span className="text-sm">+1 (234) 567-8900</span>
          </Link>

          {/* Email */}
          {/* <Link 
            href='mailto:contact@dnapropertieshub.com' 
            className={`hidden md:flex items-center space-x-2 text-white/80 hover:text-white transition-colors duration-200 ${popinsFont['500'].className}`}
          >
            <div className="w-4 h-4 flex items-center justify-center">
              📧
            </div>
            <span className="text-sm">contact@dnapropertieshub.com</span>
          </Link> */}
        </div>

        {/* Center - Logo */}
        <div className='flex flex-col items-center'>
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-br from-[var(--primary)] to-amber-500 rounded-2xl flex items-center justify-center text-white shadow-lg">
              <span className='text-2xl'>🏠</span>
            </div>
            <div className="text-center">
              <h1 className={`text-lg font-bold text-white ${MontserratFont.className}`}>
                DNA Properties Hub
              </h1>
              <p className={`text-xs text-white/70 ${popinsFont['400'].className}`}>
                Your Trusted Real Estate Partner
              </p>
            </div>
          </div>
        </div>

        {/* Right Side - Social & Quick Actions */}
        <div className='flex items-center space-x-4 min-w-[280px] justify-end'>

          {/* Social Media */}
          <div className="flex items-center space-x-2">
            <span className={`text-xs text-white/60 mr-2 hidden sm:block ${popinsFont['400'].className}`}>
              Follow:
            </span>
            <ul className='flex gap-2'>
              {[
                { Icon: Facebook, href: '#', name: 'Facebook', color: 'hover:bg-blue-600' },
                { Icon: Twitter, href: '#', name: 'Twitter', color: 'hover:bg-blue-400' },
                { Icon: Linkedin, href: '#', name: 'LinkedIn', color: 'hover:bg-blue-700' }
              ].map((social, index) => (
                <li key={index}>
                  <Link
                    href={social.href}
                    className={`group w-8 h-8 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full flex justify-center items-center text-white/80 hover:text-white ${social.color} transition-all duration-300 hover:scale-110 hover:shadow-lg`}
                    title={`Follow us on ${social.name}`}
                  >
                    <social.Icon className='w-4 h-4' />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* CTA Button */}
          {/* <Link
            href="/contact"
            className={`hidden sm:block bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white px-4 py-2 rounded-full border border-white/20 transition-all duration-300 hover:scale-105 hover:shadow-lg ${popinsFont['600'].className}`}
          >
            <span className="text-sm">Contact Now</span>
          </Link> */}
        </div>
      </Section>

      {/* Bottom Border */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[var(--primary)] to-transparent"></div>
    </div>
  )
}

export default TopBar