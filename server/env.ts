import 'dotenv/config'

process.env = Object.fromEntries(Object.entries(process.env).map(([key, val]) => [key, Number(val) || val])) as any
