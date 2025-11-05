'use client'
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { IconArrowLeft } from "@tabler/icons-react";
import Link from "next/link";
import useStorage from "@/hooks/use-storage";
import { Skeleton } from "@/components/ui/skeleton";

/**
 * HeaderSection component renders the header section for the storage detail page,
 * including a back button, storage name, and description.
 * @returns {JSX.Element} The HeaderSection component.
 * @author Cristono Wijaya
 */
export default function HeaderSection() {
  const data = useStorage(state => state.singleStorage);

  return (
    <div className="flex items-center space-x-4">
      <Link href="/storage">
        <Button variant="ghost" size="sm">
          <IconArrowLeft className="w-4 h-4 mr-2" />
            Back to Storage
        </Button>
      </Link>
      <Separator orientation="vertical" className="h-6" />
      <div>
        <h1 className="text-2xl font-bold">{data?.name}</h1>
          <p className="text-muted-foreground">{data?.description}</p>
        </div>
    </div>
  );
}

/**
 * HeaderSectionSkeleton component renders a loading skeleton for the header section.
 * @returns {JSX.Element} The HeaderSectionSkeleton component.
 * @author Cristono Wijaya
 */
export function HeaderSectionSkeleton() {
  return (
    <div className="flex items-center space-x-4">
      <Skeleton className="w-32 h-8 rounded-md" />
      <Separator orientation="vertical" className="h-6" />
      <div>
        <Skeleton className="w-48 h-6 rounded-md mb-2" />
        <Skeleton className="w-64 h-4 rounded-md" />
      </div>
    </div>
  );
};