import React from 'react'
import { Heading } from '../Component/Heading'
import Detail from '../Component/ProductDetail/Detail'
import ProductTabs from '../Component/ProductDetail/ProductTabs'
import RelatedProducts from '../Component/ProductDetail/RelatedProducts'

export const DetailPage = () => {
  return (
    <div>
        <Heading/>
        <Detail/>
        <ProductTabs/>
        <RelatedProducts/>
    </div>
  )
}
