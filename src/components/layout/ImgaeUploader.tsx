import { ImageUp } from "lucide-react";

type ImgaeUploaderProps = {
  label?: string;
};

export default function ImgaeUploader({
  label = "Bild",
}: ImgaeUploaderProps): JSX.Element {
  return (
    <>
      <div className="flex flex-col items-center justify-center w-full h-full min-h-24 border-2 border-dashed border-gray-300 rounded-md cursor-pointer text-[var(--primary-600)]">
        <ImageUp strokeWidth={1.5} />
        <span className="text-sm">{label}</span>
      </div>
    </>
  );
}
