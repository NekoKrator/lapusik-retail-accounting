"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Plus } from "lucide-react";
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldGroup, FieldSet } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/ui/spinner";
import { useCreateSupplierDelivery } from "@/hooks/api/supplier-deliveries/use-create-supplier-delivery";
import {
  type SupplierDeliveryCreateInput,
  SupplierDeliveryCreateSchema,
} from "@/schemas/supplier-delivery-schema";
import SupplierPicker from "./supplier-picker";

type CreateDeliveryFormProps = {
  isLoading: boolean;
};

export function CreateSupplierDeliveryForm({
  isLoading,
}: CreateDeliveryFormProps) {
  const { mutateAsync: createSupplierDelivery } = useCreateSupplierDelivery();

  const {
    formState: { isSubmitting, isSubmitSuccessful },
    reset,
    handleSubmit,
    control,
  } = useForm<SupplierDeliveryCreateInput>({
    resolver: zodResolver(SupplierDeliveryCreateSchema),
  });

  useEffect(() => {
    if (isSubmitSuccessful) {
      reset();
    }
  }, [isSubmitSuccessful, reset]);

  const onSubmit = async (payload: SupplierDeliveryCreateInput) => {
    const res = await createSupplierDelivery(payload);

    if (res.paidByCashier) {
      toast.success("Поставку успішно створено!", {
        description: `Створено витрату на ${res.paidByCashier} ₴.`,
      });
    } else {
      toast.success("Поставку успішно створено!");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <FieldSet>
        <FieldGroup className="grid grid-cols-1 gap-3 lg:grid-cols-3">
          <Controller
            control={control}
            name="supplier"
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <Label htmlFor="supplier">Постачальник*</Label>
                <SupplierPicker {...field} disabled={isLoading} />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}{" "}
              </Field>
            )}
          />

          <Controller
            control={control}
            name="price"
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <Label htmlFor="price">Ціна поставки*</Label>
                <Input
                  {...field}
                  aria-invalid={fieldState.invalid}
                  disabled={isLoading}
                  id="price"
                  placeholder="0,00"
                  type="number"
                  value={field.value ?? ""}
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}{" "}
              </Field>
            )}
          />

          <Field>
            <Label className="text-card">.</Label>
            <Button
              className="border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-primary-foreground has-[>svg]:px-4 dark:border-blue-600 dark:hover:bg-blue-600"
              disabled={isLoading || isSubmitting}
              type="submit"
              variant="outline"
            >
              {isSubmitting ? (
                <Spinner />
              ) : (
                <>
                  <Plus />
                  <div>Додати</div>
                </>
              )}
            </Button>
          </Field>
        </FieldGroup>
      </FieldSet>
    </form>
  );
}
