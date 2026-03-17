import { Link } from 'react-router-dom'
import { ArrowRight, MapPin, Shield, Clock, Heart } from 'lucide-react'
import Hero from '../../components/website/Hero'

const features = [
  {
    icon: Shield,
    title: 'Secure Transactions',
    description: 'Verified properties and secure payment processing for your peace of mind.',
  },
  {
    icon: Clock,
    title: '24/7 Support',
    description: 'Round-the-clock customer support to assist you with any queries.',
  },
  {
    icon: MapPin,
    title: 'Prime Locations',
    description: 'Properties in the most desirable locations across Afghanistan.',
  },
  {
    icon: Heart,
    title: 'Trusted by Many',
    description: 'Over 200+ happy clients who found their perfect property with us.',
  },
]

export default function HomePage() {
  return (
    <div>
      <Hero />

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Why Choose Domio?</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              We provide the best real estate services in Afghanistan, making your property search simple and enjoyable.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="text-center p-6 rounded-2xl bg-gray-50 hover:bg-primary/5 transition-colors">
                <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <feature.icon className="w-7 h-7 text-primary" />
                </div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-primary">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to Find Your Dream Home?</h2>
          <p className="text-gray-300 mb-8 text-lg">
            Join hundreds of satisfied clients who found their perfect property with Domio.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/contact"
              className="bg-white text-primary px-8 py-3 rounded-xl font-semibold hover:bg-gray-100 transition-colors"
            >
              Contact Us
            </Link>
            <Link
              to="/signin"
              className="border-2 border-white text-white px-8 py-3 rounded-xl font-semibold hover:bg-white/10 transition-colors"
            >
              Agent Portal
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
