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
import { useEffect, useMemo, useRef, useState } from "react";
import { Resolver, useForm } from "react-hook-form";
import { format, parseISO } from "date-fns";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";

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

type CertificationInput = {
  title: string
  issuer: [string] | []
  credential_url: [string] | []
}

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
  initial: CertificateType | undefined | null
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

  const { resumidActor, userData } = useAuth();
  const isNewRef = useRef(isNew);

  const [confirm, setConfirm] = useState<ConfirmTypes>({ remove: false, leave: false });
  const handleConfirm = (key: keyof ConfirmTypes) =>
    setConfirm((prev) => ({ ...prev, [key]: !prev[key] }));

  const initialValues: CertificationFormValues = {
    title: initial?.title,
    issuer: initial?.issuer,
    credential_url: initial?.credential_url,
    isNew: isNewRef.current,
  }

  const {
    register,
    reset,
    handleSubmit,
    formState: { errors, isDirty },
  } = useForm<CertificationFormValues>({
    resolver,
    defaultValues: initialValues,
  });

  useEffect(() => {
    if (open) {
      reset(initialValues);
      isNewRef.current = isNew;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open,]);

  function validateBefore(id: string) {
    if (!userData) throw new Error("Error, user data is undefined");

    if (!id) throw new Error("Error, id is invalid or undefined");

    if (userData?.ok?.id.__principal__ !== id) {
      throw new Error("Error, user is not the owner of this profile");
    }
  }

  function mapCertificationInput(data: CertificationFormValues): CertificationInput {
    const { issuer, title, credential_url } = data;

    const certificationInput: CertificationInput = {
      title: title ?? "",
      issuer: issuer ? [issuer] : [],
      credential_url: credential_url ? [credential_url] : [],
    };

    return certificationInput;
  }

  async function handleAddExperience({
    id,
    data,
  }: {
    id: string;
    data: CertificationFormValues;
  }) {
    try {
      if (!resumidActor) throw new Error("Error, actor is undefined");

      validateBefore(id);

      const certificationInput = mapCertificationInput(data);

      const res = await resumidActor.addCertificationShared(certificationInput)

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

  async function handleUpdateCertification({
    id,
    itemId,
    data,
  }: {
    id: string;
    itemId: string;
    data: CertificationFormValues;
  }) {
    try {
      if (!resumidActor) throw new Error("Error, actor is undefined");

      validateBefore(id);

      if (!itemId) throw new Error("Error, this item does not exists");

      const certificationInput = mapCertificationInput(data);

      const res = await resumidActor.updateCertificationShared(itemId, certificationInput)

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

  async function handleRemoveCertification({ id, itemId }: { id: string, itemId: string }) {
    try {
      if (!resumidActor) throw new Error("Error, actor is undefined");

      validateBefore(id);

      if (!itemId) throw new Error("Error, this item does not exists");

      const res = await resumidActor.deleteCertificationShared([itemId]);

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

  const { mutateAsync: addCertification, isPending: isAdding } = useMutation({
    mutationFn: handleAddExperience,
    onMutate: async ({ id, data }) => {
      await queryClient.cancelQueries({ queryKey: finalQueryKey });
      const previous = queryClient.getQueryData(finalQueryKey);

      const tempId = `temp-${Date.now()}`;
      const newCertification: CertificateType = {
        id: tempId,
        title: data.title ?? "",
        issuer: data.issuer,
        credential_url: data.credential_url
      }

      queryClient.setQueryData(finalQueryKey, (old: ProfileType | undefined) =>
        old
          ? {
            ...old,
            certifications: [
              ...old?.certifications ?? [],
              newCertification,
            ]
          }
          : old
      );

      return { previous };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: finalQueryKey });
      toast({ title: "Success", description: "Certification added!", variant: "success" });
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

  const { mutateAsync: updateCertification, isPending: isUpdating } = useMutation({
    mutationFn: handleUpdateCertification,
    onMutate: async ({ id, itemId, data }) => {
      await queryClient.cancelQueries({ queryKey: finalQueryKey });
      const previous = queryClient.getQueryData(finalQueryKey);

      queryClient.setQueryData(finalQueryKey, (old: ProfileType | undefined) =>
        old
          ? {
            ...old,
            certifications: old?.certifications?.map((cert) =>
              cert.id === itemId
                ? { ...cert, ...data }
                : cert
            ) ?? [],
          }
          : old
      );

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
    onMutate: async ({ id, itemId }) => {
      await queryClient.cancelQueries({ queryKey: finalQueryKey });
      const previous = queryClient.getQueryData(finalQueryKey);

      queryClient.setQueryData(finalQueryKey, (old: ProfileType | undefined) =>
        old
          ? {
            ...old,
            certifications: old?.certifications?.filter(
              (cert) => cert.id !== itemId
            ) ?? [],
          }
          : old
      );

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
              {isNewRef.current ? "Add Certification" : "Edit Certification"}
            </DialogTitle>
            <DialogDescription className="font-inter text-paragraph">
              {isNewRef.current ? "Create a new" : "Update your"} certification item.
            </DialogDescription>
          </DialogHeader>

          <form
            onSubmit={handleSubmit(async (values) => {
              if (isNewRef.current || !initial) {
                await addCertification({ id: detail?.userId, data: values });
              } else {
                await updateCertification({ id: detail?.userId, itemId: initial.id, data: values });
              }
            })}
            className="flex flex-col gap-5 font-inter text-paragraph"
          >
            <Label htmlFor="title" className="space-y-2">
              <p>Certification Title<span className="text-red-500">*</span></p>
              <Input className="font-normal text-sm" id="title" {...register("title")} placeholder="Company name" />
              {errors?.title && (
                <p className="text-sm text-red-500">{errors.title.message}</p>
              )}
            </Label>

            <Label htmlFor="issuer" className="space-y-2">
              <p>Issuer</p>
              <Input className="font-normal text-sm" id="issuer" {...register("issuer")} placeholder="e.g., Frontend Engineer" />
            </Label>

            <Label htmlFor="credential_url" className="space-y-2">
              <p>URL to Certification</p>
              <Input className="font-normal text-sm" id="credential_url" {...register("credential_url")} placeholder="e.g., Frontend Engineer" />
              {errors?.credential_url && (
                <p className="text-sm text-red-500">{errors.credential_url.message}</p>
              )}
            </Label>

            <DialogFooter className={cn("gap-2", isNewRef.current ? "sm:justify-end" : "sm:justify-between")}>
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
                  {isSaving ? isNewRef.current ? "Adding..." : "Saving..." : isNewRef.current ? "Add Certification" : "Save changes"}
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
                await removeCertification({ id: detail?.userId, itemId: initial.id });
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
