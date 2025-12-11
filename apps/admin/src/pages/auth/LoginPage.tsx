// Login Page

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';

export function LoginPage() {
    const navigate = useNavigate();
    const { signIn } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            await signIn(email, password);
            navigate('/');
        } catch (err) {
            setError('Invalid email or password');
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
                    <p className="text-text-secondary mt-2">Sign in to manage your content</p>
                </div>

                {/* Login Form */}
                <div className="bg-surface rounded-xl border border-border shadow-soft p-8">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {error && (
                            <div className="p-3 rounded-lg bg-red-50 text-red-600 text-sm">
                                {error}
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

                        <Input
                            label="Password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••"
                            required
                            autoComplete="current-password"
                        />

                        <Button
                            type="submit"
                            className="w-full"
                            isLoading={isLoading}
                        >
                            Sign In
                        </Button>
                    </form>

                    {/* Dev hint */}
                    <div className="mt-6 p-3 rounded-lg bg-plume-rose/50 text-sm text-text-secondary">
                        <strong>Development mode:</strong> Enter any email and password to sign in.
                    </div>
                </div>
            </div>
        </div>
    );
}
