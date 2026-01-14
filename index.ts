/**
 * Auto-generated entity types
 * Contains all CMS collection interfaces in a single file 
 */

/**
 * Collection ID: applications
 * Interface for Applications
 */
export interface Applications {
  _id: string;
  _createdDate?: Date;
  _updatedDate?: Date;
  /** @wixFieldType text */
  applicantName?: string;
  /** @wixFieldType text */
  opportunityTitle?: string;
  /** @wixFieldType datetime */
  submissionDate?: Date | string;
  /** @wixFieldType text */
  applicationStatus?: string;
  /** @wixFieldType url */
  resumeLink?: string;
  /** @wixFieldType url */
  coverLetterLink?: string;
  /** @wixFieldType text */
  mentorFeedback?: string;
}


/**
 * Collection ID: opportunities
 * Interface for Opportunities
 */
export interface Opportunities {
  _id: string;
  _createdDate?: Date;
  _updatedDate?: Date;
  /** @wixFieldType text */
  role?: string;
  /** @wixFieldType text */
  companyName?: string;
  /** @wixFieldType text */
  description?: string;
  /** @wixFieldType datetime */
  applicationDeadline?: Date | string;
  /** @wixFieldType text */
  location?: string;
  /** @wixFieldType text */
  eligibilityCriteria?: string;
  /** @wixFieldType text */
  stipend?: string;
  /** @wixFieldType url */
  applicationUrl?: string;
  /** @wixFieldType image */
  companyLogo?: string;
}


/**
 * Collection ID: performancefeedback
 * Interface for PerformanceFeedback
 */
export interface PerformanceFeedback {
  _id: string;
  _createdDate?: Date;
  _updatedDate?: Date;
  /** @wixFieldType datetime */
  feedbackDate?: Date | string;
  /** @wixFieldType number */
  overallRating?: number;
  /** @wixFieldType text */
  strengths?: string;
  /** @wixFieldType text */
  areasForImprovement?: string;
  /** @wixFieldType text */
  supervisorComments?: string;
  /** @wixFieldType text */
  internshipTitle?: string;
}


/**
 * Collection ID: studentprofiles
 * Interface for StudentProfiles
 */
export interface StudentProfiles {
  _id: string;
  _createdDate?: Date;
  _updatedDate?: Date;
  /** @wixFieldType text */
  studentName?: string;
  /** @wixFieldType text */
  email?: string;
  /** @wixFieldType text */
  major?: string;
  /** @wixFieldType number */
  graduationYear?: number;
  /** @wixFieldType number */
  gpa?: number;
  /** @wixFieldType url */
  resumeUrl?: string;
  /** @wixFieldType text */
  skills?: string;
  /** @wixFieldType image */
  profilePicture?: string;
}
