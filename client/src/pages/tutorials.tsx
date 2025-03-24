import React from 'react';
import { TutorialSystem } from '../components/TutorialSystem';

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
        
        <TutorialSystem />
      </div>
    </div>
  );
}