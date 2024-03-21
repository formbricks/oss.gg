"use client";

import LevelsTagInput from "@/components/levels-tag-input";
import { Button } from "@/components/ui/button";
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
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tag, TagInput } from "@/components/ui/tag-input";
import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const formSchema = z.object({
  levelName: z.string().min(3, {
    message: "level name must be at least 3 characters.",
  }),
  pointThreshold: z.number(),
  description: z.string().min(10, {
    message: "description must be at least 10 characters.",
  }),
  icon: z.string(),
  topics: z.array(
    z.object({
      id: z.string(),
      text: z.string(),
    })
  ),
  limitIssues: z.boolean(),
  canReportBugs: z.boolean(),
  canHuntBounties: z.boolean(),
});

interface LevelsFormProps {
  // 3. Define your form props.
  levelName?: string;
  pointThreshold?: number;
  description?: string;
  icon?: string;
  topics?: Tag[];
  limitIssues?: boolean;
  canReportBugs?: boolean;
  canHuntBounties?: boolean;
}

export function LevelsForm({
  levelName,
  canHuntBounties,
  canReportBugs,
  description,
  icon,
  limitIssues,
  pointThreshold,
  topics,
}: LevelsFormProps) {
  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      levelName,
      description,
      icon,
      limitIssues,
      pointThreshold,
      topics,
      canHuntBounties,
      canReportBugs,
    },
  });

  const [tags, setTags] = React.useState<Tag[]>([]);
  const [isEditMode, setIsEditMode] = React.useState(false);

  const { setValue } = form;

  const isFieldDisabled = (fieldName: keyof LevelsFormProps, defaultValue: any) => {
    return !isEditMode && defaultValue !== undefined && defaultValue !== "";
  };
  // 2. Define a submit handler.
  function onSubmit(values: z.infer<typeof formSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log(values);
  }
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex w-full gap-4 rounded-lg border border-gray-200 p-7 ">
        <div className="w-2/5 space-y-4">
          <p className="text-lg font-bold">Level 1</p>
          <FormField
            control={form.control}
            name="levelName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Level Name</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Code cub"
                    {...field}
                    disabled={isFieldDisabled("levelName", levelName)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="pointThreshold"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Point Threshold</FormLabel>
                <FormControl>
                  <Input
                    placeholder="300"
                    {...field}
                    disabled={isFieldDisabled("levelName", pointThreshold)}
                  />
                </FormControl>
                <FormDescription>How many points to reach this level?</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="icon"
            render={({ field }) => (
              <FormItem>
                <FormLabel>icon</FormLabel>
                <FormControl>
                  <Input type="file" placeholder="Do whatever" {...field} />
                </FormControl>
                <FormDescription>500 x 500 recommended</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="w-2/5 space-y-4">
          <p className="text-lg font-bold">Powers</p>
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Input
                    placeholder="This is a description"
                    {...field}
                    disabled={isFieldDisabled("levelName", description)}
                  />
                </FormControl>
                <FormDescription>Keep it short and sweet</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* <div className="flex items-center space-x-2">
            <Switch id="limit-issues" />
            <Label htmlFor="limit-issues">Limit issues this level can work on</Label>
          </div> */}
          <FormField
            control={form.control}
            name="limitIssues"
            render={({ field }) => (
              <FormItem className="flex items-center space-x-2">
                <FormControl>
                  <Switch
                    id="limit-issues"
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    disabled={isFieldDisabled("levelName", limitIssues)}
                  />
                </FormControl>
                <FormLabel htmlFor="limit-issues">Limit issues this level can work on</FormLabel>
              </FormItem>
            )}
          />

          <div className="flex items-end gap-2 rounded-lg bg-zinc-100 p-3">
            <FormField
              control={form.control}
              name="topics"
              render={({ field }) => (
                <FormItem className="flex flex-col items-start">
                  <FormControl>
                    <TagInput
                      {...field}
                      placeholder="Enter a topic"
                      tags={tags}
                      shape="pill"
                      variant="primary"
                      className="w-full"
                      setTags={(newTags) => {
                        setTags(newTags);
                        setValue("topics", newTags as [Tag, ...Tag[]]);
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button>Add Label</Button>
          </div>
          {/* <div className="flex items-center space-x-2">
            <Switch id="can-report-bugs" />
            <Label htmlFor="can-report-bugs">Can report bugs</Label>
          </div> */}
          <FormField
            control={form.control}
            name="canReportBugs"
            render={({ field }) => (
              <FormItem className="flex items-center space-x-2">
                <FormControl>
                  <Switch
                    id="can-report-bugs"
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    disabled={isFieldDisabled("levelName", canReportBugs)}
                  />
                </FormControl>
                <FormLabel htmlFor="can-report-bugs">Can report bugs</FormLabel>
              </FormItem>
            )}
          />

          {/* <div className="flex items-center space-x-2">
            <Switch id="can-hunt-bounties" />
            <Label htmlFor="can-hunt-bounties">Can hunt bounties</Label>
          </div> */}
          <FormField
            control={form.control}
            name="canHuntBounties"
            render={({ field }) => (
              <FormItem className="flex items-center space-x-2">
                <FormControl>
                  <Switch
                    id="can-hunt-bounties"
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    disabled={isFieldDisabled("levelName", canHuntBounties)}
                  />
                </FormControl>
                <FormLabel htmlFor="can-hunt-bounties">Can hunt bounties</FormLabel>
              </FormItem>
            )}
          />
        </div>
        <div className="flex gap-2">
          <Button variant="destructive" type="submit">
            Delete
          </Button>
          <Button type="submit">Save</Button>
        </div>
      </form>
    </Form>
  );
}
