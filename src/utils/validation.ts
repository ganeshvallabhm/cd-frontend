import { CheckoutFormData, ValidationErrors } from '@/types/checkout.types';

export const validateRequired = (value: string, fieldName: string): string | undefined => {
    const trimmedValue = value.trim();
    if (!trimmedValue) {
        return `${fieldName} is required`;
    }
    return undefined;
};

export const validatePhone = (phone: string): string | undefined => {
    const trimmedPhone = phone.trim();

    if (!trimmedPhone) {
        return 'Phone number is required';
    }

    const digitsOnly = trimmedPhone.replace(/\D/g, '');

    if (digitsOnly.length !== 10) {
        return 'Phone number must be exactly 10 digits';
    }

    if (!/^[6-9]/.test(digitsOnly)) {
        return 'Phone number must start with 6, 7, 8, or 9';
    }

    return undefined;
};

export const validatePincode = (pincode: string): string | undefined => {
    const trimmedPincode = pincode.trim();

    if (!trimmedPincode) {
        return 'Pincode is required';
    }

    const digitsOnly = trimmedPincode.replace(/\D/g, '');

    if (digitsOnly.length !== 6) {
        return 'Pincode must be exactly 6 digits';
    }

    return undefined;
};

export const validateFullName = (name: string): string | undefined => {
    const trimmedName = name.trim();

    if (!trimmedName) {
        return 'Full name is required';
    }

    if (trimmedName.length < 2) {
        return 'Full name must be at least 2 characters';
    }

    if (!/^[a-zA-Z\s]+$/.test(trimmedName)) {
        return 'Full name can only contain letters and spaces';
    }

    return undefined;
};

export const validateAddress = (address: string): string | undefined => {
    const trimmedAddress = address.trim();

    if (!trimmedAddress) {
        return 'Address is required';
    }

    if (trimmedAddress.length < 10) {
        return 'Address must be at least 10 characters';
    }

    return undefined;
};

export const validateEmail = (email: string): string | undefined => {
    const trimmedEmail = email.trim();

    if (!trimmedEmail) {
        return 'Email is required';
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmedEmail)) {
        return 'Please enter a valid email address';
    }

    return undefined;
};

export const sanitizeInput = (input: string): string => {
    return input
        .replace(/[<>]/g, '')
        .replace(/javascript:/gi, '')
        .replace(/on\w+=/gi, '');
};

export const validateCheckoutForm = (data: CheckoutFormData): ValidationErrors => {
    const errors: ValidationErrors = {};

    const nameError = validateFullName(data.fullName);
    if (nameError) {
        errors.fullName = nameError;
    }

    const emailError = validateEmail(data.email);
    if (emailError) {
        errors.email = emailError;
    }

    const phoneError = validatePhone(data.phoneNumber);
    if (phoneError) {
        errors.phoneNumber = phoneError;
    }

    const addressError = validateAddress(data.address);
    if (addressError) {
        errors.address = addressError;
    }

    if (data.landmark.trim() && data.landmark.trim().length < 2) {
        errors.landmark = 'Landmark must be at least 2 characters';
    }

    const pincodeError = validatePincode(data.pincode);
    if (pincodeError) {
        errors.pincode = pincodeError;
    }

    return errors;
};

export const hasValidationErrors = (errors: ValidationErrors): boolean => {
    return Object.values(errors).some(error => error !== undefined);
};

export const formatPhoneNumber = (phone: string): string => {
    const digitsOnly = phone.replace(/\D/g, '');
    if (digitsOnly.length === 10) {
        return `${digitsOnly.slice(0, 5)} ${digitsOnly.slice(5)}`;
    }
    return phone;
};

export const formatPincode = (pincode: string): string => {
    const digitsOnly = pincode.replace(/\D/g, '');
    if (digitsOnly.length === 6) {
        return `${digitsOnly.slice(0, 3)} ${digitsOnly.slice(3)}`;
    }
    return pincode;
};
