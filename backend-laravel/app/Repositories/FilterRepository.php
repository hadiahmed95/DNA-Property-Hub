<?php

namespace App\Repositories;

use App\Models\FilterGroup;
use App\Models\FilterValue;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Support\Facades\DB;

class FilterRepository
{
    /**
     * Get all filter groups for a page.
     */
    public function getFilterGroupsForPage(string $page): Collection
    {
        return FilterGroup::with(['activeFilterValues'])
            ->forPage($page)
            ->active()
            ->ordered()
            ->get();
    }

    /**
     * Get filter group by ID with values.
     */
    public function getFilterGroupById(int $id): ?FilterGroup
    {
        return FilterGroup::with(['filterValues'])->find($id);
    }

    /**
     * Create a new filter group.
     */
    public function createFilterGroup(array $data): FilterGroup
    {
        return FilterGroup::create($data);
    }

    /**
     * Update a filter group.
     */
    public function updateFilterGroup(FilterGroup $filterGroup, array $data): FilterGroup
    {
        $filterGroup->update($data);
        return $filterGroup->fresh();
    }

    /**
     * Delete a filter group.
     */
    public function deleteFilterGroup(FilterGroup $filterGroup): bool
    {
        return DB::transaction(function () use ($filterGroup) {
            // Delete related property filters
            DB::table('property_filters')->where('filter_group_id', $filterGroup->id)->delete();
            
            // Delete filter values
            $filterGroup->filterValues()->delete();
            
            // Delete the filter group
            return $filterGroup->delete();
        });
    }

    /**
     * Get filter values by group ID.
     */
    public function getFilterValuesByGroup(int $filterGroupId): Collection
    {
        return FilterValue::where('filter_group_id', $filterGroupId)
            ->active()
            ->ordered()
            ->get();
    }

    /**
     * Get filter value by ID.
     */
    public function getFilterValueById(int $id): ?FilterValue
    {
        return FilterValue::with(['filterGroup'])->find($id);
    }

    /**
     * Create a new filter value.
     */
    public function createFilterValue(array $data): FilterValue
    {
        return FilterValue::create($data);
    }

    /**
     * Update a filter value.
     */
    public function updateFilterValue(FilterValue $filterValue, array $data): FilterValue
    {
        $filterValue->update($data);
        return $filterValue->fresh();
    }

    /**
     * Delete a filter value.
     */
    public function deleteFilterValue(FilterValue $filterValue): bool
    {
        return DB::transaction(function () use ($filterValue) {
            // Delete related property filters
            DB::table('property_filters')->where('filter_value_id', $filterValue->id)->delete();
            
            // Delete the filter value
            return $filterValue->delete();
        });
    }

    /**
     * Bulk create filter values for a group.
     */
    public function bulkCreateFilterValues(int $filterGroupId, array $values): Collection
    {
        $filterValues = collect();

        foreach ($values as $index => $value) {
            $filterValues->push(FilterValue::create([
                'filter_group_id' => $filterGroupId,
                'value' => $value['value'],
                'label' => $value['label'] ?? $value['value'],
                'slug' => $value['slug'] ?? null,
                'color' => $value['color'] ?? null,
                'icon' => $value['icon'] ?? null,
                'description' => $value['description'] ?? null,
                'display_order' => $value['display_order'] ?? $index,
                'is_active' => $value['is_active'] ?? true,
                'metadata' => $value['metadata'] ?? null,
            ]));
        }

        return $filterValues;
    }

    /**
     * Get filter values with property counts.
     */
    public function getFilterValuesWithCounts(string $page): Collection
    {
        return FilterValue::select('filter_values.*')
            ->selectRaw('COUNT(property_filters.id) as properties_count')
            ->join('filter_groups', 'filter_values.filter_group_id', '=', 'filter_groups.id')
            ->leftJoin('property_filters', 'filter_values.id', '=', 'property_filters.filter_value_id')
            ->leftJoin('properties', function ($join) {
                $join->on('property_filters.property_id', '=', 'properties.id')
                     ->where('properties.is_active', true)
                     ->whereNotNull('properties.published_at');
            })
            ->where('filter_groups.page', $page)
            ->where('filter_groups.is_active', true)
            ->where('filter_values.is_active', true)
            ->groupBy('filter_values.id')
            ->orderBy('filter_groups.display_order')
            ->orderBy('filter_values.display_order')
            ->get();
    }

    /**
     * Search filter values.
     */
    public function searchFilterValues(string $query, int $filterGroupId = null): Collection
    {
        $searchQuery = FilterValue::where(function ($q) use ($query) {
            $q->where('value', 'like', "%{$query}%")
              ->orWhere('label', 'like', "%{$query}%");
        });

        if ($filterGroupId) {
            $searchQuery->where('filter_group_id', $filterGroupId);
        }

        return $searchQuery->active()->ordered()->get();
    }

    /**
     * Reorder filter values.
     */
    public function reorderFilterValues(array $orderData): bool
    {
        return DB::transaction(function () use ($orderData) {
            foreach ($orderData as $order => $filterValueId) {
                FilterValue::where('id', $filterValueId)
                    ->update(['display_order' => $order]);
            }
            return true;
        });
    }

    /**
     * Reorder filter groups.
     */
    public function reorderFilterGroups(array $orderData): bool
    {
        return DB::transaction(function () use ($orderData) {
            foreach ($orderData as $order => $filterGroupId) {
                FilterGroup::where('id', $filterGroupId)
                    ->update(['display_order' => $order]);
            }
            return true;
        });
    }

    /**
     * Get filter usage statistics.
     */
    public function getFilterUsageStats(int $filterGroupId = null): array
    {
        $query = DB::table('property_filters')
            ->select('filter_value_id', DB::raw('COUNT(*) as usage_count'))
            ->join('filter_values', 'property_filters.filter_value_id', '=', 'filter_values.id')
            ->join('properties', 'property_filters.property_id', '=', 'properties.id')
            ->where('properties.is_active', true)
            ->whereNotNull('properties.published_at');

        if ($filterGroupId) {
            $query->where('filter_values.filter_group_id', $filterGroupId);
        }

        return $query->groupBy('filter_value_id')
            ->orderBy('usage_count', 'desc')
            ->get()
            ->toArray();
    }
}
