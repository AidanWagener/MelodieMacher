'use client';

import { useState } from 'react';
import { Share2, Copy, Check, MessageCircle, Facebook, Twitter, Mail } from 'lucide-react';

interface ShareButtonsProps {
  url: string;
  title: string;
  description: string;
}

export function ShareButtons({ url, title, description }: ShareButtonsProps) {
  const [copied, setCopied] = useState(false);

  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);
  const encodedDescription = encodeURIComponent(description);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const shareLinks = [
    {
      name: 'WhatsApp',
      icon: MessageCircle,
      href: `https://wa.me/?text=${encodedTitle}%20${encodedUrl}`,
      color: 'bg-green-500 hover:bg-green-600',
    },
    {
      name: 'Facebook',
      icon: Facebook,
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}&quote=${encodedTitle}`,
      color: 'bg-blue-600 hover:bg-blue-700',
    },
    {
      name: 'Twitter',
      icon: Twitter,
      href: `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`,
      color: 'bg-sky-500 hover:bg-sky-600',
    },
    {
      name: 'Email',
      icon: Mail,
      href: `mailto:?subject=${encodedTitle}&body=${encodedDescription}%0A%0A${encodedUrl}`,
      color: 'bg-gray-600 hover:bg-gray-700',
    },
  ];

  return (
    <div className="space-y-4">
      {/* Native share button for mobile */}
      {'share' in navigator && (
        <button
          onClick={() => {
            navigator.share({
              title,
              text: description,
              url,
            });
          }}
          className="w-full flex items-center justify-center gap-3 bg-gradient-to-r from-primary-600 to-primary-700 text-white py-4 px-6 rounded-xl font-semibold hover:from-primary-700 hover:to-primary-800 transition-all shadow-lg"
        >
          <Share2 className="w-5 h-5" />
          Song teilen
        </button>
      )}

      {/* Social share buttons */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {shareLinks.map((link) => (
          <a
            key={link.name}
            href={link.href}
            target="_blank"
            rel="noopener noreferrer"
            className={`flex items-center justify-center gap-2 ${link.color} text-white py-3 px-4 rounded-xl font-medium transition-all hover:scale-105 active:scale-95`}
          >
            <link.icon className="w-5 h-5" />
            <span className="hidden sm:inline">{link.name}</span>
          </a>
        ))}
      </div>

      {/* Copy link button */}
      <button
        onClick={copyToClipboard}
        className={`w-full flex items-center justify-center gap-3 border-2 py-3 px-6 rounded-xl font-medium transition-all ${
          copied
            ? 'border-green-500 bg-green-50 text-green-700'
            : 'border-gray-200 hover:border-primary-300 hover:bg-primary-50 text-gray-700'
        }`}
      >
        {copied ? (
          <>
            <Check className="w-5 h-5" />
            Link kopiert!
          </>
        ) : (
          <>
            <Copy className="w-5 h-5" />
            Link kopieren
          </>
        )}
      </button>
    </div>
  );
}
