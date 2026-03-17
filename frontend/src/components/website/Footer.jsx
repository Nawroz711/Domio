import { Link } from 'react-router-dom'
import { Phone, Mail, Facebook, Twitter, Instagram, Linkedin } from 'lucide-react'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-primary text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <img src="/logo.webp" alt="Domio" className="w-24 rounded-lg" />
            </div>
            <p className="text-gray-400 mb-4">
              Your trusted partner in finding the perfect property. We make finding your dream home simple and hassle-free.
            </p>
            <div className="flex gap-4">
              <a href="#" className="hover:text-accent transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="hover:text-accent transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="hover:text-accent transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="hover:text-accent transition-colors">
                <Linkedin className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link to="/" className="hover:text-accent transition-colors">Home</Link></li>
              <li><Link to="/about" className="hover:text-accent transition-colors">About Us</Link></li>
              <li><Link to="/contact" className="hover:text-accent transition-colors">Contact</Link></li>
              <li><Link to="/signin" className="hover:text-accent transition-colors">Agent Login</Link></li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-white font-semibold mb-4">Services</h3>
            <ul className="space-y-2">
              <li><Link to="/signin" className="hover:text-accent transition-colors">Property Management</Link></li>
              <li><Link to="/signin" className="hover:text-accent transition-colors">Agent Network</Link></li>
              <li><Link to="/signin" className="hover:text-accent transition-colors">Consultation</Link></li>
              <li><Link to="/signin" className="hover:text-accent transition-colors">Investment Advisory</Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-white font-semibold mb-4">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-center gap-2">
                <span className="text-accent font-bold">📍</span>
                <span>Kabul, Afghanistan</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-5 h-5 text-accent" />
                <span>+93 700 123 456</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-5 h-5 text-accent" />
                <span>info@domio.af</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-primary-light mt-8 pt-8 text-center">
          <p>&copy; {currentYear} Domio. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
