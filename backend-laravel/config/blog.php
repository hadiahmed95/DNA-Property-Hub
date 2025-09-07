<?php

return [
    /*
    |--------------------------------------------------------------------------
    | Blog Configuration
    |--------------------------------------------------------------------------
    */

    'pagination' => [
        'per_page' => 12,
        'max_per_page' => 50,
    ],

    'images' => [
        'featured_image' => [
            'max_size' => 2048, // KB
            'allowed_types' => ['jpeg', 'png', 'jpg', 'gif'],
            'directory' => 'blog/images',
        ],
        'content_images' => [
            'max_size' => 1024, // KB
            'allowed_types' => ['jpeg', 'png', 'jpg', 'gif'],
            'directory' => 'blog/content',
        ],
    ],

    'reading_time' => [
        'words_per_minute' => 200,
    ],

    'seo' => [
        'title_max_length' => 60,
        'description_max_length' => 160,
        'keywords_max_count' => 10,
    ],

    'comments' => [
        'enabled' => true,
        'auto_approve' => false,
        'max_depth' => 3, // Maximum reply depth
    ],

    'cache' => [
        'enabled' => true,
        'ttl' => 3600, // 1 hour
        'tags' => ['blog', 'blog-posts', 'blog-categories', 'blog-tags'],
    ],
];
