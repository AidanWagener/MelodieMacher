'use client';

import { UseFormReturn } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { occasionOptions, type StoryFormData } from '@/lib/order-schema';
import { Heart, Users, MessageSquare } from 'lucide-react';

interface StoryStepProps {
  form: UseFormReturn<StoryFormData>;
}

export function StoryStep({ form }: StoryStepProps) {
  const {
    register,
    setValue,
    watch,
    formState: { errors },
  } = form;

  const storyLength = watch('story')?.length || 0;

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-600 to-gold-400 mb-4">
          <Heart className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-2xl font-display font-bold text-primary-900 mb-2">
          Erzaehl uns eure Geschichte
        </h2>
        <p className="text-gray-600">
          Je mehr Details, desto persoenlicher wird dein Song.
        </p>
      </div>

      {/* Recipient Name */}
      <div className="space-y-2">
        <Label htmlFor="recipientName" className="flex items-center gap-2">
          <Users className="w-4 h-4 text-primary-600" />
          Fuer wen ist der Song?
        </Label>
        <Input
          id="recipientName"
          placeholder="z.B. Lisa, Mama, Team Marketing..."
          {...register('recipientName')}
          className={errors.recipientName ? 'border-red-500' : ''}
        />
        {errors.recipientName && (
          <p className="text-sm text-red-500">{errors.recipientName.message}</p>
        )}
      </div>

      {/* Occasion */}
      <div className="space-y-2">
        <Label htmlFor="occasion">Was ist der Anlass?</Label>
        <Select
          value={watch('occasion')}
          onValueChange={(value) =>
            setValue('occasion', value as StoryFormData['occasion'], {
              shouldValidate: true,
            })
          }
        >
          <SelectTrigger className={errors.occasion ? 'border-red-500' : ''}>
            <SelectValue placeholder="Waehle einen Anlass..." />
          </SelectTrigger>
          <SelectContent>
            {occasionOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.occasion && (
          <p className="text-sm text-red-500">{errors.occasion.message}</p>
        )}
      </div>

      {/* Relationship */}
      <div className="space-y-2">
        <Label htmlFor="relationship">
          Wie ist eure Beziehung?
        </Label>
        <Input
          id="relationship"
          placeholder="z.B. Meine beste Freundin seit 10 Jahren, mein Ehemann, unsere Oma..."
          {...register('relationship')}
          className={errors.relationship ? 'border-red-500' : ''}
        />
        {errors.relationship && (
          <p className="text-sm text-red-500">{errors.relationship.message}</p>
        )}
      </div>

      {/* Story */}
      <div className="space-y-2">
        <Label htmlFor="story" className="flex items-center gap-2">
          <MessageSquare className="w-4 h-4 text-primary-600" />
          Eure Geschichte
        </Label>
        <Textarea
          id="story"
          placeholder="Erzaehl uns, was diesen Menschen besonders macht. Gemeinsame Erinnerungen, Insider-Witze, besondere Momente... Alles, was im Song vorkommen soll."
          rows={6}
          {...register('story')}
          className={errors.story ? 'border-red-500' : ''}
        />
        <div className="flex justify-between text-sm">
          {errors.story ? (
            <p className="text-red-500">{errors.story.message}</p>
          ) : (
            <p className="text-gray-400">
              {storyLength < 50
                ? `Noch ${50 - storyLength} Zeichen...`
                : 'Super, das reicht!'}
            </p>
          )}
          <p className="text-gray-400">{storyLength}/2000</p>
        </div>
      </div>

      {/* Helper Tips */}
      <div className="bg-primary-50 rounded-xl p-4">
        <h4 className="font-medium text-primary-900 mb-2">
          Tipps fuer den perfekten Song:
        </h4>
        <ul className="text-sm text-primary-700 space-y-1">
          <li>• Nenne konkrete Namen, Orte und Daten</li>
          <li>• Beschreibe besondere Momente oder Insider</li>
          <li>• Erwaehne Hobbys oder Eigenheiten</li>
          <li>• Was soll der Song beim Hoerer ausloesen?</li>
        </ul>
      </div>
    </div>
  );
}
