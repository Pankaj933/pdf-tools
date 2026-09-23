export const products = {
  govt: [
    { id: "ssc-cgl", title: "SSC CGL Complete Notes", description: "Topic-wise Quant, Reasoning, English and GK notes for focused revision.", price: "199", tag: "Most Popular", features: ["Complete subject-wise notes", "Formula and shortcut sheets", "Quick revision plan"] },
    { id: "banking-starter", title: "Banking Exam Starter Pack", description: "Crisp concepts, formula sheets and practice strategy for bank exams.", price: "149", tag: "Bestseller", features: ["Quant and reasoning concepts", "Banking awareness notes", "Practice strategy guide"] },
    { id: "upsc-polity", title: "UPSC Polity Quick Revision", description: "Easy-to-revise polity notes with important articles and exam pointers.", price: "249", tag: "New", features: ["Important Constitution articles", "Chapter-wise revision notes", "Prelims-focused pointers"] },
  ],
  college: [
    { id: "bca-sem-1", title: "BCA Semester 1 Notes", description: "Clean, unit-wise notes for programming fundamentals and computer basics.", price: "129", tag: "Popular", features: ["Unit-wise study notes", "Programming fundamentals", "Exam-focused explanations"] },
    { id: "bcom-accounts", title: "B.Com Accounts Notes", description: "Simple explanations, solved examples and last-minute revision material.", price: "149", tag: "Exam Ready", features: ["Solved accounting examples", "Important exam questions", "Last-minute revision guide"] },
    { id: "engineering-math", title: "Engineering Math Formula Book", description: "A compact formula and problem-solving guide for semester exams.", price: "99", tag: "Quick Revision", features: ["Important formulas", "Problem-solving steps", "Compact printable format"] },
  ],
  digital: [
    { id: "canva-starter", title: "Canva Design Starter Kit", description: "Templates and a practical roadmap to start creating designs for clients.", price: "299", tag: "Trending", features: ["Ready-to-use templates", "Client work starter roadmap", "Design workflow checklist"] },
    { id: "freelancing-guide", title: "Freelancing Launch Guide", description: "Step-by-step digital guide to build your profile and find first clients.", price: "199", tag: "Beginner Friendly", features: ["Profile setup checklist", "Finding your first clients", "Proposal writing guide"] },
    { id: "digital-products", title: "Digital Products Blueprint", description: "Learn how to plan, package and sell useful digital products online.", price: "349", tag: "Premium", features: ["Product idea framework", "Packaging and pricing guide", "Online selling roadmap"] },
  ],
};

export const allProducts = Object.values(products).flat();

export function getProduct(productId) {
  return allProducts.find((product) => product.id === productId);
}