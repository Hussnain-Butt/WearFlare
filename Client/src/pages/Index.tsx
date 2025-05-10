import React from 'react'
import { Link } from 'react-router-dom'
import { Search, User, ShoppingCart, Heart, ShoppingBag } from 'lucide-react'
import Footer from '../components/Footer'
import FashionRevolution from '../components/FashionRevolution'
import autoumnPic from '../assets/Autum-banner.png'
import autoumnPic2 from '../assets/banner-home.jpg'

import StudioShowcase from '../components/StudioShowcase'
import girlImage from '../../public/girl-image.png'
import FashionShowcase from '@/components/FashionShowcase'
import StyleHere from '@/components/StyleHere'
import { Button } from '@/components/ui/button'
import Navbar from '@/components/Navbar'
import Features from '@/components/Features'
import PopularSection from '@/components/PopularSection'
import Faqs from '@/components/Faqs'
import banner1 from '../../public/banner-1.jpg'
import banner2 from '../../public/banner-2.jpg'
import banner3 from '../../public/banner-3.jpg'
import PerfectOutfitSection from '@/components/PerfectOutfitSection'
import SubscriptionPopup from '@/components/SubscriptionPopup'
import ThemeSwitcher from '@/components/ThemeSwitcher'

const Index = () => {
  return (
    <div className="min-h-screen bg-background my-10">
      <ThemeSwitcher />
      <StyleHere />

      {/* Most Popular Section */}
      <PopularSection />
      <PerfectOutfitSection />

      {/* Fashion Revolution Component */}
      <FashionRevolution />

      <Faqs />

      <div className="my-10">
        <FashionShowcase />
      </div>
      {/* <img src={autoumnPic2} alt="" className="my-8 w-full" /> */}

      <Features />
      <SubscriptionPopup />
      {/* Autumn Fashion Sale Banner */}
      <img src={autoumnPic} alt="" className="my-8 w-full" />
      {/* <AutumnFashionSale  /> */}
    </div>
  )
}

export default Index
