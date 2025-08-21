import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/useToast";
import { ProfileDetailType } from "@/types/profile-types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Loader2, Save, Trash } from "lucide-react";
import { useEffect, useState } from "react";
import { Resolver, SubmitHandler, useForm } from "react-hook-form"

export type AboutFormValues = {
  about?: string
  isNew: boolean
}

const resolver: Resolver<AboutFormValues> = async (values) => {
  const errors: Record<string, { type: string; message: string }> = {};

  if (!values.isNew && !values.about) {
    errors.about = {
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
  detail: ProfileDetailType,
  open: boolean
  setOpen: (value: boolean) => void
  isNew?: boolean
}

export function AboutDialog({ queryKey, detail, open, setOpen, isNew = false }: AboutDialogProps) {
  const finalQueryKey = Array.isArray(queryKey) ? queryKey : [queryKey];

  const [confirm, setConfirm] = useState<ConfirmTypes>({
    remove: false,
    leave: false
  });

  const handleConfirm = (key: keyof ConfirmTypes) => {
    setConfirm((prev) => ({ ...prev, [key]: !prev[key] }))
  }

  const initialValues: AboutFormValues = {
    about: detail?.about,
    isNew
  }

  const {
    register,
    reset,
    handleSubmit,
    formState: { errors, isDirty }
  } = useForm<AboutFormValues>({ resolver, defaultValues: initialValues });

  useEffect(() => {
    if (open) {
      reset(initialValues);
    }
  }, [open])


  async function handleUpdateAbout({ id, data }: { id: string | number, data: AboutFormValues }) {
    try {
      // TODO: Update profile detail
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  const queryClient = useQueryClient();

  const { mutateAsync: updateAbout, isPending: isLoading } = useMutation({
    mutationFn: handleUpdateAbout,
    onMutate: async ({ id, data }) => {
      await queryClient.cancelQueries({ queryKey: finalQueryKey });
      const previousData = queryClient.getQueryData(finalQueryKey);
      // TODO: optimistic update
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
      toast({ title: "Success", description: "Your about profile has been updated!" })
      setOpen(false);
    }
  });

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
        <DialogContent onOpenAutoFocus={(e) => e.preventDefault()} className="sm:max-w-[640px]">
          <DialogHeader>
            <DialogTitle className="font-inter text-lg leading-none text-heading">About Profile</DialogTitle>
            <DialogDescription className="font-inter text-paragraph">
              You can {isNew ? "add" : "edit"} your about profile summary here.
            </DialogDescription>
          </DialogHeader>
          <form
            onSubmit={handleSubmit(async (values) => updateAbout({ id: detail.id, data: values }))}
            className="grid grid-cols-1 md:grid-cols-2 gap-5 font-inter"
          >
            <Label htmlFor="about" className="space-y-2 col-span-1 md:col-span-2">
              <p className="text-heading w-full text-left">Summary</p>
              <Textarea
                {...register("about")}
                placeholder="Input the summary of your about profile"
                className="min-h-36 max-h-48 py-2 text-paragraph font-normal scrollbar focus-visible:ring-1 focus-visible:ring-primary-500 focus-visible:ring-offset-0 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-neutral-950 placeholder:text-neutral-300 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm dark:border-neutral-800 dark:bg-neutral-950 dark:ring-offset-neutral-950 dark:file:text-neutral-50 dark:placeholder:text-neutral-400 dark:focus-visible:ring-primary-500"
              />
              {errors?.about && (
                <p className="text-sm text-red-500">{errors.about.message}</p>
              )}
            </Label>
          </form>
          <DialogFooter className="sm:justify-between gap-2">
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
              <Button size="sm" key="save-btn" disabled={isLoading}>
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
  )
}