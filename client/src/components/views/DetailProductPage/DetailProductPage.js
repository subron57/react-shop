import Axios from 'axios'
import React, {useEffect, useState} from 'react'
import ProductImage from './sections/ProductImage'
import ProductInfo from './sections/ProductInfo'
import { Row, Col } from 'antd'

function DetailProductPage(props) {
    
    const productId = props.match.params.productId
    const [Product, setProduct] = useState({})


    useEffect(() => {
        Axios.get(`/api/product/productById?id=${productId}&type=single`)
            .then(response => {
                setProduct(response.data[0])
            })
            .catch(err => alert(err))
    }, [])

    return (
        <div style={{ width: '100%', padding: '3rem 4rem'}}>
            <div style={{ display: 'flex', justifyContent: 'center'}}>
                <h1>{Product.title}</h1>
            </div>
            <br />

            <Row gutter={[16, 16]}>
                <Col lg={12} sm={24}>
                    { /* ProductImage */}
                    <ProductImage detail={Product} />
                </Col>

                <Col lg={12} sm={24}>
                    { /* ProductInfo */}
                    <ProductInfo detail={Product} />
                </Col>

            </Row>
            
        </div>
    )
}

export default DetailProductPage
