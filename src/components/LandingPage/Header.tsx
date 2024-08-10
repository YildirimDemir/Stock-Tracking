import React from 'react';
import Style from './header.module.css';
import Image from 'next/image';
import iconOne from '../../../public/images/icons/home1.png';
import iconTwo from '../../../public/images/icons/home2.png'
import iconThree from '../../../public/images/icons/home3.png'

export default function Header() {
  return (
    <div className={Style.header}>
        <h1>STOCK TRACKING</h1>
        <p>LIST AND TRACK YOUR STOCKS</p>
        <div className={Style.icons}>
        <Image src={iconOne} alt='' className={Style.iconOne}/>
        <Image src={iconTwo} alt='' className={Style.iconTwo}/>
        <Image src={iconThree} alt='' className={Style.iconThree}/>
        </div>
    </div>
  )
}
