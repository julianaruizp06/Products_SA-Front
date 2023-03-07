export const cop = value => {
    return new Intl.NumberFormat('ES-CO', { style: 'currency', currency: 'COP' }).format(value)
}