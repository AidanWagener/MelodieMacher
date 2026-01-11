'use client';

import { useState, useEffect, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { StoryStep } from './StoryStep';
import { SongStep } from './SongStep';
import { ContactStep } from './ContactStep';
import {
  storySchema,
  songSchema,
  contactSchema,
  type StoryFormData,
  type SongFormData,
  type ContactFormData,
  type OrderFormData,
  calculateTotal,
  packageOptions,
  bumpOptions,
} from '@/lib/order-schema';
import { ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  trackFormStep,
  trackPackageSelection,
  trackBumpAddition,
  trackViewContent,
} from '@/lib/analytics';
import { trackMetaInitiateCheckout } from '@/components/analytics/MetaPixel';
import { trackGA4BeginCheckout, trackGA4AddPaymentInfo } from '@/components/analytics/GoogleAnalytics';
import { getUTMForStripe } from '@/lib/utm';

const steps = [
  { id: 1, name: 'Deine Geschichte', shortName: 'Geschichte' },
  { id: 2, name: 'Dein Song', shortName: 'Song' },
  { id: 3, name: 'Bezahlung', shortName: 'Zahlung' },
];

export function OrderForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderData, setOrderData] = useState<Partial<OrderFormData>>({
    packageType: (searchParams.get('paket') as OrderFormData['packageType']) || 'plus',
    occasion: (searchParams.get('anlass') as OrderFormData['occasion']) || undefined,
  });

  // Form for each step
  const storyForm = useForm<StoryFormData>({
    resolver: zodResolver(storySchema),
    defaultValues: {
      recipientName: '',
      occasion: orderData.occasion,
      relationship: '',
      story: '',
    },
  });

  const songForm = useForm<SongFormData>({
    resolver: zodResolver(songSchema),
    defaultValues: {
      genre: undefined,
      mood: 3,
      packageType: orderData.packageType,
      bumpKaraoke: false,
      bumpRush: false,
      bumpGift: false,
    },
  });

  const contactForm = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      customerName: '',
      customerEmail: '',
      acceptTerms: false,
      acceptPrivacy: false,
      waiveWithdrawal: false,
    },
  });

  const progress = (currentStep / steps.length) * 100;

  // Track initial form view
  useEffect(() => {
    const pkg = packageOptions.find((p) => p.value === orderData.packageType);
    if (pkg) {
      trackViewContent({
        contentId: pkg.value,
        contentName: pkg.label,
        contentCategory: 'song_package',
        value: pkg.price,
        currency: 'EUR',
      });

      // Track InitiateCheckout on form load
      trackMetaInitiateCheckout({
        value: pkg.price,
        contentIds: [pkg.value],
        numItems: 1,
      });
    }

    // Track first form step
    trackFormStep({
      step: 1,
      stepName: 'Geschichte',
      formName: 'order_form',
    });
  }, []); // Only on mount

  // Track package selection changes
  const handlePackageChange = useCallback((packageType: string) => {
    const pkg = packageOptions.find((p) => p.value === packageType);
    if (pkg) {
      trackPackageSelection({
        packageId: pkg.value,
        packageName: pkg.label,
        price: pkg.price,
      });
    }
  }, []);

  // Track bump additions
  const handleBumpChange = useCallback((bumpId: string, isAdded: boolean) => {
    if (!isAdded) return;

    const bump = bumpOptions.find((b) => b.id === bumpId.replace('bump', '').toLowerCase());
    if (bump) {
      trackBumpAddition({
        bumpId: bump.id,
        bumpName: bump.label,
        price: bump.price,
      });
    }
  }, []);

  const handleNext = async () => {
    let isValid = false;

    if (currentStep === 1) {
      isValid = await storyForm.trigger();
      if (isValid) {
        setOrderData((prev) => ({ ...prev, ...storyForm.getValues() }));
      }
    } else if (currentStep === 2) {
      isValid = await songForm.trigger();
      if (isValid) {
        setOrderData((prev) => ({ ...prev, ...songForm.getValues() }));
      }
    }

    if (isValid && currentStep < steps.length) {
      const nextStep = currentStep + 1;
      setCurrentStep(nextStep);
      window.scrollTo({ top: 0, behavior: 'smooth' });

      // Track step completion and next step view
      trackFormStep({
        step: nextStep,
        stepName: steps[nextStep - 1].shortName,
        formName: 'order_form',
      });

      // If moving to payment step, track begin_checkout
      if (nextStep === 3) {
        const currentTotal = calculateTotal({
          ...orderData,
          ...songForm.getValues(),
        });
        const pkg = packageOptions.find((p) => p.value === songForm.getValues().packageType);

        trackGA4BeginCheckout({
          value: currentTotal,
          currency: 'EUR',
          items: pkg ? [{
            item_id: pkg.value,
            item_name: pkg.label,
            price: pkg.price,
            quantity: 1,
          }] : [],
        });
      }
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleSubmit = async () => {
    const isValid = await contactForm.trigger();
    if (!isValid) return;

    setIsSubmitting(true);

    // Track add_payment_info event
    trackGA4AddPaymentInfo({
      value: total,
      currency: 'EUR',
      paymentType: 'stripe',
    });

    const finalData: OrderFormData = {
      ...orderData,
      ...storyForm.getValues(),
      ...songForm.getValues(),
      ...contactForm.getValues(),
    } as OrderFormData;

    // Get UTM parameters for Stripe metadata
    const utmMetadata = getUTMForStripe();

    try {
      // Create Stripe checkout session with UTM metadata
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...finalData,
          metadata: utmMetadata,
        }),
      });

      const { url, error } = await response.json();

      if (error) {
        alert('Fehler: ' + error);
        setIsSubmitting(false);
        return;
      }

      // Redirect to Stripe Checkout
      window.location.href = url;
    } catch (error) {
      console.error('Checkout error:', error);
      alert('Ein Fehler ist aufgetreten. Bitte versuche es erneut.');
      setIsSubmitting(false);
    }
  };

  const total = calculateTotal({
    ...orderData,
    ...songForm.getValues(),
  });

  return (
    <div className="max-w-2xl mx-auto">
      {/* Progress Header */}
      <div className="mb-8">
        {/* Step Indicators */}
        <div className="flex items-center justify-between mb-4">
          {steps.map((step, index) => (
            <div
              key={step.id}
              className={cn(
                'flex items-center',
                index < steps.length - 1 && 'flex-1'
              )}
            >
              <div className="flex items-center">
                <div
                  className={cn(
                    'w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors',
                    currentStep >= step.id
                      ? 'bg-primary-600 text-white'
                      : 'bg-gray-200 text-gray-500'
                  )}
                >
                  {step.id}
                </div>
                <span
                  className={cn(
                    'ml-2 text-sm font-medium hidden sm:inline',
                    currentStep >= step.id ? 'text-primary-900' : 'text-gray-500'
                  )}
                >
                  {step.shortName}
                </span>
              </div>
              {index < steps.length - 1 && (
                <div
                  className={cn(
                    'flex-1 h-0.5 mx-4 transition-colors',
                    currentStep > step.id ? 'bg-primary-600' : 'bg-gray-200'
                  )}
                />
              )}
            </div>
          ))}
        </div>

        {/* Progress Bar */}
        <Progress value={progress} className="h-2" />
      </div>

      {/* Form Steps */}
      <div className="bg-white rounded-2xl shadow-xl shadow-gray-900/5 border border-gray-100 p-6 sm:p-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            {currentStep === 1 && <StoryStep form={storyForm} />}
            {currentStep === 2 && <SongStep form={songForm} />}
            {currentStep === 3 && (
              <ContactStep
                form={contactForm}
                orderData={{
                  ...orderData,
                  ...storyForm.getValues(),
                  ...songForm.getValues(),
                }}
              />
            )}
          </motion.div>
        </AnimatePresence>

        {/* Navigation */}
        <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-100">
          <Button
            type="button"
            variant="ghost"
            onClick={handleBack}
            disabled={currentStep === 1}
            className={cn(currentStep === 1 && 'invisible')}
          >
            <ChevronLeft className="w-4 h-4 mr-2" />
            Zurueck
          </Button>

          {currentStep < steps.length ? (
            <Button type="button" onClick={handleNext} size="lg">
              Weiter
              <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
          ) : (
            <Button
              type="button"
              onClick={handleSubmit}
              disabled={isSubmitting}
              size="lg"
              className="min-w-[200px]"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Wird geladen...
                </>
              ) : (
                <>
                  Zahlungspflichtig bestellen ({total} Euro)
                </>
              )}
            </Button>
          )}
        </div>
      </div>

      {/* Trust Footer */}
      <div className="text-center mt-6 text-sm text-gray-500">
        <p>Sichere Zahlung mit SSL-Verschluesselung</p>
        <p>100% Gaensehaut-Garantie | Kein Risiko</p>
      </div>
    </div>
  );
}
