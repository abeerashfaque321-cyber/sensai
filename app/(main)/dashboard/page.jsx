import { getUserOnboardingStatus } from "@/actions/user";
import { redirect } from "next/navigation";
import { getIndustryInsights } from "@/actions/dashboard";
import DashboardView from "./_components/dashboard-view";

const IndustryInsightsPage = async () => {
  // 1. Pehle check karein onboarding status
  const { isOnboarded } = await getUserOnboardingStatus();

  // 2. Agar onboarded nahi hai toh turant redirect karein
  if (!isOnboarded) {
    redirect("/onboarding");
  }

  // 3. Phir insights fetch karein
  const insights = await getIndustryInsights();

  return (
    <div className="container mx-auto"> 
      {/* Yahan 'di' ko 'div' kar diya hai */}
      <DashboardView insights={insights} />
    </div>
  );
};

export default IndustryInsightsPage;