import { Suspense } from 'react';
import { ThankYouContent } from './ThankYouContent';

export const metadata = {
  title: 'Vielen Dank! | MelodieMacher',
  description: 'Deine Bestellung ist eingegangen. Wir beginnen jetzt mit der Erstellung deines Songs.',
};

export default function ThankYouPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
      }
    >
      <ThankYouContent />
    </Suspense>
  );
}
