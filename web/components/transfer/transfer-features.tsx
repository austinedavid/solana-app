"use client"
import React from 'react'
import {TransferUi, GetAta} from './transfer-ui'

const TransferFeature = () => {
  return (
    <div className=' flex flex-col'>
        <TransferUi/>
        <hr/>
        <GetAta/>
    </div>
  )
}

export default TransferFeature