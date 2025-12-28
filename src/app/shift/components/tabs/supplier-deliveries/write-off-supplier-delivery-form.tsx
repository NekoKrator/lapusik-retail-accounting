"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldGroup, FieldSet } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/ui/spinner";
import {
  type SupplierDeliveryWriteOffInput,
  SupplierDeliveryWriteOffSchema,
} from "@/schemas/supplier-delivery/supplier-delivery-schema";

type WriteOffDeliveryFormProps = {
  onWriteOff: (payload: SupplierDeliveryWriteOffInput) => Promise<void>;
  currentDebt: number;
};

export function WriteOffSupplierDeliveryForm({
  onWriteOff,
  currentDebt,
}: WriteOffDeliveryFormProps) {
  const {
    formState: { isSubmitting, isSubmitSuccessful },
    reset,
    handleSubmit,
    control,
  } = useForm<SupplierDeliveryWriteOffInput>({
    resolver: zodResolver(SupplierDeliveryWriteOffSchema(currentDebt)),
  });

  useEffect(() => {
    if (isSubmitSuccessful) {
      reset();
    }
  }, [isSubmitSuccessful, reset]);

  return (
    <form onSubmit={handleSubmit((payload) => onWriteOff(payload))}>
      <FieldSet>
        <FieldGroup>
          <Controller
            control={control}
            name="paidByCashier"
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <Label htmlFor="paidByCashier">Сума сплати касиром</Label>
                <Input
                  {...field}
                  aria-invalid={fieldState.invalid}
                  disabled={isSubmitting}
                  id="paidByCashier"
                  placeholder="0,00"
                  type="number"
                  value={field.value ?? ""}
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          <Controller
            control={control}
            name="paidByOwner"
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <Label htmlFor="paidByOwner">Сума сплати власником</Label>
                <Input
                  {...field}
                  aria-invalid={fieldState.invalid}
                  disabled={isSubmitting}
                  id="paidByOwner"
                  placeholder="0,00"
                  type="number"
                  value={field.value ?? ""}
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          <Field className="justify-end" orientation="horizontal">
            <Button
              className="relative bg-blue-600 hover:bg-blue-700 has-[>svg]:px-4"
              disabled={isSubmitting}
              type="submit"
            >
              <span className={isSubmitting ? "invisible" : "visible"}>
                Погасити борг
              </span>
              {isSubmitting && (
                <Spinner className="-translate-x-1/2 -translate-y-1/2 absolute top-1/2 left-1/2" />
              )}
            </Button>
          </Field>
        </FieldGroup>
      </FieldSet>
    </form>
  );
}
