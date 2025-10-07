import { StarIcon } from "lucide-react";

interface StarRatingProps {
  rating: number;
  maxRating?: number;
  size?: "sm" | "md" | "lg";
  showNumber?: boolean;
}

export function StarRating({ rating, maxRating = 5, size = "md", showNumber = false }: StarRatingProps) {
  const sizeClasses = {
    sm: "h-3 w-3",
    md: "h-4 w-4",
    lg: "h-5 w-5",
  };

  const textSizes = {
    sm: "text-xs",
    md: "text-sm",
    lg: "text-base",
  };

  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: maxRating }).map((_, index) => {
        const starValue = index + 1;
        const isFilled = starValue <= Math.floor(rating);
        const isPartial = starValue === Math.ceil(rating) && rating % 1 !== 0;
        const fillPercentage = isPartial ? (rating % 1) * 100 : 0;

        return (
          <div key={index} className="relative">
            {/* Background star (unfilled) */}
            <StarIcon
              className={`${sizeClasses[size]} text-gray-300 dark:text-gray-600`}
            />

            {/* Filled star */}
            {(isFilled || isPartial) && (
              <div
                className="absolute inset-0 overflow-hidden"
                style={{ width: isPartial ? `${fillPercentage}%` : "100%" }}
              >
                <StarIcon
                  className={`${sizeClasses[size]} text-yellow-400 fill-yellow-400`}
                />
              </div>
            )}
          </div>
        );
      })}

      {showNumber && (
        <span className={`${textSizes[size]} font-medium text-gray-700 dark:text-gray-300 ml-1`}>
          {rating.toFixed(1)}
        </span>
      )}
    </div>
  );
}
