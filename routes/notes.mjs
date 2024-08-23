import { default as express } from 'express';
import { notesStore } from '../app.mjs';
import { runAsyncWrapper } from './routessupport.mjs';

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
router.post(
    '/save',
    runAsyncWrapper(async (req, res, next) => {
        const { noteKey, title, body } = req.body;
        if (req.body.doCreate === 'create') {
            await notesStore.create(noteKey, title, body);
        } else {
            await notesStore.update(noteKey, title, body);
        }
        res.redirect('/notes/view?key=' + noteKey);
    })
);

// Read Note
router.get(
    '/view',
    runAsyncWrapper(async (req, res, next) => {
        let note = await notesStore.read(req.query.key);
        res.render('noteView', {
            title: note ? note.title : '',
            noteKey: req.query.key,
            note,
        });
    })
);

// Edit note (update)
router.get(
    '/edit',
    runAsyncWrapper(async (req, res, next) => {
        const note = await notesStore.read(req.query.key);
        res.render('noteEdit', {
            title: note ? 'Edit ' + note.title : 'Add a Note',
            doCreate: false,
            noteKey: req.query.key,
            note,
        });
    })
);

// Ask to delete note (destroy)
router.get(
    '/destroy',
    runAsyncWrapper(async (req, res, next) => {
        const note = await notesStore.read(req.query.key);
        res.render('noteDestroy', {
            title: note ? `Delete ${note.title}` : '',
            noteKey: req.query.key,
            note,
        });
    })
);

// Really destroy note (Destroy)
router.post(
    '/destroy/confirm',
    runAsyncWrapper(async (req, res, next) => {
        await notesStore.destroy(req.body.noteKey);
        res.redirect('/');
    })
);
