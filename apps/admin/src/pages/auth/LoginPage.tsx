// Login Page

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Eye, EyeOff } from 'lucide-react';

export function LoginPage() {
    const navigate = useNavigate();
    const { signIn, resetPassword } = useAuth();
    const [view, setView] = useState<'login' | 'forgot-password'>('login');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccessMessage('');
        setIsLoading(true);

        try {
            if (view === 'login') {
                await signIn(email, password);
                navigate('/');
            } else {
                await resetPassword(email);
                setSuccessMessage('Password reset link has been sent to your email.');
                // Optional: switch back to login after delay or let them click "Back to login"
            }
        } catch (err: any) {
            setError(err.message || 'An error occurred');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-background flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                {/* Logo */}
                <div className="text-center mb-8">
                    <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-plume-coral to-plume-rose flex items-center justify-center mb-4">
                        <span className="text-white font-bold text-2xl">P</span>
                    </div>
                    <h1 className="text-2xl font-semibold text-text-primary">Plumé Admin</h1>
                    <p className="text-text-secondary mt-2">
                        {view === 'login' ? 'Sign in to manage your content' : 'Reset your password'}
                    </p>
                </div>

                {/* Login/Reset Form */}
                <div className="bg-surface rounded-xl border border-border shadow-soft p-8">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {error && (
                            <div className="p-3 rounded-lg bg-red-50 text-red-600 text-sm">
                                {error}
                            </div>
                        )}

                        {successMessage && (
                            <div className="p-3 rounded-lg bg-green-50 text-green-600 text-sm">
                                {successMessage}
                            </div>
                        )}

                        <Input
                            label="Email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="admin@plume.vn"
                            required
                            autoComplete="email"
                        />

                        {view === 'login' && (
                            <>
                                <div>
                                    <Input
                                        label="Password"
                                        type={showPassword ? 'text' : 'password'}
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="••••••••"
                                        required
                                        autoComplete="current-password"
                                        rightIcon={
                                            <button
                                                type="button"
                                                onClick={() => setShowPassword(!showPassword)}
                                                className="focus:outline-none hover:text-text-primary transition-colors"
                                            >
                                                {showPassword ? (
                                                    <EyeOff className="w-5 h-5" />
                                                ) : (
                                                    <Eye className="w-5 h-5" />
                                                )}
                                            </button>
                                        }
                                    />
                                    <div className="flex justify-end mt-1">
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setView('forgot-password');
                                                setError('');
                                                setSuccessMessage('');
                                            }}
                                            className="text-xs text-plume-coral hover:text-plume-rose transition-colors"
                                        >
                                            Forgot password?
                                        </button>
                                    </div>
                                </div>
                            </>
                        )}

                        <Button
                            type="submit"
                            className="w-full"
                            isLoading={isLoading}
                        >
                            {view === 'login' ? 'Sign In' : 'Send Reset Link'}
                        </Button>

                        {view === 'forgot-password' && (
                            <button
                                type="button"
                                onClick={() => {
                                    setView('login');
                                    setError('');
                                    setSuccessMessage('');
                                }}
                                className="w-full text-sm text-text-secondary hover:text-text-primary transition-colors"
                            >
                                Back to Sign In
                            </button>
                        )}
                    </form>
                </div>
            </div>
        </div>
    );
}
