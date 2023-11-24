import { useContext, useEffect, useState } from 'react'
import classes from './NavCartButton.module.css'
import CartContext from '../cart/cartContextAPI/CartContext'
const CartButton = (props) => {
    const cartCtx = useContext(CartContext)
    const [isHighlighted , setIsHighlighted] = useState(false)
    // const numOfCartItems = cartCtx.items.reduce((curNumber , item )=>{
    //     return curNumber + item.amount
        
    // },0)
    const {items} = cartCtx
    const numOfCartItems = cartCtx.items.length
    // console.log(numOfCartItems)
    const navCart = `${classes.cartlogo} ${isHighlighted ? classes.bump : ' '}`
    useEffect(()=>{
        if(items.length===0){
            return 
        }
        setIsHighlighted(true)
        const timer = setTimeout(()=>{
            setIsHighlighted(false)
        },300)
        return ()=>{
            clearTimeout(timer)
        }
    },[items])
    return (
        <>
            <div  className={navCart} onClick={props.onClick} >
                <i className="fa-solid fa-cart-shopping"></i>
                <span className={classes.cartspan}>{numOfCartItems}</span>
            </div>
        </>
    )
}
export default CartButton