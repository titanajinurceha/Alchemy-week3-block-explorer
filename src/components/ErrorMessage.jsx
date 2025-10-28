export default function ErrorMessage({ message }) {
  return (
    <div className="text-red-500 bg-red-100 border border-red-300 p-3 rounded-md text-center">
      {message}
    </div>
  );
}
