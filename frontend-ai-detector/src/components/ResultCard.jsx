export default function ResultCard({ title, children }) {
  return (
    <div className="mt-6 p-4 border bg-white shadow rounded">
      <h3 className="font-semibold mb-2">{title}</h3>
      <div>{children}</div>
    </div>
  );
}
