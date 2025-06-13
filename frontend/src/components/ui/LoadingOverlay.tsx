import { Spinner } from "@/components/ui/Spinner";

export const LoadingOverlay = () => {
  return (
    <div className="absolute inset-0 z-10 flex items-center justify-center rounded-xl bg-black/30">
      <Spinner />
    </div>
  );
};
