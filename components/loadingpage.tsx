'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

export default function LoadingPage() {
  const [progress, setProgress] = useState(0)
  const [loadingText, setLoadingText] = useState('Initializing your financial dashboard...')
  const router = useRouter()

  const loadingSteps = [
    'Initializing your financial dashboard...',
    'Securing your data...',
    'Loading transaction history...',
    'Analyzing spending patterns...',
    'Preparing insights...',
    'Almost ready!'
  ]

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          // Navigate to your main dashboard after loading
           
          return 100
        }
        return prev + 2
      })
    }, 100)

    return () => clearInterval(interval)
  }, [router])

  useEffect(() => {
    const textInterval = setInterval(() => {
      setLoadingText((prev) => {
        const currentIndex = loadingSteps.indexOf(prev)
        const nextIndex = (currentIndex + 1) % loadingSteps.length
        return loadingSteps[nextIndex]
      })
    }, 1500)

    return () => clearInterval(textInterval)
  }, [])

  return (
    <div className="min-h-screen   flex items-center justify-center">
      <div className="text-center space-y-8 px-4">
        {/* Logo/Brand Section */}
        <div className="space-y-2">
          <div className="w-16 h-16 mx-auto bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-800">BankTracker</h1>
          <p className="text-gray-600">Your Financial Command Center</p>
        </div>

        {/* Loading Animation */}
        <div className="space-y-6">
          {/* Animated Circles */}
          <div className="flex justify-center space-x-2">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="w-3 h-3 bg-blue-600 rounded-full animate-pulse"
                style={{
                  animationDelay: `${i * 0.2}s`,
                  animationDuration: '1.4s'
                }}
              />
            ))}
          </div>

          {/* Progress Bar */}
          <div className="w-80 max-w-sm mx-auto space-y-3">
            <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full transition-all duration-300 ease-out"
                style={{ width: `${progress}%` }}
              />
            </div>
            <div className="flex justify-between text-sm text-gray-500">
              <span>{Math.round(progress)}%</span>
              <span>Loading...</span>
            </div>
          </div>

          {/* Loading Text */}
          <p className="text-gray-700 font-medium min-h-[24px] transition-opacity duration-300">
            {loadingText}
          </p>
        </div>

        {/* Feature Pills */}
        <div className="flex flex-wrap justify-center gap-2 max-w-md mx-auto">
          {['Expense Tracking', 'Income Analysis', 'Smart Insights', 'Secure Data'].map((feature) => (
            <div
              key={feature}
              className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium"
            >
              {feature}
            </div>
          ))}
        </div>

        {/* Security Badge */}
        <div className="flex items-center justify-center space-x-2 text-gray-500 text-sm">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
          <span>Bank-grade security</span>
        </div>
      </div>
    </div>
  )
}