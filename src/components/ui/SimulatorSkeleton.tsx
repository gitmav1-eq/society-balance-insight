import { Skeleton } from "@/components/ui/skeleton";

const SimulatorSkeleton = () => {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="p-4 bg-primary/5 border border-border/50">
        <Skeleton className="h-3 w-24 mb-2" />
        <Skeleton className="h-6 w-48" />
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="p-6 border border-border/50 bg-card/20">
            <div className="flex items-center gap-2 mb-4">
              <Skeleton className="w-2 h-2 rounded-full" />
              <Skeleton className="h-2 w-32" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-3 w-full" />
              <Skeleton className="h-3 w-5/6" />
              <Skeleton className="h-3 w-4/6" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SimulatorSkeleton;