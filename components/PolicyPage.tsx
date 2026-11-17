import Link from "next/link";
import { ChevronRight } from "lucide-react";
import type { ReactNode } from "react";

export type PolicySection = {
  heading?: string;
  paragraphs?: ReactNode[];
  bullets?: ReactNode[];
};

export default function PolicyPage({
  title,
  intro,
  sections,
  lastUpdated = "17 November 2026",
}: {
  title: string;
  intro?: string;
  sections: PolicySection[];
  lastUpdated?: string;
}) {
  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Hero */}
      <div className="bg-black border-t-4 border-red-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <nav className="flex items-center gap-1 text-xs text-gray-400 mb-4">
            <Link href="/" className="hover:text-red-500 transition-colors">
              Home
            </Link>
            <ChevronRight className="h-3 w-3" />
            <span className="text-gray-300">{title}</span>
          </nav>
          <h1 className="text-3xl sm:text-4xl font-bold">{title}</h1>
          {intro && (
            <p className="mt-4 text-gray-300 max-w-2xl leading-relaxed">
              {intro}
            </p>
          )}
          <p className="mt-4 text-xs text-gray-500">
            Last updated: {lastUpdated}
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sm:p-10 space-y-8">
          {sections.map((section, i) => (
            <section key={i}>
              {section.heading && (
                <h2 className="text-xl font-bold text-gray-900 mb-3 flex items-center gap-2">
                  <span className="h-5 w-1 bg-red-600 rounded-full inline-block" />
                  {section.heading}
                </h2>
              )}
              {section.paragraphs?.map((p, j) => (
                <p
                  key={j}
                  className="text-sm text-gray-600 leading-relaxed mb-3"
                >
                  {p}
                </p>
              ))}
              {section.bullets && (
                <ul className="list-disc pl-6 space-y-2 mt-2">
                  {section.bullets.map((b, j) => (
                    <li
                      key={j}
                      className="text-sm text-gray-600 leading-relaxed"
                    >
                      {b}
                    </li>
                  ))}
                </ul>
              )}
            </section>
          ))}

          {/* Contact CTA */}
          <section className="bg-gray-50 border border-gray-200 rounded-lg p-6">
            <h3 className="font-semibold text-gray-900 mb-2">Need help?</h3>
            <p className="text-sm text-gray-600">
              Contact us on{" "}
              <a
                href="tel:+27733747856"
                className="text-red-600 hover:underline"
              >
                073 374 7856
              </a>
              ,{" "}
              <a
                href="https://wa.me/27733747856"
                target="_blank"
                rel="noopener noreferrer"
                className="text-green-600 hover:underline"
              >
                WhatsApp
              </a>{" "}
              or email{" "}
              <a
                href="mailto:support@kebumotorspares.co.za"
                className="text-red-600 hover:underline"
              >
                support@kebumotorspares.co.za
              </a>
              .
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}

