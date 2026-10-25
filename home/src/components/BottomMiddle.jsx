import { useState } from "react";

const FAQS = [
  {
    question: "How does ABEON plan my trip?",
    answer: "Share your destination, travel dates, budget, and interests. ABEON helps you build a personalized itinerary with recommendations tailored to your travel style and plans.",
  },
  {
    question: "Can I customize my itinerary?",
    answer: "Absolutely. Your itinerary is a starting point, not a fixed schedule. Adjust destinations, activities, and plans to make the journey your own.",
  },
  {
    question: "Can I plan a trip within my budget?",
    answer: "Yes. Set your budget while planning, and ABEON helps you estimate trip costs and organize expenses so you can make informed travel decisions.",
  },
  {
    question: "Does ABEON provide real-time travel information?",
    answer: "ABEON can help you organize practical details such as weather, opening hours, and travel logistics. Availability and accuracy depend on the information sources and features supported.",
  },
  {
    question: "Can I plan trips for multiple destinations or days?",
    answer: "Yes. Plan multi-day journeys, explore different destinations, and organize activities into a structured itinerary that you can review and refine before you leave.",
  },
];

const STEPS = [
  {
    title: "Tell us what moves you",
    description: "Share your destination, travel dates, budget, and the experiences you’re looking for. ABEON starts with what matters most to you.",
  },
  {
    title: "Get your journey, thoughtfully planned",
    description: "Discover a personalized itinerary with places to explore, things to do, and practical recommendations tailored to your trip.",
  },
  {
    title: "Make it yours. Then go.",
    description: "Refine your plans, keep everything organized, and head out with greater clarity and confidence. Your next adventure starts here.",
  },
];

function PlanningSection() {
  return (
    <section className="content-section planning-section" id="planning">
      <div className="planning-layout">
        <div className="planning-copy">
          <div>
            <span className="section-eyebrow section-eyebrow-dark">HOW ABEON WORKS</span>
            <h2>From your idea to your next adventure</h2>
          </div>
          <p>Tell us what inspires you. We’ll help you turn it into a journey that fits your interests, budget, and travel style.</p>
          <a className="green-button" href="#trip-finder">Find your way</a>
        </div>
        <div className="steps-list">
          {STEPS.map((step, index) => (
            <article className="step-card" key={step.title}>
              <span className="step-number">Step {String(index + 1).padStart(2, "0")}</span>
              <h3>{step.title}</h3>
              <p>{step.description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function FAQSection() {
  const [openIndex, setOpenIndex] = useState(4);

  return (
    <section className="content-section faq-section" id="faq">
      <div className="faq-layout">
        <div className="faq-copy">
          <div>
            <span className="section-eyebrow section-eyebrow-dark">FAQ</span>
            <h2>Everything you need to know</h2>
          </div>
          <p>From planning your trip to making the most of every moment, find answers to your questions about travelling with ABEON.</p>
          <a className="green-button" href="mailto:hello@abeon.travel">Still have questions? Get in touch.</a>
        </div>
        <div className="faq-list">
          {FAQS.map((faq, index) => {
            const isOpen = openIndex === index;
            const answerId = `faq-answer-${index}`;
            return (
              <article className={`faq-item${isOpen ? " is-open" : ""}`} key={faq.question}>
                <button
                  className="faq-question"
                  type="button"
                  aria-expanded={isOpen}
                  aria-controls={answerId}
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                >
                  <span>{faq.question}</span>
                  <span className="faq-icon" aria-hidden="true" />
                </button>
                <div className="faq-answer" id={answerId} hidden={!isOpen}>
                  <p>{faq.answer}</p>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default function BottomMiddle() {
  return (
    <div className="bottom-middle">
      <PlanningSection />
      <FAQSection />
    </div>
  );
}