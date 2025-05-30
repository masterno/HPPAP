
import React, { useState, useCallback, useEffect } from 'react';
import { HPPAPData, SectionInfo, RegularSectionId, DataSectionKey } from './types';
import { INITIAL_HPPAP_DATA } from './constants';
import Button from './components/ui/Button';
import ProgressBar from './components/ui/ProgressBar';
import SectionWrapper from './components/ui/SectionWrapper';
import CompletionPage from './components/CompletionPage'; // Import new component

// Import section components
import PainSnapshotSection from './components/sections/PainSnapshotSection';
import PainPatternsTriggersSection from './components/sections/PainPatternsTriggersSection';
import ImpactDailyLifeSection from './components/sections/ImpactDailyLifeSection';
import EmotionalWellbeingSection from './components/sections/EmotionalWellbeingSection';
import CopingManagementSection from './components/sections/CopingManagementSection';
import PersonalGoalsActionPlannerSection from './components/sections/PersonalGoalsActionPlannerSection';
import SummaryReport from './components/SummaryReport';


const SECTIONS_CONFIG: SectionInfo[] = [
  { id: "painSnapshot", title: "Section 1: Your Pain Snapshot", component: PainSnapshotSection },
  { id: "painPatternsTriggers", title: "Section 2: Pain Patterns & Triggers", component: PainPatternsTriggersSection },
  { id: "impactDailyLife", title: "Section 3: Impact on Daily Life", component: ImpactDailyLifeSection },
  { id: "emotionalWellbeing", title: "Section 4: Emotional Well-being & Pain", component: EmotionalWellbeingSection },
  { id: "copingManagement", title: "Section 5: Coping & Management Strategies", component: CopingManagementSection },
  { id: "personalGoalsActionPlanner", title: "Section 6: Personal Goals & Action Planning", component: PersonalGoalsActionPlannerSection },
  { id: "summaryReport", title: "Summary Report", component: SummaryReport as React.ComponentType<any> },
];

const App: React.FC = () => {
  const [hppapData, setHppapData] = useState<HPPAPData>(INITIAL_HPPAP_DATA);
  const [currentSectionIndex, setCurrentSectionIndex] = useState<number>(0);
  const [showCompletionPage, setShowCompletionPage] = useState<boolean>(false);
  
  const totalFormSections = SECTIONS_CONFIG.length -1; // Exclude summary for progress

  const updateData = useCallback(
    <SKey extends DataSectionKey, FKey extends keyof HPPAPData[SKey]>(
      sectionKey: SKey,
      field: FKey,
      value: HPPAPData[SKey][FKey]
    ) => {
      setHppapData(prevData => ({
        ...prevData,
        [sectionKey]: {
          ...prevData[sectionKey],
          [field]: value,
        },
      }));
    },
    []
  );

  const updateNestedData = useCallback(
    <SKey extends DataSectionKey, PField extends keyof HPPAPData[SKey], CField extends keyof HPPAPData[SKey][PField]>(
      sectionKey: SKey,
      parentField: PField,
      childField: CField,
      value: HPPAPData[SKey][PField][CField]
    ) => {
      setHppapData(prevData => {
        const section = prevData[sectionKey];
        const parentObject = section[parentField] as HPPAPData[SKey][PField]; // Type assertion
        return {
          ...prevData,
          [sectionKey]: {
            ...section,
            [parentField]: {
              ...parentObject,
              [childField]: value,
            },
          },
        };
      });
    },
    []
  );
  
  const handleNext = () => {
    if (currentSectionInfo.id === 'summaryReport') {
      setShowCompletionPage(true);
      window.scrollTo(0, 0);
    } else if (currentSectionIndex < SECTIONS_CONFIG.length - 1) {
      setCurrentSectionIndex(currentSectionIndex + 1);
      window.scrollTo(0, 0);
    }
  };

  const handlePrevious = () => {
    if (currentSectionIndex > 0) {
      setCurrentSectionIndex(currentSectionIndex - 1);
      window.scrollTo(0, 0);
    }
  };

  const handleEditSection = (sectionId: RegularSectionId) => {
    setShowCompletionPage(false); // Ensure completion page is hidden if editing
    const sectionIndex = SECTIONS_CONFIG.findIndex(sec => sec.id === sectionId);
    if (sectionIndex !== -1) {
      setCurrentSectionIndex(sectionIndex);
      window.scrollTo(0, 0);
    }
  };

  const handleStartOver = () => {
    setHppapData(INITIAL_HPPAP_DATA);
    setCurrentSectionIndex(0);
    setShowCompletionPage(false);
    window.scrollTo(0, 0);
  };

  const currentSectionInfo = SECTIONS_CONFIG[currentSectionIndex];
  const CurrentSectionComponent = currentSectionInfo.component;
  
  useEffect(() => {
    // API key logic placeholder
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  let nextButtonText = 'Next';
  if (currentSectionInfo.id === 'summaryReport') {
    nextButtonText = 'Done';
  } else if (currentSectionIndex === SECTIONS_CONFIG.length - 2) { // Last section before summary
    nextButtonText = 'View Summary';
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 to-sky-100 py-8 px-4 sm:px-6 lg:px-8 flex flex-col items-center">
      <header className="w-full max-w-3xl mb-8 text-center">
        <h1 className="text-4xl font-bold text-blue-700 tracking-tight">
          Holistic Pain Profile & Action Planner
        </h1>
        <p className="mt-2 text-lg text-gray-600">
          {showCompletionPage 
            ? "Your Holistic Pain Profile is complete. See below for resources and next steps." 
            : "Complete each section to build your comprehensive pain profile."}
        </p>
      </header>
      
      <main className="w-full max-w-3xl">
        {showCompletionPage ? (
          <CompletionPage onStartOver={handleStartOver} />
        ) : (
          <>
            {currentSectionInfo.id !== 'summaryReport' && (
              <ProgressBar currentStep={currentSectionIndex + 1} totalSteps={totalFormSections} />
            )}

            <SectionWrapper title={currentSectionInfo.title}>
              {currentSectionInfo.id === 'summaryReport' ? (
                <CurrentSectionComponent 
                  data={hppapData} 
                  onEdit={handleEditSection} 
                />
              ) : (
                <CurrentSectionComponent 
                  data={hppapData[currentSectionInfo.id as DataSectionKey]} 
                  updateData={updateData}
                  updateNestedData={updateNestedData}
                  allData={hppapData}
                />
              )}
            </SectionWrapper>

            <div className="mt-8 flex justify-between w-full max-w-3xl">
              <Button onClick={handlePrevious} disabled={currentSectionIndex === 0} variant="secondary">
                Previous
              </Button>
              <Button onClick={handleNext}>
                {nextButtonText}
              </Button>
            </div>
          </>
        )}
      </main>
      <footer className="mt-12 text-center text-sm text-gray-500">
        <p>&copy; {new Date().getFullYear()} HPPAP Open Source Project. Inspired by comprehensive pain assessment tools.</p>
      </footer>
    </div>
  );
};

export default App;
