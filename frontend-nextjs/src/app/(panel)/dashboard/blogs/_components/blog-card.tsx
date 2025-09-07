'use client';

import Image from "next/image";
import Link from "next/link";
import { MontserratFont } from "../../../../fonts";
import { EyeIcon, EditIcon, TrashIcon } from "@/components/icons";
import { BlogPost } from "@/types/blog.categories";

interface BlogCardProps {
  blog: BlogPost;
  onDelete: (id: number) => void;
  onStatusChange: (id: number, status: 'draft' | 'published' | 'archived') => void;
  onToggleFeatured: (id: number) => void;
  isSelected: boolean;
  onSelect: (id: number, selected: boolean) => void;
}

export default function BlogCard({ 
  blog, 
  onDelete, 
  onStatusChange, 
  onToggleFeatured, 
  isSelected, 
  onSelect 
}: BlogCardProps) {
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

  return (
    <div className="group relative bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-[var(--primary)]/20 overflow-hidden">
      {/* Selection Checkbox */}
      {/* <div className="absolute top-4 left-4 z-10">
        <input
          type="checkbox"
          checked={isSelected}
          onChange={(e) => {
            onSelect(blog.id, e.target.checked)
          }}
          className="w-4 h-4 text-[var(--primary)] bg-white border-gray-300 rounded focus:ring-[var(--primary)] focus:ring-2"
        />
      </div> */}

      {/* Blog Image */}
      <div className="relative h-[200px] overflow-hidden">
        {
          !blog.featured_image ? (
            <div className="absolute inset-0 bg-gray-100 flex items-center justify-center">
              <span className="text-gray-400 text-6xl">No Image</span>
            </div>
          ) : (
            <Image
              src={`${process.env.NEXT_PUBLIC_API_URL}/storage/${blog.featured_image}`}
              alt={blog.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
            />
          )
        }
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
        
        {/* Badges */}
        <div className="absolute top-4 right-4 flex flex-col space-y-2">
          <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(blog.status)}`}>
            {blog.status.charAt(0).toUpperCase() + blog.status.slice(1)}
          </span>
          {blog.featured_image && (
            <button
              onClick={() => onToggleFeatured(blog.id)}
              className="bg-[var(--primary)] text-white px-2 py-1 rounded text-xs font-medium hover:bg-amber-600 transition-colors"
            >
              Featured
            </button>
          )}
        </div>

        {/* Quick Actions */}
        <div className="absolute bottom-4 right-4 flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <Link href={`/blog/${blog.slug}`}>
            <button className="p-2 bg-white/20 backdrop-blur-sm text-white rounded-lg hover:bg-white/30 transition-colors">
              <EyeIcon className="w-4 h-4" />
            </button>
          </Link>
          <Link href={`/dashboard/blogs/edit/${blog.id}`}>
            <button className="p-2 bg-white/20 backdrop-blur-sm text-white rounded-lg hover:bg-white/30 transition-colors">
              <EditIcon className="w-4 h-4" />
            </button>
          </Link>
          <button
            onClick={() => onDelete(blog.id)}
            className="p-2 bg-white/20 backdrop-blur-sm text-white rounded-lg hover:bg-red-500/80 transition-colors"
          >
            <TrashIcon className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {/* Category & Reading Time */}
        <div className="flex items-center justify-between mb-3">
          <span className="text-[var(--primary)] text-sm font-medium bg-amber-50 px-2 py-1 rounded">
            {blog.category?.name}
          </span>
          {/* <span className="text-gray-500 text-sm">{blog.readTime}</span> */}
        </div>

        {/* Title */}
        <h3 className={`text-lg font-bold mb-3 line-clamp-2 group-hover:text-[var(--primary)] transition-colors ${MontserratFont.className}`}>
          {blog.title}
        </h3>

        {/* Excerpt */}
        <p className="text-gray-600 text-sm mb-4 line-clamp-3">
          {blog.excerpt}
        </p>

        {/* Meta Info */}
        <div className="flex items-center justify-between">
          {/* <div className="flex items-center space-x-2">
            <div className="w-6 h-6 relative rounded-full overflow-hidden">
              {
                !blog.authorImage ? (
                  <div className="absolute inset-0 bg-gray-100 flex items-center justify-center">
                    <span className="text-gray-400 text-2xl">A</span>
                  </div>
                ) : (
                  <Image src={blog.authorImage} alt={blog.author} fill className="object-cover" />
                )
              }
            </div>
            <div>
              <p className="text-sm font-medium">{blog.author}</p>
              <p className="text-xs text-gray-500">{formatDate(blog.publishedDate)}</p>
            </div>
          </div> */}
          
          <div className="flex items-center space-x-2 text-sm text-gray-500">
            <EyeIcon className="w-4 h-4" />
            <span>{blog.views_count}</span>
          </div>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-1 mt-3">
          {blog.tags?.slice(0, 2).map((tag, index) => (
            <span key={index} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
              {tag.name}
            </span>
          ))}
          {blog.tags && blog.tags.length > 2 && (
            <span className="text-xs text-gray-500">+{blog.tags.length - 2}</span>
          )}
        </div>

        {/* Status Actions */}
        <div className="mt-4 pt-4 border-t border-gray-100">
          <div className="flex space-x-2">
            {blog.status === 'draft' && (
              <button
                onClick={() => onStatusChange(blog.id, 'published')}
                className="text-xs bg-emerald-100 text-emerald-800 px-2 py-1 rounded hover:bg-emerald-200 transition-colors"
              >
                Publish
              </button>
            )}
            {blog.status === 'published' && (
              <button
                onClick={() => onStatusChange(blog.id, 'draft')}
                className="text-xs bg-amber-100 text-amber-800 px-2 py-1 rounded hover:bg-amber-200 transition-colors"
              >
                Unpublish
              </button>
            )}
            <button
              onClick={() => onStatusChange(blog.id, 'archived')}
              className="text-xs bg-gray-100 text-gray-800 px-2 py-1 rounded hover:bg-gray-200 transition-colors"
            >
              Archive
            </button>
          </div>
        </div>
        
      </div>
    </div>
  );
}