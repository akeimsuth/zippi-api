var express = require('express');
var router = express.Router();
const admin = require("firebase-admin");
const { Timestamp } = require('firebase-admin/firestore');
const db = admin.firestore();
const usersRef = db.collection("users");

router.post('/', async (req, res) => {
    try {
      const docRef = usersRef.doc();
      const newUser = {
        id: docRef.id,
        ...req.body,
        createdAt: Timestamp.now()
      };
      await docRef.set(newUser);
      res.status('200').send({ 'status': 'OK' });
    } catch (error) {
        console.log('Body: ', req.body);
        res.status('500').send({ 'error': error });
    }
  });

  module.exports = router;