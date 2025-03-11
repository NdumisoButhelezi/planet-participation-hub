
import { useState, useEffect } from "react";
import ProgramAgreementDialog from "@/components/shared/ProgramAgreementDialog";
import Navbar from "@/components/home/Navbar";
import HeroSection from "@/components/home/HeroSection";
import FeatureSection from "@/components/home/FeatureSection";
import StatsSection from "@/components/home/StatsSection";
import ContactSection from "@/components/home/ContactSection";
import CTASection from "@/components/home/CTASection";
import Footer from "@/components/home/Footer";
import AOS from 'aos';
import 'aos/dist/aos.css';

const Index = () => {
  const [showAgreement, setShowAgreement] = useState(false);

  useEffect(() => {
    AOS.init({
      duration: 800,
      easing: 'ease-out-cubic',
      once: true
    });
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-blue-50">
      {/* Header */}
      <Navbar />

      {/* Hero Section */}
      <HeroSection onShowAgreement={() => setShowAgreement(true)} />

      {/* Features Section */}
      <FeatureSection />

      {/* Stats Section */}
      <StatsSection />

      {/* Contact Form */}
      <ContactSection />

      {/* CTA Section */}
      <CTASection />

      {/* Footer */}
      <Footer />

      <ProgramAgreementDialog 
        open={showAgreement}
        onOpenChange={setShowAgreement}
      />
    </div>
  );
};

export default Index;
