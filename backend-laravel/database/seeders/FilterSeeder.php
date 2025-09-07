<?php

namespace Database\Seeders;

use App\Models\FilterGroup;
use App\Models\FilterValue;
use Illuminate\Database\Seeder;

class FilterSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Property Type Filter Group
        $propertyTypeGroup = FilterGroup::create([
            'page' => 'properties',
            'name' => 'Property Type',
            'slug' => 'property_type',
            'data_type' => 'string',
            'is_multiple' => false,
            'is_required' => true,
            'is_active' => true,
            'display_order' => 1,
            'description' => 'Type of property (House, Apartment, etc.)'
        ]);

        $propertyTypes = [
            ['value' => 'house', 'label' => 'Single Family House', 'color' => '#10B981'],
            ['value' => 'apartment', 'label' => 'Apartment', 'color' => '#3B82F6'],
            ['value' => 'condo', 'label' => 'Condominium', 'color' => '#8B5CF6'],
            ['value' => 'townhouse', 'label' => 'Townhouse', 'color' => '#F59E0B'],
            ['value' => 'villa', 'label' => 'Villa', 'color' => '#EF4444'],
            ['value' => 'penthouse', 'label' => 'Penthouse', 'color' => '#F97316'],
            ['value' => 'commercial', 'label' => 'Commercial', 'color' => '#6B7280'],
            ['value' => 'land', 'label' => 'Land/Lot', 'color' => '#84CC16']
        ];

        foreach ($propertyTypes as $index => $type) {
            FilterValue::create([
                'filter_group_id' => $propertyTypeGroup->id,
                'value' => $type['value'],
                'label' => $type['label'],
                'slug' => $type['value'],
                'color' => $type['color'],
                'display_order' => $index,
                'is_active' => true
            ]);
        }

        // Property Status Filter Group
        $statusGroup = FilterGroup::create([
            'page' => 'properties',
            'name' => 'Status',
            'slug' => 'property_status',
            'data_type' => 'string',
            'is_multiple' => false,
            'is_required' => true,
            'is_active' => true,
            'display_order' => 2,
            'description' => 'Current status of the property'
        ]);

        $statuses = [
            ['value' => 'for_sale', 'label' => 'For Sale', 'color' => '#10B981'],
            ['value' => 'for_rent', 'label' => 'For Rent', 'color' => '#3B82F6'],
            ['value' => 'sold', 'label' => 'Sold', 'color' => '#6B7280'],
            ['value' => 'pending', 'label' => 'Pending', 'color' => '#F59E0B'],
            ['value' => 'off_market', 'label' => 'Off Market', 'color' => '#EF4444']
        ];

        foreach ($statuses as $index => $status) {
            FilterValue::create([
                'filter_group_id' => $statusGroup->id,
                'value' => $status['value'],
                'label' => $status['label'],
                'slug' => $status['value'],
                'color' => $status['color'],
                'display_order' => $index,
                'is_active' => true
            ]);
        }

        // Features Filter Group
        $featuresGroup = FilterGroup::create([
            'page' => 'properties',
            'name' => 'Features',
            'slug' => 'property_features',
            'data_type' => 'string',
            'is_multiple' => true,
            'is_required' => false,
            'is_active' => true,
            'display_order' => 3,
            'description' => 'Property features and amenities'
        ]);

        $features = [
            ['value' => 'pool', 'label' => 'Swimming Pool', 'icon' => 'pool'],
            ['value' => 'garage', 'label' => 'Garage', 'icon' => 'garage'],
            ['value' => 'garden', 'label' => 'Garden', 'icon' => 'garden'],
            ['value' => 'balcony', 'label' => 'Balcony', 'icon' => 'balcony'],
            ['value' => 'fireplace', 'label' => 'Fireplace', 'icon' => 'fireplace'],
            ['value' => 'gym', 'label' => 'Gym/Fitness Center', 'icon' => 'gym'],
            ['value' => 'security', 'label' => '24/7 Security', 'icon' => 'security'],
            ['value' => 'elevator', 'label' => 'Elevator', 'icon' => 'elevator'],
            ['value' => 'air_conditioning', 'label' => 'Air Conditioning', 'icon' => 'ac'],
            ['value' => 'central_heating', 'label' => 'Central Heating', 'icon' => 'heating'],
            ['value' => 'walk_in_closet', 'label' => 'Walk-in Closet', 'icon' => 'closet'],
            ['value' => 'laundry_room', 'label' => 'Laundry Room', 'icon' => 'laundry']
        ];

        foreach ($features as $index => $feature) {
            FilterValue::create([
                'filter_group_id' => $featuresGroup->id,
                'value' => $feature['value'],
                'label' => $feature['label'],
                'slug' => $feature['value'],
                'icon' => $feature['icon'] ?? null,
                'display_order' => $index,
                'is_active' => true
            ]);
        }

        // Amenities Filter Group
        $amenitiesGroup = FilterGroup::create([
            'page' => 'properties',
            'name' => 'Amenities',
            'slug' => 'property_amenities',
            'data_type' => 'string',
            'is_multiple' => true,
            'is_required' => false,
            'is_active' => true,
            'display_order' => 4,
            'description' => 'Building and community amenities'
        ]);

        $amenities = [
            ['value' => 'concierge', 'label' => 'Concierge Service'],
            ['value' => 'spa', 'label' => 'Spa & Wellness'],
            ['value' => 'tennis_court', 'label' => 'Tennis Court'],
            ['value' => 'playground', 'label' => 'Children\'s Playground'],
            ['value' => 'business_center', 'label' => 'Business Center'],
            ['value' => 'conference_room', 'label' => 'Conference Room'],
            ['value' => 'rooftop_terrace', 'label' => 'Rooftop Terrace'],
            ['value' => 'barbecue_area', 'label' => 'BBQ Area'],
            ['value' => 'storage_unit', 'label' => 'Storage Unit'],
            ['value' => 'bike_storage', 'label' => 'Bike Storage'],
            ['value' => 'pet_friendly', 'label' => 'Pet Friendly'],
            ['value' => 'guest_parking', 'label' => 'Guest Parking']
        ];

        foreach ($amenities as $index => $amenity) {
            FilterValue::create([
                'filter_group_id' => $amenitiesGroup->id,
                'value' => $amenity['value'],
                'label' => $amenity['label'],
                'slug' => $amenity['value'],
                'display_order' => $index,
                'is_active' => true
            ]);
        }

        // Utilities Filter Group
        $utilitiesGroup = FilterGroup::create([
            'page' => 'properties',
            'name' => 'Utilities',
            'slug' => 'property_utilities',
            'data_type' => 'string',
            'is_multiple' => true,
            'is_required' => false,
            'is_active' => true,
            'display_order' => 5,
            'description' => 'Available utilities and services'
        ]);

        $utilities = [
            ['value' => 'electricity', 'label' => 'Electricity'],
            ['value' => 'gas', 'label' => 'Natural Gas'],
            ['value' => 'water', 'label' => 'Water'],
            ['value' => 'sewer', 'label' => 'Sewer'],
            ['value' => 'internet', 'label' => 'High-Speed Internet'],
            ['value' => 'cable_tv', 'label' => 'Cable TV'],
            ['value' => 'trash_collection', 'label' => 'Trash Collection'],
            ['value' => 'recycling', 'label' => 'Recycling Service']
        ];

        foreach ($utilities as $index => $utility) {
            FilterValue::create([
                'filter_group_id' => $utilitiesGroup->id,
                'value' => $utility['value'],
                'label' => $utility['label'],
                'slug' => $utility['value'],
                'display_order' => $index,
                'is_active' => true
            ]);
        }

        // Location/City Filter Group
        $locationGroup = FilterGroup::create([
            'page' => 'properties',
            'name' => 'City',
            'slug' => 'property_city',
            'data_type' => 'string',
            'is_multiple' => false,
            'is_required' => false,
            'is_active' => true,
            'display_order' => 6,
            'description' => 'Property location by city'
        ]);

        $cities = [
            ['value' => 'new_york', 'label' => 'New York, NY'],
            ['value' => 'los_angeles', 'label' => 'Los Angeles, CA'],
            ['value' => 'chicago', 'label' => 'Chicago, IL'],
            ['value' => 'houston', 'label' => 'Houston, TX'],
            ['value' => 'phoenix', 'label' => 'Phoenix, AZ'],
            ['value' => 'philadelphia', 'label' => 'Philadelphia, PA'],
            ['value' => 'san_antonio', 'label' => 'San Antonio, TX'],
            ['value' => 'san_diego', 'label' => 'San Diego, CA'],
            ['value' => 'dallas', 'label' => 'Dallas, TX'],
            ['value' => 'austin', 'label' => 'Austin, TX'],
            ['value' => 'miami', 'label' => 'Miami, FL'],
            ['value' => 'seattle', 'label' => 'Seattle, WA']
        ];

        foreach ($cities as $index => $city) {
            FilterValue::create([
                'filter_group_id' => $locationGroup->id,
                'value' => $city['value'],
                'label' => $city['label'],
                'slug' => $city['value'],
                'display_order' => $index,
                'is_active' => true
            ]);
        }
    }
}
