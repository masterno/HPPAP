
import { PainWorstTimeOption, LikertScaleOptions, HPPAPData, SpecificLifeDomainImpact } from './types';

export const PAIN_DESCRIPTORS_OPTIONS: string[] = [
  "Aching", "Sharp", "Burning", "Throbbing", "Stabbing",
  "Tingling", "Numbness", "Cramping", "Radiating",
];

export const PAIN_WORST_TIME_OPTIONS_MAP: { label: string; value: PainWorstTimeOption }[] = [
  { label: "Morning", value: PainWorstTimeOption.Morning },
  { label: "Afternoon", value: PainWorstTimeOption.Afternoon },
  { label: "Evening", value: PainWorstTimeOption.Evening },
  { label: "Night", value: PainWorstTimeOption.Night },
  { label: "No specific pattern", value: PainWorstTimeOption.NoPattern },
  { label: "Varies greatly", value: PainWorstTimeOption.Varies },
];

export const LIKERT_OPTIONS_MAP: { label: string; value: LikertScaleOptions }[] = [
  { label: "Never", value: LikertScaleOptions.Never },
  { label: "Rarely", value: LikertScaleOptions.Rarely },
  { label: "Sometimes", value: LikertScaleOptions.Sometimes },
  { label: "Often", value: LikertScaleOptions.Often },
  { label: "Very Often", value: LikertScaleOptions.VeryOften },
];

export const IMPACT_DOMAINS_LABELS: { key: keyof SpecificLifeDomainImpact; label: string }[] = [
  { key: "physicalTasks", label: "Ability to perform physical tasks (e.g., lifting, bending, walking far)" },
  { key: "sleep", label: "Sleep (e.g., falling asleep, staying asleep, restful sleep)" },
  { key: "mood", label: "Mood (e.g., feeling down, irritable, anxious due to pain)" },
  { key: "concentration", label: "Concentration and thinking clearly" },
  { key: "socialActivities", label: "Social activities and relationships with others" },
  { key: "hobbies", label: "Enjoyment of hobbies and leisure activities" },
  { key: "workResponsibilities", label: "Work or regular responsibilities (including housework)" },
];

export const COPING_STRATEGIES_OPTIONS: string[] = [
  "Pain medication (prescribed)",
  "Pain medication (over-the-counter)",
  "Physical therapy/exercises",
  "Heat/cold application",
  "Rest",
  "Pacing activities",
  "Mindfulness/meditation",
  "Distraction (e.g., hobbies)",
  "Social support",
];

export const SUPPORT_NEEDED_OPTIONS: string[] = [
  "More information",
  "Medical advice",
  "Support from family/friends",
  "New strategies",
];

export const INITIAL_HPPAP_DATA: HPPAPData = {
  painSnapshot: {
    currentPainIntensity: null,
    primaryPainLocation: [],
    painDescriptors: [],
    otherPainDescriptor: "",
  },
  painPatternsTriggers: {
    avgPainLast7Days: null,
    worstPainLast7Days: null,
    leastPainLast7Days: null,
    painWorstTime: null,
    activitiesWorstPain: null,
    activitiesWorstPainDesc: "",
    activitiesBetterPain: null,
    activitiesBetterPainDesc: "",
  },
  impactDailyLife: {
    generalInterference: null,
    specificLifeDomains: {
      physicalTasks: null,
      sleep: null,
      mood: null,
      concentration: null,
      socialActivities: null,
      hobbies: null,
      workResponsibilities: null,
    },
  },
  emotionalWellbeing: {
    emotionalResponse: {
      frustrated: null,
      anxious: null,
      hopeless: null,
      angry: null,
    },
    positiveOutlook: null,
  },
  copingManagement: {
    currentStrategies: [],
    otherStrategy: "",
    mainStrategiesToRate: [],
    mainStrategiesHelpfulness: [],
    confidenceInManagement: null,
  },
  personalGoalsActionPlanner: {
    mostImpactfulLimitation: "",
    smallAchievableGoal: "",
    supportNeeded: [],
    otherSupportNeeded: "",
  },
};

export const BODY_PARTS_DEFINITIONS: { id: string; name: string; path: string }[] = [
    { id: 'head', name: 'Head', path: 'M50,10 C20,10 10,40 10,60 S20,110 50,110 S90,80 90,60 S80,10 50,10 Z' },
    { id: 'neck', name: 'Neck', path: 'M45,110 H55 V130 H45 Z' },
    { id: 'torso', name: 'Torso/Chest/Abdomen', path: 'M30,130 H70 V230 H30 Z' },
    { id: 'left-arm', name: 'Left Arm', path: 'M30,130 L10,150 L15,200 L30,210 Z' },
    { id: 'right-arm', name: 'Right Arm', path: 'M70,130 L90,150 L85,200 L70,210 Z' },
    { id: 'left-leg', name: 'Left Leg', path: 'M30,230 L20,350 L40,350 L45,230 Z' },
    { id: 'right-leg', name: 'Right Leg', path: 'M70,230 L80,350 L60,350 L55,230 Z' },
    { id: 'left-hand', name: 'Left Hand', path: 'M15,200 L0,210 L5,220 L15,210 Z' },
    { id: 'right-hand', name: 'Right Hand', path: 'M85,200 L100,210 L95,220 L85,210 Z' },
    { id: 'left-foot', name: 'Left Foot', path: 'M20,350 L10,360 L30,370 L40,350 Z' },
    { id: 'right-foot', name: 'Right Foot', path: 'M80,350 L90,360 L70,370 L60,350 Z' },
];
