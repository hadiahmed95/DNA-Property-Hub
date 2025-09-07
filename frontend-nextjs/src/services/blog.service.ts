import api from './api'
import { BlogPost, CategoryFormData } from '@/types/blog.categories'

class BlogService {

  // Get Blogs
  getBlogs = async (data: Record<string, string>) => {
    const response = await api.get('/blogs', { params: data });
    return response.data;
  };

  getBlogById = async (id: number) => {
    const response = await api.get(`/blogs/blog/${id}`);
    return response.data;
  }

  // Create Blog
  createBlog = async (data: any) => {
    const response = await api.post('/blogs', data, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  };

  // Update Blog
  updateBlog = async (id: number, data: FormData) => {
    const response = await api.post(`/blogs/blog/${id}`, data, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  };

  // Update Status
  updateStatus = async (id: number, status: 'draft' | 'published' | 'archived') => {
    const response = await api.patch(`/blogs/blog/${id}/status`, { status });
    return response.data;
  }

  // Delete Blog
  deleteBlog = async (id: number) => {
    const response = await api.delete(`/blogs/blog/${id}`);
    return response.data;
  };
}

export default new BlogService();