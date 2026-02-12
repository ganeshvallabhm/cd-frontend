import React, { useState, useEffect } from 'react';
import { AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
    CheckoutFormData,
    ValidationErrors,
    INITIAL_CHECKOUT_FORM_DATA,
    INITIAL_VALIDATION_ERRORS,
} from '@/types/checkout.types';
import {
    validateCheckoutForm,
    validateFullName,
    validateEmail,
    validatePhone,
    validateAddress,
    validatePincode,
    sanitizeInput,
} from '@/utils/validation';
import { getCheckoutData, deliveryAddressToFormData } from '@/utils/checkoutStorage';

interface CheckoutFormProps {
    onSubmit: (data: CheckoutFormData) => void;
    onCancel?: () => void;
    isSubmitting?: boolean;
}

const CheckoutForm: React.FC<CheckoutFormProps> = ({ onSubmit, onCancel, isSubmitting = false }) => {
    const [formData, setFormData] = useState<CheckoutFormData>(INITIAL_CHECKOUT_FORM_DATA);
    const [errors, setErrors] = useState<ValidationErrors>(INITIAL_VALIDATION_ERRORS);
    const [hasAttemptedSubmit, setHasAttemptedSubmit] = useState(false);
    const [focusedField, setFocusedField] = useState<string | null>(null);

    useEffect(() => {
        const savedData = getCheckoutData();
        if (savedData) {
            setFormData(deliveryAddressToFormData(savedData));
        }
    }, []);

    const handleBlur = (field: keyof CheckoutFormData) => {
        setFocusedField(null);
        if (!hasAttemptedSubmit) return;

        const value = formData[field];
        let error: string | undefined;

        switch (field) {
            case 'fullName':
                error = validateFullName(value);
                break;
            case 'email':
                error = validateEmail(value);
                break;
            case 'phoneNumber':
                error = validatePhone(value);
                break;
            case 'address':
                error = validateAddress(value);
                break;
            case 'pincode':
                error = validatePincode(value);
                break;
            case 'landmark':
                if (value.trim() && value.trim().length < 2) {
                    error = 'Landmark must be at least 2 characters';
                }
                break;
            default:
                break;
        }

        setErrors(prev => ({ ...prev, [field]: error }));
    };

    const handleChange = (field: keyof CheckoutFormData, value: string) => {
        const sanitizedValue = sanitizeInput(value);
        setFormData(prev => ({ ...prev, [field]: sanitizedValue }));

        if (hasAttemptedSubmit && errors[field]) {
            setErrors(prev => ({ ...prev, [field]: undefined }));
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setHasAttemptedSubmit(true);

        const validationErrors = validateCheckoutForm(formData);
        setErrors(validationErrors);

        const hasErrors = Object.values(validationErrors).some(error => error !== undefined);

        if (!hasErrors) {
            onSubmit(formData);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-8">
            {/* Personal Information Section */}
            <div className="space-y-6">
                <div className="border-l-4 border-primary pl-4">
                    <h3 className="text-lg font-semibold text-foreground">Personal Information</h3>
                    <p className="text-sm text-muted-foreground mt-1">We'll use this to contact you about your order</p>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                    {/* Full Name */}
                    <div className="relative group">
                        <div className={`relative transition-all duration-200 ${focusedField === 'fullName' ? 'scale-[1.01]' : ''}`}>
                            <Input
                                id="fullName"
                                type="text"
                                value={formData.fullName}
                                onChange={(e) => handleChange('fullName', e.target.value)}
                                onFocus={() => setFocusedField('fullName')}
                                onBlur={() => handleBlur('fullName')}
                                placeholder=" "
                                className={`h-14 peer ${errors.fullName ? 'border-destructive focus-visible:ring-destructive' : 'border-border focus-visible:border-primary'} transition-all duration-200`}
                                disabled={isSubmitting}
                                aria-invalid={!!errors.fullName}
                                aria-describedby={errors.fullName ? 'fullName-error' : undefined}
                            />
                            <label
                                htmlFor="fullName"
                                className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground transition-all duration-200 pointer-events-none peer-focus:top-2 peer-focus:text-xs peer-focus:text-primary peer-[:not(:placeholder-shown)]:top-2 peer-[:not(:placeholder-shown)]:text-xs bg-background px-1"
                            >
                                Full Name <span className="text-destructive">*</span>
                            </label>
                        </div>
                        {errors.fullName && (
                            <p id="fullName-error" className="mt-2 text-xs text-destructive flex items-center gap-1.5 animate-in slide-in-from-top-1">
                                <AlertCircle className="w-3.5 h-3.5" />
                                {errors.fullName}
                            </p>
                        )}
                    </div>

                    {/* Email */}
                    <div className="relative group">
                        <div className={`relative transition-all duration-200 ${focusedField === 'email' ? 'scale-[1.01]' : ''}`}>
                            <Input
                                id="email"
                                type="email"
                                value={formData.email}
                                onChange={(e) => handleChange('email', e.target.value)}
                                onFocus={() => setFocusedField('email')}
                                onBlur={() => handleBlur('email')}
                                placeholder=" "
                                className={`h-14 peer ${errors.email ? 'border-destructive focus-visible:ring-destructive' : 'border-border focus-visible:border-primary'} transition-all duration-200`}
                                disabled={isSubmitting}
                                aria-invalid={!!errors.email}
                                aria-describedby={errors.email ? 'email-error' : undefined}
                            />
                            <label
                                htmlFor="email"
                                className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground transition-all duration-200 pointer-events-none peer-focus:top-2 peer-focus:text-xs peer-focus:text-primary peer-[:not(:placeholder-shown)]:top-2 peer-[:not(:placeholder-shown)]:text-xs bg-background px-1"
                            >
                                Email Address <span className="text-destructive">*</span>
                            </label>
                        </div>
                        {errors.email && (
                            <p id="email-error" className="mt-2 text-xs text-destructive flex items-center gap-1.5 animate-in slide-in-from-top-1">
                                <AlertCircle className="w-3.5 h-3.5" />
                                {errors.email}
                            </p>
                        )}
                    </div>

                    {/* Phone Number */}
                    <div className="relative group">
                        <div className={`relative transition-all duration-200 ${focusedField === 'phoneNumber' ? 'scale-[1.01]' : ''}`}>
                            <Input
                                id="phoneNumber"
                                type="tel"
                                value={formData.phoneNumber}
                                onChange={(e) => handleChange('phoneNumber', e.target.value)}
                                onFocus={() => setFocusedField('phoneNumber')}
                                onBlur={() => handleBlur('phoneNumber')}
                                placeholder=" "
                                maxLength={10}
                                className={`h-14 peer ${errors.phoneNumber ? 'border-destructive focus-visible:ring-destructive' : 'border-border focus-visible:border-primary'} transition-all duration-200`}
                                disabled={isSubmitting}
                                aria-invalid={!!errors.phoneNumber}
                                aria-describedby={errors.phoneNumber ? 'phoneNumber-error' : undefined}
                            />
                            <label
                                htmlFor="phoneNumber"
                                className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground transition-all duration-200 pointer-events-none peer-focus:top-2 peer-focus:text-xs peer-focus:text-primary peer-[:not(:placeholder-shown)]:top-2 peer-[:not(:placeholder-shown)]:text-xs bg-background px-1"
                            >
                                Phone Number <span className="text-destructive">*</span>
                            </label>
                        </div>
                        {errors.phoneNumber && (
                            <p id="phoneNumber-error" className="mt-2 text-xs text-destructive flex items-center gap-1.5 animate-in slide-in-from-top-1">
                                <AlertCircle className="w-3.5 h-3.5" />
                                {errors.phoneNumber}
                            </p>
                        )}
                    </div>
                </div>
            </div>

            {/* Delivery Address Section */}
            <div className="space-y-6">
                <div className="border-l-4 border-primary pl-4">
                    <h3 className="text-lg font-semibold text-foreground">Delivery Address</h3>
                    <p className="text-sm text-muted-foreground mt-1">Where should we deliver your order?</p>
                </div>

                <div className="space-y-6">
                    {/* Address */}
                    <div className="relative group">
                        <div className={`relative transition-all duration-200 ${focusedField === 'address' ? 'scale-[1.01]' : ''}`}>
                            <Textarea
                                id="address"
                                value={formData.address}
                                onChange={(e) => handleChange('address', e.target.value)}
                                onFocus={() => setFocusedField('address')}
                                onBlur={() => handleBlur('address')}
                                placeholder=" "
                                rows={3}
                                className={`pt-6 peer resize-none ${errors.address ? 'border-destructive focus-visible:ring-destructive' : 'border-border focus-visible:border-primary'} transition-all duration-200`}
                                disabled={isSubmitting}
                                aria-invalid={!!errors.address}
                                aria-describedby={errors.address ? 'address-error' : undefined}
                            />
                            <label
                                htmlFor="address"
                                className="absolute left-4 top-5 text-muted-foreground transition-all duration-200 pointer-events-none peer-focus:-top-2 peer-focus:text-xs peer-focus:text-primary peer-[:not(:placeholder-shown)]:-top-2 peer-[:not(:placeholder-shown)]:text-xs bg-background px-1"
                            >
                                Complete Address <span className="text-destructive">*</span>
                            </label>
                        </div>
                        {errors.address && (
                            <p id="address-error" className="mt-2 text-xs text-destructive flex items-center gap-1.5 animate-in slide-in-from-top-1">
                                <AlertCircle className="w-3.5 h-3.5" />
                                {errors.address}
                            </p>
                        )}
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                        {/* Landmark */}
                        <div className="relative group">
                            <div className={`relative transition-all duration-200 ${focusedField === 'landmark' ? 'scale-[1.01]' : ''}`}>
                                <Input
                                    id="landmark"
                                    type="text"
                                    value={formData.landmark}
                                    onChange={(e) => handleChange('landmark', e.target.value)}
                                    onFocus={() => setFocusedField('landmark')}
                                    onBlur={() => handleBlur('landmark')}
                                    placeholder=" "
                                    className={`h-14 peer ${errors.landmark ? 'border-destructive focus-visible:ring-destructive' : 'border-border focus-visible:border-primary'} transition-all duration-200`}
                                    disabled={isSubmitting}
                                    aria-invalid={!!errors.landmark}
                                    aria-describedby={errors.landmark ? 'landmark-error' : undefined}
                                />
                                <label
                                    htmlFor="landmark"
                                    className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground transition-all duration-200 pointer-events-none peer-focus:top-2 peer-focus:text-xs peer-focus:text-primary peer-[:not(:placeholder-shown)]:top-2 peer-[:not(:placeholder-shown)]:text-xs bg-background px-1"
                                >
                                    Landmark (Optional)
                                </label>
                            </div>
                            {errors.landmark && (
                                <p id="landmark-error" className="mt-2 text-xs text-destructive flex items-center gap-1.5 animate-in slide-in-from-top-1">
                                    <AlertCircle className="w-3.5 h-3.5" />
                                    {errors.landmark}
                                </p>
                            )}
                        </div>

                        {/* Pincode */}
                        <div className="relative group">
                            <div className={`relative transition-all duration-200 ${focusedField === 'pincode' ? 'scale-[1.01]' : ''}`}>
                                <Input
                                    id="pincode"
                                    type="text"
                                    value={formData.pincode}
                                    onChange={(e) => handleChange('pincode', e.target.value)}
                                    onFocus={() => setFocusedField('pincode')}
                                    onBlur={() => handleBlur('pincode')}
                                    placeholder=" "
                                    maxLength={6}
                                    className={`h-14 peer ${errors.pincode ? 'border-destructive focus-visible:ring-destructive' : 'border-border focus-visible:border-primary'} transition-all duration-200`}
                                    disabled={isSubmitting}
                                    aria-invalid={!!errors.pincode}
                                    aria-describedby={errors.pincode ? 'pincode-error' : undefined}
                                />
                                <label
                                    htmlFor="pincode"
                                    className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground transition-all duration-200 pointer-events-none peer-focus:top-2 peer-focus:text-xs peer-focus:text-primary peer-[:not(:placeholder-shown)]:top-2 peer-[:not(:placeholder-shown)]:text-xs bg-background px-1"
                                >
                                    Pincode <span className="text-destructive">*</span>
                                </label>
                            </div>
                            {errors.pincode && (
                                <p id="pincode-error" className="mt-2 text-xs text-destructive flex items-center gap-1.5 animate-in slide-in-from-top-1">
                                    <AlertCircle className="w-3.5 h-3.5" />
                                    {errors.pincode}
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Additional Instructions Section */}
            <div className="space-y-4">
                <div className="border-l-4 border-muted pl-4">
                    <h3 className="text-base font-medium text-foreground">Delivery Instructions</h3>
                    <p className="text-xs text-muted-foreground mt-1">Optional - Any special notes for delivery</p>
                </div>

                <div className="relative group">
                    <Textarea
                        id="deliveryInstructions"
                        value={formData.deliveryInstructions}
                        onChange={(e) => handleChange('deliveryInstructions', e.target.value)}
                        onFocus={() => setFocusedField('deliveryInstructions')}
                        onBlur={() => setFocusedField(null)}
                        placeholder="E.g., Please call before delivery, Leave at the gate"
                        rows={2}
                        className="resize-none border-border focus-visible:border-primary transition-all duration-200"
                        disabled={isSubmitting}
                    />
                </div>
            </div>

            {/* Form Actions */}
            <div className="flex gap-4 pt-6 border-t">
                {onCancel && (
                    <Button
                        type="button"
                        variant="outline"
                        onClick={onCancel}
                        disabled={isSubmitting}
                        className="flex-1 h-12 text-base hover:bg-secondary/80 transition-all duration-200"
                    >
                        Cancel
                    </Button>
                )}
                <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 h-12 text-base bg-primary hover:bg-primary/90 shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-[1.02]"
                >
                    {isSubmitting ? (
                        <span className="flex items-center gap-2">
                            <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            Processing...
                        </span>
                    ) : (
                        'Continue to Review Order'
                    )}
                </Button>
            </div>
        </form>
    );
};

export default CheckoutForm;
