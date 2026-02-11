import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import Zoom from "@mui/material/Zoom";

function Note({ title, content, deleteNote, editNote }) {
  return (
    <div className="note">
      <h1 className="note-title">{title}</h1>
      <p className="note-content">{content}</p>
      <div>
        <Zoom in={true}>
          <div className="note-actions">
            <button
              className="edit-btn"
              onClick={editNote}
              aria-label="edit note"
              title="Edit"
            >
              <EditIcon />
            </button>

            <button
              className="delete-btn"
              onClick={deleteNote}
              aria-label="delete note"
              title="Delete"
            >
              <DeleteIcon />
            </button>
          </div>
        </Zoom>
      </div>
    </div>
  );
}

export default Note;
