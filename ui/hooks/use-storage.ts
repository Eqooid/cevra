'use client';

import useSWR from "swr";
import { create } from "zustand";

/**
 * dummyData is an array of Storage objects used to simulate storage data for testing purposes.
 * Each object contains properties such as id, name, description, usedSpace, inProgress,
 * completed, failed, cancelled, total, and createdAt.
 * @author Cristono Wijaya
 */
const dummyData:Storage[] = [
  {
    id: "ad123133",
    name: "Storage A",
    description: "Primary storage for project A",
    usedSpace: "300GB",
    inProgress: 50,
    completed: 1150,
    failed: 0,
    cancelled: 0,
    total: 1200,
    createdAt: "2023-01-15",
  },
  {
    id: "bd456456",
    name: "Storage B",
    description: "Backup storage for project B",
    usedSpace: "500GB",
    inProgress: 20,
    completed: 980,
    failed: 5,
    cancelled: 2,
    total: 1007,
    createdAt: "2023-02-20",
  },  
  {
    id: "ce789789",
    name: "Storage C",
    description: "Archive storage for project C",
    usedSpace: "1TB",
    inProgress: 0,
    completed: 1500,
    failed: 10,
    cancelled: 1,
    total: 1511,
    createdAt: "2023-03-10",
  },
  {
    id: "df012012",
    name: "Storage D",
    description: "Temporary storage for project D",
    usedSpace: "200GB",
    inProgress: 5,
    completed: 495,
    failed: 0,
    cancelled: 0,
    total: 500,
    createdAt: "2023-04-05",
  },
  {
    id: "eg345345",
    name: "Storage E",
    description: "Development storage for project E",
    usedSpace: "750GB",
    inProgress: 15,
    completed: 885,
    failed: 3,
    cancelled: 1,
    total: 904,
    createdAt: "2023-05-12",
  },
  {
    id: "fh678678",
    name: "Storage F",
    description: "Testing storage for project F",
    usedSpace: "400GB",
    inProgress: 30,
    completed: 670,
    failed: 2,
    cancelled: 0,
    total: 702,
    createdAt: "2023-06-18",
  },
  {
    id: "gi901901",
    name: "Storage G",
    description: "Production storage for project G",
    usedSpace: "2TB",
    inProgress: 10,
    completed: 2340,
    failed: 15,
    cancelled: 3,
    total: 2368,
    createdAt: "2023-07-25",
  },
  {
    id: "hj234234",
    name: "Storage H",
    description: "Media storage for project H",
    usedSpace: "1.5TB",
    inProgress: 8,
    completed: 1892,
    failed: 7,
    cancelled: 2,
    total: 1909,
    createdAt: "2023-08-14",
  },
  {
    id: "ik567567",
    name: "Storage I",
    description: "Analytics storage for project I",
    usedSpace: "600GB",
    inProgress: 25,
    completed: 775,
    failed: 1,
    cancelled: 0,
    total: 801,
    createdAt: "2023-09-30",
  },
  {
    id: "jl890890",
    name: "Storage J",
    description: "Emergency backup storage for project J",
    usedSpace: "800GB",
    inProgress: 12,
    completed: 1088,
    failed: 4,
    cancelled: 1,
    total: 1105,
    createdAt: "2023-10-22",
  }
];

/**
 * Storage defines the structure of a storage object.
 * It includes properties such as id, name, description, usedSpace,
 * inProgress, completed, failed, cancelled, total, and createdAt.
 * @author Cristono Wijaya
 */
export type Storage = {
  id: string;
  name: string;
  description: string;
  usedSpace: string;
  inProgress: number;
  completed: number;
  failed: number;
  cancelled: number;
  total: number;
  createdAt: string;
};

/**
 * StorageState defines the structure of the state managed by the useStorage hook.
 * It includes properties for storage data, loading state, selected storage items,
 * and methods for manipulating the storage data.
 * @author Cristono Wijaya
 */
export interface StorageState {
  storageData: Storage[];
  singleStorage?: Storage;
  isLoading: boolean;
  selectedStorage: string[];
  setData: (data: Storage[]) => void;
  setSingle: (storage: Storage|undefined) => void;
  add: (name:string, description:string) => void;
  update: (id:string, name:string, description:string) => void;
  form:{ name:string; description:string; };
  remove: (id:string) => void;
  setSelectedStorage: (selected: string[]) => void;
  bulkRemove: () => void;
  setLoading: (loading: boolean) => void;
}

/**
 * useStorage is a Zustand store that manages the state for storage data.
 * It provides methods to set, add, update, and remove storage items,
 * as well as manage selected storage items for bulk operations.
 * @return {StorageState} The state object containing storage properties and methods.
 * @author Cristono Wijaya
 */
const useStorage = create<StorageState>((set, get) => ({
  singleStorage: undefined,
  storageData: [],
  isLoading: true,
  selectedStorage: [],
  setData: (data: Storage[]) => {
    set({ storageData: data, isLoading: false });
  },
  setSingle: (storage: Storage|undefined) => {
    set({ singleStorage: storage, isLoading: false });
  },
  add: async (name:string, description:string) => {
    const newStorage:Storage = await addStorage(name, description);
    set((state) => ({ storageData: [newStorage, ...state.storageData] }))
  },
  update: async (id:string, name:string, description:string) => {
    const updatedStorage:Storage = await updateStorage(id, name, description);
    set((state) => ({
      storageData: state.storageData.map(storage =>
        storage.id === updatedStorage.id ? updatedStorage : storage
      )
    }));
  },
  form: { id: "", name: "", description: "" },
  remove: async (id:string) => {
    await deleteStorage(id);
    set((state) => ({
      storageData: state.storageData.filter(storage => storage.id !== id)
    }));
  },
  setSelectedStorage: (selected: string[]) => set({ selectedStorage: selected }),
  bulkRemove: async () => {
    const ids = get().selectedStorage;
    await bulkDeleteStorage(ids);
    set((state) => ({
      storageData: state.storageData.filter(storage => !ids.includes(storage.id)),
      selectedStorage: [],
    }));
  },
  setLoading: (loading: boolean) => set({ isLoading: loading }),
}));

/**
 * fetchStorageData simulates fetching storage data from an API.
 * It returns a promise that resolves to an array of Storage objects after a delay.
 * @return {Promise<Storage[]>} A promise that resolves to an array of Storage objects.
 * @author Cristono Wijaya
 */
const fetchStorageData = async (): Promise<Storage[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(dummyData);
    }, 1000);
  });
};

/**
 * findStorageById simulates fetching a storage item by its ID.
 * It returns a promise that resolves to the Storage object if found, or undefined if not found.
 * @param {string} id - The ID of the storage to be fetched.
 * @return {Promise<Storage | undefined>} A promise that resolves to the Storage object or undefined.
 * @author Cristono Wijaya
 */
const findStorageById = async (id:string): Promise<Storage | undefined> => {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(dummyData.find(storage => storage.id === id))
    }, 1000);
  });
};

/**
 * addStorage simulates adding a new storage item.
 * It returns a promise that resolves to the newly created Storage object.
 * @param {string} name - The name of the new storage.
 * @param {string} description - The description of the new storage.
 * @return {Promise<Storage>} A promise that resolves to the newly created Storage object.
 * @author Cristono Wijaya
 */
const addStorage = async (name:string, description:string): Promise<Storage> => {
  const dummyId = crypto.getRandomValues(new Uint8Array(16))
    .reduce((acc, byte) => acc + byte.toString(16).padStart(2, '0'), '');
  return new Promise<Storage>((resolve) => {
    const newStorage: Storage = {
      id: dummyId,
      name,
      description,
      usedSpace: "0GB",
      inProgress: 0,
      completed: 0,
      failed: 0,
      cancelled: 0,
      total: 0,
      createdAt: new Date().toISOString().split('T')[0],
    };
    resolve(newStorage);
  });
}

/**
 * updateStorage simulates updating an existing storage item.
 * It returns a promise that resolves to the updated Storage object.
 * @param {string} id - The ID of the storage to be updated.
 * @param {string} name - The new name for the storage.
 * @param {string} description - The new description for the storage.
 * @return {Promise<Storage>} A promise that resolves to the updated Storage object.
 * @author Cristono Wijaya
 */
const updateStorage = async (id:string, name:string, description:string): Promise<Storage> => {
  return new Promise<Storage>((resolve) => {
    const findedStorage = dummyData.find(storage => storage.id === id);
    if (!findedStorage) {
      throw new Error("Storage not found");
    }
    const updatedStorage: Storage = {
      ...findedStorage,
      name,
      description,
    };
    resolve(updatedStorage);
  });
};

/**
 * deleteStorage simulates deleting a storage item.
 * It returns a promise that resolves when the deletion is complete.
 * @param {string} id - The ID of the storage to be deleted.
 * @return {Promise<void>} A promise that resolves when the deletion is complete.
 * @author Cristono Wijaya
 */
const deleteStorage = async (id:string): Promise<void> => {
  return new Promise<void>((resolve) => {
    resolve();
  });
};

/**
 * bulkDeleteStorage simulates deleting multiple storage items.
 * It returns a promise that resolves when the bulk deletion is complete.
 * @param {string[]} ids - An array of IDs of the storages to be deleted.
 * @return {Promise<void>} A promise that resolves when the bulk deletion is complete.
 * @author Cristono Wijaya
 */
const bulkDeleteStorage = async (ids:string[]): Promise<void> => {
  return new Promise<void>((resolve) => {
    resolve();
  });
};

/**
 * useFetchStorage is a custom hook that fetches storage data using SWR.
 * It updates the useStorage Zustand store with the fetched data.
 * @return {{ isLoading: boolean; data: Storage[] }} An object containing the loading state and fetched storage data.
 * @author Cristono Wijaya
 */
export const useFetchStorage = () => {
  const storageData = useStorage(state => state.storageData);
  const isLoading = useStorage(state => state.isLoading);
  const setData = useStorage(state => state.setData);

  useSWR<Storage[]>('storageData', fetchStorageData, {
    suspense: true,
    fallbackData: [],
    fallback: [],
    refreshInterval: 0,
    revalidateOnFocus: false,
    onSuccess: (fetchedData) => {
      setData(fetchedData);
    }
  });
  return {
    isLoading: isLoading,
    data: storageData
  };
};

/**
 * useFetchSingleStorage is a custom hook that fetches a single storage item by ID using SWR.
 * It updates the useStorage Zustand store with the fetched storage item.
 * @param {string} id - The ID of the storage to be fetched.
 * @return {{ isLoading: boolean; data: Storage | undefined }} An object containing the loading state and fetched storage item.
 * @author Cristono Wijaya
 */
export const useFetchSingleStorage = (id:string) => {
  const singleStorage = useStorage(state => state.singleStorage);
  const isLoading = useStorage(state => state.isLoading);
  const setSingle = useStorage(state => state.setSingle);
  
  useSWR<Storage|undefined>(`single-storage-${id}`, () => findStorageById(id), {
    suspense: true,
    fallback: {},
    refreshInterval: 0,
    revalidateOnFocus: false,
    fallbackData: {
      id: "",
      name: "",
      description: "",
      usedSpace: "",
      inProgress: 0,
      completed: 0,
      failed: 0,
      cancelled: 0,
      total: 0,
      createdAt: "",
    },
    onSuccess: (response) => {
      setSingle(response);
    }
  });
  
  return {
    isLoading,
    data: singleStorage
  };
}

export default useStorage;



