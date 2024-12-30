import { Skeleton } from "@/components/ui/skeleton";

export default function ListItemSkeleton({
  hasImage,
}: {
  hasImage: boolean;
}): JSX.Element {
  return (
    <div className="flex items-center gap-2">
      {hasImage ? (
        <Skeleton className="h-12 w-12 rounded" />
      ) : (
        <Skeleton className="h-6 w-6 rounded" />
      )}
      <Skeleton className="h-[24px] w-[100px]" />
    </div>
  );
}
