"use client";

import { Coffee, Flame, Users, Home } from "lucide-react";
import { features } from "@/constants/mock-data";
import { StaggerContainer, StaggerItem } from "@/components/ui/motion";

const iconMap: Record<string, React.ComponentType<{ className?: string; strokeWidth?: number }>> = {
  bean: Coffee,
  flame: Flame,
  users: Users,
  home: Home,
};

export function FeaturesSection() {
  return (
    <section className="py-16 md:py-24">
      <div className="container-premium">
        <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {features.map((feature) => {
            const Icon = iconMap[feature.icon] ?? Coffee;
            return (
              <StaggerItem key={feature.title}>
                <div className="text-center sm:text-left group">
                  <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-olive/8 group-hover:bg-olive/15 transition-colors duration-300 mb-4">
                    <Icon className="h-6 w-6 text-olive" strokeWidth={1.5} />
                  </div>
                  <h3 className="font-serif text-lg font-semibold mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-text-muted leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </StaggerItem>
            );
          })}
        </StaggerContainer>
      </div>
    </section>
  );
}
