<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Http\Requests\PropertyStoreRequest;
use App\Http\Requests\PropertyUpdateRequest;
use App\Http\Resources\PropertyResource;
use App\Models\Property;
use App\Repositories\PropertyRepository;
use App\Repositories\FilterRepository;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class PropertyController extends Controller
{
    public function __construct(
        protected PropertyRepository $propertyRepository,
        protected FilterRepository $filterRepository
    ) {}

    /**
     * Display a listing of properties.
     */
    public function index(Request $request): AnonymousResourceCollection
    {
        $filters = $this->buildFilters($request);
        $perPage = $request->get('per_page', 15);
        
        $properties = $this->propertyRepository->getAllProperties($filters, $perPage);
        
        return PropertyResource::collection($properties)->additional([
            'meta' => [
                'filters_applied' => $filters,
                'total_properties' => $properties->total(),
            ]
        ]);
    }

    /**
     * Store a newly created property.
     */
    public function store(PropertyStoreRequest $request): JsonResponse
    {
        try {
            $property = $this->propertyRepository->createProperty($request->validated());
            
            return response()->json([
                'success' => true,
                'message' => 'Property created successfully.',
                'data' => new PropertyResource($property)
            ], 201);
            
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to create property.',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Display the specified property.
     */
    public function show(int $id): JsonResponse
    {
        $property = $this->propertyRepository->getPropertyById($id);
        
        if (!$property) {
            return response()->json([
                'success' => false,
                'message' => 'Property not found.'
            ], 404);
        }

        // Get similar properties
        $similarProperties = $this->propertyRepository->getSimilarProperties($property);

        return response()->json([
            'success' => true,
            'data' => new PropertyResource($property),
            'similar_properties' => PropertyResource::collection($similarProperties)
        ]);
    }

    /**
     * Display the specified property by slug.
     */
    public function showBySlug(string $slug): JsonResponse
    {
        $property = $this->propertyRepository->getPropertyBySlug($slug);
        
        if (!$property) {
            return response()->json([
                'success' => false,
                'message' => 'Property not found.'
            ], 404);
        }

        // Get similar properties
        $similarProperties = $this->propertyRepository->getSimilarProperties($property);

        return response()->json([
            'success' => true,
            'data' => new PropertyResource($property),
            'similar_properties' => PropertyResource::collection($similarProperties)
        ]);
    }

    /**
     * Update the specified property.
     */
    public function update(PropertyUpdateRequest $request, Property $property): JsonResponse
    {
        try {
            $updatedProperty = $this->propertyRepository->updateProperty(
                $property, 
                $request->validated()
            );
            
            return response()->json([
                'success' => true,
                'message' => 'Property updated successfully.',
                'data' => new PropertyResource($updatedProperty)
            ]);
            
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to update property.',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Remove the specified property.
     */
    public function destroy(Property $property): JsonResponse
    {
        try {
            // Check if user can delete this property
            if (auth()->user()->type !== 'admin' && auth()->id() !== $property->created_by) {
                return response()->json([
                    'success' => false,
                    'message' => 'Unauthorized to delete this property.'
                ], 403);
            }

            $this->propertyRepository->deleteProperty($property);
            
            return response()->json([
                'success' => true,
                'message' => 'Property deleted successfully.'
            ]);
            
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to delete property.',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get featured properties.
     */
    public function featured(Request $request): AnonymousResourceCollection
    {
        $limit = $request->get('limit', 6);
        $featuredProperties = $this->propertyRepository->getFeaturedProperties($limit);
        
        return PropertyResource::collection($featuredProperties);
    }

    /**
     * Search properties.
     */
    public function search(Request $request): AnonymousResourceCollection
    {
        $query = $request->get('q', '');
        $filters = $this->buildFilters($request);
        $perPage = $request->get('per_page', 15);
        
        if (empty($query)) {
            return $this->index($request);
        }

        $properties = $this->propertyRepository->searchProperties($query, $filters, $perPage);
        
        return PropertyResource::collection($properties)->additional([
            'meta' => [
                'search_query' => $query,
                'filters_applied' => $filters,
                'total_results' => $properties->total(),
            ]
        ]);
    }

    /**
     * Get properties by current user.
     */
    public function myProperties(Request $request): AnonymousResourceCollection
    {
        $perPage = $request->get('per_page', 15);
        $properties = $this->propertyRepository->getPropertiesByUser(auth()->id(), $perPage);
        
        return PropertyResource::collection($properties);
    }

    /**
     * Get property statistics.
     */
    public function stats(): JsonResponse
    {
        $stats = $this->propertyRepository->getPropertyStats();
        $priceRanges = $this->propertyRepository->getPriceRanges();
        
        return response()->json([
            'success' => true,
            'data' => [
                'statistics' => $stats,
                'price_ranges' => $priceRanges,
            ]
        ]);
    }

    /**
     * Get filter options for properties.
     */
    public function filters(): JsonResponse
    {
        $filterGroups = $this->filterRepository->getFilterGroupsForPage('properties');
        $filterValuesWithCounts = $this->filterRepository->getFilterValuesWithCounts('properties');
        
        return response()->json([
            'success' => true,
            'data' => [
                'filter_groups' => $filterGroups,
                'filter_values_with_counts' => $filterValuesWithCounts,
            ]
        ]);
    }

    /**
     * Toggle property featured status.
     */
    public function toggleFeatured(Property $property): JsonResponse
    {
        try {
            // Only admins can feature/unfeature properties
            if (auth()->user()->type !== 'admin') {
                return response()->json([
                    'success' => false,
                    'message' => 'Unauthorized to feature properties.'
                ], 403);
            }

            $property->update(['is_featured' => !$property->is_featured]);
            
            return response()->json([
                'success' => true,
                'message' => $property->is_featured ? 'Property featured successfully.' : 'Property unfeatured successfully.',
                'data' => new PropertyResource($property->fresh())
            ]);
            
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to update property featured status.',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Build filters array from request.
     */
    private function buildFilters(Request $request): array
    {
        $filters = [];

        // Price range
        if ($request->has('min_price')) {
            $filters['min_price'] = (float) $request->get('min_price');
        }
        if ($request->has('max_price')) {
            $filters['max_price'] = (float) $request->get('max_price');
        }

        // Property specs
        if ($request->has('bedrooms')) {
            $filters['bedrooms'] = (int) $request->get('bedrooms');
        }
        if ($request->has('bathrooms')) {
            $filters['bathrooms'] = (float) $request->get('bathrooms');
        }

        // Location
        if ($request->has('city')) {
            $filters['city'] = $request->get('city');
        }
        if ($request->has('state')) {
            $filters['state'] = $request->get('state');
        }

        // Featured
        if ($request->has('featured')) {
            $filters['featured'] = $request->boolean('featured');
        }

        // Dynamic filter values
        if ($request->has('filter_values')) {
            $filterValues = $request->get('filter_values');
            if (is_string($filterValues)) {
                $filterValues = explode(',', $filterValues);
            }
            $filters['filter_values'] = array_map('intval', $filterValues);
        }

        // Sort
        if ($request->has('sort')) {
            $filters['sort'] = $request->get('sort');
        }

        return $filters;
    }
}
