<template>
<form @submit.prevent="login">
  <div v-if="code === 1" class="alertdiv color-red">
    <p class="alert">{{error}}</p>
  </div>
  <h1 class="labelemail">EMAIL</h1>
  <div class="formemail">
    <input v-model="email" type="text" class="inputemail put">
  </div>
  <h1 class="labelemail">PASSWORD</h1>
  <div class="formemail">
    <input v-model="password" type="password" class="inputemail">
  </div>
  <div class="checkbox">
    <input type="checkbox" id="checkbox">
    <label for="checkbox">Remember Me</label>
  </div>
  <div class="forgot">
    <a href="#">Forgot Password?</a>
  </div>
  <div class="login">
    <button>Login</button>
  </div>
</form>
</template>

<script>
import firebase from 'firebase';

export default {
  name: 'Form Login',
  data() {
    return {
      code: 0,
      error: false,
      email: '',
      password: '',
    };
  },
  methods: {
    login() {
      firebase.auth().signInWithEmailAndPassword(this.email, this.password)
        .then((result) => {
          console.log(result);
          this.$router.replace('/');
        })
        .catch((err) => {
          this.code = 1;
          this.error = err.message;
          console.log(err);
        });
    },
  },
};
</script>

<style scoped>

.labelemail{
  font-size: 13px;
  color: #555555;
  font-weight: bold;
  margin-bottom: 20px;
}
.formemail{
  width: 100%;
}
.inputemail{
  width: 100%;
  font-size: 18px;
  color: #555555;
  height: 55px;
  padding-left: 20px;
  background: transparent;
  border: 1px solid #886969;
  outline: none;
  box-sizing: border-box;
}
.put{
  margin-bottom: 35px;
}
.checkbox{
  position: relative;
  top: 10px;
  color: #555555;
}
.forgot a{
  position: relative;
  float: right;
  top: -10px;
  color: #555555;
  text-decoration: none;
}
.login button{
  color: white;
  padding: 0px 50px;
  height: 55px;
  background: #333333;
  border-radius: 27px;
  font-size: 16px;
  border: none;
  outline: none;
  cursor: pointer;
  position: relative;
}
.login{
  position: relative;
  margin-top: 30px;
}
.alertdiv{
  background-color: #fff7f7;
  border-radius: 5px;
  font-size: 20px;
  border: 2px solid black;
  width: 100%;
  height: auto;
  box-sizing: border-box;
  margin-bottom: 5px;
}
.material-icons{
  position: absolute;
  margin-top: 8px;
  margin-left: 5px;
}
.color-red{
  border: 2px solid #c72e2e;
}
.alert {
  /* position: absolute; */
  margin-left: 40px;
  margin-top: 8px;
  font-size: 15px;
  margin-bottom: 8px;
  margin-right: 20px;
}
</style>
