interface ClientError {
  code: number;
  msg?: string;
  type: string;
}

export default (code = 400, msg?: string): ClientError => ({ code, msg, type: 'clientError' })
