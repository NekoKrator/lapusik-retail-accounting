import { nanoid } from "nanoid";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemGroup,
  ItemMedia,
} from "@/components/ui/item";
import { Skeleton } from "@/components/ui/skeleton";

export default function ExpensesSkeleton() {
  const skeletonItems = Array.from({ length: 4 }, () => ({
    id: nanoid(),
  }));

  return (
    <ItemGroup className="gap-2">
      {skeletonItems.map((item) => (
        <Item className="h-20" key={item.id} variant="outline">
          <ItemMedia>
            <Skeleton className="h-8 w-8" />
          </ItemMedia>
          <ItemContent>
            <Skeleton className="h-6 w-1/3" />
            <Skeleton className="h-5 w-1/4" />
          </ItemContent>
          <ItemContent>
            <Skeleton className="h-6 w-20" />
          </ItemContent>
          <ItemActions>
            <Skeleton className="h-9 w-9" />
          </ItemActions>
        </Item>
      ))}
      <Item className="h-23" variant="outline">
        <ItemContent className="items-center">
          <Skeleton className="h-8 w-1/5" />
          <Skeleton className="h-5 w-1/4" />
        </ItemContent>
      </Item>
    </ItemGroup>
  );
}
