const $noteTitle =$(".note-title");
const $noteText = $(".note-textarea");
const $saveNoteBtn =$(".save-note");
const $newNoteBtn =$(".list-container .list-group");

//activeNote is used to keep track of the note in the textarea
let activeNotes ={};

const getNotes = () => {
  return $.ajax({
    url: "/api/notes",
    data:note,
    method:"GET",
  });
};

const saveNotes =(notes) => {
  return $.ajax({
    url: "/api/notes",
    data:note,
    method:"POST",
  });
};

const deleteNotes =(id) => {
  return $.ajax({
    url:"/api/notes",
    data:note,
    method:"DELETE",
  });
};


const renderActiveNote = () => {
  saveNoteBtn.hide();

  if (activeNote.id) {
    $noteTitle.setAttribute("readonly", true);
    $noteText.setAttribute("readonly", true);
    $noteTitle.value = activeNote.title;
    $noteText.value = activeNote.text;
  } else {
    $noteTitle.removeAttribute("readonly", false);
    $noteText.removeAttribute("readonly", false);
    $noteTitle.val("");
    $noteText.val ("");
  }
};

const handleNoteSave = () => {
  const newNotes = {
    title: $noteTitle.val(),
    text: $noteText.val(),
  };
  saveNotes(newNotes).then(() => {
    getAndRenderNotes();
    renderActiveNotes();
  });
};

// Delete the clicked note
const handleNoteDelete = function (event) {
  // Prevents the click listener for the list from being called when the button inside of it is clicked
  event.stopPropagation();

  const notes =$(this).parent(".list-group-item").data();

  if (activeNotes.id === notes.id) {
    activeNotes = {};
  }

  deleteNotes(notes.id).then(() => {
    getAndRenderNotes();
    renderActiveNotes();
  });
};

// Sets the activeNote and displays it
const handleNoteView = (e) => {
  e.preventDefault();
  activeNotes = JSON.parse(e.target.parentElement.getAttribute('data-notes'));
  renderActiveNotes();
};

// Sets the activeNote to and empty object and allows the user to enter a new note
const handleNewNoteView = (e) => {
  activeNotes = {};
  renderActiveNotes();
};

const handleRenderSaveBtn = () => {
  if (!noteTitle.value.trim() || !noteText.value.trim()) {
    hide(saveNoteBtn);
  } else {
    show(saveNoteBtn);
  }
};

// Render the list of note titles
const renderNoteList = async (notes) => {
  let jsonNotes = await notes.json();
  if (window.location.pathname === '/notes') {
    noteList.forEach((element) => (element.innerHTML = ''));
  }

  let noteListItems = [];

  // Returns HTML element with or without a delete button
  const createLi = (text, delBtn = true) => {
    const $li = $("<li class='list-group-items'>");
    const $span =$("<span>").text(text);
    $li.append($span);


    if (withdelBtn) {
      const $delBtn = $ (
        "<i class ='fas fa-trash-alt float-right text-danger delete-note'>"
      );
      $li.append($delBtn);
    }

    return $li;
  };

  if (jsonNotes.length === 0) {
    noteListItems.push(createLi('No saved Notes', false));
  }

  jsonNotes.forEach((note) => {
    const $li = createLi(note.title).data(note);
   noteListItems.push($li);
  });

  $noteList.append(noteListItems);
};

// Gets notes from the db and renders them to the sidebar
const getAndRenderNotes = () => {
  return getNotes().then(renderNoteList);
};

  $saveNoteBtn.on("click", handleNoteSave);
  $noteList.on("click", ".list-group-item", handleNoteView);
  $newNoteBtn.on("click", handleNewNoteView);
  $noteList.on("click", ".delete-note", handleNoteDelete);
  $noteTitle.on('keyup', handleRenderSaveBtn);
  $noteText.on('keyup', handleRenderSaveBtn);


getAndRenderNotes();
