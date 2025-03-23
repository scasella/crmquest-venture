import { FormField, StageData } from "../types/game";

// Generate dummy data for CRM entry tasks
export const generateStages = (): StageData[] => {
  return [
    {
      id: 1,
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
    {
      id: 2,
      name: "Customer Order Processing",
      description: "Process a complex product order with customization options",
      pointsPerCorrect: 25,
      penaltyPerError: 12,
      completed: false,
      fields: [
        {
          id: "orderNumber",
          label: "Order Number",
          type: "text",
          placeholder: "e.g., ORD-12345",
          required: true,
        },
        {
          id: "customerName",
          label: "Customer Name",
          type: "text",
          placeholder: "Enter customer name",
          required: true,
        },
        {
          id: "productSKU",
          label: "Product SKU",
          type: "text",
          placeholder: "Enter product SKU",
          required: true,
        },
        {
          id: "quantity",
          label: "Quantity",
          type: "number",
          placeholder: "Enter quantity",
          required: true,
        },
        {
          id: "unitPrice",
          label: "Unit Price ($)",
          type: "number",
          placeholder: "Enter unit price",
          required: true,
        },
        {
          id: "discountCode",
          label: "Discount Code",
          type: "text",
          placeholder: "Enter discount code if applicable",
          required: false,
        },
        {
          id: "shippingMethod",
          label: "Shipping Method",
          type: "select",
          required: true,
          options: ["Standard", "Express", "Next Day", "International", "In-Store Pickup"],
        },
        {
          id: "customization",
          label: "Customization Options",
          type: "select",
          required: true,
          options: ["None", "Engraving", "Color Modification", "Size Adjustment", "Bundle Package"],
        },
        {
          id: "customizationDetails",
          label: "Customization Details",
          type: "textarea",
          placeholder: "Enter customization details",
          required: false,
        },
        {
          id: "giftWrapping",
          label: "Gift Wrapping",
          type: "checkbox",
          required: true,
        },
        {
          id: "deliveryNotes",
          label: "Delivery Notes",
          type: "textarea",
          placeholder: "Any special instructions for delivery",
          required: false,
        },
        {
          id: "paymentMethod",
          label: "Payment Method",
          type: "select",
          required: true,
          options: ["Credit Card", "PayPal", "Bank Transfer", "Store Credit", "Purchase Order"],
        },
      ],
      userInputs: {},
      expectedInputs: {
        orderNumber: "ORD-93721",
        customerName: "Emily Richardson",
        productSKU: "SHP-PRO-5000X",
        quantity: "2",
        unitPrice: "1299.99",
        discountCode: "LOYAL20",
        shippingMethod: "Express",
        customization: "Engraving",
        customizationDetails: "Add company logo and 'Richardson Consulting' text to front panel",
        giftWrapping: "false",
        deliveryNotes: "Please deliver during business hours (9 AM - 5 PM). Call reception 30 minutes before arrival.",
        paymentMethod: "Purchase Order",
      },
      unstructuredData: `Order Details - Richardson Consulting
Date: June 10, 2024
Sales Representative: Jordan Carter

Emily Richardson from Richardson Consulting placed order #ORD-93721 by phone today for 2 units of our premium SupportHub Professional Servers (SKU: SHP-PRO-5000X) at $1,299.99 each.
 
She's a loyal customer and requested we apply her standing discount code LOYAL20. She needs Express delivery and has requested engraving customization with their company logo and "Richardson Consulting" text on the front panel of each unit.

She doesn't need gift wrapping but did specify that delivery must be during business hours (9 AM - 5 PM) and requested that the courier call their reception desk 30 minutes before arrival.

Payment will be via Purchase Order as usual for their corporate accounts.

Follow up: Technical team needs to confirm logo file is appropriate resolution for engraving process.`,
    },
    {
      id: 3,
      name: "Project Management Task Assignment",
      description: "Assign and configure a complex project task with dependencies and resources",
      pointsPerCorrect: 30,
      penaltyPerError: 15,
      completed: false,
      fields: [
        {
          id: "projectCode",
          label: "Project Code",
          type: "text",
          placeholder: "Enter project code",
          required: true,
        },
        {
          id: "taskId",
          label: "Task ID",
          type: "text",
          placeholder: "Enter task ID",
          required: true,
        },
        {
          id: "taskName",
          label: "Task Name",
          type: "text",
          placeholder: "Enter task name",
          required: true,
        },
        {
          id: "taskType",
          label: "Task Type",
          type: "select",
          required: true,
          options: ["Development", "Design", "Testing", "Documentation", "Deployment", "Planning"],
        },
        {
          id: "priority",
          label: "Priority",
          type: "select",
          required: true,
          options: ["Lowest", "Low", "Medium", "High", "Highest", "Blocker"],
        },
        {
          id: "description",
          label: "Description",
          type: "textarea",
          placeholder: "Detailed description of the task",
          required: true,
        },
        {
          id: "assignedTo",
          label: "Assigned To",
          type: "text",
          placeholder: "Enter assignee name",
          required: true,
        },
        {
          id: "estimatedHours",
          label: "Estimated Hours",
          type: "number",
          placeholder: "Enter estimated hours",
          required: true,
        },
        {
          id: "startDate",
          label: "Start Date",
          type: "date",
          required: true,
        },
        {
          id: "dueDate",
          label: "Due Date",
          type: "date",
          required: true,
        },
        {
          id: "dependencies",
          label: "Dependencies",
          type: "textarea",
          placeholder: "List any task dependencies",
          required: false,
        },
        {
          id: "requiredSkills",
          label: "Required Skills",
          type: "textarea",
          placeholder: "List required skills for this task",
          required: true,
        },
        {
          id: "additionalResources",
          label: "Additional Resources",
          type: "textarea",
          placeholder: "List any additional resources needed",
          required: false,
        },
        {
          id: "milestoneTask",
          label: "Milestone Task",
          type: "checkbox",
          required: true,
        },
        {
          id: "reviewRequired",
          label: "Review Required",
          type: "checkbox",
          required: true,
        },
      ],
      userInputs: {},
      expectedInputs: {
        projectCode: "SHP-API-2024",
        taskId: "TASK-4512",
        taskName: "API Authentication Service Implementation",
        taskType: "Development",
        priority: "High",
        description: "Implement OAuth 2.0 authentication service for the new customer portal API. This includes JWT token handling, refresh token management, and integration with the existing user management system.",
        assignedTo: "David Chen",
        estimatedHours: "24",
        startDate: "2024-07-01",
        dueDate: "2024-07-10",
        dependencies: "TASK-4501: API Architecture Planning, TASK-4508: Database Schema Updates",
        requiredSkills: "Node.js, OAuth 2.0, JWT, Security Best Practices, Database Integration",
        additionalResources: "Access to Auth0 development account, Security team consultation for compliance review",
        milestoneTask: "false",
        reviewRequired: "true",
      },
      unstructuredData: `Project Task Assignment
Project Manager: Samantha Wright
Date: June 12, 2024

Need to assign the API Authentication Service Implementation task (TASK-4512) to David Chen as part of the SupportHub API Overhaul project (SHP-API-2024). This is Development work with High priority.

Task details:
Implement OAuth 2.0 authentication service for the new customer portal API. This includes JWT token handling, refresh token management, and integration with the existing user management system.

Should start on July 1st and be completed by July 10th, with an estimated 24 hours of effort.

This task depends on:
- TASK-4501: API Architecture Planning
- TASK-4508: Database Schema Updates

Required skills: Node.js, OAuth 2.0, JWT, Security Best Practices, Database Integration

Additional resources needed:
- Access to Auth0 development account
- Security team consultation for compliance review

This is not a milestone task, but will require code review before merging.

Note: David will need to coordinate with the security team for compliance requirements and with the database team for user management integration.`,
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
