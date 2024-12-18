type ContentHeaderType = {
  children: React.ReactNode;
};

export default function ContentHeader({
  children,
}: ContentHeaderType): JSX.Element {
  return <div className="mb-2">{children}</div>;
}
