'use client';

import { Card, CardAction, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useFetchCard } from "@/hooks/use-usage-card";
import { IconCoins, IconClock, IconTarget, IconFile } from "@tabler/icons-react";

/**
 * CardSection component displays various usage metrics in card format.
 * @returns {JSX.Element} The CardSection component.
 * @author Cristono Wijaya
 */
export default function CardSection() {
  const data = useFetchCard();

  return (
    <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>
            <div className="flex items-center gap-2">
              <IconCoins/> Total Token Usage
            </div>
          </CardDescription> 
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {data.totalUsageToken.toLocaleString()}
          </CardTitle>
          <CardAction>
          </CardAction>
        </CardHeader>
      </Card>
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>
            <div className="flex items-center gap-2">
              <IconClock/> Response Time
            </div>
          </CardDescription> 
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {data.responseTime} ms
          </CardTitle>
          <CardAction>
          </CardAction>
        </CardHeader>
      </Card>
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>
            <div className="flex items-center gap-2">
              <IconTarget/> Percentage of Responses RAG 
            </div>
          </CardDescription> 
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {data.targetAccuracy}%
          </CardTitle>
          <CardAction>
          </CardAction>
        </CardHeader>
      </Card>
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>
            <div className="flex items-center gap-2">
              <IconFile/> Total of Documents  
            </div>
          </CardDescription> 
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {data.fileProcessed.toLocaleString()}
          </CardTitle>
          <CardAction>
          </CardAction>
        </CardHeader>
      </Card>
    </div>
  );
}