import { ShoppingCart } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../lib/cart";

export default function CartButton() {
  const { count } = useCart();
  const navigate = useNavigate();
  return (
    <button
      onClick={() => navigate("/cart-review")}
      className="fixed bottom-5 right-5 md:bottom-6 md:right-6 z-[70] rounded-full bg-white/10 p-3 ring-1 ring-white/20 backdrop-blur hover:bg-white/15 shadow-lg"
      style={{
        insetInlineEnd: "max(env(safe-area-inset-right), 1.25rem)",
        insetBlockEnd: "max(env(safe-area-inset-bottom), 1.25rem)",
      }}
      aria-label="Cart"
      title="Cart"
    >
      <div className="relative">
        <ShoppingCart className="h-5 w-5 text-white" />
        {count > 0 && (
          <span className="absolute -top-2 -right-2 grid h-5 min-w-[1.25rem] place-items-center rounded-full bg-emerald-400 px-1 text-xs font-semibold text-emerald-950">
            {count}
          </span>
        )}
      </div>
    </button>
  );
}
