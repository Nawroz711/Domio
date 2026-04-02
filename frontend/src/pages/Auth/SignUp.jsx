import { Eye, EyeOff } from 'lucide-react'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'

export default function SignUp() {
  const { formData, isSubmitting, handleChange, signUp } = useAuth('signup')
  const [showPassword, setShowPassword] = useState(false)

  return (
    <main className="flex min-h-screen items-center justify-center px-6 py-12">
      <section className="w-full max-w-sm">
        <Link to={'/'}>
          <img src="/logo.webp" alt="Domio" className="w-32 block mx-auto " />
        </Link>
        <p className="mt-2 text-center text-sm text-gray-500">Create your agent account</p>

        <form className="mt-8 space-y-4" onSubmit={signUp}>
          <div>
            <label htmlFor="name" className="mb-1.5 block text-sm font-normal text-gray-500">
              Full name
            </label>
            <input
              id="name"
              name="name"
              type="text"
              value={formData.name}
              onChange={handleChange}
              className="w-full rounded-sm border border-gray-300 bg-secondary px-3.5 py-2.5 text-gray-700 outline-none placeholder:text-gray-500 focus:ring-2 focus:ring-primary"
              placeholder="Enter your full name"
            />
          </div>

          <div>
            <label htmlFor="email" className="mb-1.5 block text-sm font-normal text-gray-500">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full rounded-sm border border-gray-300 bg-secondary px-3.5 py-2.5 text-gray-700 outline-none placeholder:text-gray-500  focus:ring-2 focus:ring-primary"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label htmlFor="phone" className="mb-1.5 block text-sm font-normal text-gray-500">
              Phone
            </label>
            <input
              id="phone"
              name="phone"
              type="text"
              value={formData.phone}
              onChange={handleChange}
              className="w-full rounded-sm border border-gray-300 bg-secondary px-3.5 py-2.5 text-gray-700 outline-none placeholder:text-gray-500  focus:ring-2 focus:ring-primary"
              placeholder="e.g. +93700111222"
            />
          </div>

          <div>
            <label htmlFor="password" className="mb-1.5 block text-sm font-normal text-gray-500">
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                onChange={handleChange}
                className="w-full rounded-sm border border-gray-300 bg-secondary px-3.5 py-2.5 pr-11 text-gray-700 outline-none placeholder:text-gray-500  focus:ring-2 focus:ring-primary"
                placeholder="Minimum 8 characters"
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 transition hover:text-primary"
              >
                {showPassword ? <EyeOff size={18} strokeWidth={1.8} /> : <Eye size={18} strokeWidth={1.8} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="mt-2 w-full rounded-sm bg-primary px-4 py-2.5 text-sm font-semibold text-dark  disabled:cursor-not-allowed disabled:opacity-70 cursor-pointer"
          >
            {isSubmitting ? 'Creating account...' : 'Sign up'}
          </button>
        </form>

        <p className="mt-4 text-center text-sm text-gray-500">
          Already have an account?{' '}
          <Link to="/signin" className="font-medium text-primary underline decoration-2 underline-offset-2">
            Sign in
          </Link>
        </p>
      </section>
    </main>
  )
}
