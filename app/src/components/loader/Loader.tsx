import React from 'react';
import './Loader.scss';

interface LoaderProps {
    size?: number;           // размер в пикселях, по умолчанию 40
    color?: string;          // цвет спиннера, по умолчанию синий
    className?: string;      // доп. CSS-классы
}

export const Loader: React.FC<LoaderProps> = ({ size = 40, color = '#a73afd', className = '' }) => {
    return (
        <div
            className={`loader ${className}`}
            style={{ width: size, height: size, borderColor: `${color} transparent transparent transparent` }}
            aria-label="Loading"
            role="status"
        />
    );
};
