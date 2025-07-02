<template>
    <span class="time-duration">
        {{ formatDuration(duration) }}
    </span>
</template>

<script>
export default {
    name: 'TimeDuration',
    props: {
        duration: {
            type: [String, Number],
            required: true
        }
    },
    methods: {
        formatDuration(duration) {
            // Convert to seconds as number
            const totalSeconds = Number(duration);
            
            // Calculate hours, minutes and seconds
            const hours = Math.floor(totalSeconds / 3600);
            const minutes = Math.floor((totalSeconds % 3600) / 60);
            const seconds = Math.floor(totalSeconds % 60);
            
            // Format with leading zeros
            const formattedMinutes = minutes.toString().padStart(2, '0');
            const formattedSeconds = seconds.toString().padStart(2, '0');
            
            // Return HH:mm:ss or mm:ss depending on if there are hours
            if (hours > 0) {
                return `${hours}:${formattedMinutes}:${formattedSeconds}`;
            } else {
                return `${formattedMinutes}:${formattedSeconds}`;
            }
        }
    }
}
</script>