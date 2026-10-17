/**
 * High-performance AudioWorkletProcessor for capturing microphone PCM audio.
 * Runs on a dedicated real-time audio thread without UI thread latency.
 */
class PCMProcessor extends AudioWorkletProcessor {
  constructor() {
    super();
    this.bufferSize = 2048;
    this.buffer = new Float32Array(this.bufferSize);
    this.bytesWritten = 0;
  }

  process(inputs, outputs, parameters) {
    const input = inputs[0];
    if (input && input.length > 0) {
      const channelData = input[0];
      for (let i = 0; i < channelData.length; i++) {
        this.buffer[this.bytesWritten++] = channelData[i];
        if (this.bytesWritten >= this.bufferSize) {
          // Post the filled buffer to the main thread
          this.port.postMessage(this.buffer);
          this.buffer = new Float32Array(this.bufferSize);
          this.bytesWritten = 0;
        }
      }

      // Pass input through to output so Web Audio graph pull stays active
      const output = outputs[0];
      if (output && output.length > 0) {
        output[0].set(channelData);
      }
    }
    return true;
  }
}

registerProcessor("pcm-processor", PCMProcessor);
