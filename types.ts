
// General
export type RatingScaleValue = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | null;

export enum LikertScaleOptions {
  Never = "Never",
  Rarely = "Rarely",
  Sometimes = "Sometimes",
  Often = "Often",
  VeryOften = "Very Often",
}

// Section 1: Pain Snapshot (PS)
export interface PainSnapshotData {
  currentPainIntensity: RatingScaleValue;
  primaryPainLocation: string[]; // Array of body part IDs
  painDescriptors: string[];
  otherPainDescriptor: string;
}

// Section 2: Pain Patterns & Triggers (PPT)
export enum PainWorstTimeOption {
  Morning = "Morning",
  Afternoon = "Afternoon",
  Evening = "Evening",
  Night = "Night",
  NoPattern = "No specific pattern",
  Varies = "Varies greatly",
}
export interface PainPatternsTriggersData {
  avgPainLast7Days: RatingScaleValue;
  worstPainLast7Days: RatingScaleValue;
  leastPainLast7Days: RatingScaleValue;
  painWorstTime: PainWorstTimeOption | null;
  activitiesWorstPain: boolean | null;
  activitiesWorstPainDesc: string;
  activitiesBetterPain: boolean | null;
  activitiesBetterPainDesc: string;
}

// Section 3: Impact on Daily Life (IDL)
export interface SpecificLifeDomainImpact {
  physicalTasks: RatingScaleValue;
  sleep: RatingScaleValue;
  mood: RatingScaleValue;
  concentration: RatingScaleValue;
  socialActivities: RatingScaleValue;
  hobbies: RatingScaleValue;
  workResponsibilities: RatingScaleValue;
}
export interface ImpactDailyLifeData {
  generalInterference: RatingScaleValue;
  specificLifeDomains: SpecificLifeDomainImpact;
}

// Section 4: Emotional Well-being & Pain (EWP)
export interface EmotionalResponseData {
  frustrated: LikertScaleOptions | null;
  anxious: LikertScaleOptions | null;
  hopeless: LikertScaleOptions | null;
  angry: LikertScaleOptions | null;
}
export interface EmotionalWellbeingData {
  emotionalResponse: EmotionalResponseData;
  positiveOutlook: LikertScaleOptions | null;
}

// Section 5: Coping & Management Strategies (CMS)
export interface StrategyHelpfulness {
  strategy: string;
  helpfulness: RatingScaleValue;
}
export interface CopingManagementData {
  currentStrategies: string[];
  otherStrategy: string;
  mainStrategiesToRate: string[]; // User selected strategies from CMS1 to rate (max 3)
  mainStrategiesHelpfulness: StrategyHelpfulness[];
  confidenceInManagement: RatingScaleValue;
}

// Section 6: Personal Pain Goals & Action Planning (PPGA)
export interface PersonalGoalsActionPlannerData {
  mostImpactfulLimitation: string; 
  smallAchievableGoal: string;
  supportNeeded: string[];
  otherSupportNeeded: string;
}

export interface HPPAPData {
  painSnapshot: PainSnapshotData;
  painPatternsTriggers: PainPatternsTriggersData;
  impactDailyLife: ImpactDailyLifeData;
  emotionalWellbeing: EmotionalWellbeingData;
  copingManagement: CopingManagementData;
  personalGoalsActionPlanner: PersonalGoalsActionPlannerData;
}

export const SectionIds = [
  "painSnapshot",
  "painPatternsTriggers",
  "impactDailyLife",
  "emotionalWellbeing",
  "copingManagement",
  "personalGoalsActionPlanner",
  "summaryReport",
] as const;

export type SectionId = (typeof SectionIds)[number];
export type DataSectionKey = keyof HPPAPData; // e.g. "painSnapshot", "painPatternsTriggers", etc.
export type RegularSectionId = Exclude<SectionId, "summaryReport">;


export interface SectionProps {
  data: HPPAPData[DataSectionKey]; // Data for the specific section, will be a union here. Components will cast.
  updateData: <SKey extends DataSectionKey, FKey extends keyof HPPAPData[SKey]>(
    sectionKey: SKey,
    field: FKey,
    value: HPPAPData[SKey][FKey]
  ) => void;
  updateNestedData?: <SKey extends DataSectionKey, PField extends keyof HPPAPData[SKey], CField extends keyof HPPAPData[SKey][PField]>(
    sectionKey: SKey,
    parentField: PField,
    childField: CField,
    value: HPPAPData[SKey][PField][CField]
  ) => void;
  allData: HPPAPData;
}

export interface SummaryReportProps {
  data: HPPAPData;
  onEdit: (sectionId: RegularSectionId) => void;
}

export interface SectionInfo {
  id: SectionId;
  title: string;
  component: React.ComponentType<any>; // Use React.ComponentType<any> to allow different props
}
