'use client';

import { useState, useEffect } from 'react';
import Image from "next/image";
import Link from "next/link";
import { MontserratFont, popinsFont } from "../../../fonts";
import Button from "@/components/button";
import Select from "@/components/form/select";
import {
  PlusIcon,
  EyeIcon,
  EditIcon,
  TrashIcon,
  SearchIcon
} from "@/components/icons";
import { FilterIcon, GridIcon, ListIcon } from 'lucide-react';
import blogService from '@/services/blog.service';
import BlogCard from './_components/blog-card';
import { BlogCategory, BlogPost } from '@/types/blog.categories';
import blogCategoriesService from '@/services/blog.categories.service';

const statusOptions = ["All", "published", "draft", "archived"];

export default function DashboardBlogsPage() {
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [categories, setCategories] = useState<BlogCategory[]>([]);
  const [filteredBlogs, setFilteredBlogs] = useState<BlogPost[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [viewType, setViewType] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedBlogs, setSelectedBlogs] = useState<number[]>([]);
  const [sortBy, setSortBy] = useState("newest");
  
  const itemsPerPage = 9;

  // Filter and search blogs
  useEffect(() => {
    let filtered = blogs;
    
    // Category filter
    if (selectedCategory !== "All") {
      filtered = filtered.filter(blog => blog.category?.name === selectedCategory);
    }
    
    // Status filter
    if (selectedStatus !== "All") {
      filtered = filtered.filter(blog => blog.status === selectedStatus);
    }
    
    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(blog =>
        blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        blog.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
        blog.author_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        blog.tags?.some(tag => tag.name.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }
    
    // Sort
    switch (sortBy) {
      case 'oldest':
        filtered.sort((a, b) => (a?.published_at ? new Date(a?.published_at).getTime() : 0) - (b?.published_at ? new Date(b?.published_at).getTime() : 0));
        break;
      case 'title':
        filtered.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case 'author':
        filtered.sort((a, b) => a.author_id.localeCompare(b.author_id));
        break;
      case 'views':
        filtered.sort((a, b) => b.views_count - a.views_count);
        break;
      default:
        filtered.sort((a, b) => (b?.published_at ? new Date(b?.published_at).getTime() : 0) - (a?.published_at ? new Date(a?.published_at).getTime() : 0));
    }
    
    blogService.getBlogs({
      category: selectedCategory !== "All" ? selectedCategory : '',
      status: selectedStatus !== "All" ? selectedStatus : '',
      search: searchTerm,
      sort_by: sortBy
    }).then(response => {
      setFilteredBlogs(response.data);
    });
    
    setCurrentPage(1);
  }, [blogs, selectedCategory, selectedStatus, searchTerm, sortBy]);

  useEffect(() => {

    // Fetch categories
    blogCategoriesService.fetchCategories().then(response => {
      setCategories(response.data);
    });
  }, []);

  // Pagination
  const totalPages = Math.ceil(filteredBlogs.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentBlogs = filteredBlogs.slice(startIndex, startIndex + itemsPerPage);

  const handleDelete = (id: number) => {
    if (confirm('Are you sure you want to delete this blog post?')) {
      blogService.deleteBlog(id).then(() => {
        setBlogs(blogs.filter(blog => blog.id !== id));
        setSelectedBlogs(selectedBlogs.filter(blogId => blogId !== id));
      });
    }
  };

  const handleBulkDelete = () => {
    if (confirm(`Are you sure you want to delete ${selectedBlogs.length} blog post(s)?`)) {
      setBlogs(blogs.filter(blog => !selectedBlogs.includes(blog.id)));
      setSelectedBlogs([]);
    }
  };

  const handleStatusChange = (id: number, newStatus: 'draft' | 'published' | 'archived') => {
    blogService.updateStatus(id, newStatus).then((response) => {
      setBlogs(blogs.map(blog => 
        blog.id === id ? { ...blog, status: newStatus } : blog
      ));
    });
  };

  const toggleFeatured = (id: number) => {
    setBlogs(blogs.map(blog => 
      blog.id === id ? { ...blog, featured: !blog.featured_image } : blog
    ));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'draft':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'archived':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const BlogListItem = ({ blog }: { blog: BlogPost }) => (
    <div className="group relative bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-[var(--primary)]/20 p-6">
      <div className="flex items-center space-x-6">
        {/* Selection Checkbox */}
        {/* <input
          type="checkbox"
          checked={selectedBlogs.includes(blog.id)}
          onChange={(e) => {
            if (e.target.checked) {
              setSelectedBlogs([...selectedBlogs, blog.id]);
            } else {
              setSelectedBlogs(selectedBlogs.filter(id => id !== blog.id));
            }
          }}
          className="w-4 h-4 text-[var(--primary)] bg-white border-gray-300 rounded focus:ring-[var(--primary)] focus:ring-2"
        /> */}

        {/* Blog Image */}
        <div className="relative w-[150px] h-[124px] rounded-lg overflow-hidden flex-shrink-0">
          {
            !blog.featured_image ? (
              <div className="absolute inset-0 bg-gray-200 flex items-center justify-center">
                <span className="text-gray-400">No Image</span>
              </div>
            ) : (
              <Image src={`${process.env.NEXT_PUBLIC_API_URL}/storage/${blog.featured_image}`} alt={blog.title} fill className="object-cover" />
            )
          }
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center space-x-3 mb-2">
                <span className="text-[var(--primary)] text-sm font-medium bg-amber-50 px-2 py-1 rounded">
                  {blog.category?.name}
                </span>
                <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(blog.status)}`}>
                  {blog.status.charAt(0).toUpperCase() + blog.status.slice(1)}
                </span>
                {blog.featured_image && (
                  <span className="bg-[var(--primary)] text-white px-2 py-1 rounded text-xs font-medium">
                    Featured
                  </span>
                )}
              </div>
              
              <h3 className={`text-lg font-bold mb-2 group-hover:text-[var(--primary)] transition-colors ${MontserratFont.className}`}>
                {blog.title}
              </h3>
              
              <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                {blog.excerpt}
              </p>
              
              <div className="flex items-center space-x-4 text-sm text-gray-500">
                <span>{blog.author_id}</span>
                <span>{blog.published_at ? formatDate(blog.published_at): null}</span>
                <span>{blog.reading_time}</span>
                <div className="flex items-center space-x-1">
                  <EyeIcon className="w-4 h-4" />
                  <span>{blog.views_count}</span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center space-x-2 ml-4">
              <Link href={`/blog/${blog.slug}`}>
                <button className="p-2 text-gray-400 hover:text-[var(--primary)] hover:bg-amber-50 rounded-lg transition-colors">
                  <EyeIcon className="w-4 h-4" />
                </button>
              </Link>
              <Link href={`/dashboard/blogs/edit/${blog.id}`}>
                <button className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                  <EditIcon className="w-4 h-4" />
                </button>
              </Link>
              <button
                onClick={() => handleDelete(blog.id)}
                className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              >
                <TrashIcon className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-amber-50/30">
      {/* Page Header */}
      <div className="relative bg-gradient-to-r from-[var(--primary)] via-amber-500 to-orange-500 rounded-3xl mx-6 mt-6 mb-8 p-8 lg:p-12 overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-8 right-8 w-32 h-32 border-2 border-white rounded-full animate-pulse"></div>
          <div className="absolute bottom-8 left-8 w-24 h-24 border-2 border-white rounded-lg rotate-45"></div>
        </div>
        
        <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between">
          <div className="text-white mb-6 lg:mb-0">
            <h1 className={`text-4xl lg:text-5xl font-bold mb-4 ${MontserratFont.className}`}>
              Blog Management
            </h1>
            <p className={`text-xl text-white/90 mb-6 ${popinsFont['400'].className} max-w-2xl`}>
              Create, edit, and manage your blog posts. Share insights and engage with your audience through quality content.
            </p>
            <div className="flex items-center space-x-6 text-white/90">
              <div className="flex items-center space-x-2">
                <span className={`${popinsFont['500'].className}`}>{filteredBlogs.length} Blog Posts</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className={`${popinsFont['500'].className}`}>{blogs.filter(b => b.status === 'published').length} Published</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className={`${popinsFont['500'].className}`}>
                  {blogs?.filter(b => b.status === 'draft')?.length} Drafts
                </span>
              </div>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-4">
            <Button 
              variant="dark" 
              className="bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white border-white/20 border"
              onClick={() => setShowFilters(!showFilters)}
            icon={<FilterIcon className="w-5 h-5 mr-2" />}
            >
              {showFilters ? 'Hide Filters' : 'Show Filters'}
            </Button>
            <Link href="/dashboard/blogs/create">
              <Button className="bg-white text-[var(--primary)] hover:bg-gray-100 border-0 font-semibold"
              icon={<PlusIcon className="w-5 h-5 mr-2" />}
              >
                Create Blog Post
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Filters Section */}
      {showFilters && (
        <div className="mx-6 mb-8 bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Search */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
              <div className="relative">
                <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search blogs..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent"
                />
              </div>
            </div>

            {/* Category Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
              <Select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                options={
                  [{ value: 'all', label: 'All' }].concat(
                    categories.map(cat => ({ value: cat.slug, label: cat.name }))
                  )
                }
              />
            </div>

            {/* Status Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
              <Select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                options={statusOptions.map(status => ({ value: status.toLowerCase(), label: status.charAt(0).toUpperCase() + status.slice(1) }))}
              />
            </div>

            {/* Sort */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Sort By</label>
              <Select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                options={[
                  { value: 'newest', label: 'Newest First' },
                  { value: 'oldest', label: 'Oldest First' },
                  { value: 'title', label: 'Title A-Z' },
                  { value: 'author', label: 'Author A-Z' },
                  { value: 'views', label: 'Most Views' }
                ]}
              />
            </div>
          </div>
        </div>
      )}

      {/* Actions Bar */}
      <div className="mx-6 mb-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center space-x-4">
          {selectedBlogs.length > 0 && (
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">{selectedBlogs.length} selected</span>
              <Button variant="outline" size="sm" onClick={handleBulkDelete}>
                <TrashIcon className="w-4 h-4 mr-1" />
                Delete Selected
              </Button>
            </div>
          )}
        </div>

        <div className="flex items-center space-x-4">
          {/* Results Count */}
          <span className="text-sm text-gray-600">
            Showing {currentBlogs.length} of {filteredBlogs.length} blogs
          </span>

          {/* View Toggle */}
          <div className="flex border border-gray-300 rounded-lg overflow-hidden">
            <button
              onClick={() => setViewType('grid')}
              className={`p-2 ${viewType === 'grid' ? 'bg-[var(--primary)] text-white' : 'bg-white text-gray-700'}`}
            >
              <GridIcon className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewType('list')}
              className={`p-2 ${viewType === 'list' ? 'bg-[var(--primary)] text-white' : 'bg-white text-gray-700'}`}
            >
              <ListIcon className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Blog Grid/List */}
      <div className="mx-6 mb-8">
        {viewType === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {
              currentBlogs.map((blog, index) => {
                console.log('blog', blog);
                return (
                  <div key={index}>
                    {
                      blog && (

                        <BlogCard 
                          blog={blog}
                          onDelete={handleDelete}
                          onStatusChange={handleStatusChange}
                          onToggleFeatured={toggleFeatured}
                          isSelected={selectedBlogs.includes(blog.id)}
                          onSelect={(id, selected) => {
                            // onSelect(id, selected)
                          }}
                        />
                      )
                    }
                  </div>
                )
              })
            }
          </div>
        ) : (
          <div className="space-y-6">
            {currentBlogs.map((blog) => (
              <BlogListItem key={blog.id} blog={blog} />
            ))}
          </div>
        )}
      </div>

      {/* Empty State */}
      {filteredBlogs.length === 0 && (
        <div className="text-center py-20 mx-6">
          <div className="text-6xl mb-6">📝</div>
          <h3 className={`text-2xl font-bold mb-4 ${MontserratFont.className}`}>
            No Blog Posts Found
          </h3>
          <p className="text-gray-600 mb-6 max-w-md mx-auto">
            {searchTerm || selectedCategory !== "All" || selectedStatus !== "All"
              ? "No blog posts match your current filters. Try adjusting your search criteria."
              : "Start creating engaging content for your audience by writing your first blog post."
            }
          </p>
          <div className="space-x-4">
            {searchTerm || selectedCategory !== "All" || selectedStatus !== "All" ? (
              <Button onClick={() => {
                setSearchTerm('');
                setSelectedCategory('All');
                setSelectedStatus('All');
              }}>
                Clear Filters
              </Button>
            ) : (
              <Link href="/dashboard/blogs/create">
                <Button>
                  <PlusIcon className="w-5 h-5 mr-2" />
                  Create Your First Blog Post
                </Button>
              </Link>
            )}
          </div>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center mx-6 mb-8">
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
    </div>
  );
}