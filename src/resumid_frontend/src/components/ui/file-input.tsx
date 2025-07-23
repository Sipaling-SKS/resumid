import { useEffect, useState } from "react";
import { cn } from "@/lib/utils"
import { FolderUp, FileCheck, X as Remove, CheckCircle2 as Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/useToast"

interface FileInputProps {
  onFileSelected: (file: File) => void;
  file: File | null;
  setFile: (file: File | null) => void;
}

function FileInput({ onFileSelected, file, setFile }: FileInputProps) {
  const handleFileChange = (e: React.FormEvent<HTMLInputElement>) => {
    e.preventDefault();
    const selectedFiles = e.currentTarget.files;

    console.log(selectedFiles)

    if (selectedFiles && selectedFiles.length > 0) {
      const newFiles: File[] = Array.from(selectedFiles);
      setFile(newFiles[0]);
    }
  };

  const handleFileDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const droppedFiles = e.dataTransfer.items;
    
    if (droppedFiles.length > 0) {
      const newFile = droppedFiles[0]

      if (newFile.type === "application/pdf") {
        setFile(newFile.getAsFile())
      } else {
        toast({
          variant: "destructive",
          title: "File Not Supported.",
          description: "You're trying to upload unsupported file.",
        })
      }
    }
  }

  const handleRemoveFile = () => {
    setFile(null);
  };

  useEffect(() => {
    if (file) {
      onFileSelected(file);
    }
  }, [file]);

  return (
    <section
      className="relative flex flex-col gap-4 md:gap-6 items-center p-6 md:p-8 rounded-lg outline-dashed outline-2 outline-primary-500"
      onDrop={handleFileDrop}
      onDragOver={(e) => e.preventDefault()}
    >
      {file && <Remove onClick={handleRemoveFile} className="cursor-pointer text-primary-500 absolute top-3 right-3 md:top-4 md:right-4" />}
      {!file ? (
        <>
          <FolderUp className="text-primary-500" size={64} strokeWidth={1.5} />
          <p className="font-inter text-paragraph font-semibold">Drag and Drop Here</p>
        </>
      ) : (
        <>
          <FileCheck className="text-primary-500" size={64} strokeWidth={1.5} />
          <div className="inline-flex items-center gap-1">
            <Check className="text-green-500" />
            <p className="font-inter text-paragraph text-center w-fit">{file.name}</p>
          </div>
        </>
      )}
      <input
        type="file"
        hidden
        id="browse"
        onChange={handleFileChange}
        accept=".pdf"
      />
      <Button className="cursor-pointer" asChild>
        <label htmlFor="browse">
          Browse files
        </label>
      </Button>
    </section>
  )
}
FileInput.displayName = "FileInput"

export { FileInput }
