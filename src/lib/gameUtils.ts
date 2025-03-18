
import { FormField, StageData } from "../types/game";

// Generate dummy data for CRM entry tasks
export const generateStages = (): StageData[] => {
  return [
    {
      id: 1,
      name: "Basic Contact Information",
      description: "Enter customer contact details in the CRM system",
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
      unstructuredData: `From: Sales Team
Subject: New Lead Information

Just met with Michael Johnson from Acme Corporation during the trade show. 
He can be reached at (415) 555-3827 or via email at mjohnson@company.com.
He expressed interest in our enterprise solution.`,
    },
    {
      id: 2,
      name: "Sales Opportunity Details",
      description: "Record details about a new sales opportunity",
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
      unstructuredData: `Call Notes - December 5, 2023
Account Manager: Sarah Thompson

Spoke with Acme Corp's IT Director about their accounting department software upgrade needs.
They're looking to spend around $75k for a complete Enterprise Software Upgrade.
We've sent the proposal last week, and they're currently reviewing it.
I'd estimate we have about a 60% chance of closing this deal.
They're hoping to implement by the end of the year (12/31/2023).
Remember this lead came from the Tech Expo Trade Show last month.
Additional notes: They specifically need the upgrade to handle their multi-currency transactions and improve reporting capabilities for the accounting department.`,
    },
    {
      id: 3,
      name: "Customer Service Case Management",
      description: "Process a customer support ticket with advanced details",
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
      unstructuredData: `Support Ticket
Received: 10:45 AM, May 15, 2024
Support Agent: Alex Rivera

Logged case CS-78294 for Enterprise customer (ID: CUST-55872).
The customer called reporting a High priority Technical Issue with Data Sync functionality.
The problem started after our latest update (v3.2.1). 
Customer reports they cannot sync data between their mobile app and desktop application.
They sent screenshots by Email showing the error messages.
I was able to reproduce the issue in our test environment.
This seems to require Tier 2 Support investigation as it involves both the API and client applications.

Customer comments: "Every time I try to sync between my phone and laptop, I get an error message saying 'Sync Failed: Unexpected data format'. This started right after I installed the update yesterday."`,
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
