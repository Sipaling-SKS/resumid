import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function ProfileSkillsSkeleton() {
  const chipWidths = Array.from({ length: 8 }, () =>
    Math.floor(Math.random() * (100 - 40 + 1) + 40) // 40–100px
  );

  return (
    <Card className="p-0 overflow-hidden space-y-0">
      {/* Header */}
      <CardTitle className="relative inline-flex gap-3 justify-between items-center px-4 py-4 w-full border-b border-neutral-200">
        <Skeleton className="h-5 w-20" />
        <Skeleton className="absolute top-1/2 right-4 h-6 w-6 -translate-y-1/2 rounded-md" />
      </CardTitle>

      <CardContent className="relative flex flex-wrap gap-2 p-4 font-inter">
        {chipWidths.map((w, i) => (
          <Skeleton
            key={i}
            className="h-6 rounded-full"
            style={{ width: `${w}px` }}
          />
        ))}
      </CardContent>
    </Card>
  );
}
