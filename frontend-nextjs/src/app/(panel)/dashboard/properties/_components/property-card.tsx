import { MontserratFont } from "@/app/fonts"
import Button from "@/components/button"
import Card from "@/components/card"
import { Property } from "@/types/properties"
import { EditIcon, EyeIcon, TrashIcon } from "lucide-react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import propertyService from "@/services/property.service"

type PropertyCardProps = {
  property: Property
  loadProperties: () => void
}

const PropertyCard = ({ property, loadProperties }: PropertyCardProps) => {

  const router = useRouter()

  const formatPrice = (property: Property) => {
      return property.price?.formatted || `$${property.price?.value?.toLocaleString()}` || 'Price not available'
  }

  const getPropertyImage = (property: Property) => {
      return property.media?.primary_image || property.media?.images?.[0] || '/images/banner-1.jpg'
  }

  const handleViewProperty = (property: Property) => {
      router.push(`/properties/${property.slug || property.id}`)
    }
  
    const handleEditProperty = (property: Property) => {
      router.push(`/dashboard/properties/edit/${property.id}`)
    }
  
    const handleDeleteProperty = async (propertyId: number) => {
      if (!confirm('Are you sure you want to delete this property?')) return
  
      try {
        const response = await propertyService.deleteProperty(propertyId)
        if (response.success) {
          loadProperties()
        }
      } catch (error) {
        console.error('Delete failed:', error)
        alert('Failed to delete property')
      }
    }

  return (
  <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
    <div className="relative h-48 w-full">
      <Image
        src={getPropertyImage(property)}
        alt={property.title}
        fill
        className="object-cover"
      />
      <div className="absolute top-3 left-3">
        <span className={`px-2 py-1 text-xs font-medium rounded-full ${property.price?.type === 'sale'
            ? 'bg-green-100 text-green-800'
            : 'bg-blue-100 text-blue-800'
          }`}>
          {property.price?.type === 'sale' ? 'For Sale' : 'For Rent'}
        </span>
      </div>
      {property.status?.is_featured && (
        <div className="absolute top-3 right-3">
          <span className="px-2 py-1 text-xs font-medium rounded-full bg-yellow-100 text-yellow-800">
            Featured
          </span>
        </div>
      )}
    </div>

    <div className="pt-4">
      <div className="mb-3">
        <h3 className={`font-semibold text-lg text-gray-900 mb-1 ${MontserratFont.className}`}>
          {property.title}
        </h3>
        <p className="text-sm text-gray-600 mb-2">
          {property.location?.full_address}
        </p>
        <p className="text-xl font-bold text-[var(--primary)]">
          {formatPrice(property)}
        </p>
      </div>

      <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
        <div className="flex items-center space-x-4">
          <span>{property.bedrooms || 0} beds</span>
          <span>{property.bathrooms || 0} baths</span>
          <span>{property.square_footage || 0} sqft</span>
        </div>
      </div>

      <div className="mb-4 pb-4 border-b border-gray-100">
        <p className="text-sm text-gray-600">
          Agent: <span className="font-medium">{property.agent?.name}</span>
        </p>
      </div>

      <div className="flex flex-wrap gap-2 items-center justify-between space-x-2">
        <div className="flex space-x-2 flex-1">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleViewProperty(property)}
            className="w-full"
            icon={<EyeIcon className="w-4 h-4" />}
          >
            View
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleEditProperty(property)}
            className="flex-1"
            icon={<EditIcon className="w-4 h-4" />}
          >
            Edit
          </Button>
        </div>
        <Button
          variant="dark"
          size="sm"
          onClick={() => handleDeleteProperty(property.id)}
          className='w-full'
        >
          <TrashIcon className="w-5 h-5" />
        </Button>
      </div>
    </div>
  </Card>
)
}

export default PropertyCard