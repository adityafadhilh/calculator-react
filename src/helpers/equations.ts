export type EquationType =
  | "quadratic"
  | "cubic"
  | "sine"
  | "cosine"
  | "exponential"
  | "logarithm";

export interface EquationDefinition {
  label: string;
  expression: string;
  description?: string;
}

export const EQUATIONS: Record<EquationType, EquationDefinition> = {
  quadratic: {
    label: "Quadratic",
    expression: "x^2 - 4",
    description: "ax² + bx + c",
  },

  cubic: {
    label: "Cubic",
    expression: "x^3 - 1",
    description: "ax³ + bx² + cx + d",
  },

  sine: {
    label: "Sine",
    expression: "sin(x)",
    description: "a·sin(bx)",
  },

  cosine: {
    label: "Cosine",
    expression: "cos(x)",
    description: "a·cos(bx)",
  },

  exponential: {
    label: "Exponential",
    expression: "exp(0.5 * x)",
    description: "a·e^(bx)",
  },

  logarithm: {
    label: "Logarithm",
     expression: "log(x)",
    description: "a·log(bx)",
  },
};