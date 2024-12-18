type WrapperProps = {
  children: React.ReactNode;
};

export default function Wrapper({ children }: WrapperProps): JSX.Element {
  return <div className="p-4">{children}</div>;
}
