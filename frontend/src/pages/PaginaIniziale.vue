<template>
    <q-layout>
      <q-page-container>
        <q-page class="flex bg-image flex-center">
          <q-card
            v-bind:style="$q.screen.lt.sm ? { width: '90%' } : { width: '40%' }"
            class="custom-card"
          >
            <q-card-section>
              <div class="avatar-container">
                <q-avatar size="150px" class="shadow-10">
                  <img
                    src="src/assets/schiano.go.png"
                    style="object-fit: cover; width: 100%; height: 100%"
                  />
                </q-avatar>
              </div>
            </q-card-section>
            <q-card-section class="text-center q-pt-xl">
              <div class="col text-h6 ellipsis">Benvenuto</div>
            </q-card-section>
            <q-card-section>
              <q-form class="q-gutter-md text-center">
                <div>
                  <q-btn
                    label="Registrati"
                    type="button"
                    color="primary"
                    @click="register"
                    class="q-mb-md"
                  />
                </div>
                <div>
                  <q-btn
                    label="Login"
                    type="button"
                    color="primary"
                    @click="login"
                  />
                </div>
              </q-form>
            </q-card-section>
          </q-card>
        </q-page>
      </q-page-container>
    </q-layout>
  </template>
  
  <script>
  export default {
    name: "Home",
    methods: {
      register() {
        this.$router.push({ name: "RegistrazioneUtente" });
      },
      login() {
        this.$router.push({ name: "LoginUtente" });
      },
    },
  };
  </script>
  
  <style>
  .bg-image {
    background-image: linear-gradient(135deg, #a2d9ff, #66b2ff);
  }
  .q-form {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  .custom-card {
    padding: 20px;
    border-radius: 12px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    background: #fff;
  }
  .avatar-container {
    display: flex;
    justify-content: center;
    margin-bottom: -50px; /* Adjust to bring avatar closer to card */
  }
  .q-card-section.text-center {
    padding-top: 100px; /* Increase padding for more spacing after the avatar */
  }
  </style>
  