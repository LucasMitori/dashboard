<script setup lang="ts">
import { ref, computed } from "vue";
import { Howl } from "howler";
import RecordRTC from "recordrtc";
import AudioPlayer from "./AudioPlayer.vue";

const recording = ref(false);
const recordedAudio = ref<Blob | null | undefined>(null);
const recorder = ref<RecordRTC | null>(null);
const elapsedTime = ref<string>("00:00");

let timer: NodeJS.Timeout | null = null;

const toggleRecording = async () => {
  if (recording.value) {
    await stopRecording();
  } else {
    await startRecording();
  }
};

const startRecording = async () => {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    recorder.value = new RecordRTC(stream, {
      type: "audio",
      mimeType: "audio/webm",
    });
    recorder.value.startRecording();
    recording.value = true;

    startTimer();
  } catch (error) {
    console.error("Error starting recording:", error);
  }
};

const stopRecording = async () => {
  if (recorder.value) {
    return new Promise<void>((resolve) => {
      recorder.value?.stopRecording(() => {
        const blob = recorder.value?.getBlob();
        if (blob) {
          recordedAudio.value = blob;
        }
        recorder.value?.reset();
        recording.value = false;
        stopTimer();
        resolve();
      });
    });
  }
};

const playRecording = () => {
  if (recordedAudio.value) {
    const url = URL.createObjectURL(recordedAudio.value);
    const sound = new Howl({
      src: [url],
      onplayerror: (error) => {
        console.error("Error playing audio:", error);
      },
    });
    sound.play();
  }
};

const startTimer = () => {
  let seconds = 0;
  timer = setInterval(() => {
    seconds++;
    elapsedTime.value = formatTime(seconds);
  }, 1000);
};

const stopTimer = () => {
  if (timer) {
    clearInterval(timer);
    timer = null;
  }
};

const formatTime = (seconds: number) => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
};

const recordedAudioUrl = computed(() => {
  if (recordedAudio.value) {
    return URL.createObjectURL(recordedAudio.value);
  }
  return "";
});
</script>

<template>
  <div class="audio-recorder-container">
    <div class="audio-display">
      <v-btn @click="toggleRecording" class="record-btn">
        <v-icon v-if="!recording" size="large" color="primary">
          mdi-microphone
        </v-icon>
        <v-icon v-else size="large" color="error">
          mdi-stop-circle-outline
        </v-icon>
      </v-btn>
      <span v-if="recording">{{ elapsedTime }}</span>
    </div>
    <slot v-if="recordedAudio">
      <div class="audio-player-container">
        <v-btn @click="playRecording" class="play-btn">
          <v-icon>mdi-play</v-icon>
        </v-btn>
        <AudioPlayer :audioSrc="recordedAudioUrl" />
      </div>
    </slot>
  </div>
</template>

<style scoped>
.audio-recorder-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.audio-display {
  display: flex;
  align-items: center;
}

.record-btn {
  margin-right: 10px;
}

.audio-player-container {
  display: flex;
  align-items: center;
}

.play-btn {
  margin-right: 10px;
}
</style>
