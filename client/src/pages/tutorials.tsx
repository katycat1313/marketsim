import React from 'react';
import { TutorialSystem } from '../components/TutorialSystem';
import ErrorBoundary from '../components/ErrorBoundary';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';

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
        
        <ErrorBoundary
          fallback={
            <div className="p-4">
              <Alert variant="destructive" className="mb-4">
                <AlertTitle>Tutorial Error</AlertTitle>
                <AlertDescription>
                  There was a problem loading the tutorials. Please try again later.
                </AlertDescription>
              </Alert>
              <Button onClick={() => window.location.reload()} className="mt-4">
                Refresh Page
              </Button>
            </div>
          }
        >
          <TutorialSystem />
        </ErrorBoundary>
      </div>
    </div>
  );
}