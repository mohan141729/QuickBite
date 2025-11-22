export const AlertToast = ({ type, message, onClose }) => {
  const bg =
    type === "success"
      ? "bg-green-500"
      : type === "error"
      ? "bg-red-500"
      : "bg-gray-500";

  return (
    <div
      className={`${bg} text-white px-4 py-2 rounded-md fixed top-5 right-5 shadow-lg flex items-center justify-between gap-4 z-50`}
    >
      <span>{message}</span>
      <button onClick={onClose} className="font-bold">✕</button>
    </div>
  );
};
