"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

export default function Protect({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    const token =
      localStorage.getItem("username") ||
      localStorage.getItem("email") ||
      localStorage.getItem("name");

    if (!token) {
      toast.error("Please Login To Access Dashboard");
      router.replace("/login");
    } else {
      setAuthorized(true);
    }
  }, [router]);

  if (!authorized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f8fafc]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-9 h-9 border-4 border-[#166534] border-t-transparent rounded-full animate-spin" />
          <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Verifying Admin Session...
          </p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}