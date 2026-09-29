import { useCallback, useState } from "react";
import { getStateInstance } from "../api/greenApi";
import { getErrorMessage, getStateMessage } from "../api/errors";
import type { Credentials } from "../api/types";

export function useAuth() {
  const [credentials, setCredentials] = useState<Credentials | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isAuthorized = credentials !== null;

  const login = useCallback(async (creds: Credentials) => {
    setIsLoading(true);
    setError(null);

    try {
      const { stateInstance } = await getStateInstance(creds);
      if (stateInstance !== "authorized") {
        setError(getStateMessage(stateInstance));
        return;
      }
      setCredentials(creds);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    setCredentials(null);
    setError(null);
  }, []);

  return { credentials, isAuthorized, isLoading, error, login, logout };
}
