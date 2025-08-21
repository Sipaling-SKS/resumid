import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/hooks/useToast";
import { capitalize, cn } from "@/lib/utils";
import { ProfileType } from "@/types/profile-types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Loader2, Save, Trash, X } from "lucide-react";
import { useEffect, useState } from "react";
import { Resolver, useForm } from "react-hook-form";

export type SkillFormValues = {
  skills: string[]
  isNew: boolean
}

const resolver: Resolver<SkillFormValues> = async (values) => {
  const errors: Record<string, { type: string; message: string }> = {};

  if (!values.isNew && (!values.skills || values.skills.length === 0)) {
    errors.skills = {
      type: "required",
      message: "Please add at least one skill.",
    };
  }

  return {
    values: Object.keys(errors).length === 0 ? values : {},
    errors,
  };
};

type ConfirmTypes = {
  remove: boolean
  leave: boolean
}

interface SkillDialogProps {
  queryKey: (string | number)[] | string | number
  detail: ProfileType,
  open: boolean
  setOpen: (value: boolean) => void
  isNew?: boolean
}

export function SkillDialog({ queryKey, detail, open, setOpen, isNew = false }: SkillDialogProps) {
  const finalQueryKey = Array.isArray(queryKey) ? queryKey : [queryKey];

  const { resumidActor, userData } = useAuth();

  const [confirm, setConfirm] = useState<ConfirmTypes>({
    remove: false,
    leave: false
  });

  const handleConfirm = (key: keyof ConfirmTypes) => {
    setConfirm((prev) => ({ ...prev, [key]: !prev[key] }))
  }

  const [inputValue, setInputValue] = useState("");

  const initialValues: SkillFormValues = {
    skills: detail?.resume?.skills || [],
    isNew
  };

  const {
    reset,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isDirty }
  } = useForm<SkillFormValues>({ resolver, defaultValues: initialValues });

  const skills = watch("skills");

  useEffect(() => {
    if (open) {
      reset(initialValues);
      setInputValue("");
    }
  }, [open, detail]);

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if ((e.key === "Enter" || e.key === ",") && inputValue.trim()) {
      e.preventDefault();
      const newSkill = capitalize(inputValue);
      if (!skills.includes(newSkill)) {
        setValue("skills", [...skills, newSkill], { shouldDirty: true });
        toast({ variant: "success", title: "Added a new skill", description: `You successfully added "${newSkill}".` });
      } else {
        toast({ variant: "destructive", title: "Cannot add new skill", description: `"${newSkill}" skill already exists.` });
      }
      setInputValue("");
    } else if (e.key === "Backspace" && !inputValue) {
      e.preventDefault();
      const removedSkill = skills[skills.length - 1];
      if (removedSkill) {
        setValue("skills", skills.slice(0, -1), { shouldDirty: true });
        toast({ variant: "success", title: "Removed a skill", description: `You successfully removed "${removedSkill}".` });
      }
    }
  }

  function handleRemoveSkill(skill: string) {
    setValue(
      "skills",
      skills.filter((s) => s !== skill),
      { shouldDirty: true }
    );
    toast({ variant: "success", title: "Removed a skill", description: `You successfully removed "${skill}".` });
  }


  async function handleUpdateSkill({ id, data }: { id: string | number, data: SkillFormValues }) {
    try {
      if (!userData) throw new Error("Error, user data is undefined");

      if (!resumidActor) throw new Error("Error, actor is undefined");

      if (!id) throw new Error("Error, id is invalid or undefined");

      if (userData?.ok?.id.__principal__ !== id) {
        throw new Error("Error, user is not the owner of this profile");
      }

      const { skills } = data;

      const res = await resumidActor.editSkillsShared(skills);
      if ("ok" in res) {
        return { skills }
      } else {
        throw new Error(res.err ?? "Unknown error");
      }
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  const queryClient = useQueryClient();

  const { mutateAsync: updateSkill, isPending: isLoading } = useMutation({
    mutationFn: handleUpdateSkill,
    onMutate: async ({ id, data }) => {
      await queryClient.cancelQueries({ queryKey: finalQueryKey });
      const previousData = queryClient.getQueryData(finalQueryKey);
      queryClient.setQueryData(finalQueryKey, (old: any) => {
        const { skills } = data;

        const newData = {
          ...old,
          profile: {
            ...old?.profile,
            resume: {
              ...old?.profile?.resume,
              skills
            }
          }
        }

        return newData;
      })
      return { previousData };
    },
    onError: (error, variables, context) => {
      if (context?.previousData) {
        queryClient.setQueryData(finalQueryKey, context.previousData || {});
      }
      toast({
        title: "Error",
        description: `Error updating skills: ${error?.message || "something happened"}`,
        variant: "destructive",
      })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: finalQueryKey });
      toast({ title: "Success", description: "Your skills have been updated!" });
      setOpen(false);
    }
  });

  return (
    <>
      <Dialog
        open={open}
        onOpenChange={(open) => {
          if (isDirty) {
            handleConfirm("leave");
          } else {
            setOpen(open)
          }
        }}
        modal
      >
        <DialogContent onOpenAutoFocus={(e) => e.preventDefault()} className="sm:max-w-[640px] max-h-[90vh] overflow-y-auto scrollbar">
          <DialogHeader>
            <DialogTitle className="font-inter text-lg leading-none text-heading">
              Skills
            </DialogTitle>
            <DialogDescription className="font-inter text-paragraph">
              Manage your skills here.
            </DialogDescription>
          </DialogHeader>

          <form
            onSubmit={handleSubmit(async (values) =>
              updateSkill({ id: detail.userId, data: values })
            )}
            className="space-y-4"
          >
            {/* Chip inside input */}
            <div
              className="flex flex-wrap items-center gap-2 rounded-md border border-input bg-transparent px-3 py-2 text-sm focus-within:ring-1 focus-within:ring-primary-500 dark:border-neutral-800"
            >
              {skills.map((skill, i) => (
                <span
                  key={i}
                  className="inline-flex items-center gap-1 rounded-full bg-neutral-100 px-3 py-1 text-sm"
                >
                  {skill}
                  <button
                    type="button"
                    onClick={() => handleRemoveSkill(skill)}
                    className="ml-1"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </span>
              ))}

              <input
                className="flex-1 bg-transparent outline-none placeholder:text-placeholder"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Type a skill and press Enter to add"
              />
            </div>

            {errors?.skills && (
              <p className="text-sm text-red-500">{errors.skills.message}</p>
            )}

          </form>
          <DialogFooter className={cn(isNew ? "sm:justify-end" : "sm:justify-between", "gap-2")}>
            {!isNew && (
              <Button
                variant="destructive"
                size="sm"
                key="remove-btn"
                onClick={() => handleConfirm("remove")}
              >
                <Trash />
                Remove
              </Button>
            )}
            <div className="flex flex-col sm:flex-row gap-2">
              <DialogClose asChild>
                <Button size="sm" key="cancel-btn" variant="grey-outline">Cancel</Button>
              </DialogClose>
              <Button size="sm" key="save-btn" type="submit" disabled={isLoading || !isDirty} onClick={handleSubmit(async (values) => {
                await updateSkill({ id: detail?.userId, data: values })
              })}>
                {!isLoading ? <Save /> : <Loader2 className="animate-spin" />}
                {isLoading ? "Saving..." : "Save changes"}
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <Dialog open={confirm.remove} onOpenChange={() => handleConfirm("remove")} modal>
        <DialogContent onOpenAutoFocus={(e) => e.preventDefault()}>
          <DialogHeader>
            <DialogTitle className="font-inter text-base text-heading">
              Remove Skills Section?
            </DialogTitle>
            <DialogDescription className="font-inter text-paragraph">
              This action cannot be undone. Are you sure you want to remove your about skills section?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose asChild>
              <Button size="sm" key="cancel-btn" variant="grey-outline">Cancel</Button>
            </DialogClose>
            <Button size="sm" variant="destructive" key="confirm-btn" onClick={() => {
              handleConfirm("remove")
            }}>
              <Trash />
              Remove
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <Dialog open={confirm.leave} onOpenChange={() => handleConfirm("leave")} modal>
        <DialogContent onOpenAutoFocus={(e) => e.preventDefault()}>
          <DialogHeader>
            <DialogTitle className="font-inter text-base text-heading">
              Discard Changes?
            </DialogTitle>
            <DialogDescription className="font-inter text-paragraph">
              You have unsaved changes, are you sure you want to discard your changes?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose asChild>
              <Button size="sm" key="cancel-btn" variant="grey-outline">Cancel</Button>
            </DialogClose>
            <Button size="sm" variant="destructive" key="confirm-btn" onClick={() => {
              handleConfirm("leave")
              setOpen(false)
            }}>
              Discard
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
