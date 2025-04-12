import { AxiosError } from 'axios';
import { toast } from 'react-toastify';

export default function logError(error: any) {
  console.error(error);

  if (error instanceof AxiosError) {
    toast.error(error.response?.data.message || error.message);
  } else {
    toast.error(`${error}`);
  }
}
