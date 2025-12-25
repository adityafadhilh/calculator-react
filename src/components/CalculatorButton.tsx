import React from 'react';

interface CalculatorButtonProps {
    onClick: () => void;
    children: React.ReactNode;
    className?: string;
    variant?: 'default' | 'operator' | 'equals' | 'action' | 'clear';
}

export function CalculatorButton({ onClick, children, className = '', variant = 'default' }: CalculatorButtonProps) {
    const baseStyles = "hover:cursor-pointer rounded-2xl w-32 mx-1 h-24 text-center font-bold text-2xl flex items-center justify-center transition-colors focus:outline-hidden focus:ring-2 focus:ring-blue-400";

    const variantStyles = {
        default: "bg-gray-200 text-black hover:bg-gray-300",
        operator: "bg-orange-500 text-white hover:bg-orange-600",
        equals: "bg-blue-600 text-white hover:bg-blue-700",
        action: "bg-yellow-700 text-white hover:bg-yellow-800",
        clear: "bg-red-500 text-white hover:bg-red-600",
    };

    return (
        <button
            onClick={onClick}
            className={`${baseStyles} ${variantStyles[variant]} ${className}`}
        >
            {children}
        </button>
    );
}
