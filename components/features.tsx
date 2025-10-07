import {
  DollarSign,
  MessagesSquare,
  PersonStanding,
  Timer,
  Zap,
  ZoomIn,
} from "lucide-react";

interface Feature {
  title: string;
  description: string;
  icon: React.ReactNode;
}

interface Feature17Props {
  heading?: string;
  subheading?: string;
  features?: Feature[];
}

const Features = ({
  heading = "Why choose us?",
  subheading = "Features",
  features = [
    {
      title: "Daily Savings",
      description:
        "We provide you with the opportunity to save daily. Start small, think big, and watch your savings grow over time.",
      icon: <Timer className="size-4 md:size-6" />,
    },
    {
      title: "Taret saving",
      description:
        "Save for a specific goal, whether it's a vacation, a new gadget, or an emergency fund. Set your target and work towards it with ease.",
      icon: <Zap className="size-4 md:size-6" />,
    },
    {
      title: "Fixed savings",
      description:
        "We also provide fixed savings plans that offer higher interest rates for longer-term commitments. Choose a plan that suits your financial goals and enjoy the benefits of disciplined saving.",
      icon: <ZoomIn className="size-4 md:size-6" />,
    },
    {
      title: "High interest Rates",
      description:
        "Our savings accounts offer competitive interest rates, ensuring that your money works hard for you. Watch your savings grow faster with our attractive rates.",
      icon: <PersonStanding className="size-4 md:size-6" />,
    },
    {
      title: "Security",
      description:
        "Your security is our top priority. We employ advanced security measures to protect your funds and personal information, giving you peace of mind while you save.",
      icon: <DollarSign className="size-4 md:size-6" />,
    },
    {
      title: "Loans",
      description:
        "Need extra funds? We offer flexible loan options to help you meet your financial needs. Whether it's for personal use or business purposes, our loans come with competitive rates and easy repayment terms.",
      icon: <MessagesSquare className="size-4 md:size-6" />,
    },
  ],
}: Feature17Props) => {
  return (
    <section className="py-32">
      <div className="container mx-auto px-4 max-w-7xl">
        <p className="mb-2 text-muted-foreground md:pl-5">
          {subheading}
        </p>
        <h2 className="text-3xl font-medium md:pl-5 lg:text-4xl">{heading}</h2>
        <div className="mx-auto mt-14 grid gap-x-20 gap-y-8 md:grid-cols-2 md:gap-y-6 lg:grid-cols-3 lg:mt-20">
          {features.map((feature, idx) => (
            <div className="flex gap-6 rounded-lg md:block md:p-5" key={idx}>
              <span className="mb-8 flex size-10 shrink-0 items-center justify-center rounded-full bg-accent md:size-12">
                {feature.icon}
              </span>
              <div>
                <h3 className="font-medium md:mb-2 md:text-xl">
                  {feature.title}
                </h3>
                <p className="text-sm text-muted-foreground md:text-base">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
