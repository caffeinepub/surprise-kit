import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Image, X } from "lucide-react";
import { useRef, useState } from "react";
import { toast } from "sonner";
import { useUpload } from "../../hooks/useUpload";

const MAX_CHARS = 500;
const MAX_IMAGE_BYTES = 5 * 1024 * 1024;

interface Props {
  message: string;
  photoUrl: string;
  onChange: (message: string, photoUrl?: string) => void;
}

export default function MessageComposer({
  message,
  photoUrl,
  onChange,
}: Props) {
  const fileRef = useRef<HTMLInputElement>(null);
  const { upload, isUploading, uploadProgress } = useUpload();
  const [isDragging, setIsDragging] = useState(false);

  const handleFile = async (file: File) => {
    if (!file.type.startsWith("image/")) {
      toast.error("Please upload an image file");
      return;
    }
    if (file.size > MAX_IMAGE_BYTES) {
      toast.error("Image must be under 5MB");
      return;
    }
    try {
      const url = await upload(file);
      onChange(message, url);
      toast.success("Photo uploaded!");
    } catch {
      toast.error("Upload failed. Please try again.");
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  return (
    <div>
      <h2 className="font-display text-2xl font-bold mb-1">
        Write Your Message
      </h2>
      <p className="text-muted-foreground text-sm mb-6">
        Pour your heart into a personal note.
      </p>

      <div className="space-y-5">
        <div>
          <Label
            htmlFor="msg-input"
            className="text-sm font-semibold mb-2 block"
          >
            Personal Message
          </Label>
          <Textarea
            id="msg-input"
            value={message}
            onChange={(e) =>
              onChange(
                e.target.value.slice(0, MAX_CHARS),
                photoUrl || undefined,
              )
            }
            placeholder="Hey! I made this just for you because you\u2019re absolutely amazing..."
            className="min-h-[140px] rounded-xl resize-none text-sm"
            data-ocid="message.textarea"
          />
          <div className="flex justify-end mt-1">
            <span
              className={`text-xs ${message.length >= MAX_CHARS ? "text-destructive" : "text-muted-foreground"}`}
            >
              {message.length}/{MAX_CHARS}
            </span>
          </div>
        </div>

        <div>
          <Label className="text-sm font-semibold mb-2 block">
            Add a Photo
          </Label>
          {photoUrl ? (
            <div className="relative rounded-xl overflow-hidden border border-border">
              <img
                src={photoUrl}
                alt="Your personalised kit"
                className="w-full object-cover max-h-56"
              />
              <Button
                size="icon"
                variant="destructive"
                className="absolute top-2 right-2 w-7 h-7 rounded-full"
                onClick={() => onChange(message, "")}
                data-ocid="message.delete_button"
              >
                <X className="w-3.5 h-3.5" />
              </Button>
            </div>
          ) : (
            <button
              type="button"
              onDragOver={(e) => {
                e.preventDefault();
                setIsDragging(true);
              }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleDrop}
              className={`w-full border-2 border-dashed rounded-xl p-8 text-center transition-colors cursor-pointer ${isDragging ? "border-primary bg-accent/20" : "border-border hover:border-primary/50"}`}
              onClick={() => fileRef.current?.click()}
              data-ocid="message.dropzone"
            >
              {isUploading ? (
                <div>
                  <div className="text-3xl mb-2">📤</div>
                  <p className="text-sm font-medium">
                    Uploading... {uploadProgress}%
                  </p>
                  <div className="mt-2 w-full bg-border rounded-full h-1.5">
                    <div
                      className="bg-primary h-1.5 rounded-full transition-all"
                      style={{ width: `${uploadProgress}%` }}
                    />
                  </div>
                </div>
              ) : (
                <>
                  <Image className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                  <p className="text-sm font-medium text-muted-foreground">
                    Drag & drop or click to upload
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    PNG, JPG, GIF • Max 5MB
                  </p>
                </>
              )}
            </button>
          )}
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) handleFile(f);
            }}
            data-ocid="message.upload_button"
          />
        </div>
      </div>
    </div>
  );
}
