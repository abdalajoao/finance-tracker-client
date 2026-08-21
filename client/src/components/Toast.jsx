import { useEffect } from "react";

function Toast({ message, type, onClose }) {
  const colorClass =
    type === "success"
      ? "bg-green-100 text-green-700"
      : "bg-red-100 text-red-700";

  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000);

    return () => {
      clearTimeout(timer);
    };
  }, [onClose]);

  return (
    <div className={colorClass}>
      {message}
    </div>
  );
}

export default Toast;