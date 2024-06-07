<template>
  <ElConfigProvider :locale="zhCN">
    <NuxtLoadingIndicator />
    <div class="flex flex-col items-start">
      <ElButton @click="fetchStream()">
        流式传输
      </ElButton>
      <p class="typing">{{ stream_result }}</p>
      <ElDivider />
      <ElButton @click="fetchSSE()">
        EventSource
      </ElButton>
      <p class="typing">{{ sse_result }}</p>
      <ElDivider />
      <ElButton @click="fetchWS()">
        WebSocket
      </ElButton>
      <p class="typing">{{ ws_result }}</p>
    </div>
  </ElConfigProvider>
</template>
<script lang="ts" setup>
  import zhCN from 'element-plus/es/locale/lang/zh-cn'

  const stream_reader = ref<ReadableStreamDefaultReader>()
  const stream_result = ref<string>('')
  async function fetchStream() {
    stream_reader.value?.cancel()
    stream_result.value = ''

    const body: ReadableStream = await $fetch('/api/stream', {
      responseType: 'stream',
    })
    stream_reader.value = body.getReader()
    const decoder = new TextDecoder('utf-8')
    const read: () => Promise<any> = async () => {
      const { done, value } = await stream_reader.value!.read()
      if (done) {
        return stream_reader.value!.releaseLock()
      }

      const chunk = decoder.decode(value, { stream: true })
      stream_result.value += chunk

      return read()
    }
    await read()
  }

  const sse_result = ref<string>('')
  async function fetchSSE() {
    sse_result.value = ''
    const eventSource = new EventSource('/api/sse')
    eventSource.addEventListener('char', (event) => {
      sse_result.value += event.data
    })
  }

  const ws_result = ref<string>('')
  async function fetchWS() {
    sse_result.value = ''
    const ws = new WebSocket('/api/ws')
    ws.addEventListener('message', (event) => {
      ws_result.value += event.data
    })
  }
</script>
<style lang="css" scoped>
  @keyframes blink {
    0% {
      opacity: 0;
    }
    50% {
      opacity: 1;
    }
    100% {
      opacity: 0;
    }
  }

  .typing {
    word-break: break-all;
  }

  .typing::after {
    content: ' ';
    display: inline-block;
    width: .4em;
    height: 1.2em;
    background-color: black;
    transform: translate(.2em, 0.2em);
    animation: blink 1000ms infinite;
  }
</style>
