<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class BlogPostResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'title' => $this->title,
            'slug' => $this->slug,
            'excerpt' => $this->excerpt,
            'content' => $this->when($request->routeIs('*.show'), $this->content),
            'featured_image' => $this->featured_image_url,
            'author' => [
                'name' => $this->author_name,
                'email' => $this->author_email,
                'image' => $this->author_image_url,
                'bio' => $this->when($request->routeIs('*.show'), $this->author_bio),
            ],
            'category' => new BlogCategoryResource($this->whenLoaded('category')),
            'tags' => BlogTagResource::collection($this->whenLoaded('tags')),
            'status' => $this->status,
            'is_featured' => $this->is_featured,
            'is_published' => $this->is_published,
            'reading_time' => $this->reading_time,
            'views_count' => $this->views_count,
            'published_at' => $this->published_at?->toDateTimeString(),
            'created_at' => $this->created_at->toDateTimeString(),
            'updated_at' => $this->updated_at->toDateTimeString(),
            'seo' => $this->when($request->routeIs('admin.*'), [
                'title' => $this->seo_title,
                'description' => $this->seo_description,
                'keywords' => $this->seo_keywords,
            ]),
        ];
    }
}
