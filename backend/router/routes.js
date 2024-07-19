import { Router } from "express";
import { newToken, saveEmail, saveName, setAvatar, signin, signup } from "../controllers/UserController.js";
import { addNote, deleteNote, deleteNotePermanently, getDeletedNotes, getNotes, restoreNote, updateNote } from "../controllers/NotesController.js";
import { check } from "../middleware/authMiddleware.js";


const router = Router()

// UserRoutes
router.route("/signup").post(signup)
router.route("/signin").post(signin)
router.route("/newToken").get(check, newToken)

// NotesRoutes
router.route("/getNotes").get( check, getNotes)
router.route("/getDeletedNotes").get( check, getDeletedNotes)
router.route('/newNote').post(check, addNote); 
router.route("/deleteNote").put(check, deleteNote)
router.route("/restoreNote").put(check, restoreNote)
router.route("/updateNote").put(check, updateNote)
router.route("/deleteNotePermanently").put(check, deleteNotePermanently)
router.route("/saveName").put(check, saveName)
router.route("/saveEmail").put(check, saveEmail)
router.route("/setAvatar").put(check, setAvatar)

export default router