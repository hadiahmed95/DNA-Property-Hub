<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\BlogPost;
use App\Models\BlogCategory;
use App\Models\BlogTag;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class BlogController extends Controller
{
    /**
     * Display a listing of blog posts for admin
     */
    public function index(Request $request): JsonResponse
    {
        $query = BlogPost::with(['author', 'category', 'tags']);

        // Apply filters
        if ($request->has('status') && !empty($request->status) && $request->status !== 'all') {
            $query->where('status', $request->status);
        }

        if ($request->has('category') && !empty($request->category) && $request->category !== 'all') {
            $query->byCategory($request->category);
        }

        if ($request->has('search') && !empty($request->search)) {
            $query->search($request->search);
        }

        if ($request->has('featured')) {
            $query->where('is_featured', $request->boolean('featured'));
        }

        // Apply sorting
        $sortBy = $request->get('sort_by', 'newest');
        switch ($sortBy) {
            case 'oldest':
                $query->orderBy('created_at', 'asc');
                break;
            case 'title':
                $query->orderBy('title', 'asc');
                break;
            case 'author':
                $query->orderBy('author_id', 'asc');
                break;
            case 'views':
                $query->orderBy('views_count', 'desc');
                break;
            default:
                $query->orderBy('created_at', 'desc');
                break;
        }

        $perPage = min($request->get('per_page', 12), 50);
        $posts = $query->paginate($perPage);

        return response()->json([
            'success' => true,
            'data' => $posts->items(),
            'pagination' => [
                'current_page' => $posts->currentPage(),
                'last_page' => $posts->lastPage(),
                'per_page' => $posts->perPage(),
                'total' => $posts->total(),
                'from' => $posts->firstItem(),
                'to' => $posts->lastItem(),
            ]
        ]);
    }

    /**
     * Store a newly created blog post
     */
    public function store(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'title' => 'required|string|max:255',
            'excerpt' => 'required|string|max:500',
            'content' => 'required|string',
            'category_id' => 'required|exists:blog_categories,id',
            'author_id' => 'required|exists:users,id',
            'status' => 'required|in:draft,published,archived',
            'is_featured' => 'boolean',
            'featured_image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
            'tags' => 'array',
            'tags.*' => 'string|max:100',
            'seo_title' => 'nullable|string|max:255',
            'seo_description' => 'nullable|string|max:500',
            'seo_keywords' => 'array',
            'seo_keywords.*' => 'string|max:100',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        $data = $validator->validated();

        // Handle file upload
        if ($request->hasFile('featured_image')) {
            $data['featured_image'] = $request->file('featured_image')->store('blog/images', 'public');
        }

        // Create the blog post
        $post = BlogPost::create($data);

        // Handle tags
        if (isset($data['tags'])) {
            $tagIds = [];
            foreach ($data['tags'] as $tagName) {
                $tag = BlogTag::firstOrCreate(['name' => $tagName]);
                $tagIds[] = $tag->id;
            }
            $post->tags()->sync($tagIds);
        }

        $post->load(['category', 'tags']);

        return response()->json([
            'success' => true,
            'message' => 'Blog post created successfully',
            'data' => $post
        ], 201);
    }

    /**
     * Display the specified blog post for admin
     */
    public function show($id): JsonResponse
    {
        $post = BlogPost::with(['category', 'tags', 'comments'])
            ->findOrFail($id);

        return response()->json([
            'success' => true,
            'data' => $post
        ]);
    }

    /**
     * Update the specified blog post
     */
    public function update(Request $request, int $id): JsonResponse
    {
        $post = BlogPost::findOrFail($id);

        $validator = Validator::make($request->all(), [
            'title' => 'required|string|max:255',
            'excerpt' => 'required|string|max:500',
            'content' => 'required|string',
            'category_id' => 'required|exists:blog_categories,id',
            'author_id' => 'required|exists:users,id',
            'status' => 'required|in:draft,published,archived',
            'is_featured' => 'boolean',
            'featured_image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
            'tags' => 'array',
            'tags.*' => 'string|max:100',
            'seo_title' => 'nullable|string|max:255',
            'seo_description' => 'nullable|string|max:500',
            'seo_keywords' => 'array',
            'seo_keywords.*' => 'string|max:100',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors(),
                'request' => $request->all()
            ], 422);
        }

        $data = $validator->validated();

        // Handle file upload
        if ($request->hasFile('featured_image')) {
            // Delete old image
            if ($post->featured_image) {
                Storage::disk('public')->delete($post->featured_image);
            }
            $data['featured_image'] = $request->file('featured_image')->store('blog/images', 'public');
        }

        // Update the blog post
        $post->update($data);

        // Handle tags
        if (isset($data['tags'])) {
            $tagIds = [];
            foreach ($data['tags'] as $tagName) {
                $tag = BlogTag::firstOrCreate(['name' => $tagName]);
                $tagIds[] = $tag->id;
            }
            $post->tags()->sync($tagIds);
        }

        $post->load(['category', 'tags']);

        return response()->json([
            'success' => true,
            'message' => 'Blog post updated successfully',
            'data' => $post
        ]);
    }

    /**
     * Remove the specified blog post
     */
    public function destroy(int $id): JsonResponse
    {
        $post = BlogPost::findOrFail($id);

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

        $post->delete();

        return response()->json([
            'success' => true,
            'message' => 'Blog post deleted successfully'
        ]);
    }

    /**
     * Bulk delete blog posts
     */
    public function bulkDelete(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'ids' => 'required|array',
            'ids.*' => 'integer|exists:blog_posts,id'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        $posts = BlogPost::whereIn('id', $request->ids)->get();

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

        BlogPost::whereIn('id', $request->ids)->delete();

        return response()->json([
            'success' => true,
            'message' => count($request->ids) . ' blog posts deleted successfully'
        ]);
    }

    /**
     * Update blog post status
     */
    public function updateStatus(Request $request, int $id): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'status' => 'required|in:draft,published,archived'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        $post = BlogPost::findOrFail($id);
        $post->update(['status' => $request->status]);

        return response()->json([
            'success' => true,
            'message' => 'Blog post status updated successfully',
            'data' => $post
        ]);
    }

    /**
     * Toggle featured status
     */
    public function toggleFeatured(int $id): JsonResponse
    {
        $post = BlogPost::findOrFail($id);
        $post->update(['is_featured' => !$post->is_featured]);

        return response()->json([
            'success' => true,
            'message' => 'Featured status updated successfully',
            'data' => $post
        ]);
    }

    /**
     * Get blog statistics for admin dashboard
     */
    public function stats(): JsonResponse
    {
        $stats = [
            'total_posts' => BlogPost::count(),
            'published_posts' => BlogPost::where('status', 'published')->count(),
            'draft_posts' => BlogPost::where('status', 'draft')->count(),
            'archived_posts' => BlogPost::where('status', 'archived')->count(),
            'featured_posts' => BlogPost::where('is_featured', true)->count(),
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
        ];

        return response()->json([
            'success' => true,
            'data' => $stats
        ]);
    }

    /**
     * Upload blog image
     */
    public function uploadImage(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'image' => 'required|image|mimes:jpeg,png,jpg,gif|max:2048'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        $path = $request->file('image')->store('blog/images', 'public');
        $url = Storage::url($path);

        return response()->json([
            'success' => true,
            'message' => 'Image uploaded successfully',
            'data' => [
                'path' => $path,
                'url' => $url
            ]
        ]);
    }
}