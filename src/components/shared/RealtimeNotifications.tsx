'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Music, CheckCircle } from 'lucide-react';

// Fake order data for social proof
const fakeOrders = [
  { name: 'Anna', city: 'Berlin', occasion: 'Hochzeit' },
  { name: 'Thomas', city: 'Muenchen', occasion: 'Geburtstag' },
  { name: 'Sarah', city: 'Hamburg', occasion: 'Jahrestag' },
  { name: 'Michael', city: 'Koeln', occasion: 'Hochzeit' },
  { name: 'Lisa', city: 'Frankfurt', occasion: 'Muttertag' },
  { name: 'Markus', city: 'Stuttgart', occasion: 'Vatertag' },
  { name: 'Julia', city: 'Dresden', occasion: 'Schlaflied' },
  { name: 'David', city: 'Leipzig', occasion: 'Firmenjubilaeum' },
  { name: 'Sandra', city: 'Duesseldorf', occasion: 'Abschied' },
  { name: 'Patrick', city: 'Nuernberg', occasion: 'Hochzeit' },
  { name: 'Nina', city: 'Hannover', occasion: 'Geburtstag' },
  { name: 'Stefan', city: 'Bremen', occasion: 'Verlobung' },
  { name: 'Katharina', city: 'Freiburg', occasion: 'Hochzeitstag' },
  { name: 'Andreas', city: 'Mannheim', occasion: 'Geburtstag' },
  { name: 'Melanie', city: 'Augsburg', occasion: 'Taufe' },
];

// Shuffle array helper
function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

// Get random interval between 30-45 seconds
function getRandomInterval(): number {
  return (30 + Math.random() * 15) * 1000;
}

// Get random minutes ago (1-30)
function getRandomMinutes(): number {
  return Math.floor(1 + Math.random() * 29);
}

export function RealtimeNotifications() {
  const [currentNotification, setCurrentNotification] = useState<typeof fakeOrders[0] | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [orderQueue, setOrderQueue] = useState<typeof fakeOrders>([]);
  const [minutesAgo, setMinutesAgo] = useState(5);

  // Initialize shuffled queue
  useEffect(() => {
    setOrderQueue(shuffleArray(fakeOrders));
  }, []);

  // Show notification
  const showNotification = useCallback(() => {
    if (orderQueue.length === 0) {
      setOrderQueue(shuffleArray(fakeOrders));
      return;
    }

    const [nextOrder, ...remainingOrders] = orderQueue;
    setCurrentNotification(nextOrder);
    setMinutesAgo(getRandomMinutes());
    setOrderQueue(remainingOrders);
    setIsVisible(true);

    // Hide after 5 seconds
    setTimeout(() => {
      setIsVisible(false);
    }, 5000);
  }, [orderQueue]);

  // Schedule notifications
  useEffect(() => {
    // Initial delay of 10 seconds before first notification
    const initialDelay = setTimeout(() => {
      showNotification();
    }, 10000);

    return () => clearTimeout(initialDelay);
  }, [showNotification]);

  useEffect(() => {
    if (!isVisible && currentNotification) {
      // Schedule next notification after random interval
      const nextInterval = setTimeout(() => {
        showNotification();
      }, getRandomInterval());

      return () => clearTimeout(nextInterval);
    }
  }, [isVisible, currentNotification, showNotification]);

  return (
    <AnimatePresence>
      {isVisible && currentNotification && (
        <motion.div
          initial={{ opacity: 0, x: -100, y: 20 }}
          animate={{ opacity: 1, x: 0, y: 0 }}
          exit={{ opacity: 0, x: -100 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          className="fixed bottom-4 left-4 z-40 max-w-sm hidden lg:block"
        >
          <div className="bg-white rounded-xl shadow-xl shadow-primary-900/10 border border-gray-100 p-4 flex items-start gap-4">
            {/* Icon */}
            <div className="flex-shrink-0 w-12 h-12 rounded-full bg-gradient-to-br from-primary-100 to-primary-50 flex items-center justify-center">
              <Music className="w-6 h-6 text-primary-600" />
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span className="text-xs text-gray-500">Gerade bestellt</span>
              </div>
              <p className="text-sm text-primary-900 font-medium truncate">
                Song fuer {currentNotification.name} aus {currentNotification.city}
              </p>
              <p className="text-xs text-gray-500">
                {currentNotification.occasion} - vor {minutesAgo} Min.
              </p>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
