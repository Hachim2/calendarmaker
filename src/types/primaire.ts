export interface SubjectSchedule {
  level: string;
  subject: string;
  hours: number;
}

export const cpSchedule: SubjectSchedule[] = [
  { level: "CP", subject: "Français", hours: 10 },
  { level: "CP", subject: "Mathématiques", hours: 5 },
  { level: "CP", subject: "Éducation physique et sportive", hours: 3 },
  { level: "CP", subject: "Langues vivantes", hours: 1 },
  { level: "CP", subject: "Arts plastiques", hours: 1 },
  { level: "CP", subject: "Éducation musicale", hours: 1 },
  { level: "CP", subject: "Sciences et technologie", hours: 2 },
  { level: "CP", subject: "Histoire et géographie", hours: 0 }, // Intégré
  { level: "CP", subject: "Enseignement moral et civique", hours: 1 },
];

export const ce1Schedule: SubjectSchedule[] = [
  { level: "CE1", subject: "Français", hours: 10 },
  { level: "CE1", subject: "Mathématiques", hours: 5 },
  { level: "CE1", subject: "Éducation physique et sportive", hours: 3 },
  { level: "CE1", subject: "Langues vivantes", hours: 1.5 },
  { level: "CE1", subject: "Arts plastiques", hours: 1 },
  { level: "CE1", subject: "Éducation musicale", hours: 1 },
  { level: "CE1", subject: "Questionner le monde / Sciences et technologie", hours: 2 },
  { level: "CE1", subject: "Histoire et géographie", hours: 0 }, // Intégré
  { level: "CE1", subject: "Enseignement moral et civique", hours: 0.5 },
];

export const ce2Schedule: SubjectSchedule[] = [
  { level: "CE2", subject: "Français", hours: 8 },
  { level: "CE2", subject: "Mathématiques", hours: 5 },
  { level: "CE2", subject: "Éducation physique et sportive", hours: 3 },
  { level: "CE2", subject: "Langues vivantes", hours: 1.5 },
  { level: "CE2", subject: "Arts plastiques", hours: 1 },
  { level: "CE2", subject: "Éducation musicale", hours: 1 },
  { level: "CE2", subject: "Questionner le monde / Sciences et technologie", hours: 2.5 },
  { level: "CE2", subject: "Histoire et géographie", hours: 0 }, // Intégré
  { level: "CE2", subject: "Enseignement moral et civique", hours: 1 },
];

export const cm1Schedule: SubjectSchedule[] = [
  { level: "CM1", subject: "Français", hours: 8 },
  { level: "CM1", subject: "Mathématiques", hours: 5 },
  { level: "CM1", subject: "Éducation physique et sportive", hours: 3 },
  { level: "CM1", subject: "Langues vivantes", hours: 1.5 },
  { level: "CM1", subject: "Arts plastiques", hours: 1 },
  { level: "CM1", subject: "Éducation musicale", hours: 1 },
  { level: "CM1", subject: "Questionner le monde / Sciences et technologie", hours: 2 },
  { level: "CM1", subject: "Histoire et géographie", hours: 2.5 },
  { level: "CM1", subject: "Enseignement moral et civique", hours: 1 },
];

export const cm2Schedule: SubjectSchedule[] = [
  { level: "CM2", subject: "Français", hours: 8 },
  { level: "CM2", subject: "Mathématiques", hours: 5 },
  { level: "CM2", subject: "Éducation physique et sportive", hours: 3 },
  { level: "CM2", subject: "Langues vivantes", hours: 1.5 },
  { level: "CM2", subject: "Arts plastiques", hours: 1 },
  { level: "CM2", subject: "Éducation musicale", hours: 1 },
  { level: "CM2", subject: "Questionner le monde / Sciences et technologie", hours: 2 },
  { level: "CM2", subject: "Histoire et géographie", hours: 2.5 },
  { level: "CM2", subject: "Enseignement moral et civique", hours: 1 },
];

export const allSchedules: { [key: string]: SubjectSchedule[] } = {
  CP: cpSchedule,
  CE1: ce1Schedule,
  CE2: ce2Schedule,
  CM1: cm1Schedule,
  CM2: cm2Schedule,
}; 