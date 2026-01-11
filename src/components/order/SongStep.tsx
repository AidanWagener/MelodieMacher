'use client';

import { useState } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Slider } from '@/components/ui/slider';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import {
  genreOptions,
  packageOptions,
  bumpOptions,
  bundleOptions,
  CUSTOM_LYRICS_PRICE,
  type SongFormData,
} from '@/lib/order-schema';
import { cn } from '@/lib/utils';
import { Music, Check, Zap, Sparkles, Globe, Pen, Package, ChevronDown, ChevronUp } from 'lucide-react';

interface SongStepProps {
  form: UseFormReturn<SongFormData>;
}

const moodLabels = [
  'Nachdenklich',
  'Emotional',
  'Ausgewogen',
  'Froehlich',
  'Energiegeladen',
];

export function SongStep({ form }: SongStepProps) {
  const { setValue, watch, formState: { errors } } = form;
  const [customLyricsExpanded, setCustomLyricsExpanded] = useState(false);

  const selectedGenre = watch('genre');
  const selectedPackage = watch('packageType');
  const mood = watch('mood') || 3;
  const allowEnglish = watch('allowEnglish') || false;
  const hasCustomLyrics = watch('hasCustomLyrics') || false;
  const customLyrics = watch('customLyrics') || '';
  const selectedBundle = watch('selectedBundle') || 'none';

  return (
    <div className="space-y-8">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-600 to-gold-400 mb-4">
          <Music className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-2xl font-display font-bold text-primary-900 mb-2">
          Gestalte deinen Song
        </h2>
        <p className="text-gray-600">
          Waehle Genre, Stimmung und dein Paket.
        </p>
      </div>

      {/* Genre Selection */}
      <div className="space-y-3">
        <Label>Welches Genre passt am besten?</Label>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {genreOptions.map((genre) => (
            <button
              key={genre.value}
              type="button"
              onClick={() => setValue('genre', genre.value, { shouldValidate: true })}
              className={cn(
                'p-4 rounded-xl border-2 text-left transition-all duration-200',
                selectedGenre === genre.value
                  ? 'border-primary-600 bg-primary-50 shadow-md'
                  : 'border-gray-200 hover:border-primary-300 hover:bg-gray-50'
              )}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="font-medium text-primary-900">{genre.label}</span>
                {selectedGenre === genre.value && (
                  <Check className="w-4 h-4 text-primary-600" />
                )}
              </div>
              <span className="text-xs text-gray-500">{genre.description}</span>
            </button>
          ))}
        </div>
        {errors.genre && (
          <p className="text-sm text-red-500">{errors.genre.message}</p>
        )}
      </div>

      {/* Language Preference */}
      <div className="space-y-3">
        <label
          className={cn(
            'flex items-start gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all duration-200',
            allowEnglish
              ? 'border-primary-400 bg-primary-50'
              : 'border-gray-200 hover:border-primary-300 hover:bg-gray-50'
          )}
        >
          <Checkbox
            checked={allowEnglish}
            onCheckedChange={(checked) => setValue('allowEnglish', checked as boolean)}
            className="mt-0.5"
          />
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <Globe className="w-4 h-4 text-primary-600" />
              <span className="font-medium text-primary-900">Englische Woerter/Phrasen sind willkommen</span>
            </div>
            <p className="text-sm text-gray-500 mt-0.5">
              Wir koennen einzelne englische Ausdruecke oder Phrasen in den deutschen Text einbauen
            </p>
          </div>
        </label>
      </div>

      {/* Mood Slider */}
      <div className="space-y-4">
        <Label>Welche Stimmung soll der Song haben?</Label>
        <div className="px-2">
          <Slider
            value={[mood]}
            onValueChange={([value]) => setValue('mood', value)}
            min={1}
            max={5}
            step={1}
            className="mb-4"
          />
          <div className="flex justify-between text-sm text-gray-500">
            {moodLabels.map((label, index) => (
              <span
                key={label}
                className={cn(
                  'transition-colors',
                  mood === index + 1 && 'text-primary-600 font-medium'
                )}
              >
                {label}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Custom Lyrics Premium Add-on */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Pen className="w-5 h-5 text-gold-500" />
          <Label>Eigene Lyrics (Premium Add-on)</Label>
        </div>
        <Card
          className={cn(
            'relative overflow-hidden cursor-pointer transition-all duration-300',
            hasCustomLyrics
              ? 'ring-2 ring-gold-400 bg-gradient-to-br from-gold-50 to-white'
              : 'hover:shadow-md hover:border-gold-200'
          )}
        >
          <div
            className="p-5"
            onClick={() => {
              if (!hasCustomLyrics) {
                setValue('hasCustomLyrics', true);
                setCustomLyricsExpanded(true);
              }
            }}
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <Checkbox
                  checked={hasCustomLyrics}
                  onCheckedChange={(checked) => {
                    setValue('hasCustomLyrics', checked as boolean);
                    if (checked) {
                      setCustomLyricsExpanded(true);
                    } else {
                      setValue('customLyrics', '');
                      setCustomLyricsExpanded(false);
                    }
                  }}
                  onClick={(e) => e.stopPropagation()}
                />
                <div>
                  <h4 className="font-semibold text-primary-900">Eigene Lyrics einreichen</h4>
                  <p className="text-sm text-gray-500">Deine eigenen Worte, professionell vertont</p>
                </div>
              </div>
              <div className="text-right">
                <span className="text-xl font-bold text-gold-600">+{CUSTOM_LYRICS_PRICE} Euro</span>
                <p className="text-xs text-gray-500">einmalig</p>
              </div>
            </div>

            {hasCustomLyrics && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setCustomLyricsExpanded(!customLyricsExpanded);
                }}
                className="flex items-center gap-1 text-sm text-primary-600 hover:text-primary-700 mb-3"
              >
                {customLyricsExpanded ? (
                  <>
                    <ChevronUp className="w-4 h-4" />
                    Einklappen
                  </>
                ) : (
                  <>
                    <ChevronDown className="w-4 h-4" />
                    Lyrics bearbeiten
                  </>
                )}
              </button>
            )}

            {hasCustomLyrics && customLyricsExpanded && (
              <div className="space-y-3" onClick={(e) => e.stopPropagation()}>
                <Textarea
                  placeholder="Gib hier deine Lyrics ein..."
                  value={customLyrics}
                  onChange={(e) => setValue('customLyrics', e.target.value)}
                  className="min-h-[120px] resize-none"
                  maxLength={500}
                />
                <div className="flex items-center justify-between text-sm">
                  <p className="text-gray-500 italic">
                    Hinweis: Wir behalten kuenstlerische Freiheit bei der Vertonung.
                  </p>
                  <span className={cn(
                    'font-medium',
                    customLyrics.length > 450 ? 'text-red-500' : 'text-gray-400'
                  )}>
                    {customLyrics.length}/500
                  </span>
                </div>
              </div>
            )}
          </div>
        </Card>
      </div>

      {/* Package Selection */}
      <div className="space-y-3">
        <Label>Waehle dein Paket</Label>
        <div className="grid lg:grid-cols-3 gap-4">
          {packageOptions.map((pkg) => (
            <Card
              key={pkg.value}
              className={cn(
                'relative p-5 cursor-pointer transition-all duration-200',
                selectedPackage === pkg.value
                  ? 'ring-2 ring-primary-600 shadow-lg'
                  : 'hover:shadow-md',
                pkg.popular && 'ring-2 ring-gold-400'
              )}
              onClick={() => setValue('packageType', pkg.value, { shouldValidate: true })}
            >
              {pkg.popular && (
                <Badge className="absolute -top-2 left-1/2 -translate-x-1/2 bg-gold-400 text-primary-900">
                  Beliebteste Wahl
                </Badge>
              )}

              <div className="flex items-center justify-between mb-3">
                <div>
                  <h4 className="font-semibold text-primary-900">{pkg.label}</h4>
                  <p className="text-xs text-gray-500">{pkg.delivery}</p>
                </div>
                <div className="text-right">
                  <span className="text-2xl font-bold text-primary-900">{pkg.price}</span>
                  <span className="text-gray-500 text-sm"> Euro</span>
                </div>
              </div>

              <ul className="space-y-1.5">
                {pkg.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-2 text-sm text-gray-600">
                    <Check className="w-4 h-4 text-primary-600" />
                    {feature}
                  </li>
                ))}
              </ul>

              {selectedPackage === pkg.value && (
                <div className="absolute top-3 right-3">
                  <div className="w-6 h-6 rounded-full bg-primary-600 flex items-center justify-center">
                    <Check className="w-4 h-4 text-white" />
                  </div>
                </div>
              )}
            </Card>
          ))}
        </div>
        {errors.packageType && (
          <p className="text-sm text-red-500">{errors.packageType.message}</p>
        )}
      </div>

      {/* Bundle Offers */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Package className="w-5 h-5 text-gold-500" />
          <Label>Spar-Bundles (Empfohlen)</Label>
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          {bundleOptions.map((bundle) => {
            const isSelected = selectedBundle === bundle.id;

            return (
              <Card
                key={bundle.id}
                className={cn(
                  'relative overflow-hidden cursor-pointer transition-all duration-300',
                  isSelected
                    ? 'ring-2 ring-gold-500 shadow-lg bg-gradient-to-br from-gold-50 via-white to-gold-50'
                    : 'hover:shadow-lg hover:border-gold-300'
                )}
                onClick={() => {
                  if (isSelected) {
                    setValue('selectedBundle', 'none');
                  } else {
                    setValue('selectedBundle', bundle.id as 'hochzeits-bundle' | 'perfekt-bundle');
                    // If Hochzeits-Bundle, set package to plus
                    if (bundle.id === 'hochzeits-bundle') {
                      setValue('packageType', 'plus');
                    }
                    // Clear individual bumps when bundle is selected
                    if (bundle.id === 'perfekt-bundle') {
                      setValue('bumpKaraoke', false);
                      setValue('bumpRush', false);
                      setValue('bumpGift', false);
                    }
                  }
                }}
              >
                <Badge className="absolute top-3 right-3 bg-red-500 text-white">
                  Spare {bundle.savings} Euro
                </Badge>
                <div className="p-5">
                  <div className="flex items-center gap-3 mb-2">
                    <div className={cn(
                      'w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors',
                      isSelected ? 'border-gold-500 bg-gold-500' : 'border-gray-300'
                    )}>
                      {isSelected && <Check className="w-4 h-4 text-white" />}
                    </div>
                    <h4 className="font-bold text-primary-900 text-lg">{bundle.label}</h4>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">{bundle.description}</p>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-bold text-gold-600">{bundle.price} Euro</span>
                    <span className="text-gray-400 line-through">{bundle.originalPrice} Euro</span>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Order Bumps */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-gold-500" />
          <Label>Einzelne Extras (optional)</Label>
        </div>
        <div className="space-y-3">
          {bumpOptions.map((bump) => {
            const fieldName = `bump${bump.id.charAt(0).toUpperCase() + bump.id.slice(1)}` as keyof SongFormData;
            const isChecked = watch(fieldName) as boolean;

            // Disable individual bumps if Perfekt-Bundle is selected
            const isDisabled = selectedBundle === 'perfekt-bundle' ||
              (selectedBundle === 'hochzeits-bundle' && (bump.id === 'karaoke' || bump.id === 'gift'));

            return (
              <label
                key={bump.id}
                className={cn(
                  'flex items-start gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all duration-200',
                  isDisabled && 'opacity-50 cursor-not-allowed',
                  isChecked && !isDisabled
                    ? 'border-gold-400 bg-gradient-to-r from-gold-50 to-white shadow-md'
                    : 'border-gray-200 hover:border-gold-200 hover:bg-gray-50'
                )}
              >
                <Checkbox
                  checked={isChecked || isDisabled}
                  disabled={isDisabled}
                  onCheckedChange={(checked) =>
                    setValue(fieldName, checked as boolean)
                  }
                  className="mt-0.5"
                />
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-primary-900">{bump.label}</span>
                      {isDisabled && (
                        <Badge variant="outline" className="text-xs">Im Bundle enthalten</Badge>
                      )}
                    </div>
                    <span className="font-semibold text-gold-600">+{bump.price} Euro</span>
                  </div>
                  <p className="text-sm text-gray-500 mt-0.5">{bump.description}</p>
                </div>
              </label>
            );
          })}
        </div>
      </div>
    </div>
  );
}
