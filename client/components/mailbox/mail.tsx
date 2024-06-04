"use client";

import * as React from "react";
import { Search, Loader2 } from "lucide-react";

import { cn, getMailboxIcon, getMailboxName } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AccountSwitcher } from "@/components/mailbox/account-switcher";
import { MailDisplay } from "@/components/mailbox/mail-display";
import { MailList } from "@/components/mailbox/mail-list";
import { Nav } from "@/components/mailbox/nav";
import { type Mail } from "@/components/mailbox/data";
import { useMail } from "@/lib/hooks/use-mail";
import { useMailbox } from "@/lib/hooks/use-mailbox";
import { useEmail } from "@/lib/hooks/use-emails";
import { useEffect, useState } from "react";

interface MailProps {
  mails: Mail[];
  defaultLayout: number[] | undefined;
  defaultCollapsed?: boolean;
  navCollapsedSize: number;
}

export function Mail({
  mails,
  defaultLayout = [265, 440, 655],
  defaultCollapsed = false,
  navCollapsedSize,
}: MailProps) {
  const [isCollapsed, setIsCollapsed] = React.useState(defaultCollapsed);
  const [mail] = useMail();

  const { isLoading, data, isSuccess } = useMailbox();
  const [inboxId, setInboxId] = useState("");
  const {
    isLoading: isEmailLoading,
    data: email,
    isSuccess: isEmailSuccess,
  } = useEmail(inboxId);

  useEffect(() => {
    if (data?.Data) {
      setInboxId(data.Data[0].id);
    }
  }, [isSuccess]);

  const handleChangeEmail = (value: string) => {
    setInboxId(value);
  };

  return (
    <TooltipProvider delayDuration={0}>
      <ResizablePanelGroup
        direction="horizontal"
        onLayout={(sizes: number[]) => {
          document.cookie = `react-resizable-panels:layout=${JSON.stringify(
            sizes
          )}`;
        }}
        className="h-full max-h-[800px] items-stretch"
      >
        <ResizablePanel
          defaultSize={defaultLayout[0]}
          collapsedSize={navCollapsedSize}
          collapsible={true}
          minSize={15}
          maxSize={20}
          onCollapse={(collapsed) => {
            setIsCollapsed(collapsed);
            document.cookie = `react-resizable-panels:collapsed=${JSON.stringify(
              collapsed
            )}`;
          }}
          className={cn(
            isCollapsed &&
              "min-w-[50px] transition-all duration-300 ease-in-out"
          )}
        >
          <div
            className={cn(
              "flex h-[52px] items-center justify-center",
              isCollapsed ? "h-[52px]" : "px-2"
            )}
          >
            <AccountSwitcher isCollapsed={isCollapsed} />
          </div>
          <Separator />
          {!!isSuccess && !isLoading && data.Data ? (
            <Nav
              isCollapsed={isCollapsed}
              links={data.Data.map((x) => ({
                id: x.id,
                title: getMailboxName(x.mailboxType),
                label: x.status.emailCount.toString(),
                icon: getMailboxIcon(x.mailboxType),
                variant: "ghost",
                handleClick: handleChangeEmail,
              }))}
            />
          ) : (
            <Nav
              isCollapsed={isCollapsed}
              links={[
                {
                  id: "222",
                  title: "No inbox found",
                  label: "...",
                  icon: Loader2,
                  variant: "ghost",
                  handleClick: handleChangeEmail,
                },
              ]}
            />
          )}

          {/* <Separator /> */}
          {/* <Nav
            isCollapsed={isCollapsed}
            links={[
              {
                title: "Social",
                label: "972",
                icon: Users2,
                variant: "ghost",
              },
              {
                title: "Updates",
                label: "342",
                icon: AlertCircle,
                variant: "ghost",
              },
              {
                title: "Forums",
                label: "128",
                icon: MessagesSquare,
                variant: "ghost",
              },
              {
                title: "Shopping",
                label: "8",
                icon: ShoppingCart,
                variant: "ghost",
              },
              {
                title: "Promotions",
                label: "21",
                icon: Archive,
                variant: "ghost",
              },
            ]}
          /> */}
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel defaultSize={defaultLayout[1]} minSize={30}>
          <Tabs defaultValue="all">
            <div className="flex items-center px-4 py-2">
              <h1 className="text-xl font-bold">Inbox</h1>
              <TabsList className="ml-auto">
                <TabsTrigger
                  value="all"
                  className="text-zinc-600 dark:text-zinc-200"
                >
                  All mail
                </TabsTrigger>
                <TabsTrigger
                  value="unread"
                  className="text-zinc-600 dark:text-zinc-200"
                >
                  Unread
                </TabsTrigger>
              </TabsList>
            </div>
            <Separator />
            <div className="bg-background/95 p-4 backdrop-blur supports-[backdrop-filter]:bg-background/60">
              <form>
                <div className="relative">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input placeholder="Search" className="pl-8" />
                </div>
              </form>
            </div>
            <TabsContent value="all" className="m-0">
              {!!isEmailSuccess && !isEmailLoading && email.Data ? (
                <MailList
                  items={email.Data.map((x) => ({
                    id: x.id,
                    email: x.sender,
                    name: x.recipients,
                    read: x.isRead,
                    subject: x.subject,
                    text: x.bodyPreview,
                    labels: [x.importance, "work"],
                    date: x.createdDateTime,
                  }))}
                />
              ) : (
                <MailList
                  items={[
                    {
                      id: "111",
                      email: "N/A",
                      name: "N/A",
                      read: false,
                      subject: "No Emails",
                      text: "Mailbox is empty",
                      labels: ["work"],
                      date: new Date().toISOString(),
                    },
                  ]}
                />
              )}
            </TabsContent>
            <TabsContent value="unread" className="m-0">
              {!!isEmailSuccess && !isEmailLoading && email.Data ? (
                <MailList
                  items={email.Data.filter((item) => !item.isRead).map((x) => ({
                    id: x.id,
                    email: x.sender,
                    name: x.recipients,
                    read: x.isRead,
                    subject: x.subject,
                    text: x.bodyPreview,
                    labels: [x.importance, "work"],
                    date: x.createdDateTime,
                  }))}
                />
              ) : (
                <MailList
                  items={[
                    {
                      id: "111",
                      email: "N/A",
                      name: "N/A",
                      read: false,
                      subject: "No Emails",
                      text: "Mailbox is empty",
                      labels: ["work"],
                      date: new Date().toISOString(),
                    },
                  ]}
                />
              )}
            </TabsContent>
          </Tabs>
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel defaultSize={defaultLayout[2]}>
          <MailDisplay
            mail={
              email?.Data?.map((x) => ({
                id: x.id,
                email: x.sender,
                name: x.recipients,
                read: x.isRead,
                subject: x.subject,
                text: x.bodyPreview,
                labels: [x.importance, "work"],
                date: x.createdDateTime,
              })).find((item) => item.id === mail.selected) || null
            }
          />
        </ResizablePanel>
      </ResizablePanelGroup>
    </TooltipProvider>
  );
}
