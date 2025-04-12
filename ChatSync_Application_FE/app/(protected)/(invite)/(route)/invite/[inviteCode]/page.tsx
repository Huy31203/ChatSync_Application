import { redirect } from 'next/navigation';

import { API_URL } from '@/constants/endpoint';
import http from '@/lib/http';
import { ApiResponse, IServer } from '@/types';

interface InviteCodePageProps {
  params: {
    inviteCode: string;
  };
}
const InviteCodePage = async ({ params }: InviteCodePageProps) => {
  const { inviteCode } = await params;
  if (!inviteCode) return redirect('/');

  const res = await http.patch<IServer>(`${API_URL.SERVERS}/join/${inviteCode}`);
  const payload = res.payload as ApiResponse<IServer>;

  if (!payload.result) return redirect('/');

  redirect(`/servers/${payload.result.id}?new=true`);
};

export default InviteCodePage;
