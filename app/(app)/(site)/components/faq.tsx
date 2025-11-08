interface FAQItemProps {
    question: string;
    answer: string;
}

const FAQItem: React.FC<FAQItemProps> = ({ question, answer }) => (
    <div className="border-b border-gray-200 py-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
            <span className="text-primary mr-2 font-bold">+</span> {question}
        </h3>
        <p className="text-gray-700 ml-4">{answer}</p>
    </div>
);

const FAQ: React.FC = () => (
    <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4">
            <h2 className="text-4xl font-bold text-center text-gray-900 mb-4">Frequently Asked Questions</h2>
            <p className="text-xl text-center text-gray-600 mb-12 max-w-2xl mx-auto">
                Got questions? We've got answers. Everything you need to know about EzzySave.
            </p>

            <div className="max-w-4xl mx-auto">
                <FAQItem
                    question="How does the Daily Saving Plan work?"
                    answer="You specify a total saving goal and a daily deposit amount. EzzySave calculates the required number of days and spreads your deposits evenly. Note that this plan does not accrue interest."
                />
                <FAQItem
                    question="What is the interest rate for Target and Fixed Savings?"
                    answer="Interest rates vary based on market conditions and the type of plan. Fixed Savings generally offer a higher rate due to the lock-in period, while Target Savings offer a standard competitive rate. Specific rates are displayed during plan creation."
                />
                <FAQItem
                    question="How do I qualify for a loan?"
                    answer="Loan qualification is based on your saving history, credit profile, and the requested amount. Our transparent application process will guide you through the requirements directly in the app."
                />
                <FAQItem
                    question="Is my money safe with EzzySave?"
                    answer="Yes. EzzySave partners with regulated financial institutions, and all user funds are secured. We use industry-leading encryption and security practices to protect your data and assets."
                />
            </div>
        </div>
    </section>
);

export default FAQ;