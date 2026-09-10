import { HeroSection } from "@/components/sections/hero-section";
import { FeaturesSection } from "@/components/sections/features-section";
import {
  PopularProductsSection,
  RecommendedSection,
} from "@/components/sections/products-section";
import { BeansSection } from "@/components/sections/beans-section";
import {
  CategoriesSection,
  BrandStorySection,
  TestimonialsSection,
  InstagramSection,
} from "@/components/sections/home-sections";

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <FeaturesSection />
      <PopularProductsSection />
      <RecommendedSection />
      <BeansSection />
      <CategoriesSection />
      <BrandStorySection />
      <TestimonialsSection />
      <InstagramSection />
    </>
  );
}
