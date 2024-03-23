"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const FormSchema = z.object({
  minBountyAmount: z.number().min(50, {
    message: "Bounty must be at least $50.",
  }),
  maxBountyAmount: z.number().max(250, {
    message: "Bounty must not be more than $250.",
  }),
});

export function BountySettingsForm() {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      minBountyAmount: 50,
      maxBountyAmount: 250,
    },
  });

  const [isEditMode, setIsEditMode] = React.useState(false);

  function onSubmit(data: z.infer<typeof FormSchema>) {
    toast({
      title: "You submitted the following values:",
      description: (
        <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
          <code className="text-white">{JSON.stringify(data, null, 2)}</code>
        </pre>
      ),
    });
  }

  return (
    <Card className="w-full bg-zinc-50">
      <div className="flex items-center justify-between pr-6">
        <CardHeader>
          <CardTitle>Bounty Settings</CardTitle>
        </CardHeader>
        {isEditMode ? (
          <Button type="submit">Save</Button>
        ) : (
          <Button onClick={() => setIsEditMode(true)} variant="secondary">
            Edit
          </Button>
        )}
      </div>
      <CardContent className="w-full">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-3">
            <FormField
              control={form.control}
              name="maxBountyAmount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Max Bounty Amount(in USD)</FormLabel>
                  <FormControl>
                    <Input
                      disabled={!isEditMode}
                      placeholder="Tell us a little bit about yourself"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="minBountyAmount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Min Bounty Amount(in USD)</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Type your message here"
                      disabled={!isEditMode}
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>Higher Bounties need manual Approval</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
