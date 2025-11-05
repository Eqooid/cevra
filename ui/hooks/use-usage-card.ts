import useSWR from 'swr';
import { create } from 'zustand';

/**
 * UsageCardState defines the structure of the state managed by the useUsageCard hook.
 * It includes properties for total token usage, response time, target accuracy,
 * and the number of files processed, along with an initData method to initialize these values.
 * @author Cristono Wijaya
 */
export interface UsageCardState {
  data: UsageCardData;
  isLoading?: boolean;
  setData: (data: UsageCardData) => void;
};

/**
 * UsageCardData defines the structure of the data fetched for the usage card.
 * It mirrors the properties of UsageCardState but is used specifically for data retrieval.
 * @author Cristono Wijaya
 */
export interface UsageCardData {
  totalUsageToken: number;
  responseTime: number;
  targetAccuracy: number;
  fileProcessed: number;
};

/**
 * fetchUsageCardData simulates an API call to fetch usage card data.
 * In a real application, this would involve making an HTTP request to a backend service.
 * @return {Promise<UsageCardData>} A promise that resolves to the usage card data.
 * @author Cristono Wijaya
 */
export const fetchUsageCardData = async (): Promise<UsageCardData> => {
  return new Promise((resolve) => {
    resolve({
      totalUsageToken: 123456,
      responseTime: 250,
      targetAccuracy: 85,
      fileProcessed: 3456
    });
  });
}

/**
 * useUsageCard is a Zustand store that manages the state for usage card metrics.
 * It provides default values and an initData method to set initial data.
 * @return {UsageCardState} The state object containing usage metrics and the initData method.
 * @author Cristono Wijaya
 */
const useUsageCard = create<UsageCardState>((set) => ({
  data: {
    totalUsageToken: 0,
    responseTime: 0,
    targetAccuracy: 0,
    fileProcessed: 0
  },
  isLoading: true,
  setData: (data:UsageCardData) => set({ data }),
}));

/**
 * useFetchCard is a custom hook that utilizes SWR to fetch usage card data
 * and updates the Zustand store with the fetched data.
 * @return {UsageCardState} The updated state object containing usage metrics.
 * @author Cristono Wijaya
 */
export const useFetchCard = () => {
  const data = useUsageCard(state => state.data);
  const setData = useUsageCard(state => state.setData);
  useSWR('/api/fetch', fetchUsageCardData, { 
    suspense: true,
    fallbackData: {
      totalUsageToken: 0,
      responseTime: 0,
      targetAccuracy: 0,
      fileProcessed: 0
    },
    onSuccess(response) {
      setData(response);
    }
  });
  return data;
};

export default useUsageCard;