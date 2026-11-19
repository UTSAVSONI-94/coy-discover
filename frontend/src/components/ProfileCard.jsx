import React, { useState } from 'react';
import { MapPin, Sparkles, User } from 'lucide-react';

/**
 * Fallback avatar SVG data URI if photo cannot be loaded
 */
const DEFAULT_AVATAR = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80';

/**
 * ProfileCard Component
 * Displays a single candidate profile with portrait aesthetics and tags.
 */
export default function ProfileCard({ profile }) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  if (!profile) return null;

  const { name, age, photo, bio, location, interests = [] } = profile;

  return (
    <div className="relative w-full aspect-[3/4.2] sm:aspect-[3/4.4] max-h-[580px] bg-[#1a1e24] rounded-3xl overflow-hidden shadow-2xl border border-gray-800/80 flex flex-col justify-end select-none">
      {/* Background Image Container */}
      <div className="absolute inset-0 bg-[#15181d]">
        {!imageLoaded && !imageError && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-900 animate-pulse">
            <User className="w-12 h-12 text-gray-700" />
          </div>
        )}

        <img
          src={imageError ? DEFAULT_AVATAR : photo}
          alt={name}
          onLoad={() => setImageLoaded(true)}
          onError={() => {
            setImageError(true);
            setImageLoaded(true);
          }}
          className={`w-full h-full object-cover object-center transition-opacity duration-300 ${
            imageLoaded ? 'opacity-100' : 'opacity-0'
          }`}
          draggable={false}
        />

        {/* Gradient Overlay for Readable Typography */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent" />
      </div>

      {/* Content Area */}
      <div className="relative z-10 p-5 sm:p-6 text-white space-y-3">
        {/* Name and Age */}
        <div className="flex items-baseline gap-2">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white drop-shadow-md">
            {name}
          </h2>
          <span className="text-xl sm:text-2xl font-medium text-gray-300">
            {age}
          </span>
        </div>

        {/* Location / College */}
        {location && (
          <div className="flex items-center gap-1.5 text-xs sm:text-sm text-gray-300 font-medium">
            <MapPin className="w-3.5 h-3.5 text-[#FF5252] shrink-0" />
            <span className="truncate">{location}</span>
          </div>
        )}

        {/* Bio */}
        {bio && (
          <p className="text-xs sm:text-sm text-gray-200 line-clamp-2 leading-relaxed">
            {bio}
          </p>
        )}

        {/* Interests Tags */}
        {Array.isArray(interests) && interests.length > 0 && (
          <div className="flex flex-wrap gap-1.5 pt-1">
            {interests.slice(0, 4).map((interest, idx) => (
              <span
                key={idx}
                className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-white/15 text-white backdrop-blur-md border border-white/10"
              >
                <Sparkles className="w-2.5 h-2.5 text-gray-300" />
                {interest}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

