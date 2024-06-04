"use client";

import * as React from "react";

import { cn } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useUser } from "@/lib/hooks/use-User";
import { User2 } from "lucide-react";

interface AccountSwitcherProps {
  isCollapsed: boolean;
}

export function AccountSwitcher({ isCollapsed }: AccountSwitcherProps) {
  const user = useUser();
  // const [selectedAccount, setSelectedAccount] = React.useState<string>(
  //   accounts[0].email
  // );

  if (!user) {
    return <span>loading...</span>;
  }

  return (
    <Select defaultValue={user.id}>
      <SelectTrigger
        className={cn(
          "flex items-center gap-2 [&>span]:line-clamp-1 [&>span]:flex [&>span]:w-full [&>span]:items-center [&>span]:gap-1 [&>span]:truncate [&_svg]:h-4 [&_svg]:w-4 [&_svg]:shrink-0",
          isCollapsed &&
            "flex h-9 w-9 shrink-0 items-center justify-center p-0 [&>span]:w-auto [&>svg]:hidden"
        )}
        aria-label="Select account"
      >
        <SelectValue placeholder="Select an account">
          <User2 />
          <span className={cn("ml-2", isCollapsed && "hidden")}>
            {user.username}
          </span>
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        <SelectItem key={user.id} value={user.id}>
          <div className="flex items-center gap-3 [&_svg]:h-4 [&_svg]:w-4 [&_svg]:shrink-0 [&_svg]:text-foreground">
            <User2 />
            {user.username}
          </div>
        </SelectItem>
      </SelectContent>
    </Select>
  );
}
