
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { FormField, StageData } from "@/types/game";
import { validateField } from "@/lib/gameUtils";
import { User, DollarSign, Calendar, LineChart, AlignLeft, Activity, Clock } from "lucide-react";

interface StageTwoProps {
  stageData: StageData;
  onComplete: (userInputs: Record<string, string>) => void;
  timeRemaining: number;
}

const StageTwo: React.FC<StageTwoProps> = ({ stageData, onComplete, timeRemaining }) => {
  const [formValues, setFormValues] = useState<Record<string, string>>({});
  const [activeTab, setActiveTab] = useState("details");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentSection, setCurrentSection] = useState(0);
  
  // Group fields into sections
  const sections = [
    {
      id: "basic",
      title: "Basic Information",
      icon: <User className="h-4 w-4" />,
      fields: stageData.fields.filter(f => ["opportunityName", "amount"].includes(f.id)),
    },
    {
      id: "sales",
      title: "Sales Details",
      icon: <Activity className="h-4 w-4" />,
      fields: stageData.fields.filter(f => ["stage", "probability", "expectedCloseDate"].includes(f.id)),
    },
    {
      id: "additional",
      title: "Additional Information",
      icon: <AlignLeft className="h-4 w-4" />,
      fields: stageData.fields.filter(f => ["description", "source"].includes(f.id)),
    },
  ];

  useEffect(() => {
    // Initialize form values
    const initialValues: Record<string, string> = {};
    stageData.fields.forEach(field => {
      initialValues[field.id] = "";
    });
    setFormValues(initialValues);
  }, [stageData]);

  const handleChange = (field: FormField, value: string) => {
    setFormValues(prev => ({
      ...prev,
      [field.id]: value
    }));
    
    // Clear error for this field
    if (fieldErrors[field.id]) {
      setFieldErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field.id];
        return newErrors;
      });
    }
  };

  const handleNextSection = () => {
    // Validate current section
    const currentFields = sections[currentSection].fields;
    const errors: Record<string, string> = {};
    
    currentFields.forEach(field => {
      if (field.required && !formValues[field.id]) {
        errors[field.id] = `${field.label} is required`;
      } else if (field.validation && !validateField(field, formValues[field.id])) {
        errors[field.id] = `Please enter a valid ${field.label.toLowerCase()}`;
      }
    });
    
    setFieldErrors(errors);
    
    if (Object.keys(errors).length === 0) {
      setCurrentSection(prev => Math.min(prev + 1, sections.length - 1));
    }
  };

  const handlePrevSection = () => {
    setCurrentSection(prev => Math.max(prev - 1, 0));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Validate all fields
    const errors: Record<string, string> = {};
    
    stageData.fields.forEach(field => {
      if (field.required && !formValues[field.id]) {
        errors[field.id] = `${field.label} is required`;
      } else if (field.validation && !validateField(field, formValues[field.id])) {
        errors[field.id] = `Please enter a valid ${field.label.toLowerCase()}`;
      }
    });
    
    setFieldErrors(errors);
    
    if (Object.keys(errors).length === 0) {
      setTimeout(() => {
        onComplete(formValues);
        setIsSubmitting(false);
      }, 800);
    } else {
      // Find the section with errors and navigate to it
      for (let i = 0; i < sections.length; i++) {
        const sectionFields = sections[i].fields;
        const sectionHasErrors = sectionFields.some(field => errors[field.id]);
        
        if (sectionHasErrors) {
          setCurrentSection(i);
          break;
        }
      }
      
      setIsSubmitting(false);
    }
  };

  const renderField = (field: FormField) => {
    const hasError = !!fieldErrors[field.id];
    
    switch (field.type) {
      case "textarea":
        return (
          <Textarea
            id={field.id}
            placeholder={field.placeholder}
            value={formValues[field.id] || ""}
            onChange={(e) => handleChange(field, e.target.value)}
            className={`min-h-[100px] ${hasError ? 'border-red-300 bg-red-50' : ''}`}
          />
        );
        
      case "select":
        return (
          <Select
            value={formValues[field.id] || ""}
            onValueChange={(value) => handleChange(field, value)}
          >
            <SelectTrigger className={hasError ? 'border-red-300 bg-red-50' : ''}>
              <SelectValue placeholder={`Select ${field.label}`} />
            </SelectTrigger>
            <SelectContent>
              {field.options?.map((option) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );
        
      case "date":
        return (
          <Input
            id={field.id}
            type="date"
            value={formValues[field.id] || ""}
            onChange={(e) => handleChange(field, e.target.value)}
            className={hasError ? 'border-red-300 bg-red-50' : ''}
          />
        );
        
      default:
        return (
          <Input
            id={field.id}
            type={field.type}
            placeholder={field.placeholder}
            value={formValues[field.id] || ""}
            onChange={(e) => handleChange(field, e.target.value)}
            className={hasError ? 'border-red-300 bg-red-50' : ''}
          />
        );
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
      className="stage-container"
    >
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Sidebar */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="md:col-span-3"
        >
          <Card className="bg-gray-50 border-0 shadow-inner h-full">
            <CardHeader className="bg-gray-100 pb-3">
              <CardTitle className="text-lg flex items-center text-gray-700">
                <DollarSign className="mr-2 h-5 w-5 text-gray-500" />
                Sales Information
              </CardTitle>
              <CardDescription className="text-xs text-gray-500">
                Reference Data
              </CardDescription>
            </CardHeader>
            
            <CardContent className="p-0">
              <Tabs defaultValue="opportunity" className="w-full">
                <TabsList className="w-full grid grid-cols-3 bg-gray-100 border-y border-gray-200">
                  <TabsTrigger value="opportunity" className="text-xs py-1">Opportunity</TabsTrigger>
                  <TabsTrigger value="financial" className="text-xs py-1">Financial</TabsTrigger>
                  <TabsTrigger value="timeline" className="text-xs py-1">Timeline</TabsTrigger>
                </TabsList>
                
                <TabsContent value="opportunity" className="p-4 space-y-3">
                  <div className="pb-2 border-b border-gray-200">
                    <div className="text-xs font-medium text-gray-500">Opportunity Name:</div>
                    <div className="font-medium text-gray-800">{stageData.expectedInputs.opportunityName}</div>
                  </div>
                  <div className="pb-2 border-b border-gray-200">
                    <div className="text-xs font-medium text-gray-500">Source:</div>
                    <div className="font-medium text-gray-800">{stageData.expectedInputs.source}</div>
                  </div>
                  <div className="pb-2">
                    <div className="text-xs font-medium text-gray-500">Description:</div>
                    <div className="font-medium text-gray-800 text-sm">{stageData.expectedInputs.description}</div>
                  </div>
                </TabsContent>
                
                <TabsContent value="financial" className="p-4 space-y-3">
                  <div className="pb-2 border-b border-gray-200">
                    <div className="text-xs font-medium text-gray-500">Deal Amount:</div>
                    <div className="font-medium text-gray-800">${stageData.expectedInputs.amount}</div>
                  </div>
                  <div className="pb-2 border-b border-gray-200">
                    <div className="text-xs font-medium text-gray-500">Probability:</div>
                    <div className="font-medium text-gray-800">{stageData.expectedInputs.probability}%</div>
                  </div>
                  <div className="pb-2">
                    <div className="text-xs font-medium text-gray-500">Stage:</div>
                    <div className="font-medium text-gray-800">{stageData.expectedInputs.stage}</div>
                  </div>
                </TabsContent>
                
                <TabsContent value="timeline" className="p-4 space-y-3">
                  <div className="pb-2 border-b border-gray-200">
                    <div className="text-xs font-medium text-gray-500">Expected Close Date:</div>
                    <div className="font-medium text-gray-800">{stageData.expectedInputs.expectedCloseDate}</div>
                  </div>
                </TabsContent>
              </Tabs>
              
              <div className="p-4 mt-4 border-t border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-500 flex items-center">
                    <Clock className="mr-1 h-4 w-4 text-amber-500" />
                    Time Remaining:
                  </div>
                  <div className={`font-mono font-medium ${
                    timeRemaining < 10 ? "text-red-500 animate-pulse" : "text-gray-700"
                  }`}>
                    {Math.floor(timeRemaining / 60)}:{(timeRemaining % 60).toString().padStart(2, '0')}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
        
        {/* Main Form */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="md:col-span-9"
        >
          <Card className="border-0 shadow-md bg-white overflow-hidden">
            <CardHeader className="pb-3 border-b flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-xl text-gray-800 flex items-center">
                  <div className="p-1 bg-teal-100 rounded-md mr-2">
                    <LineChart className="h-5 w-5 text-teal-600" />
                  </div>
                  OpportunityTracker Pro
                </CardTitle>
                <CardDescription>
                  Enter sales opportunity details
                </CardDescription>
              </div>
              
              <Badge variant="outline" className="bg-blue-50 text-blue-600 border-blue-200">
                New Opportunity
              </Badge>
            </CardHeader>
            
            <div className="border-b border-gray-200 px-6 py-2 bg-gray-50">
              <div className="flex items-center space-x-1">
                {sections.map((section, index) => (
                  <React.Fragment key={section.id}>
                    <div 
                      className={`flex items-center ${
                        index === currentSection 
                          ? "text-blue-600 font-medium" 
                          : index < currentSection 
                            ? "text-gray-500" 
                            : "text-gray-400"
                      }`}
                    >
                      <span className="text-sm">{section.title}</span>
                    </div>
                    
                    {index < sections.length - 1 && (
                      <div className="text-gray-400 mx-1">/</div>
                    )}
                  </React.Fragment>
                ))}
              </div>
            </div>
            
            <CardContent className="pt-6">
              <form onSubmit={handleSubmit}>
                <AnimatePresence mode="wait">
                  <motion.div
                    key={sections[currentSection].id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-4"
                  >
                    <div className="flex items-center mb-4">
                      <div className="p-2 rounded-full bg-gray-100 mr-3">
                        {sections[currentSection].icon}
                      </div>
                      <h3 className="text-lg font-medium text-gray-800">
                        {sections[currentSection].title}
                      </h3>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {sections[currentSection].fields.map((field) => (
                        <div 
                          key={field.id} 
                          className={field.id === 'description' ? 'md:col-span-2' : ''}
                        >
                          <Label 
                            htmlFor={field.id} 
                            className="mb-1 text-sm font-medium text-gray-700 flex items-center justify-between"
                          >
                            {field.label}
                            {field.required && <span className="text-red-500 text-xs">*Required</span>}
                          </Label>
                          
                          {renderField(field)}
                          
                          {fieldErrors[field.id] && (
                            <motion.p
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              exit={{ opacity: 0, height: 0 }}
                              className="text-xs text-red-500 mt-1"
                            >
                              {fieldErrors[field.id]}
                            </motion.p>
                          )}
                        </div>
                      ))}
                    </div>
                  </motion.div>
                </AnimatePresence>
                
                <div className="flex justify-between mt-8 pt-4 border-t border-gray-100">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handlePrevSection}
                    disabled={currentSection === 0}
                    className="text-gray-700"
                  >
                    Previous
                  </Button>
                  
                  {currentSection < sections.length - 1 ? (
                    <Button
                      type="button"
                      onClick={handleNextSection}
                      className="bg-game-blue hover:bg-blue-600 text-white"
                    >
                      Next
                    </Button>
                  ) : (
                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="bg-game-blue hover:bg-blue-600 text-white"
                    >
                      {isSubmitting ? (
                        <>
                          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Submitting...
                        </>
                      ) : (
                        "Submit"
                      )}
                    </Button>
                  )}
                </div>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default StageTwo;
