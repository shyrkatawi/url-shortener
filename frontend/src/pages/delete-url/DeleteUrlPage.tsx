import { useState } from "react";
import { createLazyRoute } from "@tanstack/react-router";
import { LoadingOverlay } from "@/components/ui/LoadingOverlay";
import { Card, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useDeleteUrl } from "@/pages/delete-url/useDeleteUrl";

export const DeleteUrlPage = () => {
  const [alias, setAlias] = useState<string>("");
  const [lastAlias, setLastAlias] = useState<string>("");

  const { isSuccess, error, isPending, mutate: deleteUrl } = useDeleteUrl();

  const handleUrlDelete = (): void => {
    deleteUrl(alias);
    setLastAlias(alias);
  };

  return (
    <div className="mx-auto mt-10 max-w-xl p-4">
      <h1 className="mb-4 text-center text-2xl font-bold">Delete url</h1>
      <Card className="relative mx-auto mt-6 max-w-md">
        {isPending && <LoadingOverlay />}
        <CardContent className="space-y-4 p-6">
          <Input
            type="text"
            placeholder="Enter alias"
            value={alias}
            onChange={(e) => setAlias(e.target.value)}
          />

          <Button disabled={isPending} className="w-full" onClick={handleUrlDelete}>
            Delete url
          </Button>

          {error && (
            <div className="text-center">
              <p className="text-red-600">Error: {error.message}</p>
            </div>
          )}

          {isSuccess && (
            <div className="text-center">
              <p className="text-green-600">
                Url with alias "{lastAlias}" was successfully deleted
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export const Route = createLazyRoute("/delete-url")({
  component: DeleteUrlPage,
});
