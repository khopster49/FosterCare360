import { useState, useEffect, useMemo } from 'react';
import { EmploymentEntry } from '@shared/schema';

interface RequiredReferenceTypes {
  currentEmployer: boolean;
  previousEmployer: boolean;
  vulnerableWork: boolean;
}

export function useReferences(employmentEntries: EmploymentEntry[]) {
  const [referenceSettings, setReferenceSettings] = useState<RequiredReferenceTypes>({
    currentEmployer: true,
    previousEmployer: true,
    vulnerableWork: true
  });

  // Get current employer
  const currentEmployer = useMemo(() => {
    return employmentEntries.find(entry => entry.isCurrent);
  }, [employmentEntries]);

  // Get previous employers (not current), sorted by end date (most recent first)
  const previousEmployers = useMemo(() => {
    return employmentEntries
      .filter(entry => !entry.isCurrent)
      .sort((a, b) => {
        const dateA = a.endDate ? new Date(a.endDate).getTime() : 0;
        const dateB = b.endDate ? new Date(b.endDate).getTime() : 0;
        return dateB - dateA;
      });
  }, [employmentEntries]);

  // Get last two employers
  const lastTwoEmployers = useMemo(() => {
    const result = [];
    if (currentEmployer) {
      result.push(currentEmployer);
    }
    
    const filteredPrevious = previousEmployers.slice(0, result.length === 1 ? 1 : 2);
    return [...result, ...filteredPrevious];
  }, [currentEmployer, previousEmployers]);

  // Get employers where applicant worked with vulnerable people
  const vulnerableWorkEmployers = useMemo(() => {
    return employmentEntries.filter(entry => entry.workedWithVulnerable);
  }, [employmentEntries]);

  // Calculate required references based on settings
  const requiredReferences = useMemo(() => {
    const references = new Set<EmploymentEntry>();
    
    // Add current employer if setting is enabled
    if (referenceSettings.currentEmployer && currentEmployer) {
      references.add(currentEmployer);
    }
    
    // Add previous employer if setting is enabled (up to 1 previous if we have current, or 2 if we don't)
    if (referenceSettings.previousEmployer && previousEmployers.length > 0) {
      const limit = currentEmployer ? 1 : 2;
      previousEmployers.slice(0, limit).forEach(employer => references.add(employer));
    }
    
    // Add all employers where applicant worked with vulnerable people if setting is enabled
    if (referenceSettings.vulnerableWork) {
      vulnerableWorkEmployers.forEach(employer => references.add(employer));
    }
    
    return Array.from(references);
  }, [
    referenceSettings, 
    currentEmployer, 
    previousEmployers, 
    vulnerableWorkEmployers
  ]);

  const updateReferenceSettings = (settings: Partial<RequiredReferenceTypes>) => {
    setReferenceSettings(prev => ({
      ...prev,
      ...settings
    }));
  };

  return {
    currentEmployer,
    previousEmployers,
    lastTwoEmployers,
    vulnerableWorkEmployers,
    requiredReferences,
    referenceSettings,
    updateReferenceSettings
  };
}
