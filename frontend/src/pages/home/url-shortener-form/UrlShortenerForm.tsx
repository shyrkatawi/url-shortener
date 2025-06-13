import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { date as zDate, object as zObject, string as zString } from "zod";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/Form";
import { Calendar } from "@/components/ui/Calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/Popover";
import { ChevronDownIcon } from "lucide-react";
import type { TUrlShortenerForm } from "@/pages/home/url-shortener-form/UrlShortenerForm.type";

const URL_MAX_LENGTH = 2048;
const ALIAS_MAX_LENGTH = 20;

const formSchema = zObject({
  url: zString()
    .max(URL_MAX_LENGTH, `Max length is ${URL_MAX_LENGTH} characters`)
    .url("Enter a valid URL"),
  alias: zString() //
    .max(ALIAS_MAX_LENGTH, `Max length is ${ALIAS_MAX_LENGTH} characters`)
    .optional(),
  expiresAt: zDate() //
    .optional(),
});

const getTomorrowDate = (): Date => {
  const date = new Date();
  date.setDate(date.getDate() + 1);
  return date;
};

const TOMORROW_DATE: Date = getTomorrowDate();

const FORM_DEFAULT_VALUES: TUrlShortenerForm = {
  url: "",
  alias: "",
  expiresAt: undefined,
} as const;

type Props = {
  defaultValues?: TUrlShortenerForm;
  onSubmit: (data: TUrlShortenerForm) => void;
};

export const UrlShortenerForm = ({ defaultValues, onSubmit }: Props) => {
  const form = useForm<TUrlShortenerForm>({
    defaultValues: defaultValues ?? FORM_DEFAULT_VALUES,
    resolver: zodResolver(formSchema),
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="url"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Enter link here</FormLabel>
              <FormControl>
                <Input placeholder="https://example.com/some-link" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="alias"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Custom alias (optional)</FormLabel>
              <FormControl>
                <Input placeholder="my-custom-alias" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="expiresAt"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Expiration Date (optional)</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <Button className="w-48 justify-between font-normal" id="date" variant="outline">
                    {field.value ? field.value.toLocaleDateString() : "Select date"}
                    <ChevronDownIcon />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto overflow-hidden p-0" align="start">
                  <Calendar
                    captionLayout="dropdown"
                    disabled={{ before: TOMORROW_DATE }}
                    mode="single"
                    onSelect={field.onChange}
                    selected={field.value}
                    timeZone="UTC"
                  />
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full">
          Shorten URL
        </Button>
      </form>
    </Form>
  );
};
