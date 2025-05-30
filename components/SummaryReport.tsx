import React, { useRef, useState, useEffect } from 'react';
import { HPPAPData, LikertScaleOptions, PainWorstTimeOption, RatingScaleValue, RegularSectionId, SpecificLifeDomainImpact } from '../types';
import { IMPACT_DOMAINS_LABELS, BODY_PARTS_DEFINITIONS, PAIN_WORST_TIME_OPTIONS_MAP, LIKERT_OPTIONS_MAP } from '../constants';
import Button from './ui/Button';

// Declare global types for jspdf and html2canvas if not using ES6 imports
declare global {
  interface Window {
    jspdf: any;
    html2canvas: any;
  }
}

interface SummaryReportProps {
  data: HPPAPData;
  onEdit: (sectionId: RegularSectionId) => void;
}

const DataItem: React.FC<{ label: string; value: React.ReactNode; className?: string }> = ({ label, value, className }) => (
  <div className={`py-2 sm:grid sm:grid-cols-3 sm:gap-4 ${className}`}>
    <dt className="text-sm font-medium text-gray-600">{label}</dt>
    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{value !== undefined && value !== null && value !== '' ? value : 'Not specified'}</dd>
  </div>
);

const RatingDisplay: React.FC<{ value: RatingScaleValue }> = ({ value }) => (
  <span>{value !== null ? `${value} / 10` : 'Not specified'}</span>
);

const LikertDisplay: React.FC<{ value: LikertScaleOptions | null }> = ({ value }) => (
  <span>{value || 'Not specified'}</span>
);

const generateTextSummary = (data: HPPAPData, dateTimeString: string): string => {
  let summary = `Report Generated: ${dateTimeString}\n`;
  summary += "Holistic Pain Profile & Action Planner (HPPAP) Summary\n\n";

  summary += "== Section 1: Pain Snapshot ==\n";
  summary += `Current Pain Intensity: ${data.painSnapshot.currentPainIntensity !== null ? data.painSnapshot.currentPainIntensity + ' / 10' : 'Not specified'}\n`;
  summary += `Primary Pain Location(s): ${data.painSnapshot.primaryPainLocation.map(id => BODY_PARTS_DEFINITIONS.find(p => p.id === id)?.name || id).join(', ') || 'None selected'}\n`;
  summary += `Pain Descriptors: ${data.painSnapshot.painDescriptors.join(', ') || 'None selected'}\n`;
  if (data.painSnapshot.otherPainDescriptor) {
    summary += `Other Descriptor: ${data.painSnapshot.otherPainDescriptor}\n`;
  }
  summary += "\n";

  summary += "== Section 2: Pain Patterns & Triggers ==\n";
  summary += `Average Pain (Last 7 Days): ${data.painPatternsTriggers.avgPainLast7Days !== null ? data.painPatternsTriggers.avgPainLast7Days + ' / 10' : 'Not specified'}\n`;
  summary += `Worst Pain (Last 7 Days): ${data.painPatternsTriggers.worstPainLast7Days !== null ? data.painPatternsTriggers.worstPainLast7Days + ' / 10' : 'Not specified'}\n`;
  summary += `Least Pain (Last 7 Days): ${data.painPatternsTriggers.leastPainLast7Days !== null ? data.painPatternsTriggers.leastPainLast7Days + ' / 10' : 'Not specified'}\n`;
  const painWorstTimeLabel = PAIN_WORST_TIME_OPTIONS_MAP.find(opt => opt.value === data.painPatternsTriggers.painWorstTime)?.label;
  summary += `Pain Worst Time: ${painWorstTimeLabel || data.painPatternsTriggers.painWorstTime || 'Not specified'}\n`;
  summary += `Activities Worsening Pain: ${data.painPatternsTriggers.activitiesWorstPain === null ? 'Not specified' : (data.painPatternsTriggers.activitiesWorstPain ? `Yes: ${data.painPatternsTriggers.activitiesWorstPainDesc || 'Details not provided'}` : 'No')}\n`;
  summary += `Activities Improving Pain: ${data.painPatternsTriggers.activitiesBetterPain === null ? 'Not specified' : (data.painPatternsTriggers.activitiesBetterPain ? `Yes: ${data.painPatternsTriggers.activitiesBetterPainDesc || 'Details not provided'}` : 'No')}\n`;
  summary += "\n";
  
  summary += "== Section 3: Impact on Daily Life ==\n";
  summary += `General Interference: ${data.impactDailyLife.generalInterference !== null ? data.impactDailyLife.generalInterference + ' / 10' : 'Not specified'}\n`;
  IMPACT_DOMAINS_LABELS.forEach(domain => {
    const value = data.impactDailyLife.specificLifeDomains[domain.key as keyof SpecificLifeDomainImpact];
    summary += `${domain.label}: ${value !== null ? value + ' / 10' : 'Not specified'}\n`;
  });
  summary += "\n";

  summary += "== Section 4: Emotional Well-being & Pain ==\n";
  const emotionalResponsesMap = {
    frustrated: "Felt Frustrated",
    anxious: "Felt Anxious/Worried",
    hopeless: "Felt Hopeless/Helpless",
    angry: "Felt Angry",
  };
  for (const [key, label] of Object.entries(emotionalResponsesMap)) {
    const value = data.emotionalWellbeing.emotionalResponse[key as keyof typeof data.emotionalWellbeing.emotionalResponse];
    summary += `${label}: ${LIKERT_OPTIONS_MAP.find(opt => opt.value === value)?.label || value || 'Not specified'}\n`;
  }
  summary += `Positive Outlook: ${LIKERT_OPTIONS_MAP.find(opt => opt.value === data.emotionalWellbeing.positiveOutlook)?.label || data.emotionalWellbeing.positiveOutlook || 'Not specified'}\n`;
  summary += "\n";

  summary += "== Section 5: Coping & Management Strategies ==\n";
  summary += `Current Strategies: ${data.copingManagement.currentStrategies.join(', ') || 'None selected'}\n`;
  if (data.copingManagement.otherStrategy) {
    summary += `Other Strategy: ${data.copingManagement.otherStrategy}\n`;
  }
  summary += `Strategies Rated for Helpfulness: ${data.copingManagement.mainStrategiesToRate.join(', ') || 'None rated'}\n`;
  data.copingManagement.mainStrategiesHelpfulness.forEach(sh => {
    summary += `Helpfulness of "${sh.strategy}": ${sh.helpfulness !== null ? sh.helpfulness + ' / 10' : 'Not specified'}\n`;
  });
  summary += `Confidence in Managing Pain: ${data.copingManagement.confidenceInManagement !== null ? data.copingManagement.confidenceInManagement + ' / 10' : 'Not specified'}\n`;
  summary += "\n";

  summary += "== Section 6: Personal Pain Goals & Action Planning ==\n";
  const impactfulLimitationLabel = IMPACT_DOMAINS_LABELS.find(d => d.key === data.personalGoalsActionPlanner.mostImpactfulLimitation)?.label || (data.personalGoalsActionPlanner.mostImpactfulLimitation === "generalInterference" ? "General Interference with Daily Life" : data.personalGoalsActionPlanner.mostImpactfulLimitation);
  summary += `Most Impactful Limitation to Improve: ${impactfulLimitationLabel || 'Not specified'}\n`;
  summary += `Small Achievable Goal: ${data.personalGoalsActionPlanner.smallAchievableGoal || 'Not specified'}\n`;
  summary += `Support Needed: ${data.personalGoalsActionPlanner.supportNeeded.join(', ') || 'None selected'}\n`;
  if (data.personalGoalsActionPlanner.otherSupportNeeded) {
    summary += `Other Support: ${data.personalGoalsActionPlanner.otherSupportNeeded}\n`;
  }
  summary += "\n";

  return summary;
};


const SummaryReport: React.FC<SummaryReportProps> = ({ data, onEdit }) => {
  const summaryReportRef = useRef<HTMLDivElement>(null);
  const [showCopyNotification, setShowCopyNotification] = useState(false);
  const [formattedDateTime, setFormattedDateTime] = useState<string>('');

  useEffect(() => {
    const now = new Date();
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric', month: 'long', day: 'numeric',
      hour: 'numeric', minute: '2-digit', hour12: true
    };
    setFormattedDateTime(now.toLocaleString(undefined, options));
  }, []);

  const {
    painSnapshot,
    painPatternsTriggers,
    impactDailyLife,
    emotionalWellbeing,
    copingManagement,
    personalGoalsActionPlanner,
  } = data;

  const handleDownloadPDF = async () => {
    const { jsPDF } = window.jspdf;
    const html2canvas = window.html2canvas;

    if (!summaryReportRef.current || !jsPDF || !html2canvas) {
      console.error("PDF generation resources not available.");
      alert("Sorry, PDF generation is currently unavailable. Please try again later.");
      return;
    }
    
    const reportElement = summaryReportRef.current;
    
    window.scrollTo(0, 0);
    
    reportElement.classList.add('pdf-padding');

    try {
      const canvas = await html2canvas(reportElement, { 
        scale: 2, 
        useCORS: true,
        logging: false,
        windowWidth: reportElement.scrollWidth,
        windowHeight: reportElement.scrollHeight,
        onclone: (documentClone) => {
            const clonedReportElement = documentClone.getElementById('summary-report-printable-area');
            if (clonedReportElement) {
                Array.from(clonedReportElement.querySelectorAll('.no-pdf-export, button[aria-label^="Edit"]')).forEach(el => (el as HTMLElement).style.display = 'none');
                 // Ensure datetime is visible in PDF if it was accidentally hidden by a general rule
                const dateTimeElement = clonedReportElement.querySelector('.report-datetime');
                if (dateTimeElement) {
                    (dateTimeElement as HTMLElement).style.visibility = 'visible';
                    (dateTimeElement as HTMLElement).style.display = 'block'; // or appropriate display type
                }
            }
        }
      });
      
      reportElement.classList.remove('pdf-padding'); 

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfPageHeight = pdf.internal.pageSize.getHeight();
      
      const imgProps = pdf.getImageProperties(imgData);
      const imgAspectRatio = imgProps.width / imgProps.height;
      
      const totalImgRenderHeightOnPdf = pdfWidth / imgAspectRatio;

      const pageSafetyMarginMm = 10; 
      const effectivePdfPageHeight = pdfPageHeight - pageSafetyMarginMm;

      let currentPositionInSourceImagePx = 0; 
      
      const sourceImagePixelsPerMmHeight = imgProps.height / totalImgRenderHeightOnPdf; 

      while (currentPositionInSourceImagePx < imgProps.height) {
        let chunkSourceHeightPx = Math.min(
          imgProps.height - currentPositionInSourceImagePx, 
          effectivePdfPageHeight * sourceImagePixelsPerMmHeight 
        );

        const sliceCanvas = document.createElement('canvas');
        sliceCanvas.width = imgProps.width;
        sliceCanvas.height = chunkSourceHeightPx;
        const sliceCtx = sliceCanvas.getContext('2d');

        if (sliceCtx) {
            sliceCtx.drawImage(canvas, 
                0, currentPositionInSourceImagePx, 
                imgProps.width, chunkSourceHeightPx, 
                0, 0, 
                imgProps.width, chunkSourceHeightPx 
            );
        }
        const sliceImgData = sliceCanvas.toDataURL('image/png');
        
        const sliceImgProps = pdf.getImageProperties(sliceImgData);
        const sliceRenderedHeightOnPdf = pdfWidth / (sliceImgProps.width / sliceImgProps.height);

        pdf.addImage(sliceImgData, 'PNG', 0, 0, pdfWidth, Math.min(sliceRenderedHeightOnPdf, pdfPageHeight));
        
        currentPositionInSourceImagePx += chunkSourceHeightPx;

        if (currentPositionInSourceImagePx < imgProps.height) {
          pdf.addPage();
        }
      }
      pdf.save('HPPAP_Summary.pdf');

    } catch (error) {
        console.error("Error generating PDF:", error);
        alert("An error occurred while generating the PDF. Please try again.");
        if(reportElement) reportElement.classList.remove('pdf-padding'); 
    }
  };

  const handleCopySummaryForEmail = () => {
    const textSummary = generateTextSummary(data, formattedDateTime);
    const subject = "My Holistic Pain Profile & Action Planner (HPPAP) Summary";
    const fullEmailContent = "Subject: " + subject + "\n\n" +
      "Hello,\n\nPlease find my HPPAP summary details below. This information can help facilitate discussions about my pain management.\n\n" +
      "You can also download this summary as a PDF from the application and attach it to an email if preferred.\n\n" +
      "------------------------------------------------------\n" +
      textSummary +
      "------------------------------------------------------\n\n" +
      "Thank you.";

    try {
      navigator.clipboard.writeText(fullEmailContent);
      setShowCopyNotification(true);
      setTimeout(() => {
        setShowCopyNotification(false);
      }, 3000);
      // Keep original alert for users who might miss the notification or for accessibility.
      alert("The summary content (including a suggested subject and body) has been copied to your clipboard. Please paste it into a new email message.");
    } catch (err) {
      console.warn("Failed to copy email content to clipboard:", err);
      alert("Could not copy to clipboard automatically. Please manually copy the text from the summary or use the Download PDF option.");
    }
  };


  return (
    <div className="bg-white p-6 md:p-8 rounded-xl shadow-lg">
      <div id="summary-report-printable-area" ref={summaryReportRef}>
        <h2 className="text-3xl font-semibold text-gray-800 mb-2">HPPAP Summary Report</h2>
        {formattedDateTime && (
          <p className="text-sm text-gray-600 mb-6 pb-3 border-b report-datetime">
            Report Generated: {formattedDateTime}
          </p>
        )}
        
        {/* Section 1 */}
        <div className="mb-6">
          <h3 className="text-xl font-semibold text-blue-700 mb-3 flex justify-between items-center">
            Pain Snapshot
            <button onClick={() => onEdit('painSnapshot')} aria-label="Edit Pain Snapshot" className="text-sm text-blue-500 hover:underline no-print no-pdf-export">Edit</button>
          </h3>
          <dl>
            <DataItem label="Current Pain Intensity" value={<RatingDisplay value={painSnapshot.currentPainIntensity} />} />
            <DataItem label="Primary Pain Location(s)" value={painSnapshot.primaryPainLocation.map(id => BODY_PARTS_DEFINITIONS.find(p => p.id === id)?.name || id).join(', ') || 'None selected'} />
            <DataItem label="Pain Descriptors" value={painSnapshot.painDescriptors.join(', ') || 'None selected'} />
            {painSnapshot.otherPainDescriptor && <DataItem label="Other Descriptor" value={painSnapshot.otherPainDescriptor} />}
          </dl>
        </div>

        {/* Section 2 */}
        <div className="mb-6">
          <h3 className="text-xl font-semibold text-blue-700 mb-3 flex justify-between items-center">
            Pain Patterns & Triggers
            <button onClick={() => onEdit('painPatternsTriggers')} aria-label="Edit Pain Patterns & Triggers" className="text-sm text-blue-500 hover:underline no-print no-pdf-export">Edit</button>
          </h3>
          <dl>
            <DataItem label="Average Pain (Last 7 Days)" value={<RatingDisplay value={painPatternsTriggers.avgPainLast7Days} />} />
            <DataItem label="Worst Pain (Last 7 Days)" value={<RatingDisplay value={painPatternsTriggers.worstPainLast7Days} />} />
            <DataItem label="Least Pain (Last 7 Days)" value={<RatingDisplay value={painPatternsTriggers.leastPainLast7Days} />} />
            <DataItem label="Pain Worst Time" value={PAIN_WORST_TIME_OPTIONS_MAP.find(opt => opt.value === painPatternsTriggers.painWorstTime)?.label || painPatternsTriggers.painWorstTime || 'Not specified'} />
            <DataItem label="Activities Worsening Pain" value={painPatternsTriggers.activitiesWorstPain === null ? 'Not specified' : (painPatternsTriggers.activitiesWorstPain ? `Yes: ${painPatternsTriggers.activitiesWorstPainDesc || 'Details not provided'}` : 'No')} />
            <DataItem label="Activities Improving Pain" value={painPatternsTriggers.activitiesBetterPain === null ? 'Not specified' : (painPatternsTriggers.activitiesBetterPain ? `Yes: ${painPatternsTriggers.activitiesBetterPainDesc || 'Details not provided'}` : 'No')} />
          </dl>
        </div>

        {/* Section 3 */}
        <div className="mb-6">
          <h3 className="text-xl font-semibold text-blue-700 mb-3 flex justify-between items-center">
            Impact on Daily Life
            <button onClick={() => onEdit('impactDailyLife')} aria-label="Edit Impact on Daily Life" className="text-sm text-blue-500 hover:underline no-print no-pdf-export">Edit</button>
          </h3>
          <dl>
            <DataItem label="General Interference" value={<RatingDisplay value={impactDailyLife.generalInterference} />} />
            {IMPACT_DOMAINS_LABELS.map(domain => (
              <DataItem 
                key={domain.key} 
                label={domain.label} 
                value={<RatingDisplay value={impactDailyLife.specificLifeDomains[domain.key as keyof typeof impactDailyLife.specificLifeDomains]} />} 
              />
            ))}
          </dl>
        </div>

        {/* Section 4 */}
        <div className="mb-6">
          <h3 className="text-xl font-semibold text-blue-700 mb-3 flex justify-between items-center">
            Emotional Well-being
            <button onClick={() => onEdit('emotionalWellbeing')} aria-label="Edit Emotional Well-being" className="text-sm text-blue-500 hover:underline no-print no-pdf-export">Edit</button>
          </h3>
          <dl>
            <DataItem label="Felt Frustrated" value={<LikertDisplay value={emotionalWellbeing.emotionalResponse.frustrated} />} />
            <DataItem label="Felt Anxious/Worried" value={<LikertDisplay value={emotionalWellbeing.emotionalResponse.anxious} />} />
            <DataItem label="Felt Hopeless/Helpless" value={<LikertDisplay value={emotionalWellbeing.emotionalResponse.hopeless} />} />
            <DataItem label="Felt Angry" value={<LikertDisplay value={emotionalWellbeing.emotionalResponse.angry} />} />
            <DataItem label="Positive Outlook" value={<LikertDisplay value={emotionalWellbeing.positiveOutlook} />} />
          </dl>
        </div>

        {/* Section 5 */}
         <div className="mb-6">
          <h3 className="text-xl font-semibold text-blue-700 mb-3 flex justify-between items-center">
            Coping & Management
            <button onClick={() => onEdit('copingManagement')} aria-label="Edit Coping & Management" className="text-sm text-blue-500 hover:underline no-print no-pdf-export">Edit</button>
          </h3>
          <dl>
            <DataItem label="Current Strategies" value={copingManagement.currentStrategies.join(', ') || 'None selected'} />
            {copingManagement.otherStrategy && <DataItem label="Other Strategy" value={copingManagement.otherStrategy} />}
            <DataItem label="Strategies Rated for Helpfulness" value={copingManagement.mainStrategiesToRate.join(', ') || 'None rated'} />
            {copingManagement.mainStrategiesHelpfulness.map(sh => (
               <DataItem key={sh.strategy} label={`Helpfulness of "${sh.strategy}"`} value={<RatingDisplay value={sh.helpfulness} />} />
            ))}
            <DataItem label="Confidence in Managing Pain" value={<RatingDisplay value={copingManagement.confidenceInManagement} />} />
          </dl>
        </div>

        {/* Section 6 */}
        <div className="mb-6">
          <h3 className="text-xl font-semibold text-blue-700 mb-3 flex justify-between items-center">
            Personal Goals & Action Plan
            <button onClick={() => onEdit('personalGoalsActionPlanner')} aria-label="Edit Personal Goals & Action Plan" className="text-sm text-blue-500 hover:underline no-print no-pdf-export">Edit</button>
          </h3>
          <dl>
            <DataItem label="Most Impactful Limitation to Improve" value={personalGoalsActionPlanner.mostImpactfulLimitation ? (IMPACT_DOMAINS_LABELS.find(d => d.key === personalGoalsActionPlanner.mostImpactfulLimitation)?.label || (personalGoalsActionPlanner.mostImpactfulLimitation === "generalInterference" ? "General Interference with Daily Life" : personalGoalsActionPlanner.mostImpactfulLimitation)) : 'Not specified'} />
            <DataItem label="Small Achievable Goal" value={personalGoalsActionPlanner.smallAchievableGoal} />
            <DataItem label="Support Needed" value={personalGoalsActionPlanner.supportNeeded.join(', ') || 'None selected'} />
            {personalGoalsActionPlanner.otherSupportNeeded && <DataItem label="Other Support" value={personalGoalsActionPlanner.otherSupportNeeded} />}
          </dl>
        </div>
      </div> {/* End of summary-report-printable-area */}

      {showCopyNotification && (
        <div className="mt-4 p-3 bg-green-100 text-green-700 text-sm rounded-md text-center no-print transition-opacity duration-300" role="alert">
          Summary copied to clipboard!
        </div>
      )}

       <div className="mt-8 pt-6 border-t border-gray-200 text-center space-y-3 md:space-y-0 md:flex md:justify-center md:space-x-3 no-print">
         <Button onClick={handleDownloadPDF} variant="secondary">
           Download PDF
         </Button>
         <Button onClick={handleCopySummaryForEmail} variant="secondary">
           Copy Summary for Email
         </Button>
       </div>
       <div className="mt-4 text-center no-print">
         <p className="text-sm text-gray-500">This report can be shared with your healthcare provider.</p>
       </div>
    </div>
  );
};

export default SummaryReport;