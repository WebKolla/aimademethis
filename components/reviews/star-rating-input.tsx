"use client";

import { useState } from "react";
import { StarIcon } from "lucide-react";

interface StarRatingInputProps {
  value: number;
  onChange: (rating: number) => void;
  maxRating?: number;
  size?: "sm" | "md" | "lg";
  disabled?: boolean;
}

export function StarRatingInput({
  value,
  onChange,
  maxRating = 5,
  size = "lg",
  disabled = false,
}: StarRatingInputProps) {
  const [hoverRating, setHoverRating] = useState(0);

  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-6 w-6",
    lg: "h-8 w-8",
  };

  const displayRating = hoverRating || value;

  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: maxRating }).map((_, index) => {
        const starValue = index + 1;
        const isFilled = starValue <= displayRating;

        return (
          <button
            key={index}
            type="button"
            onClick={() => !disabled && onChange(starValue)}
            onMouseEnter={() => !disabled && setHoverRating(starValue)}
            onMouseLeave={() => !disabled && setHoverRating(0)}
            disabled={disabled}
            className={`transition-transform hover:scale-110 ${
              disabled ? "cursor-not-allowed opacity-50" : "cursor-pointer"
            }`}
            aria-label={`Rate ${starValue} out of ${maxRating} stars`}
          >
            <StarIcon
              className={`${sizeClasses[size]} ${
                isFilled
                  ? "text-yellow-400 fill-yellow-400"
                  : "text-gray-300 dark:text-gray-600"
              }`}
            />
          </button>
        );
      })}

      {value > 0 && (
        <span className="ml-2 text-sm font-medium text-gray-700 dark:text-gray-300">
          {value} {value === 1 ? "star" : "stars"}
        </span>
      )}
    </div>
  );
}
