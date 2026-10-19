'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

const FAQ_ITEMS = [
  {
    question: 'What file can I upload?',
    answer: 'PDF files up to 4 MB and up to 100 pages.',
  },
  {
    question: 'Are my uploaded notes and data secure?',
    answer:
      "Your generated notes, flashcards and quizzes are saved to your account and can only be accessed when you are signed in. To create them, your PDF is sent to Google's Gemini AI for processing. Study Desk does not store the PDF file itself.",
  },
  {
    question: 'Are flashcards and quizzes auto-generated or manual?',
    answer: 'They are generated automatically from your notes with one click.',
  },
  {
    question: 'Can I download my notes?',
    answer:
      'Yes. You can download your notes as a PDF from the Dashboard or the Notes page.',
  },
  {
    question: 'Can I keep several documents?',
    answer:
      'Yes. Every upload is saved to your Dashboard, where you can open, download or delete it.',
  },
];

export function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section aria-labelledby="home-faq-heading" className="mx-auto w-full max-w-3xl px-4 py-8 sm:py-12">
      <div className="mb-8 space-y-2">
        <h2
          id="home-faq-heading"
          className="text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl"
        >
          Frequently Asked Questions
        </h2>
        <p className="text-sm leading-relaxed text-muted sm:text-base">
          Answers to common questions about formats, security and usage.
        </p>
      </div>

      <div className="space-y-3">
        {FAQ_ITEMS.map(({ question, answer }, index) => {
          const isOpen = openIndex === index;
          const answerId = `home-faq-answer-${index}`;

          return (
            <article
              key={question}
              className="overflow-hidden rounded-2xl border border-card-border bg-surface shadow-sm"
            >
              <h3>
                <button
                  type="button"
                  aria-expanded={isOpen}
                  aria-controls={answerId}
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left font-semibold text-foreground transition-colors hover:bg-surface-raised focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-accent-strong sm:px-6"
                >
                  <span>{question}</span>
                  <ChevronDown
                    aria-hidden="true"
                    className={`h-5 w-5 shrink-0 text-muted transition-transform duration-300 motion-reduce:transition-none ${
                      isOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>
              </h3>
              <div
                id={answerId}
                aria-hidden={!isOpen}
                className={`grid grid-cols-1 transition-[grid-template-rows] duration-300 motion-reduce:transition-none ${
                  isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
                }`}
              >
                <div className="min-h-0 overflow-hidden">
                  <p
                    className={`px-5 pb-5 text-sm leading-relaxed text-muted transition-opacity duration-300 motion-reduce:transition-none sm:px-6 ${
                      isOpen ? 'opacity-100' : 'opacity-0'
                    }`}
                  >
                    {answer}
                  </p>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
