export const calculateScore = (gpuScore, cpuScore) => {
    if (!gpuScore || !cpuScore) return 0;
    return 1 / (0.85 / gpuScore + 0.15 / cpuScore);
};

export const formatResult = (score) => {
    if (!score) return "";
    return Math.floor(score).toLocaleString();
};
