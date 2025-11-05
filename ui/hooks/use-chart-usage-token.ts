import useSWR from 'swr';
import { create } from 'zustand';

/**
 * Dummy data for chart usage token over a month.
 * This data simulates daily token usage for demonstration purposes.
 * @author Cristono Wijaya
 */
const dummyChartUsageTokenData = [
  { date: "2024-04-01", token: 222 },
  { date: "2024-04-02", token: 97 },
  { date: "2024-04-03", token: 167 },
  { date: "2024-04-04", token: 242 },
  { date: "2024-04-05", token: 373 },
  { date: "2024-04-06", token: 301 },
  { date: "2024-04-07", token: 245 },
  { date: "2024-04-08", token: 409 },
  { date: "2024-04-09", token: 59 },
  { date: "2024-04-10", token: 261 },
  { date: "2024-04-11", token: 327 },
  { date: "2024-04-12", token: 292 },
  { date: "2024-04-13", token: 342 },
  { date: "2024-04-14", token: 137 },
  { date: "2024-04-15", token: 120 },
  { date: "2024-04-16", token: 138 },
  { date: "2024-04-17", token: 446 },
  { date: "2024-04-18", token: 364 },
  { date: "2024-04-19", token: 243 },
  { date: "2024-04-20", token: 89 },
  { date: "2024-04-21", token: 137 },
  { date: "2024-04-22", token: 224 },
  { date: "2024-04-23", token: 138 },
  { date: "2024-04-24", token: 387 },
  { date: "2024-04-25", token: 215 },
  { date: "2024-04-26", token: 75 },
  { date: "2024-04-27", token: 383 },
  { date: "2024-04-28", token: 122 },
  { date: "2024-04-29", token: 315 },
  { date: "2024-04-30", token: 454 }
];

/**
 * fetchChartUsageTokenData simulates an API call to fetch chart usage token data.
 * In a real application, this would involve making an HTTP request to a backend service.
 * @return {Promise<Array<{ date: string; token: number }>>} A promise that resolves to the chart usage token data.
 * @author Cristono Wijaya
 */
export const fetchChartUsageTokenData = async (): Promise<Array<{ date: string; token: number }>> => {
  return new Promise((resolve) => {
    resolve(dummyChartUsageTokenData);
  });
}

/**
 * ChartUsageTokenState defines the structure of the state managed by the useChartUsageToken hook.
 * It includes properties for usage token data and an initData method to initialize these values.
 * @author Cristono Wijaya
 */
export interface ChartUsageTokenState {
  usageTokenData: Array<{ date: string; token: number }>;
  isLoading?: boolean;
  setData: (data: Array<{ date: string; token: number }>) => void;
}

/**
 * useChartUsageToken is a Zustand hook that manages the state for chart usage token data.
 * It provides an initData method to initialize the state with dummy data.
 * @return {ChartUsageTokenState} The state object containing usage token data and the initData method.
 * @author Cristono Wijaya
 */
const useChartUsageToken = create<ChartUsageTokenState>((set) => ({
  usageTokenData: [],
  isLoading: true,
  setData: (data: Array<{ date: string; token: number }>) => set({ usageTokenData: data }),
}));


/**
 * useFetchChartUsageToken is a custom hook that utilizes SWR to fetch chart usage token data
 * and updates the Zustand store with the fetched data.
 * @return {Array<{ date: string; token: number }>} The updated chart usage token data.
 * @author Cristono Wijaya
 */
export const useFetchChartUsageToken = () => {
  const usageTokenData = useChartUsageToken(state => state.usageTokenData);
  const setData = useChartUsageToken(state => state.setData);

  useSWR('/api/chart-usage-token', fetchChartUsageTokenData, {
    suspense: true,
    fallbackData: [],
    onSuccess(data) {
      setData(data);
    }
  });
  return usageTokenData;
}

export default useChartUsageToken;