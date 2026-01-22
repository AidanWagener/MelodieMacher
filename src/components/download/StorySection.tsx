'use client';

import { useState } from 'react';
import { Heart, ChevronDown, ChevronUp, Quote } from 'lucide-react';

interface StorySectionProps {
  story: string;
  recipientName: string;
  occasion: string;
  customerName: string;
}

export function StorySection({ story, recipientName, occasion, customerName }: StorySectionProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  // Truncate story if too long
  const maxLength = 200;
  const isLong = story.length > maxLength;
  const displayStory = isExpanded || !isLong
    ? story
    : story.slice(0, maxLength) + '...';

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-rose-50 to-pink-50 px-6 py-4 border-b border-rose-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-rose-100 flex items-center justify-center">
            <Heart className="w-5 h-5 text-rose-500" fill="currentColor" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">Die Geschichte dahinter</h3>
            <p className="text-sm text-gray-600">
              Ein Song für {recipientName} zum {occasion}
            </p>
          </div>
        </div>
      </div>

      {/* Story content */}
      <div className="p-6">
        <div className="relative">
          <Quote className="absolute -top-2 -left-2 w-8 h-8 text-gray-200" />
          <p className="text-gray-700 leading-relaxed pl-6 italic">
            {displayStory}
          </p>
        </div>

        {isLong && (
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="mt-4 flex items-center gap-2 text-primary-600 hover:text-primary-700 font-medium transition-colors"
          >
            {isExpanded ? (
              <>
                <ChevronUp className="w-4 h-4" />
                Weniger anzeigen
              </>
            ) : (
              <>
                <ChevronDown className="w-4 h-4" />
                Mehr lesen
              </>
            )}
          </button>
        )}

        {/* Attribution */}
        <p className="mt-6 text-sm text-gray-500 text-right">
          — Mit Liebe von {customerName}
        </p>
      </div>
    </div>
  );
}
