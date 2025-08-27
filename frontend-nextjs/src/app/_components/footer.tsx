import Button from '@/components/button'
import Section from '@/components/section'
import React from 'react'
import { MontserratFont } from '../fonts'
import { Facebook, Linkedin, Twitter } from '@/components/icons'

const Footer = () => {
  return (
    <div className='bg-white'>
      <div className='bg-[var(--primary)]'>
        <Section>
          {/* News letter */}
          <div className={'py-12 flex justify-between items-center flex-col md:flex-row gap-6'}>
            <div>
              <h2 className={`text-2xl font-bold ${MontserratFont.className}`}>Subscribe to our Newsletter</h2>
              <p className={''}>
                Stay updated with the latest news and offers from DNA Properties Hub.
              </p>
            </div>
            <form className={'mt-4 shadow bg-white rounded-full overflow-hidden'}>
              <input
                type="email"
                placeholder="Enter your email"
                className={'p-2 bg-white min-w-[200px] w-[500px] outline-0 px-4 py-2'}
              />
              <Button type={'submit'} variant="dark" className='cursor-pointer'>
                Subscribe
              </Button>
            </form>
          </div>
        </Section>
      </div>
      <Section>
        {/* Footer Contact us and Links (Property Types, Areas) */}
        <div className={'py-12 flex justify-between flex-col md:flex-row gap-6'}>
          <div>
            <h2 className={`text-xl font-bold ${MontserratFont.className}`}>DNA Properties Hub</h2>
            <p className={'text-gray-600'}>
              Get in touch with us at contact@dnapropertieshub.com.
            </p>
          </div>
          <div>
            <h2 className={`text-xl font-bold ${MontserratFont.className}`}>Property Types</h2>
            <ul className={'text-gray-600'}>
              <li><a href="#" className={'hover:underline'}>Residential</a></li>
              <li><a href="#" className={'hover:underline'}>Commercial</a></li>
              <li><a href="#" className={'hover:underline'}>Industrial</a></li>
            </ul>
          </div>
          <div>
            <h2 className={`text-xl font-bold ${MontserratFont.className}`}>Explorer</h2>
            <ul className={'text-gray-600'}>
              <li><a href="#" className={'hover:underline'}>Our Blog</a></li>
              <li><a href="#" className={'hover:underline'}>Success Stories</a></li>
              <li><a href="#" className={'hover:underline'}>Market Trends</a></li>
            </ul>
          </div>
          <div>
            <h2 className={`text-xl font-bold ${MontserratFont.className}`}>Discover</h2>
            <ul className={'text-gray-600'}>
              <li><a href="#" className={'hover:underline'}>Our Blog</a></li>
              <li><a href="#" className={'hover:underline'}>Success Stories</a></li>
              <li><a href="#" className={'hover:underline'}>Market Trends</a></li>
            </ul>
          </div>
          <div>
            <h2 className={`text-xl font-bold ${MontserratFont.className}`}>Links</h2>
            <ul className={'text-gray-600'}>
              <li><a href="#" className={'hover:underline'}>Privacy Policy</a></li>
              <li><a href="#" className={'hover:underline'}>Terms of Service</a></li>
            </ul>
          </div>
        </div>

        <hr className={'text-[var(--primary)] opacity-40 mix-blend-multiply'} />

        {/* All rights reserved and social icons on right side */}
        <div className={'py-8 flex justify-between items-center'}>
          <p className={'text-gray-600'}>© 2023 DNA Properties Hub. All rights reserved.</p>
          <div className={'flex gap-4'}>
            <a href="#" className={'text-gray-600 h-max hover:underline'}>
              <Facebook className={'h-[25px] w-auto'} />
            </a>
            <a href="#" className={'text-gray-600 h-max hover:underline'}>
              <Twitter className={'h-[25px] w-auto'} />
            </a>
            <a href="#" className={'text-gray-600 h-max hover:underline'}>
              <Linkedin className={'h-[25px] w-auto'} />
            </a>
          </div>
        </div>
      </Section>
    </div>
  )
}

export default Footer