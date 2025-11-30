import React, { useState } from 'react';
import { Star } from 'lucide-react';

const StarRating = ({ value = 0, onChange, readonly = false, size = 'md' }) => {
    const [hoverRating, setHoverRating] = useState(0);

    const sizeClasses = {
        sm: 'w-4 h-4',
        md: 'w-6 h-6',
        lg: 'w-8 h-8',
        xl: 'w-10 h-10'
    };

    const starSize = sizeClasses[size];

    const handleClick = (rating) => {
        if (!readonly && onChange) {
            onChange(rating);
        }
    };

    const handleMouseEnter = (rating) => {
        if (!readonly) {
            setHoverRating(rating);
        }
    };

    const handleMouseLeave = () => {
        if (!readonly) {
            setHoverRating(0);
        }
    };

    return (
        <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((star) => {
                const isActive = star <= (hoverRating || value);
                return (
                    <button
                        key={star}
                        type="button"
                        onClick={() => handleClick(star)}
                        onMouseEnter={() => handleMouseEnter(star)}
                        onMouseLeave={handleMouseLeave}
                        disabled={readonly}
                        className={`transition-all ${readonly ? 'cursor-default' : 'cursor-pointer hover:scale-110'}`}
                    >
                        <Star
                            className={`${starSize} transition-colors ${isActive
                                    ? 'fill-yellow-400 text-yellow-400'
                                    : 'fill-gray-200 text-gray-300'
                                }`}
                        />
                    </button>
                );
            })}
        </div>
    );
};

export default StarRating;
