import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/hooks/useToast";
import { cn } from "@/lib/utils";
import { ProfileType } from "@/types/profile-types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Loader2, Save, Trash } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Resolver, SubmitHandler, useForm } from "react-hook-form"

export type AboutFormValues = {
  summary?: string
  isNew: boolean
}

const resolver: Resolver<AboutFormValues> = async (values) => {
  const errors: Record<string, { type: string; message: string }> = {};

  if (!values.isNew && !values.summary) {
    errors.summary = {
      type: "required",
      message: "You can't leave your about profile blank.",
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

interface AboutDialogProps {
  queryKey: (string | number)[] | string | number
  detail: ProfileType,
  open: boolean
  setOpen: (value: boolean) => void
  isNew?: boolean
}

export function AboutDialog({ queryKey, detail, open, setOpen, isNew = false }: AboutDialogProps) {
  const finalQueryKey = Array.isArray(queryKey) ? queryKey : [queryKey];

  const { resumidActor, userData } = useAuth();
  const isNewRef = useRef(isNew);

  const [confirm, setConfirm] = useState<ConfirmTypes>({
    remove: false,
    leave: false
  });

  const handleConfirm = (key: keyof ConfirmTypes) => {
    setConfirm((prev) => ({ ...prev, [key]: !prev[key] }))
  }

  const initialValues: AboutFormValues = {
    summary: detail?.resume?.summary,
    isNew: isNewRef?.current
  }

  const {
    register,
    reset,
    handleSubmit,
    formState: { errors, isDirty }
  } = useForm<AboutFormValues>({ resolver, defaultValues: initialValues });

  useEffect(() => {
    if (open) {
      isNewRef.current = isNew;
      reset(initialValues);
    }
  }, [open])


  async function handleUpdateAbout({ id, data }: { id: string, data: AboutFormValues }) {
    try {
      if (!userData) throw new Error("Error, user data is undefined");

      if (!resumidActor) throw new Error("Error, actor is undefined");

      if (!id) throw new Error("Error, id is invalid or undefined");

      if (userData?.user?.id.__principal__ !== id) {
        throw new Error("Error, user is not the owner of this profile");
      }

      const { summary } = data;

      if (!summary || (typeof summary === "string" && summary.trim() === "")) {
        throw new Error("Error, about profile is required");
      }

      const newSummary: [] | [string] = summary ? [summary] : [];

      const res = await resumidActor.editSummaryShared(newSummary);

      if ("ok" in res) {
        return { summary }
      } else {
        throw new Error(res.err ?? "Unknown error");
      }
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async function handleRemoveAbout({ id }: { id: string }) {
    try {
      if (!userData) throw new Error("Error, user data is undefined");

      if (!resumidActor) throw new Error("Error, actor is undefined");

      if (!id) throw new Error("Error, id is invalid or undefined");

      if (userData?.user?.id.__principal__ !== id) {
        throw new Error("Error, user is not the owner of this profile");
      }

      const res = await resumidActor.deleteResumeItemShared("summary", []);

      if ("ok" in res) {
        return { id, message: "Success delete about section" }
      } else {
        throw new Error(res.err ?? "Unknown error");
      }
    } catch (error) {

    }
  }

  const queryClient = useQueryClient();

  const { mutateAsync: updateAbout, isPending: isUpdating } = useMutation({
    mutationFn: handleUpdateAbout,
    onMutate: async ({ id, data }) => {
      await queryClient.cancelQueries({ queryKey: finalQueryKey });
      const previousData = queryClient.getQueryData(finalQueryKey);
      queryClient.setQueryData(finalQueryKey, (old: any) => {
        const { summary } = data;

        const newData = {
          ...old,
          profile: {
            ...old?.profile,
            resume: {
              ...old?.profile?.resume,
              summary
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
        description: `Error updating about profile: ${error?.message || "something happened"}`,
        variant: "destructive",
      })
    },
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ queryKey: finalQueryKey });
      toast({ title: "Success", description: "Your about profile has been updated!", variant: "success" })
      setOpen(false);
    }
  });

  const { mutateAsync: removeAbout, isPending: isRemoving } = useMutation({
    mutationFn: handleRemoveAbout,
    onMutate: async ({ id }) => {
      await queryClient.cancelQueries({ queryKey: finalQueryKey });
      const previousData = queryClient.getQueryData(finalQueryKey);
      queryClient.setQueryData(finalQueryKey, (old: any) => {
        const newData = {
          ...old,
          profile: {
            ...old?.profile,
            resume: {
              ...old?.profile?.resume,
              summary: undefined
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
        description: `Error removing about profile section: ${error?.message || "something happened"}`,
        variant: "destructive",
      })
    },
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ queryKey: finalQueryKey });
      toast({ title: "Success", description: "Your about profile section has been removed.", variant: "success" })
      setOpen(false);
    }
  });

  const isLoading = isUpdating || isRemoving;

  return (
    <>
      <Dialog
        open={open}
        onOpenChange={(open) => {
          if (isDirty) {
            handleConfirm("leave")
          } else {
            setOpen(open)
          }
        }}
        modal
      >
        <DialogContent onOpenAutoFocus={(e) => e.preventDefault()} className="sm:max-w-[640px] max-h-[80vh] sm:max-h-[90vh] overflow-y-auto scrollbar">
          <DialogHeader>
            <DialogTitle className="font-inter text-lg leading-none text-heading">About Profile</DialogTitle>
            <DialogDescription className="font-inter text-paragraph">
              You can {isNewRef.current ? "add" : "edit"} your about profile summary here.
            </DialogDescription>
          </DialogHeader>
          <form
            onSubmit={handleSubmit(async (values) => updateAbout({ id: detail.userId, data: values }))}
            className="grid grid-cols-1 md:grid-cols-2 gap-5 font-inter"
          >
            <Label htmlFor="summary" className="space-y-2 col-span-1 md:col-span-2">
              <p className="text-heading w-full text-left">Summary</p>
              <Textarea
                {...register("summary")}
                placeholder="Input the summary of your about profile"
                className="text-sm min-h-36 max-h-48 py-2 text-paragraph font-normal scrollbar focus-visible:ring-1 focus-visible:ring-primary-500 focus-visible:ring-offset-0 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-neutral-950 placeholder:text-neutral-300 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm dark:border-neutral-800 dark:bg-neutral-950 dark:ring-offset-neutral-950 dark:file:text-neutral-50 dark:placeholder:text-neutral-400 dark:focus-visible:ring-primary-500"
              />
              {errors?.summary && (
                <p className="text-sm text-red-500">{errors.summary.message}</p>
              )}
            </Label>
          </form>
          <DialogFooter className={cn(isNewRef.current ? "sm:justify-end" : "sm:justify-between", "gap-2")}>
            {!isNewRef.current && (
              <Button
                variant="destructive"
                size="sm"
                key="remove-btn"
                onClick={() => handleConfirm("remove")}
                disabled={isLoading}
              >
                {!isRemoving ? <Trash /> : <Loader2 className="animate-spin" />}
                {isRemoving ? "Removing..." : "Remove"}
              </Button>
            )}
            <div className="flex flex-col sm:flex-row gap-2">
              <DialogClose asChild>
                <Button size="sm" key="cancel-btn" variant="grey-outline">Cancel</Button>
              </DialogClose>
              <Button size="sm" key="save-btn" disabled={isLoading || !isDirty} onClick={handleSubmit(async (values) => {
                await updateAbout({ id: detail.userId, data: values })
              })}>
                {!isUpdating ? <Save /> : <Loader2 className="animate-spin" />}
                {isUpdating ? "Saving..." : "Save changes"}
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <Dialog open={confirm.remove} onOpenChange={() => handleConfirm("remove")} modal>
        <DialogContent onOpenAutoFocus={(e) => e.preventDefault()}>
          <DialogHeader>
            <DialogTitle className="font-inter text-base text-heading">
              Remove About Section?
            </DialogTitle>
            <DialogDescription className="font-inter text-paragraph">
              This action cannot be undone. Are you sure you want to remove your about profile section?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose asChild>
              <Button size="sm" key="cancel-btn" variant="grey-outline">Cancel</Button>
            </DialogClose>
            <Button size="sm" variant="destructive" key="confirm-btn" onClick={async (values) => {
              handleConfirm("remove")
              await removeAbout({ id: detail.userId });
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
  )
}