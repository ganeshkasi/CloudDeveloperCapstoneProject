/**
 * A payload of a JWT token
 */
export interface JwtPayload {
  iss: string
  sub: string
  email: string
  iat: number
  exp: number
}
