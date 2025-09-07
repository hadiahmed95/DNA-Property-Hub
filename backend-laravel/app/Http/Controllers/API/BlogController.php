<?php

namespace App\Http\Controllers\Api;

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
     * Display a listing of blog posts for public view
     */
    public function index(Request $request): JsonResponse
    {
        $query = BlogPost::with(['category', 'tags'])
            ->published()
            ->latest();

        // Apply filters
        if ($request->has('category')) {
            $query->byCategory($request->category);
        }

        if ($request->has('tag')) {
            $query->byTag($request->tag);
        }

        if ($request->has('search')) {
            $query->search($request->search);
        }

        if ($request->has('featured')) {
            $query->featured();
        }

        // Apply sorting
        $sortBy = $request->get('sort_by', 'latest');
        switch ($sortBy) {
            case 'popular':
                $query->popular();
                break;
            case 'oldest':
                $query->orderBy('published_at', 'asc');
                break;
            default:
                $query->latest();
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
     * Display the specified blog post
     */
    public function show(string $slug, Request $request): JsonResponse
    {
        $post = BlogPost::with(['category', 'tags', 'approvedComments' => function ($query) {
            $query->with('replies')->whereNull('parent_id')->latest();
        }])
        ->where('slug', $slug)
        ->published()
        ->firstOrFail();

        // Increment views
        $post->incrementViews(
            $request->ip(),
            $request->userAgent(),
            $request->header('referer')
        );

        // Get related posts
        $relatedPosts = $post->getRelatedPosts(3);

        return response()->json([
            'success' => true,
            'data' => [
                'post' => $post,
                'related_posts' => $relatedPosts
            ]
        ]);
    }

    /**
     * Get featured blog posts
     */
    public function featured(): JsonResponse
    {
        $posts = BlogPost::with(['category', 'tags'])
            ->published()
            ->featured()
            ->latest()
            ->limit(6)
            ->get();

        return response()->json([
            'success' => true,
            'data' => $posts
        ]);
    }

    /**
     * Get blog categories
     */
    public function categories(): JsonResponse
    {
        $categories = BlogCategory::active()
            ->ordered()
            ->withCount('publishedPosts')
            ->get();

        return response()->json([
            'success' => true,
            'data' => $categories
        ]);
    }

    /**
     * Get blog tags
     */
    public function tags(): JsonResponse
    {
        $tags = BlogTag::withCount(['blogPosts' => function ($query) {
            $query->published();
        }])
        ->having('blog_posts_count', '>', 0)
        ->orderBy('blog_posts_count', 'desc')
        ->limit(20)
        ->get();

        return response()->json([
            'success' => true,
            'data' => $tags
        ]);
    }

    /**
     * Get blog statistics
     */
    public function stats(): JsonResponse
    {
        $stats = [
            'total_posts' => BlogPost::published()->count(),
            'total_categories' => BlogCategory::active()->count(),
            'total_tags' => BlogTag::count(),
            'total_views' => BlogPost::published()->sum('views_count'),
            'featured_posts' => BlogPost::published()->featured()->count(),
        ];

        return response()->json([
            'success' => true,
            'data' => $stats
        ]);
    }
}