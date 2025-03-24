import React from 'react';
import { TutorialSystem } from '../components/TutorialSystem';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

export default function TutorialsPage() {
  return (
    <div className="container mx-auto py-6">
      <div className="flex flex-col space-y-6">
        <div className="flex flex-col space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Learning Center</h1>
          <p className="text-muted-foreground">
            Master digital marketing with our structured learning path. Complete tutorials to unlock simulations.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="bg-gradient-to-br from-amber-50 to-amber-100 border-amber-200">
            <CardHeader className="pb-2">
              <CardTitle className="text-amber-800">SEO Fundamentals</CardTitle>
              <CardDescription className="text-amber-700">Master the basics of search optimization</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-amber-900">Learn how to optimize content for search engines with our step-by-step guides.</p>
            </CardContent>
            <CardFooter>
              <p className="text-xs text-amber-600">5 modules - Beginner friendly</p>
            </CardFooter>
          </Card>
          
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
            <CardHeader className="pb-2">
              <CardTitle className="text-blue-800">Google Ads</CardTitle>
              <CardDescription className="text-blue-700">Drive traffic with paid search</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-blue-900">Learn campaign setup, optimization, and advanced strategies for Google Ads.</p>
            </CardContent>
            <CardFooter>
              <p className="text-xs text-blue-600">10 modules - All levels</p>
            </CardFooter>
          </Card>
          
          <Card className="bg-gradient-to-br from-emerald-50 to-emerald-100 border-emerald-200">
            <CardHeader className="pb-2">
              <CardTitle className="text-emerald-800">Social Media Marketing</CardTitle>
              <CardDescription className="text-emerald-700">Build your brand presence</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-emerald-900">Create engaging social campaigns across multiple platforms.</p>
            </CardContent>
            <CardFooter>
              <p className="text-xs text-emerald-600">Coming soon</p>
            </CardFooter>
          </Card>
          
          <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
            <CardHeader className="pb-2">
              <CardTitle className="text-purple-800">Analytics & Reporting</CardTitle>
              <CardDescription className="text-purple-700">Data-driven decisions</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-purple-900">Turn data into actionable insights for your marketing campaigns.</p>
            </CardContent>
            <CardFooter>
              <p className="text-xs text-purple-600">Coming soon</p>
            </CardFooter>
          </Card>
        </div>
        
        <TutorialSystem />
      </div>
    </div>
  );
}