'use client';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { 
  IconDatabase, 
  IconCalendar,
  IconDisc,
  IconProgressCheck,
  IconAlertTriangle,
} from "@tabler/icons-react";
import useStorage from "@/hooks/use-storage";
import { Skeleton } from "@/components/ui/skeleton";

/**
 * OverviewSection component renders a section displaying an overview of the storage details,
 * including used space, completed items, items in progress, failed items, creation date,
 * and total items.
 * @return {JSX.Element} The OverviewSection component.
 * @author Cristono Wijaya
 */
export default function OverviewSection() {
  const data = useStorage(state => state.singleStorage);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <IconDatabase className="w-5 h-5" />
          <span>Storage Overview</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
              <IconDisc className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Used Space</p>
              <p className="text-lg font-semibold">{data?.usedSpace}</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-green-100 dark:bg-green-900/20 rounded-lg">
              <IconProgressCheck className="w-5 h-5 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Completed</p>
              <p className="text-lg font-semibold">{data?.completed}</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-secondary/20 rounded-lg">
              <IconProgressCheck className="w-5 h-5 text-secondary-foreground" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">In Progress</p>
              <p className="text-lg font-semibold">{data?.inProgress}</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-red-100 dark:bg-red-900/20 rounded-lg">
              <IconAlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Failed</p>
              <p className="text-lg font-semibold">{data?.failed}</p>
            </div>
          </div>
        </div>
        
        <Separator className="my-4" />
        
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <IconCalendar className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">Created on {data?.createdAt}</span>
          </div>
          <div className="text-sm text-muted-foreground">
            Total: {data?.total} items
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

/**
 * OverviewSectionSkeleton component renders a loading skeleton for the overview section.
 * @returns {JSX.Element} The OverviewSectionSkeleton component.
 * @author Cristono Wijaya
 */
export function OverviewSectionSkeleton() {
  return (
    <Skeleton className="w-full h-48 rounded-md" />
  );
}