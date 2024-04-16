"use client";

import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { Tag } from "@/components/ui/tag-input";
import { toast } from "@/components/ui/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

//Shadcn Tag Input
//https://shadcn-tag-input.vercel.app

const FormSchema = z.object({
  topics: z.array(
    z.object({
      id: z.string(),
      text: z.string(),
    })
  ),
});

export default function LevelsTagInput() {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  });

  const [tags, setTags] = React.useState<Tag[]>([]);

  const { setValue } = form;

  function onSubmit(data: z.infer<typeof FormSchema>) {
    toast({
      title: "You submitted the following values:",
      description: (
        <pre className="mt-2 w-[340px] rounded-md bg-zinc-950 p-4">
          <code className="text-white">{JSON.stringify(data, null, 2)}</code>
        </pre>
      ),
    });
  }

  return (
    <section className="z-10 flex w-full max-w-5xl flex-col items-center gap-5 text-center">
      <div id="try" className="w-full py-8">
        <div className="relative my-4 flex w-full flex-col space-y-2">
          <div className="preview relative mt-2 flex min-h-[350px] w-full items-center justify-center rounded-md border p-10 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col items-start space-y-8">
                <Button type="submit">Submit</Button>
              </form>
            </Form>
          </div>
        </div>
      </div>
    </section>
  );
}
