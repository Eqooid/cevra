'use client';

import api from "@/apis/cevra-api";
import useSWR from "swr";
import { create } from "zustand";

/**
 * Storage defines the structure of a storage object.
 * It includes properties such as id, name, description, usedSpace,
 * inProgress, completed, failed, cancelled, total, and createdAt.
 * @author Cristono Wijaya
 */
export type Storage = {
  _id: string;
  name: string;
  description: string;
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
        storage._id === updatedStorage._id ? 
          {
            ...storage,
            name: updatedStorage.name,
            description: updatedStorage.description,
          } 
        : storage
      )
    }));
  },
  form: { id: "", name: "", description: "" },
  remove: async (id:string) => {
    await deleteStorage(id);
    set((state) => ({
      storageData: state.storageData.filter(storage => storage._id !== id)
    }));
  },
  setSelectedStorage: (selected: string[]) => set({ selectedStorage: selected }),
  bulkRemove: async () => {
    const ids = get().selectedStorage;
    await bulkDeleteStorage(ids);
    set((state) => ({
      storageData: state.storageData.filter(storage => !ids.includes(storage._id)),
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
  const response = await api.get('/vector-storage/all-storages');
  return response.data.data;
};

/**
 * findStorageById simulates fetching a storage item by its ID.
 * It returns a promise that resolves to the Storage object if found, or undefined if not found.
 * @param {string} id - The ID of the storage to be fetched.
 * @return {Promise<Storage | undefined>} A promise that resolves to the Storage object or undefined.
 * @author Cristono Wijaya
 */
const findStorageById = async (id:string): Promise<Storage | undefined> => {
  const response = await api.get(`/vector-storage/storage-detail/${id}`);
  return response.data.data;
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
  const response = await api.post('/vector-storage/create-storage', {
    name,
    description
  });
  const data = response.data.data;
  return {
    ...data,
    inProgress: 0,
    completed: 0,
    failed: 0,
    cancelled: 0,
    total: 0
  }
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
  const response = await api.put(`/vector-storage/update-storage/${id}`, {
    name,
    description
  });
  return response.data.data;
};

/**
 * deleteStorage simulates deleting a storage item.
 * It returns a promise that resolves when the deletion is complete.
 * @param {string} id - The ID of the storage to be deleted.
 * @return {Promise<void>} A promise that resolves when the deletion is complete.
 * @author Cristono Wijaya
 */
const deleteStorage = async (id:string): Promise<void> => {
  await api.delete(`/vector-storage/delete-storage/${id}`);
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
    console.log("Bulk deleting storages with IDs:", ids);
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
      _id: "",
      name: "",
      description: "",
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



