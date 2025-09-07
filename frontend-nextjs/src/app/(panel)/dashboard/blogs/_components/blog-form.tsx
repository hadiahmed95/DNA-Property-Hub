'use client';

import { useState, useEffect } from 'react';
import Image from "next/image";
import Link from "next/link";
import { useRouter } from 'next/navigation';
import { MontserratFont, popinsFont } from "../../../../fonts";
import Button from "@/components/button";
import Select from "@/components/form/select";
import {
  EyeIcon,
  TrashIcon,
  PlusIcon
} from "@/components/icons";
import { ArrowLeftIcon, ImageIcon, SaveIcon } from 'lucide-react';
import usersService from '@/services/users.service';
import BlogCategoriesService from '@/services/blog.categories.service';
import { BlogPost } from '@/types/blog.categories';
import blogService from '@/services/blog.service';

// Types
interface BlogFormData extends Omit<BlogPost, 'id'>{
  id?: number;
  image: File | null
}

interface BlogFormProps {
  mode: 'create' | 'edit';
  blogId?: number;
}

export default function BlogForm({ mode, blogId }: BlogFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [activeTab, setActiveTab] = useState('content');
  const [showPreview, setShowPreview] = useState(false);
  const [newTag, setNewTag] = useState('');
  const [newKeyword, setNewKeyword] = useState('');
  const [authors, setAuthors] = useState<{ value: string; label: string }[]>([]);
  const [categories, setCategories] = useState<{ value: string; label: string }[]>([]);
  const [preview_feature_image, setPreview_feature_image] = useState<string | null>(null);

  const [formData, setFormData] = useState<BlogFormData>({
    title: '',
    excerpt: '',
    content: '',
    author_id: 'Sarah Ahmed',
    category_id: 0,
    featured_image: null,
    image: null,
    is_featured: false,
    status: 'draft',
    reading_time: '5 min read',
    seo_title: '',
    seo_description: '',
    seo_keywords: [],
    published_at: null,
    views_count: 0,
  });

  // Auto-generate slug from title
  useEffect(() => {
    if (formData.title) {
      const slug = formData.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '');
      setFormData(prev => ({ ...prev, slug }));
    }
  }, [formData.title]);

  // Auto-generate SEO title if not set
  useEffect(() => {
    if (formData.title && !formData.seo_title) {
      setFormData(prev => ({ ...prev, seo_title: formData.title }));
    }
  }, [formData.title, formData.seo_title]);

  // Calculate estimated reading time
  useEffect(() => {
    if (formData.content) {
      const wordsPerMinute = 200;
      const wordCount = formData.content.split(/\s+/).length;
      const readTime = Math.ceil(wordCount / wordsPerMinute);
      setFormData(prev => ({ 
        ...prev,
        reading_time: `${readTime} min read` 
      }));
    }
  }, [formData.content]);

  useEffect(() => {
    usersService.getUsers().then(response => {
      // Map users to options for the author select input
      const authorOptions = response.data.map((user: { id: string; name: string }) => ({
        value: user.id,
        label: user.name
      }));
      setAuthors(authorOptions);
    })

    BlogCategoriesService.fetchCategories().then(response => {
      const categoryOptions = response.data.map((category: { id: string; name: string }) => ({
        value: category.id,
        label: category.name
      }));
      setCategories(categoryOptions);
    });
  }, [])

  // Load existing blog data for edit mode
  useEffect(() => {
    if (mode === 'edit' && blogId) {
      // In a real app, this would fetch from API
      // For now, we'll simulate loading existing data
      blogService.getBlogById(blogId).then(response => {
        const blog = response.data;
        setFormData({
          ...blog
        });
      })
    }
  }, [mode, blogId]);

  const handleInputChange = (field: keyof BlogFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const addKeyword = () => {
    if (newKeyword.trim() && !formData.seo_keywords.includes(newKeyword.trim())) {
      setFormData(prev => ({
        ...prev,
        seo_keywords: [...prev.seo_keywords, newKeyword.trim()]
      }));
      setNewKeyword('');
    }
  };

  const removeKeyword = (keywordToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      seo_keywords: prev.seo_keywords.filter(keyword => keyword !== keywordToRemove)
    }));
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }
    if (!formData.excerpt.trim()) {
      newErrors.excerpt = 'Excerpt is required';
    }
    if (!formData.content.trim()) {
      newErrors.content = 'Content is required';
    }
    if (!formData.author_id) {
      newErrors.author = 'Author is required';
    }
    if (!formData.category_id) {
      newErrors.category = 'Category is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async (status: 'draft' | 'published') => {
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      const dataToSave: Record<string, any> = { ...formData, status };
      const _formData = new FormData();
      _formData.append('title', dataToSave.title);
      _formData.append('excerpt', dataToSave.excerpt);
      _formData.append('content', dataToSave.content);
      _formData.append('author_id', dataToSave.author_id);
      _formData.append('category_id', dataToSave.category_id.toString());
      _formData.append('is_featured', dataToSave.is_featured ? '1' : '0');
      _formData.append('status', status);
      _formData.append('seo_title', dataToSave.seo_title);
      _formData.append('seo_description', dataToSave.seo_description);
      formData.seo_keywords.map(keyword => _formData.append('seo_keywords[]', keyword));
      if (dataToSave.image instanceof File) {
        _formData.append('featured_image', dataToSave.image);
      }

      if (mode === 'edit' && blogId) {
        await blogService.updateBlog(blogId, _formData).then(response => {
          // Redirect back to blogs list
          router.push('/dashboard/blogs');
        });
      } else {
        blogService.createBlog(_formData).then(response => {
          // Redirect back to blogs list
          router.push('/dashboard/blogs');
        });
      }
    } catch (error) {
      console.error('Error saving blog:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const PreviewModal = () => (
    showPreview && (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-auto">
          <div className="p-6 border-b border-gray-200 flex items-center justify-between">
            <h3 className={`text-xl font-bold ${MontserratFont.className}`}>Preview</h3>
            <Button variant="ghost" onClick={() => setShowPreview(false)}>
              <TrashIcon className="w-5 h-5" />
            </Button>
          </div>
          
          <div className="p-6">
            {/* Preview Header */}
            <div className="mb-6">
              <div className="flex items-center space-x-2 mb-4">
                <span className="bg-[var(--primary)] text-white px-3 py-1 rounded-full text-sm">
                  {formData.category?.name}
                </span>
                {formData.is_featured && (
                  <span className="bg-green-500 text-white px-3 py-1 rounded-full text-sm">
                    Featured
                  </span>
                )}
              </div>
              
              <h1 className={`text-3xl font-bold mb-4 ${MontserratFont.className}`}>
                {formData.title || 'Blog Title'}
              </h1>
              
              <div className="flex items-center space-x-4 text-gray-600 mb-4">
                <span>{formData.author_id}</span>
                <span>•</span>
                <span>{new Date().toLocaleDateString()}</span>
                <span>•</span>
                <span>{formData.reading_time}</span>
              </div>
              
              <p className="text-lg text-gray-700 leading-relaxed">
                {formData.excerpt}
              </p>
            </div>

            {/* Preview Image */}
            {formData.featured_image && (
              <div className="mb-6">
                <div className="relative h-[300px] w-full rounded-lg overflow-hidden">
                  <Image src={`${process.env.NEXT_PUBLIC_API_URL}/storage/${formData.featured_image}`} alt="Blog preview" fill className="object-cover" />
                </div>
              </div>
            )}

            {/* Preview Content */}
            <div className="prose max-w-none">
              <div dangerouslySetInnerHTML={{ __html: formData.content.replace(/\n/g, '<br>') }} />
            </div>

            {/* Preview Tags */}
            {formData.tags && formData.tags.length > 0 && (
              <div className="mt-6 pt-6 border-t border-gray-200">
                <h4 className="font-semibold mb-3">Tags:</h4>
                <div className="flex flex-wrap gap-2">
                  {formData.tags.map((tag, index) => (
                    <span key={index} className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm">
                      {tag.name}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    )
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-amber-50/30">
      {/* Header */}
      <div className="relative bg-gradient-to-r from-[var(--primary)] via-amber-500 to-orange-500 rounded-3xl mx-6 mt-6 mb-8 p-8 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-8 right-8 w-32 h-32 border-2 border-white rounded-full animate-pulse"></div>
          <div className="absolute bottom-8 left-8 w-24 h-24 border-2 border-white rounded-lg rotate-45"></div>
        </div>
        
        <div className="relative z-10 flex items-center justify-between">
          <div className="text-white">
            <h1 className={`text-4xl font-bold mb-2 ${MontserratFont.className}`}>
              {mode === 'create' ? 'Create New Blog Post' : 'Edit Blog Post'}
            </h1>
            <p className={`text-xl text-white/90 ${popinsFont['400'].className}`}>
              {mode === 'create' 
                ? 'Share your expertise and insights with your audience'
                : 'Update your blog post content and settings'
              }
            </p>
          </div>
          
          <Link href="/dashboard/blogs">
            <Button className="bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white border-white/20 border"
            icon={<ArrowLeftIcon className="w-5 h-5 mr-2" />}
            >
              Back to Blogs
            </Button>
          </Link>
        </div>
      </div>

      {/* Form */}
      <div className="mx-6 mb-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-2xl shadow-lg p-8">
              {/* Tabs */}
              <div className="flex border-b border-gray-200 mb-8">
                {[
                  { id: 'content', label: 'Content' },
                  { id: 'settings', label: 'Settings' },
                  { id: 'seo', label: 'SEO' }
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`px-6 py-3 font-medium transition-colors ${
                      activeTab === tab.id
                        ? 'border-b-2 border-[var(--primary)] text-[var(--primary)]'
                        : 'text-gray-600 hover:text-[var(--primary)]'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Content Tab */}
              {activeTab === 'content' && (
                <div className="space-y-6">
                  {/* Title */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Title *
                    </label>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) => handleInputChange('title', e.target.value)}
                      placeholder="Enter blog post title..."
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent ${
                        errors.title ? 'border-red-500' : 'border-gray-300'
                      }`}
                    />
                    {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
                  </div>

                  {/* Excerpt */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Excerpt *
                    </label>
                    <textarea
                      value={formData.excerpt}
                      onChange={(e) => handleInputChange('excerpt', e.target.value)}
                      placeholder="Write a compelling excerpt that summarizes your blog post..."
                      rows={3}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent resize-none ${
                        errors.excerpt ? 'border-red-500' : 'border-gray-300'
                      }`}
                    />
                    {errors.excerpt && <p className="text-red-500 text-sm mt-1">{errors.excerpt}</p>}
                    <p className="text-sm text-gray-500 mt-1">
                      {formData.excerpt.length}/300 characters
                    </p>
                  </div>

                  {/* Content */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Content *
                    </label>
                    <textarea
                      value={formData.content}
                      onChange={(e) => handleInputChange('content', e.target.value)}
                      placeholder="Write your blog post content here. You can use Markdown formatting..."
                      rows={15}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent resize-none font-mono text-sm ${
                        errors.content ? 'border-red-500' : 'border-gray-300'
                      }`}
                    />
                    {errors.content && <p className="text-red-500 text-sm mt-1">{errors.content}</p>}
                    <p className="text-sm text-gray-500 mt-1">
                      {formData.content.split(/\s+/).length} words • {formData.reading_time}
                    </p>
                  </div>
                </div>
              )}

              {/* Settings Tab */}
              {activeTab === 'settings' && (
                <div className="space-y-6">
                  {/* Author */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Author *
                    </label>
                    <Select
                      value={formData.author_id}
                      onChange={(e) => handleInputChange('author_id', e.target.value)}
                      options={authors}
                    />
                    {errors.author && <p className="text-red-500 text-sm mt-1">{errors.author}</p>}
                  </div>

                  {/* Category */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Category *
                    </label>
                    <Select
                      value={formData.category_id}
                      onChange={(e) => handleInputChange('category_id', e.target.value)}
                      options={categories}
                    />
                    {errors.category && <p className="text-red-500 text-sm mt-1">{errors.category}</p>}
                  </div>

                  {/* Featured Image */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Featured Image
                    </label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                      {formData.featured_image || preview_feature_image ? (
                        <label htmlFor="featured_image" className="relative">
                          <div className="relative h-40 w-full rounded-lg overflow-hidden mb-4">
                            <Image src={preview_feature_image || `${process.env.NEXT_PUBLIC_API_URL}/storage/${formData.featured_image}`} alt="Featured image" fill className="object-cover" />
                          </div>
                        </label>
                      ) : (
                        <label htmlFor="featured_image" className="cursor-pointer select-none">
                          <ImageIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                          <p className="text-gray-600 mb-2">Upload a featured image</p>
                        </label>
                      )}
                      {
                        (formData.featured_image || preview_feature_image) && (
                          <Button
                            type="button"
                            variant="dark"
                            onClick={() => {
                              handleInputChange('featured_image', null)
                              setPreview_feature_image(null);
                            }}
                            className="mt-2 text-sm cursor-pointer"
                          >
                            Remove image
                          </Button>
                        )
                      }
                      <input
                        id="featured_image"
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          handleInputChange('image', e.target?.files ? e.target?.files[0] : null)
                          if(e.target.files && e.target.files[0]) {
                            const _preview_feature_image = URL.createObjectURL(e.target.files[0]);
                            setPreview_feature_image(_preview_feature_image);
                          }
                        }}
                        className="hidden"
                      />
                    </div>
                  </div>

                  {/* Options */}
                  <div className="space-y-4">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="featured"
                        checked={formData.is_featured}
                        onChange={(e) => handleInputChange('is_featured', e.target.checked)}
                        className="w-4 h-4 text-[var(--primary)] bg-gray-100 border-gray-300 rounded focus:ring-[var(--primary)] focus:ring-2"
                      />
                      <label htmlFor="featured" className="ml-2 text-sm font-medium text-gray-700">
                        Mark as featured post
                      </label>
                    </div>
                  </div>
                </div>
              )}

              {/* SEO Tab */}
              {activeTab === 'seo' && (
                <div className="space-y-6">
                  {/* SEO Title */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      SEO Title
                    </label>
                    <input
                      type="text"
                      value={formData.seo_title}
                      onChange={(e) => handleInputChange('seo_title', e.target.value)}
                      placeholder="SEO optimized title..."
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent"
                    />
                    <p className="text-sm text-gray-500 mt-1">
                      {formData.seo_title.length}/60 characters recommended
                    </p>
                  </div>

                  {/* SEO Description */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      SEO Description
                    </label>
                    <textarea
                      value={formData.seo_description ?? ''}
                      onChange={(e) => handleInputChange('seo_description', e.target.value)}
                      placeholder="Write a compelling meta description..."
                      rows={3}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent resize-none"
                    />
                    <p className="text-sm text-gray-500 mt-1">
                      {formData.seo_description?.length ?? 0}/160 characters recommended
                    </p>
                  </div>

                  {/* SEO Keywords */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      SEO Keywords
                    </label>
                    <div className="flex space-x-2 mb-3">
                      <input
                        type="text"
                        value={newKeyword}
                        onChange={(e) => setNewKeyword(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addKeyword())}
                        placeholder="Add a keyword..."
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent"
                      />
                      <Button onClick={addKeyword} disabled={!newKeyword.trim()}>
                        <PlusIcon className="w-4 h-4" />
                      </Button>
                    </div>
                    
                    <div className="flex flex-wrap gap-2">
                      {formData.seo_keywords.map((keyword, index) => (
                        <span
                          key={index}
                          className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm flex items-center space-x-2"
                        >
                          <span>{keyword}</span>
                          <button
                            onClick={() => removeKeyword(keyword)}
                            className="text-blue-800 hover:text-red-500"
                          >
                            <TrashIcon className="w-3 h-3" />
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-8 space-y-6">
              {/* Publish Actions */}
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h3 className={`text-lg font-bold mb-4 ${MontserratFont.className}`}>
                  Publish
                </h3>
                
                <div className="space-y-4">

                  <div className="flex flex-col space-x-2 space-y-4">
                    <Button
                      variant="outline"
                      onClick={() => handleSave('draft')}
                      disabled={isLoading}
                      className="flex-1"
                      icon={<SaveIcon className="w-4 h-4" />}
                    >
                      Save Draft
                    </Button>
                    <Button
                      onClick={() => handleSave('published')}
                      disabled={isLoading}
                      className="flex-1"
                    >
                      {isLoading ? 'Publishing...' : 'Publish'}
                    </Button>
                  </div>

                  <Button
                    variant="ghost"
                    onClick={() => setShowPreview(true)}
                    className="w-full"
                    icon={<EyeIcon className="w-4 h-4" />}
                  >
                    Preview
                  </Button>
                </div>
              </div>

              {/* Post Stats */}
              {mode === 'edit' && (
                <div className="bg-white rounded-2xl shadow-lg p-6">
                  <h3 className={`text-lg font-bold mb-4 ${MontserratFont.className}`}>
                    Post Statistics
                  </h3>
                  
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Views:</span>
                      <span className="font-medium">1,247</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Published:</span>
                      <span className="font-medium">Dec 15, 2024</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Last Updated:</span>
                      <span className="font-medium">Dec 15, 2024</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Reading Time:</span>
                      <span className="font-medium">{formData.reading_time}</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Quick Tips */}
              <div className="bg-gradient-to-br from-[var(--primary)] to-amber-500 rounded-2xl p-6 text-white">
                <h3 className={`text-lg font-bold mb-4 ${MontserratFont.className}`}>
                  Writing Tips
                </h3>
                
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start space-x-2">
                    <span className="w-1.5 h-1.5 bg-white rounded-full mt-2 flex-shrink-0"></span>
                    <span>Use compelling headlines to grab attention</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="w-1.5 h-1.5 bg-white rounded-full mt-2 flex-shrink-0"></span>
                    <span>Include relevant keywords for better SEO</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="w-1.5 h-1.5 bg-white rounded-full mt-2 flex-shrink-0"></span>
                    <span>Add tags to help categorize your content</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="w-1.5 h-1.5 bg-white rounded-full mt-2 flex-shrink-0"></span>
                    <span>Preview your post before publishing</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Preview Modal */}
      <PreviewModal />
    </div>
  );
}