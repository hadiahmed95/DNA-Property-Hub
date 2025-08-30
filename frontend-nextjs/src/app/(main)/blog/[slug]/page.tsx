'use client';

import { useState, useEffect } from 'react';
import Image from "next/image";
import Link from "next/link";
import { MontserratFont } from "../../../fonts";
import Button from "@/components/button";
import Section from "@/components/section";

// Types
interface BlogPost {
  id: number;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  authorImage: string;
  authorBio: string;
  publishedDate: string;
  readTime: string;
  category: string;
  tags: string[];
  image: string;
  featured: boolean;
  slug: string;
}

interface Comment {
  id: number;
  author: string;
  authorImage: string;
  date: string;
  content: string;
  replies: Comment[];
}

// Mock blog data with full content
const mockBlog: BlogPost = {
  id: 1,
  title: "Why Tailored Real Estate Solutions Are Changing the Way People Buy in Dubai",
  excerpt: "In Dubai's fast-moving real estate market, finding the right property can feel overwhelming. With thousands of listings, endless neighborhoods, and varying price points, buyers often find themselves scrolling through homes that don't match their needs — or worse, missing out on the perfect one.",
  content: `
    <p>In Dubai's fast-moving real estate market, finding the right property can feel overwhelming. With thousands of listings, endless neighborhoods, and varying price points, buyers often find themselves scrolling through homes that don't match their needs — or worse, missing out on the perfect one.</p>
    
    <p>That's where tailored real estate solutions come in. Rather than presenting clients with generic property lists, forward-thinking agencies are now offering personalized services that match individual lifestyles, budgets, and long-term goals.</p>
    
    <h2>The Personal Touch Makes All the Difference</h2>
    
    <p>Traditional real estate approaches often treat every buyer the same way. But today's successful agencies understand that a young professional looking for a studio apartment in Downtown Dubai has completely different needs than a growing family searching for a villa in Arabian Ranches.</p>
    
    <blockquote>
      <p>"We don't just sell properties; we match people with their perfect lifestyle. Every client gets a completely customized experience based on their unique requirements." - Sarah Ahmed, Senior Real Estate Consultant</p>
    </blockquote>
    
    <p>This personalized approach includes:</p>
    
    <ul>
      <li><strong>Lifestyle Analysis:</strong> Understanding how clients live, work, and spend their free time</li>
      <li><strong>Budget Optimization:</strong> Finding properties that offer the best value within specific price ranges</li>
      <li><strong>Future-Proofing:</strong> Considering long-term needs like family expansion or investment potential</li>
      <li><strong>Community Matching:</strong> Connecting buyers with neighborhoods that align with their values and interests</li>
    </ul>
    
    <h2>Technology Meets Human Expertise</h2>
    
    <p>Modern real estate agencies are leveraging advanced technology to enhance their personalized services. AI-powered matching algorithms can quickly identify properties that meet specific criteria, while virtual reality tours allow clients to explore homes remotely.</p>
    
    <p>However, technology is only as good as the human expertise behind it. The most successful agencies combine cutting-edge tools with experienced professionals who understand the nuances of Dubai's diverse neighborhoods and communities.</p>
    
    <h2>The Results Speak for Themselves</h2>
    
    <p>Clients who work with agencies offering tailored solutions report significantly higher satisfaction rates. They spend less time viewing unsuitable properties and more time making informed decisions about their future homes.</p>
    
    <p>In a market as dynamic as Dubai's, this personalized approach isn't just a luxury—it's becoming a necessity. As the city continues to grow and evolve, buyers need partners who can navigate the complexity and help them find not just a property, but their perfect home.</p>
    
    <p>The future of real estate in Dubai is personal, and the agencies that embrace this shift are the ones helping their clients achieve their dreams.</p>
  `,
  author: "Sarah Ahmed",
  authorImage: "/images/banner-1.jpg",
  authorBio: "Sarah Ahmed is a Senior Real Estate Consultant with over 8 years of experience in Dubai's property market. She specializes in luxury residential properties and has helped hundreds of families find their perfect homes.",
  publishedDate: "2024-12-15",
  readTime: "5 min read",
  category: "Market Insights",
  tags: ["Dubai Real Estate", "Property Investment", "Market Trends", "Personalized Service"],
  image: "/images/banner-1.jpg",
  featured: true,
  slug: "tailored-real-estate-solutions-dubai"
};

// Related articles
const relatedArticles: BlogPost[] = [
  {
    id: 2,
    title: "Grow Smarter, Faster, and Stronger in the UAE Market",
    excerpt: "Dubai is one of the fastest-growing business hubs in the world — and for good reason. With tax benefits, global connectivity, and a strong economy, it offers a powerful platform for business success.",
    content: "",
    author: "Ahmed Hassan",
    authorImage: "/images/banner-2.jpg",
    authorBio: "",
    publishedDate: "2024-12-10",
    readTime: "7 min read",
    category: "Business Development",
    tags: ["UAE Business", "Growth Strategy", "Investment"],
    image: "/images/banner-2.jpg",
    featured: false,
    slug: "grow-smarter-faster-stronger-uae-market"
  },
  {
    id: 3,
    title: "What Buyers, Investors, and Agents Need to Know in 2025",
    excerpt: "Dubai's real estate market is one of the most talked-about property sectors in the world — but it's also one of the most misunderstood.",
    content: "",
    author: "Omar Al-Rashid",
    authorImage: "/images/banner-1.jpg",
    authorBio: "",
    publishedDate: "2024-12-01",
    readTime: "8 min read",
    category: "Market Analysis",
    tags: ["2025 Predictions", "Investment Tips", "Market Analysis"],
    image: "/images/banner-1.jpg",
    featured: false,
    slug: "buyers-investors-agents-need-know-2025"
  }
];

// Mock comments
const mockComments: Comment[] = [
  {
    id: 1,
    author: "John Smith",
    authorImage: "/images/banner-1.jpg",
    date: "2024-12-16",
    content: "This is exactly what I experienced when buying my apartment in Dubai Marina. The personalized service made all the difference!",
    replies: [
      {
        id: 11,
        author: "Sarah Ahmed",
        authorImage: "/images/banner-2.jpg",
        date: "2024-12-16",
        content: "Thank you, John! I'm so glad you had a positive experience. Personalized service truly is the key to successful property transactions.",
        replies: []
      }
    ]
  },
  {
    id: 2,
    author: "Maria Rodriguez",
    authorImage: "/images/banner-2.jpg",
    date: "2024-12-15",
    content: "Great insights! I'm currently looking for a property and this article has given me a lot to think about. Where can I find agents who offer this kind of tailored service?",
    replies: []
  }
];

interface SingleBlogPageProps {
  params: {
    slug: string;
  };
}

export default function SingleBlogPage({ params }: SingleBlogPageProps) {
  const [blog, setBlog] = useState<BlogPost>(mockBlog);
  const [comments, setComments] = useState<Comment[]>(mockComments);
  const [newComment, setNewComment] = useState('');
  const [showShareMenu, setShowShareMenu] = useState(false);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    const comment: Comment = {
      id: Date.now(),
      author: "Anonymous User",
      authorImage: "/images/banner-1.jpg",
      date: new Date().toISOString().split('T')[0],
      content: newComment,
      replies: []
    };

    setComments([comment, ...comments]);
    setNewComment('');
  };

  const shareUrl = typeof window !== 'undefined' ? window.location.href : '';

  const shareOptions = [
    {
      name: 'Facebook',
      url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
      color: 'bg-blue-600 hover:bg-blue-700'
    },
    {
      name: 'Twitter',
      url: `https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(blog.title)}`,
      color: 'bg-sky-500 hover:bg-sky-600'
    },
    {
      name: 'LinkedIn',
      url: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`,
      color: 'bg-blue-700 hover:bg-blue-800'
    }
  ];

  return (
    <div>
      {/* Breadcrumb */}
      <div className="bg-gray-50 py-4">
        <Section>
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <Link href="/" className="hover:text-[var(--primary)]">Home</Link>
            <span>/</span>
            <Link href="/blog" className="hover:text-[var(--primary)]">Blog</Link>
            <span>/</span>
            <span className="text-gray-900">{blog.category}</span>
          </div>
        </Section>
      </div>

      {/* Article Header */}
      <Section className="py-12">
        <div className="max-w-4xl mx-auto">
          {/* Category Badge */}
          <div className="mb-6">
            <span className="inline-block bg-gradient-to-r from-[var(--primary)] to-amber-500 text-white px-4 py-2 rounded-full text-sm font-medium">
              {blog.category}
            </span>
          </div>

          {/* Title */}
          <h1 className={`text-4xl lg:text-5xl font-bold mb-6 leading-tight ${MontserratFont.className}`}>
            {blog.title}
          </h1>

          {/* Meta Information */}
          <div className="flex flex-wrap items-center justify-between mb-8 pb-8 border-b border-gray-200">
            <div className="flex items-center space-x-6">
              {/* Author Info */}
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 relative rounded-full overflow-hidden">
                  <Image src={blog.authorImage} alt={blog.author} fill className="object-cover" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900">{blog.author}</p>
                  <p className="text-sm text-gray-600">{formatDate(blog.publishedDate)}</p>
                </div>
              </div>

              {/* Reading Time */}
              <div className="flex items-center space-x-2 text-gray-600">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>{blog.readTime}</span>
              </div>
            </div>

            {/* Share Buttons */}
            <div className="relative">
              <button
                onClick={() => setShowShareMenu(!showShareMenu)}
                className="flex items-center space-x-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                </svg>
                <span>Share</span>
              </button>

              {showShareMenu && (
                <div className="absolute top-full right-0 mt-2 bg-white shadow-lg rounded-lg border p-2 z-10">
                  {shareOptions.map((option) => (
                    <a
                      key={option.name}
                      href={option.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`block px-4 py-2 text-white rounded mb-1 text-sm font-medium transition-colors ${option.color}`}
                    >
                      {option.name}
                    </a>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-8">
            {blog.tags.map((tag, index) => (
              <span key={index} className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm hover:bg-[var(--primary)]/10 hover:text-[var(--primary)] transition-colors cursor-pointer">
                #{tag}
              </span>
            ))}
          </div>
        </div>
      </Section>

      {/* Featured Image */}
      <div className="mb-12">
        <div className="relative h-[500px] w-full">
          <Image
            src={blog.image}
            alt={blog.title}
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
        </div>
      </div>

      {/* Article Content */}
      <Section>
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
            {/* Main Content */}
            <div className="lg:col-span-3">
              <div 
                className="prose prose-lg max-w-none prose-headings:font-bold prose-headings:text-gray-900 prose-p:text-gray-700 prose-p:leading-relaxed prose-a:text-[var(--primary)] prose-a:no-underline hover:prose-a:underline prose-strong:text-gray-900 prose-ul:text-gray-700 prose-blockquote:border-l-4 prose-blockquote:border-[var(--primary)] prose-blockquote:pl-6 prose-blockquote:italic prose-blockquote:text-gray-600"
                dangerouslySetInnerHTML={{ __html: blog.content }}
              />

              {/* Author Bio Section */}
              <div className="mt-12 p-8 bg-gradient-to-r from-gray-50 to-amber-50/50 rounded-2xl border">
                <div className="flex items-start space-x-6">
                  <div className="w-20 h-20 relative rounded-full overflow-hidden flex-shrink-0">
                    <Image src={blog.authorImage} alt={blog.author} fill className="object-cover" />
                  </div>
                  <div>
                    <h3 className={`text-2xl font-bold mb-3 ${MontserratFont.className}`}>
                      About {blog.author}
                    </h3>
                    <p className="text-gray-700 leading-relaxed mb-4">
                      {blog.authorBio}
                    </p>
                    <div className="flex space-x-3">
                      <Button variant="outline" size="sm">
                        View Profile
                      </Button>
                      <Button variant="ghost" size="sm">
                        More Articles
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Comments Section */}
              <div className="mt-16">
                <h3 className={`text-3xl font-bold mb-8 ${MontserratFont.className}`}>
                  Comments ({comments.length})
                </h3>

                {/* Comment Form */}
                <form onSubmit={handleCommentSubmit} className="mb-12 p-6 bg-gray-50 rounded-2xl">
                  <h4 className={`text-xl font-semibold mb-4 ${MontserratFont.className}`}>
                    Leave a Comment
                  </h4>
                  <textarea
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Share your thoughts..."
                    rows={4}
                    className="w-full p-4 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent resize-none"
                    required
                  />
                  <div className="mt-4 flex justify-end">
                    <Button type="submit" disabled={!newComment.trim()}>
                      Post Comment
                    </Button>
                  </div>
                </form>

                {/* Comments List */}
                <div className="space-y-8">
                  {comments.map((comment) => (
                    <div key={comment.id} className="border-b border-gray-100 pb-8 last:border-b-0">
                      <div className="flex items-start space-x-4">
                        <div className="w-12 h-12 relative rounded-full overflow-hidden flex-shrink-0">
                          <Image src={comment.authorImage} alt={comment.author} fill className="object-cover" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <h5 className="font-semibold text-gray-900">{comment.author}</h5>
                            <span className="text-sm text-gray-500">{formatDate(comment.date)}</span>
                          </div>
                          <p className="text-gray-700 leading-relaxed mb-3">{comment.content}</p>
                          <button className="text-sm text-[var(--primary)] hover:underline">
                            Reply
                          </button>

                          {/* Replies */}
                          {comment.replies.length > 0 && (
                            <div className="mt-6 ml-8 space-y-6">
                              {comment.replies.map((reply) => (
                                <div key={reply.id} className="flex items-start space-x-4">
                                  <div className="w-10 h-10 relative rounded-full overflow-hidden flex-shrink-0">
                                    <Image src={reply.authorImage} alt={reply.author} fill className="object-cover" />
                                  </div>
                                  <div className="flex-1">
                                    <div className="flex items-center space-x-3 mb-2">
                                      <h6 className="font-semibold text-gray-900 text-sm">{reply.author}</h6>
                                      <span className="text-xs text-gray-500">{formatDate(reply.date)}</span>
                                    </div>
                                    <p className="text-gray-700 text-sm leading-relaxed">{reply.content}</p>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-8 space-y-8">
                {/* Table of Contents */}
                <div className="bg-gray-50 p-6 rounded-2xl">
                  <h4 className={`text-lg font-bold mb-4 ${MontserratFont.className}`}>
                    Table of Contents
                  </h4>
                  <ul className="space-y-2 text-sm">
                    <li><a href="#" className="text-gray-600 hover:text-[var(--primary)] transition-colors">The Personal Touch Makes All the Difference</a></li>
                    <li><a href="#" className="text-gray-600 hover:text-[var(--primary)] transition-colors">Technology Meets Human Expertise</a></li>
                    <li><a href="#" className="text-gray-600 hover:text-[var(--primary)] transition-colors">The Results Speak for Themselves</a></li>
                  </ul>
                </div>

                {/* Popular Tags */}
                <div className="bg-gray-50 p-6 rounded-2xl">
                  <h4 className={`text-lg font-bold mb-4 ${MontserratFont.className}`}>
                    Popular Tags
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {['Dubai Real Estate', 'Investment', 'Market Trends', 'Property Buying', 'Luxury Homes', 'Commercial'].map((tag, index) => (
                      <span key={index} className="bg-white text-gray-700 px-3 py-1 rounded-full text-sm hover:bg-[var(--primary)] hover:text-white transition-colors cursor-pointer">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Newsletter Signup */}
                <div className="bg-gradient-to-br from-[var(--primary)] to-amber-500 p-6 rounded-2xl text-white">
                  <h4 className={`text-lg font-bold mb-3 ${MontserratFont.className}`}>
                    Stay Updated
                  </h4>
                  <p className="text-sm mb-4 opacity-90">
                    Get the latest insights delivered to your inbox
                  </p>
                  <div className="space-y-3">
                    <input
                      type="email"
                      placeholder="Your email"
                      className="w-full px-4 py-2 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-white"
                    />
                    <Button className="w-full bg-white text-[var(--primary)] hover:bg-gray-100 border-0">
                      Subscribe
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Section>

      {/* Related Articles */}
      <div className="bg-gray-50 py-20">
        <Section>
          <div className="text-center mb-12">
            <h2 className={`text-4xl font-bold mb-4 ${MontserratFont.className}`}>
              Related Articles
            </h2>
            <p className="text-gray-600 text-lg">
              Continue reading with these related insights
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {relatedArticles.map((article) => (
              <Link key={article.id} href={`/blog/${article.slug}`} className="group">
                <article className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">
                  <div className="relative h-[250px] overflow-hidden">
                    <Image
                      src={article.image}
                      alt={article.title}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute bottom-4 left-4">
                      <span className="bg-white/90 backdrop-blur-sm text-[var(--primary)] px-3 py-1 rounded-full text-sm font-medium">
                        {article.category}
                      </span>
                    </div>
                  </div>
                  
                  <div className="p-6">
                    <div className="flex items-center space-x-4 mb-3 text-sm text-gray-500">
                      <span>{article.author}</span>
                      <span>{formatDate(article.publishedDate)}</span>
                      <span>{article.readTime}</span>
                    </div>
                    
                    <h3 className={`text-xl font-bold mb-3 group-hover:text-[var(--primary)] transition-colors line-clamp-2 ${MontserratFont.className}`}>
                      {article.title}
                    </h3>
                    
                    <p className="text-gray-600 line-clamp-2 mb-4">
                      {article.excerpt}
                    </p>
                    
                    <div className="flex items-center text-[var(--primary)] font-medium">
                      <span>Read More</span>
                      <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                </article>
              </Link>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link href="/blog">
              <Button variant="outline" size="lg">
                View All Articles
              </Button>
            </Link>
          </div>
        </Section>
      </div>
    </div>
  );
}