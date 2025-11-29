import { google } from 'googleapis'
import { supabase } from '../lib/supabase'

export class CalendarService {
  private clientId = process.env.GOOGLE_CLIENT_ID || ''
  private clientSecret = process.env.GOOGLE_CLIENT_SECRET || ''
  private redirectUri = process.env.GOOGLE_REDIRECT_URI || 'http://localhost:3001/api/calendar/callback'

  getOAuth2Client() {
    const oauth2Client = new google.auth.OAuth2(this.clientId, this.clientSecret, this.redirectUri)
    return oauth2Client
  }

  getAuthUrl() {
    const oauth2Client = this.getOAuth2Client()
    const url = oauth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: ['https://www.googleapis.com/auth/calendar']
    })
    return url
  }

  async handleCallback(userId: string, code: string) {
    const oauth2Client = this.getOAuth2Client()
    const { tokens } = await oauth2Client.getToken(code)
    await supabase.from('calendar_tokens').upsert({ user_id: userId, access_token: tokens.access_token!, refresh_token: tokens.refresh_token, scope: tokens.scope, token_type: tokens.token_type, expiry_date: tokens.expiry_date ? new Date(tokens.expiry_date) : null })
    return true
  }

  async getCalendarClient(userId: string) {
    const { data } = await supabase.from('calendar_tokens').select('*').eq('user_id', userId).single()
    if (!data) throw new Error('Calendar not connected')
    const oauth2Client = this.getOAuth2Client()
    oauth2Client.setCredentials({ access_token: data.access_token, refresh_token: data.refresh_token })
    return google.calendar({ version: 'v3', auth: oauth2Client })
  }
}

export const calendarService = new CalendarService()
