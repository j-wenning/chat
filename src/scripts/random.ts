export const rand = (floor: number, ceil: number): number => Math.random() * (ceil - floor + 1) + floor

export const randInt = (floor: number, ceil: number): number => Math.floor(rand(Math.floor(ceil), Math.ceil(floor)))
