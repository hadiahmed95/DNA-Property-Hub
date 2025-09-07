<?php

namespace App\Repositories;

use App\Models\Property;
use App\Models\PropertyFilter;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\DB;

class PropertyRepository
{
    /**
     * Get all properties with optional filters.
     */
    public function getAllProperties(array $filters = [], int $perPage = 15): LengthAwarePaginator
    {
        $query = Property::with(['creator', 'filterValues.filterGroup'])
            ->active()
            ->published();

        $query = $this->applyFilters($query, $filters);

        return $query->orderBy('is_featured', 'desc')
            ->orderBy('published_at', 'desc')
            ->paginate($perPage);
    }

    /**
     * Get property by ID with relationships.
     */
    public function getPropertyById(int $id): ?Property
    {
        return Property::with(['creator', 'updater', 'filterValues.filterGroup'])
            ->find($id);
    }

    /**
     * Get property by slug with relationships.
     */
    public function getPropertyBySlug(string $slug): ?Property
    {
        return Property::with(['creator', 'updater', 'filterValues.filterGroup'])
            ->where('slug', $slug)
            ->active()
            ->published()
            ->first();
    }

    /**
     * Create a new property.
     */
    public function createProperty(array $data): Property
    {
        return DB::transaction(function () use ($data) {
            $filterData = $data['filters'] ?? [];
            unset($data['filters']);

            $property = Property::create($data);

            if (!empty($filterData)) {
                $this->syncPropertyFilters($property, $filterData);
            }

            return $property->load(['creator', 'filterValues.filterGroup']);
        });
    }

    /**
     * Update a property.
     */
    public function updateProperty(Property $property, array $data): Property
    {
        return DB::transaction(function () use ($property, $data) {
            $filterData = $data['filters'] ?? [];
            unset($data['filters']);

            $property->update($data);

            if (isset($filterData)) {
                $this->syncPropertyFilters($property, $filterData);
            }

            return $property->load(['creator', 'updater', 'filterValues.filterGroup']);
        });
    }

    /**
     * Delete a property.
     */
    public function deleteProperty(Property $property): bool
    {
        return DB::transaction(function () use ($property) {
            // Delete property filters first
            $property->propertyFilters()->delete();
            
            // Delete the property
            return $property->delete();
        });
    }

    /**
     * Get featured properties.
     */
    public function getFeaturedProperties(int $limit = 6): Collection
    {
        return Property::with(['creator', 'filterValues.filterGroup'])
            ->active()
            ->published()
            ->featured()
            ->orderBy('published_at', 'desc')
            ->limit($limit)
            ->get();
    }

    /**
     * Get properties by user.
     */
    public function getPropertiesByUser(int $userId, int $perPage = 15): LengthAwarePaginator
    {
        return Property::with(['creator', 'filterValues.filterGroup'])
            ->where('created_by', $userId)
            ->orderBy('created_at', 'desc')
            ->paginate($perPage);
    }

    /**
     * Search properties.
     */
    public function searchProperties(string $query, array $filters = [], int $perPage = 15): LengthAwarePaginator
    {
        $searchQuery = Property::with(['creator', 'filterValues.filterGroup'])
            ->active()
            ->published()
            ->search($query);

        $searchQuery = $this->applyFilters($searchQuery, $filters);

        return $searchQuery->orderBy('is_featured', 'desc')
            ->orderBy('published_at', 'desc')
            ->paginate($perPage);
    }

    /**
     * Get similar properties.
     */
    public function getSimilarProperties(Property $property, int $limit = 4): Collection
    {
        $query = Property::with(['creator', 'filterValues.filterGroup'])
            ->active()
            ->published()
            ->where('id', '!=', $property->id);

        // Similar by price range (±20%)
        $priceMin = $property->price * 0.8;
        $priceMax = $property->price * 1.2;
        $query->priceRange($priceMin, $priceMax);

        // Similar by location (same city)
        $query->where('city', $property->city);

        // Similar by bedrooms (±1)
        if ($property->bedrooms) {
            $query->whereBetween('bedrooms', [
                max(1, $property->bedrooms - 1),
                $property->bedrooms + 1
            ]);
        }

        return $query->orderBy('is_featured', 'desc')
            ->orderBy('published_at', 'desc')
            ->limit($limit)
            ->get();
    }

    /**
     * Apply filters to query.
     */
    private function applyFilters($query, array $filters)
    {
        // Price range filter
        if (!empty($filters['min_price']) || !empty($filters['max_price'])) {
            $query->priceRange($filters['min_price'] ?? null, $filters['max_price'] ?? null);
        }

        // Bedrooms filter
        if (!empty($filters['bedrooms'])) {
            $query->where('bedrooms', $filters['bedrooms']);
        }

        // Bathrooms filter
        if (!empty($filters['bathrooms'])) {
            $query->where('bathrooms', '>=', $filters['bathrooms']);
        }

        // City filter
        if (!empty($filters['city'])) {
            $query->where('city', $filters['city']);
        }

        // State filter
        if (!empty($filters['state'])) {
            $query->where('state', $filters['state']);
        }

        // Featured filter
        if (!empty($filters['featured'])) {
            $query->featured();
        }

        // Filter values (dynamic filters)
        if (!empty($filters['filter_values'])) {
            $query->withFilters($filters['filter_values']);
        }

        // Sort
        if (!empty($filters['sort'])) {
            $this->applySorting($query, $filters['sort']);
        }

        return $query;
    }

    /**
     * Apply sorting to query.
     */
    private function applySorting($query, string $sort)
    {
        switch ($sort) {
            case 'price_asc':
                $query->orderBy('price', 'asc');
                break;
            case 'price_desc':
                $query->orderBy('price', 'desc');
                break;
            case 'newest':
                $query->orderBy('published_at', 'desc');
                break;
            case 'oldest':
                $query->orderBy('published_at', 'asc');
                break;
            case 'bedrooms_asc':
                $query->orderBy('bedrooms', 'asc');
                break;
            case 'bedrooms_desc':
                $query->orderBy('bedrooms', 'desc');
                break;
            case 'sqft_asc':
                $query->orderBy('square_footage', 'asc');
                break;
            case 'sqft_desc':
                $query->orderBy('square_footage', 'desc');
                break;
            default:
                $query->orderBy('is_featured', 'desc')
                      ->orderBy('published_at', 'desc');
        }
    }

    /**
     * Sync property filters.
     */
    private function syncPropertyFilters(Property $property, array $filterData): void
    {
        // Delete existing filters
        $property->propertyFilters()->delete();

        // Insert new filters
        foreach ($filterData as $filterGroupId => $filterValueIds) {
            if (is_array($filterValueIds)) {
                foreach ($filterValueIds as $filterValueId) {
                    PropertyFilter::create([
                        'property_id' => $property->id,
                        'filter_group_id' => $filterGroupId,
                        'filter_value_id' => $filterValueId,
                    ]);
                }
            } else {
                PropertyFilter::create([
                    'property_id' => $property->id,
                    'filter_group_id' => $filterGroupId,
                    'filter_value_id' => $filterValueIds,
                ]);
            }
        }
    }

    /**
     * Get property statistics.
     */
    public function getPropertyStats(): array
    {
        return [
            'total_properties' => Property::active()->count(),
            'published_properties' => Property::active()->published()->count(),
            'featured_properties' => Property::active()->published()->featured()->count(),
            'average_price' => Property::active()->published()->avg('price'),
            'min_price' => Property::active()->published()->min('price'),
            'max_price' => Property::active()->published()->max('price'),
        ];
    }

    /**
     * Get price ranges for filtering.
     */
    public function getPriceRanges(): array
    {
        $prices = Property::active()->published()->pluck('price')->sort();
        $min = $prices->min();
        $max = $prices->max();
        $step = ($max - $min) / 5;

        return [
            ['min' => $min, 'max' => $min + $step, 'label' => '$' . number_format($min) . ' - $' . number_format($min + $step)],
            ['min' => $min + $step, 'max' => $min + ($step * 2), 'label' => '$' . number_format($min + $step) . ' - $' . number_format($min + ($step * 2))],
            ['min' => $min + ($step * 2), 'max' => $min + ($step * 3), 'label' => '$' . number_format($min + ($step * 2)) . ' - $' . number_format($min + ($step * 3))],
            ['min' => $min + ($step * 3), 'max' => $min + ($step * 4), 'label' => '$' . number_format($min + ($step * 3)) . ' - $' . number_format($min + ($step * 4))],
            ['min' => $min + ($step * 4), 'max' => $max, 'label' => '$' . number_format($min + ($step * 4)) . ' - $' . number_format($max)],
        ];
    }
}