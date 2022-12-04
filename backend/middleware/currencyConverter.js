import CurrencyConverterLt from 'currency-converter-lt'

let currencyConverter = new CurrencyConverterLt()

let ratesCacheOptions = {
    isRatesCaching: true,
    ratesCacheDuration: 3600
}

currencyConverter = currencyConverter.setupRatesCache(ratesCacheOptions)

export default currencyConverter;