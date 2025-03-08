"use client";

import InitialModal from "@/components/modals/initial-modal";
import { useAuth } from "@/hooks/use-auth";
import { useRouter } from "next/navigation";

const SetupPage = () => {
  const router = useRouter();
  const { profile, loading } = useAuth();

  if (!profile && !loading) {
    router.push("/login");
    return null;
  }

  return <InitialModal />;
};

export default SetupPage;
