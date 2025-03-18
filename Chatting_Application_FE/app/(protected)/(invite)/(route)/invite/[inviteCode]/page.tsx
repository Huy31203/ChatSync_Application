import { redirect } from 'next/navigation';

import { API_URL } from '@/constants/endpoint';
import http from '@/libs/http';
import { ApiResponse, IServer } from '@/types';

interface InviteCodePageProps {
  params: {
    inviteCode: string;
  };
}
const InviteCodePage = async ({ params }: InviteCodePageProps) => {
  if (!params.inviteCode) return redirect('/');

  const res = await http.patch<IServer>(`${API_URL.SERVERS}/join/${params.inviteCode}`);
  const payload = res.payload as ApiResponse<IServer>;

  console.log(payload);

  if (!payload.result) return redirect('/');

  redirect(`/servers/${payload.result.id}?new=true`);
};

export default InviteCodePage;
