import React from 'react'
import { Link } from 'react-router-dom'
import { Button } from './ui/button'
import discover from '../../public/Contact Us 1.png'
import boySection from '../../public/Group 47.png'
import computerizedImage from '../assets/model-video.mp4'
import AnimatedSection from './AnimatedSection'

const FashionRevolution = () => {
  return (
    <section className="w-full">
      <AnimatedSection direction="left">
        {/* Top Section - Join the Revolution */}
        <div className="flex flex-col md:flex-row m-8 my-40">
          {/* Card Section - Takes Half Width */}
          <div className="bg-[#d6d0c4] p-8 md:p-12 md:w-1/2">
            <h2 className="text-2xl md:text-3xl font-serif  font-bold text-[#3a3a3a] mb-4">
              Join the Revolution
            </h2>
            <p className="text-[#4a4a4a] mb-6 text-3xl">
              Don't just wear clothes; wear your personality! Join the WearFlare revolution and
              express yourself like never before. Let's make fashion fun again!
            </p>
            <Link to="/avatar-creation">
              <Button className="bg-[#8D7253]  text-2xl hover:bg-[#7d654a] text-white rounded-full p-3 px-9">
                Create Now
              </Button>
            </Link>
          </div>

          {/* Image Section - Full Width */}
          <div className="md:w-1/2 relative overflow-hidden">
            <video
              src={computerizedImage} // Ensure ThreeDVideo is the correct path or file
              className="object-contain w-full h-full" // Ensure video scales correctly within the container
              autoPlay
              loop // This will make the video loop infinitely
              muted // This will mute the video to avoid auto-play issues
            />
          </div>
        </div>

        {/* Boy Section - Positioned Half on Both Sections */}

        <div className="relative w-full">
          <div className="m-8 relative">
            <AnimatedSection direction="right">
              <img
                src={boySection}
                className="h-96 absolute left-20 top-1/2 -translate-y-1/2 z-10"
                alt=""
              />
            </AnimatedSection>
          </div>
        </div>

        {/* Bottom Section - Fashion Reinvented */}
        <div className="relative w-full h-screen">
          {/* Background Image */}
          <div
            className="absolute inset-0 bg-no-repeat bg-cover bg-center"
            style={{ backgroundImage: `url('/Contact Us 1.png')` }}
          ></div>

          {/* Content Section - Positioned Bottom-Left */}
          <div className="absolute bottom-12 left-12 max-w-lg px-8 md:px-12 text-white">
            <h2 className="text-3xl md:text-4xl font-serif mb-4">
              Discover the allure of fashion reinvented!
            </h2>
            <p className="text-gray-300 mb-8">
              Dive into a world of style with our latest collection! Shop now and redefine your
              wardrobe narrative!
            </p>
            <Link to="/shop">
              <Button className="bg-[#8D7253] hover:bg-[#7d654a] text-white uppercase rounded-full px-8">
                Shop Now
              </Button>
            </Link>
          </div>
        </div>
      </AnimatedSection>
    </section>
  )
}

export default FashionRevolution
