export async function validateToken(token: string, secret: string) {
  try {
    const decoded = this.jwtService.verify(token, {
      secret: secret,
    });
    return decoded;
  } catch (error) {
    throw new Error('Invalid or expired token');
  }
}
