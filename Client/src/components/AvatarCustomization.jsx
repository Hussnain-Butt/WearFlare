// src/components/AvatarCustomization.js
import React, { useState } from 'react'

const AvatarCustomization = () => {
  const [measurements, setMeasurements] = useState({
    height: 180,
    weight: 75,
    chest: 100,
    waist: 80,
    hips: 95,
  })

  const [features, setFeatures] = useState({
    skinTone: 3, // Scale from 1-6
    hairColor: '#000000',
    eyeColor: '#000000',
  })

  const handleMeasurementChange = (field, value) => {
    setMeasurements({ ...measurements, [field]: value })
  }

  const handleFeatureChange = (field, value) => {
    setFeatures({ ...features, [field]: value })
  }

  const handleSubmit = () => {
    // Send data to backend for avatar creation
    fetch('/api/generate-avatar', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ measurements, features }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log('Avatar Created', data)
      })
  }

  return (
    <div>
      <h1>Create Your Avatar</h1>
      <form
        onSubmit={(e) => {
          e.preventDefault()
          handleSubmit()
        }}
      >
        <input
          type="number"
          value={measurements.height}
          onChange={(e) => handleMeasurementChange('height', e.target.value)}
          placeholder="Height (cm)"
        />
        {/* Repeat for other measurements */}

        <div>
          <button onClick={() => handleFeatureChange('skinTone', 1)}>Skin Tone 1</button>
          <button onClick={() => handleFeatureChange('skinTone', 2)}>Skin Tone 2</button>
          {/* Repeat for other features */}
        </div>

        <button type="submit">Generate Avatar</button>
      </form>
    </div>
  )
}

export default AvatarCustomization
