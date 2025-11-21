import { getTransactionsBySelected } from "@/actions";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";

export const useGetAllPaymemts = (startDate, endDate) => {
  const [localData, setLocalData] = useState (null);
  const [isCheckingLocal, setIsCheckingLocal] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem('paymentsData');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setLocalData(parsed);
      } catch (error) {
      }
    }
    setIsCheckingLocal(false);
  }, []);

  const { data, isLoading, refetch } = useQuery({
    queryKey: ['trackerData', startDate, endDate],
    queryFn: async () => {
      const fetched = await getTransactionsBySelected(startDate, endDate);
      localStorage.setItem('paymentsData', JSON.stringify(fetched));
      setLocalData(fetched);
      return fetched;
    },
    enabled: !isCheckingLocal && localData === null, 
  });

  useEffect(() => {
    if (data) {
      setLocalData(data);
    }
  }, [data]);


  return {
    data: localData,
    isLoading: isCheckingLocal || (localData === null && isLoading),
    refetch: refetch, // Expose refetch
  };
};

//  const { data, isLoading } = useQuery({
//     queryKey: ['trackerData', startDate, endDate],
//     queryFn: async () => {
//       const res = await getTransactionsBySelected(startDate, endDate)
//       return res
//     }
//   })
