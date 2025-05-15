import { ArrowUp, ArrowDown, Minus } from "lucide-react";
import React from "react";

export const StateCard = ({
  title,
  value,
  icon,
  trend = "neutral",
  description,
}) => {
  const trendIcons = {
    up: <ArrowUp className="text-green-500" size={16} />,
    down: <ArrowDown className="text-red-500" size={16} />,
    neutral: <Minus className="text-gray-500" size={16} />,
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow border border-gray-200">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm text-gray-500">{title}</p>
          <p className="text-2xl font-bold mt-1">{value}</p>
          {description && (
            <p className="text-xs text-gray-400 mt-1">{description}</p>
          )}
        </div>
        <div className="flex flex-col items-end">
          <span className="text-3xl mb-1">{icon}</span>
          {trendIcons[trend]}
        </div>
      </div>
    </div>
  );
};
