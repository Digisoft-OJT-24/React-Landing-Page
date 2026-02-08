interface ContentCardProps {
  title?: string;
  id?: string;
  subtitle?: string;
}

export default function ContentHeader({
  title,
  id,
  subtitle,
}: ContentCardProps) {
  return (
    <div id={id}>
      {title && (
        <h1 className="text-4xl mb-3 font-bold text-[#ffa500] uppercase">
          {title}
        </h1>
      )}
      {subtitle && (
        <p className="xl:text-md xs:text-sm text-[#16294a] dark:text-white font-medium">
          {subtitle}
        </p>
      )}
    </div>
  );
}
