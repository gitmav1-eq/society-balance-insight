import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

const GameCardSkeleton = () => {
  return (
    <Card className="p-8 bg-card/20 border-border/30">
      <div className="text-center">
        <Skeleton className="w-16 h-16 mx-auto mb-6 rounded-full" />
        <Skeleton className="h-5 w-32 mx-auto mb-3" />
        <Skeleton className="h-3 w-48 mx-auto mb-2" />
        <Skeleton className="h-3 w-40 mx-auto mb-6" />
        <Skeleton className="h-9 w-20 mx-auto rounded" />
      </div>
    </Card>
  );
};

export default GameCardSkeleton;