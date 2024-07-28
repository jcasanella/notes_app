import { default as express } from 'express';
import { notesStore } from '../app.mjs';

export const router = express.Router();

// Add Note
router.get('/add', (req, res, next) => {
    res.render('noteEdit', {
        title: 'Add a Note',
        doCreate: true,
        noteKey: '',
        note: undefined,
    });
});

// Save Note
router.post('/save', async (req, res, next) => {
    try {
        let note;
        const { noteKey, title, body } = req.body;
        if (req.body.doCreate === 'create') {
            note = await notesStore.create(noteKey, title, body);
        } else {
            note = await notesStore.update(noteKey, title, body);
        }
        res.redirect('/notes/view?key=' + noteKey);
    } catch (error) {
        next(error);
    }
});

// Read Note
router.get('/view', async (req, res, next) => {
    try {
        let note = await notesStore.read(req.query.key);
        res.render('noteView', {
            title: note ? note.title : '',
            noteKey: req.query.key,
            note,
        });
    } catch (error) {
        next(error);
    }
});
