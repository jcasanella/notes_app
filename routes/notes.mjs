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

// Edit note (update)
router.get('/edit', async (req, res, next) => {
    try {
        const note = await notesStore.read(req.query.key);
        res.render('noteEdit', {
            title: note ? 'Edit ' + note.title : 'Add a Note',
            doCreate: false,
            noteKey: req.query.key,
            note,
        });
    } catch (error) {
        next(error);
    }
});

// Ask to delete note (destroy)
router.get('/destroy', async (req, res, next) => {
    try {
        const note = await notesStore.read(req.query.key);
        res.render('noteDestroy', {
            title: note ? note.title : '',
            noteKey: req.query.key,
            note,
        });
    } catch (error) {
        next(error);
    }
});

// Really destroy note (Destroy)
router.post('/destroy/confirm', async (req, res, next) => {
    try {
        await notesStore.destroy(req.body.noteKey);
        res.redirect('/');
    } catch (error) {
        next(error);
    }
});
