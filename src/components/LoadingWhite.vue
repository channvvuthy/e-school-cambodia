<template>
  <div class="box">
    <div class="lds-dual-ring"></div>
  </div>
</template>
<script>
export default {}
</script>
<style scoped>
html {
  height: 100%;
}

body {
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  min-height: 100%;
  overflow: hidden;
}

.lds-dual-ring {
  display: inline-block;
  width: 24px;
  height: 24px;
  align-items: center;
  justify-content: center;
  text-align: center;
}

.lds-dual-ring:after {
  content: " ";
  display: block;
  width: 24px;
  height: 24px;
  margin: 0px;
  border-radius: 50%;
  border: 2px solid #1977f2;
  border-color: #1977f2 transparent #1977f2 #1977f2;
  animation: lds-dual-ring 1.2s linear infinite;
}

@keyframes lds-dual-ring {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

</style>
