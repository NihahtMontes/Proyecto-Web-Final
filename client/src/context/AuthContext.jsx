import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import { authAPI } from "../services/api";

const AuthContext =
  createContext();

export function AuthProvider({
  children,
}) {
  const [user, setUser] =
    useState(null);

  const [token, setToken] =
    useState(
      localStorage.getItem(
        "token"
      )
    );

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    const restoreSession =
      async () => {
        try {
          const savedToken =
            localStorage.getItem(
              "token"
            );

          if (!savedToken) {
            setLoading(false);
            return;
          }

          const response =
            await authAPI.getMe();

          setUser(
            response.data
          );
        } catch (error) {
          console.error(
            error
          );

          localStorage.removeItem(
            "token"
          );

          setUser(null);
        } finally {
          setLoading(false);
        }
      };

    restoreSession();
  }, []);

  const login = async (
    email,
    password
  ) => {
    const response =
      await authAPI.login({
        email,
        password,
      });

    const token =
      response.data.token;

    const user =
      response.data.user;

    localStorage.setItem(
      "token",
      token
    );

    setToken(token);
    setUser(user);

    return response.data;
  };

  const register =
    async (
      name,
      email,
      password
    ) => {
      const response =
        await authAPI.register({
          name,
          email,
          password,
        });

      const token =
        response.data.token;

      const user =
        response.data.user;

      localStorage.setItem(
        "token",
        token
      );

      setToken(token);
      setUser(user);

      return response.data;
    };

  const logout = () => {
    localStorage.removeItem(
      "token"
    );

    setToken(null);
    setUser(null);
  };

  const value = {
    user,
    token,
    loading,
    login,
    register,
    logout,
  };

  return (
    <AuthContext.Provider
      value={value}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(
    AuthContext
  );
}