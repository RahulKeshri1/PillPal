import React, { useState } from 'react';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { PlusCircle } from 'lucide-react';
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useMedicationContext } from '../contexts/MedicationContext';
import BarcodeScanner from './BarcodeScanner';

interface AddMedicationModalProps {
  isOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
}

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Medication name must be at least 2 characters.",
  }),
  dosage: z.string().min(1, {
    message: "Dosage is required.",
  }),
  quantity: z.coerce.number().min(1, {
    message: "Quantity must be at least 1.",
  }),
  schedule: z.string().min(1, {
    message: "Schedule is required.",
  }),
  timeOfDay: z.array(z.string()).min(1, {
    message: "At least one time of day is required.",
  }),
  instructions: z.string().optional(),
  barcode: z.string().optional(),
});

export type MedicationFormValues = z.infer<typeof formSchema>;

const AddMedicationModal: React.FC<AddMedicationModalProps> = ({ isOpen, onOpenChange }) => {
  const [open, setOpen] = useState(isOpen || false);
  const [showScanner, setShowScanner] = useState(false);
  const { addMedication } = useMedicationContext();

  const form = useForm<MedicationFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      dosage: "",
      quantity: 30,
      schedule: "daily",
      timeOfDay: [],
      instructions: "",
      barcode: "",
    },
  });

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
    if (onOpenChange) onOpenChange(newOpen);
    if (!newOpen) {
      // Reset form when closing
      form.reset();
      setShowScanner(false);
    }
  };

  const onSubmit = async (values: MedicationFormValues) => {
    const result = await addMedication(values);
    if (result) {
      handleOpenChange(false);
    }
  };

  const handleBarcodeDetected = (barcode: string) => {
    form.setValue("barcode", barcode);
    // In a real app, we would fetch medication info from an API using the barcode
    setShowScanner(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button className="inline-flex items-center">
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Medication
        </Button>
      </DialogTrigger>
      
      <DialogContent className="sm:max-w-[500px]">
        {showScanner ? (
          <div>
            <DialogHeader>
              <DialogTitle>Scan Medication Barcode</DialogTitle>
              <DialogDescription>
                Align the barcode within the frame and hold steady
              </DialogDescription>
            </DialogHeader>
            <div className="py-4">
              <BarcodeScanner onDetected={handleBarcodeDetected} onCancel={() => setShowScanner(false)} />
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowScanner(false)}>Cancel</Button>
            </DialogFooter>
          </div>
        ) : (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <DialogHeader>
                <DialogTitle>Add New Medication</DialogTitle>
                <DialogDescription>
                  Enter the details of your medication. Click save when you're done.
                </DialogDescription>
              </DialogHeader>
              
              <div className="grid gap-4 py-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Medication Name</FormLabel>
                      <div className="relative">
                        <FormControl>
                          <Input placeholder="Enter medication name" {...field} />
                        </FormControl>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="absolute right-0 top-0 h-full"
                          onClick={() => setShowScanner(true)}
                        >
                          <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M3 4a1 1 0 011-1h3a1 1 0 011 1v3a1 1 0 01-1 1H4a1 1 0 01-1-1V4zm2 2V5h1v1H5zM3 13a1 1 0 011-1h3a1 1 0 011 1v3a1 1 0 01-1 1H4a1 1 0 01-1-1v-3zm2 2v-1h1v1H5zM13 3a1 1 0 00-1 1v3a1 1 0 001 1h3a1 1 0 001-1V4a1 1 0 00-1-1h-3zm1 2v1h1V5h-1zM13 12a1 1 0 00-1 1v3a1 1 0 001 1h3a1 1 0 001-1v-3a1 1 0 00-1-1h-3zm1 2v1h1v-1h-1zM6 7a1 1 0 011-1h1a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h1a1 1 0 100-2H7zM17 7a1 1 0 01-1 1h-1a1 1 0 110-2h1a1 1 0 011 1zm-1 3a1 1 0 100 2h1a1 1 0 100-2h-1z" clipRule="evenodd" />
                          </svg>
                        </Button>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="dosage"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Dosage</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., 10mg" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="quantity"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Quantity</FormLabel>
                        <FormControl>
                          <Input type="number" placeholder="30" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <FormField
                  control={form.control}
                  name="schedule"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Schedule</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select schedule" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="daily">Daily</SelectItem>
                          <SelectItem value="every other day">Every Other Day</SelectItem>
                          <SelectItem value="weekly">Weekly</SelectItem>
                          <SelectItem value="custom">Custom</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="timeOfDay"
                  render={() => (
                    <FormItem>
                      <div className="mb-2">
                        <FormLabel>Time of Day</FormLabel>
                      </div>
                      <div className="grid grid-cols-3 gap-2">
                        <FormField
                          control={form.control}
                          name="timeOfDay"
                          render={({ field }) => (
                            <FormItem className="flex items-center space-x-2">
                              <FormControl>
                                <Checkbox
                                  checked={field.value?.includes('08:00')}
                                  onCheckedChange={(checked) => {
                                    const currentValue = [...field.value];
                                    if (checked) {
                                      field.onChange([...currentValue, '08:00']);
                                    } else {
                                      field.onChange(currentValue.filter(v => v !== '08:00'));
                                    }
                                  }}
                                />
                              </FormControl>
                              <FormLabel className="text-sm">Morning</FormLabel>
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="timeOfDay"
                          render={({ field }) => (
                            <FormItem className="flex items-center space-x-2">
                              <FormControl>
                                <Checkbox
                                  checked={field.value?.includes('12:00')}
                                  onCheckedChange={(checked) => {
                                    const currentValue = [...field.value];
                                    if (checked) {
                                      field.onChange([...currentValue, '12:00']);
                                    } else {
                                      field.onChange(currentValue.filter(v => v !== '12:00'));
                                    }
                                  }}
                                />
                              </FormControl>
                              <FormLabel className="text-sm">Afternoon</FormLabel>
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="timeOfDay"
                          render={({ field }) => (
                            <FormItem className="flex items-center space-x-2">
                              <FormControl>
                                <Checkbox
                                  checked={field.value?.includes('18:00')}
                                  onCheckedChange={(checked) => {
                                    const currentValue = [...field.value];
                                    if (checked) {
                                      field.onChange([...currentValue, '18:00']);
                                    } else {
                                      field.onChange(currentValue.filter(v => v !== '18:00'));
                                    }
                                  }}
                                />
                              </FormControl>
                              <FormLabel className="text-sm">Evening</FormLabel>
                            </FormItem>
                          )}
                        />
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="instructions"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Special Instructions</FormLabel>
                      <FormControl>
                        <Textarea placeholder="e.g., Take with food" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                {form.watch('barcode') && (
                  <p className="text-sm text-gray-500">Barcode: {form.watch('barcode')}</p>
                )}
              </div>
              
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => handleOpenChange(false)}>
                  Cancel
                </Button>
                <Button type="submit">Add Medication</Button>
              </DialogFooter>
            </form>
          </Form>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default AddMedicationModal;
