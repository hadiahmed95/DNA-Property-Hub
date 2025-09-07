<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class FilterGroup extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'page',
        'name',
        'slug',
        'data_type',
        'is_multiple',
        'is_required',
        'is_active',
        'display_order',
        'description',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'is_multiple' => 'boolean',
        'is_required' => 'boolean',
        'is_active' => 'boolean',
        'display_order' => 'integer',
    ];

    /**
     * Get the filter values for this group.
     */
    public function filterValues(): HasMany
    {
        return $this->hasMany(FilterValue::class)->orderBy('display_order');
    }

    /**
     * Get only active filter values for this group.
     */
    public function activeFilterValues(): HasMany
    {
        return $this->hasMany(FilterValue::class)
            ->where('is_active', true)
            ->orderBy('display_order');
    }

    /**
     * Get property filters for this group.
     */
    public function propertyFilters(): HasMany
    {
        return $this->hasMany(PropertyFilter::class);
    }

    /**
     * Scope to get active filter groups.
     */
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    /**
     * Scope to get filter groups for a specific page.
     */
    public function scopeForPage($query, string $page)
    {
        return $query->where('page', $page);
    }

    /**
     * Scope to order by display order.
     */
    public function scopeOrdered($query)
    {
        return $query->orderBy('display_order');
    }
}
