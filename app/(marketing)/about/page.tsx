const About = () => {
  return (
    <section className="relative min-h-screen max-w-4xl mx-auto dark:text-white">
      {/* Hero Section */}
      <div className="container mx-auto px-4 pt-20 gap-8">
        <div className="max-w-4xl mx-auto space-y-6">
          <h1 className="font-extrabold text-6xl md:text-7xl tracking-tight uppercase">
            <span className="text-main">From Warehouse Floor</span>
            <br />
            <span className="text-black dark:text-white">
              to Full-Stack Innovation
            </span>
          </h1>
          <div className="w-full flex flex-row">
            <p className="text-3xl font-light mt-12 leading-relaxed">
              I turned a warehouse floor job into a tech career through{" "}
              <span className="text-main font-medium">
                obsessive curiosity and determination
              </span>
              .
            </p>
          </div>
        </div>
      </div>

      {/* Content Sections */}
      <div className="container mx-auto px-4 pt-20 max-w-4xl space-y-16">
        {/* The Unconventional Path */}
        <div className="space-y-6">
          <h2 className="text-main text-4xl font-bold">
            The Unconventional Path
          </h2>
          <p className="text-xl leading-relaxed">
            Without a traditional CS degree, I started from scratch on the
            warehouse floor. Through relentless self-study and real-world
            problem-solving, I transformed from a warehouse worker into a
            Systems & Warehouse Manager who codes complex automation solutions.
            At 25, while managing full-time, I pursued a business degree to
            complement my growing technical skills.
          </p>
        </div>

        {/* Technical Evolution */}
        <div className="space-y-8">
          <h2 className="text-main text-4xl font-bold">Technical Evolution</h2>
          <p className="text-xl leading-relaxed">
            My journey started with Excel VBA, evolved through Python (earning
            PCEP, PCAP, and PCPP certifications), and culminated in mastering
            Rust for high-performance systems. Given my own server (rare for a
            Warehouse Manager), I built and managed:
          </p>
          <ul className="text-xl space-y-4 list-none">
            {[
              "A real-time dock monitoring system in Rust handling 47 LGVs",
              "Custom SQL Server databases and RabbitMQ message queues",
              "Self-hosted Grafana dashboards for operational insights",
              "Event-driven microservices using MongoDB and Docker",
              "Full-stack applications with React and NextJS",
            ].map((item, index) => (
              <li key={index} className="flex items-center space-x-3">
                <span className="text-main">•</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Impact & Innovation */}
        <div className="space-y-6">
          <h2 className="text-main text-4xl font-bold">Impact & Innovation</h2>
          <p className="text-xl leading-relaxed">
            My solutions didn't just improve processes—they transformed
            operations. By bridging the gap between warehouse operations and
            cutting-edge technology, I achieved a{" "}
            <span className="font-semibold">
              28% increase in outbound load capacity
            </span>{" "}
            without additional headcount. This wasn't just about coding; it was
            about understanding real-world problems and crafting precise,
            efficient solutions.
          </p>
        </div>

        {/* Current Focus */}
        <div className="space-y-8 pb-8">
          <h2 className="text-main text-4xl font-bold">Current Focus</h2>
          <p className="text-xl leading-relaxed">
            Now transitioning to full-time development, I bring a unique blend
            of:
          </p>
          <ul className="text-xl space-y-4 list-none">
            {[
              "Deep understanding of industrial operations",
              "Proven ability to self-learn and master complex technologies",
              "Experience building production-grade systems",
              "Track record of delivering measurable business impact",
            ].map((item, index) => (
              <li key={index} className="flex items-center space-x-3">
                <span className="text-main">•</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Quote */}
        <blockquote className="text-2xl text-center italic text-main font-light max-w-3xl mx-auto pb-32">
          "From warehouse automation to system architecture, I've proven that
          determination and continuous learning can transform careers and
          businesses alike."
        </blockquote>
      </div>
    </section>
  );
};

export default About;
