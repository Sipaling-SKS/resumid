import React, {
  useState,
  useCallback,
  useImperativeHandle,
  forwardRef,
  useEffect,
} from "react"
import Cropper from "react-easy-crop"
import { useDropzone } from "react-dropzone"
import { Slider } from "@/components/ui/slider"
import { cn } from "@/lib/utils"

export interface PhotoUploadCropRef {
  cropImage: () => Promise<string | null>
}

interface PhotoUploadCropProps {
  aspect?: number
  onCropReady?: (ready: boolean) => void
}

const PhotoUploadCrop = forwardRef<PhotoUploadCropRef, PhotoUploadCropProps>(
  ({ aspect = 1, onCropReady }, ref) => {
    const [imageSrc, setImageSrc] = useState<string | null>(null)
    const [crop, setCrop] = useState({ x: 0, y: 0 })
    const [zoom, setZoom] = useState(1)
    const [rotation, setRotation] = useState(0)
    const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null)

    const onDrop = useCallback((acceptedFiles: File[]) => {
      if (acceptedFiles.length === 0) return
      const file = acceptedFiles[0]
      const reader = new FileReader()
      reader.onload = () => setImageSrc(reader.result as string)
      reader.readAsDataURL(file)
    }, [])

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
      accept: { "image/*": [] },
      onDrop,
    })

    const onCropComplete = useCallback((_: any, croppedPixels: any) => {
      setCroppedAreaPixels(croppedPixels)
    }, [])

    // --- New helper functions from your code ---
    const createImage = useCallback((url: string): Promise<HTMLImageElement> => {
      return new Promise((resolve, reject) => {
        const image = new Image()
        image.addEventListener("load", () => resolve(image))
        image.addEventListener("error", (error) => reject(error))
        image.setAttribute("crossOrigin", "anonymous")
        image.src = url
      })
    }, [])

    const getRadianAngle = (degreeValue: number) => (degreeValue * Math.PI) / 180

    const rotateSize = (width: number, height: number, rotation: number) => {
      const rotRad = getRadianAngle(rotation)
      return {
        width: Math.abs(Math.cos(rotRad) * width) + Math.abs(Math.sin(rotRad) * height),
        height: Math.abs(Math.sin(rotRad) * width) + Math.abs(Math.cos(rotRad) * height),
      }
    }

    const getCroppedImg = useCallback(
      async (
        imageSrc: string,
        pixelCrop: { x: number; y: number; width: number; height: number },
        rotation = 0,
        flip = { horizontal: false, vertical: false }
      ): Promise<string | null> => {
        const image = await createImage(imageSrc)
        const canvas = document.createElement("canvas")
        const ctx = canvas.getContext("2d")
        if (!ctx) return null

        const rotRad = getRadianAngle(rotation)
        const { width: bBoxWidth, height: bBoxHeight } = rotateSize(
          image.width,
          image.height,
          rotation
        )

        canvas.width = bBoxWidth
        canvas.height = bBoxHeight

        ctx.translate(bBoxWidth / 2, bBoxHeight / 2)
        ctx.rotate(rotRad)
        ctx.scale(flip.horizontal ? -1 : 1, flip.vertical ? -1 : 1)
        ctx.translate(-image.width / 2, -image.height / 2)
        ctx.drawImage(image, 0, 0)

        const croppedCanvas = document.createElement("canvas")
        const croppedCtx = croppedCanvas.getContext("2d")
        if (!croppedCtx) return null

        croppedCanvas.width = pixelCrop.width
        croppedCanvas.height = pixelCrop.height

        croppedCtx.drawImage(
          canvas,
          pixelCrop.x,
          pixelCrop.y,
          pixelCrop.width,
          pixelCrop.height,
          0,
          0,
          pixelCrop.width,
          pixelCrop.height
        )

        return new Promise((resolve, reject) => {
          croppedCanvas.toBlob((file) => {
            if (file) resolve(URL.createObjectURL(file))
            else reject(new Error("Failed to create blob"))
          }, "image/jpeg")
        })
      },
      [createImage]
    )

    const cropImage = useCallback(async (): Promise<string | null> => {
      if (!imageSrc || !croppedAreaPixels) return null
      return getCroppedImg(imageSrc, croppedAreaPixels, rotation)
    }, [imageSrc, croppedAreaPixels, rotation, getCroppedImg])

    useImperativeHandle(ref, () => ({
      cropImage,
    }))

    useEffect(() => {
      onCropReady?.(!!imageSrc)
    }, [imageSrc, onCropReady])

    return (
      <div className="w-full flex flex-col items-center gap-4">
        {!imageSrc ? (
          <div
            {...getRootProps()}
            className={cn(
              "border-2 border-dashed rounded-lg w-full h-32 flex items-center justify-center cursor-pointer",
              isDragActive ? "bg-muted/30" : "bg-muted/10"
            )}
          >
            <input {...getInputProps()} />
            <p className="text-sm text-muted-foreground">
              {isDragActive ? "Drop image here..." : "Drag & drop or click to upload"}
            </p>
          </div>
        ) : (
          <>
            <div
              className="relative w-full bg-black/70 rounded-lg overflow-hidden"
              style={{ aspectRatio: `${aspect}` }}
            >
              <Cropper
                image={imageSrc}
                crop={crop}
                zoom={zoom}
                rotation={rotation}
                aspect={aspect}
                onCropChange={setCrop}
                onZoomChange={setZoom}
                onRotationChange={setRotation}
                onCropComplete={onCropComplete}
                objectFit="contain"
              />
            </div>

            <div className="w-full flex flex-col gap-4">
              <div className="flex-1">
                <p className="text-sm font-inter text-paragraph mb-2">Zoom ({zoom.toFixed(2)}x)</p>
                <Slider
                  value={[zoom]}
                  min={1}
                  max={3}
                  step={0.01}
                  color="red"
                  onValueChange={([v]) => setZoom(v)}
                />
              </div>
              <div className="flex-1">
                <p className="text-sm font-inter text-paragraph mb-2">
                  Rotate ({rotation.toFixed(0)}°)
                </p>
                <Slider
                  value={[rotation]}
                  min={-180}
                  max={180}
                  step={1}
                  color="red"
                  onValueChange={([v]) => setRotation(v)}
                />
                <div className="flex justify-between text-xs text-muted-foreground mt-1">
                  <span>-180°</span>
                  <span>0°</span>
                  <span>180°</span>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    )
  }
)

PhotoUploadCrop.displayName = "PhotoUploadCrop"
export default PhotoUploadCrop
