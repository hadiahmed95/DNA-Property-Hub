<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class FilterGroupResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'page' => $this->page,
            'name' => $this->name,
            'slug' => $this->slug,
            'data_type' => $this->data_type,
            'is_multiple' => $this->is_multiple,
            'is_required' => $this->is_required,
            'is_active' => $this->is_active,
            'display_order' => $this->display_order,
            'description' => $this->description,
            
            // Filter values
            'filter_values' => FilterValueResource::collection($this->whenLoaded('filterValues')),
            'active_filter_values' => FilterValueResource::collection($this->whenLoaded('activeFilterValues')),
            
            // Counts
            'values_count' => $this->when($this->relationLoaded('filterValues'), fn () => $this->filterValues->count()),
            'active_values_count' => $this->when($this->relationLoaded('activeFilterValues'), fn () => $this->activeFilterValues->count()),
            
            // Timestamps
            'created_at' => $this->created_at->toISOString(),
            'updated_at' => $this->updated_at->toISOString(),
        ];
    }
}
