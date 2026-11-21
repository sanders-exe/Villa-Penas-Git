import { useEffect, useState } from 'react';

type ResourceState<T> =
  | { status: 'loading' }
  | { status: 'ready'; data: T }
  | { status: 'error'; message: string };

export default function usePublicResource<T>(load: (signal: AbortSignal) => Promise<T>) {
  const [attempt, setAttempt] = useState(0);
  const [result, setResult] = useState<{ attempt: number; state: ResourceState<T> }>();
  const state: ResourceState<T> = result?.attempt === attempt ? result.state : { status: 'loading' };

  useEffect(() => {
    const controller = new AbortController();

    load(controller.signal)
      .then((data) => {
        if (!controller.signal.aborted) setResult({ attempt, state: { status: 'ready', data } });
      })
      .catch((error: unknown) => {
        if (controller.signal.aborted) return;
        const message = error instanceof Error ? error.message : 'La consulta falló. Intenta de nuevo.';
        setResult({ attempt, state: { status: 'error', message } });
      });

    return () => controller.abort();
  }, [attempt, load]);

  return [state, () => setAttempt((previous) => previous + 1)] as const;
}
