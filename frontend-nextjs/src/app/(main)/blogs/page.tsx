'use client';

import { useState } from 'react';
import Image from "next/image";
import Link from "next/link";
import { MontserratFont } from "../../fonts";
import Button from "@/components/button";
import Section from "@/components/section";

// Types
interface BlogPost {
  id: number;
  title: string;
  excerpt: string;
  author: string;
  authorImage: string;
  publishedDate: string;
  readTime: string;
  category: string;
  tags: string[];
  image: string;
  featured: boolean;
  slug: string;
}

// Mock blog data based on the website content
const mockBlogs: BlogPost[] = [
  {
    id: 1,
    title: "Why Tailored Real Estate Solutions Are Changing the Way People Buy in Dubai",
    excerpt: "In Dubai's fast-moving real estate market, finding the right property can feel overwhelming. With thousands of listings, endless neighborhoods, and varying price points, buyers often find themselves scrolling through homes that don't match their needs.",
    author: "Sarah Ahmed",
    authorImage: "/images/banner-1.jpg",
    publishedDate: "2024-12-15",
    readTime: "5 min read",
    category: "Market Insights",
    tags: ["Dubai Real Estate", "Property Investment", "Market Trends"],
    image: "/images/banner-1.jpg",
    featured: true,
    slug: "tailored-real-estate-solutions-dubai"
  },
  {
    id: 2,
    title: "Grow Smarter, Faster, and Stronger in the UAE Market",
    excerpt: "Dubai is one of the fastest-growing business hubs in the world — and for good reason. With tax benefits, global connectivity, and a strong economy, it offers a powerful platform for business success.",
    author: "Ahmed Hassan",
    authorImage: "/images/banner-2.jpg",
    publishedDate: "2024-12-10",
    readTime: "7 min read",
    category: "Business Development",
    tags: ["UAE Business", "Growth Strategy", "Investment"],
    image: "/images/banner-2.jpg",
    featured: true,
    slug: "grow-smarter-faster-stronger-uae-market"
  },
  {
    id: 3,
    title: "Grow Personally and Professionally in Dubai's Fast-Paced Property Industry",
    excerpt: "The real estate market isn't just about buying and selling property — it's a powerful space to build valuable life and business skills. Whether you're an aspiring agent, a property investor, or simply curious about the industry.",
    author: "Maria Rodriguez",
    authorImage: "/images/banner-1.jpg",
    publishedDate: "2024-12-05",
    readTime: "6 min read",
    category: "Career Development",
    tags: ["Real Estate Career", "Professional Growth", "Dubai Market"],
    image: "/images/banner-1.jpg",
    featured: false,
    slug: "grow-personally-professionally-dubai-property"
  },
  {
    id: 4,
    title: "What Buyers, Investors, and Agents Need to Know in 2025",
    excerpt: "Dubai's real estate market is one of the most talked-about property sectors in the world — but it's also one of the most misunderstood. From viral headlines to social media hype, many people have strong opinions.",
    author: "Omar Al-Rashid",
    authorImage: "/images/banner-2.jpg",
    publishedDate: "2024-12-01",
    readTime: "8 min read",
    category: "Market Analysis",
    tags: ["2025 Predictions", "Investment Tips", "Market Analysis"],
    image: "/images/banner-2.jpg",
    featured: false,
    slug: "buyers-investors-agents-need-know-2025"
  },
  {
    id: 5,
    title: "The Ultimate Guide to Dubai Property Investment in 2025",
    excerpt: "Dubai continues to be one of the world's most attractive real estate markets. With new developments, changing regulations, and evolving market dynamics, here's everything you need to know.",
    author: "Jennifer Thompson",
    authorImage: "/images/banner-1.jpg",
    publishedDate: "2024-11-28",
    readTime: "10 min read",
    category: "Investment Guide",
    tags: ["Property Investment", "Dubai Market", "2025 Guide"],
    image: "/images/banner-1.jpg",
    featured: false,
    slug: "ultimate-guide-dubai-property-investment-2025"
  },
  {
    id: 6,
    title: "Sustainable Real Estate: The Future of Dubai's Property Market",
    excerpt: "As environmental consciousness grows globally, Dubai's real estate sector is embracing sustainable practices. From green buildings to eco-friendly communities, discover how sustainability is shaping the future.",
    author: "Dr. Fatima Al-Zahra",
    authorImage: "/images/banner-2.jpg",
    publishedDate: "2024-11-25",
    readTime: "6 min read",
    category: "Sustainability",
    tags: ["Green Buildings", "Sustainable Development", "Future Trends"],
    image: "/images/banner-2.jpg",
    featured: false,
    slug: "sustainable-real-estate-future-dubai-property"
  }
];

const categories = ["All", "Market Insights", "Business Development", "Career Development", "Market Analysis", "Investment Guide", "Sustainability"];

export default function BlogPage() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // Filter blogs based on category
  const filteredBlogs = selectedCategory === "All" 
    ? mockBlogs 
    : mockBlogs.filter(blog => blog.category === selectedCategory);

  // Get featured blogs
  const featuredBlogs = mockBlogs.filter(blog => blog.featured).slice(0, 2);

  // Pagination
  const totalPages = Math.ceil(filteredBlogs.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentBlogs = filteredBlogs.slice(startIndex, startIndex + itemsPerPage);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  return (
    <div>
      {/* Hero Section */}
      <div className="h-[400px] w-full relative">
        <Image src="/images/banner-1.jpg" alt="Blog banner" fill className="object-cover" />
        <div className="bg-black absolute inset-0 opacity-70 mix-blend-multiply"></div>
        <div className="absolute inset-0 flex flex-col gap-5 justify-center items-center text-center">
          <h1 className={`text-5xl font-semibold text-white ${MontserratFont.className}`}>
            Our Blog
          </h1>
          <p className="text-white text-xl max-w-2xl">
            Stay updated with the latest insights, trends, and expert advice in Dubai's dynamic real estate market
          </p>
        </div>
      </div>

      {/* Featured Articles Section */}
      <Section className="my-20">
        <h2 className={`text-4xl font-semibold text-center mb-10 ${MontserratFont.className}`}>
          Featured Articles
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {featuredBlogs.map((blog) => (
            <Link key={blog.id} href={`/blog/${blog.slug}`} className="group">
              <div className="bg-white rounded-xl overflow-hidden shadow hover:shadow-xl transition-shadow duration-300">
                <div className="relative w-full h-[280px] overflow-hidden">
                  <Image
                    src={blog.image}
                    alt={blog.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-b from-black/20 to-transparent"></div>
                  
                  {/* Featured Badge */}
                  <div className="absolute top-4 right-4">
                    <span className="bg-[var(--primary)] text-white px-3 py-1 rounded-full text-sm font-medium">
                      Featured
                    </span>
                  </div>
                </div>

                <div className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[var(--primary)] text-sm font-medium bg-amber-50 px-2 py-1 rounded">
                      {blog.category}
                    </span>
                    <span className="text-gray-500 text-sm">{blog.readTime}</span>
                  </div>

                  <h3 className={`text-xl font-semibold mb-3 group-hover:text-[var(--primary)] transition-colors ${MontserratFont.className}`}>
                    {blog.title}
                  </h3>

                  <p className="text-gray-600 mb-4 line-clamp-2">
                    {blog.excerpt}
                  </p>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="w-8 h-8 relative rounded-full overflow-hidden">
                        <Image src={blog.authorImage} alt={blog.author} fill className="object-cover" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">{blog.author}</p>
                        <p className="text-xs text-gray-500">{formatDate(blog.publishedDate)}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center text-[var(--primary)] text-sm font-medium">
                      Read More
                      <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </Section>

      {/* All Articles Section */}
      <Section className="my-20">
        <h3 className={`text-4xl font-semibold text-center mb-10 ${MontserratFont.className}`}>
          All Articles
        </h3>

        {/* Category Filter */}
        <div className="flex justify-center mb-10">
          <div className="flex flex-wrap justify-center gap-2">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => {
                  setSelectedCategory(category);
                  setCurrentPage(1);
                }}
                className={`px-6 py-3 rounded-full font-medium transition-all duration-300 min-w-[100px] ${
                  selectedCategory === category
                    ? 'bg-[var(--primary)] text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Articles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {currentBlogs.map((blog) => (
            <Link key={blog.id} href={`/blog/${blog.slug}`} className="group">
              <div className="bg-white rounded-xl overflow-hidden shadow hover:shadow-xl transition-shadow duration-300">
                <div className="relative w-full h-[250px] overflow-hidden">
                  <Image
                    src={blog.image}
                    alt={blog.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-b from-black/20 to-transparent"></div>
                </div>

                <div className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[var(--primary)] text-sm font-medium bg-amber-50 px-2 py-1 rounded">
                      {blog.category}
                    </span>
                    <span className="text-gray-500 text-sm">{blog.readTime}</span>
                  </div>

                  <h3 className={`text-lg font-semibold mb-3 group-hover:text-[var(--primary)] transition-colors line-clamp-2 ${MontserratFont.className}`}>
                    {blog.title}
                  </h3>

                  <p className="text-gray-600 mb-4 text-sm line-clamp-3">
                    {blog.excerpt}
                  </p>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="w-7 h-7 relative rounded-full overflow-hidden">
                        <Image src={blog.authorImage} alt={blog.author} fill className="object-cover" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">{blog.author}</p>
                        <p className="text-xs text-gray-500">{formatDate(blog.publishedDate)}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center text-[var(--primary)] text-sm font-medium">
                      Read More
                      <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* No Results */}
        {filteredBlogs.length === 0 && (
          <div className="text-center py-16">
            <h3 className={`text-2xl font-semibold mb-4 ${MontserratFont.className}`}>
              No Articles Found
            </h3>
            <p className="text-gray-600 mb-6">
              We couldn't find any articles in this category.
            </p>
            <Button onClick={() => setSelectedCategory('All')}>
              View All Articles
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
    </div>
  );
}