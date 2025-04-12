'use client';

import { motion } from 'framer-motion';
import { MessageSquare, Users } from 'lucide-react';
import { useEffect } from 'react';

import { useAuth } from '@/hooks/useAuth';
import { useRouter } from '@/hooks/useRouter';

const HomePage = () => {
  const router = useRouter();
  const { profile, loading } = useAuth();

  useEffect(() => {
    if (!profile && !loading) {
      router.push('/login');
    }
  }, [profile, loading, router]);

  const features = [
    {
      title: 'Real-time Messaging',
      description: 'Send and receive messages instantly with our lightning-fast infrastructure.',
      icon: <MessageSquare className="h-6 w-6 text-sky-400" />,
    },
    {
      title: 'Group Chats',
      description: 'Create groups for teams, friends, or communities with advanced management tools.',
      icon: <Users className="h-6 w-6 text-sky-400" />,
    },
    {
      title: 'End-to-End Encryption',
      description: 'Your conversations are secure with our advanced encryption technology.',
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-6 w-6 text-sky-400"
        >
          <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
          <path d="M7 11V7a5 5 0 0 1 10 0v4" />
        </svg>
      ),
    },
    {
      title: 'File Sharing',
      description: 'Share documents, images, and media files with ease and preview them inline.',
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-6 w-6 text-sky-400"
        >
          <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
          <polyline points="14 2 14 8 20 8" />
        </svg>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-10 left-10 w-64 h-64 bg-sky-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 right-10 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-sky-400/5 rounded-full blur-3xl"></div>
      </div>

      {/* Header */}
      <header className="relative z-10 py-4 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <MessageSquare className="h-8 w-8 text-sky-400" />
            <span className="text-xl font-bold text-black dark:text-white">ChatSync</span>
          </div>
        </div>
      </header>

      {/* Features Section */}
      <section className="relative z-10 py-16 px-4 sm:px-6 lg:px-8 bg-neutral-100 dark:bg-gray-900/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-black dark:text-white">Why Choose ChatSync?</h2>
            <p className="mt-4 text-neutral-600 dark:text-gray-400 max-w-2xl mx-auto">
              Our platform offers everything you need for seamless communication
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 * index }}
                className="bg-neutral-200/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border 
                border-neutral-400/50 dark:border-gray-700/50 hover:border-sky-500/50 transition-all duration-300"
              >
                <div className="w-12 h-12 rounded-lg bg-sky-400/20 dark:bg-sky-500/20 flex items-center justify-center mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-2 text-neutral-700 dark:text-white">{feature.title}</h3>
                <p className="text-neutral-500 dark:text-gray-400">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
