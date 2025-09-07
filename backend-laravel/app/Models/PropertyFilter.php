<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class PropertyFilter extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'property_id',
        'filter_group_id',
        'filter_value_id',
    ];

    /**
     * Get the property that owns this filter.
     */
    public function property(): BelongsTo
    {
        return $this->belongsTo(Property::class);
    }

    /**
     * Get the filter group for this filter.
     */
    public function filterGroup(): BelongsTo
    {
        return $this->belongsTo(FilterGroup::class);
    }

    /**
     * Get the filter value for this filter.
     */
    public function filterValue(): BelongsTo
    {
        return $this->belongsTo(FilterValue::class);
    }

    /**
     * Scope to filter by property.
     */
    public function scopeForProperty($query, int $propertyId)
    {
        return $query->where('property_id', $propertyId);
    }

    /**
     * Scope to filter by group.
     */
    public function scopeForGroup($query, int $filterGroupId)
    {
        return $query->where('filter_group_id', $filterGroupId);
    }

    /**
     * Scope to filter by value.
     */
    public function scopeForValue($query, int $filterValueId)
    {
        return $query->where('filter_value_id', $filterValueId);
    }
}
