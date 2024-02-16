export interface ReportCardData {
  card: CreditsInterface;
  subjects: ReportCardSubjectInterface[];
  partialAverages: PartialAverageInterface[];
}

export interface CreditsInterface {
  advanceCredits: number;
  totalCredits: number;
}

export interface ReportCardSubjectInterface {
  subjectName: string;
  subjectKey: string;
  partials: PartialDataInterface[];
  finalAverage: number | string;
  totalAbsences: number | string;
  failed: boolean;
  absencesAlert: boolean;
}

export interface PartialWithNumbersInterface {
  partialNumber: number;
  grade: number;
  absence: number | string;
}

export interface PartialDataInterface {
  partialNumber: number;
  grade: number | string;
  absence: number | string;
}

export interface PartialAverageInterface {
  partial: number;
  partialAverage: any;
}
