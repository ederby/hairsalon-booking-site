import { Skeleton } from "./skeleton";

export default function CategoryListItemSkeleton() {
  return (
    <div className="flex items-center gap-2">
      <Skeleton className="h-12 w-12 rounded" />
      <Skeleton className="h-[24px] w-[100px]" />
    </div>
  );
}
