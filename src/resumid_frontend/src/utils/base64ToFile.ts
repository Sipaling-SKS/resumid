export function base64ToFile(base64: string, filename?: string): File {
  const arr = base64.split(",");
  const mime = arr[0].match(/:(.*?);/)?.[1] || "image/png";
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }

  const ext = mime.split("/")[1] || "png";
  const randomName =
    filename || `${Date.now()}_${Math.random().toString(36).slice(2)}.${ext}`;

  return new File([u8arr], randomName, { type: mime });
}
