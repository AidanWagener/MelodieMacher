'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, Bell, Check, Loader2, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { optInToReminder, isReminderEligibleOccasion } from '@/lib/reminders';

interface OccasionReminderSignupProps {
  customerEmail: string;
  customerName: string;
  recipientName: string;
  occasion: string;
  occasionDate: string;
  orderId: string;
  className?: string;
}

export function OccasionReminderSignup({
  customerEmail,
  customerName,
  recipientName,
  occasion,
  occasionDate,
  orderId,
  className = '',
}: OccasionReminderSignupProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSignedUp, setIsSignedUp] = useState(false);
  const [selectedDate, setSelectedDate] = useState(occasionDate);
  const [error, setError] = useState<string | null>(null);

  // Only show for eligible occasions
  if (!isReminderEligibleOccasion(occasion)) {
    return null;
  }

  const handleSignup = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await optInToReminder({
        customerEmail,
        customerName,
        recipientName,
        occasion,
        occasionDate: selectedDate,
        orderId,
      });

      if (result.success) {
        setIsSignedUp(true);
      } else {
        setError(result.message);
      }
    } catch (err) {
      setError('Etwas ist schiefgelaufen. Bitte versuche es erneut.');
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('de-DE', {
      day: 'numeric',
      month: 'long',
    });
  };

  if (isSignedUp) {
    return (
      <Card className={`p-6 bg-green-50 border-green-200 ${className}`}>
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
            <Check className="w-6 h-6 text-green-600" />
          </div>
          <div>
            <h3 className="font-medium text-green-900">Erinnerung aktiviert!</h3>
            <p className="text-sm text-green-700">
              Wir erinnern dich rechtzeitig vor {recipientName}s {occasion} am{' '}
              {formatDate(selectedDate)}.
            </p>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className={`overflow-hidden ${className}`}>
      {/* Header - Always visible */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full p-6 flex items-center justify-between text-left hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center">
            <Bell className="w-6 h-6 text-primary-600" />
          </div>
          <div>
            <h3 className="font-medium text-primary-900">
              Erinnere mich naechstes Jahr!
            </h3>
            <p className="text-sm text-gray-600">
              Nie wieder {recipientName}s {occasion} vergessen
            </p>
          </div>
        </div>
        {isExpanded ? (
          <ChevronUp className="w-5 h-5 text-gray-400" />
        ) : (
          <ChevronDown className="w-5 h-5 text-gray-400" />
        )}
      </button>

      {/* Expanded Content */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="px-6 pb-6 border-t border-gray-100 pt-4">
              <p className="text-sm text-gray-600 mb-4">
                Wir senden dir 2 Wochen vor dem Datum eine freundliche Erinnerung
                - mit einem besonderen Rabatt fuer deinen naechsten Song!
              </p>

              {/* Date Selection */}
              <div className="mb-4">
                <label
                  htmlFor="occasion-date"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Datum von {recipientName}s {occasion}
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    id="occasion-date"
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
              </div>

              {error && (
                <p className="text-sm text-red-600 mb-4">{error}</p>
              )}

              <Button
                onClick={handleSignup}
                disabled={isLoading}
                className="w-full"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Wird gespeichert...
                  </>
                ) : (
                  <>
                    <Bell className="w-4 h-4 mr-2" />
                    Erinnerung aktivieren
                  </>
                )}
              </Button>

              <p className="text-xs text-gray-500 mt-3 text-center">
                Du kannst die Erinnerung jederzeit abbestellen
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  );
}

export default OccasionReminderSignup;
