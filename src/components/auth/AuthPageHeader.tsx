type Props = {
  title: string;
  subtitle: string;
};

export function AuthPageHeader({ title, subtitle }: Props) {
  return (
    <div className="mb-2 text-center">
      <h1 className="text-primary-text text-2xl font-bold">{title}</h1>
      <p className="text-secondary-text mt-1 text-sm">{subtitle}</p>
    </div>
  );
}
