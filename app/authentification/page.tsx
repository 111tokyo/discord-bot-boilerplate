"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { useEffect } from "react";

require("dotenv").config();

export default function Authentification() {
  const searchParams = useSearchParams();
  const pathName = usePathname();

  const authCode = searchParams.get("code");
  const clientId = process.env.APP_ID;
  const clientSecret = process.env.APP_SECRET;

  useEffect(() => {
    if (!clientId || !clientSecret || !authCode) {
      console.log("error 111");
      return;
    }

    const getToken = async () => {
      const data = new URLSearchParams({
        client_id: clientId,
        client_secret: clientSecret,
        grant_type: "authorization_code",
        code: authCode,
        redirect_uri: pathName,
      });

      try {
        const tokenResponse = await fetch("https://discord.com/api/oauth2/token", {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: data,
        });

        const tokenRequest = await tokenResponse.json();

        if (!tokenRequest.access_token) return;

        localStorage.setItem("token", tokenRequest.access_token);
        const token = tokenRequest.access_token;

        // Fetch user data after getting the token
        const userResponse = await fetch("https://discord.com/api/v10/users/@me", {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${token}`,
          },
        });
        const user = await userResponse.json();

        localStorage.setItem("username", user.username);
        localStorage.setItem("globalname", user.global_name);
        localStorage.setItem("avatarcode", user.avatar);
        localStorage.setItem("id", user.id);

        window.location.href = pathName.replace("authentification", "dashboard/user/@1");
      } catch (error) {
        console.error("Error fetching token or user data:", error);
      }
    };

    getToken();
  }, [authCode, clientId, clientSecret, pathName]); // Add necessary dependencies here

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-background" />
    </div>
  );
}