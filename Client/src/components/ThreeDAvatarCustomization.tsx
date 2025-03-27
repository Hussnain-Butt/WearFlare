import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Slider } from '@/components/ui/slider'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Camera, RotateCw, Upload, UserRound } from 'lucide-react'
import Navbar from './Navbar'
import ThreeDVideo from '../../public/3d.mp4'

const ThreeDAvatarCustomization = () => {
  const [height, setHeight] = useState(30)
  const [waistSize, setWaistSize] = useState(50)
  const [skinTone, setSkinTone] = useState(3) // 1-6 scale
  const [hairColor, setHairColor] = useState('#5a3825')

  // Body measurements
  const [measurements, setMeasurements] = useState({
    height: 180,
    weight: 75,
    chest: 100,
    waist: 80,
    hips: 95,
  })

  // Form inputs
  const [bodyFeatures, setBodyFeatures] = useState({
    skinTone: '',
    hairColor: '',
    eyeColor: '',
    bodyType: '',
  })

  const handleMeasurementChange = (key: string, value: string) => {
    setMeasurements({ ...measurements, [key]: parseInt(value) || 0 })
  }

  const handleFeatureChange = (key: string, value: string) => {
    setBodyFeatures({ ...bodyFeatures, [key]: value })
  }

  return (
    <div className="min-h-screen w-full background overflow-x-hidden py-20">
      <div className="absolute inset-0 bg-[#F8F6F2] z-0" />
      {/* Page Title */}
      <div className="relative z-10 flex flex-col items-center pt-6 text-[#c8a98a] mb-10">
        {/* Header Title Section */}
        <div className="flex items-center mb-3">
          <div className="w-10 h-10 flex items-center justify-center rounded-full bg-[#8C5F06] shadow-lg mr-3">
            <UserRound className="text-white w-5 h-5" />
          </div>
          <h1 className="text-4xl font-semibold tracking-wide text-[#c8a98a] drop-shadow-lg">
            Create Your 3D Avatar
          </h1>
        </div>

        {/* Subtitle Text */}
        <p className="text-base text-center text-black max-w-2xl px-4">
          Customize your avatar by changing the measurements and physical characteristics.
        </p>

        <div className="w-full flex justify-center mt-5">
          <Button className="bg-[#c8a98a] hover:bg-white text-white text-lg font-medium py-4 px-10 rounded-full">
            Try own
          </Button>
        </div>
      </div>

      {/* Main content */}
      <div className="relative z-10 flex flex-col items-center mt-4">
        {/* Avatar Customization Area */}
        <div className="w-full max-w-5xl bg-[#F8F6F2] rounded-lg p-10 mx-auto mb-4 shadow-lg">
          <div className="grid grid-cols-12 gap-4">
            {/* Left side controls */}
            <div className="col-span-3 flex flex-col justify-between">
              <div>
                <h3 className="text-[#c8a98a] font-bold mb-2">HEIGHT</h3>
                <div className="flex flex-col space-y-2">
                  <Slider
                    value={[height]}
                    min={0}
                    max={60}
                    step={1}
                    onValueChange={(value) => setHeight(value[0])}
                    className="py-4 bg-white rounded-full" // `rounded-full` makes it fully rounded
                    style={{
                      height: '10px', // Adjust thickness
                      borderRadius: '9999px', // Makes track rounded
                    }}
                  />
                </div>
                <div className="flex flex-col space-y-2">
                  <span className="text-[#c8a98a] font-bold text-lg">{height} in</span>
                </div>
              </div>

              <div className="mt-4">
                <h3 className="text-[#c8a98a] font-bold mb-2">SKIN TONE</h3>
                <div className="flex justify-between space-x-2 py-2">
                  {[1, 2, 3, 4, 5, 6].map((tone) => (
                    <button
                      key={tone}
                      className={`w-6 h-6 rounded-full ${
                        skinTone === tone ? 'ring-2 ring-white' : ''
                      }`}
                      style={{ backgroundColor: `hsl(30, 30%, ${70 - tone * 10}%)` }}
                      onClick={() => setSkinTone(tone)}
                    />
                  ))}
                </div>
              </div>
            </div>
            {/* Center avatar display */}
            <div className="col-span-6 flex flex-col items-center justify-center">
              <div className="relative w-full h-[400px] flex justify-center">
                <div className=" flex space-x-20 ">
                  <video
                    src={ThreeDVideo} // Ensure ThreeDVideo is the correct path or file
                    className="object-contain w-full h-full" // Ensure video scales correctly within the container
                    autoPlay
                    loop // This will make the video loop infinitely
                    muted // This will mute the video to avoid auto-play issues
                  />
                </div>
              </div>

              <Button className="mt-4 bg-[#6b5745]  text-[#c8a98a] px-8 py-2 absolute  rounded-full">
                Customize Avatar
              </Button>
            </div>

            {/* Right side controls */}
            <div className="col-span-3 flex flex-col justify-between">
              <div className="">
                <h3 className="text-[#c8a98a] font-bold mb-2">WAIST SIZE</h3>
                <div className="flex flex-col space-y-2">
                  <Slider
                    value={[waistSize]}
                    min={0}
                    max={100}
                    step={1}
                    onValueChange={(value) => setWaistSize(value[0])}
                    className="py-4 rounded-full bg-white"
                    style={{
                      height: '10px', // Adjust thickness
                      borderRadius: '9999px', // Fully rounded track
                    }}
                  />
                  {/* Display waist size value in custom color */}
                  <span className="text-[#c8a98a] font-semibold text-lg">{waistSize} cm</span>
                </div>
              </div>

              <div className="mt-8">
                <h3 className="text-[#c8a98a] font-bold mb-2">HAIR COLOR</h3>
                <div className="flex justify-between space-x-2 py-2">
                  {['#000000', '#5a3825', '#8b4513', '#d2b48c', '#f5deb3', '#dcdcdc'].map(
                    (color) => (
                      <button
                        key={color}
                        className={`w-6 h-6 rounded-full ${
                          hairColor === color ? 'ring-2 ring-white' : ''
                        }`}
                        style={{ backgroundColor: color }}
                        onClick={() => setHairColor(color)}
                      />
                    ),
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Measurement and Photo Section */}
        <div className="w-full max-w-5xl bg-[#F8F6F2] rounded-lg p-6 mx-auto mb-10 shadow-lg">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            {/* Photo Upload Section */}
            <div className="md:col-span-5 flex flex-col">
              <div className="flex items-center mb-4">
                <Camera className="h-6 w-6 text-[#c8a98a] mr-2" />
                <h3 className="text-[#c8a98a] font-bold text-lg">Photos</h3>
              </div>

              <div className="border border-[#6b5745] rounded-lg aspect-square flex flex-col items-center justify-center bg-[#6b5745] hover:bg-white transition-all text-[#c8a98a]">
                <Upload className="h-12 w-12 text-[#c8a98a] mb-2" />
                <p className="text-sm text-[#c8a98a]">Click or drag to upload</p>
                <Button
                  variant="outline"
                  className="mt-4 bg-[#6b5745] hover:bg-white text-[#c8a98a] border-none py-2 px-4"
                >
                  <Camera className="h-5 w-5 mr-2" />
                  Upload Photo
                </Button>
              </div>
            </div>

            {/* Measurements & Features Section */}
            <div className="md:col-span-7 flex flex-col">
              <h3 className="text-[#c8a98a] font-bold text-2xl mb-4 text-center">Measurement</h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {['height', 'weight', 'chest', 'waist', 'hips'].map((field) => (
                  <div key={field}>
                    <Label htmlFor={field} className="text-[#c8a98a] text-sm capitalize">
                      {field} (cm)
                    </Label>
                    <Input
                      id={field}
                      type="number"
                      value={measurements[field]}
                      onChange={(e) => handleMeasurementChange(field, e.target.value)}
                      className="bg-[#6b5745] border-[#6b5745] text-white rounded-md"
                    />
                  </div>
                ))}
              </div>

              <h3 className="text-[#c8a98a] font-bold text-2xl mt-6 mb-4 text-center">
                Body Features
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {['skinTone', 'hairColor', 'eyeColor', 'bodyType'].map((feature) => (
                  <div key={feature}>
                    <Label htmlFor={feature} className="text-[#c8a98a] text-sm capitalize">
                      {feature.replace(/([A-Z])/g, ' $1')}
                    </Label>
                    <Input
                      id={feature}
                      value={bodyFeatures[feature]}
                      onChange={(e) => handleFeatureChange(feature, e.target.value)}
                      className="bg-[#6b5745] border-[#6b5745] text-white rounded-md"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ThreeDAvatarCustomization
