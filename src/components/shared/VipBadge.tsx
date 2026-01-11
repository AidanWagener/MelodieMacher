'use client';

import { Crown } from 'lucide-react';

interface VipBadgeProps {
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
  className?: string;
}

export function VipBadge({
  size = 'md',
  showText = true,
  className = '',
}: VipBadgeProps) {
  const sizeClasses = {
    sm: 'h-6 text-xs',
    md: 'h-8 text-sm',
    lg: 'h-10 text-base',
  };

  const iconSizes = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-5 h-5',
  };

  return (
    <div
      className={`
        inline-flex items-center gap-1.5
        px-3 rounded-full
        bg-gradient-to-r from-gold-400 to-gold-500
        text-primary-900 font-semibold
        shadow-sm
        ${sizeClasses[size]}
        ${className}
      `}
    >
      <Crown className={iconSizes[size]} />
      {showText && <span>VIP</span>}
    </div>
  );
}

interface VipBadgeInlineProps {
  className?: string;
}

export function VipBadgeInline({ className = '' }: VipBadgeInlineProps) {
  return (
    <span
      className={`
        inline-flex items-center gap-1
        px-2 py-0.5 rounded-md
        bg-gold-100 text-gold-700
        text-xs font-medium
        ${className}
      `}
    >
      <Crown className="w-3 h-3" />
      VIP
    </span>
  );
}

export default VipBadge;
