import { Image, UploadSimple } from "phosphor-react";
import { resolveUploadUrl } from "../../../utils/uploads";

const inputClasses =
  "w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder-slate-500 outline-none transition-all duration-300 focus:border-amber-500/60 focus:bg-white/10 focus:shadow-[0_0_14px_rgba(212,175,55,0.22)]";

const ImageUploadField = ({
  label,
  value,
  onChange,
  uploadMutation,
  folder = "website",
}) => {
  const handleFileChange = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const result = await uploadMutation.mutateAsync({ folder, file });
    onChange(result.fileUrl);
    event.target.value = "";
  };

  const resolvedUrl = resolveUploadUrl(value);

  return (
    <div className="space-y-2">
      <label className="block text-xs font-medium text-slate-400">{label}</label>
      <input
        value={value || ""}
        onChange={(event) => onChange(event.target.value)}
        className={inputClasses}
        placeholder="https://..."
        dir="ltr"
      />
      <div className="flex flex-col gap-2 md:flex-row md:items-center">
        <label className="theme-button-white inline-flex cursor-pointer items-center justify-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold">
          <UploadSimple size={15} weight="bold" />
          {uploadMutation.isPending ? "جاري الرفع..." : "رفع صورة"}
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
            disabled={uploadMutation.isPending}
          />
        </label>
        {resolvedUrl ? (
          <a
            href={resolvedUrl}
            target="_blank"
            rel="noreferrer"
            className="text-xs text-emerald-400 hover:text-emerald-300"
          >
            فتح الصورة
          </a>
        ) : (
          <span className="text-xs text-slate-500">
            ارفع صورة أو ألصق الرابط يدويًا
          </span>
        )}
      </div>
      <div className="overflow-hidden rounded-xl border border-white/10 bg-slate-950/40">
        {resolvedUrl ? (
          <img src={resolvedUrl} alt={label} className="h-24 w-full object-cover" />
        ) : (
          <div className="flex h-24 items-center justify-center text-slate-500">
            <Image size={22} />
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageUploadField;
