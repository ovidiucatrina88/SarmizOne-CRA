import { Request, Response, NextFunction } from 'express';

/**
 * Middleware to handle Cloudflare-specific session cookie issues
 * Cloudflare can interfere with session cookies, this middleware ensures proper handling
 */
export function cloudflareSessionFix(req: Request, res: Response, next: NextFunction) {
  // Enhanced Cloudflare session handling
  const isCloudflare = req.hostname?.includes('sarmiz-one.io') || 
                      req.get('cf-ray') || 
                      process.env.NODE_ENV === 'production';
                      
  if (isCloudflare) {
    const originalSetHeader = res.setHeader;
    
    res.setHeader = function(name: string, value: any) {
      if (name.toLowerCase() === 'set-cookie') {
        if (Array.isArray(value)) {
          value = value.map(cookie => {
            if (typeof cookie === 'string' && cookie.includes('connect.sid')) {
              return enhanceCookieForCloudflare(cookie, req);
            }
            return cookie;
          });
        } else if (typeof value === 'string' && value.includes('connect.sid')) {
          value = enhanceCookieForCloudflare(value, req);
        }
      }
      return originalSetHeader.call(this, name, value);
    };
  }
  
  next();
}

function enhanceCookieForCloudflare(cookie: string, req: Request): string {
  let enhanced = cookie;
  
  // Force SameSite=None for Cloudflare
  if (!enhanced.includes('SameSite=None')) {
    enhanced = enhanced.replace(/SameSite=[^;]*;?/g, '').replace(/;+/g, ';');
    enhanced += '; SameSite=None';
  }
  
  // Force Secure for HTTPS
  if (!enhanced.includes('Secure') && (req.get('x-forwarded-proto') === 'https' || req.protocol === 'https')) {
    enhanced += '; Secure';
  }
  
  console.log('Enhanced Cloudflare cookie:', enhanced);
  return enhanced;
}