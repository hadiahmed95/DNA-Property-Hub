<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\BlogView;

class CleanupBlogViews extends Command
{
    protected $signature = 'blog:cleanup-views {--days=90}';
    protected $description = 'Cleanup old blog view records';

    public function handle()
    {
        $days = $this->option('days');
        $cutoffDate = now()->subDays($days);

        $this->info("Cleaning up blog view records older than {$days} days...");

        $deletedCount = BlogView::where('viewed_at', '<', $cutoffDate)->delete();

        $this->info("Deleted {$deletedCount} old view records.");
    }
}