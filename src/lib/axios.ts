import baseAxios, { type AxiosError } from "axios";
import { toast } from "sonner";
import {
  type ApiErrorResponse,
  parseBackendError,
  type ZodErrorResponse,
} from "@/types/api-errors";

const axios = baseAxios.create({
  timeout: 10_000,
});

axios.interceptors.response.use(
  (response) => response,
  (error: AxiosError<ApiErrorResponse | ZodErrorResponse>) => {
    let message = "";

    if (error.response?.data) {
      message = parseBackendError(error.response.data);
    } else if (error.request) {
      message = "Помилка мережі: Сервер не відповідає.";
    } else {
      message = error.message;
    }

    toast.error(message);

    return Promise.reject(new Error(message));
  }
);

export default axios;
