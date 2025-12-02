 
import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getTransactionsBySelected } from '@/actions'; 

export const useGetAllPaymemts = (startDate: Date, endDate: Date) => {
  const [localData, setLocalData] = useState<any[] | null>(null);
  const [isCheckingLocal, setIsCheckingLocal] = useState(true);
  const [storedRangeKey, setStoredRangeKey] = useState<string | null>(null);
  const rangeKey = `${startDate.toISOString()}_${endDate.toISOString()}`;
  useEffect(() => {
    try {
      const raw = localStorage.getItem('paymentsData');
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed && parsed.rangeKey && parsed.data) {
          setStoredRangeKey(parsed.rangeKey);
          if (parsed.rangeKey === rangeKey) {
            setLocalData(parsed.data);
          } else {
            // cached data is for a different range — don't use it
            setLocalData(null);
          }
        } else {
          // old shape or invalid — clear it to avoid confusion
          setLocalData(null);
          setStoredRangeKey(null);
        }
      } else {
        setLocalData(null);
      }
    } catch (err) {
      setLocalData(null);
      setStoredRangeKey(null);
    } finally {
      setIsCheckingLocal(false);
    }
  }, []); 

  const { data, isLoading, refetch } = useQuery({
    queryKey: ['trackerData', rangeKey],
    queryFn: async () => {
      const fetched = await getTransactionsBySelected(startDate, endDate);
      try {
        localStorage.setItem(
          'paymentsData',
          JSON.stringify({ rangeKey, data: fetched })
        );
        setStoredRangeKey(rangeKey);
      } catch (err) {
      }
      setLocalData(fetched);
      return fetched;
    },
    // Only auto-run the query if we've finished checking local storage and we have no usable localData.
    // If localData === null, that means either no cache or cache is for a different range.
    enabled: !isCheckingLocal && localData === null,
  });
  useEffect(() => {
    if (data) {
      setLocalData(data);
    }
  }, [data]);

  // If user changes startDate/endDate and we have a different storedRangeKey, trigger refetch.
  useEffect(() => {
    // Only try refetching after initial local check finished
    if (!isCheckingLocal) {
      if (storedRangeKey !== rangeKey) {
        // Clear localData so UI can show loading if needed, then refetch
        setLocalData(null);
        // call refetch to fetch new range
        refetch().catch(() => {
          /* handle / ignore errors; react-query will keep its state */
        });
      } else {
        // If storedRangeKey === rangeKey, localData should already be set by the mount effect,
        // so no fetch required.
      }
    }
  }, [rangeKey, isCheckingLocal, storedRangeKey, refetch]);

  return {
    data: localData,
    isLoading: isCheckingLocal || (localData === null && isLoading),
    refetch,
  };
};
