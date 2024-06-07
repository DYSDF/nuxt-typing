export default defineWebSocketHandler({
  open(peer) {
    console.log("[ws] open", peer);

    const message: string[] = []
    // @ts-ignore
    peer.consume_interval = setInterval(() => {
      const char = message.shift()?.trim()
      if (char) {
        peer.send(char)
      }
    }, 200)
    // @ts-ignore
    peer.produce_interval = setInterval(() => {
      // 生成随机字符串
      message.push(...Math.random().toString(36).substring(2, 2 + Math.round(Math.random() * 10)).split(''))
    }, 3000)
  },

  message(peer, message) {
    console.log("[ws] message", peer, message);
    if (message.text().includes("ping")) {
      peer.send("pong");
    }
  },

  close(peer, event) {
    console.log("[ws] close", peer, event);
    // @ts-ignore
    clearInterval(peer.consume_interval)
    // @ts-ignore
    clearInterval(peer.produce_interval)
  },

  error(peer, error) {
    console.log("[ws] error", peer, error);
    // @ts-ignore
    clearInterval(peer.consume_interval)
    // @ts-ignore
    clearInterval(peer.produce_interval)
  },
})
