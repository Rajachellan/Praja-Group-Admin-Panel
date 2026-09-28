export interface ICareer {
  _id?: string;
  jobName: string;
  jobRole: string;
  experience: string;
  resposnibilities: string[];
  qualification: string[];
  createdAt?: string;
  updatedAt?: string;
}

export interface CareerFormData {
  jobName: string;
  jobRole: string;
  experience: string;
  resposnibilities: string[];
  qualification: string[];
}
