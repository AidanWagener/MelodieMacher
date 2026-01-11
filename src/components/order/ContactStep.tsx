'use client';

import { UseFormReturn } from 'react-hook-form';
import Link from 'next/link';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Card } from '@/components/ui/card';
import { type ContactFormData, type OrderFormData, calculateTotal, getOrderBreakdown, packageOptions, CUSTOM_LYRICS_PRICE } from '@/lib/order-schema';
import { User, Mail, Shield, Lock, CreditCard } from 'lucide-react';

interface ContactStepProps {
  form: UseFormReturn<ContactFormData>;
  orderData: Partial<OrderFormData>;
}

export function ContactStep({ form, orderData }: ContactStepProps) {
  const {
    register,
    setValue,
    watch,
    formState: { errors },
  } = form;

  const total = calculateTotal(orderData);
  const orderBreakdown = getOrderBreakdown(orderData);
  const selectedPackage = packageOptions.find((p) => p.value === orderData.packageType);

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-600 to-gold-400 mb-4">
          <CreditCard className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-2xl font-display font-bold text-primary-900 mb-2">
          Fast geschafft!
        </h2>
        <p className="text-gray-600">
          Noch deine Kontaktdaten, dann geht&apos;s zur sicheren Zahlung.
        </p>
      </div>

      {/* Order Summary */}
      <Card className="p-5 bg-gray-50 border-gray-200">
        <h3 className="font-semibold text-primary-900 mb-4">Deine Bestellung</h3>

        <div className="space-y-2 text-sm">
          {/* Dynamic Order Breakdown */}
          {orderBreakdown.map((item, index) => (
            <div key={index} className="flex justify-between">
              <span className="text-gray-600">{item.label}</span>
              <span className="font-medium">{item.price} Euro</span>
            </div>
          ))}

          {/* Language Preference Note */}
          {orderData.allowEnglish && (
            <div className="flex justify-between text-primary-600">
              <span>Englische Phrasen erlaubt</span>
              <span className="text-xs">inkl.</span>
            </div>
          )}

          {/* Divider */}
          <div className="border-t border-gray-300 my-3" />

          {/* Savings Display */}
          {(orderData.selectedBundle === 'hochzeits-bundle' || orderData.selectedBundle === 'perfekt-bundle') && (
            <div className="flex justify-between text-green-600">
              <span>Du sparst</span>
              <span className="font-medium">14 Euro</span>
            </div>
          )}

          {/* Total */}
          <div className="flex justify-between text-lg">
            <span className="font-semibold text-primary-900">Gesamt</span>
            <span className="font-bold text-primary-900">{total} Euro</span>
          </div>
          <p className="text-xs text-gray-500">inkl. 19% MwSt.</p>
        </div>

        {/* Song Details Summary */}
        <div className="mt-4 pt-4 border-t border-gray-200 space-y-1">
          <p className="text-sm text-gray-600">
            <span className="font-medium">Song fuer:</span> {orderData.recipientName}
          </p>
          <p className="text-sm text-gray-600">
            <span className="font-medium">Lieferung:</span> {selectedPackage?.delivery}
          </p>
          {orderData.hasCustomLyrics && orderData.customLyrics && (
            <p className="text-sm text-gray-600">
              <span className="font-medium">Eigene Lyrics:</span> {orderData.customLyrics.length} Zeichen
            </p>
          )}
        </div>
      </Card>

      {/* Contact Info */}
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="customerName" className="flex items-center gap-2">
            <User className="w-4 h-4 text-primary-600" />
            Dein Name
          </Label>
          <Input
            id="customerName"
            placeholder="Max Mustermann"
            {...register('customerName')}
            className={errors.customerName ? 'border-red-500' : ''}
          />
          {errors.customerName && (
            <p className="text-sm text-red-500">{errors.customerName.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="customerEmail" className="flex items-center gap-2">
            <Mail className="w-4 h-4 text-primary-600" />
            Deine E-Mail-Adresse
          </Label>
          <Input
            id="customerEmail"
            type="email"
            placeholder="max@beispiel.de"
            {...register('customerEmail')}
            className={errors.customerEmail ? 'border-red-500' : ''}
          />
          {errors.customerEmail && (
            <p className="text-sm text-red-500">{errors.customerEmail.message}</p>
          )}
          <p className="text-xs text-gray-500">
            Hierhin senden wir deinen fertigen Song.
          </p>
        </div>
      </div>

      {/* Legal Checkboxes */}
      <div className="space-y-4 pt-4">
        {/* Terms */}
        <label className="flex items-start gap-3 cursor-pointer">
          <Checkbox
            checked={watch('acceptTerms')}
            onCheckedChange={(checked) =>
              setValue('acceptTerms', checked as boolean, { shouldValidate: true })
            }
            className={errors.acceptTerms ? 'border-red-500' : ''}
          />
          <span className="text-sm text-gray-600">
            Ich akzeptiere die{' '}
            <Link href="/agb" target="_blank" className="text-primary-600 hover:underline">
              Allgemeinen Geschaeftsbedingungen
            </Link>
            . *
          </span>
        </label>
        {errors.acceptTerms && (
          <p className="text-sm text-red-500 ml-7">{errors.acceptTerms.message}</p>
        )}

        {/* Privacy */}
        <label className="flex items-start gap-3 cursor-pointer">
          <Checkbox
            checked={watch('acceptPrivacy')}
            onCheckedChange={(checked) =>
              setValue('acceptPrivacy', checked as boolean, { shouldValidate: true })
            }
            className={errors.acceptPrivacy ? 'border-red-500' : ''}
          />
          <span className="text-sm text-gray-600">
            Ich habe die{' '}
            <Link href="/datenschutz" target="_blank" className="text-primary-600 hover:underline">
              Datenschutzerklaerung
            </Link>{' '}
            gelesen und akzeptiert. *
          </span>
        </label>
        {errors.acceptPrivacy && (
          <p className="text-sm text-red-500 ml-7">{errors.acceptPrivacy.message}</p>
        )}

        {/* Withdrawal Waiver */}
        <label className="flex items-start gap-3 cursor-pointer">
          <Checkbox
            checked={watch('waiveWithdrawal')}
            onCheckedChange={(checked) =>
              setValue('waiveWithdrawal', checked as boolean, { shouldValidate: true })
            }
            className={errors.waiveWithdrawal ? 'border-red-500' : ''}
          />
          <span className="text-sm text-gray-600">
            Ich stimme zu, dass mit der Ausfuehrung des Vertrags vor Ablauf der
            Widerrufsfrist begonnen wird und erklaere mich damit einverstanden,
            dass mein Widerrufsrecht mit Beginn der Ausfuehrung erlischt. *
          </span>
        </label>
        {errors.waiveWithdrawal && (
          <p className="text-sm text-red-500 ml-7">{errors.waiveWithdrawal.message}</p>
        )}
      </div>

      {/* Trust Badges */}
      <div className="flex items-center justify-center gap-6 py-4 text-sm text-gray-500">
        <div className="flex items-center gap-2">
          <Shield className="w-5 h-5 text-green-600" />
          <span>Sichere Zahlung</span>
        </div>
        <div className="flex items-center gap-2">
          <Lock className="w-5 h-5 text-green-600" />
          <span>SSL-verschluesselt</span>
        </div>
      </div>
    </div>
  );
}
