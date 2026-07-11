import { useEffect } from "react";
import "./Modal.css";

const Modal = ({ children, isOpen = true, onClose }) => {
  useEffect(() => {
    // prevent background scroll while modal is mounted
    const originalOverflow = document.body.style.overflow;
    if (isOpen) document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [isOpen]);

  useEffect(() => {
    function onKey(e) {
      if (e.key === "Escape" && onClose) onClose();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="modal__backdrop"
      onMouseDown={(e) => {
        // close when clicking backdrop (only when clicking outside dialog)
        if (e.target === e.currentTarget && onClose) onClose();
      }}
    >
      <div className="modal__dialog" role="dialog" aria-modal="true">
        {children}
      </div>
    </div>
  );
};

export default Modal;
