export const CurrencyAmountSupport= (kind: string) => {
    if (kind === "JPYC") {
        return [
            1000,
            3000,
            5000,
            10000,
        ]
    } else if (kind === "USDC") {
        return [
            0.111688,
            0.112221,
            0.112329,
            0.11241
        ]
    } else if (kind === "ETH") {
        return [
            0.0000265733,
            0.0000267003,
            0.0000267259,
            0.0000267451
        ]
    } else {
        return [];
    }
}