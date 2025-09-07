<?php

namespace App\Services;

use App\Models\BlogPost;
use App\Models\BlogCategory;
use App\Models\BlogTag;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class BlogService
{
    /**
     * Create a new blog post
     */
    public function createBlogPost(array $data, ?UploadedFile $featuredImage = null): BlogPost
    {
        // Handle featured image upload
        if ($featuredImage) {
            $data['featured_image'] = $this->uploadImage($featuredImage);
        }

        // Create the blog post
        $post = BlogPost::create($data);

        // Handle tags
        if (isset($data['tags'])) {
            $this->syncTags($post, $data['tags']);
        }

        return $post->load(['category', 'tags']);
    }

    /**
     * Update a blog post
     */
    public function updateBlogPost(BlogPost $post, array $data, ?UploadedFile $featuredImage = null): BlogPost
    {
        // Handle featured image upload
        if ($featuredImage) {
            // Delete old image
            if ($post->featured_image) {
                Storage::disk('public')->delete($post->featured_image);
            }
            $data['featured_image'] = $this->uploadImage($featuredImage);
        }

        // Update the blog post
        $post->update($data);

        // Handle tags
        if (isset($data['tags'])) {
            $this->syncTags($post, $data['tags']);
        }

        return $post->load(['category', 'tags']);
    }

    /**
     * Delete a blog post
     */
    public function deleteBlogPost(BlogPost $post): bool
    {
        // Delete featured image
        if ($post->featured_image) {
            Storage::disk('public')->delete($post->featured_image);
        }

        // Delete additional images
        if ($post->images) {
            foreach ($post->images as $image) {
                Storage::disk('public')->delete($image);
            }
        }

        return $post->delete();
    }

    /**
     * Bulk delete blog posts
     */
    public function bulkDeleteBlogPosts(array $ids): int
    {
        $posts = BlogPost::whereIn('id', $ids)->get();

        foreach ($posts as $post) {
            // Delete images
            if ($post->featured_image) {
                Storage::disk('public')->delete($post->featured_image);
            }
            if ($post->images) {
                foreach ($post->images as $image) {
                    Storage::disk('public')->delete($image);
                }
            }
        }

        return BlogPost::whereIn('id', $ids)->delete();
    }

    /**
     * Upload blog image
     */
    public function uploadImage(UploadedFile $image, string $directory = 'blog/images'): string
    {
        return $image->store($directory, 'public');
    }

    /**
     * Sync tags for a blog post
     */
    private function syncTags(BlogPost $post, array $tagNames): void
    {
        $tagIds = [];
        foreach ($tagNames as $tagName) {
            $tag = BlogTag::firstOrCreate(['name' => trim($tagName)]);
            $tagIds[] = $tag->id;
        }
        $post->tags()->sync($tagIds);
    }

    /**
     * Get blog statistics
     */
    public function getBlogStats(): array
    {
        return [
            'total_posts' => BlogPost::count(),
            'published_posts' => BlogPost::published()->count(),
            'draft_posts' => BlogPost::draft()->count(),
            'archived_posts' => BlogPost::archived()->count(),
            'featured_posts' => BlogPost::featured()->count(),
            'total_views' => BlogPost::sum('views_count'),
            'total_categories' => BlogCategory::count(),
            'total_tags' => BlogTag::count(),
            'recent_posts' => BlogPost::with(['category'])
                ->latest()
                ->limit(5)
                ->get(),
            'popular_posts' => BlogPost::with(['category'])
                ->published()
                ->orderBy('views_count', 'desc')
                ->limit(5)
                ->get(),
            'monthly_views' => $this->getMonthlyViews(),
            'category_distribution' => $this->getCategoryDistribution(),
        ];
    }

    /**
     * Get monthly views data
     */
    private function getMonthlyViews(): array
    {
        return BlogPost::selectRaw('MONTH(created_at) as month, SUM(views_count) as views')
            ->whereYear('created_at', date('Y'))
            ->groupBy('month')
            ->orderBy('month')
            ->get()
            ->map(function ($item) {
                return [
                    'month' => date('M', mktime(0, 0, 0, $item->month, 1)),
                    'views' => $item->views
                ];
            })
            ->toArray();
    }

    /**
     * Get category distribution
     */
    private function getCategoryDistribution(): array
    {
        return BlogCategory::withCount('blogPosts')
            ->get()
            ->map(function ($category) {
                return [
                    'name' => $category->name,
                    'count' => $category->blog_posts_count,
                    'color' => $category->color
                ];
            })
            ->toArray();
    }

    /**
     * Search blog posts
     */
    public function searchBlogPosts(string $query, array $filters = []): \Illuminate\Contracts\Pagination\LengthAwarePaginator
    {
        $blogQuery = BlogPost::with(['category', 'tags']);

        // Apply search
        if (!empty($query)) {
            $blogQuery->search($query);
        }

        // Apply filters
        if (isset($filters['status']) && $filters['status'] !== 'all') {
            $blogQuery->where('status', $filters['status']);
        }

        if (isset($filters['category']) && $filters['category'] !== 'all') {
            $blogQuery->byCategory($filters['category']);
        }

        if (isset($filters['featured'])) {
            $blogQuery->where('is_featured', $filters['featured']);
        }

        // Apply sorting
        $sortBy = $filters['sort_by'] ?? 'newest';
        switch ($sortBy) {
            case 'oldest':
                $blogQuery->orderBy('created_at', 'asc');
                break;
            case 'title':
                $blogQuery->orderBy('title', 'asc');
                break;
            case 'author':
                $blogQuery->orderBy('author_name', 'asc');
                break;
            case 'views':
                $blogQuery->orderBy('views_count', 'desc');
                break;
            default:
                $blogQuery->orderBy('created_at', 'desc');
                break;
        }

        $perPage = min($filters['per_page'] ?? 12, 50);
        return $blogQuery->paginate($perPage);
    }
}