export default function ErrorMessage({ message }) {
  return (
    <div className="text-[#171717] bg-[#fafafa] border border-red-400 p-3 rounded-md text-center">
      <span className="text-red-600 font-medium">{message}</span>
    </div>
  );
}
