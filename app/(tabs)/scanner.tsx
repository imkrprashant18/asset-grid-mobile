import ScannerQR from '@/components/Scanner'
import React from 'react'
import { View } from 'react-native'

const Scanner = () => {
    return (
        <View style={{ flex: 1 }}>
            <ScannerQR />
        </View>
    )
}

export default Scanner

