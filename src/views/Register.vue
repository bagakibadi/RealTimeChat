<template>
  <div class="container">
    <div class="container2">
      <FormRegister/>
    </div>
  </div>
</template>

<script>
// import firebase from 'firebase';
import FormRegister from '../components/FormRegister.vue';

export default {
  name: 'SignUp',
  components: {
    FormRegister,
  },
};
</script>

<style scoped>
.container{
  position: relative;
  width: 100vw;
  height: 100vh;
  background: #ebebeb;
  display: flex;
  justify-content: center;
  align-items: center;
}
.container2{
  border-radius: 10px;
  width: 560px;
  height: 525px;
  background: white;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
