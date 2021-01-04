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
    let term = req.body.searchTerm

    let findArg = {}

    for(let key in req.body.filters) {
        console.log(key + " : " + req.body.filters[key].length)
        if(req.body.filters[key].length > 0) {

            if(key === "price") {
                findArg[key] = {
                    $gte: req.body.filters[key][0],
                    $lte: req.body.filters[key][1]
                }
            } else {
                findArg[key] = req.body.filters[key]
            }
        }

    }

    console.log('findArgs', findArg)

    // 상품 List
    if(term) {
        Product.find(findArg)
            .find({ $text: { $search: term }})
            .populate('writer')
            .skip(skip)
            .limit(limit)
            .exec((err, items) => {
                if(err) return res.status(400).json({success: false, err})
                return res.status(200).json({success: true, postSize: items.length, items})
            })
    } else {
        Product.find(findArg)
            .populate('writer')
            .skip(skip)
            .limit(limit)
            .exec((err, items) => {
                if(err) return res.status(400).json({success: false, err})
                return res.status(200).json({success: true, postSize: items.length, items})
            })
    }

})


router.get('/productById', (req, res) => {

    // 상품 상세
    let type = req.query.type
    let productIds = req.query.id

    if(type === 'array') {
        let ids = req.query.id.split(',')
        productIds = ids.map(item => {
            return item
        })
    }

    Product.find({_id: {$in:productIds}})
        .populate('writer')
        .exec((err, product) => {
            if(err) return res.status(400).json({success: false, err})
            return res.status(200).json({success: true, product})
        })

})


module.exports = router;
