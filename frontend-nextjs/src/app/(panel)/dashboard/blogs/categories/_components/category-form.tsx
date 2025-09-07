import { MontserratFont } from '@/app/fonts';
import Button from '@/components/button';
import { CloseIcon } from '@/components/icons';
import blogCategoriesService from '@/services/blog.categories.service';
import { BlogCategory, CategoryFormData } from '@/types/blog.categories';
import { CheckIcon } from 'lucide-react';
import React, { useEffect, useState } from 'react'

type CategoryFormProps = {
    category: BlogCategory | null;
    onClose: () => void;
    onSubmit: (mode: 'edit' | 'create', data: BlogCategory) => void;
}

const predefinedColors = [
  '#eca820', '#10b981', '#3b82f6', '#8b5cf6', '#ef4444', '#22c55e',
  '#f59e0b', '#06b6d4', '#84cc16', '#ec4899', '#6366f1', '#14b8a6'
];

const CategoryForm = ({ category, onClose, onSubmit }: CategoryFormProps) => {

    const [errors, setErrors] = useState<Record<string, string>>({});
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState<CategoryFormData>({
        name: '',
        description: '',
        color: '#eca820',
        is_active: true,
        sort_order: 0
    });


    const handleInputChange = (field: keyof CategoryFormData, value: any) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        // Clear error when user starts typing
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: '' }));
        }
    };

    const validateForm = () => {
        const newErrors: Record<string, string> = {};

        if (!formData.name.trim()) {
            newErrors.name = 'Category name is required';
        }
        // if (!formData.description.trim()) {
        //     newErrors.description = 'Description is required';
        // }
        if (!formData.color) {
            newErrors.color = 'Color is required';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const resetForm = () => {
        setFormData({
            name: '',
            description: '',
            color: '#eca820',
            is_active: true,
            sort_order: 0
        });
        setErrors({});
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) return;

        setIsLoading(true);
        try {
            if (category) {
                // Update category
                const updateCategory = {
                    ...formData,
                    slug: formData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
                    updated_at: new Date().toISOString()
                }
                blogCategoriesService.updateCategory(category.id, updateCategory).then(response => {
                    onSubmit('edit', response.data);
                })
            } else {
                // Create new category
                const newCategory: Omit<BlogCategory, 'id'> = {
                    ...formData,
                    slug: formData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
                    posts_count: 0,
                    published_posts_count: 0,
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString()
                };

                blogCategoriesService.createCategory(newCategory).then(response => {
                    onSubmit('create', { ...newCategory, id: response.data.id });
                });
            }

            resetForm();
        } catch (error) {
            console.error('Error saving category:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleEdit = (category: BlogCategory) => {
        setFormData({
            name: category.name,
            description: category.description,
            color: category.color,
            is_active: category.is_active,
            sort_order: category.sort_order
        });
    };

    useEffect(() => {
        if (category) {
            handleEdit(category);
        } else {
            resetForm();
        }
    }, [category]);

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-auto">
                <div className="p-6 border-b border-gray-200 flex items-center justify-between">
                    <h3 className={`text-xl font-bold ${MontserratFont.className}`}>
                        {category ? 'Edit Category' : 'Create New Category'}
                    </h3>
                    <button
                        onClick={() => {
                            resetForm();
                            onClose();
                        }}
                        className="text-gray-400 hover:text-gray-600 transition-colors"
                    >
                        <CloseIcon className="w-6 h-6" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    {/* Category Name */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Category Name *
                        </label>
                        <input
                            type="text"
                            value={formData.name}
                            onChange={(e) => handleInputChange('name', e.target.value)}
                            placeholder="Enter category name"
                            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent ${errors.name ? 'border-red-500' : 'border-gray-300'
                                }`}
                        />
                        {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
                    </div>

                    {/* Description */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Description *
                        </label>
                        <textarea
                            value={formData.description}
                            onChange={(e) => handleInputChange('description', e.target.value)}
                            placeholder="Enter category description"
                            rows={3}
                            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent resize-none ${errors.description ? 'border-red-500' : 'border-gray-300'
                                }`}
                        />
                        {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
                    </div>

                    {/* Color Selection */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Category Color *
                        </label>
                        <div className="grid grid-cols-6 gap-3 mb-3">
                            {predefinedColors.map((color) => (
                                <button
                                    key={color}
                                    type="button"
                                    onClick={() => handleInputChange('color', color)}
                                    className={`w-10 h-10 rounded-lg border-2 transition-all ${formData.color === color ? 'border-gray-400 scale-110' : 'border-gray-200'
                                        }`}
                                    style={{ backgroundColor: color }}
                                >
                                    {formData.color === color && (
                                        <CheckIcon className="w-5 h-5 text-white mx-auto" />
                                    )}
                                </button>
                            ))}
                        </div>
                        <div className="flex items-center space-x-3">
                            <input
                                type="color"
                                value={formData.color}
                                onChange={(e) => handleInputChange('color', e.target.value)}
                                className="w-12 h-10 border border-gray-300 rounded cursor-pointer"
                            />
                            <input
                                type="text"
                                value={formData.color}
                                onChange={(e) => handleInputChange('color', e.target.value)}
                                placeholder="#000000"
                                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent"
                            />
                        </div>
                        {errors.color && <p className="text-red-500 text-sm mt-1">{errors.color}</p>}
                    </div>

                    {/* Sort Order */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Sort Order
                        </label>
                        <input
                            type="number"
                            value={formData.sort_order}
                            onChange={(e) => handleInputChange('sort_order', parseInt(e.target.value) || 0)}
                            placeholder="0"
                            min="0"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent"
                        />
                        <p className="text-sm text-gray-500 mt-1">
                            Lower numbers appear first in category lists
                        </p>
                    </div>

                    {/* Active Status */}
                    <div className="flex items-center space-x-3">
                        <input
                            type="checkbox"
                            id="is_active"
                            checked={formData.is_active}
                            onChange={(e) => handleInputChange('is_active', e.target.checked)}
                            className="w-4 h-4 text-[var(--primary)] bg-gray-100 border-gray-300 rounded focus:ring-[var(--primary)] focus:ring-2"
                        />
                        <label htmlFor="is_active" className="text-sm font-medium text-gray-700">
                            Active (visible to users)
                        </label>
                    </div>

                    {/* Form Actions */}
                    <div className="flex space-x-3 pt-4 border-t border-gray-200">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={resetForm}
                            className="flex-1"
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            disabled={isLoading}
                            className="flex-1"
                        >
                            {isLoading ? 'Saving...' : (category ? 'Update Category' : 'Create Category')}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    )
};

export default CategoryForm