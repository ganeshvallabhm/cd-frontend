import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Phone, Loader2 } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

interface LoginFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onSuccess, onCancel }) => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();

  // Validate 10-digit Indian phone number
  const validatePhoneNumber = (phone: string) => {
    const phoneRegex = /^[6-9]\d{9}$/;
    return phoneRegex.test(phone);
  };

  // Handle simple login (no OTP for now)
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!phoneNumber.trim()) {
      setError('Please enter your phone number.');
      return;
    }

    if (!validatePhoneNumber(phoneNumber)) {
      setError('Please enter a valid 10-digit Indian mobile number.');
      return;
    }

    setLoading(true);

    try {
      // Simple mock login
      await login(`+91${phoneNumber}`);
      onSuccess?.();
    } catch (err: any) {
      setError('Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="py-4">
      <div className="text-center mb-6">
        <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
          <Phone className="w-7 h-7 text-primary" />
        </div>
        <h3 className="font-display text-lg font-semibold text-foreground">
          Login to Continue
        </h3>
        <p className="text-sm text-muted-foreground mt-1">
          Enter your phone number to place order
        </p>
      </div>

      {error && (
        <div className="bg-destructive/10 text-destructive text-sm p-3 rounded-lg mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleLogin} className="space-y-4">
        <div>
          <label className="text-sm font-medium text-foreground mb-2 block">
            Phone Number
          </label>
          <div className="flex">
            <span className="inline-flex items-center px-3 bg-secondary text-muted-foreground text-sm rounded-l-md border border-r-0 border-input">
              +91
            </span>
            <Input
              type="tel"
              value={phoneNumber}
              onChange={(e) => {
                const value = e.target.value.replace(/\D/g, '').slice(0, 10);
                setPhoneNumber(value);
              }}
              placeholder="Enter 10-digit number"
              className="rounded-l-none"
              maxLength={10}
              disabled={loading}
            />
          </div>
        </div>

        <div className="flex gap-3">
          {onCancel && (
            <Button type="button" variant="outline" className="flex-1" onClick={onCancel}>
              Cancel
            </Button>
          )}
          <Button type="submit" className="flex-1" disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Logging in...
              </>
            ) : (
              'Continue'
            )}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default LoginForm;