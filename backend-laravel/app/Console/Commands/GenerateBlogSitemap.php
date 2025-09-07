<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\BlogPost;
use Illuminate\Support\Facades\Storage;

class GenerateBlogSitemap extends Command
{
    protected $signature = 'blog:generate-sitemap';
    protected $description = 'Generate XML sitemap for blog posts';

    public function handle()
    {
        $this->info('Generating blog sitemap...');

        $posts = BlogPost::published()
            ->select(['slug', 'updated_at'])
            ->orderBy('updated_at', 'desc')
            ->get();

        $xml = '<?xml version="1.0" encoding="UTF-8"?>' . PHP_EOL;
        $xml .= '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">' . PHP_EOL;

        // Add blog index page
        $xml .= '  <url>' . PHP_EOL;
        $xml .= '    <loc>' . url('/blog') . '</loc>' . PHP_EOL;
        $xml .= '    <changefreq>daily</changefreq>' . PHP_EOL;
        $xml .= '    <priority>0.8</priority>' . PHP_EOL;
        $xml .= '  </url>' . PHP_EOL;

        // Add individual blog posts
        foreach ($posts as $post) {
            $xml .= '  <url>' . PHP_EOL;
            $xml .= '    <loc>' . url('/blog/' . $post->slug) . '</loc>' . PHP_EOL;
            $xml .= '    <lastmod>' . $post->updated_at->toAtomString() . '</lastmod>' . PHP_EOL;
            $xml .= '    <changefreq>weekly</changefreq>' . PHP_EOL;
            $xml .= '    <priority>0.6</priority>' . PHP_EOL;
            $xml .= '  </url>' . PHP_EOL;
        }

        $xml .= '</urlset>' . PHP_EOL;

        Storage::disk('public')->put('blog-sitemap.xml', $xml);

        $this->info('Blog sitemap generated successfully!');
        $this->info('Location: ' . Storage::disk('public')->path('blog-sitemap.xml'));
        $this->info('Posts included: ' . $posts->count());
    }
}
