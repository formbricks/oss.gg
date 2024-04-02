"use client";

import {
  createLevelAction,
  deleteLevelAction,
  updateLevelIconAction,
} from "@/app/(dashboard)/repo-setting/[repositoryId]/levels/action";
import { handleFileUpload } from "@/app/(dashboard)/repo-setting/[repositoryId]/levels/lib";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
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
import { Switch } from "@/components/ui/switch";
import { TagInput, Tag as TagType } from "@/components/ui/tag-input";
import { updateLevelIcon } from "@/lib/levels/service";
import { zodResolver } from "@hookform/resolvers/zod";
import { useParams, useRouter } from "next/navigation";
import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { useDeleteLevelModal } from "../delete-level-modal";
import { useToast } from "../ui/use-toast";

const formSchema = z.object({
  levelName: z.string().min(3, {
    message: "level name must be at least 3 characters.",
  }),
  pointThreshold: z.string().refine((val) => !Number.isNaN(parseInt(val, 10)), {
    message: "Expected number, received a string",
  }),
  description: z.string().min(10, {
    message: "description must be at least 10 characters.",
  }),
  icon: z.custom(),

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

export interface LevelsFormProps {
  levelName?: string;
  pointThreshold?: number;
  description?: string;
  topics?: TagType[];
  limitIssues?: boolean;
  iconUrl?: string;
  canReportBugs?: boolean;
  canHuntBounties?: boolean;
  isForm?: boolean;
}

export function LevelsForm({
  levelName,
  canHuntBounties,
  canReportBugs,
  description,
  iconUrl,
  limitIssues,
  pointThreshold,
  topics,
  // pass the isForm when you want the levelForm to be used as a form
  isForm,
}: LevelsFormProps) {
  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      levelName: levelName || "",
      description: description || "",
      limitIssues: limitIssues ?? false,
      pointThreshold: (pointThreshold ?? 0).toString(),
      topics: topics || [],
      canHuntBounties: canHuntBounties ?? false,
      canReportBugs: canReportBugs ?? false,
    },
  });

  const [tags, setTags] = React.useState<TagType[]>([]);
  const [isEditMode, setIsEditMode] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const {setShowDeleteLevelModal, DeleteLevelModal} = useDeleteLevelModal();
  const { toast } = useToast();
  const router = useRouter();
  const { repositoryId } = useParams() as { repositoryId: string };

  const { setValue } = form;

  const isFieldDisabled = (defaultValue: any) => {
    return !isEditMode && defaultValue !== undefined && defaultValue !== "";
  };
  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    try {
      const icon = values.icon;
      const { url, error } = await handleFileUpload(icon, repositoryId);
      if (error) {
        toast({
          title: "Error",
          description: error,
        });
        setIsLoading(false);
        return;
      }
      // call the server action to create a new level for the repository
      await createLevelAction({
        name: values.levelName,
        description: values.description,
        pointThreshold: parseInt(values.pointThreshold, 10),
        icon: url,
        repositoryId: repositoryId,
        permissions: {
          canWorkOnIssues: values.limitIssues,
          issueLabels: tags.map((tag) => tag.text),
          canWorkOnBugs: values.canReportBugs,
          canHuntBounties: values.canHuntBounties,
        },
        tags: values.topics.map((tag) => tag.text),
      });
      router.refresh();
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to create level. Please try ",
      });
      setIsLoading(false);
    }

    setIsLoading(false);
  }

  const handleDeleteLevel = async () => {
    // delete level action here

    setIsLoading(true);
    try {
      //call the delete level action
      await deleteLevelAction({
        name: levelName!,
        repositoryId: repositoryId,
      });

      setIsLoading(false);
    } catch (err) {
      toast({
        title: "Error",
        description: "Level Update failed. Please try again.",
      });
      setIsLoading(false);
    }
  };

  async function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (file) {
      //call the s3 upload function to upload the image
      setIsLoading(true);
      try {
        const { url, error } = await handleFileUpload(file, repositoryId);

        if (error) {
          toast({
            title: "Error",
            description: error,
          });

          setIsLoading(false);
          return;
        }
        //call the update file action
        if (!levelName) {
          toast({
            title: "Error",
            description: "Level name is required",
          });

          setIsLoading(false);
          return;
        }

        await updateLevelIconAction({
          name: levelName,
          repositoryId: repositoryId,
          iconUrl: url,
        });

        router.refresh();
      } catch (err) {
        toast({
          title: "Error",
          description: "Avatar update failed. Please try again.",
        });
        setIsLoading(false);
      }
    }
  }
  return (
    <Form {...form}>
      <DeleteLevelModal />
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex w-full gap-4 rounded-lg border border-gray-200 p-7 ">
        <div className="w-2/5 space-y-4">
          <p className="text-lg font-bold">Level</p>
          <FormField
            control={form.control}
            name="levelName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Level Name</FormLabel>
                <FormControl>
                  <Input placeholder="Code cub" {...field} disabled={isFieldDisabled(levelName)} />
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
                    type="number"
                    placeholder="300"
                    {...field}
                    disabled={isFieldDisabled(pointThreshold)}
                  />
                </FormControl>
                <FormDescription>How many points to reach this level?</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          {isFieldDisabled(iconUrl) ? (
            <div>
              <Avatar className="h-56 w-56">
                <AvatarImage src={iconUrl} alt="level icon" />
              </Avatar>
              <div className="relative flex flex-col space-y-5">
                <input type="file" ref={fileInputRef} className="hidden" onChange={handleFileChange} />
                <Button variant="secondary" className="w-fit" onClick={() => fileInputRef.current?.click()}>
                  Replace icon
                </Button>
              </div>
            </div>
          ) : (
            <FormField
              control={form.control}
              name="icon"
              render={({ field: { value, onChange, ...fieldProps } }) => (
                <FormItem>
                  <FormLabel>icon</FormLabel>
                  <FormControl>
                    <Input
                      {...fieldProps}
                      placeholder="Picture"
                      type="file"
                      accept="image/*"
                      multiple={true}
                      onChange={(event) => onChange(event.target.files && event.target.files[0])}
                    />
                  </FormControl>
                  <FormDescription>500 x 500 recommended</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
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
                    disabled={isFieldDisabled(description)}
                  />
                </FormControl>
                <FormDescription>Keep it short and sweet</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

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
                    disabled={isFieldDisabled(limitIssues)}
                  />
                </FormControl>
                <FormLabel htmlFor="limit-issues">Limit issues this level can work on</FormLabel>
              </FormItem>
            )}
          />

          {isFieldDisabled(topics) ? (
            (topics ?? []).length > 0 && (
              <div className="flex w-full flex-wrap items-end gap-2 rounded-lg bg-zinc-100 p-3">
                {(topics ?? []).map((tag) => (
                  <span
                    key={tag.id}
                    className="rounded-full bg-zinc-700 px-2 py-1 text-xs text-primary-foreground">
                    {tag.text}
                  </span>
                ))}
              </div>
            )
          ) : (
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
                          setValue("topics", newTags as [TagType, ...TagType[]]);
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button>Add Label</Button>
            </div>
          )}

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
                    disabled={isFieldDisabled(canReportBugs)}
                  />
                </FormControl>
                <FormLabel htmlFor="can-report-bugs">Can report bugs</FormLabel>
                <FormMessage />
              </FormItem>
            )}
          />

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
                    disabled={isFieldDisabled(canHuntBounties)}
                  />
                </FormControl>
                <FormLabel htmlFor="can-hunt-bounties">Can hunt bounties</FormLabel>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        {isForm ? (
          <Button loading={isLoading} type="submit">
            save
          </Button>
        ) : (
          <>
            {isEditMode ? (
              <div className="flex gap-2">
                <Button onClick={() => {
                  setShowDeleteLevelModal(true);
                }} loading={isLoading} variant="destructive">
                  Delete
                </Button>

                <Button loading={isLoading} type="submit">
                  Save
                </Button>
              </div>
            ) : (
              <Button
                variant="secondary"
                onClick={() => {
                  setIsEditMode(true);
                }}>
                Edit
              </Button>
            )}
          </>
        )}
      </form>
    </Form>
  );
}
