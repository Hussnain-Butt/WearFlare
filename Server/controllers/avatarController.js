const path = require('path')
const { execFile } = require('child_process')
const fs = require('fs')

const generateAvatar = async (req, res) => {
  try {
    const { height, weight, chest, waist, hips } = req.body
    const photoPath = req.file.path
    const filename = Date.now()
    const modelOutput = `uploads/models/${filename}.glb`

    // Step 1: Generate body in MakeHuman
    await runPython('scripts/generate_body.py', [height, weight, chest, waist, hips, filename])

    // Step 2: Generate head using FaceBuilder
    await runPython('scripts/generate_head.py', [photoPath, filename])

    // Step 3: Merge body + head and export GLB
    await runPython('scripts/merge_body_head.py', [filename])

    res.json({ modelUrl: `/uploads/models/${filename}.glb` })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Avatar generation failed' })
  }
}

function runPython(script, args) {
  return new Promise((resolve, reject) => {
    execFile(
      'python',
      [script, ...args],
      { cwd: path.join(__dirname, '..') },
      (err, stdout, stderr) => {
        if (err) reject(err)
        else resolve(stdout)
      },
    )
  })
}

module.exports = {
  generateAvatar,
}
