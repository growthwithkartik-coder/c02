/* ------------------------------------------------------------------
   CO2 — professional services (Oct 2026).
   Shown on the homepage (ServicesSection) and on /services.
   Prices are on request: every "Request pricing" button opens WhatsApp
   on the site's existing number with the service name pre-filled.
   Copy describes support and guidance only — no certifications,
   approvals or guaranteed outcomes are claimed.
------------------------------------------------------------------- */

export type ServiceIcon = "package" | "palette" | "scale" | "flask" | "clipboard" | "globe";

export type Service = {
  id: string;
  n: string;
  title: string;
  kicker: string;
  summary: string;
  description: string;
  points: string[];
  icon: ServiceIcon;
};

export const services: Service[] = [
  {
    id: "packaging-consulting",
    n: "01",
    title: "Packaging Consulting",
    kicker: "Strategy",
    summary: "The right container, material and format for your formula, budget and market.",
    description:
      "We help you choose packaging that suits the product inside it — compatibility with the formula, the right size and closure, materials, minimum order quantities and cost — so your product is protected, practical and ready for the shelf.",
    points: ["Container, closure and material selection", "Formula–pack compatibility review", "Sizing, MOQ and cost planning"],
    icon: "package",
  },
  {
    id: "packaging-design",
    n: "02",
    title: "Packaging Design",
    kicker: "Brand & label",
    summary: "Premium labels, cartons and pack artwork that carry your brand with clarity.",
    description:
      "From concept to print-ready files, we design labels, cartons and pack artwork that look premium and read clearly — with space planned for the mandatory label information your market requires.",
    points: ["Label, carton and pack artwork", "Brand-consistent colour and typography", "Print-ready files and mock-ups"],
    icon: "palette",
  },
  {
    id: "legal-regulatory-compliance",
    n: "03",
    title: "Legal & Regulatory Compliance",
    kicker: "Compliance",
    summary: "Support in meeting the legal requirements for selling cosmetics.",
    description:
      "We help you understand and organize the legal and regulatory requirements that apply to your cosmetic products — labelling, ingredient declarations, claims and the documents you need to keep — so you can launch with confidence.",
    points: ["Label and claims review", "Ingredient declaration checks", "Compliance document checklist"],
    icon: "scale",
  },
  {
    id: "quality-assurance-feasibility",
    n: "04",
    title: "Quality Assurance & Product Feasibility Study",
    kicker: "Quality",
    summary: "Check that a product idea can be made well, consistently and at the right cost.",
    description:
      "Before you invest, we assess whether your product concept is practical to produce — formula, ingredients, packaging, shelf-life considerations and cost — and set out the quality checks that keep every batch consistent.",
    points: ["Concept and formula feasibility", "Ingredient and packaging sourcing review", "Quality-check plan for production"],
    icon: "flask",
  },
  {
    id: "regulatory-compliance-guidance",
    n: "05",
    title: "Regulatory Compliance Guidance",
    kicker: "Guidance",
    summary: "Step-by-step guidance through registrations, approvals and ongoing obligations.",
    description:
      "We guide you through the regulatory steps for your products and target markets — what applies, in what order, and which records to maintain — so nothing is missed between formulation and sale.",
    points: ["Market-by-market requirement overview", "Registration and approval roadmap", "Ongoing record-keeping guidance"],
    icon: "clipboard",
  },
  {
    id: "export-documentation",
    n: "06",
    title: "Export Procedures & Documentation Support",
    kicker: "Export",
    summary: "Help preparing the procedures and paperwork to ship your products abroad.",
    description:
      "Taking products overseas? We support you with export procedures and the documentation they need — commercial paperwork, product information and destination-market requirements — to help shipments move smoothly.",
    points: ["Export process walkthrough", "Commercial and product documentation", "Destination-market requirement checks"],
    icon: "globe",
  },
];

export const servicesNote =
  "Our services provide guidance and support. Where a matter needs a licensed professional or an official authority, we tell you so. Prices are on request, as per the scope of work.";
