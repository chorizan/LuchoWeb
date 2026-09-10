import type { Prisma } from "@prisma/client";
import type { ProductBenefit } from "@/types";

export function benefitsToPrismaJson(
  benefits: ProductBenefit[]
): Prisma.InputJsonValue {
  return benefits.map(({ title, description }) => ({ title, description }));
}

function isProductBenefit(value: unknown): value is ProductBenefit {
  return (
    typeof value === "object" &&
    value !== null &&
    "title" in value &&
    typeof (value as ProductBenefit).title === "string"
  );
}

export function parseBenefitsJson(
  value: Prisma.JsonValue | null | undefined
): ProductBenefit[] {
  if (!Array.isArray(value)) return [];

  const benefits: ProductBenefit[] = [];

  for (const item of value) {
    if (!isProductBenefit(item)) continue;

    const title = item.title.trim();
    if (!title) continue;

    benefits.push({
      title,
      description:
        item.description?.trim() ||
        "Beneficio natural de este producto artesanal.",
    });
  }

  return benefits;
}

export function parseBenefitsText(value?: string | null): ProductBenefit[] {
  if (!value) return [];

  return value
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const separatorIndex = line.indexOf("|");
      if (separatorIndex === -1) {
        return {
          title: line,
          description: "Beneficio natural de este producto artesanal.",
        };
      }

      const title = line.slice(0, separatorIndex).trim();
      const description = line.slice(separatorIndex + 1).trim();

      if (!title) return null;

      return {
        title,
        description: description || "Beneficio natural de este producto artesanal.",
      };
    })
    .filter((benefit): benefit is ProductBenefit => benefit !== null);
}

export function serializeBenefitsText(benefits: ProductBenefit[]): string {
  return benefits
    .map((benefit) =>
      benefit.description
        ? `${benefit.title} | ${benefit.description}`
        : benefit.title
    )
    .join("\n");
}

export function resolveProductBenefits(
  benefits: ProductBenefit[] | null | undefined,
  highlights: string[],
  shortDesc?: string | null
): ProductBenefit[] {
  if (benefits?.length) return benefits;
  if (!highlights.length) return [];

  const fallbackDescription =
    shortDesc?.trim() || "Beneficio natural de este producto artesanal.";

  return highlights.map((title) => ({
    title,
    description: fallbackDescription,
  }));
}
