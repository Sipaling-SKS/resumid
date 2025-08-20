import PhotoUploadCrop, { PhotoUploadCropRef } from "@/components/parts/PhotoUploadCrop"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { useAuth } from "@/contexts/AuthContext"
import { toast } from "@/hooks/useToast"
import { cn } from "@/lib/utils"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { Camera, Check, Loader2, Save, Trash } from "lucide-react"
import { useRef, useState } from "react"

interface AvatarDialogProps {
  queryKey: (string | number)[] | string | number
  isOwner?: boolean
  url?: string | undefined | null
  open: boolean
  setOpen: (value: boolean) => void
}

export function AvatarDialog({ queryKey, url, open, setOpen, isOwner = false }: AvatarDialogProps) {
  const finalQueryKey = Array.isArray(queryKey) ? queryKey : [queryKey];

  const [confirm, setConfirm] = useState<boolean>(false);
  const [isEditing, setEditing] = useState<boolean>(false)
  const [cropped, setCropped] = useState<string | null>(null)
  const [isCropReady, setIsCropReady] = useState<boolean>(false)

  const cropperRef = useRef<PhotoUploadCropRef>(null)

  const handleDone = async () => {
    const base64 = await cropperRef.current?.cropImage()
    if (base64) setCropped(base64)
  }

  const handleReset = () => {
    setCropped(null);
    setEditing(false);
  }

  const { resumidActor } = useAuth();

  async function handleUpdateAvatar({ id, file }: { id: any, file: File }) {
    try {
      // TODO: Upload to pinata get url or cid

      // TODO: Update avatar cid/url on database
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  const queryClient = useQueryClient();

  const { mutateAsync: updateAvatar, isPending: isLoading } = useMutation({
    mutationFn: handleUpdateAvatar,
    onMutate: async ({ id, file }) => {
      await queryClient.cancelQueries({ queryKey: finalQueryKey });
      const previousData = queryClient.getQueryData(finalQueryKey);
      queryClient.setQueryData(finalQueryKey, (old: any) => ({
        ...old,
        avatar: cropped,
      }));
      return { previousData };
    },
    onError: (error, variables, context) => {
      if (context?.previousData) {
        queryClient.setQueryData(finalQueryKey, context.previousData || {});
      }
      toast({
        title: "Error",
        description: `Error submitting photo: ${error?.message || "something happened"}`,
        variant: "destructive",
      })
    },
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ queryKey: finalQueryKey });
      toast({ title: "Success", description: "Your profile avatar has been updated!" })
      handleReset();
      setOpen(false);
    }
  });

  const handleSubmit = async () => {
    // TODO: Add upload function here
    // updateAvatar()
  }

  return (
    <>
      <Dialog
        open={open}
        onOpenChange={(value) => {
          handleReset()
          setOpen(value);
        }}
        modal
      >
        <DialogContent onOpenAutoFocus={(e) => e.preventDefault()} className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="font-inter text-lg leading-none text-heading">{isEditing ? "Upload " : ""}Profile Avatar</DialogTitle>
            <DialogDescription className="font-inter text-paragraph">
              View or upload new profile avatar here.
            </DialogDescription>
          </DialogHeader>
          {!cropped && isEditing ? (
            <PhotoUploadCrop aspect={1} ref={cropperRef} onCropReady={setIsCropReady} />
          ) : (
            <div className="flex justify-center items-center bg-black/5 aspect-square rounded-md shadow-sm overflow-clip">
              <img
                src={cropped || url || "https://github.com/shadcn.png"}
                alt="profile-avatar"
                className="w-full h-full object-contain"
              />
            </div>
          )}
          {isOwner && (
            <DialogFooter className={cn("w-full flex gap-1", isEditing ? "justify-end" : "sm:justify-between")}>
              {!isEditing ? (
                <>
                  <Button
                    variant="destructive"
                    size="sm"
                    key="remove-btn"
                    disabled={!url}
                    onClick={() => setConfirm(true)}
                  >
                    <Trash />
                    Remove
                  </Button>
                  <Button
                    variant="grey-outline"
                    size="sm"
                    onClick={() => setEditing((prev) => !prev)}
                    key="upload-btn"
                  >
                    <Camera />
                    Upload
                  </Button>
                </>
              ) : (
                <>
                  <Button variant="grey-outline" size="sm" key="cancel-btn" onClick={handleReset}>
                    Cancel
                  </Button>
                  {cropped ? (
                    <Button size="sm" key="save-btn" disabled={isLoading}>
                      {!isLoading ? <Save /> : <Loader2 className="animate-spin" />}
                      {isLoading ? "Saving..." : "Save changes"}
                    </Button>
                  ) : (
                    <Button size="sm" key="done-btn" disabled={!isCropReady} onClick={handleDone}>
                      <Check />
                      Done
                    </Button>
                  )}
                </>
              )}
            </DialogFooter>
          )}
        </DialogContent>
      </Dialog>
      <Dialog open={confirm} onOpenChange={(open) => setConfirm(open)} modal>
        <DialogContent onOpenAutoFocus={(e) => e.preventDefault()}>
          <DialogHeader>
            <DialogTitle className="font-inter text-base text-heading">Remove Profile Avatar?</DialogTitle>
            <DialogDescription className="font-inter text-paragraph">
              This action cannot be undone. Are you sure you want to permanently remove your profile avatar?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose asChild>
              <Button size="sm" key="cancel-btn" variant="grey-outline">Cancel</Button>
            </DialogClose>
            <Button size="sm" variant="destructive" key="confirm-btn" onClick={() => {
              setConfirm(false)
            }}>
              Remove
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
