const About = () => {
  return (
    <section className="relative min-h-screen max-w-4xl mx-auto dark:text-white p-4">
      {/* Hero Section */}
      <div className="container mx-auto px-4 pt-20">
        <div className="max-w-4xl mx-auto space-y-6">
          <h1 className="font-extrabold text-6xl md:text-7xl tracking-tight uppercase">
            <span className="text-main">From Warehouse Floor</span>
            <br />
            <span className="text-black dark:text-white">
              to Full Stack Innovation
            </span>
          </h1>
          <p className="text-3xl font-light mt-8 leading-relaxed">
            I transformed operations through{" "}
            <span className="text-main font-medium">
              code, automation, and deep domain expertise
            </span>
            , proving that determination can bridge any gap.
          </p>
        </div>
      </div>

      {/* Content Sections */}
      <div className="container mx-auto px-4 pt-20 max-w-4xl space-y-16">
        {/* Journey */}
        <div className="space-y-6">
          <h2 className="text-main text-4xl font-bold flex items-center gap-3">
            The Unconventional Path
          </h2>
          <p className="text-xl leading-relaxed">
            Starting as a warehouse worker, I saw firsthand the challenges in
            logistics operations. Through obsessive curiousity, relentless
            self-study and hands-on problem-solving, I evolved into a Systems &
            Warehouse Manager who bridges the gap between operations and
            technology. While managing full-time, I pursued a business degree
            and multiple technical certifications, proving that passion and
            determination can overcome traditional barriers.
          </p>
        </div>

        {/* Technical Expertise */}
        <div className="space-y-8">
          <h2 className="text-main text-4xl font-bold flex items-center gap-3">
            Technical Arsenal
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <h3 className="text-2xl font-semibold">Core Technologies</h3>
              <ul className="space-y-2 text-lg">
                <li>• Rust, Python, JavaScript</li>
                <li>• React, Next.js, Tailwind CSS</li>
                <li>• SQL Server, MongoDB</li>
                <li>• Docker, RabbitMQ</li>
              </ul>
            </div>
            <div className="space-y-4">
              <h3 className="text-2xl font-semibold">Specialized Skills</h3>
              <ul className="space-y-2 text-lg">
                <li>• AGV/LGV Systems Integration</li>
                <li>• Real-time Data Processing</li>
                <li>• Warehouse Automation</li>
                <li>• Systems Architecture</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Impact */}
        <div className="space-y-6">
          <h2 className="text-main text-4xl font-bold flex items-center gap-3">
            Real-World Impact
          </h2>
          <p className="text-xl leading-relaxed">
            My solutions don't just improve processes—they transform operations.
            By combining deep warehouse expertise with cutting-edge technology,
            I've achieved concrete results:
          </p>
          <ul className="text-xl space-y-4 list-none">
            <li className="flex items-center space-x-3">
              <span className="text-main">•</span>
              <span>
                Led integration of 10+ LGVs, maximizing throughput during peak
                periods
              </span>
            </li>
            <li className="flex items-center space-x-3">
              <span className="text-main">•</span>
              <span>Built real-time monitoring systems handling 47+ AGVs</span>
            </li>
          </ul>
        </div>

        {/* Current Focus */}
        <div className="space-y-8 pb-8">
          <h2 className="text-main text-4xl font-bold flex items-center gap-3">
            Current Focus
          </h2>
          <p className="text-xl leading-relaxed">
            Currently expanding my full-stack development expertise while
            maintaining my edge in:
          </p>
          <ul className="text-xl space-y-4 list-none">
            <li className="flex items-center space-x-3">
              <span className="text-main">•</span>
              <span>
                Building high-performance systems with Rust and modern web
                technologies
              </span>
            </li>
            <li className="flex items-center space-x-3">
              <span className="text-main">•</span>
              <span>
                Developing real-time monitoring and automation solutions
              </span>
            </li>
            <li className="flex items-center space-x-3">
              <span className="text-main">•</span>
              <span>
                Creating efficient, scalable architectures for complex
                operations
              </span>
            </li>
          </ul>
        </div>

        {/* Quote */}
        <blockquote className="text-2xl text-center italic text-main font-light max-w-3xl mx-auto pb-32">
          "I combine deep operational knowledge with technical expertise to
          build solutions that transform how warehouses work."
        </blockquote>
      </div>
    </section>
  );
};

export default About;
