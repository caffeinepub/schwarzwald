export type ResidenceId =
  | "waldhaus-tannenhof"
  | "forsthaus-hirschgrund"
  | "domizil-fichtenberg"
  | "domizil-schwarzwaldblick";

export type CriteriaKey =
  | "cleanliness"
  | "comfort"
  | "location"
  | "service"
  | "value";

export type CriteriaRatings = Record<CriteriaKey, number>;

export interface Review {
  id: string;
  residenceId: ResidenceId;
  author: string;
  email: string;
  stayPeriod: string;
  overallRating: number;
  criteria: CriteriaRatings;
  message: string;
  date: string;
}

export interface ResidenceInfo {
  id: ResidenceId;
  name: string;
  image: string;
}

export interface RatingSummaryLocal {
  averageRating: number;
  totalReviews: number;
  criteriaAverages: CriteriaRatings;
}
