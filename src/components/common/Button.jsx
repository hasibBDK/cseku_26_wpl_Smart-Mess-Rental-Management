export default function Button({
  children,
  variant = "primary",
  onClick,
  type = "button",
  className = "",
}) {
  const base =
    "font-body font-semibold text-sm px-5 py-3 rounded-sm inline-flex items-center gap-2 transition-opacity hover:opacity-90";

  const variants = {
    primary: "bg-marigold text-green-dark",
    outline: "bg-transparent border border-border text-ink",
    green: "bg-green text-white",
  };

  return (
    <button
      type={type}
      onClick={onClick}
      className={`${base} ${variants[variant]} ${className}`}
    >
      {children}
    </button>
  );
}