export default defineEventHandler((event) => {
  setResponseHeader(event, 'Content-Type', 'text/html')
  setResponseHeader(event, 'Cache-Control', 'no-cache')
  setResponseHeader(event, 'Transfer-Encoding', 'chunked')

  let consume_interval: NodeJS.Timeout
  let produce_interval: NodeJS.Timeout
  let message: string[] = []
  const stream = new ReadableStream({
    start(controller) {
      try {
        consume_interval = setInterval(() => {
          const char = message.shift()?.trim()
          if (char) {
            controller.enqueue(char)
          }
        }, 200)
        produce_interval = setInterval(() => {
          // 生成随机字符串
          message.push(...Math.random().toString(36).substring(2, 2 + Math.round(Math.random() * 10)).split(''))
        }, 3000)
      } catch (err: any) {
        controller.enqueue(err.message)
        controller.close()
      }
    },
    cancel() {
      clearInterval(consume_interval)
      clearInterval(produce_interval)
    },
  })

  return sendStream(event, stream)
})
