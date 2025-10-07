import Navbar from "@/components/navbar";
import Footer from "@/components/footer";

export default function SiteLayout({ children }: { children: React.ReactNode }) {
    return (
        <div>
            <Navbar />
            <main>
                {children}
            </main>
            <Footer />
        </div>
    )
}