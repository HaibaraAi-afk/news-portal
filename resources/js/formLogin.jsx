import { useState } from 'react';
import { useForm, Link } from '@inertiajs/react';
import axios from 'axios';

const FormLogin = ({ onClose }) => {
    const [step, setStep] = useState('email'); // 'email', 'login', 'register'
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [passwordConfirmation, setPasswordConfirmation] = useState('');
    const [name, setName] = useState('');
    const [error, setError] = useState('');
    
    // For form submission
    const { data, setData, post, processing } = useForm({
        email: '',
        password: '',
        passwordConfirmation: '',
        name: ''
    });

    // Check if email exists to determine next step
    const checkEmail = async (e) => {
        e.preventDefault(); // Tambahkan ini untuk mencegah reload
        try {
            const response = await axios.post('/check-email', { email: data.email });
            setStep(response.data.exists ? 'login' : 'register');
        } catch (err) {
            setError('Error checking email. Please try again.');
        }
    };

    // Handle login submission
    const handleLogin = (e) => {
        e.preventDefault();
        post('/login', {
            preserveScroll: true,
            onSuccess: () => onClose(),
            onError: (errors) => {
                setError(errors.email || 'Invalid credentials');
            }
        });
    };

    // Handle register
    const handleRegister = (e) => {
        e.preventDefault();
        post('/register', {
            name,
            email,
            password,
            password_confirmation: data.password_confirmation,
            preserveScroll: true,
            onSuccess: () => onClose(),
            onError: (errors) => {
                setError(
                    errors.email || 
                    errors.password || 
                    errors.name || 
                    'Registration failed'
                );
            }
        });
    };

    return (
        <div className="fixed inset-0 bg-transparant bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-white rounded-md p-6 w-80 relative shadow-xl">
                <button onClick={onClose} className="absolute top-2 right-3 text-lg">✕</button>
                <h2 className="text-xl text-black font-extrabold text-center mb-1">NusantaraTimes</h2>
                <hr className="mb-3" />
                <p className="text-sm text-center mb-4 font-medium">
                    {step === 'register' ? 'Create Your Account' : step === 'login' ? 'Login to Your Account' : 'Enter Your Email'}
                </p>
                {error && <p className="text-red-500 text-sm mb-2 text-center">{error}</p>}
                
                <form onSubmit={step === 'email' ? checkEmail : step === 'login' ? handleLogin : handleRegister}>
                    <div className="mb-4">
                        <label className="text-sm text-black block mb-1">Email</label>
                        <input 
                            type="email" 
                            value={data.email} 
                            onChange={(e) => setData('email',e.target.value)} 
                            className="border px-3 py-2 text-sm rounded w-full" 
                            required
                            disabled={processing && step !== 'email'}
                        />
                    </div>

                    {step !== 'email' && (
                        <>
                            {step === 'register' && (
                                <div className="mb-4">
                                    <label className="text-sm block mb-1">Name</label>
                                    <input 
                                        type="text" 
                                        value={data.name} 
                                        onChange={(e) => setData('name', e.target.value)}
                                        className="border px-3 py-2 text-sm rounded w-full" 
                                        required
                                        disabled={processing}
                                    />
                                </div>
                            )}
                            <div className="mb-4">
                                <label className="text-sm block mb-1">Password</label>
                                <input 
                                    type="password" 
                                    value={data.password} 
                                    onChange={(e) => setData('password', e.target.value)} 
                                    className="border px-3 py-2 text-sm rounded w-full" 
                                    required
                                    disabled={processing}
                                />
                            </div>
                            {step === 'register' && (
                                <div className="mb-4">
                                    <label className="text-sm block mb-1">Confirm Password</label>
                                    <input 
                                        type="password" 
                                        value={data.password_confirmation} 
                                        onChange={(e) => setData('password_confirmation', e.target.value)} 
                                        className="border px-3 py-2 text-sm rounded w-full" 
                                        required
                                        disabled={processing}
                                    />
                                </div>
                            )}
                        </>
                    )}

                    <button 
                        type="submit"
                        className="bg-[#300000] text-white py-2 w-full rounded text-sm mb-2"
                        disabled={processing}
                    >
                        {processing ? 'Processing...' : 
                         step === 'email' ? 'Continue' : 
                         step === 'login' ? 'Login' : 'Create Account'}
                    </button>
                </form>

                {step !== 'email' && (
                    <p className="text-xs text-center mt-4">
                        {step === 'login' ? (
                            <>
                                Don't have an account?{' '}
                                <button 
                                    type="button"
                                    onClick={() => setStep('register')}
                                    className="text-[#300000] font-medium"
                                >
                                    Register
                                </button>
                            </>
                        ) : (
                            <>
                                Already have an account?{' '}
                                <button 
                                    type="button"
                                    onClick={() => setStep('login')}
                                    className="text-[#300000] font-medium"
                                >
                                    Login
                                </button>
                            </>
                        )}
                    </p>
                )}
            </div>
        </div>
    );
};

export default FormLogin;