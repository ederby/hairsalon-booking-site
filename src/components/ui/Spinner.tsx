export default function Spinner() {
  return (
    <div className="w-full flex justify-center items-center mt-[20vh]">
      <span className="w-[48px] h-[48px] border-[5px] border-[solid] border-zinc-200 [border-bottom-color:#0d9489] rounded-[50%] inline-block box-border animate-spin"></span>
    </div>
  );
}
