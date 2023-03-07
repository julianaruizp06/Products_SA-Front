import React from 'react'
import { Badge } from 'react-bootstrap';

const Cupon = ({ promo, onClick }) => {
    return (
        <div className='d-flex flex-wrap'>
            <Badge color="primary" onClick={() => onClick(promo[0])}>
                {promo[0]}%
            </Badge>
            <Badge color="primary" onClick={() => onClick(promo[1])}>
                {promo[1]}%
            </Badge>
            <Badge color="primary" onClick={() => onClick(promo[2])}>
                {promo[2]}%
            </Badge>
        </div>
    )
}

export default Cupon

Cupon.defaultProps = {
    promo: [10, 20, 30]
}