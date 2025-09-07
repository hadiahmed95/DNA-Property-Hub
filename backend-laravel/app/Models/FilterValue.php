<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class FilterValue extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'filter_group_id',
        'value',
        'label',
        'slug',
        'color',
        'icon',
        'description',
        'display_order',
        'is_active',
        'metadata',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'display_order' => 'integer',
        'is_active' => 'boolean',
        'metadata' => 'array',
    ];

    /**
     * Get the filter group that owns this value.
     */
    public function filterGroup(): BelongsTo
    {
        return $this->belongsTo(FilterGroup::class);
    }

    /**
     * Get property filters for this value.
     */
    public function propertyFilters(): HasMany
    {
        return $this->hasMany(PropertyFilter::class);
    }

    /**
     * Get properties that have this filter value.
     */
    public function properties()
    {
        return $this->belongsToMany(Property::class, 'property_filters')
            ->withTimestamps();
    }

    /**
     * Scope to get active filter values.
     */
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    /**
     * Scope to order by display order.
     */
    public function scopeOrdered($query)
    {
        return $query->orderBy('display_order');
    }

    /**
     * Scope to filter by group.
     */
    public function scopeForGroup($query, int $filterGroupId)
    {
        return $query->where('filter_group_id', $filterGroupId);
    }
}
