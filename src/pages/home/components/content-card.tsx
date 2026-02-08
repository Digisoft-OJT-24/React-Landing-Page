interface ContentCardProps {
  title: string;
  children?: React.ReactNode;
}
export default function ContentCard({ title, children }: ContentCardProps) {
  return (
    <section className="w-full min-h-[90vh] p-10">
      <h1 className="text-center text-3xl font-bold mb-5 uppercase text-primary">
        {title}
      </h1>
      {children}
    </section>
  );
}
