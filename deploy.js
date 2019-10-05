const puppeteer = require('puppeteer')
const axios = require('axios')

async function render() {
  const browser = await puppeteer.launch({
    args: ['--single-process'],
  })
  try {
    const page = await browser.newPage()
    await page.goto(`file://${__dirname}/description.html`)
    const value = await page.evaluate(
      () => document.querySelector('#custom-eventpop-description').outerHTML,
    )
    return value
  } finally {
    await browser.close()
  }
}

async function main() {
  console.log('* Rendering HTML...')
  const html = await render()
  if (!html) throw new Error('No HTML received.')
  console.log('* Rendered, %d bytes -- updating...', html.length)
  await axios.post(
    `${process.env.EVENT_POPPER_URL}/.netlify/functions/updateEventDescription`,
    {
      apiKey: `${process.env.EVENT_POPPER_API_KEY}`,
      description: html,
    },
  )
  console.log('* Updating done!')
}

process.on('unhandledRejection', up => {
  throw up
})

main()
