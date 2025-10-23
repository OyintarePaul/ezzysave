import { Button } from "@/components/ui/button";
const Hero = () => (
  <section className="bg-gray-50 py-20 md:py-32">
    <div className="container mx-auto text-center px-4">
      <h2 className="text-5xl md:text-6xl font-extrabold text-gray-900 leading-tight">
        Save Smarter, Achieve Faster with{" "}
        <span className="text-primary">EzzySave</span>
      </h2>
      <p className="mt-6 text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
        The all-in-one platform to effortlessly manage your financial goals,
        from daily deposits and target savings to fixed growth and emergency
        loans.
      </p>
      <div className="mt-10 flex justify-center space-x-4">
        <Button>Start Saving Today</Button>
        <Button variant="secondary">Explore Loan Options</Button>
      </div>
      <div className="mt-12 max-w-5xl mx-auto rounded-xl shadow-2xl overflow-hidden border-4 border-white">
        {/* Placeholder image/mockup for visual appeal */}
        <div className="w-full h-64 bg-gray-200 flex items-center justify-center text-gray-500 font-medium text-lg"></div>
      </div>
    </div>
  </section>
);

export default Hero;
