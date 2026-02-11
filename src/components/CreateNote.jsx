import { useRef, useEffect } from "react";
import AddIcon from "@mui/icons-material/Add";
import SaveIcon from "@mui/icons-material/Save";
import CloseIcon from "@mui/icons-material/Close";
import Zoom from "@mui/material/Zoom";

export default function CreateNote({
  submitNote,
  currentNote,
  handleChange,
  isExpanded,
  setIsExpanded,
  cancelEdit,
}) {
  const titleInputRef = useRef(null);

  // Focus on title input when form expands
  useEffect(() => {
    if (isExpanded && titleInputRef.current) {
      titleInputRef.current.focus();
    }
  }, [isExpanded]);

  const isEditing = Boolean(currentNote && currentNote.id);

  return (
    <div>
      <form onSubmit={submitNote}>
        {isExpanded && (
          <input
            ref={titleInputRef}
            name="title"
            placeholder="Title"
            value={currentNote.title}
            onChange={handleChange}
          />
        )}

        <textarea
          name="content"
          placeholder="Take a note..."
          rows={isExpanded ? "3" : "1"}
          value={currentNote.content}
          onChange={handleChange}
          onClick={() => setIsExpanded(true)}
        />

        <Zoom in={isExpanded}>
          <div className="zoom-actions">
            {isEditing && (
              <button
                type="button"
                className="cancel-btn"
                onClick={cancelEdit}
                title="Cancel edit"
              >
                <CloseIcon />
              </button>
            )}

            <button type="submit" className="submit-btn">
              {isEditing ? <SaveIcon /> : <AddIcon />}
            </button>
          </div>
        </Zoom>
      </form>
    </div>
  );
}
