var express = require('express');
var router = express.Router();
const admin = require("firebase-admin");
const moment = require('moment');
const { Timestamp } = require('firebase-admin/firestore');
const db = admin.firestore();
// const usersRef = db.collection("users");
const receiptsRef = db.collection("receipts");

router.get('/all/:userId', async function(req, res, next) {
    try {
        const userId = req.params.userId;
        const allReceipts = [];
        const receipts = await receiptsRef.where('userId', '==', userId).get();
        receipts.forEach(receipt => {
            allReceipts.push(receipt.data());
        });
        var receiptsAll = allReceipts.reduce(function (acc, obj) {
            console.log('Values: ', acc, obj);
            var key = obj.date;
            if (!acc[key]) {
              acc[key] = [];
            }
            acc[key].push(obj);
            return acc;
          }, {});
        res.status('200').send({ 'data': receiptsAll });
    } catch (error) {
        res.status('500').send({ 'error': error });
    }

});

router.get('/details', async function(req, res, next) {
    try {
        const docId = req.query.docId;
        const receipts = await receiptsRef.doc(docId).get();
        res.status('200').send({ 'data': receipts.data() });
    } catch (error) {
        res.status('500').send({ 'error': error });
    }

});

router.post('/create', async function(req, res, next) {
    try {
        const docRef = receiptsRef.doc();
        const newReceipt = {
          id: docRef.id,
          ...req.body,
          date: moment(Date.now()).format('YYYY-MM-DD'),
          createdAt: Timestamp.now()
        };
        await docRef.set(newReceipt);
        res.status('200').send({ 'status': 'OK' });
    } catch (error) {
        console.log('Body: ', req.body);
        res.status('500').send({ 'error': error });
    }

});

router.put('/update', async function(req, res, next) {
    try {
        const docId = req.query.docId;
        const docRef = await receiptsRef.doc(docId);
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

router.delete('/', async function(req, res, next) {
    try {
        const docId = req.query.docId;
        await receiptsRef.doc(docId).delete();
        res.status('200').send({ 'status': 'OK' });
    } catch (error) {
        res.status('500').send({ 'error': error });
    }

});

module.exports = router;
