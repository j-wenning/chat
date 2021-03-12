import crypto from 'crypto'

interface HashSet {
  salt: string
  hash: string
}

export const genSalt = (rounds: number = 12): string => {
  rounds = Math.min(rounds, 15)
  return crypto.randomBytes(Math.ceil(rounds / 2)).toString('hex').slice(0, rounds)
}

export const hash = (string: string, salt: string = genSalt()): HashSet => {
  const hash = crypto.createHmac('sha256', salt).update(string).digest('hex')
  return { salt, hash }
}

export const compareStr = (hashSet: HashSet, string: string): boolean => hashSet.hash === hash(string, hashSet.salt).hash

export default { genSalt, hash, compareStr }
