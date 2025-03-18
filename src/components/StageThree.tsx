
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { FormField, StageData } from "@/types/game";
import { validateField } from "@/lib/gameUtils";
import { LifeBuoy, Info, CheckCircle, AlertCircle, Clock, ClipboardList, X } from "lucide-react";

interface StageThreeProps {
  stageData: StageData;
  onComplete: (userInputs: Record<string, string>) => void;
  timeRemaining: number;
}

const StageThree: React.FC<StageThreeProps> = ({ stageData, onComplete, timeRemaining }) => {
  const [formValues, setFormValues] = useState<Record<string, string>>({});
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [validFields, setValidFields] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showHelp, setShowHelp] = useState(false);
  const [showRefData, setShowRefData] = useState(true);
  
  // Group fields by category
  const fieldGroups = {
    "Case Information": stageData.fields.filter(f => 
      ["caseNumber", "customerID", "accountType"].includes(f.id)
    ),
    "Issue Details": stageData.fields.filter(f => 
      ["priority", "category", "subCategory", "issueDescription", "reproducible"].includes(f.id)
    ),
    "Assignment": stageData.fields.filter(f => 
      ["contactMethod", "assignedTo"].includes(f.id)
    ),
  };

  useEffect(() => {
    // Initialize form values
    const initialValues: Record<string, string> = {};
    stageData.fields.forEach(field => {
      initialValues[field.id] = field.type === 'checkbox' ? 'false' : "";
    });
    setFormValues(initialValues);
  }, [stageData]);

  const handleChange = (field: FormField, value: string) => {
    setFormValues(prev => ({
      ...prev,
      [field.id]: value
    }));
    
    // Validate field
    const isValid = validateField(field, value);
    if (isValid) {
      setValidFields(prev => prev.includes(field.id) ? prev : [...prev, field.id]);
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field.id];
        return newErrors;
      });
    } else {
      setValidFields(prev => prev.filter(id => id !== field.id));
    }
  };

  const handleFocus = (fieldId: string) => {
    setFocusedField(fieldId);
  };

  const handleBlur = () => {
    setFocusedField(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Validate all fields
    const newErrors: Record<string, string> = {};
    const newValidFields: string[] = [];
    
    stageData.fields.forEach(field => {
      const value = formValues[field.id] || '';
      
      if (field.required && (!value || value === 'false')) {
        newErrors[field.id] = `${field.label} is required`;
      } else if (field.validation && !validateField(field, value)) {
        newErrors[field.id] = `Please enter a valid ${field.label.toLowerCase()}`;
      } else {
        newValidFields.push(field.id);
      }
    });
    
    setErrors(newErrors);
    setValidFields(newValidFields);
    
    if (Object.keys(newErrors).length === 0) {
      setTimeout(() => {
        onComplete(formValues);
        setIsSubmitting(false);
      }, 800);
    } else {
      setIsSubmitting(false);
    }
  };

  const renderField = (field: FormField) => {
    const isValid = validFields.includes(field.id);
    const hasError = !!errors[field.id];
    const isFocused = focusedField === field.id;
    
    let fieldClasses = "transition-all duration-200 ";
    
    if (isFocused) {
      fieldClasses += "ring-2 ring-blue-400 border-transparent ";
    } else if (isValid) {
      fieldClasses += "border-green-300 bg-green-50/50 ";
    } else if (hasError) {
      fieldClasses += "border-red-300 bg-red-50/50 ";
    } else {
      fieldClasses += "border-gray-200 ";
    }
    
    switch (field.type) {
      case "textarea":
        return (
          <Textarea
            id={field.id}
            placeholder={field.placeholder}
            value={formValues[field.id] || ""}
            onChange={(e) => handleChange(field, e.target.value)}
            onFocus={() => handleFocus(field.id)}
            onBlur={handleBlur}
            className={`${fieldClasses} min-h-[100px]`}
          />
        );
        
      case "select":
        return (
          <Select
            value={formValues[field.id] || ""}
            onValueChange={(value) => handleChange(field, value)}
            onOpenChange={(open) => {
              if (open) handleFocus(field.id);
              else handleBlur();
            }}
          >
            <SelectTrigger className={fieldClasses}>
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
        
      case "checkbox":
        return (
          <div className="flex items-center space-x-2">
            <Checkbox
              id={field.id}
              checked={formValues[field.id] === 'true'}
              onCheckedChange={(checked) => {
                handleChange(field, checked ? 'true' : 'false');
              }}
              className={isFocused ? "ring-2 ring-blue-400" : ""}
              onFocus={() => handleFocus(field.id)}
              onBlur={handleBlur}
            />
            <label
              htmlFor={field.id}
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Yes
            </label>
          </div>
        );
        
      default:
        return (
          <Input
            id={field.id}
            type={field.type}
            placeholder={field.placeholder}
            value={formValues[field.id] || ""}
            onChange={(e) => handleChange(field, e.target.value)}
            onFocus={() => handleFocus(field.id)}
            onBlur={handleBlur}
            className={fieldClasses}
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
      <div className="flex flex-col min-h-[600px]">
        {/* Top Toolbar */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.3 }}
          className="bg-gray-800 text-white px-4 py-2 rounded-t-xl flex items-center justify-between"
        >
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <LifeBuoy className="h-5 w-5 mr-2 text-blue-300" />
              <span className="font-medium">SupportHub Enterprise</span>
            </div>
            
            <Tabs defaultValue="case" className="w-auto">
              <TabsList className="bg-gray-700/50 h-8">
                <TabsTrigger value="case" className="text-xs h-7 data-[state=active]:bg-blue-600">New Case</TabsTrigger>
                <TabsTrigger value="dashboard" className="text-xs h-7">Dashboard</TabsTrigger>
                <TabsTrigger value="reports" className="text-xs h-7">Reports</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
          
          <div className="flex items-center space-x-3">
            <Button
              variant="ghost"
              size="sm"
              className="h-7 text-gray-300 hover:text-white hover:bg-gray-700"
              onClick={() => setShowHelp(!showHelp)}
            >
              <Info className="h-4 w-4 mr-1" />
              <span className="text-xs">Help</span>
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              className="h-7 text-gray-300 hover:text-white hover:bg-gray-700"
              onClick={() => setShowRefData(!showRefData)}
            >
              <ClipboardList className="h-4 w-4 mr-1" />
              <span className="text-xs">Reference</span>
            </Button>
            
            <div className="flex items-center space-x-1 bg-gray-700/50 px-2 py-1 rounded text-xs">
              <Clock className="h-3 w-3 text-amber-400" />
              <span className={timeRemaining < 10 ? "text-red-300 animate-pulse" : "text-gray-300"}>
                {Math.floor(timeRemaining / 60)}:{(timeRemaining % 60).toString().padStart(2, '0')}
              </span>
            </div>
          </div>
        </motion.div>
        
        {/* Main Content */}
        <div className="flex-1 grid grid-cols-1 md:grid-cols-4 bg-white rounded-b-xl overflow-hidden">
          {/* Left Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.4 }}
            className="md:col-span-1 bg-gray-50 border-r border-gray-200 p-4"
          >
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-2">Case Status</h3>
                <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-100 border-amber-200">
                  Draft
                </Badge>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-2">Required Information</h3>
                <div className="space-y-1.5">
                  {['Case ID', 'Customer ID', 'Category', 'Priority'].map((item) => (
                    <div key={item} className="flex items-center text-sm">
                      <div className="h-1.5 w-1.5 rounded-full bg-red-500 mr-1.5"></div>
                      <span className="text-gray-700">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Reference Data Panel */}
              <AnimatePresence>
                {showRefData && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="border border-gray-200 rounded-lg bg-white overflow-hidden"
                  >
                    <div className="bg-gray-100 px-3 py-2 flex items-center justify-between">
                      <span className="text-xs font-medium text-gray-700">Reference Data</span>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="h-5 w-5 p-0" 
                        onClick={() => setShowRefData(false)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                    
                    <div className="p-3 max-h-[300px] overflow-y-auto text-xs">
                      {Object.entries(stageData.expectedInputs).map(([key, value]) => {
                        const field = stageData.fields.find(f => f.id === key);
                        return field ? (
                          <div key={key} className="mb-2 pb-1 border-b border-gray-100 last:border-0">
                            <div className="font-medium text-gray-600">{field.label}:</div>
                            <div className="text-gray-800">{value}</div>
                          </div>
                        ) : null;
                      })}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
              
              {/* Help Panel */}
              <AnimatePresence>
                {showHelp && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="border border-blue-200 rounded-lg bg-blue-50 overflow-hidden"
                  >
                    <div className="bg-blue-100 px-3 py-2 flex items-center justify-between">
                      <span className="text-xs font-medium text-blue-800">Help Center</span>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="h-5 w-5 p-0" 
                        onClick={() => setShowHelp(false)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                    
                    <div className="p-3 max-h-[250px] overflow-y-auto">
                      <p className="text-xs text-blue-700 mb-2">
                        Fill in all required fields to create a support case. Red asterisks indicate required fields.
                      </p>
                      <p className="text-xs text-blue-700 mb-2">
                        Make sure to select the appropriate priority level based on the customer's needs.
                      </p>
                      <p className="text-xs text-blue-700">
                        Provide detailed information in the Issue Description to help the support team.
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
          
          {/* Main Form Area */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.4 }}
            className="md:col-span-3 bg-white p-5"
          >
            <form onSubmit={handleSubmit}>
              <div className="mb-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-1">New Support Case</h2>
                <p className="text-sm text-gray-500">Enter all details to create a customer support ticket</p>
              </div>
              
              <div className="space-y-8">
                {Object.entries(fieldGroups).map(([groupName, fields]) => (
                  <div key={groupName} className="space-y-4">
                    <div className="flex items-center pb-2 border-b border-gray-100">
                      <h3 className="text-md font-medium text-gray-700">{groupName}</h3>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {fields.map((field) => (
                        <div 
                          key={field.id} 
                          className={field.id === 'issueDescription' ? 'md:col-span-2' : ''}
                        >
                          <Label 
                            htmlFor={field.id} 
                            className="mb-1 text-sm font-medium text-gray-700 flex items-center"
                          >
                            {field.label}
                            {field.required && <span className="text-red-500 ml-1">*</span>}
                          </Label>
                          
                          {renderField(field)}
                          
                          {errors[field.id] && (
                            <motion.p
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              exit={{ opacity: 0, height: 0 }}
                              className="text-xs text-red-500 mt-1 flex items-center"
                            >
                              <AlertCircle className="h-3 w-3 mr-1" />
                              {errors[field.id]}
                            </motion.p>
                          )}
                          
                          {validFields.includes(field.id) && !errors[field.id] && (
                            <motion.p
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              exit={{ opacity: 0, height: 0 }}
                              className="text-xs text-green-600 mt-1 flex items-center"
                            >
                              <CheckCircle className="h-3 w-3 mr-1" />
                              Looks good!
                            </motion.p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-8 pt-4 border-t border-gray-100 flex justify-end space-x-3">
                <Button
                  type="button"
                  variant="outline"
                  className="border-gray-200 text-gray-700"
                >
                  Save as Draft
                </Button>
                
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  {isSubmitting ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Processing...
                    </>
                  ) : (
                    "Submit Case"
                  )}
                </Button>
              </div>
            </form>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default StageThree;
