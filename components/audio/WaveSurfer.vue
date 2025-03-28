<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from "vue";
import WaveSurfer from "wavesurfer.js";
import RegionsPlugin from "wavesurfer.js/dist/plugins/regions";
import MinimapPlugin from "wavesurfer.js/dist/plugins/minimap";
import Hover from "wavesurfer.js/dist/plugins/hover.esm.js";
import type { Region } from "wavesurfer.js/dist/plugins/regions";

const props = defineProps<{ audioUrl: string }>();

const waveformContainer = ref<HTMLDivElement | null>(null);
const minimapContainer = ref<HTMLDivElement | null>(null);
const waveSurferInstance = ref<WaveSurfer | null>(null);
const isPlaying = ref(false);
const currentTime = ref(0);
const duration = ref(0);
const volume = ref(0.5);
const zoom = ref(1);
const regionsPlugin = ref<RegionsPlugin | null>(null);
const activeRegion = ref<Region | null>(null);
const playbackRate = ref(1);
const preservePitch = ref(true);
const loadError = ref<string | null>(null);

const initWaveSurfer = () => {
    if (waveformContainer.value) {
        waveSurferInstance.value = WaveSurfer.create({
            container: waveformContainer.value,
            waveColor: "#FFD700",
            progressColor: "#B8860B",
            cursorColor: "#FFFFFF",
            height: 140,
            barWidth: 2,
            barGap: 1,
            barRadius: 2,
            audioRate: playbackRate.value,
            plugins: [
                Hover.create({
                    lineColor: "#ff0000",
                    lineWidth: 2,
                    labelBackground: "#555",
                    labelColor: "#fff",
                    labelSize: "11px",
                }),
            ],
        });

        const plugin = RegionsPlugin.create();
        waveSurferInstance.value.registerPlugin(plugin);
        regionsPlugin.value = plugin;

        if (minimapContainer.value) {
            const minimapPluginInstance = MinimapPlugin.create({
                container: minimapContainer.value as HTMLElement,
            });
            waveSurferInstance.value.registerPlugin(minimapPluginInstance);
        }

        waveSurferInstance.value.load(props.audioUrl);

        waveSurferInstance.value.on("ready", () => {
            duration.value = waveSurferInstance.value?.getDuration() || 0;
        });

        waveSurferInstance.value.on("audioprocess", () => {
            if (waveSurferInstance.value && isPlaying.value) {
                currentTime.value = waveSurferInstance.value.getCurrentTime();
            }
        });

        waveSurferInstance.value.on("play", () => {
            isPlaying.value = true;
        });

        waveSurferInstance.value.on("pause", () => {
            isPlaying.value = false;
        });

        waveSurferInstance.value.on("finish", () => {
            isPlaying.value = false;
            currentTime.value = 0;
        });

        waveSurferInstance.value.on("error", (err: string | Error) => {
            console.error("WaveSurfer error:", err);
            loadError.value =
                typeof err === "string" ? err : JSON.stringify(err);
        });
    }
};

const updatePlaybackRate = () => {
    if (waveSurferInstance.value) {
        waveSurferInstance.value.setPlaybackRate(
            playbackRate.value,
            preservePitch.value
        );
    }
};

const togglePreservePitch = () => {
    preservePitch.value = !preservePitch.value;
    updatePlaybackRate();
};

const addRegion = () => {
    if (!waveSurferInstance.value || !regionsPlugin.value) return;

    const region = regionsPlugin.value.addRegion({
        start: waveSurferInstance.value.getCurrentTime(),
        end: waveSurferInstance.value.getCurrentTime() + 5,
        color: "rgba(255, 215, 0, 0.3)",
        drag: true,
        resize: true,
    });

    activeRegion.value = region;

    region.on("click", () => {
        activeRegion.value = region;
    });

    region.on("remove", () => {
        if (activeRegion.value === region) {
            activeRegion.value = null;
        }
    });
};

const removeAllRegions = () => {
    if (!regionsPlugin.value) return;

    if (waveSurferInstance.value) {
        waveSurferInstance.value.stop();
        isPlaying.value = false;
        currentTime.value = 0;
    }

    regionsPlugin.value
        .getRegions()
        .forEach((region: Region) => region.remove());

    activeRegion.value = null;
};

const togglePlay = () => {
    if (!waveSurferInstance.value) return;

    if (isPlaying.value) {
        waveSurferInstance.value.pause();
    } else {
        if (activeRegion.value) {
            waveSurferInstance.value.play(
                activeRegion.value.start,
                activeRegion.value.end
            );
        } else {
            waveSurferInstance.value.play();
        }
    }
};

const stopPlayback = () => {
    if (waveSurferInstance.value) {
        waveSurferInstance.value.stop();
        isPlaying.value = false;
        currentTime.value = 0;
    }
};

const handleVolumeChange = () => {
    waveSurferInstance.value?.setVolume(volume.value);
};

const handleZoomChange = () => {
    waveSurferInstance.value?.zoom(zoom.value);
};

watch(currentTime, (newTime) => {
    if (activeRegion.value && waveSurferInstance.value) {
        if (newTime >= activeRegion.value.end) {
            waveSurferInstance.value.play(activeRegion.value.start);
        }
    }
});

onMounted(() => initWaveSurfer());

onUnmounted(() => waveSurferInstance.value?.destroy());

watch(zoom, handleZoomChange);
watch(volume, handleVolumeChange);
watch(playbackRate, updatePlaybackRate);

defineExpose({
    currentTime,
    loadError,
});
</script>

<template>
    <v-card class="pa-5 w-100" rounded="lg" elevation="5" color="#1e1e1e" dark>
        <div ref="waveformContainer" class="waveform" />
        <div ref="minimapContainer" class="minimap" />

        <v-row align="center" class="mt-4" justify="space-between">
            <v-col cols="auto">
                <v-btn
                    size="small"
                    class="mr-2"
                    icon
                    color="blue"
                    @click="togglePlay"
                >
                    <v-icon>{{ isPlaying ? "mdi-pause" : "mdi-play" }}</v-icon>
                </v-btn>
                <v-btn
                    size="small"
                    class="mr-2"
                    icon
                    color="red"
                    @click="stopPlayback"
                >
                    <v-icon>mdi-stop</v-icon>
                </v-btn>
            </v-col>

            <v-col>
                <v-slider
                    v-model="volume"
                    min="0"
                    max="1"
                    step="0.01"
                    thumb-label="always"
                >
                    <template #append>
                        <v-icon color="green">mdi-volume-high</v-icon>
                    </template>
                </v-slider>
            </v-col>

            <v-col>
                <v-slider
                    v-model="zoom"
                    min="1"
                    max="200"
                    step="1"
                    thumb-label="always"
                >
                    <template #append>
                        <v-icon color="purple">mdi-magnify</v-icon>
                    </template>
                </v-slider>
            </v-col>

            <v-col>
                <v-slider
                    v-model="playbackRate"
                    min="0.25"
                    max="4"
                    step="0.25"
                    thumb-label="always"
                >
                    <template #append>
                        <v-icon color="yellow">mdi-speedometer</v-icon>
                    </template>
                </v-slider>
            </v-col>

            <v-col cols="auto">
                <v-btn
                    size="small"
                    class="mr-2"
                    icon
                    :color="preservePitch ? 'green' : 'grey'"
                    @click="togglePreservePitch"
                >
                    <v-icon>mdi-tune</v-icon>
                </v-btn>
                <v-btn
                    size="small"
                    class="mr-2"
                    icon
                    color="orange"
                    @click="addRegion"
                >
                    <v-icon>mdi-selection-drag</v-icon>
                </v-btn>
                <v-btn
                    size="small"
                    class="mr-2"
                    icon
                    color="pink"
                    @click="removeAllRegions"
                >
                    <v-icon>mdi-selection-remove</v-icon>
                </v-btn>
            </v-col>
        </v-row>
    </v-card>
</template>

<style lang="css" scoped></style>
