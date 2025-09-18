"use client";

import { Button } from "@/components/ui/button";
import { useState } from "react";

export default function TestApiButton() {
  const [isLoading, setIsLoading] = useState(false);

  const handleTestApi = async () => {
    setIsLoading(true);

    try {
      console.log("🔄 Testing Notes API...");

      const response = await fetch("/api/notes", {
        method: "GET",
        credentials: "include", // Important for including session cookies
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      console.log("✅ API Response Success:");
      console.log("📊 Data:", data);
      console.log("📝 Notes count:", data.data?.length || 0);

      if (data.data && data.data.length > 0) {
        console.log("📋 First note:", data.data[0]);
      }
    } catch (error) {
      console.error("❌ API Test Failed:");
      console.error("🚨 Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button onClick={handleTestApi} disabled={isLoading} variant="outline">
      {isLoading ? "Testing API..." : "Test Notes API"}
    </Button>
  );
}
