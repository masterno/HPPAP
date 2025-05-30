
import React from 'react';
import Button from './ui/Button';
import SectionWrapper from './ui/SectionWrapper';

interface CompletionPageProps {
  onStartOver: () => void;
}

const CompletionPage: React.FC<CompletionPageProps> = ({ onStartOver }) => {
  return (
    <SectionWrapper title="Next Steps & Resources">
      <div className="text-center space-y-6 py-8">
        <p className="text-lg text-gray-700">
          Visit Pain BC's{' '}
          <a
            href="https://development.painbc.ca/find-help"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:text-blue-800 underline font-medium"
            aria-label="Pain BC Get Help Webpage (opens in a new tab)"
          >
            Get Help webpage
          </a>{' '}
          for resources to help manage your pain.
        </p>
        <p className="text-sm text-gray-600 px-4">
          This tool is intended for self-monitoring and to facilitate informed discussions with healthcare providers. It is not a substitute for professional medical advice.
        </p>
        <div className="pt-4">
          <Button onClick={onStartOver} variant="primary" size="lg">
            Start Over
          </Button>
        </div>
      </div>
    </SectionWrapper>
  );
};

export default CompletionPage;
