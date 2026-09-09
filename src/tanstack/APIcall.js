import { useMutation, useQuery } from "@tanstack/react-query";
import { supabase } from "../supabase/supabase.js";

export const getLoggedInUser = () => {
  return useQuery({
    queryKey: ["loggedInUser"],
    queryFn: async () => {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();

      if (error) {
        throw new Error(error.message);
      }

      return user;
    },
  });
};

export const useLogin = () => {
  return useMutation({
    mutationFn: async ({ email, password }) => {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        throw error;
      }

      return data;
    },
  });
};

export const usersignup = () => {
  return useMutation({
    mutationFn: async ({ email, password }) => {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) {
        throw error;
      }

      return data;
    },
  });
};

export const Userdata = (userId) => {
  return useQuery({
    queryKey: ["userdata", userId],
    enabled: !!userId,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("userprofile")
        .select("*")
        .eq("id", userId)
        .maybeSingle();

      if (error) {
        throw new Error(error.message);
      }

      return data;
    },
    staleTime: 1000 * 10,
  });
};

export default async function getAccessToken() {
  const {
    data: { session },
    error,
  } = await supabase.auth.getSession();

  if (error) {
    console.error("Error fetching session:", error.message);
    return null;
  }

  return session?.access_token ?? null;
}

export async function Logout() {
  const { error } = await supabase.auth.signOut();

  if (error) {
    console.error("Error logging out:", error.message);
    return false;
  }

  return true;
}