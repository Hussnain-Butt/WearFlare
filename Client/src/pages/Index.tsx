
import React from 'react';
import BackgroundGradient from '@/components/BackgroundGradient';
import LoginForm from '@/components/LoginForm';

const Index = () => {
  return (
    <BackgroundGradient>
      <div className="min-h-screen w-full flex items-center justify-center">
        <LoginForm />
      </div>
    </BackgroundGradient>
  );
};

export default Index;
