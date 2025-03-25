export function getProductPriceFraction(price: string): string {
    const priceLength = price.length;
    const whole = price.slice(0, priceLength - 2);
    const fraction = price.slice(-2);

    return `${whole},${fraction}`;
}