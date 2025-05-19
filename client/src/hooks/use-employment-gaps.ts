import { useState, useEffect } from 'react';
import { calculateEmploymentGaps } from '@/lib/utils';
import { EmploymentEntry, EmploymentGap } from '@shared/schema';

interface UseEmploymentGapsOptions {
  employmentEntries: EmploymentEntry[];
  gapsFromServer?: EmploymentGap[];
  onGapsChange?: (gaps: { startDate: Date; endDate: Date; days: number }[]) => void;
}

interface ExplanationMap {
  [key: string]: string;
}

export function useEmploymentGaps({
  employmentEntries,
  gapsFromServer = [],
  onGapsChange,
}: UseEmploymentGapsOptions) {
  const [gaps, setGaps] = useState<{ startDate: Date; endDate: Date; days: number }[]>([]);
  const [explanations, setExplanations] = useState<ExplanationMap>({});
  
  // Initialize explanations from server data
  useEffect(() => {
    if (gapsFromServer.length > 0) {
      const initialExplanations: ExplanationMap = {};
      gapsFromServer.forEach(gap => {
        const key = `${gap.startDate.toString()}-${gap.endDate.toString()}`;
        initialExplanations[key] = gap.explanation;
      });
      setExplanations(initialExplanations);
    }
  }, [gapsFromServer]);
  
  // Recalculate gaps when employment entries change
  useEffect(() => {
    if (employmentEntries && employmentEntries.length > 1) {
      const calculatedGaps = calculateEmploymentGaps(employmentEntries);
      setGaps(calculatedGaps);
      
      if (onGapsChange) {
        onGapsChange(calculatedGaps);
      }
    } else {
      setGaps([]);
      
      if (onGapsChange) {
        onGapsChange([]);
      }
    }
  }, [employmentEntries, onGapsChange]);
  
  const setExplanation = (startDate: Date, endDate: Date, explanation: string) => {
    const key = `${startDate.toISOString()}-${endDate.toISOString()}`;
    setExplanations(prev => ({
      ...prev,
      [key]: explanation
    }));
  };
  
  const getExplanation = (startDate: Date, endDate: Date): string => {
    const key = `${startDate.toISOString()}-${endDate.toISOString()}`;
    return explanations[key] || '';
  };
  
  const areAllGapsExplained = (): boolean => {
    return gaps.every(gap => {
      const key = `${gap.startDate.toISOString()}-${gap.endDate.toISOString()}`;
      return !!explanations[key];
    });
  };
  
  const getGapsWithExplanations = () => {
    return gaps.map(gap => ({
      ...gap,
      explanation: getExplanation(gap.startDate, gap.endDate)
    }));
  };
  
  return {
    gaps,
    setExplanation,
    getExplanation,
    areAllGapsExplained,
    getGapsWithExplanations
  };
}
