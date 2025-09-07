<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Storage;

class BlogPost extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'slug',
        'excerpt',
        'content',
        'featured_image',
        'images',
        'author_id',
        'category_id',
        'status',
        'is_featured',
        'reading_time',
        'views_count',
        'seo_title',
        'seo_description',
        'seo_keywords',
        'published_at'
    ];

    protected $casts = [
        'images' => 'array',
        'seo_keywords' => 'array',
        'is_featured' => 'boolean',
        'published_at' => 'datetime',
    ];

    // Auto-generate slug and set published_at when creating/updating
    protected static function boot()
    {
        parent::boot();

        static::creating(function ($post) {
            if (empty($post->slug)) {
                $post->slug = Str::slug($post->title);
            }
            
            if ($post->status === 'published' && empty($post->published_at)) {
                $post->published_at = now();
            }

            // Auto-calculate reading time
            if (!empty($post->content)) {
                $wordCount = str_word_count(strip_tags($post->content));
                $readingTime = ceil($wordCount / 200); // 200 words per minute
                $post->reading_time = $readingTime . ' min read';
            }
        });

        static::updating(function ($post) {
            if ($post->isDirty('title') && empty($post->slug)) {
                $post->slug = Str::slug($post->title);
            }

            if ($post->isDirty('status') && $post->status === 'published' && empty($post->published_at)) {
                $post->published_at = now();
            }

            // Auto-calculate reading time when content changes
            if ($post->isDirty('content') && !empty($post->content)) {
                $wordCount = str_word_count(strip_tags($post->content));
                $readingTime = ceil($wordCount / 200);
                $post->reading_time = $readingTime . ' min read';
            }
        });
    }

    // Relationships
    public function category()
    {
        return $this->belongsTo(BlogCategory::class, 'category_id');
    }

    public function author()
    {
        return $this->belongsTo(User::class, 'author_id');
    }

    public function tags()
    {
        return $this->belongsToMany(BlogTag::class, 'blog_post_tag');
    }

    public function comments()
    {
        return $this->hasMany(BlogComment::class);
    }

    public function approvedComments()
    {
        return $this->hasMany(BlogComment::class)->where('status', 'approved');
    }

    public function views()
    {
        return $this->hasMany(BlogView::class);
    }

    // Scopes
    public function scopePublished($query)
    {
        return $query->where('status', 'published')
                    ->whereNotNull('published_at')
                    ->where('published_at', '<=', now());
    }

    public function scopeDraft($query)
    {
        return $query->where('status', 'draft');
    }

    public function scopeArchived($query)
    {
        return $query->where('status', 'archived');
    }

    public function scopeFeatured($query)
    {
        return $query->where('is_featured', true);
    }

    public function scopeByCategory($query, $categorySlug)
    {
        return $query->whereHas('category', function ($q) use ($categorySlug) {
            $q->where('slug', $categorySlug);
        });
    }

    public function scopeByTag($query, $tagSlug)
    {
        return $query->whereHas('tags', function ($q) use ($tagSlug) {
            $q->where('slug', $tagSlug);
        });
    }

    public function scopeSearch($query, $search)
    {
        return $query->where(function ($q) use ($search) {
            $q->where('title', 'like', "%{$search}%")
              ->orWhere('excerpt', 'like', "%{$search}%")
              ->orWhere('content', 'like', "%{$search}%");
            //   ->orWhereHas('author', function ($q2) use ($search) {
            //       $q2->where('name', 'like', "%{$search}%");
            //   });
        });
    }

    public function scopeLatest($query)
    {
        return $query->orderBy('published_at', 'desc');
    }

    public function scopePopular($query)
    {
        return $query->orderBy('views_count', 'desc');
    }

    // Accessors
    public function getFeaturedImageUrlAttribute()
    {
        if ($this->featured_image) {
            return Storage::url($this->featured_image);
        }
        return asset('images/default-blog-image.jpg');
    }

    public function getAuthorImageUrlAttribute()
    {
        if ($this->author_image) {
            return Storage::url($this->author_image);
        }
        return asset('images/default-author.jpg');
    }

    public function getExcerptLimitedAttribute()
    {
        return Str::limit($this->excerpt, 150);
    }

    public function getReadingTimeMinutesAttribute()
    {
        return (int) str_replace(' min read', '', $this->reading_time);
    }

    public function getIsPublishedAttribute()
    {
        return $this->status === 'published' && 
               $this->published_at && 
               $this->published_at <= now();
    }

    // Methods
    public function incrementViews($ipAddress = null, $userAgent = null, $referrer = null)
    {
        // Check if this IP has viewed this post in the last 24 hours
        $recentView = $this->views()
            ->where('ip_address', $ipAddress)
            ->where('viewed_at', '>', now()->subDay())
            ->exists();

        if (!$recentView) {
            $this->views()->create([
                'ip_address' => $ipAddress,
                'user_agent' => $userAgent,
                'referrer' => $referrer,
                'viewed_at' => now()
            ]);

            $this->increment('views_count');
        }
    }

    public function getRelatedPosts($limit = 3)
    {
        return self::published()
            ->where('id', '!=', $this->id)
            ->where(function ($query) {
                $query->where('category_id', $this->category_id)
                      ->orWhereHas('tags', function ($q) {
                          $q->whereIn('blog_tags.id', $this->tags->pluck('id'));
                      });
            })
            ->latest()
            ->limit($limit)
            ->get();
    }

    public function publish()
    {
        $this->update([
            'status' => 'published',
            'published_at' => now()
        ]);
    }

    public function unpublish()
    {
        $this->update([
            'status' => 'draft',
            'published_at' => null
        ]);
    }

    public function archive()
    {
        $this->update(['status' => 'archived']);
    }
}