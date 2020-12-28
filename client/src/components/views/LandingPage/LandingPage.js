import Axios from 'axios';
import React, {useEffect, useState} from 'react'
import { Icon, Col, Card, Row, Carousel} from 'antd'
import Meta from 'antd/lib/card/Meta'
import ImageSlider from '../../utils/ImageSlider'
import CheckBox from './Section/CheckBox'
import RadioBox from './Section/RadioBox'
import {continents, price} from './Section/Datas'

function LandingPage() {

    const [Products, setProducts] = useState([])
    const [Skip, setSkip] = useState(0)
    const [Limit, setLimit] = useState(8)
    const [PostSize, setPostSize] = useState(null)
    const [Filters, setFilters] = useState({
        continents: [],
        price: []
    })

    useEffect(() => {
        let body = {
            skip: Skip,
            limit: Limit
        }

        getProducts(body)
        
    }, [])

    const loadMoreHandler = () => {

        let skip = Skip + Limit

        let body = {
            skip: skip,
            limit: Limit,
            loadMore: true
        }

        getProducts(body)
        setSkip(skip)
    }

    const getProducts = (body) => {

        Axios.post('/api/product/products', body)
        .then(response => {
            if(response.data.success) {
                console.log(response.data)
                if(body.loadMore){
                    setProducts([...Products, ...response.data.items])
                } else {
                    setProducts(response.data.items)
                }
                setPostSize(response.data.postSize)
            } else {
                alert('data get err')
            }
        })

    }


    const renderCard = Products.map((product, index) => {
        console.log('product', product)
        return  <Col lg={6} md={8} xs={24} key={index}>
                <Card 
                    cover={<ImageSlider images={product.images}/>}
                >
                    <Meta 
                        title={product.title}
                        description={`$${product.price}`}
                    />
                </Card>
            </Col>
    })

    const showFilteredResult = (filters) => {
        let body = {
            skip: 0,
            limit: Limit,
            filters: filters
        }

        getProducts(body)
        setSkip(0)
    }

    const handleFilters = (filters, category) => {
        const newFilters = { ...Filters }
        newFilters[category] = filters

        console.log(newFilters);
        showFilteredResult(newFilters)
    }

    return (
        <div style={{ width: '75%', margin: '3rem auto'}}>
            <div style={{ textAlign: 'center'}}>
                <h2>
                    Let's Travel Anywhere <Icon type="rocket" />
                </h2>
            </div>
            
                {/* Filter */}

                <Row gutter={[16, 16]} >
                    <Col lg={12} xs={24}>
                        {/* CheckBox */}
                        <CheckBox list={continents} handleFilters={filters => handleFilters(filters, "continents")} />
                    </Col>
                    <Col lg={12} xs={24}>
                        {/* RadioBox */}                    
                        <RadioBox list={price} handleFilters={filters => handleFilters(filters, "price")} />
                    </Col>
                </Row>

                {/* Search */}

                {/* Cards */}
                <Row gutter={16, 16}>
                    {renderCard}
                </Row>
                
            {PostSize >= Limit && 
                <div style={{ display: 'flex', justifyContent: 'center'}}>
                    <button onClick={loadMoreHandler}>더보기</button>
                </div>
            }
            
        </div>
    )
}

export default LandingPage
