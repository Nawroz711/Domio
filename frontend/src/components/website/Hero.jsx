import { Search, MapPin } from 'lucide-react'

export default function Hero() {
  return (
    <div className="relative min-h-[600px]">
      {/* Background Image with Overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ 
          backgroundImage: 'url(https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=1920&h=1080&fit=crop)',
        }}
      >
        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-primary/70"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
        <div className="text-center">
          {/* Tagline */}
          <p className="text-accent font-semibold tracking-wide uppercase mb-4">
            Find Your Perfect Space
          </p>
          
          {/* Main Heading */}
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
            Discover Your
            <span className="text-accent"> Dream Home</span>
          </h1>
          
          <p className="text-xl text-gray-200 max-w-2xl mx-auto mb-10">
            Find the perfect property for you and your family. From apartments to homes, we help you discover the ideal space to create lasting memories.
          </p>

          {/* Search Box */}
          <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-xl p-4 mb-12">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Enter location, city, or neighborhood..."
                  className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                />
              </div>
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <select className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary appearance-none bg-white">
                  <option value="">All Types</option>
                  <option value="apartment">Apartment</option>
                  <option value="home">Home</option>
                  <option value="shop">Shop</option>
                </select>
              </div>
              <button className="bg-accent hover:bg-accent-600 text-white px-8 py-3 rounded-xl font-semibold transition-colors flex items-center justify-center gap-2">
                <Search className="w-5 h-5" />
                Search
              </button>
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
          {[
            { number: '500+', label: 'Properties' },
            { number: '200+', label: 'Happy Clients' },
            { number: '50+', label: 'Expert Agents' },
            { number: '10+', label: 'Cities' },
          ].map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-white mb-2">{stat.number}</div>
              <div className="text-gray-300">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
