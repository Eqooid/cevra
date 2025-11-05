'use client';

import useStorageFile, { useFetchStorageFiles } from "@/hooks/use-storage-file";
import HeaderSection, { HeaderSectionSkeleton } from "./header-section";
import OverviewSection, { OverviewSectionSkeleton } from "./overview-section";
import FileListSection, { FileListSectionSkeleton } from "./file-list-section";
import useStorage, { useFetchSingleStorage } from "@/hooks/use-storage";
import { useEffect } from "react";
import DocumentUploadDialog from "./document-upload-dialog";

/**
 * Index component serves as the main detail page for a specific storage.
 * It fetches storage details and files based on the provided ID and
 * renders the HeaderSection, OverviewSection, and FileListSection components.
 */
export default function Index({ id }: { id:string }) {
  const { isLoading: isLoadingSingleStorage } = useFetchSingleStorage(id);
  const { isLoading: isLoadingStorageFile } = useFetchStorageFiles(id);
  const setLoadingSingleStorage = useStorage((state) => state.setLoading);
  const setLoadingStorageFile = useStorageFile((state) => state.setLoading);
  const isUploadOpen = useStorageFile((state) => state.isModalOpen);
  const setIsUploadOpen = useStorageFile((state) => state.toggleModal);

  useEffect(() => {
    setLoadingSingleStorage(true);
    setLoadingStorageFile(true);  
  }, []);

  if (isLoadingSingleStorage || isLoadingStorageFile) {
    return <IndexSkeleton/>;
  }

  return (
    <>
      <DocumentUploadDialog
        storageId={id}
        isOpen={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
      />
      <HeaderSection/>
      <OverviewSection/>
      <FileListSection id={id}/>
    </>
  )
}

/**
 * IndexSkeleton component renders a loading skeleton for the Index component,
 * including skeletons for the HeaderSection, OverviewSection, and FileListSection.
 * @returns {JSX.Element} The IndexSkeleton component.
 * @author Cristono Wijaya
 */
export function IndexSkeleton() {
  return (
    <>
      <HeaderSectionSkeleton/>
      <OverviewSectionSkeleton/>
      <FileListSectionSkeleton/>
    </>
  );
}