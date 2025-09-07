'use client';

import { useState, useEffect } from 'react';
import { MontserratFont, popinsFont } from "../../../../fonts";
import Button from "@/components/button";
import {
  PlusIcon,
  EditIcon,
  TrashIcon,
  SearchIcon,
  CloseIcon,
} from "@/components/icons";
import { CheckIcon } from 'lucide-react';
import { CategoryFormData } from '@/types/blog.categories';
import blogCategoriesService from '@/services/blog.categories.service';
import CategoryForm from './_components/category-form';

// Types
interface BlogCategory {
  id: number;
  name: string;
  slug: string;
  description: string;
  color: string;
  is_active: boolean;
  sort_order: number;
  posts_count: number;
  published_posts_count: number;
  created_at: string;
  updated_at: string;
}

export default function BlogCategoriesPage() {
  const [categories, setCategories] = useState<BlogCategory[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState<BlogCategory | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [formData, setFormData] = useState<CategoryFormData>({
    name: '',
    description: '',
    color: '#eca820',
    is_active: true,
    sort_order: 0
  });

  // Filter categories based on search
  const filteredCategories = categories.filter(category =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    category.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEdit = (category: BlogCategory) => {
    setEditingCategory(category);
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    if (confirm('Are you sure you want to delete this category? This action cannot be undone.')) {
      setIsLoading(true);
      try {
        blogCategoriesService.deleteCategory(id).then(() => {
          setCategories(categories.filter(cat => cat.id !== id));
        });
      } catch (error) {
        console.error('Error deleting category:', error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const toggleStatus = async (id: number) => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      setCategories(categories.map(cat =>
        cat.id === id ? { ...cat, is_active: !cat.is_active, updated_at: new Date().toISOString() } : cat
      ));
    } catch (error) {
      console.error('Error updating category status:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  useEffect(() => {
    blogCategoriesService.fetchCategories().then(response => {
      setCategories(response.data);
    });
  }, [])

  const CategoryCard = ({ category }: { category: BlogCategory }) => (
    <div className="group relative bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-[var(--primary)]/20 p-6">
      {/* Status Indicator */}
      <div className="absolute top-4 right-4">
        <div className={`w-3 h-3 rounded-full ${category.is_active ? 'bg-green-500' : 'bg-gray-400'}`}></div>
      </div>

      {/* Color Badge */}
      <div className="flex items-center justify-between mb-4">
        <div
          className="w-12 h-12 rounded-xl flex items-center justify-center"
          style={{ backgroundColor: category.color + '20', color: category.color }}
        >
          <div
            className="w-6 h-6 rounded-full"
            style={{ backgroundColor: category.color }}
          ></div>
        </div>

        <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => handleEdit(category)}
            className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
          >
            <EditIcon className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleDelete(category.id)}
            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            <TrashIcon className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Category Info */}
      <div className="mb-4">
        <h3 className={`text-lg font-bold mb-2 ${MontserratFont.className}`}>
          {category.name}
        </h3>
        <p className="text-gray-600 text-sm line-clamp-2">
          {category.description}
        </p>
      </div>

      <div className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors w-max mx-auto ${category.is_active
          ? 'bg-green-100 text-green-800 hover:bg-green-200'
          : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
        }`}>
        {category.is_active ? 'Active' : 'Inactive'}
      </div>

      {/* Stats */}
      {/* <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="text-center p-3 bg-gray-50 rounded-lg">
          <p className="text-2xl font-bold text-[var(--primary)]">{category.posts_count}</p>
          <p className="text-xs text-gray-600">Total Posts</p>
        </div>
        <div className="text-center p-3 bg-gray-50 rounded-lg">
          <p className="text-2xl font-bold text-green-600">{category.published_posts_count}</p>
          <p className="text-xs text-gray-600">Published</p>
        </div>
      </div> */}

      {/* Actions */}
      {/* <div className="flex space-x-2">
        <button
          onClick={() => toggleStatus(category.id)}
          className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
            category.is_active
              ? 'bg-green-100 text-green-800 hover:bg-green-200'
              : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
          }`}
        >
          {category.is_active ? 'Active' : 'Inactive'}
        </button>
        <button className="flex-1 px-3 py-2 bg-blue-100 text-blue-800 rounded-lg text-sm font-medium hover:bg-blue-200 transition-colors">
          View Posts
        </button>
      </div> */}

      {/* Slug */}
      <div className="mt-3 pt-3 border-t border-gray-100">
        <p className="text-xs text-gray-500">
          Slug: <code className="bg-gray-100 px-1 rounded">{category.slug}</code>
        </p>
        <p className="text-xs text-gray-500 mt-1">
          Updated: {formatDate(category.updated_at)}
        </p>
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
              Blog Categories
            </h1>
            <p className={`text-xl text-white/90 mb-6 ${popinsFont['400'].className} max-w-2xl`}>
              Organize your blog content with categories. Create, edit, and manage content categories to help users find relevant articles.
            </p>
            <div className="flex items-center space-x-6 text-white/90">
              <div className="flex items-center space-x-2">
                <span className={`${popinsFont['500'].className}`}>{categories.length} Categories</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className={`${popinsFont['500'].className}`}>{categories.filter(c => c.is_active).length} Active</span>
              </div>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-4">
            <Button
              onClick={() => setShowForm(true)}
              className="bg-white text-[var(--primary)] hover:bg-gray-100 border-0 font-semibold"
              icon={<PlusIcon className="w-5 h-5" />}
            >
              Add Category
            </Button>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="mx-6 mb-8">
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
          <div className="flex flex-col md:flex-row gap-6">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search categories..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent"
                />
              </div>
            </div>

            {/* Quick Stats */}
            <div className="flex items-center space-x-6 text-sm text-gray-600">
              <div>
                <span className="font-medium">Total:</span> {categories.length}
              </div>
              <div>
                <span className="font-medium">Active:</span> {categories.filter(c => c.is_active).length}
              </div>
              <div>
                <span className="font-medium">Posts:</span> {categories.reduce((sum, c) => sum + c.posts_count, 0)}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Categories Grid */}
      <div className="mx-6 mb-8">
        {filteredCategories.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredCategories.map((category) => (
              <CategoryCard key={category.id} category={category} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="text-6xl mb-6">📂</div>
            <h3 className={`text-2xl font-bold mb-4 ${MontserratFont.className}`}>
              {searchTerm ? 'No Categories Found' : 'No Categories Yet'}
            </h3>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              {searchTerm
                ? `No categories match "${searchTerm}". Try a different search term.`
                : 'Start organizing your blog content by creating your first category.'
              }
            </p>
            <div className="space-x-4">
              {searchTerm ? (
                <Button onClick={() => setSearchTerm('')}>
                  Clear Search
                </Button>
              ) : (
                <Button onClick={() => setShowForm(true)}>
                  <PlusIcon className="w-5 h-5 mr-2" />
                  Create First Category
                </Button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Category Form Modal */}
      {showForm && <CategoryForm category={editingCategory}
        onClose={() => setShowForm(false)}
        onSubmit={(mode, data) => {
          if (mode === 'create') {
            setCategories([...categories, data]);
          } else if (mode === 'edit') {
            setCategories(categories.map(cat => cat.id === data.id ? data : cat));
          }
          setShowForm(false);
        }} />}
    </div>
  );
}