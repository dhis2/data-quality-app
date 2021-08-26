export const Z_SCORE = 'Z_SCORE'
export const MODIFIED_Z_SCORE = 'MOD_Z_SCORE'
export const MIN_MAX = 'MIN_MAX'
export const MEAN_ABS_DEV = 'MEAN_ABS_DEV'

export const ALGORITHM_TO_LABEL_MAP = {
    Z_SCORE: 'Z-score',
    MOD_Z_SCORE: 'Modified Z-score',
    MIN_MAX: 'Min-max values'
}

export const Z_SCORE_ALGORITHMS = new Set([Z_SCORE, MODIFIED_Z_SCORE])

export const DEFAULT_THRESHOLD = 3.0
export const DEFAULT_ALGORITHM = Z_SCORE
export const DEFAULT_MAX_RESULTS = 500
export const DEFAULT_ORDER_BY = MEAN_ABS_DEV
