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


router.post('/products', (req, res) => {

    let limit = req.body.limit ? parseInt(req.body.limit) : 100
    let skip = req.body.skip ? parseInt(req.body.skip) : 0

    let findArg = {}

    for(let key in req.body.filters) {
        console.log(key + " : " + req.body.filters[key].length)
        if(req.body.filters[key].length > 0) {
            findArg[key] = req.body.filters[key]
        }

    }

    console.log('findArgs', findArg)

    // 상품 List
    Product.find(findArg)
        .populate('writer')
        .skip(skip)
        .limit(limit)
        .exec((err, items) => {
            if(err) return res.status(400).json({success: false, err})
            return res.status(200).json({success: true, postSize: items.length, items})
        })

})

module.exports = router;
