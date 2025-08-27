import Section from '@/components/section'
import Link from 'next/link'
import React from 'react'
import { MontserratFont } from '../fonts'

const Header = () => {
  return (
    <div className={`h-[74] bg-white ${MontserratFont.className}`}>
      <Section className={'h-full flex items-center'}>
        <ul className='flex gap-10 w-max mx-auto py-2 font-medium'>
          <li><Link href={'/'}>Home</Link></li>
          <li><Link href={'/properties'}>Properties</Link></li>
          <li><Link href={'/blogs'}>Blogs</Link></li>
          <li><Link href={'/agents'}>Agents</Link></li>
          <li><Link href={'/about'}>About</Link></li>
          <li><Link href={'/contact'}>Contact</Link></li>
        </ul>
      </Section>
    </div>
  )
}

export default Header