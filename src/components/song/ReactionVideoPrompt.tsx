'use client';

import { useState } from 'react';
import { Video, Upload, X, Check, Heart, Camera } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

interface ReactionVideoPromptProps {
  recipientName: string;
  songTitle: string;
  className?: string;
}

export function ReactionVideoPrompt({
  recipientName,
  songTitle,
  className = '',
}: ReactionVideoPromptProps) {
  const [isDismissed, setIsDismissed] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  if (isDismissed) {
    return null;
  }

  if (isSubmitted) {
    return (
      <Card className={`p-6 bg-green-50 border-green-200 ${className}`}>
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
            <Heart className="w-6 h-6 text-green-600" />
          </div>
          <div>
            <h3 className="font-medium text-green-900">Danke fuers Teilen!</h3>
            <p className="text-sm text-green-700">
              Wir freuen uns riesig ueber dein Video. Das Team wird begeistert sein!
            </p>
          </div>
        </div>
      </Card>
    );
  }

  const handleUpload = () => {
    // In production, this would open a file picker and upload
    setIsUploading(true);
    setTimeout(() => {
      setIsUploading(false);
      setIsSubmitted(true);
    }, 2000);
  };

  return (
    <Card className={`overflow-hidden ${className}`}>
      {/* Gradient Header */}
      <div className="bg-gradient-to-r from-pink-500 to-rose-500 p-6 text-white relative">
        <button
          onClick={() => setIsDismissed(true)}
          className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-white/20 hover:bg-white/30 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-3 mb-2">
          <Camera className="w-6 h-6" />
          <span className="text-sm font-medium bg-white/20 px-3 py-1 rounded-full">
            Community-Moment
          </span>
        </div>

        <h3 className="text-xl font-display font-bold mb-1">
          Teile {recipientName}s Reaktion!
        </h3>
        <p className="text-pink-100 text-sm">
          Wir wuerden uns riesig freuen, den magischen Moment zu sehen
        </p>
      </div>

      {/* Content */}
      <div className="p-6">
        <div className="flex items-start gap-4 mb-6">
          <div className="w-12 h-12 rounded-xl bg-pink-100 flex items-center justify-center shrink-0">
            <Video className="w-6 h-6 text-pink-600" />
          </div>
          <div>
            <p className="text-gray-600 text-sm">
              Nimm ein kurzes Video auf, wenn du "{songTitle}"
              {recipientName} vorspielst. Traenen, Gaensehaut, Lachen - wir lieben
              diese Momente!
            </p>
          </div>
        </div>

        {/* Benefits */}
        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <p className="text-sm font-medium text-gray-700 mb-3">
            Warum teilen?
          </p>
          <ul className="space-y-2 text-sm text-gray-600">
            <li className="flex items-center gap-2">
              <Check className="w-4 h-4 text-green-500" />
              <span>Erhalte 20% Rabatt auf deinen naechsten Song</span>
            </li>
            <li className="flex items-center gap-2">
              <Check className="w-4 h-4 text-green-500" />
              <span>Inspiriere andere mit deiner Geschichte</span>
            </li>
            <li className="flex items-center gap-2">
              <Check className="w-4 h-4 text-green-500" />
              <span>Werde Teil unserer Community</span>
            </li>
          </ul>
        </div>

        {/* Upload Options */}
        <div className="flex flex-col sm:flex-row gap-3">
          <Button
            onClick={handleUpload}
            disabled={isUploading}
            className="flex-1 bg-pink-500 hover:bg-pink-600"
          >
            {isUploading ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                Wird hochgeladen...
              </>
            ) : (
              <>
                <Upload className="w-4 h-4 mr-2" />
                Video hochladen
              </>
            )}
          </Button>
          <Button
            variant="outline"
            onClick={() => {
              // Open Instagram/TikTok share
              window.open(
                `https://www.instagram.com/create/story?url=${encodeURIComponent(
                  'https://melodiemacher.de'
                )}`,
                '_blank'
              );
            }}
            className="flex-1"
          >
            Auf Instagram teilen
          </Button>
        </div>

        <p className="text-xs text-gray-500 mt-4 text-center">
          Mit dem Hochladen stimmst du zu, dass wir das Video fuer Marketing nutzen duerfen.
          <br />
          Wir behandeln deine Daten vertraulich.
        </p>
      </div>
    </Card>
  );
}

export default ReactionVideoPrompt;
