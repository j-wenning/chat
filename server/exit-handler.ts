const handlers: (() => void )[] = []

let redundancyGuard = false

const fireHandlers = (): void => {
  if (redundancyGuard) return
  handlers.forEach(handler => { try { handler() } catch (err) { console.error(err) } })
  redundancyGuard = true
  process.exit()
}

['exit', 'SIGINT', 'SIGUSR1', 'SIGUSR2', 'uncaughtException'].forEach(event => { process.on(event, fireHandlers) })

module.exports = (handler: () => void): void => { handlers.push(handler) }
