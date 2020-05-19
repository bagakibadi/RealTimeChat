<template>
  <form class="form" @submit.prevent="signup">
    <h1 class="header">Account Register</h1>
    <h1 class="labelemail">Fullname</h1>
    <div class="formemail">
      <input v-model="fullname" type="text" class="inputemail">
    </div>
    <h1 class="labelemail">EMAIL</h1>
    <div class="formemail">
      <input v-model="email" type="text" class="inputemail">
    </div>
    <h1 class="labelemail">PASSWORD</h1>
    <div class="formemail">
      <input v-model="password" type="password" class="inputemail">
    </div>
    <div class="login">
      <button >Register</button>
    </div>
    <div class="regis">
      <h1>Do You Have Account?</h1>
      <router-link to="/login">Login</router-link>
    </div>
  </form>
</template>

<script>
import firebase from 'firebase';

export default {
  name: 'Form Register',
  data() {
    return {
      fullname: '',
      email: '',
      password: '',
      code: 0,
      error: false,
    };
  },
  methods: {
    signup() {
      firebase.auth().createUserWithEmailAndPassword(this.email, this.password)
        .then((result) => {
          console.log(result);
          firebase.firestore().collection('user').doc(firebase.auth().currentUser.uid)
            .set({
              email: this.email,
              fullname: this.fullname,
              photo: 'https://cdn.business2community.com/wp-content/uploads/2017/08/blank-profile-picture-973460_640.png',
            });
          // eslint-disable-next-line no-alert
          alert('Register Success!');
        })
        .catch((err) => {
          console.log(err);
          // eslint-disable-next-line no-alert
          alert(`Oops ${err.message}`);
        });
    },
  },
};
</script>

<style scoped>
.form{
  width: 390px;
  height: 415px;
}
.header{
  font-size: 30px;
  font-weight: bold;
  text-transform: uppercase;
  color: #555555;
  margin-bottom: 30px;
}
.labelemail{
  font-size: 13px;
  color: #555555;
  font-weight: bold;
  margin-bottom: 10px;
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
  border: 1px solid #e6e6e6;
  outline: none;
  margin-bottom: 10px;
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
  margin-top: 15px;
}
.regis{
  width: 200px;
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

</style>
