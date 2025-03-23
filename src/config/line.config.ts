import { registerAs } from '@nestjs/config'

export type TLineConfig = {
  channelId: string
  channelSecret: string
}

export default registerAs(
  'line',
  (): TLineConfig => ({
    channelId: process.env.LINE_CHANNEL_ID||'2007108760',
    channelSecret: process.env.LINE_CHANNEL_SECRET||'8e680e905709b068615334043c34f511',
  }),
)
