module.exports = (env: any): any => Object.fromEntries(Object.entries(env).map(([key, val]) => [key, Number(val) || val]))
