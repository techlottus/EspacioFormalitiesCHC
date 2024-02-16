export interface AcademicHistoryData {
  card: HistoryCardInterface;
  areasData: AreaDataInterface[]
}

export interface HistoryCardInterface {
  campus: string;
  programType: string;
  studiedSubjects: number;
  totalSubjects: number;
  failedSubjects: number;
  approvedSubjects: number;
  advanceCredits: number;
  totalCredits: number;
  totalAverage: number;
}

export interface AreaDataInterface {
  areaName: string;
  areaAverage: number | string;
  subjects: AreaSubjectInterface[]
}

export interface AreaSubjectInterface {
  subjectKey: string;
  subjectName: string;
  evaluationType: string;
  grade: number;
  credits: number | string;
  schoolCycle: string;
  failed: boolean;
}
