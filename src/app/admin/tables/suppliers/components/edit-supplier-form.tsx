import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import type { Dispatch, SetStateAction } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import type z from "zod";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldSet,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { API_ENDPOINTS } from "@/lib/constants/api-endpoints";
import type { SupplierUpdateResult } from "@/modules/supplier/contracts";
import {
  type SupplierStats,
  type SupplierUpdateInput,
  SupplierUpdateSchema,
} from "@/schemas/supplier/supplier-schema";

type EditSupplierFormProps = {
  initialData: SupplierStats;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  onUpdate: (payload: SupplierUpdateInput) => Promise<SupplierUpdateResult>;
};

export function EditSupplierForm({
  initialData,
  setIsOpen,
  onUpdate,
}: EditSupplierFormProps) {
  const queryClient = useQueryClient();

  const form = useForm<z.infer<typeof SupplierUpdateSchema>>({
    resolver: zodResolver(SupplierUpdateSchema),
    defaultValues: {
      name: initialData?.name,
    },
  });

  const isLoading = form.formState.isSubmitting;
  const onSubmit = async (data: z.infer<typeof SupplierUpdateSchema>) => {
    try {
      await onUpdate(data);
      queryClient.invalidateQueries({ queryKey: [API_ENDPOINTS.SUPPLIER] });
      toast.success("Постачальника успішно оновлено!");
      setIsOpen(false);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      <FieldSet>
        <FieldGroup>
          <Controller
            control={form.control}
            name="name"
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="name">Назва</FieldLabel>
                <Input {...field} aria-invalid={fieldState.invalid} id="name" />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          <Field className="justify-end" orientation="horizontal">
            <Button
              onClick={() => setIsOpen(false)}
              type="button"
              variant="outline"
            >
              Скасувати
            </Button>
            <Button
              className="relative has-[>svg]:px-4"
              disabled={isLoading}
              type="submit"
            >
              <span className={isLoading ? "invisible" : "visible"}>
                Зберегти
              </span>
              {isLoading && (
                <Spinner className="-translate-x-1/2 -translate-y-1/2 absolute top-1/2 left-1/2" />
              )}
            </Button>
          </Field>
        </FieldGroup>
      </FieldSet>
    </form>
  );
}
