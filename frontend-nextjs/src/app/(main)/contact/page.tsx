'use client'

import Image from "next/image";
import { MontserratFont, popinsFont } from "../../fonts";
import Button from "@/components/button";
import Section from "@/components/section";
import Input from "@/components/form/input";
import Select from "@/components/form/select";
import { useState } from "react";
import { CalendarDays, CircleDollarSign, Clock9Icon, Mail, MapPin, MessageCircleMore, PhoneCall } from "lucide-react";

export default function ContactUs() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    subject: '',
    propertyType: '',
    budget: '',
    message: '',
    preferredContact: 'email',
    agreeToTerms: false
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitSuccess(true);
      // Reset form after success
      setTimeout(() => {
        setSubmitSuccess(false);
        setFormData({
          firstName: '',
          lastName: '',
          email: '',
          phone: '',
          subject: '',
          propertyType: '',
          budget: '',
          message: '',
          preferredContact: 'email',
          agreeToTerms: false
        });
      }, 3000);
    }, 2000);
  };

  const subjectOptions = [
    { value: '', label: 'Select a subject' },
    { value: 'buying', label: 'I want to buy a property' },
    { value: 'selling', label: 'I want to sell my property' },
    { value: 'renting', label: 'I\'m looking for rental properties' },
    { value: 'investment', label: 'Investment opportunities' },
    { value: 'valuation', label: 'Property valuation' },
    { value: 'consultation', label: 'Free consultation' },
    { value: 'other', label: 'Other inquiries' }
  ];

  const propertyTypeOptions = [
    { value: '', label: 'Select property type' },
    { value: 'apartment', label: 'Apartment' },
    { value: 'villa', label: 'Villa' },
    { value: 'townhouse', label: 'Townhouse' },
    { value: 'penthouse', label: 'Penthouse' },
    { value: 'commercial', label: 'Commercial' },
    { value: 'land', label: 'Land/Plot' }
  ];

  const budgetOptions = [
    { value: '', label: 'Select your budget' },
    { value: '500k-1m', label: 'AED 500K - 1M' },
    { value: '1m-2m', label: 'AED 1M - 2M' },
    { value: '2m-5m', label: 'AED 2M - 5M' },
    { value: '5m-10m', label: 'AED 5M - 10M' },
    { value: '10m+', label: 'AED 10M+' },
    { value: 'not-decided', label: 'Not decided yet' }
  ];

  return (
    <div>
      {/* Hero Section */}
      <div className={'h-[520px] w-full relative'}>
        <Image src={'/images/banner-2.jpg'} alt="Contact D&A Properties" fill className="object-cover" />
        <div className="bg-black absolute inset-0 opacity-70 mix-blend-multiply"></div>
        <div className="absolute inset-0 flex flex-col gap-5 justify-center items-center">
          <h1 className={`text-5xl font-semibold text-white text-center max-w-4xl ${MontserratFont.className}`}>
            Get in Touch with D&A Properties
          </h1>
          <p className={`text-xl text-white/90 text-center max-w-3xl px-4 ${popinsFont['400'].className}`}>
            Ready to find your dream property in Dubai? Our expert team is here to guide you through every step of your real estate journey.
          </p>
          <div className="flex justify-center space-x-4 mt-4">
            {/* <Button variant="primary">Schedule Free Consultation</Button> */}
            <Button variant="lite">Call Now: +971 4 123 4567</Button>
          </div>
        </div>
      </div>

      {/* Contact Form & Info Section */}
      <Section className={'my-20'}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
          {/* Contact Form */}
          <div className="lg:col-span-2">
            <div className="bg-white p-8 lg:p-12 rounded-2xl shadow-lg border">
              <div className="mb-8">
                <h2 className={`text-3xl font-semibold mb-4 text-gray-900 ${MontserratFont.className}`}>
                  Send Us a Message
                </h2>
                <p className={`text-gray-600 ${popinsFont['400'].className}`}>
                  Fill out the form below and our team will get back to you within 24 hours. All fields marked with * are required.
                </p>
              </div>

              {submitSuccess && (
                <div className="mb-8 p-6 bg-green-50 border border-green-200 rounded-2xl">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white">
                      ✓
                    </div>
                    <div>
                      <h3 className={`font-semibold text-green-800 ${MontserratFont.className}`}>
                        Message Sent Successfully!
                      </h3>
                      <p className={`text-green-700 text-sm ${popinsFont['400'].className}`}>
                        Thank you for contacting us. Our team will reach out to you soon.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Name Fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Input
                    label="First Name *"
                    placeholder="John"
                    value={formData.firstName}
                    onChange={(e) => handleInputChange('firstName', e.target.value)}
                    required
                  />
                  <Input
                    label="Last Name *"
                    placeholder="Doe"
                    value={formData.lastName}
                    onChange={(e) => handleInputChange('lastName', e.target.value)}
                    required
                  />
                </div>

                {/* Contact Fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Input
                    label="Email Address *"
                    type="email"
                    placeholder="john@example.com"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    required
                  />
                  <Input
                    label="Phone Number *"
                    type="tel"
                    placeholder="+971 50 123 4567"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    required
                  />
                </div>

                {/* Subject */}
                <Select
                  label="Subject *"
                  options={subjectOptions}
                  value={formData.subject}
                  onChange={(e) => handleInputChange('subject', e.target.value)}
                  required
                />

                {/* Property Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Select
                    label="Property Type"
                    options={propertyTypeOptions}
                    value={formData.propertyType}
                    onChange={(e) => handleInputChange('propertyType', e.target.value)}
                  />
                  <Select
                    label="Budget Range"
                    options={budgetOptions}
                    value={formData.budget}
                    onChange={(e) => handleInputChange('budget', e.target.value)}
                  />
                </div>

                {/* Message */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Message *
                  </label>
                  <textarea
                    rows={6}
                    placeholder="Tell us about your requirements, preferred locations, timeline, or any other details that would help us assist you better..."
                    value={formData.message}
                    onChange={(e) => handleInputChange('message', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[var(--primary)]/20 focus:border-[var(--primary)] transition-all duration-200 resize-none"
                    required
                  />
                </div>

                {/* Preferred Contact Method */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-4">
                    Preferred Contact Method
                  </label>
                  <div className="flex flex-wrap gap-4">
                    {[
                      { value: 'email', label: 'Email', icon: '📧' },
                      { value: 'phone', label: 'Phone Call', icon: '📞' },
                      { value: 'whatsapp', label: 'WhatsApp', icon: '💬' }
                    ].map((option) => (
                      <label key={option.value} className="flex items-center space-x-2 cursor-pointer">
                        <input
                          type="radio"
                          name="preferredContact"
                          value={option.value}
                          checked={formData.preferredContact === option.value}
                          onChange={(e) => handleInputChange('preferredContact', e.target.value)}
                          className="w-4 h-4 text-[var(--primary)] border-gray-300 focus:ring-[var(--primary)]/20"
                        />
                        <span className="text-xl">{option.icon}</span>
                        <span className={`text-gray-700 ${popinsFont['500'].className}`}>
                          {option.label}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Agreement */}
                <div className="flex items-start space-x-3">
                  <input
                    type="checkbox"
                    id="agreeToTerms"
                    checked={formData.agreeToTerms}
                    onChange={(e) => handleInputChange('agreeToTerms', e.target.checked)}
                    className="w-5 h-5 text-[var(--primary)] border-gray-300 rounded focus:ring-[var(--primary)]/20 mt-0.5"
                    required
                  />
                  <label htmlFor="agreeToTerms" className={`text-gray-600 text-sm ${popinsFont['400'].className}`}>
                    I agree to receive communications from D&A Properties and understand that I can unsubscribe at any time. 
                    I have read and agree to the <a href="#" className="text-[var(--primary)] hover:underline">Privacy Policy</a> and 
                    <a href="#" className="text-[var(--primary)] hover:underline"> Terms of Service</a>. *
                  </label>
                </div>

                {/* Submit Button */}
                <div className="pt-4">
                  <Button 
                    type="submit" 
                    variant="primary" 
                    className="w-full py-4 text-lg"
                    loading={isSubmitting}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Sending Message...' : 'Send Message'}
                  </Button>
                  <p className={`text-center text-gray-500 text-sm mt-3 ${popinsFont['400'].className}`}>
                    ⚡ We typically respond within 2-4 hours during business hours
                  </p>
                </div>
              </form>
            </div>
          </div>

          {/* Contact Information Sidebar */}
          <div className="space-y-8">
            {/* Contact Details */}
            <div className="bg-gradient-to-br from-[var(--primary)] via-amber-500 to-orange-500 p-8 rounded-2xl text-white relative overflow-hidden">
              {/* Background Pattern */}
              <div className="absolute inset-0 opacity-10">
                <div className="absolute top-4 right-4 w-16 h-16 border border-white rounded-full animate-pulse"></div>
                <div className="absolute bottom-4 left-4 w-12 h-12 border border-white rounded-lg rotate-45"></div>
              </div>
              
              <div className="relative z-10">
                <h3 className={`text-2xl font-bold mb-6 ${MontserratFont.className}`}>
                  Contact Information
                </h3>
                
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                      <MapPin className="w-4" />
                    </div>
                    <div>
                      <div className={`font-semibold ${popinsFont['600'].className}`}>Visit Our Office</div>
                      <div className={`text-white/90 text-sm ${popinsFont['400'].className}`}>
                        Sheikh Zayed Road, Dubai<br />
                        Business Bay, UAE
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                      <PhoneCall className="w-4" />
                    </div>
                    <div>
                      <div className={`font-semibold ${popinsFont['600'].className}`}>Call Us</div>
                      <div className={`text-white/90 text-sm ${popinsFont['400'].className}`}>
                        +971 4 123 4567<br />
                        +971 50 123 4567
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                      <Mail className={'w-4'} />
                    </div>
                    <div>
                      <div className={`font-semibold ${popinsFont['600'].className}`}>Email Us</div>
                      <div className={`text-white/90 text-sm ${popinsFont['400'].className}`}>
                        info@dnapropertieshub.com<br />
                        sales@dnapropertieshub.com
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                      <Clock9Icon className="w-4" />
                    </div>
                    <div>
                      <div className={`font-semibold ${popinsFont['600'].className}`}>Business Hours</div>
                      <div className={`text-white/90 text-sm ${popinsFont['400'].className}`}>
                        Monday - Saturday: 9:00 AM - 7:00 PM<br />
                        Sunday: 10:00 AM - 5:00 PM
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            {/* <div className="bg-white p-6 rounded-2xl shadow-lg border">
              <h3 className={`text-xl font-bold text-gray-900 mb-4 ${MontserratFont.className}`}>
                Quick Actions
              </h3>
              
              <div className="space-y-3">
                <Button variant="primary" className="w-full justify-start"
                icon={<PhoneCall className="w-4" />}
                >
                  Schedule a Call Back
                </Button>
                <Button variant="secondary" className="w-full justify-start"
                icon={<MessageCircleMore className="w-4" />}
                >
                  WhatsApp Us
                </Button>
                <Button variant="secondary" className="w-full justify-start"
                icon={<CalendarDays className="w-4" />}
                >
                  Book Property Tour
                </Button>
                <Button variant="secondary" className="w-full justify-start"
                icon={<CircleDollarSign className="w-4" />}
                >
                  Get Property Valuation
                </Button>
              </div>
            </div> */}

            {/* Emergency Contact */}
            <div className="bg-red-50 border border-red-200 p-6 rounded-2xl">
              <h3 className={`text-lg font-bold text-red-800 mb-3 ${MontserratFont.className}`}>
                🚨 Emergency Contact
              </h3>
              <p className={`text-red-700 text-sm mb-4 ${popinsFont['400'].className}`}>
                For urgent property matters after business hours:
              </p>
              <Button variant="dark" className="w-full bg-red-600 hover:bg-red-700">
                Call Emergency Line: +971 55 999 8888
              </Button>
            </div>

            {/* Social Proof */}
            <div className="bg-gray-50 p-6 rounded-2xl">
              <h3 className={`text-lg font-bold text-gray-900 mb-4 ${MontserratFont.className}`}>
                Why Choose D&A Properties?
              </h3>
              
              <div className="space-y-3 text-sm">
                <div className="flex items-center space-x-2">
                  <span className="text-green-500">✓</span>
                  <span className={`text-gray-700 ${popinsFont['500'].className}`}>15+ Years Experience</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-green-500">✓</span>
                  <span className={`text-gray-700 ${popinsFont['500'].className}`}>5000+ Happy Clients</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-green-500">✓</span>
                  <span className={`text-gray-700 ${popinsFont['500'].className}`}>DLD Licensed & Certified</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-green-500">✓</span>
                  <span className={`text-gray-700 ${popinsFont['500'].className}`}>24/7 Customer Support</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-green-500">✓</span>
                  <span className={`text-gray-700 ${popinsFont['500'].className}`}>No Hidden Fees Policy</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Section>

      {/* Map & Office Locations */}
      <Section className={'my-20 bg-gray-50'}>
        <div className="py-16">
          <div className="text-center mb-12">
            <h3 className={`text-4xl font-semibold mb-6 text-gray-900 ${MontserratFont.className}`}>
              Visit Our Office
            </h3>
            <p className={`text-xl text-gray-600 max-w-3xl mx-auto ${popinsFont['400'].className}`}>
              Located in the heart of Dubai's business district, our office is easily accessible and equipped with modern amenities for your comfort.
            </p>
          </div>

          {/* Map Placeholder */}
          <div className="bg-white rounded-2xl p-8 shadow-lg">
            <div className="bg-gradient-to-br from-gray-200 to-gray-300 h-96 rounded-xl flex items-center justify-center relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-[var(--primary)]/10 to-transparent"></div>
              <div className="text-center z-10">
                <div className="w-16 h-16 bg-[var(--primary)] rounded-2xl flex items-center justify-center text-white text-3xl mx-auto mb-4">
                  🗺️
                </div>
                <h4 className={`text-xl font-bold text-gray-800 mb-2 ${MontserratFont.className}`}>
                  Interactive Map
                </h4>
                <p className={`text-gray-600 ${popinsFont['400'].className}`}>
                  Sheikh Zayed Road, Business Bay, Dubai, UAE
                </p>
                <Button variant="primary" className="mt-4">
                  Get Directions
                </Button>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
              <div className="text-center p-4">
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center text-green-600 text-xl mx-auto mb-3">
                  🚇
                </div>
                <h4 className={`font-semibold text-gray-900 mb-1 ${popinsFont['600'].className}`}>
                  Metro Access
                </h4>
                <p className={`text-gray-600 text-sm ${popinsFont['400'].className}`}>
                  2 minutes walk from Business Bay Metro Station
                </p>
              </div>
              
              <div className="text-center p-4">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600 text-xl mx-auto mb-3">
                  🚗
                </div>
                <h4 className={`font-semibold text-gray-900 mb-1 ${popinsFont['600'].className}`}>
                  Free Parking
                </h4>
                <p className={`text-gray-600 text-sm ${popinsFont['400'].className}`}>
                  Complimentary valet parking available
                </p>
              </div>
              
              <div className="text-center p-4">
                <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center text-purple-600 text-xl mx-auto mb-3">
                  ☕
                </div>
                <h4 className={`font-semibold text-gray-900 mb-1 ${popinsFont['600'].className}`}>
                  Refreshments
                </h4>
                <p className={`text-gray-600 text-sm ${popinsFont['400'].className}`}>
                  Coffee and refreshments while you wait
                </p>
              </div>
            </div>
          </div>
        </div>
      </Section>

      {/* FAQ Section */}
      <Section className={'my-20'}>
        <div className="text-center mb-12">
          <h3 className={`text-4xl font-semibold mb-6 text-gray-900 ${MontserratFont.className}`}>
            Frequently Asked Questions
          </h3>
          <p className={`text-xl text-gray-600 max-w-3xl mx-auto ${popinsFont['400'].className}`}>
            Quick answers to common questions about our services and processes.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {[
            {
              question: "How quickly do you respond to inquiries?",
              answer: "We respond to all inquiries within 2-4 hours during business hours and within 24 hours on weekends."
            },
            {
              question: "Do you charge consultation fees?",
              answer: "No, our initial consultation is completely free. We only earn when you successfully buy or sell a property."
            },
            {
              question: "What areas of Dubai do you cover?",
              answer: "We cover all areas of Dubai including Downtown, Marina, JBR, Business Bay, DIFC, and emerging communities."
            },
            {
              question: "Can you help with property financing?",
              answer: "Yes, we have partnerships with leading banks and can assist you with mortgage and financing options."
            },
            {
              question: "Do you assist international buyers?",
              answer: "Absolutely! We specialize in helping international clients with property purchases and investment opportunities."
            },
            {
              question: "What documents do I need for property purchase?",
              answer: "Required documents include passport, visa, Emirates ID, salary certificate, and bank statements. We'll guide you through the process."
            }
          ].map((faq, index) => (
            <div key={index} className="bg-white p-6 rounded-2xl shadow-lg border">
              <h4 className={`text-lg font-bold text-gray-900 mb-3 ${MontserratFont.className}`}>
                {faq.question}
              </h4>
              <p className={`text-gray-600 ${popinsFont['400'].className}`}>
                {faq.answer}
              </p>
            </div>
          ))}
        </div>
      </Section>
    </div>
  );
}