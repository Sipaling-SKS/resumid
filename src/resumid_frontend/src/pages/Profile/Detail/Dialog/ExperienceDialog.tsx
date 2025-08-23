import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/useToast";
import { ProfileType, WorkExperienceType } from "@/types/profile-types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { List, ListOrdered, Loader2, Plus, Save, Trash } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Resolver, useForm, Controller } from "react-hook-form";
import { compareDesc, format, isAfter, isValid, parseISO } from "date-fns";

import { useEditor, EditorContent, useEditorState, Editor } from "@tiptap/react";
import { Extension } from "@tiptap/core"
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import BulletList from "@tiptap/extension-bullet-list";
import OrderedList from "@tiptap/extension-ordered-list";
import ListItem from "@tiptap/extension-list-item";

import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { cn } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth } from "@/contexts/AuthContext";
import { sortByPeriod } from "@/utils/sortByPeriod";

export type PeriodType = {
  start?: string;
  end?: string;
};

export type ExperienceFormValues = {
  company?: string;
  location?: string;
  employment_type?: string;
  position?: string;
  description?: string;
  period?: PeriodType;
  isNew: boolean;
};

type WorkExperienceInput = {
  company: string
  position: string
  location: [string] | []
  employment_type: [string] | []
  period: {
    start: [string] | []
    end: [string] | []
  }
  description: [string] | []
}

type ConfirmTypes = {
  remove: boolean;
  leave: boolean;
};

interface ExperienceDialogProps {
  queryKey: (string | number)[] | string | number;
  detail: ProfileType;
  open: boolean;
  setOpen: (value: boolean) => void;
  isNew?: boolean;
  initial: WorkExperienceType | undefined | null
}

const resolver: Resolver<ExperienceFormValues> = async (values) => {
  const errors: Record<string, { type: string; message: string }> = {};

  if (!values.isNew) {
    if (!values.company?.trim()) {
      errors.company = { type: "required", message: "Company is required." };
    }
    if (!values.position?.trim()) {
      errors.position = { type: "required", message: "Position is required." };
    }
    if (!values.period?.start) {
      errors["period.start"] = { type: "required", message: "Start date is required." };
    } else {
      if (values.period.end) {
        try {
          const start = parseISO(values.period.start);
          const end = parseISO(values.period.end);
          if (isAfter(start, end)) {
            errors["period.end"] = { type: "validate", message: "End date cannot be before start date." };
          }
        } catch {
          errors["period.end"] = { type: "validate", message: "Invalid end date." };
        }
      }
    }
  }

  return {
    values: Object.keys(errors).length === 0 ? values : {},
    errors,
  };
};

export function ExperienceDialog({
  queryKey,
  detail,
  open,
  setOpen,
  isNew = false,
  initial,
}: ExperienceDialogProps) {

  const finalQueryKey = Array.isArray(queryKey) ? queryKey : [queryKey];

  const { resumidActor, userData } = useAuth();
  const isNewRef = useRef(isNew);

  const [confirm, setConfirm] = useState<ConfirmTypes>({ remove: false, leave: false });
  const handleConfirm = (key: keyof ConfirmTypes) =>
    setConfirm((prev) => ({ ...prev, [key]: !prev[key] }));

  const toInputDate = (iso?: string) => {
    if (!iso) return "";
    try {
      return format(parseISO(iso), "yyyy-MM-dd");
    } catch {
      return "";
    }
  };

  const initialValues: ExperienceFormValues = {
    company: initial?.company,
    location: initial?.location,
    employment_type: initial?.employment_type ?? "",
    position: initial?.position,
    description: initial?.description,
    period: {
      start: toInputDate(initial?.period?.start),
      end: toInputDate(initial?.period?.end),
    },
    isNew: isNewRef.current,
  }

  const {
    register,
    control,
    reset,
    setValue,
    handleSubmit,
    formState: { errors, isDirty },
  } = useForm<ExperienceFormValues>({
    resolver,
    defaultValues: initialValues,
  });

  const DisableIndent = Extension.create({
    name: "disableIndent",
    addKeyboardShortcuts() {
      return {
        Tab: () => true,
        "Shift-Tab": () => true
      }
    },
  })

  const editor = useEditor({
    content: initialValues.description || "",
    extensions: [
      StarterKit.configure({
        heading: false,
        blockquote: false,
        codeBlock: false,
        strike: false,
        horizontalRule: false,
        bulletList: false,
        orderedList: false,
        listItem: false,
      }),
      DisableIndent,
      Underline,
      BulletList,
      OrderedList,
      ListItem,
    ],
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      setValue("description", html, { shouldDirty: true });
    },
    editorProps: {
      attributes: {
        class:
          "prose prose-sm max-w-none dark:prose-invert focus:outline-none min-h-[144px] p-3 rounded-md border border-input dark:border-neutral-800 prose-ul:list-disc prose-ol:list-decimal prose-li:ml-4",
      },
    },
  });


  useEffect(() => {
    if (open) {
      reset(initialValues);
      isNewRef.current = isNew;
      editor?.commands.setContent(initialValues.description || "", { emitUpdate: false });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  function validateBefore(id: string) {
    if (!userData) throw new Error("Error, user data is undefined");

    if (!id) throw new Error("Error, id is invalid or undefined");

    if (userData?.ok?.id.__principal__ !== id) {
      throw new Error("Error, user is not the owner of this profile");
    }
  }

  function mapWorkExperienceInput(data: ExperienceFormValues): WorkExperienceInput {
    const { company, location, position, employment_type, period, description } = data;

    if (!period?.start) throw new Error("Error, start date is required")


    const workExperienceInput: WorkExperienceInput = {
      company: company ?? "",
      location: location ? [location] : [],
      position: position ?? "",
      employment_type: employment_type ? [employment_type] : [],
      period: {
        start: [period.start],
        end: period.end ? [period.end] : [],
      },
      description: description ? [description] : [],
    };

    return workExperienceInput;
  }

  async function handleAddExperience({
    id,
    data,
  }: {
    id: string;
    data: ExperienceFormValues;
  }) {
    try {
      if (!resumidActor) throw new Error("Error, actor is undefined");

      validateBefore(id);

      const workExperienceInput = mapWorkExperienceInput(data);

      const res = await resumidActor.addWorkExperienceShared(workExperienceInput)

      if ("ok" in res) {
        return { data }
      } else {
        throw new Error(res.err ?? "Unknown error");
      }
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async function handleUpdateExperience({
    id,
    itemId,
    data,
  }: {
    id: string;
    itemId: string;
    data: ExperienceFormValues;
  }) {
    try {
      if (!resumidActor) throw new Error("Error, actor is undefined");

      validateBefore(id);

      if (!itemId) throw new Error("Error, this item does not exists");

      const workExperienceInput = mapWorkExperienceInput(data);

      const res = await resumidActor.editWorkExperienceShared(itemId, workExperienceInput)

      if ("ok" in res) {
        return { itemId, data }
      } else {
        throw new Error(res.err ?? "Unknown error");
      }
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async function handleRemoveExperience({ id, itemId }: { id: string, itemId: string }) {
    try {
      if (!resumidActor) throw new Error("Error, actor is undefined");

      validateBefore(id);

      if (!itemId) throw new Error("Error, this item does not exists");
      console.log("Removing experience")

      const res = await resumidActor.deleteResumeItemShared("workExperience", [itemId]);

      if ("ok" in res) {
        return { itemId }
      } else {
        throw new Error(res.err ?? "Unknown error");
      }
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  const queryClient = useQueryClient();

  const { mutateAsync: addExperience, isPending: isAdding } = useMutation({
    mutationFn: handleAddExperience,
    onMutate: async ({ id, data }) => {
      await queryClient.cancelQueries({ queryKey: finalQueryKey });
      const previous = queryClient.getQueryData(finalQueryKey);

      const tempId = `temp-${Date.now()}`;
      const newExperience: WorkExperienceType = {
        id: tempId,
        company: data.company ?? "",
        position: data.position ?? "",
        location: data.location,
        employment_type: data.employment_type,
        description: data.description,
        period: {
          start: data?.period?.start,
          end: data?.period?.end,
        }
      }

      queryClient.setQueryData(
        finalQueryKey,
        (old: { profile: ProfileType; endorsementInfo: any }) =>
          old
            ? {
              ...old,
              profile: {
                ...old.profile,
                resume: {
                  ...old.profile.resume,
                  workExperiences: sortByPeriod<WorkExperienceType>([
                    ...(old.profile.resume?.workExperiences ?? []),
                    newExperience,
                  ]),
                },
              },
            }
            : old
      );

      return { previous };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: finalQueryKey });
      toast({ title: "Success", description: "Experience added!", variant: "success" });
      setOpen(false);
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Error adding experience: ${(error as any)?.message || "Something happened"}`,
        variant: "destructive",
      });
    },
  });

  const { mutateAsync: updateExperience, isPending: isUpdating } = useMutation({
    mutationFn: handleUpdateExperience,
    onMutate: async ({ id, itemId, data }) => {
      await queryClient.cancelQueries({ queryKey: finalQueryKey });
      const previous = queryClient.getQueryData(finalQueryKey);

      queryClient.setQueryData(
        finalQueryKey,
        (old: { profile: ProfileType; endorsementInfo: any }) =>
          old
            ? {
              ...old,
              profile: {
                ...old.profile,
                resume: {
                  ...old.profile.resume,
                  workExperiences: sortByPeriod<WorkExperienceType>(
                    old.profile.resume?.workExperiences?.map((exp) =>
                      exp.id === itemId ? { ...exp, ...data } : exp
                    ) ?? []
                  ),
                },
              },
            }
            : old
      );

      return { previous };
    },
    onError: (error, _vars, ctx) => {
      if (ctx?.previous) queryClient.setQueryData(finalQueryKey, ctx.previous);
      toast({
        title: "Error",
        description: `Error updating experience: ${(error as any)?.message || "Something happened"}`,
        variant: "destructive",
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: finalQueryKey });
      toast({ title: "Success", description: "Experience updated!", variant: "success" });
      setOpen(false);
    },
  });

  const { mutateAsync: removeExperience, isPending: isRemoving } = useMutation({
    mutationFn: handleRemoveExperience,
    onMutate: async ({ id, itemId }) => {
      await queryClient.cancelQueries({ queryKey: finalQueryKey });
      const previous = queryClient.getQueryData(finalQueryKey);

      queryClient.setQueryData(
        finalQueryKey,
        (old: { profile: ProfileType; endorsementInfo: any }) =>
          old
            ? {
              ...old,
              profile: {
                ...old.profile,
                resume: {
                  ...old.profile.resume,
                  workExperiences: sortByPeriod<WorkExperienceType>(
                    old.profile.resume?.workExperiences?.filter(
                      (exp) => exp.id !== itemId
                    ) ?? []
                  ),
                },
              },
            }
            : old
      );

      return { previous };
    },
    onError: (error, _vars, ctx) => {
      if (ctx?.previous) queryClient.setQueryData(finalQueryKey, ctx.previous);
      toast({
        title: "Error",
        description: `Error removing experience: ${(error as any)?.message || "Something happened"}`,
        variant: "destructive",
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: finalQueryKey });
      toast({ title: "Removed", description: "Experience removed.", variant: "success" });
      setOpen(false);
    },
  });

  function Toolbar({ editor }: { editor: Editor }) {
    const st = useEditorState({
      editor,
      selector: (ctx) => ({
        isBold: ctx.editor.isActive("bold"),
        isItalic: ctx.editor.isActive("italic"),
        isUnderline: ctx.editor.isActive("underline"),
        isBullet: ctx.editor.isActive("bulletList"),
        isOrdered: ctx.editor.isActive("orderedList"),
        canBold: ctx.editor.can().chain().toggleBold().run(),
        canItalic: ctx.editor.can().chain().toggleItalic().run(),
        canUnderline: ctx.editor.can().chain().toggleUnderline().run(),
        canBullet: ctx.editor.can().chain().toggleBulletList().run(),
        canOrdered: ctx.editor.can().chain().toggleOrderedList().run(),
      }),
    });

    if (!editor) return null;

    const activeValues = [
      st.isBold && "bold",
      st.isItalic && "italic",
      st.isUnderline && "underline",
      st.isBullet && "bulletList",
      st.isOrdered && "orderedList",
    ].filter(Boolean) as string[];

    const onToggle =
      (run: () => void) =>
        (e: React.MouseEvent) => {
          e.preventDefault();
          editor.chain().focus();
          run();
        };

    return (
      <TooltipProvider>
        <ToggleGroup
          type="multiple"
          variant="outline"
          className="flex flex-wrap justify-start"
          value={activeValues}
          onValueChange={() => { }}
        >
          <Tooltip>
            <TooltipTrigger asChild>
              <ToggleGroupItem
                value="bold"
                aria-label="Toggle bold"
                disabled={!st.canBold}
                onMouseDown={onToggle(() => editor.chain().toggleBold().run())}
                className={cn("rounded-r-none")}
              >
                <strong>B</strong>
              </ToggleGroupItem>
            </TooltipTrigger>
            <TooltipContent>Bold</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <ToggleGroupItem
                value="italic"
                aria-label="Toggle italic"
                disabled={!st.canItalic}
                onMouseDown={onToggle(() => editor.chain().toggleItalic().run())}
                className={cn("rounded-none border-l-0")}
              >
                <em>I</em>
              </ToggleGroupItem>
            </TooltipTrigger>
            <TooltipContent>Italic</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <ToggleGroupItem
                value="underline"
                aria-label="Toggle underline"
                disabled={!st.canUnderline}
                onMouseDown={onToggle(() => editor.chain().toggleUnderline().run())}
                className={cn("rounded-none border-x-0")}
              >
                <span className="underline">U</span>
              </ToggleGroupItem>
            </TooltipTrigger>
            <TooltipContent>Underline</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <ToggleGroupItem
                value="bulletList"
                aria-label="Toggle bullet list"
                disabled={!st.canBullet}
                onMouseDown={onToggle(() => editor.chain().toggleBulletList().run())}
                className={cn("rounded-none border-r-0")}
              >
                <List />
              </ToggleGroupItem>
            </TooltipTrigger>
            <TooltipContent>Bullet List</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <ToggleGroupItem
                value="orderedList"
                aria-label="Toggle ordered list"
                disabled={!st.canOrdered}
                onMouseDown={onToggle(() => editor.chain().toggleOrderedList().run())}
                className={cn("rounded-l-none")}
              >
                <ListOrdered />
              </ToggleGroupItem>
            </TooltipTrigger>
            <TooltipContent>Ordered List</TooltipContent>
          </Tooltip>
        </ToggleGroup>
      </TooltipProvider>
    );
  }

  const isSaving = isAdding || isUpdating;

  return (
    <>
      <Dialog
        open={open}
        onOpenChange={(next) => {
          if (isDirty) {
            handleConfirm("leave");
          } else {
            setOpen(next);
          }
        }}
        modal
      >
        <DialogContent onOpenAutoFocus={(e) => e.preventDefault()} className="sm:max-w-[720px] max-h-[80vh] sm:max-h-[90vh] overflow-y-auto scrollbar">
          <DialogHeader>
            <DialogTitle className="font-inter text-lg leading-none text-heading">
              {isNewRef.current ? "Add Experience" : "Edit Experience"}
            </DialogTitle>
            <DialogDescription className="font-inter text-paragraph">
              {isNewRef.current ? "Create a new" : "Update your"} work experience item.
            </DialogDescription>
          </DialogHeader>

          <form
            onSubmit={handleSubmit(async (values) => {
              if (isNewRef.current || !initial) {
                await addExperience({ id: detail?.userId, data: values });
              } else {
                await updateExperience({ id: detail?.userId, itemId: initial.id, data: values });
              }
            })}
            className="grid grid-cols-1 md:grid-cols-2 gap-5 font-inter text-paragraph"
          >
            <Label htmlFor="company" className="space-y-2 col-span-1 md:col-span-2">
              <p>Company<span className="text-red-500">*</span></p>
              <Input className="font-normal text-sm" id="company" {...register("company")} placeholder="Company name" />
              {errors?.company && (
                <p className="text-sm text-red-500">{errors.company.message}</p>
              )}
            </Label>

            <Label htmlFor="position" className="space-y-2 col-span-1 md:col-span-2">
              <p>Position<span className="text-red-500">*</span></p>
              <Input className="font-normal text-sm" id="position" {...register("position")} placeholder="e.g., Frontend Engineer" />
              {errors?.position && (
                <p className="text-sm text-red-500">{errors.position.message}</p>
              )}
            </Label>

            <Label htmlFor="location" className="space-y-2 col-span-1 md:col-span-2">
              <p>Location</p>
              <Input className="font-normal text-sm" id="location" {...register("location")} placeholder="City, Country (optional)" />
            </Label>

            <Label htmlFor="employment_type" className="space-y-2 col-span-1 md:col-span-2">
              <p>Employment Type</p>
              <Controller
                name="employment_type"
                control={control}
                defaultValue=""
                render={({ field }) => {
                  const options = ["Full-time", "Part-time", "Contract", "Internship"];

                  return (
                    <Select value={field.value || ""} onValueChange={field.onChange}>
                      <SelectTrigger className="font-normal text-sm">
                        <SelectValue placeholder="Select employment type" />
                      </SelectTrigger>
                      <SelectContent>
                        {options.map((type) => (
                          <SelectItem className="cursor-pointer" key={type} value={type}>
                            {type}
                          </SelectItem>
                        ))}
                        {field.value &&
                          !options.includes(field.value) && (
                            <SelectItem className="cursor-pointer" value={field.value}>
                              {field.value}
                            </SelectItem>
                          )}
                      </SelectContent>
                    </Select>
                  );
                }}
              />
            </Label>


            <div className="col-span-1">
              <Label htmlFor="period.start" className="space-y-2">
                <p>Start Date<span className="text-red-500">*</span></p>
                <Input className="font-normal text-sm" type="date" id="period.start" {...register("period.start")} />
                {errors.period?.start && (
                  <p className="text-sm text-red-500">{errors.period.start.message}</p>
                )}
              </Label>
            </div>

            <div className="col-span-1">
              <Label htmlFor="period.end" className="space-y-2">
                <p>End Date</p>
                <Input className="font-normal text-sm" type="date" id="period.end" {...register("period.end")} />
                {errors.period?.end && (
                  <p className="text-sm text-red-500">{errors.period.end.message}</p>
                )}
              </Label>
            </div>

            <div className="col-span-1 md:col-span-2 space-y-2">
              <p className="text-sm font-inter font-medium">Description</p>
              <Toolbar editor={editor} />
              <Controller
                name="description"
                control={control}
                render={({ field: { value, onChange } }) => (
                  <EditorContent
                    className="
                      prose prose-sm max-w-none
                      [&_.prose]:max-w-none
                      &_.prose]:text-paragraph
                      [&_ul]:pl-0 [&_ul]:list-disc marker:text-paragraph
                      [&_ol]:pl-0 [&_ol]:list-decimal
                      [&_p]:text-paragraph
                      [&_p]:my-0
                    "
                    editor={editor}
                    onBlur={() => onChange(editor.getHTML())}
                  />
                )}
              />
            </div>

            <DialogFooter className={cn("gap-2 col-span-1 md:col-span-2", isNewRef.current ? "sm:justify-end" : "sm:justify-between")}>
              {!isNewRef.current && (
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  onClick={() => handleConfirm("remove")}
                  disabled={isRemoving}
                >
                  {!isRemoving ? <Trash /> : <Loader2 className="animate-spin" />}
                  Remove
                </Button>
              )}
              <div className="flex flex-col sm:flex-row gap-2">
                <DialogClose asChild>
                  <Button size="sm" variant="grey-outline">Cancel</Button>
                </DialogClose>
                <Button size="sm" disabled={isSaving || !isDirty}>
                  {!isSaving ? isNewRef.current ? <Plus /> : <Save /> : <Loader2 className="animate-spin" />}
                  {isSaving ? isNewRef.current ? "Adding..." : "Saving..." : isNewRef.current ? "Add Experience" : "Save changes"}
                </Button>
              </div>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Remove confirm */}
      {!isNewRef.current && initial && <Dialog open={confirm.remove} onOpenChange={() => handleConfirm("remove")} modal>
        <DialogContent onOpenAutoFocus={(e) => e.preventDefault()}>
          <DialogHeader>
            <DialogTitle className="font-inter text-base text-heading">
              Remove Experience?
            </DialogTitle>
            <DialogDescription className="font-inter text-paragraph">
              This action cannot be undone. Are you sure you want to remove this experience?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2">
            <DialogClose asChild>
              <Button size="sm" variant="grey-outline">Cancel</Button>
            </DialogClose>
            <Button
              size="sm"
              variant="destructive"
              onClick={async () => {
                await removeExperience({ id: detail?.userId, itemId: initial.id });
                handleConfirm("remove");
              }}
              disabled={isRemoving}
            >
              {!isRemoving ? <Trash /> : <Loader2 className="animate-spin" />}
              Remove
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>}

      {/* Leave/Discard confirm */}
      <Dialog open={confirm.leave} onOpenChange={() => handleConfirm("leave")} modal>
        <DialogContent onOpenAutoFocus={(e) => e.preventDefault()}>
          <DialogHeader>
            <DialogTitle className="font-inter text-base text-heading">
              Discard Changes?
            </DialogTitle>
            <DialogDescription className="font-inter text-paragraph">
              You have unsaved changes, are you sure you want to discard them?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2">
            <DialogClose asChild>
              <Button size="sm" variant="grey-outline">Cancel</Button>
            </DialogClose>
            <Button
              size="sm"
              variant="destructive"
              onClick={() => {
                handleConfirm("leave");
                setOpen(false);
              }}
            >
              Discard
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
