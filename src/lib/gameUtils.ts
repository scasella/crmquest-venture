
import { FormField, StageData } from "../types/game";

// Generate dummy data for CRM entry tasks
export const generateStages = (): StageData[] => {
  return [
    {
      id: 1,
      name: "Basic Contact Information",
      description: "Enter customer contact details in the CRM system",
      timeLimit: 60,
      pointsPerCorrect: 10,
      penaltyPerError: 5,
      completed: false,
      fields: [
        {
          id: "firstName",
          label: "First Name",
          type: "text",
          placeholder: "Enter first name",
          required: true,
        },
        {
          id: "lastName",
          label: "Last Name",
          type: "text",
          placeholder: "Enter last name",
          required: true,
        },
        {
          id: "email",
          label: "Email Address",
          type: "email",
          placeholder: "email@example.com",
          required: true,
          validation: "email",
        },
        {
          id: "phone",
          label: "Phone Number",
          type: "text",
          placeholder: "(123) 456-7890",
          required: true,
        },
        {
          id: "company",
          label: "Company",
          type: "text",
          placeholder: "Enter company name",
          required: false,
        },
      ],
      userInputs: {},
      expectedInputs: {
        firstName: "Michael",
        lastName: "Johnson",
        email: "mjohnson@company.com",
        phone: "(415) 555-3827",
        company: "Acme Corporation",
      },
    },
    {
      id: 2,
      name: "Sales Opportunity Details",
      description: "Record details about a new sales opportunity",
      timeLimit: 90,
      pointsPerCorrect: 15,
      penaltyPerError: 7,
      completed: false,
      fields: [
        {
          id: "opportunityName",
          label: "Opportunity Name",
          type: "text",
          placeholder: "Enter opportunity name",
          required: true,
        },
        {
          id: "amount",
          label: "Deal Amount ($)",
          type: "number",
          placeholder: "Enter amount",
          required: true,
        },
        {
          id: "stage",
          label: "Sales Stage",
          type: "select",
          required: true,
          options: ["Qualification", "Proposal", "Negotiation", "Closed Won", "Closed Lost"],
        },
        {
          id: "probability",
          label: "Probability (%)",
          type: "number",
          placeholder: "Enter probability",
          required: true,
        },
        {
          id: "expectedCloseDate",
          label: "Expected Close Date",
          type: "date",
          required: true,
        },
        {
          id: "description",
          label: "Description",
          type: "textarea",
          placeholder: "Enter opportunity details",
          required: false,
        },
        {
          id: "source",
          label: "Lead Source",
          type: "select",
          required: true,
          options: ["Website", "Referral", "Trade Show", "Cold Call", "Social Media"],
        },
      ],
      userInputs: {},
      expectedInputs: {
        opportunityName: "Enterprise Software Upgrade",
        amount: "75000",
        stage: "Proposal",
        probability: "60",
        expectedCloseDate: "2023-12-31",
        description: "Complete software upgrade for accounting department",
        source: "Trade Show",
      },
    },
    {
      id: 3,
      name: "Customer Service Case Management",
      description: "Process a customer support ticket with advanced details",
      timeLimit: 120,
      pointsPerCorrect: 20,
      penaltyPerError: 10,
      completed: false,
      fields: [
        {
          id: "caseNumber",
          label: "Case Number",
          type: "text",
          placeholder: "e.g., CS-12345",
          required: true,
        },
        {
          id: "customerID",
          label: "Customer ID",
          type: "text",
          placeholder: "Enter customer ID",
          required: true,
        },
        {
          id: "accountType",
          label: "Account Type",
          type: "select",
          required: true,
          options: ["Standard", "Premium", "Enterprise", "Partner"],
        },
        {
          id: "priority",
          label: "Priority",
          type: "select",
          required: true,
          options: ["Low", "Medium", "High", "Critical"],
        },
        {
          id: "category",
          label: "Category",
          type: "select",
          required: true,
          options: ["Technical Issue", "Billing Question", "Feature Request", "Account Access", "Bug Report"],
        },
        {
          id: "subCategory",
          label: "Sub-Category",
          type: "select",
          required: true,
          options: ["Login Problem", "Data Sync", "Performance", "Integration", "Mobile App", "User Interface"],
        },
        {
          id: "issueDescription",
          label: "Issue Description",
          type: "textarea",
          placeholder: "Detailed description of the issue",
          required: true,
        },
        {
          id: "reproducible",
          label: "Is Issue Reproducible?",
          type: "checkbox",
          required: true,
        },
        {
          id: "contactMethod",
          label: "Preferred Contact Method",
          type: "select",
          required: true,
          options: ["Email", "Phone", "Text", "In-app Message"],
        },
        {
          id: "assignedTo",
          label: "Assign To Department",
          type: "select",
          required: true,
          options: ["Tier 1 Support", "Tier 2 Support", "Engineering", "Account Management", "Billing"],
        },
      ],
      userInputs: {},
      expectedInputs: {
        caseNumber: "CS-78294",
        customerID: "CUST-55872",
        accountType: "Enterprise",
        priority: "High",
        category: "Technical Issue",
        subCategory: "Data Sync",
        issueDescription: "Customer cannot sync data between mobile and desktop applications. Error occurs after recent update.",
        reproducible: "true",
        contactMethod: "Email",
        assignedTo: "Tier 2 Support",
      },
    },
  ];
};

// Calculate accuracy based on user inputs vs expected inputs
export const calculateAccuracy = (userInputs: Record<string, string>, expectedInputs: Record<string, string>): number => {
  if (Object.keys(userInputs).length === 0) return 0;
  
  let correctCount = 0;
  let totalFields = 0;
  
  Object.keys(expectedInputs).forEach(key => {
    if (expectedInputs[key]) {
      totalFields++;
      if (userInputs[key] === expectedInputs[key]) {
        correctCount++;
      }
    }
  });
  
  return totalFields > 0 ? Math.round((correctCount / totalFields) * 100) : 0;
};

// Validate a single field based on its type and validation rules
export const validateField = (field: FormField, value: string): boolean => {
  if (field.required && (!value || value.trim() === '')) {
    return false;
  }
  
  if (!value) return true; // If not required and empty, it's valid
  
  switch (field.validation) {
    case 'email':
      return /\S+@\S+\.\S+/.test(value);
    default:
      return true;
  }
};

// Format time from seconds to MM:SS
export const formatTime = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};

// Calculate total score
export const calculateTotalScore = (stages: StageData[]): number => {
  return stages.reduce((total, stage) => {
    if (!stage.completed) return total;
    
    let stageScore = 0;
    Object.keys(stage.expectedInputs).forEach(key => {
      if (stage.userInputs[key] === stage.expectedInputs[key]) {
        stageScore += stage.pointsPerCorrect;
      } else if (stage.userInputs[key]) {
        stageScore -= stage.penaltyPerError;
      }
    });
    
    // Ensure score doesn't go below zero for this stage
    return total + Math.max(0, stageScore);
  }, 0);
};

// Calculate total errors across all stages
export const calculateTotalErrors = (stages: StageData[]): number => {
  return stages.reduce((total, stage) => {
    if (!stage.completed) return total;
    
    let stageErrors = 0;
    Object.keys(stage.expectedInputs).forEach(key => {
      if (stage.userInputs[key] && stage.userInputs[key] !== stage.expectedInputs[key]) {
        stageErrors += 1;
      }
    });
    
    return total + stageErrors;
  }, 0);
};
