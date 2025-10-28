import express, { Request, Response } from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import { Pool } from 'pg'
import jwt from 'jsonwebtoken'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 3001
const JWT_SECRET = process.env.JWT_SECRET || 'default_secret'

// Database connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
})

// Middleware
app.use(cors())
app.use(express.json({ limit: '50mb' }))

// Auth middleware
const authenticateToken = (req: any, res: Response, next: any) => {
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1]

  console.log('Auth Header:', authHeader)
  console.log('Token:', token)
  console.log('JWT_SECRET:', JWT_SECRET)

  if (!token) {
    console.log('No token provided')
    return res.status(401).json({ error: 'Access denied' })
  }

  jwt.verify(token, JWT_SECRET, (err: any, user: any) => {
    if (err) {
      console.log('Token verification error:', err.message)
      return res.status(403).json({ error: 'Invalid token', details: err.message })
    }
    console.log('Token verified successfully for user:', user)
    req.user = user
    next()
  })
}

// Routes

// Login
app.post('/api/auth/login', async (req: Request, res: Response) => {
  const { username, password } = req.body

  try {
    const result = await pool.query(
      'SELECT * FROM admin_users WHERE username = $1',
      [username]
    )

    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials' })
    }

    const user = result.rows[0]

    // Simple password check - in production use bcrypt
    if (password !== user.password_hash) {
      return res.status(401).json({ error: 'Invalid credentials' })
    }

    const token = jwt.sign({ id: user.id, username: user.username }, JWT_SECRET, {
      expiresIn: '24h'
    })

    console.log('Login successful for user:', user.username)
    console.log('Generated token:', token)
    console.log('JWT_SECRET used:', JWT_SECRET)

    res.json({ token, username: user.username })
  } catch (error) {
    console.error('Login error:', error)
    res.status(500).json({ error: 'Server error' })
  }
})

// Get all circulars
app.get('/api/circulars', async (req: Request, res: Response) => {
  const { department, featured } = req.query

  try {
    let query = 'SELECT * FROM circulars ORDER BY is_featured DESC, date DESC, created_at DESC'
    let params: any[] = []

    if (featured === 'true') {
      query = 'SELECT * FROM circulars WHERE is_featured = TRUE LIMIT 1'
    } else if (department && department !== 'All') {
      query = 'SELECT * FROM circulars WHERE department = $1 OR department = $2 ORDER BY is_featured DESC, date DESC, created_at DESC'
      params = [department, 'All']
    }

    const result = await pool.query(query, params)
    res.json(result.rows)
  } catch (error) {
    console.error('Get circulars error:', error)
    res.status(500).json({ error: 'Server error' })
  }
})

// Get single circular
app.get('/api/circulars/:id', async (req: Request, res: Response) => {
  const { id } = req.params

  try {
    const result = await pool.query('SELECT * FROM circulars WHERE id = $1', [id])

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Circular not found' })
    }

    res.json(result.rows[0])
  } catch (error) {
    console.error('Get circular error:', error)
    res.status(500).json({ error: 'Server error' })
  }
})

// Create circular (protected)
app.post('/api/circulars', authenticateToken, async (req: Request, res: Response) => {
  const { title, date, subject, department, body, attachments } = req.body

  try {
    const result = await pool.query(
      'INSERT INTO circulars (title, date, subject, department, body, attachments) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [title, date, subject, department, body, JSON.stringify(attachments || [])]
    )

    res.status(201).json(result.rows[0])
  } catch (error) {
    console.error('Create circular error:', error)
    res.status(500).json({ error: 'Server error' })
  }
})

// Update circular (protected)
app.put('/api/circulars/:id', authenticateToken, async (req: Request, res: Response) => {
  const { id } = req.params
  const { title, date, subject, department, body, attachments } = req.body

  try {
    const result = await pool.query(
      'UPDATE circulars SET title = $1, date = $2, subject = $3, department = $4, body = $5, attachments = $6 WHERE id = $7 RETURNING *',
      [title, date, subject, department, body, JSON.stringify(attachments || []), id]
    )

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Circular not found' })
    }

    res.json(result.rows[0])
  } catch (error) {
    console.error('Update circular error:', error)
    res.status(500).json({ error: 'Server error' })
  }
})

// Delete circular (protected)
app.delete('/api/circulars/:id', authenticateToken, async (req: Request, res: Response) => {
  const { id } = req.params

  try {
    const result = await pool.query('DELETE FROM circulars WHERE id = $1 RETURNING *', [id])

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Circular not found' })
    }

    res.json({ message: 'Circular deleted successfully' })
  } catch (error) {
    console.error('Delete circular error:', error)
    res.status(500).json({ error: 'Server error' })
  }
})

// Toggle featured circular (protected)
app.patch('/api/circulars/:id/featured', authenticateToken, async (req: Request, res: Response) => {
  const { id } = req.params

  try {
    // First, unset all featured circulars
    await pool.query('UPDATE circulars SET is_featured = FALSE')

    // Then set this one as featured
    const result = await pool.query(
      'UPDATE circulars SET is_featured = TRUE WHERE id = $1 RETURNING *',
      [id]
    )

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Circular not found' })
    }

    res.json(result.rows[0])
  } catch (error) {
    console.error('Toggle featured error:', error)
    res.status(500).json({ error: 'Server error' })
  }
})

// Health check
app.get('/health', (req: Request, res: Response) => {
  res.json({ status: 'ok' })
})

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
