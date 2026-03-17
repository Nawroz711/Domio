export default function AboutPage() {
  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Page Header */}
      <div className="bg-primary py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-white mb-2">About Domio</h1>
          <p className="text-gray-300">Learn more about our mission and vision</p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-2xl shadow-md p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Our Story</h2>
          <p className="text-gray-600 mb-6">
            Domio was founded with a simple mission: to make finding the perfect property in Afghanistan as easy and stress-free as possible. We understand that buying or renting a property is one of the most important decisions in anyone's life, and we're here to guide you every step of the way.
          </p>
          
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Our Mission</h2>
          <p className="text-gray-600 mb-6">
            To provide a transparent, efficient, and trustworthy platform that connects property seekers with their dream homes while supporting property owners in reaching the right audience.
          </p>
          
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Why Choose Us?</h2>
          <ul className="space-y-3 text-gray-600">
            <li>• Verified property listings</li>
            <li>• Professional agents</li>
            <li>• Secure transactions</li>
            <li>• 24/7 customer support</li>
            <li>• Wide range of properties</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
