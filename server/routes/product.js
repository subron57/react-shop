const express = require('express')
const router = express.Router()
const multer = require('multer')
const { Product } = require('../models/Product')

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/')
    },
    filename: function (req, file, cb) {
        cb(null, `${Date.now()}_${file.originalname}`)
    }
})

const upload = multer({ storage: storage }).single("file")


//=================================
//             Product
//=================================


router.post('/image', (req, res) => {

    // 이미지 저장
    upload(req, res, err => {
        if(err){
            return res.json({ success: false, err})
        }
        return res.json({ success: true, filePath: res.req.file.path, fileName: res.req.file.filename})
    })

})


router.post('/', (req, res) => {

    // 상품 저장
    const product = new Product(req.body)

    product.save((err) => {
        if(err) return res.status(400).json({success: false, err})
        return res.status(200).json({success: true})
    })    

})


module.exports = router;
