type WrapperProps = {
  children: React.ReactNode;
};

export default function Wrapper({ children }: WrapperProps): JSX.Element {
  return (
    <div className="p-4 flex justify-center">
      <div className="flex-1 max-w-[1024px]">{children}</div>
    </div>
  );
}
