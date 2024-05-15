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
import { useToast } from "@/components/ui/use-toast";
import { updateBountySettings } from "@/lib/bounty/service";
import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const FormSchema = z.object({
  maxAutomaticPayout: z.coerce.number().min(1),
  maxBounty: z.coerce.number().min(1),
});

export function BountySettingsForm({
  repositoryId,
  bountySettings,
}: {
  repositoryId: string;
  bountySettings: z.infer<typeof FormSchema> | null;
}) {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      maxBounty: bountySettings?.maxBounty,
      maxAutomaticPayout: bountySettings?.maxAutomaticPayout,
    },
  });

  const [isEditMode, setIsEditMode] = React.useState(false);
  const { toast } = useToast();

  async function onSubmit(formData: z.infer<typeof FormSchema>) {
    try {
      await updateBountySettings({ repositoryId, ...formData });
      setIsEditMode(false);
      toast({ title: "Bounty settings updated successfully!" });
    } catch (error) {
      toast({ title: "Failed to update bounty settings!" });
    }
  }

  return (
    <Card className="w-full bg-zinc-50">
      <div className="flex items-center justify-between pr-6">
        <CardHeader>
          <CardTitle>Bounty Settings</CardTitle>
        </CardHeader>
        {isEditMode ? (
          <Button type="button" onClick={form.handleSubmit(onSubmit)}>
            Save
          </Button>
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
              name="maxBounty"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Max bounty amount (in USD)</FormLabel>
                  <FormControl>
                    <Input
                      disabled={!isEditMode}
                      placeholder="Enter the maximum bounty amount (in USD)"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="maxAutomaticPayout"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Max automatic payout (in USD)</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter the maximum automatic payout amount (in USD)"
                      disabled={!isEditMode}
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>Higher bounties need manual approval</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <button type="submit" className="hidden" />
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
