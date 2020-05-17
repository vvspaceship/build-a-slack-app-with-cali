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

const api = {
  cat: process.env.CAT_API_BASE_URL
}

app.event('app_mention', async ({ say, event }) => {
  if (/:cat:/i.test(event.text)) {
    const data = await (await fetch(api.cat + 'images/search')).json()
    const { url, id } = data[0]
    await say({
      text: '',
      blocks: [
        {
          type: 'image',
          title: {
            type: 'plain_text',
            text: id
          },
          image_url: url,
          alt_text: id
        }
      ]
    })
  }
})
