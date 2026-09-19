// Registration: the single form submission a Registrant makes, describing
// where they sit in the Career Explorer. See CONTEXT.md.

export const SCHOOLS = ["Yale School of Management", "Yale School of the Environment", "Both"] as const;

export const DEGREE_PROGRAMS = ["MBA", "MAM", "EMBA", "MEM", "MF", "MESc", "MFS", "PhD", "Other"] as const;

const NEWEST_GRADUATION_YEAR = 2027;
const OLDEST_GRADUATION_YEAR = 1980;
export const GRADUATION_YEARS = Array.from(
  { length: NEWEST_GRADUATION_YEAR - OLDEST_GRADUATION_YEAR + 1 },
  (_, i) => String(NEWEST_GRADUATION_YEAR - i),
);

export const ORGANIZATION_TYPES = [
  "Nonprofit/NGO",
  "Government",
  "Foundation",
  "University",
  "Startup",
  "Corporation",
] as const;

export type Option = { name: string; detail: string };

// Rows of the Career Explorer: IRIS+ impact themes plus Religion & Spirituality.
export const IMPACT_THEMES: Option[] = [
  { name: "Agriculture", detail: "food systems, farming, land use" },
  { name: "Air", detail: "air quality, clean air access" },
  { name: "Biodiversity & Ecosystems", detail: "wildlife, habitat, conservation" },
  { name: "Climate", detail: "climate change, resilience, adaptation" },
  { name: "Diversity & Inclusion", detail: "equity, representation, belonging" },
  { name: "Education", detail: "learning access, quality, outcomes" },
  { name: "Employment", detail: "jobs, wages, worker rights" },
  { name: "Energy", detail: "clean energy, access, efficiency" },
  { name: "Financial Services", detail: "banking access, microfinance, lending" },
  { name: "Health", detail: "healthcare access, wellbeing, public health" },
  { name: "Infrastructure", detail: "roads, utilities, resilient systems" },
  { name: "Land", detail: "land rights, conservation, management" },
  { name: "Oceans & Coastal Zones", detail: "marine health, fishing, coastal communities" },
  { name: "Pollution", detail: "waste reduction, contamination, cleanup" },
  { name: "Real Estate", detail: "affordable housing, green buildings" },
  { name: "Waste", detail: "waste management, recycling, circular economy" },
  { name: "Water", detail: "clean water, sanitation, WASH" },
  { name: "Arts & Culture", detail: "creative expression, cultural preservation" },
  { name: "Capacity Building", detail: "org strengthening, training, leadership" },
  { name: "Community Development", detail: "local economies, civic infrastructure" },
  { name: "Information, Comm. & Connectivity", detail: "internet access, digital equity" },
  { name: "Religion & Spirituality", detail: "faith communities, spiritual wellbeing" },
  { name: "Transportation", detail: "mobility, transit access, logistics" },
];

// Columns of the Career Explorer.
export const JOB_FUNCTIONS: Option[] = [
  { name: "Technology & Innovation", detail: "startups, R&D labs, tech-for-good" },
  { name: "Policy & Regulatory Affairs", detail: "government agencies, think tanks" },
  { name: "Education", detail: "schools, training, curriculum" },
  { name: "Operations & Administration", detail: "strategy, HR, finance, ops" },
  { name: "Programs & Direct Service", detail: "nonprofits, clinics, community orgs" },
  { name: "Finance & Investment", detail: "impact investors, CDFIs, foundations" },
  { name: "Equity & Advocacy", detail: "campaigns, legal orgs, coalitions" },
  { name: "Partnerships & Stakeholder Engagement", detail: "coalitions, community organizing" },
  { name: "Communications & Knowledge Sharing", detail: "media, research, storytelling" },
];

export type RegistrationDraft = {
  firstName: string;
  lastName: string;
  school: string;
  degreeProgram: string;
  graduationYear: string;
  organization: string;
  title: string;
  organizationType: string;
  impactThemes: string[];
  jobFunctions: string[];
  linkedinUrl: string;
  openToInterviews: boolean;
};

export type Registration = RegistrationDraft & {
  verifiedEmail: string;
  submittedAt: string;
};

export const EMPTY_DRAFT: RegistrationDraft = {
  firstName: "",
  lastName: "",
  school: "",
  degreeProgram: "",
  graduationYear: "",
  organization: "",
  title: "",
  organizationType: "",
  impactThemes: [],
  jobFunctions: [],
  linkedinUrl: "",
  openToInterviews: false,
};

export type DraftErrors = Partial<Record<keyof RegistrationDraft, string>>;

const LINKEDIN_PATTERN = /^https?:\/\/(www\.)?linkedin\.com\/.+/i;

export function validateDraft(draft: RegistrationDraft): DraftErrors {
  const errors: DraftErrors = {};
  if (!draft.firstName.trim()) errors.firstName = "Enter your first name.";
  if (!draft.lastName.trim()) errors.lastName = "Enter your last name.";
  if (!draft.school) errors.school = "Choose your school.";
  if (!draft.degreeProgram) errors.degreeProgram = "Choose your degree program.";
  if (!draft.graduationYear) errors.graduationYear = "Choose your graduation year.";
  if (!draft.organization.trim()) errors.organization = "Enter your current organization.";
  if (!draft.title.trim()) errors.title = "Enter your current title.";
  if (!draft.organizationType) errors.organizationType = "Choose one organization type.";
  if (draft.impactThemes.length === 0) errors.impactThemes = "Choose at least one impact theme.";
  if (draft.jobFunctions.length === 0) errors.jobFunctions = "Choose at least one job function.";
  if (draft.linkedinUrl.trim() && !LINKEDIN_PATTERN.test(draft.linkedinUrl.trim())) {
    errors.linkedinUrl = "Enter a full LinkedIn URL, starting with https://linkedin.com/.";
  }
  return errors;
}

export function completeRegistration(draft: RegistrationDraft, verifiedEmail: string, now: number): Registration {
  return {
    ...draft,
    firstName: draft.firstName.trim(),
    lastName: draft.lastName.trim(),
    organization: draft.organization.trim(),
    title: draft.title.trim(),
    linkedinUrl: draft.linkedinUrl.trim(),
    verifiedEmail,
    submittedAt: new Date(now).toISOString(),
  };
}
