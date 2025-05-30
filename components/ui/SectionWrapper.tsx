
import React from 'react';

interface SectionWrapperProps {
  title: string;
  children: React.ReactNode;
}

const SectionWrapper: React.FC<SectionWrapperProps> = ({ title, children }) => {
  return (
    <div className="bg-white p-6 md:p-8 rounded-xl shadow-lg mb-8">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6 border-b pb-3">{title}</h2>
      <div className="space-y-6">
        {children}
      </div>
    </div>
  );
};

export default SectionWrapper;
