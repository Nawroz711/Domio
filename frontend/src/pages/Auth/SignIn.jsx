import { Eye, EyeOff } from 'lucide-react'
import { useState } from 'react'
import { useAuth } from '../../hooks/useAuth'

export default function SignIn() {
    const { formData, isSubmitting, handleChange, handleSubmit } = useAuth('signin')
    const [showPassword, setShowPassword] = useState(false)

    return (
        <main className="flex min-h-screen items-center justify-center px-6 py-12">
            <section className="w-full max-w-sm rounded-2xl">
                <div className="gap-2 mb-2">
                    <img src="/logo.webp" alt="Domio" className="w-32 block mx-auto " />
                </div>
                <p className="mt-2 text-sm text-center text-gray-500">Sign in to continue to admin portal.</p>

                <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
                    <div>
                        <label htmlFor="email" className="mb-1.5 block text-sm font-thin text-gray-700">
                            Email
                        </label>
                        <input
                            id="email"
                            name="email"
                            type="email"
                            value={formData.email}
                            onChange={handleChange}
                            className="w-full rounded-sm bg-white/10 border border-white/20 px-3.5 py-2.5 text-white placeholder:text-gray-400 focus:border-accent focus:ring-2 focus:ring-accent/30"
                            placeholder="you@example.com"
                        />
                    </div>

                    <div>
                        <label htmlFor="password" className="mb-1.5 block text-sm font-thin text-gray-700">
                            Password
                        </label>
                        <div className="relative">
                            <input
                                id="password"
                                name="password"
                                type={showPassword ? 'text' : 'password'}
                                value={formData.password}
                                onChange={handleChange}
                                className="w-full rounded-sm bg-white/10 border border-white/20 px-3.5 py-2.5 pr-11 text-white placeholder:text-gray-400 focus:border-accent focus:ring-2 focus:ring-accent/30"
                                placeholder="Enter your password"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword((prev) => !prev)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 transition hover:text-accent"
                            >
                                {showPassword ? <EyeOff size={18} strokeWidth={1.8} /> : <Eye size={18} strokeWidth={1.8} />}
                            </button>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="mt-2 w-full rounded-sm bg-primary px-4 py-2.5 text-sm font-semibold text-white cursor-pointer transition hover:brightness-95 disabled:cursor-not-allowed disabled:opacity-70"
                    >
                        {isSubmitting ? 'Signing in...' : 'Sign in'}
                    </button>
                </form>
            </section>
        </main>
    )
}
