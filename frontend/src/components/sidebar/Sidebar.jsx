import { useState } from 'react'
import {
  User, LogIn, UserPlus, Settings, Compass, Bookmark, History, MapPin, X, Menu,
  ArrowRight, Eye, EyeOff, Building2, Share2, Map, Route, Phone, HelpCircle
} from 'lucide-react'

export default function Sidebar({ isOpen, onToggle }) {
  const [showDialog, setShowDialog] = useState(false)
  const [dialogType, setDialogType] = useState('signin') // 'signin' or 'signup'
  const [showPassword, setShowPassword] = useState(false)

  const openSignIn = () => {
    setDialogType('signin')
    setShowDialog(true)
  }

  const openSignUp = () => {
    setDialogType('signup')
    setShowDialog(true)
  }

  const closeDialog = () => {
    setShowDialog(false)
  }

  return (
    <>
      <div className={`${isOpen ? 'w-64' : 'w-16'} h-full bg-white shadow-xl flex flex-col flex-shrink-0 transition-all duration-300 ease-out overflow-hidden z-[1000]`}>
        {/* Header */}
        <div className="p-3 border-b border-gray-100 flex items-center justify-between">
          {isOpen && (
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-green-400 to-green-600 rounded-lg flex items-center justify-center">
                <MapPin className="w-4 h-4 text-white" />
              </div>
              <span className="text-lg font-bold text-gray-800">Maseer</span>
            </div>
          )}
          <button
            onClick={onToggle}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
          >
            {isOpen ? <X className="w-4 h-4 text-gray-500" /> : <Menu className="w-4 h-4 text-gray-700" />}
          </button>
        </div>

        {/* Expanded Content */}
        {isOpen && (
          <div className="flex-1 overflow-y-auto p-3">
            {/* Navigation Section */}
            <div className="space-y-1">
              <button className=" cursor-pointer w-full flex items-center gap-3 px-3 py-2.5 hover:bg-gray-100 rounded-lg transition-colors text-gray-700">
                <Compass className="w-5 h-5 text-gray-500" strokeWidth={1.25} />
                <span className="font-light text-sm">Explore</span>
              </button>
              <button className=" cursor-pointer w-full flex items-center gap-3 px-3 py-2.5 hover:bg-gray-100 rounded-lg transition-colors text-gray-700">
                <Map className="w-5 h-5 text-gray-500" strokeWidth={1.25} />
                <span className="font-light text-sm">Directions</span>
              </button>
              <button className=" cursor-pointer w-full flex items-center gap-3 px-3 py-2.5 hover:bg-gray-100 rounded-lg transition-colors text-gray-700">
                <Route className="w-5 h-5 text-gray-500" strokeWidth={1.25} />
                <span className="font-light text-sm">Routes</span>
              </button>
              <button className=" cursor-pointer w-full flex items-center gap-3 px-3 py-2.5 hover:bg-gray-100 rounded-lg transition-colors text-gray-700">
                <Bookmark className="w-5 h-5 text-gray-500" strokeWidth={1.25} />
                <span className="font-light text-sm">Saved Places</span>
              </button>
              <button className=" cursor-pointer w-full flex items-center gap-3 px-3 py-2.5 hover:bg-gray-100 rounded-lg transition-colors text-gray-700">
                <History className="w-5 h-5 text-gray-500" strokeWidth={1.25} />
                <span className="font-light text-sm">Recent</span>
              </button>
              <button className=" cursor-pointer w-full flex items-center gap-3 px-3 py-2.5 hover:bg-gray-100 rounded-lg transition-colors text-gray-700">
                <Building2 className="w-5 h-5 text-gray-500" strokeWidth={1.25} />
                <span className="font-light text-sm">My Business</span>
              </button>
              <button className=" cursor-pointer w-full flex items-center gap-3 px-3 py-2.5 hover:bg-gray-100 rounded-lg transition-colors text-gray-700">
                <Share2 className="w-5 h-5 text-gray-500" strokeWidth={1.25} />
                <span className="font-light text-sm">Share Location</span>
              </button>
            </div>

          </div>
        )}

        {/* Mini State Icons */}
        {!isOpen && (
          <div className="flex-1 flex flex-col items-center py-4 gap-2">
            <button className="cursor-pointer p-2.5 hover:bg-gray-100 rounded-xl transition-colors" title="Explore">
              <Compass className="w-5 h-5 text-gray-600" strokeWidth={1.25} />
            </button>
            <button className="cursor-pointer p-2.5 hover:bg-gray-100 rounded-xl transition-colors" title="Directions">
              <Map className="w-5 h-5 text-gray-600" strokeWidth={1.25} />
            </button>
            <button className=" cursor-pointer p-2.5 hover:bg-gray-100 rounded-xl transition-colors" title="Routes">
              <Route className="w-5 h-5 text-gray-600" strokeWidth={1.25} />
            </button>
            <button className=" cursor-pointer p-2.5 hover:bg-gray-100 rounded-xl transition-colors" title="Saved Places">
              <Bookmark className="w-5 h-5 text-gray-600" strokeWidth={1.25} />
            </button>
            <button className=" cursor-pointer p-2.5 hover:bg-gray-100 rounded-xl transition-colors" title="Recent">
              <History className="w-5 h-5 text-gray-600" strokeWidth={1.25} />
            </button>
            <button className=" cursor-pointer p-2.5 hover:bg-gray-100 rounded-xl transition-colors" title="My Business">
              <Building2 className="w-5 h-5 text-gray-600" strokeWidth={1.25} />
            </button>
            <button className="cursor-pointer p-2.5 hover:bg-gray-100 rounded-xl transition-colors" title="Share Location">
              <Share2 className="w-5 h-5 text-gray-600" strokeWidth={1.25} />
            </button>
          </div>
        )}

        {/* Bottom Buttons - Sign In / Sign Up */}
        {isOpen && (
          <div className="p-3 border-t border-gray-100 space-y-2">
            <button
              onClick={openSignIn}
              className="w-full flex items-center justify-between px-4 py-2.5 bg-green-500 hover:bg-green-600 text-white rounded-lg cursor-pointer transition-colors text-sm"
            >
              <span className='mx-auto block'>Sign In</span>
            </button>
            <button
              onClick={openSignUp}
              className="w-full flex items-center justify-between px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl transition-colors text-sm cursor-pointer"
            >
              <span className='mx-auto block'>Sign Up</span>
            </button>
          </div>
        )}
      </div>

      {/* Dialog Overlay */}
      {showDialog && (
        <div className="fixed inset-0 z-[2000] flex items-center justify-center">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={closeDialog}
          />

          {/* Dialog Content */}
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 p-6 max-h-[90vh] overflow-y-auto">
            <button
              onClick={closeDialog}
              className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>

            {dialogType === 'signin' ? (
              /* Sign In Form */
              <div>
                <div className="flex items-center gap-2 mb-6">
                  <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-green-600 rounded-lg flex items-center justify-center">
                    <MapPin className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-2xl font-bold text-gray-800">Maseer</span>
                </div>

                <h2 className="text-xl font-semibold text-gray-800 mb-2">Welcome back</h2>
                <p className="text-gray-500 mb-6">Sign in to continue</p>

                <form className="space-y-4">
                  <div>
                    <label className="block text-sm font-light text-gray-700 mb-1.5">
                      Email
                    </label>
                    <input
                      type="email"
                      className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 text-gray-700"
                      placeholder="you@example.com"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-light text-gray-700 mb-1.5">
                      Password
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        className="w-full px-4 py-2.5 pr-11 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 text-gray-700"
                        placeholder="Enter your password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 bg-green-500 hover:bg-green-600 text-white rounded-lg font-light transition-colors"
                  >
                    Sign In
                  </button>
                </form>

                <p className="mt-6 text-center text-gray-500">
                  Don't have an account?{' '}
                  <button
                    onClick={() => setDialogType('signup')}
                    className="text-green-600 font-light hover:underline"
                  >
                    Sign up
                  </button>
                </p>
              </div>
            ) : (
              /* Sign Up Form */
              <div>
                <div className="flex items-center gap-2 mb-6">
                  <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-green-600 rounded-lg flex items-center justify-center">
                    <MapPin className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-2xl font-bold text-gray-800">Maseer</span>
                </div>

                <h2 className="text-xl font-semibold text-gray-800 mb-2">Create account</h2>
                <p className="text-gray-500 mb-6">Join Maseer today</p>

                <form className="space-y-4">
                  <div>
                    <label className="block text-sm font-light text-gray-700 mb-1.5">
                      Full Name
                    </label>
                    <input
                      type="text"
                      className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 text-gray-700"
                      placeholder="Enter your full name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-light text-gray-700 mb-1.5">
                      Email
                    </label>
                    <input
                      type="email"
                      className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 text-gray-700"
                      placeholder="you@example.com"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-light text-gray-700 mb-1.5">
                      Phone
                    </label>
                    <input
                      type="tel"
                      className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 text-gray-700"
                      placeholder="+93700111222"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-light text-gray-700 mb-1.5">
                      Password
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        className="w-full px-4 py-2.5 pr-11 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 text-gray-700"
                        placeholder="Minimum 8 characters"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 bg-green-500 hover:bg-green-600 text-white rounded-lg font-light transition-colors"
                  >
                    Sign Up
                  </button>
                </form>

                <p className="mt-6 text-center text-gray-500">
                  Already have an account?{' '}
                  <button
                    onClick={() => setDialogType('signin')}
                    className="text-green-600 font-light hover:underline"
                  >
                    Sign in
                  </button>
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  )
}
