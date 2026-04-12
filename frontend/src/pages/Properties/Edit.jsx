import PropertyWizard from '../../components/property/PropertyWizard'
import { useParams } from 'react-router-dom'

const Edit = () => {
  const { propertyId } = useParams()

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-6">
        <h4 className="text-xl font-bold text-gray-800">Edit Property</h4>
        <p className="text-gray-600 text-sm">Update the property details</p>
      </div>
      <PropertyWizard mode="edit" propertyId={propertyId} />
    </div>
  )
}

export default Edit