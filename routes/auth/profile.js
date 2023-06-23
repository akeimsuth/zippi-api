var express = require('express');
var router = express.Router();
const admin = require("firebase-admin");
const { Timestamp } = require('firebase-admin/firestore');
const db = admin.firestore();
const usersRef = db.collection("users");

router.get('/', async (req, res) => {
    try {
        const docId = req.query.docId;
        const user = await usersRef.doc(docId).get();
        res.status('200').send({ 'data': user.data() });
    } catch (error) {
        res.status('500').send({ 'error': error });
    }
});

router.put('/', async function(req, res, next) {
    try {
        const docId = req.query.docId;
        const docRef = await usersRef.doc(docId);
        await docRef.update({
            ...req.body,
            updatedAt: Timestamp.now()
        });
        res.status('200').send({ 'status': 'OK' });
    } catch (error) {
        console.log('Body: ', req.body);
        res.status('500').send({ 'error': error });
    }

});

  module.exports = router;