<template>
  <div class="container">
    <div class="left-side">
      <div v-if="code !== 1" class="myprofile">
        <div class="header-profile">
          <div class="button-back">
            <i class='fas fa-arrow-left'
            @click="change"
            style="color:white"></i>
          </div>
          <div class="text-profile">Profile</div>
        </div>
        <div class="profile-content">
          <div
          class="profile-image">
            <img
            @click="uploadImage"
            v-if="picture == null"
            :src="user[0].photo" alt="">
            <img
            @click="uploadImage"
            v-else
            :src="picture" alt="">
          <input type="file"
          ref="fileinput"
          accept="image/*"
          style="display:none"
          @change="image">
          </div>
          <div class="name-profile">
            <div class="your-name">
              <label> Nama Anda </label>
            </div>
            <input type="text"
            @keyup.enter="updateProfil"
            v-model="user[0].fullname">
          </div>
          <div class="status-me">
            <div style="max-width: 100%; margin: 0 auto;
            display: flex; align-items: center; justify-content: space-between">
            <div class="coordinate">
                <h1>My coordinates:</h1>
                <p>{{ myCoordinates.lat }} Latitude, {{ myCoordinates.lng }} Longitude</p>
            </div>
        </div>
        <GmapMap
            :center="{lat:-6.597146899999999, lng:106.8060388}"
            :zoom="7"
            style="width:100%; height:360px; margin: 32px auto;"
            ref="mapRef"
            @dragend="handleDrag"
        ></GmapMap>
          </div>
        </div>
      </div>
      <div v-if="code === 1" class="side">
        <header>
          <div class="profile">
            <div @click="change" class="photo-profile">
              <img :src="user[0].photo" alt="">
            </div>
          </div>
          <div class="header-right">
            <div class="chat-logo">
              <i
              @click="logout"
              class="fas fa-ellipsis-v"></i>
            </div>
          </div>
        </header>
        <div class="search">
          <input type="text" placeholder="Cari atau mulai chat baru">
        </div>
        <div class="pane-side">
          <div class="card" v-for="item in 1" :key="item.id">
            <div class="photo-profile-chat">
              <img src="@/assets/img/profileuser.jpg" alt="">
            </div>
            <div class="ikuwah">
              <div class="name">
                <h2>Bagus Nur Solayman</h2>
              </div>
              <div class="name-msg">
                <p>YES</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="right-side">
      <div class="side-right">
        <header id="header-right">
          <div class="photo-profile-msg">
            <img src="@/assets/img/profileuser.jpg" alt="">
          </div>
          <div class="name-profile-msg">
            <p>Bagus</p>
          </div>
          <div></div>
        </header>
        <section>
          <div v-for="message in messages" :key="message.id"
          :class="[message.author==authUser.email?'body-msg2':'body-msg']">
            <div :class="[message.author==authUser.email?'chat-msg2':'chat-msg']">
              <p>{{ message.message }}</p>
            </div>
            <div :class="[message.author==authUser.email?'time2':'time']">
              <p>{{message.time}}</p>
            </div>
          </div>
        </section>
          <div class="footer">
            <div class="message">
              <input type="text"
              @keyup.enter="sendMsg"
              v-model="message" placeholder="Ketik Pesan">
            </div>
          </div>
      </div>
    </div>
  </div>
</template>

<script>
import firebase from 'firebase';
import db from '../firebase';

export default {
  name: 'Chat',
  data() {
    return {
      message: null,
      messages: [],
      authUser: {},
      code: 1,
      eww: 1,
      picture: null,
      imageData: null,
      user: [],
      myname: firebase.auth().currentUser.email,
      uid: firebase.auth().currentUser.uid,
      map: null,
      myCoordinates: {
        lat: 0,
        lng: 0,
      },
      zoom: 7,
    };
  },
  methods: {
    change() {
      if (this.code === 1) {
        this.code = 0;
      } else {
        this.code = 1;
      }
    },
    sendMsg() {
      const today = new Date();
      console.log(today);
      db.collection('chat').add({
        message: this.message,
        author: this.authUser.email,
        createdAt: new Date(),
        time: `${today.getHours()}:${today.getMinutes()} | ${today.getDay()}`,
      });
      this.message = null;
    },
    fetchMessage() {
      db.collection('chat').orderBy('createdAt')
        .onSnapshot((querySnapshot) => {
          const allMessages = [];
          querySnapshot.forEach((doc) => {
            allMessages.push(doc.data());
          });
          this.messages = allMessages;
        });
    },
    uploadImage() {
      this.$refs.fileinput.click();
    },
    image(event) {
      // eslint-disable-next-line prefer-destructuring
      this.imageData = event.target.files[0];
      this.picture = null;
      const storageRef = firebase.storage().ref(`profil/${this.imageData.name}`).put(this.imageData);
      storageRef.on('state_changed', (snapshot) => {
        this.uploadValue = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
      }, (error) => { console.log(error.message); },
      () => {
        this.uploadValue = 100;
        storageRef.snapshot.ref.getDownloadURL().then((url) => {
          this.picture = url;
          firebase.firestore().collection('user').doc(this.uid)
            .update({
              photo: url,
            });
        });
      });
    },
    profile() {
      db.collection('user').where('email', '==', this.myname).onSnapshot((querySnapshot) => {
        const satu = [];
        querySnapshot.forEach((doc) => {
          satu.push(doc.data());
        });
        this.user = satu;
      });
    },
    logout() {
      firebase.auth().signOut().then(() => {
        this.$router.push('/login');
      });
    },
    updateProfil() {
      firebase.firestore().collection('user').doc(firebase.auth().currentUser.uid)
        .update({
          fullname: this.user[0].fullname,
        });
    },
    handleDrag() {
      // get center and zoom level, store in localstorage
      const center = {
        lat: this.map.getCenter().lat(),
        lng: this.map.getCenter().lng(),
      };
      const zoom = this.map.getZoom();
      localStorage.center = JSON.stringify(center);
      localStorage.zoom = zoom;
    },
  },
  created() {
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        this.authUser = user;
        console.log('authUser');
      } else {
        this.authUser = {};
      }
    });
    if (localStorage.center) {
      this.myCoordinates = JSON.parse(localStorage.center);
    } else {
      // get user's coordinates from browser request
      this.$getLocation({})
        .then((coordinates) => {
          this.myCoordinates = coordinates;
        })
        // eslint-disable-next-line no-alert
        .catch((error) => alert(error));
    }
    // does the user have a saved zoom? use it instead of the default
    if (localStorage.zoom) {
      // eslint-disable-next-line radix
      this.zoom = parseInt(localStorage.zoom);
    }
    this.fetchMessage();
    console.log(this.uid);
    this.profile();
  },
  beforeRouterEnter(to, from, next) {
    next((vm) => {
      firebase.auth().onAuthStateChanged((user) => {
        if (user) {
          next();
        } else {
          vm.$router.push('/login');
        }
      });
    });
  },
  computed: {
    mapCoordinates() {
      if (!this.map) {
        return {
          lat: 0,
          lng: 0,
        };
      }
      return {
        lat: this.map.getCenter().lat().toFixed(4),
        lng: this.map.getCenter().lng().toFixed(4),
      };
    },
  },
};
</script>

<style scoped>
.coordinate h1{
  font-weight: 600;
  font-size: 15px;
}
.coordinate p {
  max-width: 50%;
}
.container{
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  display: flex;
}
/* Left Side */
.left-side{
  border-right: 1px solid #e1e1e1;
  flex: 25%;
  height: auto;
  overflow: hidden;
  position: relative;
}
.side{
  box-sizing: border-box;
  display: flex;
  height: 100%;
  flex-direction: column;
}
.myprofile{
  position: absolute;
  width: 100%;
  height: auto;
  background: white;
  z-index: 2;
  overflow-y: auto;
  overflow-x: none;
  /* display: none; */
}
.header-profile{
  height: 108px;
  background: #00BFA5;
  box-sizing: border-box;
  padding: 0 20px;
  display: flex;
  align-items: flex-end;
  text-align: center;
  color: white;
  font-size: 18px;
  font-weight: 600;
}
.button-back{
  height: 50px;
  width: 50px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
.button-back i {
  cursor: pointer;
}
.text-profile{
  width: 100px;
  height: 50px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
.profile-content{
  height: 100%;
  background: white;
}
.profile-image {
  padding: 28px 0;
  height: 200px;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;
  background: #ededed;
}
.profile-image img {
  width: 200px;
  height: 200px;
  border-radius: 1000px;
  margin-bottom: 10px;
  cursor: pointer;
}
.profile-image img:hover{
  background: black;
}
.name-profile{
  height: 90px;
  padding: 14px 30px 10px 30px;
  background: white;
  border: 1px solid whitesmoke;
  z-index: 5;
}
.status-me{
  height: 100px;
  padding: 14px 30px 10px 30px;
  background: #e0e0e0;
  /* border: 1px solid whitesmoke; */
  box-shadow: 0px 0px 10px 0px rgba(0,0,0,0.3);
}
.your-name{
  padding-bottom: 14px;
}
.your-name label{
  color: #009688;
  font-size: 14px;
}
.name-profile input{
  width: 100%;
  margin-top: 14px;
  height: 36px;
  color: #4a4a4a;
  font-weight: 400;
  font-size: 17px;
  border: none;
  outline: none;
  border-bottom: 1px solid #4a4a4a;
}
header{
  height: 80px;
  flex: none;
  width: 100%;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  z-index: 1;
  justify-content: flex-end;
  padding: 10px 16px;
  background: #EDEDED;
}
.profile{
  width: 100%;
}
.photo-profile{
  width: 60px;
  height: 60px;
  border-radius: 50%;
  position: relative;
  overflow: hidden;
  cursor: pointer;
}
.photo-profile img{
  width: 100%;
  height: 100%;
  border-radius: 50%;
}
.header-right{
  width: 140px;
  height: 40px;
  display: block;
}
.chat-logo{
  display: flex;
  justify-content: flex-end;
  align-items: center;
  height: 100%;
}
.chat-logo i {
  cursor: pointer;
}
.search{
  box-sizing: border-box;
  width: 100%;
  background: #f7f7f7;
  height: 70px;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
}
.search input{
  border-radius: 18px;
  box-sizing: border-box;
  height: 35px;
  border: none;
  width: 95%;
  padding: 0px 20px 0px 20px;
  outline: none;
}
.pane-side{
  position: relative;
  height: 100%;
  background: white;
  display: flex;
  flex-direction: column;
  flex: wrap;
}
.card{
  height: 72px;
  background: white;
  cursor: pointer;
  display: flex;
  border-bottom: 1px solid rgb(235, 235, 235);
}
.photo-profile-chat{
  /* padding: 0 15px 0 15px; */
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100px;
  /* box-sizing: border-box; */
  height: 100%;
  border-radius: 50%;
  position: relative;
  overflow: hidden;
  cursor: pointer;
}
.photo-profile-chat img{
  width: 49px;
  height: 49px;
  border-radius: 50%;
}
.ikuwah{
  width: 100%;
  padding-right: 15px;
}
.name h2{
  font-weight: 400;
  font-size: 18px;
  position: relative;
  /* top: 5px; */
  margin-top: 5px;
  margin-bottom: 5px;
}
.name-msg p{
  font-weight: normal;
  font-size: 13px;
  margin-top: 10px;
}
/* Right Side */
.right-side{
  flex: 65%;
  height: 100%;
  overflow: hidden;
  position: relative;
}
.side-right{
  width: 100%;
  height: 100%;
}
#header-right{
  justify-content: flex-start;
}
.photo-profile-msg{
  margin-right: 15px;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  position: relative;
}
.photo-profile-msg img{
  width: 100%;
  height: 100%;
  border-radius: 50%;
}
.name-profile-msg p {
  text-align: left;
  font-size: 15px;
  font-weight: normal;
}
.name-profile-msg{
  width: 420px;
}
section{
  padding-top: 10px;
  width: 100%;
  height: 77%;
  background: #e5ddd5;
  overflow-y: auto;
  overflow-x: hidden;
}
.footer{
  width: 100%;
  height: 100%;
  padding: 5px 10px;
  display: flex;
  background: #f0f0f0;
}
.message{
  height: 42px;
  width: 100%;
  margin: 5px 10px;
  padding: 0 12px 0 12px;
  display: flex;
  /* justify-content: center; */
  align-items: center;
}
.message input{
  border-radius: 21px;
  height: 20px;
  padding: 9px 12px 11px 12px;
  border: 1px solid white;
  outline: none;
  width: 80%;
}
.send-msg{
  height: 62px;
  display: flex;
  align-items: center;
}
.send-msg button{
  height: 42px;
  /* width: 100px; */
  padding: 5px 10px;
  border-radius: 8px;
  border: 2px solid whitesmoke ;
  background: white;
  cursor: pointer;
  outline: none;
  color:black;
  position: relative;
  top: 5px;
}
.body-msg{
  width: 100%;
  padding: 0 20px 0 20px;
}
.chat-msg{
  height: auto;
  align-items: center;
  display: flex;
  position: relative;
  /* margin: 5px 0; */
}
.chat-msg p {
  font-size: 14px;
  background: white;
  border-radius: 7px;
  display: flex;
  padding: 5px 10px;
  max-width: 50%;
}
.time{
  margin: 10px 0;
}
.time p {
  font-size: 12px;
  margin-left: 5px;
}
.body-msg2 {
  width: 100%;
  padding: 0 20px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
}
.chat-msg2{
  width: 100%;
  height: auto;
  align-items: center;
  justify-content: flex-end;
  display: flex;
  position: relative;
}
.chat-msg2 p {
  font-size: 14px;
  background: white;
  border-radius: 7px;
  display: flex;
  padding: 5px 10px;
  max-width: 50%;
  position: relative;
  /* float: right; */
}
.time2{
  margin: 10px 0;
  /* position: relative; */
  /* float: right; */
}
.time2 p {
  font-size: 12px;
  margin-left: 5px;
}
</style>
