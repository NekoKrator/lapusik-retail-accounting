"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Plus } from "lucide-react";
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import type z from "zod";
import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldGroup, FieldSet } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import type { Supplier } from "@/generated/prisma/client";
import {
  type SupplierCreateInput,
  SupplierCreateSchema,
} from "@/schemas/supplier-schema";

type CreateSupplierFormProps = {
  onCreate: (data: SupplierCreateInput) => Promise<Supplier>;
};

export function CreateSupplierForm({ onCreate }: CreateSupplierFormProps) {
  const {
    formState: { isSubmitting, isSubmitSuccessful },
    reset,
    handleSubmit,
    control,
  } = useForm<z.infer<typeof SupplierCreateSchema>>({
    resolver: zodResolver(SupplierCreateSchema),
    defaultValues: {
      name: "",
    },
  });

  useEffect(() => {
    if (isSubmitSuccessful) {
      reset();
    }
  }, [isSubmitSuccessful, reset]);

  return (
    <form onSubmit={handleSubmit(onCreate)}>
      <FieldSet>
        <FieldGroup className="grid grid-cols-1 gap-3 lg:grid-cols-3">
          <Controller
            control={control}
            name="name"
            render={({ field, fieldState }) => (
              <Field className="col-span-2" data-invalid={fieldState.invalid}>
                <Input
                  {...field}
                  aria-invalid={fieldState.invalid}
                  id="name"
                  placeholder="Назва постачальника"
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          <Field>
            <Button
              className="relative bg-blue-600 has-[>svg]:px-4"
              disabled={isSubmitting}
              type="submit"
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
