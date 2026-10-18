import React from 'react';
import { Link } from 'react-router-dom';
import { SparkIcon } from '../components/Icons';

export const NotFoundPage: React.FC = () => {
  return (
    <div className="max-w-md mx-auto px-4 py-20 text-center space-y-4">
      <SparkIcon className="w-16 h-16 text-[#12A5B0] mx-auto" />
      <h1 className="font-heading font-bold text-3xl text-[#0B3561]">404 - Page Not Found</h1>
      <p className="font-body text-xs text-[#3C5D81]">
        The page or book you were looking for could not be found.
      </p>
      <Link
        to="/"
        className="inline-block bg-[#0B3561] text-white font-heading font-bold px-6 py-3 rounded-xl text-xs hover:bg-[#071E38] transition shadow-md"
      >
        Back to Homepage
      </Link>
    </div>
  );
};
