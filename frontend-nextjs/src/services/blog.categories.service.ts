import api from './api'
import { CategoryFormData } from '@/types/blog.categories'

class BlogCategoriesService {
  // API Integration Examples:

  // Fetch Categories
  fetchCategories = async () => {
    const response = await api.get('/blogs/categories');
    return response.data;
  };

  // Create Category
  createCategory = async (data: CategoryFormData) => {
    const response = await api.post('/blogs/categories', data);
    return response.data;
  };

  // Update Category
  updateCategory = async (id: number, data: CategoryFormData) => {
    const response = await api.put(`/blogs/categories/${id}`, data);
    return response.data;
  };

  // Delete Category
  deleteCategory = async (id: number) => {
    const response = await api.delete(`/blogs/categories/${id}`);
    return response.data;
  };
}

export default new BlogCategoriesService();