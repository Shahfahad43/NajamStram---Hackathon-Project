import React from 'react';
import Card from '../components/Card';

const Privacy: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">Privacy Policy</h1>
      <Card className="space-y-6">
        <section>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">1. Information We Collect</h2>
          <p className="text-gray-600 dark:text-gray-300">
            At NajamStream, we collect information that you provide directly to us, such as when you create an account, update your profile, or communicate with us. This may include your name, email address, and profile picture.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">2. How We Use Your Information</h2>
          <p className="text-gray-600 dark:text-gray-300">
            We use the information we collect to operate, maintain, and improve our streaming services. This includes personalizing your experience, processing your requests, and sending you technical notices and support messages.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">3. Content and Streaming</h2>
          <p className="text-gray-600 dark:text-gray-300">
            Any content you stream or upload to NajamStream is public. Please be aware that other users can view, share, and interact with your streams. We are not responsible for how other users use your public content.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">4. Cookies and Tracking</h2>
          <p className="text-gray-600 dark:text-gray-300">
            We use cookies and similar tracking technologies to track the activity on our service and hold certain information. You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">5. Contact Us</h2>
          <p className="text-gray-600 dark:text-gray-300">
            If you have any questions about this Privacy Policy, please contact us via the link in our footer.
          </p>
        </section>
      </Card>
    </div>
  );
};

export default Privacy;