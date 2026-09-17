interface AreaBlockProps {
  title: string;
  description: string;
  focusPoints: string[];
}

function getAreaIcon(title: string) {
  const normTitle = title.toLowerCase();
  if (normTitle.includes("tributário") || normTitle.includes("tributario")) {
    return (
      <svg className="w-7 h-7 text-brand-gold" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v17M12 3L7 8h10l-5-5zM5 13h4M15 13h4M3 13c0 2.21 1.79 4 4 4s4-1.79 4-4-1.79-4-4-4-4 1.79-4 4zm10 0c0 2.21 1.79 4 4 4s4-1.79 4-4-1.79-4-4-4-4 1.79-4 4z" />
      </svg>
    );
  } else if (normTitle.includes("societário") || normTitle.includes("societario")) {
    return (
      <svg className="w-7 h-7 text-brand-gold" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m0 0a8.947 8.947 0 01-3.741-.479 3 3 0 014.682-2.72m.94 3.198l-.001.031c0 .225.012.447.037.666A11.944 11.944 0 0012 21c2.17 0 4.207-.576 5.963-1.584A6.062 6.062 0 0018 18.72m-12 0a9 9 0 0012 0M9 7a3 3 0 116 0 3 3 0 01-6 0zm-3 4a3 3 0 100-6 3 3 0 000 6zm12 0a3 3 0 100-6 3 3 0 000 6z" />
      </svg>
    );
  } else {
    return (
      <svg className="w-7 h-7 text-brand-gold" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.905 0-5.64-.78-8.007-2.14M19.843 7.582a9.001 9.001 0 01-15.686 0" />
      </svg>
    );
  }
}

export default function AreaBlock({ title, description, focusPoints }: AreaBlockProps) {
  return (
    <div className="group flex flex-col items-start p-8 md:p-10 bg-white border border-brand-gold/25 rounded-none hover:border-brand-gold hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
      {/* Icon frame */}
      <div className="flex items-center justify-center w-14 h-14 rounded-full border border-brand-gold/30 bg-brand-gold-light/20 mb-6 transition-transform duration-300 group-hover:scale-110 group-hover:bg-brand-gold/15">
        {getAreaIcon(title)}
      </div>

      <h3 className="font-serif text-lg md:text-xl font-bold text-brand-navy text-left mb-3">
        {title}
      </h3>

      {/* Decorative tiny separator */}
      <div className="w-8 h-[1px] bg-brand-gold/60 mb-5"></div>

      <p className="text-sm text-brand-text/80 text-left leading-relaxed mb-6 flex-grow">
        {description}
      </p>

      {(focusPoints && focusPoints.length > 0) && (
        <div className="mt-auto w-full border-t border-brand-gold/10 pt-6">
          <h4 className="text-left text-[10px] font-sans font-bold uppercase tracking-wider text-brand-gold-dark mb-4">
            Principais Eixos de Atuação
          </h4>
          <ul className="space-y-3">
            {focusPoints.map((point, index) => (
              <li key={index} className="text-xs text-brand-text/85 text-left flex items-start gap-2.5 leading-relaxed">
                <span className="inline-block w-1.5 h-1.5 bg-brand-gold rotate-45 shrink-0 mt-1.5"></span>
                <span>{point}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
