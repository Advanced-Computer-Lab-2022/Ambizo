import React, { useState, useMemo } from 'react'
import Select from 'react-select'
import countryList from 'react-select-country-list'

function CountrySelector(props) {
  const [value, setValue] = useState('')
  const options = useMemo(() => countryList().getData(), [])

  const changeHandler = value => {
    setValue(value)
    localStorage.setItem("country",value.label);
    localStorage.setItem("countryCode",value.value);
    props.toggleCountryModal()
    window.location.reload();
  }

  return <Select className='country--select' options={options} value={value} onChange={changeHandler} />
}

export default CountrySelector;