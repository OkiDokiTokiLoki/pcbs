export const GPU_WEIGHT = 0.85;
export const CPU_WEIGHT = 0.15;

export const calculateScore = (gpuScore, cpuScore) => {
    if (!gpuScore || !cpuScore) return 0;
    return 1 / (GPU_WEIGHT / gpuScore + CPU_WEIGHT / cpuScore);
};

export const formatResult = (score) => {
    if (!score) return "";
    return Math.round(score).toLocaleString();
};
