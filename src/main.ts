import 'dotenv/config'
import { App, ExpressReceiver } from '@slack/bolt'

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
