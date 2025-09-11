export interface QualityGateInput {
  wordCount: number;
  images: number;
  links: number;
  schemaValid: boolean;
}

export function passesQualityGate({
  wordCount,
  images,
  links,
  schemaValid,
}: QualityGateInput): boolean {
  return wordCount >= 250 && images >= 1 && links >= 3 && schemaValid;
}
