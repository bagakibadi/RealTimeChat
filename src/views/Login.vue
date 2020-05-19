<template>
  <div class="container">
    <div class="container2">
      <div class="form">
        <h1 class="header">Account Login</h1>
        <FormLogin/>
        <div class="regis">
          <h1>Don't Have Account?</h1>
          <router-link to="/register">Register</router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import FormLogin from '../components/FormLogin.vue';

export default {
  name: 'Login',
  components: {
    FormLogin,
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
.form{
  width: 420px;
  height: 415px;
}
.header{
  font-size: 30px;
  font-weight: bold;
  text-transform: uppercase;
  color: #555555;
  margin-bottom: 10px;
}
.regis{
  width: 205px;
  margin-top: 10px;
}
.regis h1{
  position: absolute;
  font-size: 15px;
}
.regis a{
  position: relative;
  float: right;
  text-decoration: none;
}
</style>>
