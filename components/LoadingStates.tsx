import { Skeleton } from '@/components/ui/skeleton';
import { Card } from '@/components/ui/card';

export const PlayerRowSkeleton = () => {
  return (
    <div className="flex items-center space-x-4 p-4">
      <div className="flex-1">
        <Skeleton className="h-4 w-[250px] mb-2" />
        <Skeleton className="h-4 w-[200px]" />
      </div>
      <Skeleton className="h-10 w-[100px]" />
    </div>
  );
};

export const PlayerStatsSkeleton = () => {
  return (
    <Card className="p-4 space-y-4">
      <div className="flex items-center justify-between mb-4">
        <div>
          <Skeleton className="h-6 w-[200px] mb-2" />
          <Skeleton className="h-4 w-[150px]" />
        </div>
        <div className="text-right">
          <Skeleton className="h-4 w-[100px] mb-2" />
          <Skeleton className="h-6 w-[80px]" />
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {Array.from({ length: 7 }).map((_, i) => (
          <div key={i} className="space-y-2">
            <Skeleton className="h-4 w-[100px]" />
            <Skeleton className="h-6 w-[120px]" />
          </div>
        ))}
      </div>

      <div className="border-t pt-4 mt-4">
        <div className="grid grid-cols-2 gap-4">
          {Array.from({ length: 2 }).map((_, i) => (
            <div key={i} className="space-y-2">
              <Skeleton className="h-4 w-[100px]" />
              <Skeleton className="h-6 w-[120px]" />
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
};

export const TeamAnalyticsSkeleton = () => {
  return (
    <div className="space-y-4">
      <Card className="p-4">
        <Skeleton className="h-6 w-[150px] mb-4" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="space-y-2">
              <Skeleton className="h-4 w-[100px]" />
              <Skeleton className="h-6 w-[120px]" />
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}; 