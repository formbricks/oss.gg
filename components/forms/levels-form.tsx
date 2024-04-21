"use client";

import {
  createLevelAction,
  updateLevelAction,
} from "@/app/(dashboard)/repo-settings/[repositoryId]/levels/action";
import { handleFileUpload } from "@/app/(dashboard)/repo-settings/[repositoryId]/levels/lib";
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
import { TFormSchema, TLevel, ZFormSchema } from "@/types/level";
import { zodResolver } from "@hookform/resolvers/zod";
import { useParams } from "next/navigation";
import React, { Dispatch, SetStateAction, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { v4 as uuidv4 } from "uuid";

import { useDeleteLevelModal } from "../delete-level-modal";
import { useToast } from "../ui/use-toast";

export interface LevelsFormProps {
  level: TLevel | null;
  isForm: boolean;
  setShowForm: Dispatch<SetStateAction<boolean>>;
}

export function LevelsForm({
  level,
  setShowForm,
  isForm, // pass the isForm when you want the levelForm to be used as a form
}: LevelsFormProps) {
  const { id, name, pointThreshold, description, iconUrl } = level ?? {};

  const { limitIssues, canReportBugs, canHuntBounties, issueLabels } = level?.permissions || {};

  const [isEditMode, setIsEditMode] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isLimitIssues, setIsLimitIssues] = useState(limitIssues ?? false);
  const [tags, setTags] = useState<TagType[]>(issueLabels || []);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const { repositoryId } = useParams() as { repositoryId: string };

  const { setShowDeleteLevelModal, DeleteLevelModal } = useDeleteLevelModal(repositoryId, id!, setIsEditMode);
  const { toast } = useToast();

  const form = useForm<TFormSchema>({
    resolver: zodResolver(ZFormSchema),
    defaultValues: {
      id: id || uuidv4(),
      name: name || "",
      description: description || "",
      iconUrl: iconUrl || "",
      limitIssues: limitIssues ?? false,
      pointThreshold: (pointThreshold ?? 0).toString(),
      issueLabels: issueLabels || [],
      canHuntBounties: canHuntBounties ?? false,
      canReportBugs: canReportBugs ?? false,
    },
  });

  const isFieldDisabled = (defaultValue: any) => {
    return !isEditMode && defaultValue !== undefined && defaultValue !== "";
  };
  const handleCreateUpdateLevel = async (values: TFormSchema, isCreate: boolean) => {
    setIsLoading(true);
    try {
      const isValid = await form.trigger();
      if (!isValid) {
        return;
      }

      const icon = values.iconUrl;
      // const { url, error } = await handleFileUpload(icon, repositoryId);
      // if (error) {
      //   toast({
      //     title: "Error",
      //     description: error,
      //   });
      //   return;
      // }

      const permissions = {
        limitIssues: values.limitIssues,
        canReportBugs: values.canReportBugs,
        canHuntBounties: values.canHuntBounties,
        issueLabels: isLimitIssues ? tags : [],
      };

      if (isCreate) {
        await createLevelAction({
          id: values.id,
          name: values.name,
          description: values.description,
          pointThreshold: parseInt(values.pointThreshold, 10),
          iconUrl: "https://github.com/shadcn.png",
          repositoryId: repositoryId,
          permissions: permissions,
        });
      } else {
        await updateLevelAction({
          id: values.id,
          name: values.name,
          description: values.description,
          pointThreshold: parseInt(values.pointThreshold, 10),
          iconUrl: "https://github.com/shadcn.png",
          repositoryId: repositoryId,
          permissions: permissions,
        });
        setIsEditMode(false);
      }

      setShowForm(false);
    } catch (err) {
      toast({
        title: "Error",
        description: `Failed to ${isCreate ? "create" : "update"} level.`,
      });
    } finally {
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

          return;
        }
        //call the update file action
        if (!name) {
          toast({
            title: "Error",
            description: "Level name is required",
          });

          return;
        }

        // await updateLevelIconAction({
        //   name: name,
        //   repositoryId: repositoryId,
        //   iconUrl: url,
        // });
      } catch (err) {
        toast({
          title: "Error",
          description: "Avatar update failed. Please try again.",
        });
      } finally {
        setIsLoading(false);
      }
    }
  }

  return (
    <Form {...form}>
      <DeleteLevelModal />
      <form
        onSubmit={form.handleSubmit(() => handleCreateUpdateLevel(form.getValues(), true))}
        className="flex w-full gap-4 rounded-lg border border-gray-200 p-7 ">
        <div className="w-2/5 space-y-4">
          <p className="text-lg font-bold">Level</p>
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Level Name</FormLabel>
                <FormControl>
                  <Input placeholder="e.g. Code cub" {...field} disabled={isFieldDisabled(name)} />
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

          {/* when edit and image => show image and replace button
          when !edit and image => show image
          when edit and !image => show upload component
          when !edit and !image => show fallback image
          when creating level for the first time => show upload component  */}
          {!isEditMode && iconUrl ? (
            <div>
              <Avatar className="h-56 w-56">
                <AvatarImage src={iconUrl} alt="level icon" />
              </Avatar>
            </div>
          ) : isEditMode && iconUrl ? (
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
          ) : !isEditMode && !iconUrl && !isForm ? (
            <div>Fallback content</div>
          ) : (
            <FormField
              control={form.control}
              name="iconUrl"
              render={({ field: { value, onChange, ...fieldProps } }) => (
                <FormItem>
                  <FormLabel>Icon</FormLabel>
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
                    onCheckedChange={() => {
                      field.onChange(!field.value);
                      setIsLimitIssues(!field.value);
                    }}
                    disabled={isFieldDisabled(limitIssues)}
                  />
                </FormControl>
                <FormLabel htmlFor="limit-issues">Limit issues this level can work on</FormLabel>
              </FormItem>
            )}
          />

          {isFieldDisabled(issueLabels)
            ? (issueLabels ?? []).length > 0 && (
                <div className="flex w-full flex-wrap items-end gap-2 rounded-lg bg-zinc-100 p-3">
                  {(issueLabels ?? []).map((tag, index) => (
                    <span
                      key={index}
                      className="rounded-full bg-zinc-700 px-2 py-1 text-xs text-primary-foreground">
                      {tag.text}
                    </span>
                  ))}
                </div>
              )
            : isLimitIssues && (
                <div className="flex items-end gap-2 rounded-lg bg-zinc-100 p-3">
                  <FormField
                    control={form.control}
                    name="issueLabels"
                    render={({ field }) => (
                      <FormItem className="flex w-full flex-col items-start">
                        <FormControl>
                          <TagInput
                            {...field}
                            placeholder={`e.g. S or Full-Stack`}
                            tags={tags}
                            shape="pill"
                            variant="primary"
                            className="w-full"
                            setTags={(newTags) => {
                              setTags(newTags);
                              field.onChange(newTags);
                            }}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
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
            Save
          </Button>
        ) : (
          <>
            {isEditMode ? (
              <div className="flex gap-2">
                <Button
                  onClick={() => {
                    setShowDeleteLevelModal(true);
                  }}
                  loading={isLoading}
                  variant="destructive">
                  Delete
                </Button>

                <Button loading={isLoading} onClick={() => handleCreateUpdateLevel(form.getValues(), false)}>
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
