import CardSection from "@/components/dashboard/card-section";
import ChartSection from "@/components/dashboard/chart-section";
import MainContent from "@/components/main-content";
import { Skeleton } from "@/components/ui/skeleton";
import { Suspense } from "react";

/**
 * Home page component that serves as the dashboard.
 * It uses MainContent to provide a structured layout and includes
 * CardSection and ChartSection components with loading fallbacks.
 * @return {JSX.Element} The rendered Home page component.
 * @author Cristono Wijaya
 */
export default function Home() {
  return (
    <MainContent> 
      <Suspense fallback={<div className="px-4 lg-px-6"><Skeleton className="h-40 w-full rounded-md"/></div>}>
        <CardSection/>
      </Suspense>
      <div className="px-4 lg:px-6">
        <Suspense fallback={<Skeleton className="h-96 w-full rounded-md"/>}>
          <ChartSection/>
        </Suspense>
      </div>
    </MainContent>
  );
}
