import React from 'react';
import Card from '../components/Card';

const Terms: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">Terms of Service</h1>
      <Card className="space-y-6">
        <section>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">1. Acceptance of Terms</h2>
          <p className="text-gray-600 dark:text-gray-300">
            By accessing or using NajamStream, you agree to be bound by these Terms of Service. If you disagree with any part of the terms, you may not access the service.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">2. User Conduct</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-2">
            You are solely responsible for your conduct and any data, text, information, usernames, graphics, photos, profiles, and video links ("Content") that you submit, post, and display on NajamStream.
          </p>
          <ul className="list-disc pl-5 text-gray-600 dark:text-gray-300 space-y-1">
            <li>You must not defame, stalk, bully, abuse, harass, threaten, impersonate or intimidate others.</li>
            <li>You must not create or submit unwanted email, comments, likes or other forms of commercial or harassing communications (spam).</li>
            <li>You must not post violent, nude, partially nude, discriminatory, unlawful, infringing, hateful, pornographic or sexually suggestive photos or other content.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">3. Intellectual Property</h2>
          <p className="text-gray-600 dark:text-gray-300">
            NajamStream respects the intellectual property rights of others and expects users to do the same. We reserve the right to remove Content alleged to be infringing without prior notice, at our sole discretion, and without liability to you.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">4. Termination</h2>
          <p className="text-gray-600 dark:text-gray-300">
            We may terminate or suspend access to our Service immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">5. Changes to Terms</h2>
          <p className="text-gray-600 dark:text-gray-300">
            We reserve the right, at our sole discretion, to modify or replace these Terms at any time. What constitutes a material change will be determined at our sole discretion.
          </p>
        </section>
      </Card>
    </div>
  );
};

export default Terms;