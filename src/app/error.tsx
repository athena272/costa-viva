"use client";

import { useRouter } from "next/navigation";
import { useEffect, useTransition } from "react";

interface ErrorPageProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function ErrorPage({ error, reset }: ErrorPageProps) {
  const router = useRouter();
  const [isRetrying, startRetry] = useTransition();

  useEffect(() => {
    console.error(error);
  }, [error]);

  function retry() {
    startRetry(() => {
      router.refresh();
      reset();
    });
  }

  return (
    <main className="app-main app-main-single">
      <section className="panel status-message" role="alert">
        <h2>Não foi possível carregar as zonas críticas</h2>
        <p>Algo deu errado ao buscar os dados. Tente novamente em instantes.</p>
        <button type="button" className="button" onClick={retry} disabled={isRetrying}>
          {isRetrying ? "Tentando novamente..." : "Tentar novamente"}
        </button>
      </section>
    </main>
  );
}
