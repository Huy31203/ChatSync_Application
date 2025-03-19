import { AxiosError } from 'axios';
import { toast } from 'react-toastify';

export const BE_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8080/api';

export default function logError(error: any) {
  console.error(error);

  if (error instanceof AxiosError) {
    toast.error(error.response?.data.message || error.message);
  } else {
    toast.error(`${error}`);
  }
}
