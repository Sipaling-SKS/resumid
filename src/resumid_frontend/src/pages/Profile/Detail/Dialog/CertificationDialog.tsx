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
import { CertificateType, ProfileType } from "@/types/profile-types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Loader2, Plus, Save, Trash } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Resolver, useForm } from "react-hook-form";
import { format, parseISO } from "date-fns";
import { cn } from "@/lib/utils";

export type PeriodType = {
  start?: string;
  end?: string;
};

export type CertificationFormValues = {
  title?: string;
  issuer?: string;
  credential_url?: string;
  isNew: boolean;
};

type ConfirmTypes = {
  remove: boolean;
  leave: boolean;
};

interface CertificationDialogProps {
  queryKey: (string | number)[] | string | number;
  detail: ProfileType;
  open: boolean;
  setOpen: (value: boolean) => void;
  isNew?: boolean;
  initial: CertificateType
}

const resolver: Resolver<CertificationFormValues> = async (values) => {
  const errors: Record<string, { type: string; message: string }> = {};

  if (!values.isNew && !values.title?.trim()) {
    errors.company = { type: "required", message: "Certification title is required." };
  }

  return {
    values: Object.keys(errors).length === 0 ? values : {},
    errors,
  };
};

export function CertificationDialog({
  queryKey,
  detail,
  open,
  setOpen,
  isNew = false,
  initial,
}: CertificationDialogProps) {

  const finalQueryKey = Array.isArray(queryKey) ? queryKey : [queryKey];

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

  const initialValues: CertificationFormValues = useMemo(
    () => ({
      title: initial?.title,
      issuer: initial?.issuer,
      credential_url: initial?.credential_url,
      isNew,
    }),
    [initial, isNew]
  );

  const {
    register,
    control,
    reset,
    setValue,
    handleSubmit,
    formState: { errors, isDirty },
  } = useForm<CertificationFormValues>({
    resolver,
    defaultValues: initialValues,
  });


  useEffect(() => {
    if (open) {
      reset(initialValues);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, initialValues]);

  async function handleUpdateCertification({
    id,
    data,
  }: {
    id: string | number;
    data: CertificationFormValues;
  }) {
    try {
      // TODO: call API with `id` and `data`
      // Ensure `period.start/end` are already yyyy-MM-dd (they are)
      // Ensure `description` is HTML from TipTap
      return { ok: true };
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async function handleRemoveCertification({ id }: { id: string | number }) {
    try {
      // TODO: call API to remove this certification by id
      return { ok: true };
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  const queryClient = useQueryClient();

  const { mutateAsync: addCertification, isPending: isAdding } = useMutation({
    mutationFn: async ({ data }: { data: CertificationFormValues }) => {
      try {
        // TODO: call API to add new certification
        return { ok: true };
      } catch (error) {
        console.error(error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: finalQueryKey });
      toast({ title: "Success", description: "Certification added!" });
      setOpen(false);
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Error adding certification: ${(error as any)?.message || "Something happened"}`,
        variant: "destructive",
      });
    },
  });

  const { mutateAsync: updateCertification, isPending: isSaving } = useMutation({
    mutationFn: handleUpdateCertification,
    onMutate: async ({ id, data }) => {
      await queryClient.cancelQueries({ queryKey: finalQueryKey });
      const previous = queryClient.getQueryData(finalQueryKey);
      // TODO: optimistic update (optional)
      return { previous };
    },
    onError: (error, _vars, ctx) => {
      if (ctx?.previous) queryClient.setQueryData(finalQueryKey, ctx.previous);
      toast({
        title: "Error",
        description: `Error updating certification: ${(error as any)?.message || "Something happened"}`,
        variant: "destructive",
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: finalQueryKey });
      toast({ title: "Success", description: "Certification updated!" });
      setOpen(false);
    },
  });

  const { mutateAsync: removeCertification, isPending: isRemoving } = useMutation({
    mutationFn: handleRemoveCertification,
    onMutate: async ({ id }) => {
      await queryClient.cancelQueries({ queryKey: finalQueryKey });
      const previous = queryClient.getQueryData(finalQueryKey);
      // TODO: optimistic remove (optional)
      return { previous };
    },
    onError: (error, _vars, ctx) => {
      if (ctx?.previous) queryClient.setQueryData(finalQueryKey, ctx.previous);
      toast({
        title: "Error",
        description: `Error removing certification: ${(error as any)?.message || "Something happened"}`,
        variant: "destructive",
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: finalQueryKey });
      toast({ title: "Removed", description: "Certification removed." });
      setOpen(false);
    },
  });

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
        <DialogContent onOpenAutoFocus={(e) => e.preventDefault()} className="sm:max-w-[720px] max-h-[90vh] overflow-y-auto scrollbar">
          <DialogHeader>
            <DialogTitle className="font-inter text-lg leading-none text-heading">
              {isNew ? "Add Certification" : "Edit Certification"}
            </DialogTitle>
            <DialogDescription className="font-inter text-paragraph">
              {isNew ? "Create a new" : "Update your"} certification item.
            </DialogDescription>
          </DialogHeader>

          <form
            onSubmit={handleSubmit(async (values) => {
              if (isNew) {
                await addCertification({ data: values });
              } else {
                await updateCertification({ id: initial.id, data: values });
              }
            })}
            className="flex flex-col gap-5 font-inter text-paragraph"
          >
            <Label htmlFor="title" className="space-y-2">
              <p>Certification Title<span className="text-red-500">*</span></p>
              <Input className="font-normal" id="title" {...register("title")} placeholder="Company name" />
              {errors?.title && (
                <p className="text-sm text-red-500">{errors.title.message}</p>
              )}
            </Label>

            <Label htmlFor="issuer" className="space-y-2">
              <p>Issuer</p>
              <Input className="font-normal" id="issuer" {...register("issuer")} placeholder="e.g., Frontend Engineer" />
            </Label>

            <Label htmlFor="credential_url" className="space-y-2">
              <p>URL to Certification</p>
              <Input className="font-normal" id="credential_url" {...register("credential_url")} placeholder="e.g., Frontend Engineer" />
              {errors?.credential_url && (
                <p className="text-sm text-red-500">{errors.credential_url.message}</p>
              )}
            </Label>

            <DialogFooter className={cn("gap-2", isNew ? "sm:justify-end" : "sm:justify-between")}>
              {!isNew && (
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
                  {!isSaving ? isNew ? <Plus /> : <Save /> : <Loader2 className="animate-spin" />}
                  {isSaving ? isNew ? "Adding..." : "Saving..." : isNew ? "Add Certification" : "Save changes"}
                </Button>
              </div>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Remove confirm */}
      {!isNew && <Dialog open={confirm.remove} onOpenChange={() => handleConfirm("remove")} modal>
        <DialogContent onOpenAutoFocus={(e) => e.preventDefault()}>
          <DialogHeader>
            <DialogTitle className="font-inter text-base text-heading">
              Remove Certification?
            </DialogTitle>
            <DialogDescription className="font-inter text-paragraph">
              This action cannot be undone. Are you sure you want to remove this certification?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose asChild>
              <Button size="sm" variant="grey-outline">Cancel</Button>
            </DialogClose>
            <Button
              size="sm"
              variant="destructive"
              onClick={async () => {
                await removeCertification({ id: initial.id });
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
          <DialogFooter>
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
