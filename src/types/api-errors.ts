export type ApiErrorResponse = {
  error: string;
};

export type ZodErrorResponse = {
  error: {
    formErrors?: string[];
    fieldErrors?: Record<string, string[]>;
  };
};

const isApiError = (data: unknown): data is ApiErrorResponse =>
  typeof (data as ApiErrorResponse)?.error === "string";

const isZodError = (data: unknown): data is ZodErrorResponse => {
  const d = data as ZodErrorResponse;
  return (
    Array.isArray(d?.error.formErrors) ||
    typeof d?.error.fieldErrors === "object"
  );
};

export const parseBackendError = (data: unknown): string => {
  if (isApiError(data)) {
    return data.error;
  }

  if (isZodError(data)) {
    const error = data.error;
    const messages: string[] = [];

    if (error.formErrors?.length) {
      messages.push(...error.formErrors);
    }

    if (error.fieldErrors) {
      for (const [field, errors] of Object.entries(error.fieldErrors)) {
        const capitalizedField = field.charAt(0).toUpperCase() + field.slice(1);
        messages.push(`${capitalizedField}: ${errors.join(", ")}`);
      }
    }

    return messages.join("\n");
  }

  return "Сталася неочікувана помилка";
};
