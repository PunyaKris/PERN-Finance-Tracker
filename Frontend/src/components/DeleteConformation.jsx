const DeleteConformation = ({ deleteHandler, cancelHandler }) => {
  return (
    <>
      <label>Are You Sure About This Delete?</label>
      <button onClick={() => deleteHandler()}> Yes </button>
      <button onClick={() => cancelHandler()}> No </button>
    </>
  );
};

export default DeleteConformation;
