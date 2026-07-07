import { GPU_WEIGHT, CPU_WEIGHT } from "./calculator.js";

// Given a target T and a current score on the "opposite" side, return the
// minimum score the requested side needs so the combined result >= T.
// Returns 0 when no constraint should be applied: no target, no opposite
// selected, or the opposite side alone already exceeds the target.
export const requiredScoreFor = (target, oppositeScore, side) => {
    if (!target || target <= 0 || !oppositeScore || oppositeScore <= 0) return 0;

    const requestedW = side === "gpu" ? GPU_WEIGHT : CPU_WEIGHT;
    const otherW = side === "gpu" ? CPU_WEIGHT : GPU_WEIGHT;

    // score = 1 / (requestedW / s + otherW / oppositeScore) >= T
    //   => s >= requestedW / (1/T - otherW / oppositeScore)
    const denom = 1 / target - otherW / oppositeScore;
    if (denom <= 0) return 0; // opposite side alone already wins
    return requestedW / denom;
};

export const initTarget = ({ input, onChange }) => {
    const getTarget = () => {
        const v = input.value.trim();
        if (!v) return 0;
        const n = Number(v);
        return Number.isFinite(n) && n > 0 ? n : 0;
    };

    input.addEventListener("input", () => onChange?.());

    const reset = () => {
        if (input.value !== "") {
            input.value = "";
            onChange?.();
        }
    };

    return { getTarget, reset, requiredScoreFor };
};
