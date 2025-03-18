
import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { validateField } from "@/lib/gameUtils";
import { StageData, FormField } from "@/types/game";
import { Check, X, FileText } from "lucide-react";

interface StageOneProps {
  stageData: StageData;
  onComplete: (userInputs: Record<string, string>) => void;
}

const StageOne: React.FC<StageOneProps> = ({ stageData, onComplete }) => {
  const [formValues, setFormValues] = useState<Record<string, string>>({});
  const [fieldStatus, setFieldStatus] = useState<Record<string, 'valid' | 'invalid' | 'pristine'>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  
  useEffect(() => {
    // Initialize form values
    const initialValues: Record<string, string> = {};
    stageData.fields.forEach(field => {
      initialValues[field.id] = "";
    });
    setFormValues(initialValues);
    
    // Initialize field status
    const initialStatus: Record<string, 'valid' | 'invalid' | 'pristine'> = {};
    stageData.fields.forEach(field => {
      initialStatus[field.id] = 'pristine';
    });
    setFieldStatus(initialStatus);
    
    // Focus first field after a short delay
    const timer = setTimeout(() => {
      if (formRef.current) {
        const firstInput = formRef.current.querySelector('input');
        if (firstInput) firstInput.focus();
      }
    }, 500);
    
    return () => clearTimeout(timer);
  }, [stageData]);

  const handleChange = (field: FormField, value: string) => {
    setFormValues(prev => ({
      ...prev,
      [field.id]: value
    }));
  };

  const handleBlur = (field: FormField) => {
    const isValid = validateField(field, formValues[field.id]);
    setFieldStatus(prev => ({
      ...prev,
      [field.id]: isValid ? 'valid' : 'invalid'
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Validate all fields
    let isValid = true;
    const newFieldStatus: Record<string, 'valid' | 'invalid' | 'pristine'> = {};
    
    stageData.fields.forEach(field => {
      const valid = validateField(field, formValues[field.id]);
      newFieldStatus[field.id] = valid ? 'valid' : 'invalid';
      if (!valid) isValid = false;
    });
    
    setFieldStatus(newFieldStatus);
    
    // If valid, complete the stage
    if (isValid) {
      setTimeout(() => {
        onComplete(formValues);
        setIsSubmitting(false);
      }, 800);
    } else {
      setIsSubmitting(false);
    }
  };

  const getFieldClassName = (field: FormField) => {
    const baseClass = "w-full p-3 rounded-lg border transition-all duration-300 focus:ring-2 focus:ring-blue-300 focus:border-transparent";
    
    switch (fieldStatus[field.id]) {
      case 'valid':
        return `${baseClass} border-green-300 bg-green-50 text-green-900`;
      case 'invalid':
        return `${baseClass} border-red-300 bg-red-50 text-red-900`;
      default:
        return `${baseClass} border-gray-200 bg-white`;
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
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Reference Panel */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="md:col-span-1"
        >
          <Card className="bg-gray-50 border-0 shadow-inner h-full overflow-hidden">
            <CardHeader className="bg-gray-100 pb-2">
              <CardTitle className="text-lg flex items-center text-gray-700">
                <FileText className="mr-2 h-5 w-5 text-gray-500" />
                Customer Information
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.5 }}
                className="space-y-4"
              >
                <div className="p-3 bg-white border border-gray-200 rounded-md">
                  <pre className="whitespace-pre-wrap text-sm font-mono text-gray-700">{stageData.unstructuredData}</pre>
                </div>
              </motion.div>
            </CardContent>
          </Card>
        </motion.div>
        
        {/* Form Panel */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="md:col-span-2"
        >
          <Card className="border-0 shadow-md bg-white">
            <CardHeader className="pb-2 border-b">
              <CardTitle className="text-xl text-gray-800 flex items-center">
                <div className="p-1 bg-blue-100 rounded-md mr-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" />
                    <path fillRule="evenodd" d="M8 4a1 1 0 011 1v3.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 111.414-1.414L7 8.586V5a1 1 0 011-1z" clipRule="evenodd" />
                  </svg>
                </div>
                CustomerTracker CRM
              </CardTitle>
              <p className="text-sm text-gray-500">Enter customer information</p>
            </CardHeader>
            
            <CardContent className="pt-4">
              <form ref={formRef} onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {stageData.fields.map((field) => (
                    <div key={field.id} className={field.id === 'company' ? 'md:col-span-2' : ''}>
                      <Label 
                        htmlFor={field.id} 
                        className="mb-1 text-sm font-medium text-gray-700 flex items-center justify-between"
                      >
                        {field.label}
                        {field.required && <span className="text-red-500 text-xs">*Required</span>}
                      </Label>
                      
                      <div className="relative">
                        <Input
                          id={field.id}
                          type={field.type}
                          placeholder={field.placeholder}
                          value={formValues[field.id] || ""}
                          onChange={(e) => handleChange(field, e.target.value)}
                          onBlur={() => handleBlur(field)}
                          className={getFieldClassName(field)}
                          required={field.required}
                        />
                        
                        <AnimatePresence>
                          {fieldStatus[field.id] === 'valid' && (
                            <motion.div
                              initial={{ opacity: 0, scale: 0.5 }}
                              animate={{ opacity: 1, scale: 1 }}
                              exit={{ opacity: 0, scale: 0.5 }}
                              className="absolute right-3 top-1/2 transform -translate-y-1/2"
                            >
                              <Check className="h-5 w-5 text-green-500" />
                            </motion.div>
                          )}
                          
                          {fieldStatus[field.id] === 'invalid' && (
                            <motion.div
                              initial={{ opacity: 0, scale: 0.5 }}
                              animate={{ opacity: 1, scale: 1 }}
                              exit={{ opacity: 0, scale: 0.5 }}
                              className="absolute right-3 top-1/2 transform -translate-y-1/2"
                            >
                              <X className="h-5 w-5 text-red-500" />
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                      
                      {fieldStatus[field.id] === 'invalid' && (
                        <motion.p
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="text-xs text-red-500 mt-1"
                        >
                          {field.validation === 'email' 
                            ? 'Please enter a valid email address' 
                            : `${field.label} is required`}
                        </motion.p>
                      )}
                    </div>
                  ))}
                </div>
                
                <div className="pt-4 flex justify-between items-center">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowHint(!showHint)}
                    className="text-gray-500 border-gray-300"
                  >
                    {showHint ? "Hide Hint" : "Show Hint"}
                  </Button>
                  
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="bg-game-blue hover:bg-blue-600 text-white px-6 py-2 rounded-lg transition-all duration-300 flex items-center"
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
                </div>
                
                <AnimatePresence>
                  {showHint && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                      className="p-3 bg-blue-50 border border-blue-100 rounded-lg text-sm text-blue-700"
                    >
                      <p className="font-medium mb-1">Hint:</p>
                      <p>Read the customer information carefully and extract the correct details to fill in the form fields. Pay attention to the exact formatting of emails, phone numbers, and names.</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default StageOne;
