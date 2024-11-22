export function TableOfContents({
  headers,
  activeSection,
}: {
  headers: Array<{ id: string; text: string; level: number }>;
  activeSection: string;
}) {
  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
      window.history.pushState({}, "", `#${id}`);
    }
  };

  return (
    <div className="bg-white/10 backdrop-blur-sm rounded-lg border border-white/20 p-4">
      <h3 className="text-white/90 font-medium mb-4">Table of Contents</h3>
      <nav className="space-y-2">
        {headers.map((header) => (
          <a
            key={header.id}
            href={`#${header.id}`}
            onClick={(e) => handleClick(e, header.id)}
            className={`block text-sm py-1 transition-colors ${
              activeSection === header.id
                ? "text-main"
                : "text-white/60 hover:text-white"
            }`}
            style={{ paddingLeft: `${(header.level - 1) * 0.75}rem` }}
          >
            {header.text}
          </a>
        ))}
      </nav>
    </div>
  );
}
