'use client';

import { useState, useEffect, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { bookingApi, computeClientEstimate } from '../services/bookingApi';
import { PriceEstimateResponse } from '../types/booking';

export function usePriceEstimate(
  services: string[] = [],
  weightKg: number = 5,
  durationDays: number = 1
) {
  const [debouncedParams, setDebouncedParams] = useState({
    services,
    weightKg,
    durationDays,
  });

  // 300ms debounce
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedParams({
        services,
        weightKg,
        durationDays,
      });
    }, 300);

    return () => clearTimeout(handler);
  }, [services, weightKg, durationDays]);

  const serviceKey = useMemo(
    () => [...(debouncedParams.services || [])].sort().join(','),
    [debouncedParams.services]
  );

  // Compute instant client estimate as fallback while query runs
  const instantFallback = useMemo(
    () => computeClientEstimate(services, weightKg, durationDays),
    [services, weightKg, durationDays]
  );

  const {
    data: estimateData,
    isLoading,
    isFetching,
  } = useQuery<PriceEstimateResponse>({
    queryKey: ['price-estimate', serviceKey, debouncedParams.weightKg, debouncedParams.durationDays],
    queryFn: () =>
      bookingApi.estimatePrice({
        services: debouncedParams.services,
        weight_kg: debouncedParams.weightKg,
        duration_days: debouncedParams.durationDays,
      }),
    enabled: debouncedParams.services.length > 0,
    staleTime: 1000 * 30, // 30 seconds
  });

  const finalEstimate = estimateData || instantFallback;

  return {
    estimate: finalEstimate,
    isLoading: isLoading || isFetching,
  };
}
