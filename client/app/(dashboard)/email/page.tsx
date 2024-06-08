"use client";
import React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { Input } from "@/components/ui/input";

import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Providers } from "@/lib/types/general";
import { sendEmail } from "@/lib/actions/mail";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import SubmitButton from "@/components/submit-button";
import { SendIcon } from "lucide-react";

const formSchema = z.object({
  to: z.string().min(2),
  subject: z.string().min(2),
  content: z.string().min(2),
});

export default function EmailPage() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      to: "",
      subject: "",
      content: "",
    },
  });

  const { mutate: sendEmailFn, isPending } = useMutation({
    mutationFn: ({
      recipient,
      subject,
      content,
      provider,
    }: {
      recipient: string;
      subject: string;
      content: string;
      provider: Providers;
    }) =>
      sendEmail({
        recipient,
        subject,
        content,
        provider,
      }),
    onSuccess: (data) => {
      toast.success(data.Message);
      queryClient.invalidateQueries({ queryKey: ["mailboxes"] });
      form.reset();
      router.push("/home");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    sendEmailFn({
      recipient: values.to,
      subject: values.subject,
      content: values.content,
      provider: Providers.OUTLOOK,
    });
  }
  return (
    <div className="w-full max-w-[1140px] m-auto px-4 py-2 flex flex-col gap-3 mt-10 border">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-8 w-full"
        >
          <FormField
            control={form.control}
            name="to"
            render={({ field }) => (
              <FormItem>
                <FormLabel>To</FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    placeholder="enter recipient email..."
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="subject"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Subject</FormLabel>
                <FormControl>
                  <Input placeholder="enter subject..." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="content"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Content</FormLabel>
                <FormControl>
                  <Textarea
                    rows={10}
                    placeholder="enter content..."
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <SubmitButton
            title="Send"
            clicked={isPending}
            loadingTitle="loading..."
            icon={<SendIcon className="h-5 w-5" />}
          />
        </form>
      </Form>
    </div>
  );
}
