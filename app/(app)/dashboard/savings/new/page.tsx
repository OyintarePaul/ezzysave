import { Card, CardContent } from "@/components/ui/card";
import PageLayout from "../../components/page-layout";
import CreatePlanForm from "./CreatePlanForm";

const CreateSavingsPlanPage = () => {
  return (
    <PageLayout
      title="Start a New Savings Plan"
      subtitle="Define your goal, choose a plan type, and set your initial
          contribution."
      backHref="/dashboard/savings"
    >
      <Card>
        <CardContent>
          <CreatePlanForm />
        </CardContent>
      </Card>
    </PageLayout>
  );
};

export default CreateSavingsPlanPage;
