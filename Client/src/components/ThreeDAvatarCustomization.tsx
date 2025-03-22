
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Camera, RotateCw, Upload, UserRound } from 'lucide-react';
import Navbar from './Navbar';
import ThreeDImage from "../../public/3d-img.png"

const ThreeDAvatarCustomization = () => {
  const [height, setHeight] = useState(30);
  const [waistSize, setWaistSize] = useState(50);
  const [skinTone, setSkinTone] = useState(3); // 1-6 scale
  const [hairColor, setHairColor] = useState("#5a3825");
  
  // Body measurements
  const [measurements, setMeasurements] = useState({
    height: 180,
    weight: 75,
    chest: 100,
    waist: 80,
    hips: 95
  });
  
  // Form inputs
  const [bodyFeatures, setBodyFeatures] = useState({
    skinTone: "",
    hairColor: "",
    eyeColor: "",
    bodyType: ""
  });
  
  const handleMeasurementChange = (key: string, value: string) => {
    setMeasurements({ ...measurements, [key]: parseInt(value) || 0 });
  };
  
  const handleFeatureChange = (key: string, value: string) => {
    setBodyFeatures({ ...bodyFeatures, [key]: value });
  };

  return (
    <div className="min-h-screen w-full background overflow-x-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-[#231539] via-[#3A2160] to-[#17112A] z-0" />
      
      {/* Navigation section */}
      <Navbar />
      
      {/* Page Title */}
      <div className="relative z-10 flex flex-col items-center pt-4 text-white">
        <div className='flex '>
        <div className="w-6 h-6 rounded-full bg-white mt-1 mr-2"> <UserRound className='text-purple-800' />  </div>
        <h1 className="text-3xl font-serif font-bold ">Create Your 3D Avatar</h1>
        </div>
       
        <p className="text-sm text-center text-gray-300 max-w-xl">
          Customize your avatar by changing the measurements and physical characteristics
        </p>
      </div>
      
      {/* Main content */}
      <div className="relative z-10 flex flex-col items-center mt-4">
        {/* Avatar Customization Area */}
        <div className="w-full max-w-5xl bg-gradient-to-b from-[#81A1C1]/20 to-[#5E81AC]/20 rounded-lg p-4 mx-auto mb-4">
          <div className="grid grid-cols-12 gap-4">
            {/* Left side controls */}
            <div className="col-span-3 flex flex-col justify-between">
              <div>
                <h3 className="text-white font-bold mb-2">HEIGHT</h3>
                <div className="flex flex-col space-y-2">
                <Slider
                  value={[height]}
                  min={0}
                  max={60}
                  step={1}
                  onValueChange={(value) => setHeight(value[0])}
                  className="py-4 bg-white rounded-full" // `rounded-full` makes it fully rounded
                  style={{
                    height: "10px", // Adjust thickness
                    borderRadius: "9999px", // Makes track rounded
                  }}
                />
              </div>
              <div className="flex flex-col space-y-2">
                  <span className="text-white font-bold text-lg">{height} in</span>
              </div>

              </div>
              
              <div className="mt-4">
                <h3 className="text-white font-bold mb-2">SKIN TONE</h3>
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
                <div className="absolute flex space-x-20">
                  <img 
                    src={ThreeDImage}
                    alt="Male Avatar"
                    className="h-[400px] object-contain"
                  />
                </div>
                
                {/* 360 rotation indicator */}
                <div className="absolute bottom-0 w-[300px] h-[300px] border-2 border-white/20 rounded-full flex items-center justify-center">
                  <div className="absolute w-full h-full rounded-full border border-white/40"></div>
                  <div className="flex justify-between w-full absolute">
                    <div className="w-2 h-2 bg-white rounded-full ml-1"></div>
                    <div className="w-2 h-2 bg-white rounded-full mr-1"></div>
                  </div>
                  <div className="flex justify-between h-full absolute flex-col">
                    <div className="w-2 h-2 bg-white rounded-full mt-1"></div>
                    <div className="w-2 h-2 bg-white rounded-full mb-1"></div>
                  </div>
                  <span className="text-xs text-white/70">360°</span>
                </div>
              </div>
              
              <Button 
                className="mt-4 bg-[#4B3B75] hover:bg-[#5D4D8A] text-white px-8 py-2 absolute  rounded-full"
              >
                Customize Avatar
              </Button>
            </div>
            
            {/* Right side controls */}
            <div className="col-span-3 flex flex-col justify-between">
            <div className="">
                <h3 className="text-white font-bold mb-2">WAIST SIZE</h3>
                <div className="flex flex-col space-y-2">
                <Slider
                  value={[waistSize]}
                  min={0}
                  max={100}
                  step={1}
                  onValueChange={(value) => setWaistSize(value[0])}
                  className="py-4 rounded-full bg-white"
                  style={{
                    height: "10px", // Adjust thickness
                    borderRadius: "9999px", // Fully rounded track
                  }}
                />
                {/* Display waist size value in custom color */}
                <span className="text-white font-semibold text-lg">
                  {waistSize} cm
                </span>
              </div>

</div>

       
              
              <div className="mt-8">
                <h3 className="text-white font-bold mb-2">HAIR COLOR</h3>
                <div className="flex justify-between space-x-2 py-2">
                  {['#000000', '#5a3825', '#8b4513', '#d2b48c', '#f5deb3', '#dcdcdc'].map((color) => (
                    <button
                      key={color}
                      className={`w-6 h-6 rounded-full ${
                        hairColor === color ? 'ring-2 ring-white' : ''
                      }`}
                      style={{ backgroundColor: color }}
                      onClick={() => setHairColor(color)}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Measurement and Photo Section */}
        <div className="w-full max-w-5xl bg-black/50 rounded-lg p-4 mx-auto mb-10">
          <div className="grid grid-cols-12 gap-8">
            <div className="col-span-5 flex flex-col">
              <div className="flex items-center mb-4">
                <Camera className="h-6 w-6 text-white mr-2" />
                <h3 className="text-white font-bold">Photos</h3>
              </div>
              
              <div className="border border-gray-600 rounded-lg aspect-square flex flex-col items-center justify-center text-white">
                <div className="mb-4 mt-auto">
                  <Upload className="h-8 w-8 mx-auto mb-2 text-white/70" />
                </div>
                <p className="text-sm text-white/70 mb-auto">Click or drag photos to upload</p>
                
                <Button variant="outline" className="mb-4 bg-indigo-900/50 text-white border-indigo-900">
                  <Camera className="h-4 w-4 mr-2" />
                  Save Avatar
                </Button>
              </div>
            </div>
            
            <div className="col-span-7 flex flex-col">
              <h3 className="text-white font-bold text-xl mb-4 text-center">Measurement</h3>
              
              <div className="grid grid-cols-3 gap-4 mb-4">
                <div>
                  <Label htmlFor="height" className="text-white text-sm">Height (cm)</Label>
                  <Input 
                    id="height" 
                    type="number" 
                    value={measurements.height}
                    onChange={(e) => handleMeasurementChange('height', e.target.value)}
                    className="bg-transparent border-gray-700 text-white"
                  />
                </div>
                <div>
                  <Label htmlFor="weight" className="text-white text-sm">Weight (kg)</Label>
                  <Input 
                    id="weight" 
                    type="number" 
                    value={measurements.weight}
                    onChange={(e) => handleMeasurementChange('weight', e.target.value)}
                    className="bg-transparent border-gray-700 text-white"
                  />
                </div>
                <div>
                  <Label htmlFor="chest" className="text-white text-sm">Chest (cm)</Label>
                  <Input 
                    id="chest" 
                    type="number" 
                    value={measurements.chest}
                    onChange={(e) => handleMeasurementChange('chest', e.target.value)}
                    className="bg-transparent border-gray-700 text-white"
                  />
                </div>
                <div>
                  <Label htmlFor="waist" className="text-white text-sm">Wait (cm)</Label>
                  <Input 
                    id="waist" 
                    type="number" 
                    value={measurements.waist}
                    onChange={(e) => handleMeasurementChange('waist', e.target.value)}
                    className="bg-transparent border-gray-700 text-white"
                  />
                </div>
                <div>
                  <Label htmlFor="hips" className="text-white text-sm">Hips (cm)</Label>
                  <Input 
                    id="hips" 
                    type="number" 
                    value={measurements.hips}
                    onChange={(e) => handleMeasurementChange('hips', e.target.value)}
                    className="bg-transparent border-gray-700 text-white"
                  />
                </div>
              </div>
              
              <h3 className="text-white font-bold text-xl mb-4 text-center">Body Features</h3>
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <Label htmlFor="skinTone" className="text-white text-sm">Skin Tone</Label>
                  <Input 
                    id="skinTone" 
                    value={bodyFeatures.skinTone}
                    onChange={(e) => handleFeatureChange('skinTone', e.target.value)}
                    className="bg-transparent border-gray-700 text-white"
                  />
                </div>
                <div>
                  <Label htmlFor="hairColor" className="text-white text-sm">Hair Color</Label>
                  <Input 
                    id="hairColor" 
                    value={bodyFeatures.hairColor}
                    onChange={(e) => handleFeatureChange('hairColor', e.target.value)}
                    className="bg-transparent border-gray-700 text-white"
                  />
                </div>
                <div>
                  <Label htmlFor="eyeColor" className="text-white text-sm">Eye Color</Label>
                  <Input 
                    id="eyeColor" 
                    value={bodyFeatures.eyeColor}
                    onChange={(e) => handleFeatureChange('eyeColor', e.target.value)}
                    className="bg-transparent border-gray-700 text-white"
                  />
                </div>
                <div>
                  <Label htmlFor="bodyType" className="text-white text-sm">Body Type</Label>
                  <Input 
                    id="bodyType" 
                    value={bodyFeatures.bodyType}
                    onChange={(e) => handleFeatureChange('bodyType', e.target.value)}
                    className="bg-transparent border-gray-700 text-white"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ThreeDAvatarCustomization;
