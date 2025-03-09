import { useState } from "react";
import { useLocation } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { insertPersonaSchema } from "@shared/schema";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
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
import { ChevronLeft, Users } from "lucide-react";

const interests = [
  "Technology",
  "Fashion",
  "Sports",
  "Travel",
  "Food",
  "Music",
  "Gaming",
  "Health",
  "Education",
  "Business",
];

export default function PersonaBuilder() {
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const { toast } = useToast();
  const [, navigate] = useLocation();

  const form = useForm({
    resolver: zodResolver(insertPersonaSchema),
    defaultValues: {
      name: "",
      ageRange: { min: 18, max: 65 },
      gender: "",
      location: "",
      interests: [],
      description: "",
    },
  });

  async function onSubmit(data: any) {
    try {
      await apiRequest("POST", "/api/personas", {
        ...data,
        interests: selectedInterests,
      });
      toast({
        title: "Success",
        description: "Persona created successfully",
      });
      navigate("/campaign-creator");
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to create persona",
      });
    }
  }

  const toggleInterest = (interest: string) => {
    setSelectedInterests((prev) =>
      prev.includes(interest)
        ? prev.filter((i) => i !== interest)
        : [...prev, interest]
    );
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Button
        variant="ghost"
        className="mb-6"
        onClick={() => navigate("/")}
      >
        <ChevronLeft className="mr-2 h-4 w-4" /> Back
      </Button>

      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Create Target Persona
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Persona Name</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. Tech-Savvy Professional" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="ageRange.min"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Min Age</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="ageRange.max"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Max Age</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="gender"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Gender</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select gender" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="male">Male</SelectItem>
                        <SelectItem value="female">Female</SelectItem>
                        <SelectItem value="all">All</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Location</FormLabel>
                    <FormControl>
                      <Input placeholder="Country" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="interests"
                render={() => (
                  <FormItem>
                    <FormLabel>Interests</FormLabel>
                    <div className="flex flex-wrap gap-2">
                      {interests.map((interest) => (
                        <Button
                          key={interest}
                          type="button"
                          variant={selectedInterests.includes(interest) ? "default" : "outline"}
                          onClick={() => toggleInterest(interest)}
                          className="h-8"
                        >
                          {interest}
                        </Button>
                      ))}
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Describe the needs and pain points of your target audience"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full">
                Create Persona
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}