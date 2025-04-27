import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShieldCheckIcon, LockIcon, FolderIcon, FileTextIcon } from 'lucide-react';
import Navbar from '../components/Navbar';
import Button from '../components/Button';

const LandingPage: React.FC = () => {
  const fadeIn = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
  };
  
  const features = [
    {
      icon: <ShieldCheckIcon size={24} className="text-secondary-500" />,
      title: 'Secure Storage',
      description: 'All your evidence is protected with multiple layers of security, including folder passwords and secret keys.'
    },
    {
      icon: <LockIcon size={24} className="text-secondary-500" />,
      title: 'Password Protection',
      description: 'Each evidence folder is password protected, ensuring only authorized personnel can access sensitive data.'
    },
    {
      icon: <FolderIcon size={24} className="text-secondary-500" />,
      title: 'Organized Management',
      description: 'Categorize and organize evidence within folders for easy access and management.'
    },
    {
      icon: <FileTextIcon size={24} className="text-secondary-500" />,
      title: 'Multi-format Support',
      description: 'Upload and store various types of evidence including images, videos, and audio files.'
    }
  ];
  
  return (
    <div className="min-h-screen bg-neutral-50 flex flex-col">
      <Navbar />
      
      {/* Hero Section */}
      <motion.section 
        className="bg-gradient-to-r from-primary-900 to-primary-800 text-white py-16 px-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <div className="container mx-auto max-w-6xl flex flex-col lg:flex-row items-center">
          <motion.div 
            className="lg:w-1/2 mb-8 lg:mb-0 lg:pr-12"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Secure and Reliable Evidence Management
            </h1>
            <p className="text-lg text-neutral-200 mb-8">
              Protect your sensitive evidence with military-grade encryption. Store, organize, and access your evidence securely from anywhere.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/signup">
                <Button size="lg" variant="secondary">
                  Get Started
                </Button>
              </Link>
              <Link to="/login">
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:bg-opacity-10">
                  Log In
                </Button>
              </Link>
            </div>
          </motion.div>
          
          <motion.div 
            className="lg:w-1/2"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <div className="bg-white rounded-lg shadow-2xl overflow-hidden">
              <div className="bg-neutral-800 py-2 px-4 flex items-center">
                <div className="flex space-x-2">
                  <div className="h-3 w-3 rounded-full bg-red-500"></div>
                  <div className="h-3 w-3 rounded-full bg-yellow-500"></div>
                  <div className="h-3 w-3 rounded-full bg-green-500"></div>
                </div>
              </div>
              <div className="p-4 bg-white">
                <div className="h-64 bg-neutral-100 rounded-md flex items-center justify-center">
                  <div className="text-center">
                    <ShieldCheckIcon size={64} className="mx-auto text-secondary-500 mb-4" />
                    <p className="text-neutral-900 font-medium">Evidence Vault Dashboard</p>
                    <p className="text-neutral-500 text-sm">Secure &bull; Reliable &bull; Organized</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.section>
      
      {/* Features Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <motion.div 
            className="text-center mb-12"
            {...fadeIn}
          >
            <h2 className="text-3xl font-bold text-neutral-900 mb-4">
              Why Choose Evidence Vault?
            </h2>
            <p className="text-neutral-600 max-w-2xl mx-auto">
              Our evidence management system provides the highest level of security while maintaining ease of use and organization.
            </p>
          </motion.div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div 
                key={index}
                className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 * index }}
              >
                <div className="p-2 bg-neutral-100 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-neutral-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-neutral-600">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Call to Action */}
      <motion.section 
        className="bg-accent-500 text-white py-16 px-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-3xl font-bold mb-4">
            Ready to secure your evidence?
          </h2>
          <p className="text-xl mb-8 text-white text-opacity-90">
            Join thousands of professionals who trust Evidence Vault with their most sensitive data.
          </p>
          <Link to="/signup">
            <Button 
              size="lg" 
              variant="primary" 
              className="bg-white text-accent-600 hover:bg-neutral-100"
            >
              Get Started Now
            </Button>
          </Link>
        </div>
      </motion.section>
      
      {/* Footer */}
      <footer className="bg-neutral-900 text-white py-8 px-4">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center mb-4 md:mb-0">
              <ShieldCheckIcon className="text-secondary-500 mr-2" size={20} />
              <span className="font-bold text-lg">Evidence Vault</span>
            </div>
            <div className="text-sm text-neutral-400">
              © 2025 Evidence Vault. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;