"use client";

import { useActionState } from "react";
import {
  updateSiteContent,
  type ContentFormState,
} from "@/lib/actions/content";
import {
  CONTENT_SECTIONS,
  type ContentSection,
} from "@/lib/site-content";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type Props = {
  initialContent: Record<string, string>;
};

const initialState: ContentFormState = {};

export function HomepageContentForm({ initialContent }: Props) {
  const [state, formAction, pending] = useActionState(
    updateSiteContent,
    initialState
  );

  return (
    <form action={formAction} className="space-y-8 pb-28">
      {state.error && (
        <div className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
          {state.error}
        </div>
      )}
      {state.success && (
        <div className="rounded-lg bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
          {state.success}
        </div>
      )}

      {CONTENT_SECTIONS.map((section) => (
        <SectionCard
          key={section.id}
          section={section}
          values={initialContent}
        />
      ))}

      {/* Fixed to the viewport; sits over the content column (not under the sidebar) */}
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-amber-900/10 bg-[#f7f1ea]/95 px-4 py-4 backdrop-blur-md sm:px-6 md:start-64">
        <div className="mx-auto flex max-w-6xl justify-end">
          <Button
            type="submit"
            size="lg"
            disabled={pending}
            className="bg-[#1a120c] px-8 hover:bg-[#2c1810]"
          >
            {pending ? "جاري الحفظ…" : "حفظ المحتوى"}
          </Button>
        </div>
      </div>
    </form>
  );
}

function SectionCard({
  section,
  values,
}: {
  section: ContentSection;
  values: Record<string, string>;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{section.label}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {section.fields.map((field) => (
          <div key={field.key} className="space-y-2">
            <Label htmlFor={field.key}>{field.label}</Label>
            {field.multiline ? (
              <Textarea
                id={field.key}
                name={field.key}
                rows={3}
                defaultValue={values[field.key] ?? ""}
                className="min-h-[5rem]"
              />
            ) : (
              <Input
                id={field.key}
                name={field.key}
                defaultValue={values[field.key] ?? ""}
              />
            )}
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
