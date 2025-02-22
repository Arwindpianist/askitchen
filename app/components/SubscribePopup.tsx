'use client';
import { useState, useEffect } from 'react';
import SubscribeForm from './SubscribeForm';

export default function SubscribePopup() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    console.log('SubscribePopup mounted'); // Debug log
    
    const timer = setTimeout(() => {
      console.log('Timer fired'); // Debug log
      try {
        const hasSeenPopup = localStorage.getItem('hasSeenPopup');
        console.log('hasSeenPopup:', hasSeenPopup); // Debug log
        
        if (!hasSeenPopup) {
          setIsVisible(true);
          localStorage.setItem('hasSeenPopup', 'true');
        }
      } catch (error) {
        console.error('localStorage error:', error);
      }
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  // Debug log
  console.log('isVisible:', isVisible);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full relative">
        <button 
          onClick={() => setIsVisible(false)}
          className="absolute top-4 right-4 text-gray-600 hover:text-gray-900 transition-colors"
          aria-label="Close popup"
        >
          ✕
        </button>
        <div className="pt-4">
          <h2 className="text-2xl font-bold mb-4 text-gray-900">Join the AS Kitchen Community!</h2>
          <p className="mb-6 text-gray-600">Get weekly recipes and cooking inspiration delivered straight to your inbox.</p>
          <SubscribeForm />
        </div>
      </div>
    </div>
  );
} 