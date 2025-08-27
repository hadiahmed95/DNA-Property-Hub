import { NextFont, NextFontWithVariable } from "next/dist/compiled/@next/font"
import { Montserrat, Montserrat_Alternates, Poppins } from "next/font/google"

const MontserratFont = Montserrat({
    subsets: ['latin']
})

const popins400 = Poppins({
    variable: "--font-popins-400",
    subsets: ['latin'],
    weight: "400"
})

const popins500 = Poppins({
    variable: "--font-popins-500",
    subsets: ['latin'],
    weight: "500"
})

const popinsFont: { '400': NextFontWithVariable, '500': NextFontWithVariable } = {
    '400': popins400,
    '500': popins500
}

export {
    MontserratFont,
    popinsFont
}