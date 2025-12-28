"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { Plus } from "lucide-react";
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import type z from "zod";
import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldGroup, FieldSet } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/ui/spinner";
import { useCreateSupplier } from "@/hooks/api/supplier/use-create-supplier";
import { API_ENDPOINTS } from "@/lib/constants/api-endpoints";
import {
  type SupplierCreateInput,
  SupplierCreateSchema,
} from "@/schemas/supplier/supplier-schema";

export function CreateSupplierForm() {
  const { mutateAsync: createSupplier } = useCreateSupplier();
  const queryClient = useQueryClient();

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

  const onSubmit = async (payload: SupplierCreateInput) => {
    await createSupplier(payload);
    queryClient.invalidateQueries({ queryKey: [API_ENDPOINTS.SUPPLIER] });
    toast.success("Постачальника успішно створено!");
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <FieldSet>
        <FieldGroup className="">
          <Controller
            control={control}
            name="name"
            render={({ field, fieldState }) => (
              <Field className="col-span-2" data-invalid={fieldState.invalid}>
                <Label>Назва*</Label>
                <Input
                  {...field}
                  aria-invalid={fieldState.invalid}
                  id="name"
                  placeholder="Назва"
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          <Field>
            <Button
              className="has-[>svg]:px-4"
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
