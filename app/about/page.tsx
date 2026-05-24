export const metadata = {
  title: "SareeBazar | About Us",
  description: "Learn about SareeBazar, our journey, and our values.",
};

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-[#fbeff6] px-6 pt-24 pb-12 md:px-8">
      <div className="mx-auto w-full max-w-4xl space-y-10">
        <section>
          <p className="text-xs font-semibold uppercase tracking-wider text-primary">
            Our Story
          </p>
          <h1 className="mt-2 text-3xl font-serif text-gray-900 md:text-4xl">
            About SareeBazar
          </h1>
          <div className="mt-4 space-y-4 text-[14px] leading-relaxed text-gray-600">
            <p>
              Founded in 2005 in Badulla, Sri Lanka, SareeBazar began as a
              single boutique with a small, dedicated team.
            </p>
            <p>
              Over the years, we have embraced change and growth, evolving into
              a trusted destination for timeless sarees and modern styling.
            </p>
            <p>
              Our journey from a single store to a growing network across Sri
              Lanka reflects our commitment to accessible, high-quality fashion.
            </p>
            <p>
              Today, SareeBazar continues to expand its reach while staying true
              to the craftsmanship, culture, and community that define us.
            </p>
          </div>
        </section>

        <section className="rounded-2xl border border-primary/20 bg-white/70 p-6">
          <h2 className="text-lg font-serif text-gray-900">Vision</h2>
          <p className="mt-3 text-[14px] leading-relaxed text-gray-600">
            To be the most loved saree and ethnic fashion destination for people
            across the world.
          </p>
        </section>

        <section className="rounded-2xl border border-primary/20 bg-white/70 p-6">
          <h2 className="text-lg font-serif text-gray-900">Mission</h2>
          <p className="mt-3 text-[14px] leading-relaxed text-gray-600">
            To become Sri Lanka&apos;s leading saree retail chain with a
            meaningful international presence.
          </p>
        </section>

        <section className="rounded-2xl border border-primary/20 bg-white/70 p-6">
          <h2 className="text-lg font-serif text-gray-900">Values</h2>
          <p className="mt-3 text-[14px] leading-relaxed text-gray-600">
            SareeBazar is built on a foundation of conscience, ethics, and
            culture. These values guide our team and shape every customer
            experience.
          </p>
          <div className="mt-4 space-y-3 text-[14px] text-gray-600">
            <p>
              <span className="font-semibold text-gray-900">SMILE</span> stands
              for Synergy, Mastery, Integrity, Liveliness, and Empathy.
            </p>
            <p>
              We believe that living these values creates a welcoming
              environment for both our team and our customers.
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}
