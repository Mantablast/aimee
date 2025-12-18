let runtimeConfigPromise;

export async function getRuntimeConfig() {
  if (runtimeConfigPromise) return runtimeConfigPromise;

  runtimeConfigPromise = (async () => {
    try {
      const response = await fetch("/runtime-config.json", {
        cache: "no-store",
        headers: { Accept: "application/json" },
      });
      if (!response.ok) return null;
      const data = await response.json();
      if (!data || typeof data !== "object") return null;
      return data;
    } catch {
      return null;
    }
  })();

  return runtimeConfigPromise;
}

