"use client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import React from "react";
import { generateInitials } from "@/lib/utils";
import { useUser } from "@/lib/hooks/use-User";
import { logout } from "@/lib/actions/user";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function ProfileBadge() {
  const { isLoading, data } = useUser();
  const { push } = useRouter();

  const { mutate: logoutFn } = useMutation({
    mutationFn: logout,
    onSuccess: () => {
      toast.success("logged out");
      push("/");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  if (isLoading) {
    return <span>loading...</span>;
  }

  return (
    <div className="flex w-full items-center gap-4 md:ml-auto md:gap-2 lg:gap-4">
      <div className="ml-auto flex-1 sm:flex-initial">
        <div className="flex flex-1 flex-col">
          <span className="font-base text-base">{data?.Data?.email}</span>
          <span className="font-base text-sm text-slate-400">
            {data?.Data?.username}
          </span>
        </div>
      </div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Avatar>
            <AvatarFallback className="cursor-pointer">
              {generateInitials(data?.Data?.username!)}
            </AvatarFallback>
          </Avatar>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>My Account</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {/* <DropdownMenuItem>Settings</DropdownMenuItem>
          <DropdownMenuItem>Support</DropdownMenuItem>
          <DropdownMenuSeparator /> */}
          <DropdownMenuItem onClick={() => logoutFn()}>Logout</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
