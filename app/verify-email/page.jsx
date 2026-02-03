"use client";
import React, { useState, useEffect } from 'react';
import { LiquidGlassCard } from '@/components/ui/liquid-glass';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mail, ArrowRight } from "lucide-react";
import { useRouter, useSearchParams } from 'next/navigation';
import * as motion from "motion/react-client";
import { confirmSignUp, resendConfirmationCode } from '../lib/cognito';
import Link from 'next/link';

const VerifyEmailPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const usernameFromUrl = searchParams.get('username');
  const emailFromUrl = searchParams.get('email');

  const [username, setUsername] = useState(usernameFromUrl || "");
  const [email, setEmail] = useState(emailFromUrl || "");
  const [code, setCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);

  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(() => setResendCooldown(resendCooldown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendCooldown]);

  const handleVerify = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      // Use username for verification (required by Cognito)
      await confirmSignUp(username, code);
      setSuccess(true);
      
      // Redirect to login after 2 seconds
      setTimeout(() => {
        router.push('/login?verified=true');
      }, 2000);
      
    } catch (err) {
      console.error('Verification error:', err);
      
      if (err.code === 'CodeMismatchException') {
        setError('Invalid verification code. Please check and try again.');
      } else if (err.code === 'ExpiredCodeException') {
        setError('Verification code has expired. Please request a new one.');
      } else if (err.code === 'NotAuthorizedException') {
        setError('User is already confirmed or code is invalid.');
      } else {
        setError(err.message || 'Verification failed. Please try again.');
      }
      
      setIsLoading(false);
    }
  };

  const handleResendCode = async () => {
    if (resendCooldown > 0) return;
    
    setError("");
    setIsLoading(true);

    try {
      // Use username for resending code
      await resendConfirmationCode(username);
      setResendCooldown(60); // 60 second cooldown
      setError(""); // Clear any previous errors
      
    } catch (err) {
      console.error('Resend error:', err);
      setError(err.message || 'Failed to resend code. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-md"
        >
          <LiquidGlassCard
            glowIntensity="md"
            shadowIntensity="md"
            borderRadius="16px"
            blurIntensity="md"
            className="p-8"
          >
            <div className="text-center space-y-4 relative z-30">
              <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-cyan-600 rounded-full flex items-center justify-center mx-auto">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring" }}
                >
                  ✓
                </motion.div>
              </div>
              <h2 className="text-2xl font-bold text-white">Email verified!</h2>
              <p className="text-white/70">
                Your account has been successfully verified. Redirecting to login...
              </p>
            </div>
          </LiquidGlassCard>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-8 relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-20 left-20 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md"
      >
        <LiquidGlassCard
          glowIntensity="md"
          shadowIntensity="md"
          borderRadius="16px"
          blurIntensity="md"
          className="p-8"
        >
          <div className="space-y-6 relative z-30">
            {/* Header */}
            <div className="text-center space-y-2">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto">
                <Mail className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-3xl font-bold text-white">Verify your email</h1>
              <p className="text-white/60 text-sm">
                Enter the verification code sent to your email
              </p>
            </div>

            {/* Error Message */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-red-500/10 border border-red-500/30 rounded-lg p-3"
              >
                <p className="text-red-400 text-sm">{error}</p>
              </motion.div>
            )}

            {/* Form */}
            <form onSubmit={handleVerify} className="space-y-4">
              {/* Email Display (read-only) */}
              <div className="space-y-2">
                <label className="text-white/80 text-sm font-medium">
                  Email
                </label>
                <Input
                  type="email"
                  value={email}
                  readOnly
                  className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white/70 cursor-not-allowed"
                />
                <p className="text-white/50 text-xs">
                  We sent a verification code to this email
                </p>
              </div>

              {/* Verification Code Input */}
              <div className="space-y-2">
                <label className="text-white/80 text-sm font-medium">
                  Verification Code
                </label>
                <Input
                  type="text"
                  placeholder="Enter 6-digit code"
                  value={code}
                  onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white text-center text-2xl tracking-widest placeholder:text-white/40 placeholder:text-base placeholder:tracking-normal focus:bg-white/10 focus:border-white/30 transition-all"
                  maxLength={6}
                  required
                  disabled={isLoading}
                />
              </div>

              {/* Verify Button */}
              <Button
                type="submit"
                disabled={isLoading || code.length !== 6}
                className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold py-3 rounded-lg transition-all flex items-center justify-center gap-2 group disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <motion.div
                      className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    />
                    <span>Verifying...</span>
                  </>
                ) : (
                  <>
                    <span>Verify Email</span>
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </Button>
            </form>

            {/* Resend Code */}
            <div className="text-center">
              <p className="text-white/60 text-sm mb-2">
                Didn't receive the code?
              </p>
              <Button
                type="button"
                onClick={handleResendCode}
                disabled={resendCooldown > 0 || isLoading}
                variant="ghost"
                className="text-blue-400 hover:text-blue-300 hover:bg-white/10 transition-colors"
              >
                {resendCooldown > 0 ? (
                  `Resend in ${resendCooldown}s`
                ) : (
                  'Resend Code'
                )}
              </Button>
            </div>

            {/* Back to Login */}
            <div className="text-center text-sm">
              <Link
                href="/login"
                className="text-white/60 hover:text-white transition-colors"
              >
                ← Back to Login
              </Link>
            </div>
          </div>
        </LiquidGlassCard>
      </motion.div>
    </div>
  );
};

export default VerifyEmailPage;