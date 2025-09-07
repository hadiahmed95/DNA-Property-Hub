<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Http\Resources\FilterGroupResource;
use App\Http\Resources\FilterValueResource;
use App\Models\FilterGroup;
use App\Models\FilterValue;
use App\Repositories\FilterRepository;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Validation\Rule;

class FilterController extends Controller
{
    public function __construct(
        protected FilterRepository $filterRepository
    ) {}

    /**
     * Get filter groups for a specific page.
     */
    public function getFilterGroups(Request $request): AnonymousResourceCollection
    {
        $request->validate([
            'page' => ['required', 'string', 'in:properties,services']
        ]);

        $filterGroups = $this->filterRepository->getFilterGroupsForPage($request->get('page'));
        
        return FilterGroupResource::collection($filterGroups);
    }

    /**
     * Get filter values for a specific group.
     */
    public function getFilterValues(Request $request, int $filterGroupId): AnonymousResourceCollection
    {
        $filterValues = $this->filterRepository->getFilterValuesByGroup($filterGroupId);
        
        return FilterValueResource::collection($filterValues);
    }

    /**
     * Get filter values with property counts.
     */
    public function getFilterValuesWithCounts(Request $request): JsonResponse
    {
        $request->validate([
            'page' => ['required', 'string', 'in:properties,services']
        ]);

        $filterValues = $this->filterRepository->getFilterValuesWithCounts($request->get('page'));
        
        return response()->json([
            'success' => true,
            'data' => FilterValueResource::collection($filterValues)
        ]);
    }

    /**
     * Store a new filter group.
     */
    public function storeFilterGroup(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'page' => ['required', 'string'],
            'name' => ['required', 'string', 'max:100'],
            'slug' => ['required', 'string', 'max:100', 'unique:filter_groups'],
            'data_type' => ['required', Rule::in(['string', 'integer', 'decimal', 'boolean'])],
            'is_multiple' => ['boolean'],
            'is_required' => ['boolean'],
            'is_active' => ['boolean'],
            'display_order' => ['integer', 'min:0'],
            'description' => ['nullable', 'string'],
        ]);

        try {
            $filterGroup = $this->filterRepository->createFilterGroup($validated);
            
            return response()->json([
                'success' => true,
                'message' => 'Filter group created successfully.',
                'data' => new FilterGroupResource($filterGroup)
            ], 201);
            
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to create filter group.',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Update a filter group.
     */
    public function updateFilterGroup(Request $request, FilterGroup $filterGroup): JsonResponse
    {
        $validated = $request->validate([
            'page' => ['sometimes', 'required', 'string'],
            'name' => ['sometimes', 'required', 'string', 'max:100'],
            'slug' => ['sometimes', 'required', 'string', 'max:100', 'unique:filter_groups,slug,' . $filterGroup->id],
            'data_type' => ['sometimes', 'required', Rule::in(['string', 'integer', 'decimal', 'boolean'])],
            'is_multiple' => ['boolean'],
            'is_required' => ['boolean'],
            'is_active' => ['boolean'],
            'display_order' => ['integer', 'min:0'],
            'description' => ['nullable', 'string'],
        ]);

        try {
            $updatedFilterGroup = $this->filterRepository->updateFilterGroup($filterGroup, $validated);
            
            return response()->json([
                'success' => true,
                'message' => 'Filter group updated successfully.',
                'data' => new FilterGroupResource($updatedFilterGroup)
            ]);
            
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to update filter group.',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Delete a filter group.
     */
    public function destroyFilterGroup(FilterGroup $filterGroup): JsonResponse
    {
        try {
            $this->filterRepository->deleteFilterGroup($filterGroup);
            
            return response()->json([
                'success' => true,
                'message' => 'Filter group deleted successfully.'
            ]);
            
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to delete filter group.',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Store a new filter value.
     */
    public function storeFilterValue(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'filter_group_id' => ['required', 'integer', 'exists:filter_groups,id'],
            'value' => ['required', 'string', 'max:255'],
            'label' => ['required', 'string', 'max:255'],
            'slug' => ['nullable', 'string', 'max:255'],
            'color' => ['nullable', 'string', 'max:7', 'regex:/^#[0-9A-Fa-f]{6}$/'],
            'icon' => ['nullable', 'string', 'max:100'],
            'description' => ['nullable', 'string'],
            'display_order' => ['integer', 'min:0'],
            'is_active' => ['boolean'],
            'metadata' => ['nullable', 'array'],
        ]);

        try {
            $filterValue = $this->filterRepository->createFilterValue($validated);
            
            return response()->json([
                'success' => true,
                'message' => 'Filter value created successfully.',
                'data' => new FilterValueResource($filterValue)
            ], 201);
            
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to create filter value.',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Update a filter value.
     */
    public function updateFilterValue(Request $request, FilterValue $filterValue): JsonResponse
    {
        $validated = $request->validate([
            'filter_group_id' => ['sometimes', 'required', 'integer', 'exists:filter_groups,id'],
            'value' => ['sometimes', 'required', 'string', 'max:255'],
            'label' => ['sometimes', 'required', 'string', 'max:255'],
            'slug' => ['nullable', 'string', 'max:255'],
            'color' => ['nullable', 'string', 'max:7', 'regex:/^#[0-9A-Fa-f]{6}$/'],
            'icon' => ['nullable', 'string', 'max:100'],
            'description' => ['nullable', 'string'],
            'display_order' => ['integer', 'min:0'],
            'is_active' => ['boolean'],
            'metadata' => ['nullable', 'array'],
        ]);

        try {
            $updatedFilterValue = $this->filterRepository->updateFilterValue($filterValue, $validated);
            
            return response()->json([
                'success' => true,
                'message' => 'Filter value updated successfully.',
                'data' => new FilterValueResource($updatedFilterValue)
            ]);
            
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to update filter value.',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Delete a filter value.
     */
    public function destroyFilterValue(FilterValue $filterValue): JsonResponse
    {
        try {
            $this->filterRepository->deleteFilterValue($filterValue);
            
            return response()->json([
                'success' => true,
                'message' => 'Filter value deleted successfully.'
            ]);
            
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to delete filter value.',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Bulk create filter values.
     */
    public function bulkCreateFilterValues(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'filter_group_id' => ['required', 'integer', 'exists:filter_groups,id'],
            'values' => ['required', 'array', 'min:1'],
            'values.*.value' => ['required', 'string', 'max:255'],
            'values.*.label' => ['required', 'string', 'max:255'],
            'values.*.slug' => ['nullable', 'string', 'max:255'],
            'values.*.color' => ['nullable', 'string', 'max:7', 'regex:/^#[0-9A-Fa-f]{6}$/'],
            'values.*.icon' => ['nullable', 'string', 'max:100'],
            'values.*.description' => ['nullable', 'string'],
            'values.*.display_order' => ['nullable', 'integer', 'min:0'],
            'values.*.is_active' => ['nullable', 'boolean'],
            'values.*.metadata' => ['nullable', 'array'],
        ]);

        try {
            $filterValues = $this->filterRepository->bulkCreateFilterValues(
                $validated['filter_group_id'],
                $validated['values']
            );
            
            return response()->json([
                'success' => true,
                'message' => 'Filter values created successfully.',
                'data' => FilterValueResource::collection($filterValues)
            ], 201);
            
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to create filter values.',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Search filter values.
     */
    public function searchFilterValues(Request $request): AnonymousResourceCollection
    {
        $request->validate([
            'q' => ['required', 'string', 'min:1'],
            'filter_group_id' => ['nullable', 'integer', 'exists:filter_groups,id']
        ]);

        $filterValues = $this->filterRepository->searchFilterValues(
            $request->get('q'),
            $request->get('filter_group_id')
        );
        
        return FilterValueResource::collection($filterValues);
    }

    /**
     * Reorder filter values.
     */
    public function reorderFilterValues(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'order' => ['required', 'array'],
            'order.*' => ['integer', 'exists:filter_values,id']
        ]);

        try {
            $this->filterRepository->reorderFilterValues($validated['order']);
            
            return response()->json([
                'success' => true,
                'message' => 'Filter values reordered successfully.'
            ]);
            
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to reorder filter values.',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Reorder filter groups.
     */
    public function reorderFilterGroups(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'order' => ['required', 'array'],
            'order.*' => ['integer', 'exists:filter_groups,id']
        ]);

        try {
            $this->filterRepository->reorderFilterGroups($validated['order']);
            
            return response()->json([
                'success' => true,
                'message' => 'Filter groups reordered successfully.'
            ]);
            
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to reorder filter groups.',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get filter usage statistics.
     */
    public function getUsageStats(Request $request): JsonResponse
    {
        $filterGroupId = $request->get('filter_group_id');
        $stats = $this->filterRepository->getFilterUsageStats($filterGroupId);
        
        return response()->json([
            'success' => true,
            'data' => $stats
        ]);
    }
}
