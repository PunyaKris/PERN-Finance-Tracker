import { useState } from "react";
import "./DeleteConformation.css";

const DeleteConformation = ({ deleteHandler, cancelHandler }) => {
  const [deleteError, setDeleteError] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  async function confirmDeleteHandler() {
    if (isDeleting) {
      return;
    }

    setDeleteError("");
    setIsDeleting(true);

    try {
      await deleteHandler();
    } catch (error) {
      setDeleteError("We couldn't delete this item right now. Please try again.");
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <div className="delete-confirmation">
      <div className="delete-confirmation__icon">!</div>

      <div className="delete-confirmation__content">
        <h3 className="delete-confirmation__title">Delete this item?</h3>
        <p className="delete-confirmation__text">
          This action cannot be undone. The selected budget or transaction will
          be permanently removed.
        </p>
      </div>

      {deleteError ? (
        <p className="delete-confirmation__error" role="alert">
          {deleteError}
        </p>
      ) : null}

      <div className="delete-confirmation__actions">
        <button
          className="delete-confirmation__button delete-confirmation__button--secondary"
          onClick={() => cancelHandler()}
          disabled={isDeleting}
          type="button"
        >
          Cancel
        </button>
        <button
          className="delete-confirmation__button delete-confirmation__button--danger"
          onClick={confirmDeleteHandler}
          disabled={isDeleting}
          type="button"
        >
          {deleteError ? "Retry Delete" : "Delete"}
        </button>
      </div>
    </div>
  );
};

export default DeleteConformation;
