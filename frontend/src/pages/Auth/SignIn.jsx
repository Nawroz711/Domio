import { Eye, EyeOff } from 'lucide-react'
import { useState } from 'react'
import { useAuth } from '../../hooks/useAuth'
import { Link } from 'react-router-dom'

export default function SignIn() {
    const { formData, isSubmitting, handleChange, handleSubmit } = useAuth('signin')
    const [showPassword, setShowPassword] = useState(false)

    return (
        <main className="flex min-h-screen items-center justify-center px-6 py-12">
            <section className="w-full max-w-sm rounded-2xl">
                <div className="gap-2 mb-2">
                    <Link to={'/'}>
                    <img src="/logo.webp" alt="Domio" className="w-32 block mx-auto " />
                    </Link>
                </div>
                <p className="mt-2 text-sm text-center text-gray-500">Sign in to continue to admin portal.</p>

                <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
                    <div>
                        <label htmlFor="email" className="mb-1.5 block text-sm font-normal text-gray-700">
                            Email
                        </label>
                        <input
                            id="email"
                            name="email"
                            type="email"
                            value={formData.email}
                            onChange={handleChange}
                            className="w-full rounded-sm bg-white/10 border border-gray-300 text-gray-700 px-3.5 py-2.5 placeholder:text-gray-500 focus:border-primary focus:ring-2 focus:ring-primary/30"
                            placeholder="you@example.com"
                        />
                    </div>

                    <div>
                        <label htmlFor="password" className="mb-1.5 block text-sm font-normal text-gray-700">
                            Password
                        </label>
                        <div className="relative">
                            <input
                                id="password"
                                name="password"
                                type={showPassword ? 'text' : 'password'}
                                value={formData.password}
                                onChange={handleChange}
                                className="w-full rounded-sm bg-white/10 border border-gray-300 px-3.5 py-2.5 pr-11 text-gray-700 placeholder:text-gray-500 focus:border-primary focus:ring-2 focus:ring-primary/30"
                                placeholder="Enter your password"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword((prev) => !prev)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 transition hover:text-primary"
                            >
                                {showPassword ? <EyeOff size={18} strokeWidth={1.8} /> : <Eye size={18} strokeWidth={1.8} />}
                            </button>
                        </div>
                        <small className='text-gray-500 mt-2 underline text-right block text-xs'>Forget Password?</small>
                    </div>

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="mt-2 w-full rounded-sm bg-primary px-4 py-2.5 text-sm font-medium text-white cursor-pointer transition hover:brightness-95 disabled:cursor-not-allowed disabled:opacity-70"
                    >
                        {isSubmitting ? 'Signing in...' : 'Sign in'}
                    </button>

                </form>
                
                <div className='mt-4 text-gray-500'>
                    <span className='text-sm text-center block'>Are you an agent? <span className='underline cursor-pointer px-2'><Link to={'/signup'}>create your account</Link></span></span>
                </div>
            </section>
        </main>
    )
}
