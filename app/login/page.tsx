'use client';
import { signIn, signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import React, { useState, useEffect } from 'react';
import { User, Shield, Sparkles, Mail, Home, ArrowRight, LogOut } from 'lucide-react';
import Image from 'next/image';


const SignInPage = () => {
  const { data: session } = useSession();
  const router = useRouter();
  if (session) {
    router.push("/");
  }
  const [isAnimated, setIsAnimated] = useState(false);

  useEffect(() => {
    setIsAnimated(true);
  }, []);

    if (session) {
    return (
      <div className="min-h-screen bg-[#181825] flex items-center justify-center p-4">
        <div className="bg-[#1E1E2E]/80 backdrop-blur-lg border border-[#313244]/50 rounded-2xl p-8 shadow-2xl max-w-md w-full text-center">
          <div className="mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full mb-4">
              {/* <User size={40} className="text-white" /> */}
              <Image src={session.user?.image!} alt='profile' width={120} height={120} className='rounded-full w-20 h-20' />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">Welcome Back!</h2>
            <p className="text-gray-400">You're successfully signed in</p>
          </div>

          <div className="bg-[#181825] border border-[#313244] rounded-xl p-4 mb-6">
            <div className="flex items-center justify-center space-x-3 mb-2">
              <Mail size={16} className="text-purple-400" />
              <span className="text-white font-medium">Signed in as</span>
            </div>
            <p className="text-purple-400 font-semibold">{session.user.email}</p>
          </div>

          <div className="space-y-4">
            <button
              onClick={() => router.push('/transaction')}
              className="w-full bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white font-semibold py-3 px-6 rounded-xl flex items-center justify-center space-x-2 transition-all duration-200 transform hover:scale-105"
            >
              <Home size={20} />
              <span>Go to Dashboard</span>
              <ArrowRight size={20} />
            </button>

            <button
             onClick={() => signOut()}
              className="w-full bg-red-500/20 hover:bg-red-500/30 border border-red-500/50 hover:border-red-400 text-red-400 hover:text-red-300 font-semibold py-3 px-6 rounded-xl flex items-center justify-center space-x-2 transition-all duration-200"
            >
              <LogOut size={20} />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-[#181825] relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-purple-900/20 via-blue-900/20 to-cyan-900/20"></div>
        <div className="absolute top-20 left-20 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl animate-pulse delay-2000"></div>

        {/* Floating Elements */}
        <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-purple-400 rounded-full animate-ping"></div>
        <div className="absolute top-3/4 left-3/4 w-1 h-1 bg-blue-400 rounded-full animate-ping delay-500"></div>
        <div className="absolute top-1/2 right-1/4 w-3 h-3 bg-cyan-400 rounded-full animate-ping delay-1000"></div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
        <div className="max-w-md w-full">
          <div className={`transform transition-all duration-1000 ${isAnimated ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>

            {/* Header */}
            <div className="text-center mt-5 mb-8">
              <div className="relative inline-block mb-6">
                <div className="w-32 h-32 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full p-4 shadow-2xl transform hover:scale-90 hover:-translate-y-2 transition-all duration-300">
                  <div className="w-full h-full rounded-full flex items-center justify-center">

                    <Image src='/bank.png' alt='logo' width={140} height={140} className='hover:scale-125  transition-all duration-500  my-10 drop-shadow-[0_5px_13px_rgba(0,0,0,0.25)] drop-shadow-amber-100   inline-block ml-2' />
                  </div>
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full flex items-center justify-center animate-bounce">
                  <Sparkles size={16} className="text-white" />
                </div>
              </div>

              <h1 className="text-4xl font-bold text-white mb-4">
                Welcome to <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">My Bank</span>
              </h1>

              <p className="text-gray-400 text-lg mb-2">
                Secure. Simple. Smart.
              </p>

              <p className="text-gray-500 text-sm">
                Track your finances with confidence
              </p>
            </div>

            {/* Sign In Card */}
            <div className="bg-[#1E1E2E]/40 backdrop-blur-lg border border-[#313244]/50 rounded-2xl p-8 shadow-2xl">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-white mb-2">Sign In</h2>
                <p className="text-gray-400">Continue with your Google account</p>
              </div>

              <button onClick={() => signIn("google", { callbackUrl: "/" })}
                className="w-full bg-white hover:bg-gray-100 text-blue-700 font-semibold py-4 px-6 rounded-xl flex items-center justify-center space-x-3 transition-all duration-200 transform hover:scale-105 shadow-lg"
              >
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                <span className="text-lg">Sign in with Google</span>
              </button>

              <div className="mt-8 pt-6 border-t border-[#313244]/50">
                <div className="grid grid-cols-3 gap-4 text-center text-xs text-gray-400">
                  <div className="flex flex-col items-center space-y-1">
                    <Shield size={16} className="text-green-400" />
                    <span>Secure</span>
                  </div>
                  <div className="flex flex-col items-center space-y-1">
                    <User size={16} className="text-blue-400" />
                    <span>Privacy</span>
                  </div>
                  <div className="flex flex-col items-center space-y-1">
                    <Sparkles size={16} className="text-purple-400" />
                    <span>Fast</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Features */}
            <div className="mt-8 grid grid-cols-1 gap-4">
              <div className="bg-[#1E1E2E]/50 border border-[#313244]/40 rounded-xl p-4 text-center">
                <h3 className="text-white font-semibold mb-2">✨ New Features</h3>
                <p className="text-gray-400 text-sm">
                  Enhanced analytics, smart budgeting
                </p>
              </div>
            </div>

            {/* Footer */}
            <div className="mt-8 text-center">
              <div className="flex items-center justify-center space-x-4 text-xs text-gray-500">
                <button className="hover:text-gray-400 transition-colors">Privacy</button>
                <span>•</span>
                <button className="hover:text-gray-400 transition-colors">Terms</button>
                <span>•</span>
                <button className="hover:text-gray-400 transition-colors">Help</button>
              </div>
              <p className="text-gray-600 text-xs mt-2">© 2024 My Bank. All rights reserved.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignInPage;