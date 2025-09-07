<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\BlogComment;
use App\Models\BlogPost;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Validator;

class BlogCommentController extends Controller
{
    /**
     * Store a newly created comment
     */
    public function store(Request $request, string $slug): JsonResponse
    {
        $post = BlogPost::where('slug', $slug)->published()->firstOrFail();

        $validator = Validator::make($request->all(), [
            'author_name' => 'required|string|max:255',
            'author_email' => 'required|email|max:255',
            'author_website' => 'nullable|url|max:255',
            'content' => 'required|string|max:1000',
            'parent_id' => 'nullable|exists:blog_comments,id'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        $data = $validator->validated();
        $data['blog_post_id'] = $post->id;
        $data['ip_address'] = $request->ip();
        $data['user_agent'] = $request->userAgent();

        $comment = BlogComment::create($data);

        return response()->json([
            'success' => true,
            'message' => 'Comment submitted successfully and is pending approval',
            'data' => $comment
        ], 201);
    }

    /**
     * Get comments for a blog post
     */
    public function index(string $slug): JsonResponse
    {
        $post = BlogPost::where('slug', $slug)->published()->firstOrFail();

        $comments = BlogComment::with('replies')
            ->where('blog_post_id', $post->id)
            ->approved()
            ->whereNull('parent_id')
            ->latest()
            ->get();

        return response()->json([
            'success' => true,
            'data' => $comments
        ]);
    }
}