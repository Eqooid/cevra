import MainContent from "@/components/main-content";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import TableSection, { LoadingTableSection } from "@/components/storage/table-section";
import HeaderSection, { LoadingHeaderSection } from "@/components/storage/header-section";
import { Suspense } from "react";

/**
 * Storage page component that displays storage-related information.
 * It uses MainContent to provide a structured layout and includes
 * HeaderSection and TableSection components with loading fallbacks.
 * @return {JSX.Element} The rendered Storage page component.
 * @author Cristono Wijaya
 */
export default function Storage() {
  return (
    <MainContent>
      <div className="px-4 lg:px-6">
        <Card className="py-0 gap-2">
          <CardHeader className="flex flex-col items-stretch border-b !p-0 sm:flex-row">
            <Suspense fallback={<LoadingHeaderSection/>}>
              <HeaderSection/>
            </Suspense>
          </CardHeader>
          <CardContent>
            <Suspense fallback={<LoadingTableSection/>}>
              <TableSection/>
            </Suspense>
          </CardContent>
        </Card>
      </div>
    </MainContent>
  );
} 