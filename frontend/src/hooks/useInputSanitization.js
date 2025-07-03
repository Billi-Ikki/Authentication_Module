import { useMemo } from 'react';

const useInputSanitization = () => {
    const sanitizeInput = useMemo(() => {
        return (input) => {
            if (typeof input !== 'string') return input;
            
            // Remove potentially dangerous characters
            return input
                .replace(/[<>]/g, '') // Remove < and >
                .replace(/javascript:/gi, '') // Remove javascript: protocol
                .replace(/on\w+=/gi, '') // Remove event handlers
                .trim();
        };
    }, []);

    const sanitizeObject = useMemo(() => {
        return (obj) => {
            const sanitized = {};
            for (const key in obj) {
                if (obj.hasOwnProperty(key)) {
                    sanitized[key] = typeof obj[key] === 'string' 
                        ? sanitizeInput(obj[key]) 
                        : obj[key];
                }
            }
            return sanitized;
        };
    }, [sanitizeInput]);

    return { sanitizeInput, sanitizeObject };
};

export default useInputSanitization;