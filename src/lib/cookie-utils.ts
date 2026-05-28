export function parseSetCookie(cookieStr: string) {
  const parts = cookieStr.split(';');
  const [nameValue, ...options] = parts;
  const [name, ...valueParts] = nameValue.split('=');
  const value = valueParts.join('=');
  
  const cookieOptions: Record<string, unknown> = {};
  for (const opt of options) {
    const [optName, optVal] = opt.trim().split('=');
    const key = optName.toLowerCase();
    if (key === 'max-age') cookieOptions.maxAge = parseInt(optVal, 10);
    if (key === 'path') cookieOptions.path = optVal;
    if (key === 'secure') cookieOptions.secure = process.env.NODE_ENV === "production";
    if (key === 'httponly') cookieOptions.httpOnly = true;
    if (key === 'samesite') cookieOptions.sameSite = optVal?.toLowerCase() as 'lax' | 'strict' | 'none';
  }
  return { name: name.trim(), value: value.trim(), cookieOptions };
}
