import { Hero } from "@/components/sections/Hero";
import { WhatWeOffer } from "@/components/sections/WhatWeOffer";
import { WhyChooseUs } from "@/components/sections/WhyChooseUs";
import { FeaturedBook } from "@/components/sections/FeaturedBook";
import { Testimonials } from "@/components/sections/Testimonials";
import { CTABanner } from "@/components/sections/CTABanner";

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1">
        <Hero />
        <WhatWeOffer />
        <WhyChooseUs />
        <FeaturedBook />
        <Testimonials />
        <CTABanner />
      </main>
    </div>
  );
}
