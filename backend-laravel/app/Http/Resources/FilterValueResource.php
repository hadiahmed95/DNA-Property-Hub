<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class FilterValueResource extends JsonResource
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
            'value' => $this->value,
            'label' => $this->label,
            'slug' => $this->slug,
            'color' => $this->color,
            'icon' => $this->icon,
            'description' => $this->description,
            'display_order' => $this->display_order,
            'is_active' => $this->is_active,
            'metadata' => $this->metadata,
            
            // Filter group information
            'filter_group' => [
                'id' => $this->whenLoaded('filterGroup', fn () => $this->filterGroup->id),
                'name' => $this->whenLoaded('filterGroup', fn () => $this->filterGroup->name),
                'slug' => $this->whenLoaded('filterGroup', fn () => $this->filterGroup->slug),
                'page' => $this->whenLoaded('filterGroup', fn () => $this->filterGroup->page),
                'data_type' => $this->whenLoaded('filterGroup', fn () => $this->filterGroup->data_type),
                'is_multiple' => $this->whenLoaded('filterGroup', fn () => $this->filterGroup->is_multiple),
            ],
            
            // Usage count if available
            'properties_count' => $this->when(isset($this->properties_count), $this->properties_count),
            
            // Timestamps
            'created_at' => $this->created_at->toISOString(),
            'updated_at' => $this->updated_at->toISOString(),
        ];
    }
}
