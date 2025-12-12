import axios from "@/lib/axios";
import type { PaginatedResponse } from "@/types/types";

function getUrl(url: string, params?: Record<string, unknown>): string {
  const stringifiedParams: Record<string, string> = {};

  if (params) {
    for (const key in params) {
      if (Object.hasOwn(params, key)) {
        const value = params[key];

        if (value !== null && value !== undefined) {
          stringifiedParams[key] = String(value);
        }
      }
    }
  }

  const query = new URLSearchParams(stringifiedParams).toString();

  return query ? `${url}?${query}` : url;
}

export async function getData<Response>(
  url: string,
  params?: Record<string, unknown>
): Promise<Response> {
  const finalUrl = getUrl(url, params);

  const res = await axios.get(finalUrl);

  return res.data;
}

export async function getPaginatedData<Response>(
  url: string,
  params?: Record<string, unknown>
): Promise<PaginatedResponse<Response>> {
  const finalUrl = getUrl(url, params);

  const res = await axios.get(finalUrl);

  if (Array.isArray(res.data)) {
    return {
      items: res.data,
      page: 1,
      limit: res.data.length,
      total: res.data.length,
      totalPages: 1,
    };
  }

  return res.data;
}

export async function postData<Response>(
  url: string,
  payload: unknown,
  params?: Record<string, unknown>
): Promise<Response> {
  const finalUrl = getUrl(url, params);

  const res = await axios.post(finalUrl, payload);

  return res.data;
}

export async function patchData<Response>(
  url: string,
  payload: unknown,
  params?: Record<string, unknown>
): Promise<Response> {
  const finalUrl = getUrl(url, params);

  const res = await axios.patch(finalUrl, payload);

  return res.data;
}

export async function deleteData<Response>(
  url: string,
  params?: Record<string, unknown>
): Promise<Response> {
  const finalUrl = getUrl(url, params);

  const res = await axios.delete(finalUrl);

  return res.data;
}
