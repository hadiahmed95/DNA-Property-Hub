import Image from "next/image";
import { MontserratFont, popinsFont } from "../../fonts";
import Button from "@/components/button";
import Section from "@/components/section";

export default function AboutUs() {
  return (
    <div>
      {/* Hero Section */}
      <div className={'h-[520px] w-full relative'}>
        <Image src={'/images/banner-1.jpg'} alt="About D&A Properties" fill className="object-cover" />
        <div className="bg-black absolute inset-0 opacity-70 mix-blend-multiply"></div>
        <div className="absolute inset-0 flex flex-col gap-5 justify-center items-center">
          <h1 className={`text-5xl font-semibold text-white text-center max-w-4xl ${MontserratFont.className}`}>
            Welcome to D&A Properties
          </h1>
          <p className={`text-xl text-white/90 text-center max-w-3xl px-4 ${popinsFont['400'].className}`}>
            Where innovation meets excellence in real estate. Join us on a journey of delivering exceptional property solutions and creating lasting value for our clients.
          </p>
          <div className="flex justify-center space-x-4 mt-4">
            <Button variant="primary">Our Services</Button>
            <Button variant="lite">Contact Us</Button>
          </div>
        </div>
      </div>

      {/* Company Story Section */}
      <Section className={'my-20'}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className={`text-4xl font-semibold mb-6 text-gray-900 ${MontserratFont.className}`}>
              D&A Properties – A Journey of Growth and Innovation
            </h2>
            <h3 className={`text-2xl font-medium mb-6 text-[var(--primary)] ${MontserratFont.className}`}>
              From Humble Beginnings to a Trusted Name in Dubai Real Estate
            </h3>
            <div className={`text-gray-600 space-y-4 leading-relaxed ${popinsFont['400'].className}`}>
              <p>
                What began in a modest office has now grown into D&A Properties — a respected and recognized name in Dubai's dynamic real estate landscape. Our journey to becoming a leading real estate player has been driven by relentless innovation, an unwavering focus on client needs, and a passion for delivering excellence in every transaction.
              </p>
              <p>
                Over the years, D&A Properties has expanded its portfolio, strengthened its team of experienced professionals, and extended its presence across key communities in Dubai. We've embraced evolving market trends, adopted cutting-edge technologies, and remained true to our mission of delivering unmatched value and transparency to our clients.
              </p>
              <p>
                Our story is not just about business growth — it's about building lasting relationships, overcoming challenges with integrity, and celebrating milestones with our clients and partners. As we look ahead, D&A Properties is ready to write the next chapter — shaping the future of real estate in Dubai with vision, trust, and innovation.
              </p>
            </div>
          </div>
          <div className="relative">
            <div className="bg-white relative w-full h-[400px] rounded-2xl overflow-hidden shadow-lg">
              <Image src={'/images/banner-2.jpg'} alt="D&A Properties Office" fill className="object-cover" />
            </div>
            {/* Floating Stats */}
            <div className="absolute -bottom-6 -left-6 bg-[var(--primary)] text-white p-6 rounded-2xl shadow-xl">
              <div className={`text-3xl font-bold ${MontserratFont.className}`}>15+</div>
              <div className={`text-sm ${popinsFont['500'].className}`}>Years of Excellence</div>
            </div>
            <div className="absolute -top-6 -right-6 bg-white p-6 rounded-2xl shadow-xl border">
              <div className={`text-3xl font-bold text-[var(--primary)] ${MontserratFont.className}`}>5000+</div>
              <div className={`text-sm text-gray-600 ${popinsFont['500'].className}`}>Happy Clients</div>
            </div>
          </div>
        </div>
      </Section>

      {/* Mission Section */}
      <Section className={'my-20 bg-gradient-to-r from-gray-50 to-amber-50/30'}>
        <div className="text-center py-16">
          <h2 className={`text-4xl font-semibold mb-8 text-gray-900 ${MontserratFont.className}`}>
            Our Mission is to Transform Real Estate Services
          </h2>
          <p className={`text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed ${popinsFont['400'].className}`}>
            Our mission is to revolutionize the real Dubai estate experience through innovative technology, personalized service, and deep market insights. We aim to empower clients, making property transactions not only seamless but also a truly rewarding journey.
          </p>
        </div>
      </Section>

      {/* Core Values Section */}
      <Section className={'my-20'}>
        <h3 className={`text-4xl font-semibold text-center mb-16 text-gray-900 ${MontserratFont.className}`}>
          Our Core Values
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* Excellence */}
          <div className="text-center group">
            <div className="bg-white relative w-full h-[250px] rounded-2xl overflow-hidden shadow-lg mb-6 group-hover:shadow-xl transition-shadow duration-300">
              <Image src={'/images/banner-1.jpg'} alt="Excellence" fill className="object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
              <div className="absolute bottom-6 left-6 right-6">
                <div className="w-16 h-16 bg-[var(--primary)] rounded-2xl flex items-center justify-center text-white text-3xl mb-4 mx-auto">
                  🏆
                </div>
              </div>
            </div>
            <h4 className={`text-2xl font-bold text-gray-900 mb-4 ${MontserratFont.className}`}>
              Excellence
            </h4>
            <p className={`text-gray-600 leading-relaxed ${popinsFont['400'].className}`}>
              We strive for the highest standards in every aspect of our service, ensuring that our clients receive unparalleled expertise and outcomes.
            </p>
          </div>

          {/* Integrity */}
          <div className="text-center group">
            <div className="bg-white relative w-full h-[250px] rounded-2xl overflow-hidden shadow-lg mb-6 group-hover:shadow-xl transition-shadow duration-300">
              <Image src={'/images/banner-2.jpg'} alt="Integrity" fill className="object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
              <div className="absolute bottom-6 left-6 right-6">
                <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center text-white text-3xl mb-4 mx-auto">
                  🤝
                </div>
              </div>
            </div>
            <h4 className={`text-2xl font-bold text-gray-900 mb-4 ${MontserratFont.className}`}>
              Integrity
            </h4>
            <p className={`text-gray-600 leading-relaxed ${popinsFont['400'].className}`}>
              Our business is built on trust and transparency. We conduct ourselves with unwavering honesty and ethical principles in every interaction.
            </p>
          </div>

          {/* Innovation */}
          <div className="text-center group">
            <div className="bg-white relative w-full h-[250px] rounded-2xl overflow-hidden shadow-lg mb-6 group-hover:shadow-xl transition-shadow duration-300">
              <Image src={'/images/banner-1.jpg'} alt="Innovation" fill className="object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
              <div className="absolute bottom-6 left-6 right-6">
                <div className="w-16 h-16 bg-purple-600 rounded-2xl flex items-center justify-center text-white text-3xl mb-4 mx-auto">
                  💡
                </div>
              </div>
            </div>
            <h4 className={`text-2xl font-bold text-gray-900 mb-4 ${MontserratFont.className}`}>
              Innovation
            </h4>
            <p className={`text-gray-600 leading-relaxed ${popinsFont['400'].className}`}>
              We embrace change and creativity. We stay at the forefront of the real estate industry, offering cutting-edge solutions to our clients.
            </p>
          </div>
        </div>
      </Section>

      {/* Services Section */}
      <Section className={'my-20 bg-gradient-to-r from-gray-50 to-amber-50/30'}>
        <div className="py-16">
          <div className="text-center mb-16">
            <h3 className={`text-4xl font-semibold mb-6 text-gray-900 ${MontserratFont.className}`}>
              Exclusive Real Estate Services
            </h3>
            <p className={`text-xl text-gray-600 max-w-3xl mx-auto ${popinsFont['400'].className}`}>
              We offer comprehensive real estate solutions tailored to meet your unique needs and exceed your expectations.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {/* Home Staging Consultation */}
            <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="w-16 h-16 bg-green-500 rounded-2xl flex items-center justify-center text-white text-3xl mb-6">
                🏡
              </div>
              <h4 className={`text-2xl font-bold text-gray-900 mb-4 ${MontserratFont.className}`}>
                Home Staging Consultation
              </h4>
              <p className={`text-gray-600 leading-relaxed mb-6 ${popinsFont['400'].className}`}>
                Get expert advice on how to make your home look its best before selling. From furniture placement to décor tips, our consultation helps you highlight your property's strengths and attract more buyers—fast.
              </p>
              <Button variant="primary" className="w-full">Learn More</Button>
            </div>

            {/* Property Matchmaking */}
            <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="w-16 h-16 bg-red-500 rounded-2xl flex items-center justify-center text-white text-3xl mb-6">
                💝
              </div>
              <h4 className={`text-2xl font-bold text-gray-900 mb-4 ${MontserratFont.className}`}>
                Tailored Property Matchmaking
              </h4>
              <p className={`text-gray-600 leading-relaxed mb-6 ${popinsFont['400'].className}`}>
                At D&A Properties, we offer tailored property matchmaking services, connecting clients with homes that perfectly align with their lifestyle, preferences, and investment goals. It's not just about buying — it's about finding the one.
              </p>
              <Button variant="primary" className="w-full">Learn More</Button>
            </div>

            {/* Virtual Tours */}
            <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="w-16 h-16 bg-blue-500 rounded-2xl flex items-center justify-center text-white text-3xl mb-6">
                🥽
              </div>
              <h4 className={`text-2xl font-bold text-gray-900 mb-4 ${MontserratFont.className}`}>
                Immersive Virtual Tours
              </h4>
              <p className={`text-gray-600 leading-relaxed mb-6 ${popinsFont['400'].className}`}>
                Experience properties like never before with our immersive virtual tours. At D&A Properties, we bring listings to life online, allowing buyers to explore every detail from anywhere in the world — saving time and making smarter decisions.
              </p>
              <Button variant="primary" className="w-full">Learn More</Button>
            </div>

            {/* Customized Search */}
            <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="w-16 h-16 bg-purple-500 rounded-2xl flex items-center justify-center text-white text-3xl mb-6">
                🔍
              </div>
              <h4 className={`text-2xl font-bold text-gray-900 mb-4 ${MontserratFont.className}`}>
                Customized Property Search
              </h4>
              <p className={`text-gray-600 leading-relaxed mb-6 ${popinsFont['400'].className}`}>
                At D&A Properties, we tailor every search to match your unique needs, lifestyle, and budget. Whether you're looking for a family villa or a high-rise investment, our experts handpick the right options — so you find the perfect property, faster.
              </p>
              <Button variant="primary" className="w-full">Learn More</Button>
            </div>
          </div>
        </div>
      </Section>

      {/* Leadership Section */}
      <Section className={'my-20'}>
        <div className="text-center mb-16">
          <h3 className={`text-4xl font-semibold mb-6 text-gray-900 ${MontserratFont.className}`}>
            The Visionary Behind D&A Properties
          </h3>
          <p className={`text-xl text-gray-600 max-w-3xl mx-auto ${popinsFont['400'].className}`}>
            Meet the leadership team that drives our vision and commitment to excellence in real estate.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* CEO */}
          <div className="text-center">
            <div className="bg-white relative w-full h-[300px] rounded-2xl overflow-hidden shadow-lg mb-6">
              <div className="absolute inset-0 bg-gradient-to-br from-[var(--primary)] to-amber-500 flex items-center justify-center text-white text-6xl">
                👨‍💼
              </div>
            </div>
            <h4 className={`text-xl font-bold text-gray-900 mb-2 ${MontserratFont.className}`}>
              John Anderson
            </h4>
            <p className={`text-[var(--primary)] font-medium mb-4 ${popinsFont['600'].className}`}>
              Chief Executive Officer
            </p>
            <p className={`text-gray-600 text-sm leading-relaxed ${popinsFont['400'].className}`}>
              With over 20 years of experience in Dubai's real estate market, John leads our vision of transforming property experiences through innovation and excellence.
            </p>
          </div>

          {/* CTO */}
          <div className="text-center">
            <div className="bg-white relative w-full h-[300px] rounded-2xl overflow-hidden shadow-lg mb-6">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-blue-500 flex items-center justify-center text-white text-6xl">
                👩‍💼
              </div>
            </div>
            <h4 className={`text-xl font-bold text-gray-900 mb-2 ${MontserratFont.className}`}>
              Sarah Mitchell
            </h4>
            <p className={`text-[var(--primary)] font-medium mb-4 ${popinsFont['600'].className}`}>
              Chief Technology Officer
            </p>
            <p className={`text-gray-600 text-sm leading-relaxed ${popinsFont['400'].className}`}>
              Sarah drives our technological innovations, ensuring we stay at the forefront of digital real estate solutions and virtual property experiences.
            </p>
          </div>

          {/* Head of Sales */}
          <div className="text-center">
            <div className="bg-white relative w-full h-[300px] rounded-2xl overflow-hidden shadow-lg mb-6">
              <div className="absolute inset-0 bg-gradient-to-br from-green-600 to-green-500 flex items-center justify-center text-white text-6xl">
                👨‍💼
              </div>
            </div>
            <h4 className={`text-xl font-bold text-gray-900 mb-2 ${MontserratFont.className}`}>
              Michael Chen
            </h4>
            <p className={`text-[var(--primary)] font-medium mb-4 ${popinsFont['600'].className}`}>
              Head of Sales & Client Relations
            </p>
            <p className={`text-gray-600 text-sm leading-relaxed ${popinsFont['400'].className}`}>
              Michael ensures every client receives personalized service and expert guidance throughout their real estate journey with D&A Properties.
            </p>
          </div>
        </div>
      </Section>

      {/* Call to Action Section */}
      <Section className={'my-20'}>
        <div className="bg-gradient-to-r from-[var(--primary)] via-amber-500 to-orange-500 rounded-3xl p-12 lg:p-16 text-center text-white relative overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-8 right-8 w-32 h-32 border-2 border-white rounded-full animate-pulse"></div>
            <div className="absolute bottom-8 left-8 w-24 h-24 border-2 border-white rounded-lg rotate-45"></div>
          </div>
          
          <div className="relative z-10">
            <h3 className={`text-4xl font-bold mb-6 ${MontserratFont.className}`}>
              Real Estate Insights
            </h3>
            <p className={`text-xl mb-8 opacity-90 max-w-3xl mx-auto ${popinsFont['400'].className}`}>
              Stay Informed with the Latest Market Trends and Tips. Get exclusive insights and market updates delivered to your inbox.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-lg mx-auto">
              <Button variant="dark" className="bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white border-white/20 border">
                Subscribe to Newsletter
              </Button>
              <Button variant="secondary" className="bg-white hover:bg-gray-50 text-[var(--primary)] border-0">
                Contact Our Team
              </Button>
            </div>
          </div>
        </div>
      </Section>
    </div>
  );
}