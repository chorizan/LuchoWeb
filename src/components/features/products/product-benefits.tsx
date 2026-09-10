"use client";

import { Leaf, Sparkles, Heart, Shield } from "lucide-react";
import type { ProductBenefit } from "@/types";
import { FadeInUp, StaggerContainer, StaggerItem } from "@/components/ui/motion";

const icons = [Leaf, Sparkles, Heart, Shield];

interface ProductBenefitsProps {
  benefits: ProductBenefit[];
  uses?: string[];
  nutritionalInfo?: string[];
  title?: string;
}

export function ProductBenefits({
  benefits,
  uses,
  nutritionalInfo,
  title = "Beneficios",
}: ProductBenefitsProps) {
  const hasBenefits = benefits.length > 0;
  const hasUses = Boolean(uses?.length);
  const hasNutritionalInfo = Boolean(nutritionalInfo?.length);

  if (!hasBenefits && !hasUses && !hasNutritionalInfo) {
    return null;
  }

  return (
    <div className="space-y-12">
      <FadeInUp>
        <h2 className="font-serif text-2xl md:text-3xl font-bold mb-8">{title}</h2>
      </FadeInUp>

      {hasBenefits && (
        <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {benefits.map((benefit, i) => {
            const Icon = icons[i % icons.length];
            return (
              <StaggerItem key={`${benefit.title}-${i}`}>
                <div className="flex gap-4 p-5 bg-white rounded-2xl shadow-sm h-full">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-olive/10">
                    <Icon className="h-5 w-5 text-olive" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-text mb-1">{benefit.title}</h3>
                    <p className="text-sm text-text-muted leading-relaxed">
                      {benefit.description}
                    </p>
                  </div>
                </div>
              </StaggerItem>
            );
          })}
        </StaggerContainer>
      )}

      {hasUses && (
        <FadeInUp>
          <h3 className="font-serif text-xl font-semibold mb-4">Usos recomendados</h3>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {uses!.map((use) => (
              <li
                key={use}
                className="flex items-center gap-2 text-sm text-text-muted bg-beige rounded-xl px-4 py-3"
              >
                <span className="h-1.5 w-1.5 rounded-full bg-olive shrink-0" />
                {use}
              </li>
            ))}
          </ul>
        </FadeInUp>
      )}

      {hasNutritionalInfo && (
        <FadeInUp>
          <h3 className="font-serif text-xl font-semibold mb-4">Información del producto</h3>
          <div className="flex flex-wrap gap-2">
            {nutritionalInfo!.map((info) => (
              <span
                key={info}
                className="text-xs font-medium bg-olive/10 text-olive px-3 py-1.5 rounded-full"
              >
                {info}
              </span>
            ))}
          </div>
        </FadeInUp>
      )}
    </div>
  );
}
