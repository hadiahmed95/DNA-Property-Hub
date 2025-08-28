import Image from "next/image";
import { MontserratFont } from "../fonts";
import Button from "@/components/button";
import Section from "@/components/section";

export default function Home() {
  return (
    <div>
      {/* Hero Section */}
      <div className={'h-[520px] w-full relative'}>
        <Image src={'/images/banner-1.jpg'} alt="banner 1" fill className="object-cover" />
        <div className="bg-black absolute inset-0 opacity-70 mix-blend-multiply">
        </div>
        <div className="absolute inset-0 flex flex-col gap-5 justify-center items-center">
          <h2 className={`text-5xl font-semibold text-white ${MontserratFont.className}`}>{'Find Your Perfect Home'}</h2>
          <div>
            <div className={'flex justify-center space-x-3 text-lg'}>
              <Button variant="lite">Commercial</Button>
              <Button variant="lite">Residential</Button>
              <Button>All</Button>
            </div>

            <div></div>
          </div>
        </div>
      </div>

      {/* Properties Type */}
      <Section className={'my-20'}>
        <h3 className={`text-4xl font-semibold mx-auto w-max mb-10 ${MontserratFont.className}`}>{'Discover Lifestyles'}</h3>

        <div className="grid grid-cols-4 gap-8">
          {/* Card */}
          {['Apartment', 'Comercial', 'Residential', 'Villa'].map((item, index) => (
            <div key={index} className={'bg-white relative w-full h-[250px] rounded-2xl overflow-hidden shadow'}>
              <Image src={'/images/banner-1.jpg'} alt="Property 1" fill />
              <div className="absolute bg-white bottom-0 left-0 right-0 p-4">
                <p className="hover:text-[var(--primary)] font-medium">{item}</p>
                <span className="block text-sm text-gray-500">{'10 properties'}</span>
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* Properties List */}
      <Section className={'my-20'}>
        <h3 className={`text-4xl font-semibold mx-auto w-max mb-10 ${MontserratFont.className}`}>{'Highlighted Properties'}</h3>

        {/* Tabber Section */}
        <div className="mt-10">
          <div className="flex justify-center space-x-4 border-b border-gray-200">
            <button className="py-2 px-4 bg-[var(--primary)] min-w-[100px] text-white">All</button>
            <button className="py-2 px-4 border-b border-[var(--primary)] min-w-[100px]">For Sale</button>
            <button className="py-2 px-4 border-b border-[var(--primary)] min-w-[100px]">For Rent</button>
          </div>
        </div>

        {/* Properties Grid */}
        <div className="mt-10 grid grid-cols-3 gap-5">
          {/* Card */}
          {['Property 1', 'Property 2', 'Property 3'].map((item, index) => (
            <div key={index} className="rounded-xl overflow-hidden shadow">
              <div className={`bg-white relative w-full h-[300px] rounded-t-2xl overflow-hidden ${MontserratFont.className}`}>
                <Image src={`/images/banner-${(index % 2) + 1}.jpg`} alt="Property 1" fill />
                <div className="absolute inset-0 bg-gradient-to-b from-black to-transparent opacity-20"></div>
                <div className="absolute top-4 right-4">
                  <span className="bg-gray-700 text-white font-medium text-xs px-2 py-1 rounded shadow">{'For Sale'}</span>
                </div>
              </div>
              <div className="bg-white bottom-0 left-0 right-0 p-4 grid grid-cols-2">
                <div className={`mb-2 ${MontserratFont.className}`}>
                  <p className={`hover:text-[var(--primary)] font-semibold`}>{item}</p>
                  <p className="text-[var(--primary)] text-lg font-semibold">{'$45,000'}</p>
                </div>

                <div className="col-span-2 flex gap-2 text-xs text-gray-500">
                    <p className="flex gap-1 items-center mb-2">
                      <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-bed-double-icon lucide-bed-double"><path d="M2 20v-8a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v8"/><path d="M4 10V6a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v4"/><path d="M12 4v6"/><path d="M2 18h20"/></svg>
                      {'Apartment'}</p>
                    <p className="flex gap-1 items-center mb-2">
                      <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-ruler-icon lucide-ruler"><path d="M21.3 15.3a2.4 2.4 0 0 1 0 3.4l-2.6 2.6a2.4 2.4 0 0 1-3.4 0L2.7 8.7a2.41 2.41 0 0 1 0-3.4l2.6-2.6a2.41 2.41 0 0 1 3.4 0Z"/><path d="m14.5 12.5 2-2"/><path d="m11.5 9.5 2-2"/><path d="m8.5 6.5 2-2"/><path d="m17.5 15.5 2-2"/></svg>
                      {'1300/sqft'}</p>
                </div>

                {/* <Button>{'View Details'}</Button> */}
                <span className="flex gap-1 text-xs text-gray-500 col-span-2">
                  <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-map-pin-icon lucide-map-pin"><path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0"/><circle cx="12" cy="10" r="3"/></svg>

                  {'2436 SW 8th St, Miami, FL 33135, USA'}
                </span>
              </div>
            </div>
          ))}
        </div>
      </Section>
    </div>
  );
}
