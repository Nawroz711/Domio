import PropertyWizard from '../../components/property/PropertyWizard'

const Create = () => {
  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-6">
        <h4 className="text-xl font-bold text-gray-800">Register a Property</h4>
        <p className="text-gray-600 text-sm">Fill in the details to list a new property</p>
      </div>
      <PropertyWizard />
    </div>
  )
}

export default Create
