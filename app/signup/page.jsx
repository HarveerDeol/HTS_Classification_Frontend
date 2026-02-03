"use client";
import React, { useState } from 'react';
import { LiquidGlassCard } from '@/components/ui/liquid-glass';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Eye, EyeOff, Mail, Lock, User, ArrowRight, Check } from "lucide-react";
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import * as motion from "motion/react-client";
import { signUp } from '../lib/cognito';

const SignupPage = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: ""
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [error, setError] = useState("");
  const [needsVerification, setNeedsVerification] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");

    // Validation
    if (!agreedToTerms) {
      setError("Please agree to the Terms of Service and Privacy Policy");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (formData.password.length < 8) {
      setError("Password must be at least 8 characters long");
      return;
    }
    
    setIsLoading(true);
    
    try {
      const result = await signUp(formData.email, formData.password, formData.name);
      
      console.log('Signup successful:', result);
      
      // Show verification message
      setNeedsVerification(true);
      setIsLoading(false);
      
      // Redirect to verification page with username (not email)
      setTimeout(() => {
        router.push(`/verify-email?username=${encodeURIComponent(result.username)}&email=${encodeURIComponent(formData.email)}`);
      }, 3000);
      
    } catch (err) {
      console.error('Signup error:', err);
      
      // Handle specific Cognito errors
      if (err.code === 'UsernameExistsException') {
        setError('An account with this email already exists. Please try logging in.');
      } else if (err.code === 'InvalidPasswordException') {
        setError('Password does not meet requirements. Use at least 8 characters with uppercase, lowercase, numbers, and special characters.');
      } else if (err.code === 'InvalidParameterException') {
        setError('Invalid email or password format. Please check your input.');
      } else {
        setError(err.message || 'An error occurred during signup. Please try again.');
      }
      
      setIsLoading(false);
    }
  };

  const passwordStrength = () => {
    const password = formData.password;
    if (password.length === 0) return { strength: 0, label: "" };
    if (password.length < 6) return { strength: 1, label: "Weak" };
    
    let strength = 1;
    if (password.length >= 8) strength++;
    if (/[A-Z]/.test(password) && /[a-z]/.test(password)) strength++;
    if (/[0-9]/.test(password) && /[^A-Za-z0-9]/.test(password)) strength = 3;
    
    const labels = ["Weak", "Medium", "Strong"];
    return { strength, label: labels[strength - 1] || "" };
  };

  const strength = passwordStrength();

  if (needsVerification) {
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
                <Mail className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-white">Check your email</h2>
              <p className="text-white/70">
                We've sent a verification code to <strong className="text-white">{formData.email}</strong>
              </p>
              <p className="text-white/60 text-sm">
                Click the link in the email to verify your account. Redirecting to verification page...
              </p>
            </div>
          </LiquidGlassCard>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-8 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-20 right-20 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl"
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
        <motion.div
          className="absolute bottom-20 left-20 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl"
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.5, 0.3, 0.5],
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
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                className="inline-block mb-2"
              >
                <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-cyan-600 rounded-2xl flex items-center justify-center mx-auto">
                  <span className="text-3xl">✨</span>
                </div>
              </motion.div>
              <h1 className="text-3xl font-bold text-white">Create account</h1>
              <p className="text-white/60 text-sm">
                Join us and start classifying today
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
            <form onSubmit={handleSignup} className="space-y-4">
              {/* Name Input */}
              <div className="space-y-2">
                <label className="text-white/80 text-sm font-medium">
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                  <Input
                    type="text"
                    name="name"
                    placeholder="John Doe"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder:text-white/40 focus:bg-white/10 focus:border-white/30 transition-all"
                    required
                    disabled={isLoading}
                  />
                </div>
              </div>

              {/* Email Input */}
              <div className="space-y-2">
                <label className="text-white/80 text-sm font-medium">
                  Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                  <Input
                    type="email"
                    name="email"
                    placeholder="your@email.com"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder:text-white/40 focus:bg-white/10 focus:border-white/30 transition-all"
                    required
                    disabled={isLoading}
                  />
                </div>
              </div>

              {/* Password Input */}
              <div className="space-y-2">
                <label className="text-white/80 text-sm font-medium">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                  <Input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full pl-10 pr-12 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder:text-white/40 focus:bg-white/10 focus:border-white/30 transition-all"
                    required
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/60 transition-colors"
                    disabled={isLoading}
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
                {/* Password Strength Indicator */}
                {formData.password && (
                  <div className="space-y-1">
                    <div className="flex gap-1">
                      {[1, 2, 3].map((level) => (
                        <div
                          key={level}
                          className={`h-1 flex-1 rounded-full transition-all ${
                            level <= strength.strength
                              ? strength.strength === 1
                                ? 'bg-red-500'
                                : strength.strength === 2
                                ? 'bg-yellow-500'
                                : 'bg-emerald-500'
                              : 'bg-white/10'
                          }`}
                        />
                      ))}
                    </div>
                    <p className={`text-xs ${
                      strength.strength === 1
                        ? 'text-red-400'
                        : strength.strength === 2
                        ? 'text-yellow-400'
                        : 'text-emerald-400'
                    }`}>
                      {strength.label}
                    </p>
                  </div>
                )}
              </div>

              {/* Confirm Password Input */}
              <div className="space-y-2">
                <label className="text-white/80 text-sm font-medium">
                  Confirm Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                  <Input
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    placeholder="••••••••"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="w-full pl-10 pr-12 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder:text-white/40 focus:bg-white/10 focus:border-white/30 transition-all"
                    required
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/60 transition-colors"
                    disabled={isLoading}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
                {formData.confirmPassword && formData.password !== formData.confirmPassword && (
                  <p className="text-xs text-red-400">Passwords do not match</p>
                )}
              </div>

              {/* Terms Checkbox */}
              <div className="flex items-start gap-3">
                <button
                  type="button"
                  onClick={() => setAgreedToTerms(!agreedToTerms)}
                  className={`flex-shrink-0 w-5 h-5 rounded border-2 flex items-center justify-center transition-all mt-0.5 ${
                    agreedToTerms
                      ? 'bg-emerald-500 border-emerald-500'
                      : 'border-white/30 hover:border-white/50'
                  }`}
                  disabled={isLoading}
                >
                  {agreedToTerms && <Check className="w-3 h-3 text-white" />}
                </button>
                <label className="text-sm text-white/70 leading-relaxed">
                  I agree to the{' '}
                  <Link href="/terms" className="text-emerald-400 hover:text-emerald-300 transition-colors">
                    Terms of Service
                  </Link>{' '}
                  and{' '}
                  <Link href="/privacy" className="text-emerald-400 hover:text-emerald-300 transition-colors">
                    Privacy Policy
                  </Link>
                </label>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={isLoading || !agreedToTerms || formData.password !== formData.confirmPassword}
                className="w-full bg-gradient-to-r from-emerald-500 to-cyan-600 hover:from-emerald-600 hover:to-cyan-700 text-white font-semibold py-3 rounded-lg transition-all flex items-center justify-center gap-2 group disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <motion.div
                      className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    />
                    <span>Creating account...</span>
                  </>
                ) : (
                  <>
                    <span>Create account</span>
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </Button>
            </form>

            {/* Login Link */}
            <div className="text-center text-sm">
              <span className="text-white/60">Already have an account? </span>
              <Link
                href="/login"
                className="text-emerald-400 hover:text-emerald-300 font-semibold transition-colors"
              >
                Sign in
              </Link>
            </div>
          </div>
        </LiquidGlassCard>
      </motion.div>
    </div>
  );
};

export default SignupPage;