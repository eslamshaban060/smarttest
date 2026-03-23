interface SectionHeaderProps {
  eyebrow: string;
  title: string;
  subtitle?: string;
  isRTL: boolean;
}

export const SectionHeader = ({
  eyebrow,
  title,
  subtitle,
  isRTL,
}: SectionHeaderProps) => (
  <div style={{ textAlign: isRTL ? "right" : "left" }} className="mb-12">
    <span className="text-secondary text-[12px] font-bold tracking-[0.2em] uppercase block mb-3">
      {eyebrow}
    </span>
    <h2 className="font-serif text-primary text-[clamp(30px,4vw,48px)] font-bold leading-tight mb-3">
      {title}
    </h2>
    {subtitle && (
      <p className="text-slate-500 text-[15px] max-w-lg">{subtitle}</p>
    )}
  </div>
);
