import { Facebook, Linkedin, Twitter } from '@/components/icons'
import Section from '@/components/section'
import Link from 'next/link'
import React from 'react'

const TopBar = () => {
  return (
    <div className={'min-h-[40px] text-[var(--primary)] bg-white'}>
        <Section className={'flex justify-between items-center h-full text-sm'}>
            
            <div className={'min-w-[185px]'}>
                {/* <Link href={'mailto:info@dnapropertieshub.com'} className='block mb-1'>info@dnapropertieshub.com</Link> */}
                <Link href={'tel:+1234567890'} className='block bg-[var(--primary)] text-white text-center py-1 rounded-full'>+1 (234) 567-890</Link>
            </div>
            
            <div className={'w-[100px] h-[100px] flex justify-center items-center'}>
                <span className='block text-xl'>Logo</span>
            </div>
            <div className='min-w-[185px]'>
                <ul className='flex gap-2'>
                    <li>
                        <span className='w-[25] h-[25] bg-orange-50 ring-1 ring-orange-100 rounded-full flex justify-center items-center'>
                            <Facebook className={'w-auto h-[17px]'} />
                        </span>
                    </li>
                    <li>
                        <span className='w-[25] h-[25] bg-orange-50 ring-1 ring-orange-100 rounded-full flex justify-center items-center'>
                            <Twitter className={'w-auto h-[17px]'} />
                        </span>
                    </li>
                    <li>
                        <span className='w-[25] h-[25] bg-orange-50 ring-1 ring-orange-100 rounded-full flex justify-center items-center'>
                            <Linkedin className={'w-auto h-[17px]'} />
                        </span>
                    </li>
                </ul>
            </div>
        </Section>
    </div>
  )
}

export default TopBar