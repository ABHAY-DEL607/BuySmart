const express = require('express');
const router = express.Router();

router.post('/add', (req, res) => {
    console.log(req.body);
    res.send('response from user add');
});

// : denotes url parameter
router.get('/getbyemail/:email', (req,res) => {
    console.log(req.params.email)
    res.send('response from user getbyemail');
});

// getall
 router.get('/getall', (req, res) => {
    res.send('response from user getall');
});

// getbyid
router.get('/getbyid', (req, res) => {
    res.send('response from user getbyid');
});

// update
router.put('/update', (req, res) => {
    res.send('response from user update');
});

// delete
router.delete('/delete', (req, res) => {
    res.send('response from user delete');
});

module.exports = router;