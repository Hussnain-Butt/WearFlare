
import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { Link } from 'react-router-dom';

const SignupForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!fullName || !email || !password || !confirmPassword) {
      showToast('Please fill in all fields', 'error');
      return;
    }

    if (password !== confirmPassword) {
      showToast('Passwords do not match', 'error');
      return;
    }

    setIsLoading(true);
    
    // Simulate signup process
    setTimeout(() => {
      setIsLoading(false);
      showToast('Account created successfully!', 'success');
    }, 1500);
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center background">
      <div className="gradient-bg" />
      <div className="corner-dark-top" />
      <div className="corner-dark-bottom" />
      <div className="glow-effect" />
      
      <div className="glass-card w-[380px] py-10 px-10 rounded-lg shadow-2xl animate-fade-in relative z-10" style={{ animationDelay: '0.3s' }}>
        <h1 className="font-serif text-white text-center text-3xl font-medium tracking-wide animate-fade-in" style={{ animationDelay: '0.4s' }}>
          Sign up
        </h1>
        
        <form className="space-y-4 mt-4" onSubmit={handleSubmit}>
          <div>
            <label className="text-white text-sm block mb-1">Full name</label>
            <input
              type="text"
              placeholder="Mahnoor"
              className="w-full bg-white text-black rounded-full py-2.5 px-4 outline-none"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
            />
          </div>
          
          <div>
            <label className="text-white text-sm block mb-1">Email Address</label>
            <input
              type="email"
              placeholder="Mahnoor@gmail.com"
              className="w-full bg-white text-black rounded-full py-2.5 px-4 outline-none"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          
          <div className="flex gap-2">
            <div className="flex-1">
              <label className="text-white text-sm block mb-1">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="********"
                  className="w-full bg-white text-black rounded-full py-2.5 px-4 pr-10 outline-none"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>
            
            <div className="flex-1">
              <label className="text-white text-sm block mb-1">Confirm Password</label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="********"
                  className="w-full bg-white text-black rounded-full py-2.5 px-4 pr-10 outline-none"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-600 transition-colors"
                >
                  {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>
          </div>
          
          <button
            type="submit"
            className="w-full bg-[#5D4D8A] text-white rounded-full py-3 font-medium hover:bg-[#7A68A6] transition-colors transform active:scale-[0.98] animate-fade-in mt-4 flex items-center justify-center disabled:opacity-50"
            style={{ animationDelay: '0.8s' }}
            disabled={isLoading}
          >
            {isLoading ? (
              <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></span>
            ) : (
              "Create Account"
            )}
          </button>
          
          <div className="text-center mt-3 animate-fade-in" style={{ animationDelay: '0.9s' }}>
            <p className="text-white text-sm">
              Have an account? <Link to="/login" className="text-[#7A68A6] hover:underline ml-1">Sign in</Link>
            </p>
          </div>
        </form>
      </div>

      {toast && (
        <div className={`toast toast-${toast.type}`}>
          {toast.message}
        </div>
      )}
    </div>
  );
};

export default SignupForm;
