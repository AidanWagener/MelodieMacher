'use client';

import { useState } from 'react';
import {
  Copy,
  Check,
  MessageCircle,
  Mail,
  Facebook,
  Twitter,
  Linkedin,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

interface SocialShareButtonsProps {
  url: string;
  title: string;
  description: string;
  className?: string;
}

export function SocialShareButtons({
  url,
  title,
  description,
  className = '',
}: SocialShareButtonsProps) {
  const [copied, setCopied] = useState(false);

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const shareLinks = {
    whatsapp: `https://wa.me/?text=${encodeURIComponent(`${title}\n\n${description}\n\n${url}`)}`,
    email: `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(`${description}\n\n${url}`)}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}&quote=${encodeURIComponent(title)}`,
    twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
  };

  const openShareWindow = (shareUrl: string) => {
    window.open(shareUrl, '_blank', 'width=600,height=400');
  };

  return (
    <div className={`flex flex-wrap gap-3 ${className}`}>
      <Button variant="outline" size="sm" onClick={handleCopyLink}>
        {copied ? (
          <>
            <Check className="w-4 h-4 mr-2 text-green-600" />
            Kopiert!
          </>
        ) : (
          <>
            <Copy className="w-4 h-4 mr-2" />
            Link kopieren
          </>
        )}
      </Button>

      <Button
        variant="outline"
        size="sm"
        onClick={() => window.open(shareLinks.whatsapp, '_blank')}
        className="bg-green-50 hover:bg-green-100 border-green-200 text-green-700"
      >
        <MessageCircle className="w-4 h-4 mr-2" />
        WhatsApp
      </Button>

      <Button
        variant="outline"
        size="sm"
        onClick={() => (window.location.href = shareLinks.email)}
      >
        <Mail className="w-4 h-4 mr-2" />
        E-Mail
      </Button>

      <Button
        variant="outline"
        size="sm"
        onClick={() => openShareWindow(shareLinks.facebook)}
        className="bg-blue-50 hover:bg-blue-100 border-blue-200 text-blue-700"
      >
        <Facebook className="w-4 h-4" />
      </Button>

      <Button
        variant="outline"
        size="sm"
        onClick={() => openShareWindow(shareLinks.twitter)}
        className="bg-sky-50 hover:bg-sky-100 border-sky-200 text-sky-700"
      >
        <Twitter className="w-4 h-4" />
      </Button>
    </div>
  );
}

export default SocialShareButtons;
