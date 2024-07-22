const express = require('express')
const mongoose = require('mongoose')
const app = express()
const { v4: uuidv4 } = require('uuid')

// 미들웨어를 설정하는 부분으로, 클라이언트가 전송한 JSON 데이터를 파싱하여 JavaScript 객체로 변환한다.
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

const userSchema = new mongoose.Schema(
  {
    id: String,
    name: String,
    email: String
  },
  {
    versionKey: false
  }
)

const User = mongoose.model('User', userSchema)

// 특정 사용자 조회
app.get('/user/:id', async (req, res) => {
  try {
    const user = await User.findOne({ id: req.params.id })
    if (user) {
      res.status(200).json(user)
    } else {
      res.status(404).json({ message: 'User not found' })
    }
  } catch (error) {
    res.status(500).json({ message: 'Failed to get the user' })
  }
})

// 모든 사용자 조회
app.get('/user', async (req, res) => {
  try {
    const users = await User.find()
    res.status(200).json(users)
  } catch (error) {
    res.status(500).json({ message: 'Failed to get users' })
  }
})

// 사용자 생성
app.post('/user', async (req, res) => {
  try {
    const { name, email } = req.body
    const newUser = new User({
      id: uuidv4(),
      name,
      email
    })
    await newUser.save()
    res.status(201).json(newUser)
  } catch (error) {
    res.status(500).json({ message: 'Failed to save the user' })
  }
})

// 사용자 수정
app.put('/user/:id', async (req, res) => {
  try {
    const { name, email } = req.body
    const updatedUser = await User.findOneAndUpdate(
      { id: req.params.id },
      { name, email },
      { new: true }
    )
    if (updatedUser) {
      res.status(200).json(updatedUser)
    } else {
      res.status(404).json({ message: 'User not found' })
    }
  } catch (error) {
    res.status(500).json({ message: 'Failed to update the user' })
  }
})

// 사용자 삭제
app.delete('/user/:id', async (req, res) => {
  try {
    const deletedUser = await User.findOneAndDelete({ id: req.params.id })
    if (deletedUser) {
      res.status(200).json(deletedUser)
    } else {
      res.status(404).json({ message: 'User not found' })
    }
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete the user' })
  }
})

require('dotenv').config()

mongoose
  .connect(process.env.DB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .catch((err) => {
    console.error(err)
  })
