import { LogoutButton } from "@/components/logout-button";
import { verifySession } from "@/lib/auth";
import { redirect } from "next/navigation";
import TestApiButton from "./test-api-button";

export default async function DashboardPage() {
  const session = await verifySession();

  if (!session) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-600 mt-2">
              Welcome back, {session.username}!
            </p>
          </div>
          <div className="w-32">
            <LogoutButton />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Your Dashboard</h2>
          <p className="text-gray-600 mb-6">
            This is your protected dashboard area. Only authenticated users can
            see this page.
          </p>

          <div className="border-t pt-6">
            <h3 className="text-lg font-medium mb-3">API Testing</h3>
            <p className="text-sm text-gray-600 mb-4">
              Test the notes API endpoint. Check the browser console for the
              result.
            </p>
            <TestApiButton />
          </div>
        </div>
      </div>
    </div>
  );
}
