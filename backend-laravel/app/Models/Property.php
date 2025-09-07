<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Support\Str;

class Property extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'title',
        'slug',
        'description',
        'price',
        'price_type',
        'bedrooms',
        'bathrooms',
        'half_bathrooms',
        'square_footage',
        'lot_size',
        'year_built',
        'floors',
        'hoa_fees',
        'property_tax',
        'address',
        'city',
        'state',
        'zip_code',
        'country',
        'neighborhood',
        'latitude',
        'longitude',
        'agent_info',
        'specifications',
        'media',
        'marketing_settings',
        'created_by',
        'updated_by',
        'is_active',
        'is_featured',
        'published_at',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'price' => 'decimal:2',
        'bathrooms' => 'decimal:1',
        'lot_size' => 'decimal:2',
        'hoa_fees' => 'decimal:2',
        'property_tax' => 'decimal:2',
        'latitude' => 'decimal:8',
        'longitude' => 'decimal:8',
        'agent_info' => 'array',
        'specifications' => 'array',
        'media' => 'array',
        'marketing_settings' => 'array',
        'is_active' => 'boolean',
        'is_featured' => 'boolean',
        'published_at' => 'datetime',
    ];

    /**
     * Boot the model.
     */
    protected static function boot()
    {
        parent::boot();

        static::creating(function ($property) {
            if (empty($property->slug)) {
                $property->slug = Str::slug($property->title);
            }
        });

        static::updating(function ($property) {
            if ($property->isDirty('title') && empty($property->slug)) {
                $property->slug = Str::slug($property->title);
            }
        });
    }

    /**
     * Get the user who created this property.
     */
    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    /**
     * Get the user who last updated this property.
     */
    public function updater(): BelongsTo
    {
        return $this->belongsTo(User::class, 'updated_by');
    }

    /**
     * Get property filters.
     */
    public function propertyFilters(): HasMany
    {
        return $this->hasMany(PropertyFilter::class);
    }

    /**
     * Get filter values through property filters.
     */
    public function filterValues(): BelongsToMany
    {
        return $this->belongsToMany(FilterValue::class, 'property_filters')
            ->withTimestamps();
    }

    /**
     * Get filter values for a specific group.
     */
    public function filterValuesForGroup(int $filterGroupId)
    {
        return $this->filterValues()
            ->whereHas('filterGroup', function ($query) use ($filterGroupId) {
                $query->where('id', $filterGroupId);
            });
    }

    /**
     * Scope to get active properties.
     */
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    /**
     * Scope to get published properties.
     */
    public function scopePublished($query)
    {
        return $query->whereNotNull('published_at')
            ->where('published_at', '<=', now());
    }

    /**
     * Scope to get featured properties.
     */
    public function scopeFeatured($query)
    {
        return $query->where('is_featured', true);
    }

    /**
     * Scope to filter by price range.
     */
    public function scopePriceRange($query, $minPrice = null, $maxPrice = null)
    {
        if ($minPrice !== null) {
            $query->where('price', '>=', $minPrice);
        }
        if ($maxPrice !== null) {
            $query->where('price', '<=', $maxPrice);
        }
        return $query;
    }

    /**
     * Scope to filter by filter values.
     */
    public function scopeWithFilters($query, array $filterValueIds)
    {
        if (empty($filterValueIds)) {
            return $query;
        }

        return $query->whereHas('propertyFilters', function ($q) use ($filterValueIds) {
            $q->whereIn('filter_value_id', $filterValueIds);
        });
    }

    /**
     * Scope to search by text.
     */
    public function scopeSearch($query, string $search)
    {
        return $query->where(function ($q) use ($search) {
            $q->where('title', 'like', "%{$search}%")
              ->orWhere('description', 'like', "%{$search}%")
              ->orWhere('address', 'like', "%{$search}%")
              ->orWhere('city', 'like', "%{$search}%")
              ->orWhere('neighborhood', 'like', "%{$search}%");
        });
    }

    /**
     * Get the formatted price.
     */
    public function getFormattedPriceAttribute(): string
    {
        $price = number_format($this->price, 0);
        
        return match($this->price_type) {
            'rent_monthly' => "$" . $price . "/mo",
            'rent_weekly' => "$" . $price . "/wk",
            default => "$" . $price,
        };
    }

    /**
     * Get the full address.
     */
    public function getFullAddressAttribute(): string
    {
        return "{$this->address}, {$this->city}, {$this->state} {$this->zip_code}";
    }
}
