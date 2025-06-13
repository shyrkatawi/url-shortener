import type { VariantProps } from "class-variance-authority";
import { cva } from "class-variance-authority";
import { Loader2 } from "lucide-react";

const loaderVariants = cva("animate-spin text-primary", {
  variants: {
    size: {
      small: "size-6",
      medium: "size-8",
      large: "size-12",
    },
  },
  defaultVariants: {
    size: "medium",
  },
});

type Props = VariantProps<typeof loaderVariants>;

export function Spinner({ size }: Props) {
  return <Loader2 className={loaderVariants({ size })} />;
}
