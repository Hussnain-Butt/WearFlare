import React, { useState } from 'react';
import { User, Lock, Eye, EyeOff } from 'lucide-react';
import { Link } from 'react-router-dom';

const LoginForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!username || !password) {
      showToast('Please fill in all fields', 'error');
      return;
    }

    setIsLoading(true);
    
    // Simulate login process
    setTimeout(() => {
      setIsLoading(false);
      showToast('You\'ve been logged in successfully!', 'success');
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
          Sign in
        </h1>
        
        <p className="text-white text-center mt-1 mb-6 animate-fade-in" style={{ animationDelay: '0.5s' }}>
          Welcome!
        </p>
        
        <form className="space-y-5" onSubmit={handleSubmit}>
          <div className="relative animate-fade-in" style={{ animationDelay: '0.6s' }}>
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
              <User size={18} />
            </div>
            <input
              type="text"
              placeholder="Username"
              className="w-full bg-white text-black rounded-full py-2.5 pl-10 pr-4 outline-none"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          
          <div className="relative animate-fade-in" style={{ animationDelay: '0.7s' }}>
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
              <Lock size={18} />
            </div>
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              className="w-full bg-white text-black rounded-full py-2.5 pl-10 pr-10 outline-none"
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
          
          <div className="flex items-center justify-between text-sm mt-1 animate-fade-in" style={{ animationDelay: '0.8s' }}>
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={() => setRememberMe(!rememberMe)}
                className="h-4 w-4 rounded border-gray-300"
              />
              <span className="text-white text-xs">Remember Me</span>
            </label>
            
            <a href="#" className="text-white text-xs hover:text-[#7A68A6] transition-colors">
              Forgot Password?
            </a>
          </div>
          
          <button
            type="submit"
            className="w-full bg-[#5D4D8A] text-white rounded-full py-3 font-medium hover:bg-[#7A68A6] transition-colors transform active:scale-[0.98] animate-fade-in mt-2 flex items-center justify-center disabled:opacity-50"
            style={{ animationDelay: '0.9s' }}
            disabled={isLoading}
          >
            {isLoading ? (
              <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></span>
            ) : (
              "Sign in"
            )}
          </button>
          
          <div className="text-center mt-2 animate-fade-in" style={{ animationDelay: '1s' }}>
            <p className="text-white text-sm">
              No account? <Link to="/signup" className="text-[#7A68A6] hover:underline ml-1">Sign up</Link>
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

export default LoginForm;
