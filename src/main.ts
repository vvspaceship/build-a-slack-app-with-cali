import 'dotenv/config'
import { App, ExpressReceiver } from '@slack/bolt'
import fetch from 'node-fetch'

// express receiver to register custom routes
const receiver = new ExpressReceiver({
  signingSecret: process.env.SLACK_SIGNING_SECRET || ''
})
const app = new App({ token: process.env.SLACK_BOT_TOKEN, receiver })
const port = process.env.PORT || 3000

// ===== Start the App ======
;(async () => {
  await app.start(port)

  console.log(`🚀 App is running on port ⚡ ${port} 🚀`)
})()

const apiUrl = process.env.API_BASE_URL || ''

const grabImage = async () => {
  const images = await (await fetch(`${apiUrl}images/search`)).json()
  if (!images || images.length === 0) return null
  return images[0].url
}

app.message(/:cat:/i, async ({ message, say }) => {
  const url = await grabImage()
  if (url === null) return

  await say({
    text: '',
    blocks: [
      {
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: `<@${message.user}> Here's your image`
        }
      },
      {
        type: 'divider'
      },
      {
        type: 'image',
        title: {
          type: 'plain_text',
          text: 'Random Cat Image',
          emoji: true
        },
        image_url: url,
        alt_text: 'Random Cat Image'
      }
    ]
  })
})

app.event('app_home_opened', async ({ context, event }) => {
  const url = await grabImage()
  if (url === null) return

  const { user } = event
  await app.client.views.publish({
    token: context.botToken,
    user_id: user,
    view: {
      type: 'home',
      blocks: [
        {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: `Here's your image`
          }
        },
        {
          type: 'divider'
        },
        {
          type: 'image',
          title: {
            type: 'plain_text',
            text: 'Random Cat Image',
            emoji: true
          },
          image_url: url,
          alt_text: 'Random Cat Image'
        }
      ]
    }
  })
  await app.client.chat.postMessage({
    token: context.botToken,
    channel: 'UEFNNK11T',
    text: `<@${user}> has opened your app's home tab`
  })
})
