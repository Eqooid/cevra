import MainContent from "@/components/main-content";
import Index, { IndexSkeleton } from "@/components/storage/detail";
import { Suspense } from "react";

/**
 * Storage detail page component that displays detailed information about a specific storage
 * and lists all files within that storage.
 * @param {StorageDetailsProps} props - The component props containing the storage ID
 * @returns {JSX.Element} The rendered storage detail page
 * @author Cristono Wijaya
 */
export default async function StorageDetailPage({ params }: { params: Promise<{ id: string }> }) { 
  const { id } = await params;

  return (
    <MainContent>
      <div className="px-4 lg:px-6 space-y-6">
        <Suspense fallback={<IndexSkeleton/>}>
          <Index id={id} />
        </Suspense>
      </div>
    </MainContent>
  );
}