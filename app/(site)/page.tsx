import FAQ from "./components/faq";
import Features from "./components/features";
import Footer from "./components/footer";
import Header from "./components/header";
import Hero from "./components/hero";
import Testimonials from "./components/testimonials";
export default function HomePage() {
  return (
    <div className="min-h-screen bg-white font-sans">
      <Header />
      <main>
        <Hero />
        <Features />
        <Testimonials />
        <FAQ />
      </main>
      <Footer />
    </div>
  );
}
