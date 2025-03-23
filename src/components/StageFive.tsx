import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { FormField, StageData } from "@/types/game";
import { validateField } from "@/lib/gameUtils";
import { 
  Calendar, 
  Clock, 
  Code, 
  Users, 
  Check, 
  X, 
  User, 
  FileText, 
  AlertTriangle, 
  Info,
  CheckCircle,
  Flag
} from "lucide-react";

interface StageFiveProps {
  stageData: StageData;
  onComplete: (userInputs: Record<string, string>) => void;
}

const StageFive: React.FC<StageFiveProps> = ({ stageData, onComplete }) => {
  const [formValues, setFormValues] = useState<Record<string, string>>({});
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [validFields, setValidFields] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showRefData, setShowRefData] = useState(true);
  
  // Group fields by sections
  const fieldGroups = {
    "taskBasics": stageData.fields.filter(f => 
      ["projectCode", "taskId", "taskName", "taskType"].includes(f.id)
    ),
    "taskDetails": stageData.fields.filter(f => 
      ["priority", "description", "estimatedHours"].includes(f.id)
    ),
    "assignment": stageData.fields.filter(f => 
      ["assignedTo", "requiredSkills", "additionalResources"].includes(f.id)
    ),
    "scheduling": stageData.fields.filter(f => 
      ["startDate", "dueDate", "dependencies"].includes(f.id)
    ),
    "flags": stageData.fields.filter(f => 
      ["milestoneTask", "reviewRequired"].includes(f.id)
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

  // Calculate completion percentage for progress bar
  const calculateCompletion = () => {
    const totalRequiredFields = stageData.fields.filter(f => f.required).length;
    const completedFields = stageData.fields.filter(f => 
      f.required && validFields.includes(f.id)
    ).length;
    
    return Math.round((completedFields / totalRequiredFields) * 100);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
      className="stage-container"
    >
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 min-h-[600px]">
        {/* Left Sidebar */}
        <div className="lg:col-span-1 space-y-6">
          <Card>
            <CardHeader className="bg-indigo-50 pb-3">
              <CardTitle className="text-lg">Task Assignment</CardTitle>
              <CardDescription>
                Assign a new project task
              </CardDescription>
            </CardHeader>
            <CardContent className="p-3">
              <div className="space-y-2">
                <div className="flex justify-between items-center text-sm">
                  <span>Completion</span>
                  <span className="font-medium">{calculateCompletion()}%</span>
                </div>
                <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-indigo-500 rounded-full" 
                    style={{ width: `${calculateCompletion()}%` }}
                  ></div>
                </div>
              </div>
              
              <div className="mt-4 space-y-1">
                {Object.keys(fieldGroups).map(group => {
                  const groupFields = fieldGroups[group as keyof typeof fieldGroups];
                  const completedInGroup = groupFields.filter(f => validFields.includes(f.id)).length;
                  const allCompleted = completedInGroup === groupFields.length;
                  
                  return (
                    <div key={group} className="flex items-center">
                      {allCompleted ? (
                        <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                      ) : (
                        <div className="h-4 w-4 border rounded-full mr-2 flex-shrink-0"></div>
                      )}
                      <span className={`text-sm ${allCompleted ? 'text-green-700' : ''}`}>
                        {group === 'taskBasics' ? 'Basic Information' : 
                         group === 'taskDetails' ? 'Task Details' :
                         group === 'assignment' ? 'Assignment' :
                         group === 'scheduling' ? 'Scheduling' : 'Flags'}
                      </span>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="p-3 pb-2">
              <div className="flex justify-between items-center">
                <CardTitle className="text-sm font-medium">Reference Data</CardTitle>
                <Button
                  onClick={() => setShowRefData(!showRefData)}
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6"
                >
                  {showRefData ? <X className="h-3 w-3" /> : <Info className="h-3 w-3" />}
                </Button>
              </div>
            </CardHeader>
            <AnimatePresence>
              {showRefData && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <CardContent className="px-3 pb-3 pt-0">
                    <div className="whitespace-pre-wrap text-xs font-mono bg-gray-50 p-2 rounded border overflow-auto max-h-[250px]">
                      {stageData.unstructuredData}
                    </div>
                  </CardContent>
                </motion.div>
              )}
            </AnimatePresence>
          </Card>
        </div>
        
        {/* Main Content */}
        <div className="lg:col-span-4">
          <Card className="h-full">
            <CardHeader className="bg-gradient-to-r from-indigo-600 to-purple-700 text-white">
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>SupportHub Enterprise</CardTitle>
                  <CardDescription className="text-indigo-100">
                    Project Management System
                  </CardDescription>
                </div>
                <Badge className="bg-white text-indigo-800">New Task</Badge>
              </div>
            </CardHeader>
            
            <CardContent className="p-6">
              <form onSubmit={handleSubmit}>
                <div className="space-y-8">
                  {/* Task Basics */}
                  <div>
                    <div className="flex items-center mb-4">
                      <FileText className="h-5 w-5 text-indigo-500 mr-2" />
                      <h2 className="text-lg font-medium">Basic Information</h2>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {fieldGroups.taskBasics.map((field) => (
                        <div key={field.id} className="space-y-2">
                          <Label 
                            htmlFor={field.id}
                            className="flex items-center justify-between"
                          >
                            <span>{field.label} {field.required && <span className="text-red-500">*</span>}</span>
                            {validFields.includes(field.id) && (
                              <CheckCircle className="h-4 w-4 text-green-500" />
                            )}
                          </Label>
                          {renderField(field)}
                          {errors[field.id] && (
                            <p className="text-sm text-red-500">
                              {errors[field.id]}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <Separator />
                  
                  {/* Task Details */}
                  <div>
                    <div className="flex items-center mb-4">
                      <Code className="h-5 w-5 text-indigo-500 mr-2" />
                      <h2 className="text-lg font-medium">Task Details</h2>
                    </div>
                    
                    <div className="grid grid-cols-1 gap-4">
                      {fieldGroups.taskDetails.map((field) => (
                        <div key={field.id} className="space-y-2">
                          <Label 
                            htmlFor={field.id}
                            className="flex items-center justify-between"
                          >
                            <span>{field.label} {field.required && <span className="text-red-500">*</span>}</span>
                            {validFields.includes(field.id) && (
                              <CheckCircle className="h-4 w-4 text-green-500" />
                            )}
                          </Label>
                          {renderField(field)}
                          {errors[field.id] && (
                            <p className="text-sm text-red-500">
                              {errors[field.id]}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Assignment */}
                    <div>
                      <div className="flex items-center mb-4">
                        <User className="h-5 w-5 text-indigo-500 mr-2" />
                        <h2 className="text-lg font-medium">Assignment</h2>
                      </div>
                      
                      <div className="space-y-4">
                        {fieldGroups.assignment.map((field) => (
                          <div key={field.id} className="space-y-2">
                            <Label 
                              htmlFor={field.id}
                              className="flex items-center justify-between"
                            >
                              <span>{field.label} {field.required && <span className="text-red-500">*</span>}</span>
                              {validFields.includes(field.id) && (
                                <CheckCircle className="h-4 w-4 text-green-500" />
                              )}
                            </Label>
                            {renderField(field)}
                            {errors[field.id] && (
                              <p className="text-sm text-red-500">
                                {errors[field.id]}
                              </p>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    {/* Scheduling */}
                    <div>
                      <div className="flex items-center mb-4">
                        <Calendar className="h-5 w-5 text-indigo-500 mr-2" />
                        <h2 className="text-lg font-medium">Scheduling</h2>
                      </div>
                      
                      <div className="space-y-4">
                        {fieldGroups.scheduling.map((field) => (
                          <div key={field.id} className="space-y-2">
                            <Label 
                              htmlFor={field.id}
                              className="flex items-center justify-between"
                            >
                              <span>{field.label} {field.required && <span className="text-red-500">*</span>}</span>
                              {validFields.includes(field.id) && (
                                <CheckCircle className="h-4 w-4 text-green-500" />
                              )}
                            </Label>
                            {renderField(field)}
                            {errors[field.id] && (
                              <p className="text-sm text-red-500">
                                {errors[field.id]}
                              </p>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  {/* Flags */}
                  <div>
                    <div className="flex items-center mb-4">
                      <Flag className="h-5 w-5 text-indigo-500 mr-2" />
                      <h2 className="text-lg font-medium">Task Flags</h2>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {fieldGroups.flags.map((field) => (
                        <div key={field.id} className="space-y-2">
                          <Label 
                            htmlFor={field.id}
                            className="flex items-center justify-between"
                          >
                            <span>{field.label} {field.required && <span className="text-red-500">*</span>}</span>
                            {validFields.includes(field.id) && (
                              <CheckCircle className="h-4 w-4 text-green-500" />
                            )}
                          </Label>
                          {renderField(field)}
                          {errors[field.id] && (
                            <p className="text-sm text-red-500">
                              {errors[field.id]}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                
                <div className="mt-8 flex justify-end">
                  <Button 
                    type="submit" 
                    disabled={isSubmitting} 
                    className="bg-indigo-600 hover:bg-indigo-700 text-white"
                  >
                    {isSubmitting ? "Processing..." : "Assign Task"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </motion.div>
  );
};

export default StageFive; 