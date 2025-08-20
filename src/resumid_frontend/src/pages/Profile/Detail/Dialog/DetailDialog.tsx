import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogPortal,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/useToast";
import { ProfileDetailType } from "@/types/profile-types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Loader2, Save } from "lucide-react";
import { Resolver, SubmitHandler, useForm } from "react-hook-form";
import { useEffect, useState } from "react";

export type DetailFormValues = {
  name: string;
  currentPosition?: string;
  description?: string;
  email?: string;
  phoneNumber?: string;
  website?: string;
  x?: string;
  instagram?: string;
  facebook?: string;
};

const resolver: Resolver<DetailFormValues> = async (values) => {
  const errors: Record<string, { type: string; message: string }> = {};

  if (!values.name) {
    errors.name = {
      type: "required",
      message: "You can't leave your name blank.",
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

interface DetailDialogProps {
  queryKey: (string | number)[] | string | number;
  detail: ProfileDetailType;
  open: boolean;
  setOpen: (value: boolean) => void;
}

export function DetailDialog({
  queryKey,
  detail,
  open,
  setOpen,
}: DetailDialogProps) {
  const finalQueryKey = Array.isArray(queryKey) ? queryKey : [queryKey];

  const [confirm, setConfirm] = useState<ConfirmTypes>({
    remove: false,
    leave: false
  });

  const handleConfirm = (key: keyof ConfirmTypes) => {
    setConfirm((prev) => ({ ...prev, [key]: !prev[key] }))
  }

  const initialValues: DetailFormValues = {
    name: detail?.profileDetail?.name || "",
    currentPosition: detail?.profileDetail?.currentPosition,
    description: detail?.profileDetail?.description,
    email: detail?.contactDetail?.email,
    phoneNumber: detail?.contactDetail?.phoneNumber,
    facebook: detail?.contactDetail?.facebook,
    instagram: detail?.contactDetail?.instagram,
    website: detail?.contactDetail?.website,
    x: detail?.contactDetail?.x,
  };

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
    reset,
  } = useForm<DetailFormValues>({ resolver, defaultValues: initialValues });

  useEffect(() => {
    if (open) {
      reset(initialValues);
    }
  }, [open])

  async function handleUpdateDetail({
    id,
    data,
  }: {
    id: string | number;
    data: DetailFormValues;
  }) {
    try {
      console.log({ id, data });
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  const queryClient = useQueryClient();

  const { mutateAsync: updateDetail, isPending: isLoading } = useMutation({
    mutationFn: handleUpdateDetail,
    onMutate: async ({ id, data }) => {
      await queryClient.cancelQueries({ queryKey: finalQueryKey });
      const previousData = queryClient.getQueryData(finalQueryKey);
      return { previousData };
    },
    onError: (error, variables, context) => {
      if (context?.previousData) {
        queryClient.setQueryData(finalQueryKey, context.previousData || {});
      }
      toast({
        title: "Error",
        description: `Error updating detail: ${(error as any)?.message || "something happened"
          }`,
        variant: "destructive",
      });
    },
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ queryKey: finalQueryKey });
      toast({
        title: "Success",
        description: "Your profile detail has been updated!",
      });
      setOpen(false);
    },
  });

  return (
    <>
      <Dialog open={open} onOpenChange={(open) => {
        if (isDirty) {
          handleConfirm("leave")
        } else {
          setOpen(open)
        }
      }} modal>
        <DialogPortal>
          <DialogContent
            onOpenAutoFocus={(e) => e.preventDefault()}
            className="sm:max-w-[640px]"
          >
            <DialogHeader>
              <DialogTitle className="font-inter text-lg leading-none text-heading">Profile Detail</DialogTitle>
              <DialogDescription className="font-inter text-paragraph">
                You can edit your profile detail here.
              </DialogDescription>
            </DialogHeader>

            <form
              onSubmit={handleSubmit(async (values) =>
                updateDetail({ id: detail.id, data: values })
              )}
              className="grid grid-cols-1 md:grid-cols-2 gap-5 text-paragraph font-inter"
            >
              <Label
                htmlFor="name"
                className="space-y-2 col-span-1 md:col-span-2"
              >
                <p>
                  Full Name<span className="text-red-500">*</span>
                </p>
                <Input
                  {...register("name", { required: true })}
                  id="name"
                  className="font-normal"
                  type="text"
                  placeholder="John Doe"
                />
                {errors?.name && (
                  <p className="text-sm text-red-500">{errors.name.message}</p>
                )}
              </Label>
              <Label
                htmlFor="current-position"
                className="space-y-2 col-span-1 md:col-span-2"
              >
                <p>Current Job Position</p>
                <Input
                  {...register("currentPosition")}
                  id="current-position"
                  className="font-normal"
                  type="text"
                  placeholder="Input your current job position"
                />
              </Label>
              <Label
                htmlFor="description"
                className="space-y-2 col-span-1 md:col-span-2"
              >
                <p>Description</p>
                <Textarea
                  {...register("description")}
                  placeholder="Input your profile description"
                  className="min-h-24 max-h-36 py-2 font-normal scrollbar"
                />
              </Label>
              <Label htmlFor="website" className="space-y-2">
                <p>Email</p>
                <Input
                  {...register("email")}
                  id="email"
                  className="font-normal"
                  type="text"
                  placeholder="Input your email address"
                />
              </Label>
              <Label htmlFor="x" className="space-y-2">
                <p>Phone Number</p>
                <Input
                  {...register("phoneNumber")}
                  id="phoneNumber"
                  className="font-normal"
                  type="text"
                  placeholder="Input your phone number"
                />
              </Label>
              <Label htmlFor="website" className="space-y-2">
                <p>Website</p>
                <Input
                  {...register("website")}
                  id="website"
                  className="font-normal"
                  type="text"
                  placeholder="Input your website or portfolio"
                />
              </Label>
              <Label htmlFor="x" className="space-y-2">
                <p>X (Twitter)</p>
                <Input
                  {...register("x")}
                  id="x"
                  className="font-normal"
                  type="text"
                  placeholder="Input your x handle"
                />
              </Label>
              <Label htmlFor="instagram" className="space-y-2">
                <p>Instagram</p>
                <Input
                  {...register("instagram")}
                  id="instagram"
                  className="font-normal"
                  type="text"
                  placeholder="Input your instagram handle"
                />
              </Label>
              <Label htmlFor="facebook" className="space-y-2">
                <p>Facebook</p>
                <Input
                  {...register("facebook")}
                  id="facebook"
                  className="font-normal"
                  type="text"
                  placeholder="Input your facebook handle"
                />
              </Label>
            </form>

            <DialogFooter>
              <DialogClose asChild>
                <Button
                  size="sm"
                  key="cancel-btn"
                  variant="grey-outline"
                >
                  Cancel
                </Button>
              </DialogClose>
              <Button size="sm" key="save-btn" disabled={isLoading}>
                {!isLoading ? <Save /> : <Loader2 className="animate-spin" />}
                {isLoading ? "Saving..." : "Save changes"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </DialogPortal>
      </Dialog >
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
