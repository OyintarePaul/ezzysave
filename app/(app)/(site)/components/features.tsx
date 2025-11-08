import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

const Features: React.FC = () => (
    <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4">
            <h2 className="text-4xl font-bold text-center text-gray-900 mb-4">Your Path to Financial Freedom</h2>
            <p className="text-xl text-center text-gray-600 mb-12 max-w-2xl mx-auto">
                Choose the saving style that fits your life, and know that funds are available when you need them.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <FeatureCard
                    title="Daily Saving Plan"
                    description="Set a daily deposit amount and a total goal. The system manages the schedule, spreading your total deposit across days. No interest, pure discipline."
                    icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>}
                    colorClass="bg-yellow-100"
                />
                <FeatureCard
                    title="Target Saving (Interest)"
                    description="Specify a goal amount and a target date. Deposit funds flexibly until your goal is reached. Earn interest along the way."
                    icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 13.5l6 6 9-9.5M12 21a9 9 0 100-18 9 9 0 000 18z" /></svg>}
                    colorClass="bg-blue-100"
                />
                <FeatureCard
                    title="Fixed Savings (High Interest)"
                    description="Deposit a lump sum and lock it for a set duration (e.g., 6 months, 1 year). Enjoy higher interest rates for guaranteed commitment."
                    icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-4a2 2 0 00-2-2H6a2 2 0 00-2 2v4a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v3h8z" /></svg>}
                    colorClass="bg-green-100"
                />
                <FeatureCard
                    title="Quick Loans"
                    description="Obtain financial assistance directly from the platform. Simple application process with transparent repayment terms for emergencies or opportunities."
                    icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2z" /></svg>}
                    colorClass="bg-red-100"
                />
            </div>
        </div>
    </section>
);

export default Features;


interface FeatureCardProps {
    icon: React.ReactNode;
    title: string;
    description: string;
    colorClass: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ icon, title, description, colorClass }) => (
  <Card className="h-full hover:shadow-2xl transition duration-300">
    <CardHeader className="flex flex-col items-start">
      <div className={`p-3 rounded-full ${colorClass} mb-4`}>
        {icon}
      </div>
      <CardTitle className="text-xl">{title}</CardTitle>
      
    </CardHeader>
    <CardContent>
      <CardDescription className="text-base text-gray-600">
        {description}
      </CardDescription>
    </CardContent>
  </Card>
);