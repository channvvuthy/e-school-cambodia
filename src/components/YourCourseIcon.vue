<template>
    <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px"
         width="24" height="24"
         viewBox="0 0 172 172"
         style=" fill:#000000;">
        <g fill="none" fill-rule="nonzero" stroke="none" stroke-width="1" stroke-linecap="butt" stroke-linejoin="miter"
           stroke-miterlimit="10" stroke-dasharray="" stroke-dashoffset="0" font-family="none" font-weight="none"
           font-size="none" text-anchor="none" style="mix-blend-mode: normal">
            <path d="M0,172v-172h172v172z" fill="none"></path>
            <g :fill="fill">
                <path d="M20.64,6.88v158.24h130.72v-65.79l15.14406,-15.05c0.30906,-0.3225 0.5375,-0.68531 0.71219,-1.06156l0.65844,-0.65844c5.50938,-5.50937 5.50938,-14.44531 0,-19.95469c-4.47469,-4.47469 -11.19344,-5.24063 -16.51469,-2.44563v-53.27969zM27.52,13.76h116.96v52.97063l-22.70937,22.70937h-52.97063v6.88h46.10406l-13.76,13.76h-32.34406v6.88h25.46406l-1.38406,1.38406c-0.68531,0.33594 -1.03469,0.68531 -1.03469,1.37062l-5.84531,20.64c-0.34937,1.37063 -0.34937,2.40531 0.68531,3.44c0.68531,0.68531 1.38406,1.02125 2.41875,1.02125h1.02125l20.64,-5.49594c0.34937,-0.34937 1.03469,-0.68531 1.37062,-1.03469l32.34406,-32.12906v52.08375h-116.96zM44.72,48.16v6.88h13.76v-6.88zM68.8,48.16v6.88h58.48v-6.88zM44.72,68.8v6.88h13.76v-6.88zM68.8,68.8v6.88h58.48v-6.88zM150.66125,70.17063l10.15875,10.14531l-52.79594,52.46l-0.05375,0.02688l-10.06469,-9.83625l0.13437,-0.51063zM44.72,89.44v6.88h13.76v-6.88zM44.72,110.08v6.88h13.76v-6.88z"></path>
            </g>
        </g>
    </svg>
</template>

<script>
    export default{
        name: "YourCourseIcon",
        props: {
            fill: {
                type: String,
                default: function () {
                    return "#000000"
                }
            }
        }
    }
</script>