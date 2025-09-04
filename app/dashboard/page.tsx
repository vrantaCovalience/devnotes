import { verifySession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { DashboardHeader } from "./DashboardHeader";
import { LoadingNotes } from "./LoadingNotes";
import { NotesTableManagement } from "./NotesTableManagement";
import { SearchFilters } from "./SearchFilters";
import { getDashboardData } from "./actions";

interface DashboardPageProps {
  searchParams: Promise<{
    search?: string;
    category?: string;
  }>;
}

export default async function DashboardPage({
  searchParams,
}: DashboardPageProps) {
  const session = await verifySession();

  if (!session) {
    redirect("/login");
  }

  const params = await searchParams;
  const searchTerm = params.search;
  const selectedCategory = params.category || "all";

  const dashboardData = await getDashboardData(searchTerm, selectedCategory);

  return (
    <div className="container mx-auto p-6 space-y-6">
      <DashboardHeader username={session.username} />

      <SearchFilters
        categories={dashboardData.categories}
        currentSearch={searchTerm}
        currentCategory={selectedCategory}
      />

      <Suspense fallback={<LoadingNotes />}>
        <NotesTableManagement
          notes={dashboardData.notes}
          searchTerm={searchTerm}
          selectedCategory={selectedCategory}
        />
      </Suspense>
    </div>
  );
}
