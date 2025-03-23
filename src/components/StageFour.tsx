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
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { FormField, StageData } from "@/types/game";
import { validateField } from "@/lib/gameUtils";
import { 
  ShoppingCart, 
  Truck, 
  Package, 
  CreditCard, 
  ClipboardList, 
  Settings, 
  User, 
  ChevronRight, 
  AlertCircle,
  CheckCircle 
} from "lucide-react";

interface StageFourProps {
  stageData: StageData;
  onComplete: (userInputs: Record<string, string>) => void;
}

const StageFour: React.FC<StageFourProps> = ({ stageData, onComplete }) => {
  const [formValues, setFormValues] = useState<Record<string, string>>({});
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [validFields, setValidFields] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showUnstructuredData, setShowUnstructuredData] = useState(true);
  const [activeTab, setActiveTab] = useState("orderDetails");

  // Group fields by tabs
  const fieldGroups = {
    "orderDetails": stageData.fields.filter(f => 
      ["orderNumber", "customerName", "productSKU", "quantity", "unitPrice", "discountCode"].includes(f.id)
    ),
    "shipping": stageData.fields.filter(f => 
      ["shippingMethod", "deliveryNotes"].includes(f.id)
    ),
    "customization": stageData.fields.filter(f => 
      ["customization", "customizationDetails", "giftWrapping"].includes(f.id)
    ),
    "payment": stageData.fields.filter(f => 
      ["paymentMethod"].includes(f.id)
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

  // Calculate order summary
  const calculateSummary = () => {
    const quantity = parseInt(formValues.quantity || "0");
    const unitPrice = parseFloat(formValues.unitPrice || "0");
    const subtotal = quantity * unitPrice;
    
    // Apply discount if code exists
    let discount = 0;
    if (formValues.discountCode) {
      discount = subtotal * 0.2; // Assume 20% discount
    }
    
    // Shipping cost based on method
    let shippingCost = 0;
    switch (formValues.shippingMethod) {
      case "Standard":
        shippingCost = 10;
        break;
      case "Express":
        shippingCost = 25;
        break;
      case "Next Day":
        shippingCost = 50;
        break;
      case "International":
        shippingCost = 75;
        break;
      case "In-Store Pickup":
        shippingCost = 0;
        break;
    }
    
    // Add customization fee
    let customizationFee = 0;
    switch (formValues.customization) {
      case "None":
        customizationFee = 0;
        break;
      case "Engraving":
        customizationFee = 50;
        break;
      case "Color Modification":
        customizationFee = 35;
        break;
      case "Size Adjustment":
        customizationFee = 25;
        break;
      case "Bundle Package":
        customizationFee = 15;
        break;
    }
    
    // Gift wrapping fee
    const giftWrappingFee = formValues.giftWrapping === 'true' ? 5 : 0;
    
    const total = subtotal - discount + shippingCost + customizationFee + giftWrappingFee;
    
    return {
      subtotal: subtotal.toFixed(2),
      discount: discount.toFixed(2),
      shippingCost: shippingCost.toFixed(2),
      customizationFee: customizationFee.toFixed(2),
      giftWrappingFee: giftWrappingFee.toFixed(2),
      total: total.toFixed(2)
    };
  };

  const summary = calculateSummary();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
      className="stage-container"
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 min-h-[600px]">
        {/* Left Sidebar with Customer Data */}
        <div className="lg:col-span-1">
          <Card className="h-full">
            <CardHeader className="bg-green-50 border-b">
              <div className="flex justify-between items-center">
                <CardTitle className="text-lg font-medium">Order Information</CardTitle>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => setShowUnstructuredData(!showUnstructuredData)}
                >
                  {showUnstructuredData ? "Hide" : "Show"}
                </Button>
              </div>
            </CardHeader>
            
            <AnimatePresence>
              {showUnstructuredData && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <CardContent className="p-4">
                    <div className="whitespace-pre-wrap font-mono text-sm bg-gray-50 p-3 rounded border overflow-auto max-h-[500px]">
                      {stageData.unstructuredData}
                    </div>
                  </CardContent>
                </motion.div>
              )}
            </AnimatePresence>
            
            <CardContent className="p-0">
              <div className="p-4">
                <h3 className="font-semibold text-sm text-gray-500 mb-3">ORDER SUMMARY</h3>
                <Table>
                  <TableBody>
                    <TableRow>
                      <TableCell className="py-2 pl-0 font-medium">Subtotal</TableCell>
                      <TableCell className="py-2 pr-0 text-right">${summary.subtotal}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="py-2 pl-0 font-medium">Discount</TableCell>
                      <TableCell className="py-2 pr-0 text-right text-red-500">-${summary.discount}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="py-2 pl-0 font-medium">Shipping</TableCell>
                      <TableCell className="py-2 pr-0 text-right">${summary.shippingCost}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="py-2 pl-0 font-medium">Customization</TableCell>
                      <TableCell className="py-2 pr-0 text-right">${summary.customizationFee}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="py-2 pl-0 font-medium">Gift Wrapping</TableCell>
                      <TableCell className="py-2 pr-0 text-right">${summary.giftWrappingFee}</TableCell>
                    </TableRow>
                    <TableRow className="border-t-2">
                      <TableCell className="py-2 pl-0 font-bold">Total</TableCell>
                      <TableCell className="py-2 pr-0 text-right font-bold">${summary.total}</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Main Content - Order Processing Form */}
        <div className="lg:col-span-2">
          <Card className="h-full">
            <CardHeader className="bg-gradient-to-r from-green-500 to-teal-600 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>SupportHub Enterprise</CardTitle>
                  <CardDescription className="text-white opacity-90">
                    Order Processing System
                  </CardDescription>
                </div>
                <ShoppingCart className="h-8 w-8 opacity-75" />
              </div>
            </CardHeader>
            
            <CardContent className="p-0">
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <div className="border-b">
                  <TabsList className="w-full justify-start rounded-none border-b bg-transparent h-12 p-0">
                    <TabsTrigger 
                      value="orderDetails" 
                      className="flex items-center data-[state=active]:border-b-2 data-[state=active]:border-green-500 data-[state=active]:text-green-700 rounded-none border-transparent h-12 pt-1"
                    >
                      <ClipboardList className="h-4 w-4 mr-2" />
                      Order Details
                    </TabsTrigger>
                    <TabsTrigger 
                      value="shipping" 
                      className="flex items-center data-[state=active]:border-b-2 data-[state=active]:border-green-500 data-[state=active]:text-green-700 rounded-none border-transparent h-12 pt-1"
                    >
                      <Truck className="h-4 w-4 mr-2" />
                      Shipping
                    </TabsTrigger>
                    <TabsTrigger 
                      value="customization" 
                      className="flex items-center data-[state=active]:border-b-2 data-[state=active]:border-green-500 data-[state=active]:text-green-700 rounded-none border-transparent h-12 pt-1"
                    >
                      <Settings className="h-4 w-4 mr-2" />
                      Customization
                    </TabsTrigger>
                    <TabsTrigger 
                      value="payment" 
                      className="flex items-center data-[state=active]:border-b-2 data-[state=active]:border-green-500 data-[state=active]:text-green-700 rounded-none border-transparent h-12 pt-1"
                    >
                      <CreditCard className="h-4 w-4 mr-2" />
                      Payment
                    </TabsTrigger>
                  </TabsList>
                </div>
                
                <form onSubmit={handleSubmit}>
                  <div className="p-6">
                    <TabsContent value="orderDetails" className="mt-0">
                      <h2 className="text-xl font-semibold mb-4">Order Details</h2>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {fieldGroups.orderDetails.map((field) => (
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
                              <p className="text-sm text-red-500 flex items-center mt-1">
                                <AlertCircle className="h-3 w-3 mr-1" />
                                {errors[field.id]}
                              </p>
                            )}
                          </div>
                        ))}
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="shipping" className="mt-0">
                      <h2 className="text-xl font-semibold mb-4">Shipping Information</h2>
                      <div className="grid grid-cols-1 gap-4">
                        {fieldGroups.shipping.map((field) => (
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
                              <p className="text-sm text-red-500 flex items-center mt-1">
                                <AlertCircle className="h-3 w-3 mr-1" />
                                {errors[field.id]}
                              </p>
                            )}
                          </div>
                        ))}
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="customization" className="mt-0">
                      <h2 className="text-xl font-semibold mb-4">Customization Options</h2>
                      <div className="grid grid-cols-1 gap-4">
                        {fieldGroups.customization.map((field) => (
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
                              <p className="text-sm text-red-500 flex items-center mt-1">
                                <AlertCircle className="h-3 w-3 mr-1" />
                                {errors[field.id]}
                              </p>
                            )}
                          </div>
                        ))}
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="payment" className="mt-0">
                      <h2 className="text-xl font-semibold mb-4">Payment Method</h2>
                      <div className="grid grid-cols-1 gap-4">
                        {fieldGroups.payment.map((field) => (
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
                              <p className="text-sm text-red-500 flex items-center mt-1">
                                <AlertCircle className="h-3 w-3 mr-1" />
                                {errors[field.id]}
                              </p>
                            )}
                          </div>
                        ))}
                      </div>
                    </TabsContent>
                  </div>
                  
                  <CardFooter className="flex justify-between border-t p-6">
                    <Button type="button" variant="outline" onClick={() => {
                      const prevTab = {
                        "orderDetails": "orderDetails",
                        "shipping": "orderDetails",
                        "customization": "shipping",
                        "payment": "customization"
                      }[activeTab];
                      setActiveTab(prevTab);
                    }}>
                      Back
                    </Button>
                    {activeTab !== "payment" ? (
                      <Button type="button" onClick={() => {
                        const nextTab = {
                          "orderDetails": "shipping",
                          "shipping": "customization",
                          "customization": "payment",
                          "payment": "payment"
                        }[activeTab];
                        setActiveTab(nextTab);
                      }}>
                        Next <ChevronRight className="ml-1 h-4 w-4" />
                      </Button>
                    ) : (
                      <Button 
                        type="submit" 
                        disabled={isSubmitting} 
                        className="bg-green-600 hover:bg-green-700"
                      >
                        {isSubmitting ? "Processing..." : "Submit Order"}
                      </Button>
                    )}
                  </CardFooter>
                </form>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
    </motion.div>
  );
};

export default StageFour; 