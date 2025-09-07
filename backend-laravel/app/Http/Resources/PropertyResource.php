<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class PropertyResource extends JsonResource
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
            'title' => $this->title,
            'slug' => $this->slug,
            'description' => $this->description,
            
            // Pricing
            'price' => [
                'value' => $this->price,
                'formatted' => $this->formatted_price,
                'type' => $this->price_type,
            ],
            
            // Property details
            'bedrooms' => $this->bedrooms,
            'bathrooms' => $this->bathrooms,
            'half_bathrooms' => $this->half_bathrooms,
            'square_footage' => $this->square_footage,
            'lot_size' => $this->lot_size,
            'year_built' => $this->year_built,
            'floors' => $this->floors,
            
            // Financial details
            'hoa_fees' => $this->hoa_fees,
            'property_tax' => $this->property_tax,
            
            // Location
            'location' => [
                'address' => $this->address,
                'city' => $this->city,
                'state' => $this->state,
                'zip_code' => $this->zip_code,
                'country' => $this->country,
                'neighborhood' => $this->neighborhood,
                'full_address' => $this->full_address,
                'coordinates' => [
                    'latitude' => $this->latitude,
                    'longitude' => $this->longitude,
                ],
            ],
            
            // Agent information
            'agent' => $this->agent_info,
            
            // Specifications (heating, cooling, parking, etc.)
            'specifications' => $this->specifications,
            
            // Media (images, virtual tour)
            'media' => [
                'images' => $this->media['images'] ?? [],
                'virtual_tour' => $this->media['virtual_tour'] ?? null,
                'primary_image' => $this->media['images'][0] ?? null,
            ],
            
            // Marketing settings
            'marketing' => $this->marketing_settings,
            
            // Filters (dynamic filter values)
            'filters' => FilterValueResource::collection($this->whenLoaded('filterValues')),
            'filters_grouped' => $this->when($this->relationLoaded('filterValues'), function () {
                return $this->filterValues->groupBy('filterGroup.slug')->map(function ($values) {
                    return FilterValueResource::collection($values);
                });
            }),
            
            // Meta information
            'status' => [
                'is_active' => $this->is_active,
                'is_featured' => $this->is_featured,
                'published_at' => $this->published_at?->toISOString(),
            ],
            
            // Relationships
            'creator' => new UserResource($this->whenLoaded('creator')),
            'updater' => new UserResource($this->whenLoaded('updater')),
            
            // Timestamps
            'created_at' => $this->created_at->toISOString(),
            'updated_at' => $this->updated_at->toISOString(),
        ];
    }

    /**
     * Get additional data that should be returned with the resource array.
     *
     * @return array<string, mixed>
     */
    public function with(Request $request): array
    {
        return [
            'meta' => [
                'version' => '1.0',
                'generated_at' => now()->toISOString(),
            ],
        ];
    }
}
