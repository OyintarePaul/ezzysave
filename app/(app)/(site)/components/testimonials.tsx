interface TestimonialCardProps {
    quote: string;
    name: string;
    title: string;
}

const TestimonialCard: React.FC<TestimonialCardProps> = ({ quote, name, title }) => (
    <div className="p-6 bg-white rounded-xl shadow-lg border border-gray-100">
        <p className="italic text-gray-700 mb-4 leading-relaxed">
            "{quote}"
        </p>
        <div className="border-t pt-4">
            <p className="font-bold text-gray-900">{name}</p>
            <p className="text-sm text-primary">{title}</p>
        </div>
    </div>
);

const Testimonials: React.FC = () => (
    <section className="py-16 md:py-24 bg-gray-50">
        <div className="container mx-auto px-4">
            <h2 className="text-4xl font-bold text-center text-gray-900 mb-4">What Our Users Are Saying</h2>
            <p className="text-xl text-center text-gray-600 mb-12 max-w-2xl mx-auto">
                Real results from real people who achieved their financial dreams with EzzySave.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <TestimonialCard
                    quote="The Target Saving plan made budgeting for my son's college tuition stress-free. The interest earned was a great bonus!"
                    name="Aisha M."
                    title="Small Business Owner"
                />
                <TestimonialCard
                    quote="I love the Daily Saving plan! It automatically manages my small deposits, and I hit my holiday goal way ahead of schedule. Pure discipline made easy."
                    name="John K."
                    title="Marketing Professional"
                />
                <TestimonialCard
                    quote="The Fixed Savings option gives me peace of mind knowing my emergency fund is locked away, growing steadily with competitive interest."
                    name="Sarah P."
                    title="Freelance Designer"
                />
            </div>
        </div>
    </section>
);

export default Testimonials;