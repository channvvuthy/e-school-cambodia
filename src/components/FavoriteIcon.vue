<template>
    <svg :width="size" :height="size" viewBox="0 0 18 16" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
        <!-- Generator: Sketch 52.5 (67469) - http://www.bohemiancoding.com/sketch -->
        <title>Favorite</title>
        <desc>Created with Sketch.</desc>
        <g id="E-School-App---V3-FA" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
            <g id="Video-Detail" transform="translate(-292.000000, -642.000000)" :stroke="fill" stroke-width="0.593999981">
                <path d="M308.882657,646.859131 C308.882301,646.857751 308.882301,646.856601 308.881826,646.855221 C308.398957,644.535557 306.660605,643.036336 304.454102,643.036336 C303.350079,643.036336 302.163798,643.430632 301.004224,644.179553 C299.83005,643.396825 298.661692,643 297.527163,643 C295.306892,643 293.576136,644.515319 293.117007,646.859591 C292.459056,650.18253 294.524425,654.584292 300.622487,656.928448 C300.631389,656.931898 300.640292,656.935003 300.649669,656.937992 C300.875316,657.020669 301.124466,657.020669 301.35047,656.937992 C301.360797,656.934658 301.370649,656.931208 301.380738,656.927183 C307.477138,654.534502 309.541557,650.146194 308.882657,646.859131 Z" id="Favorite"></path>
            </g>
        </g>
    </svg>
</template>

<script>
    export default{
        name: "FavoriteIcon",
        props:{
            size:{
                default:()=>{
                    return 24
                }
            },
            fill:{
                default:()=>{
                    return "#4A4A4A"
                }
            }
        }
    }
</script>