<template>
  <q-page :class="pageClass" class="flex flex-center q-pa-md">
    <q-card class="q-pa-md responsive-card" :class="cardClass">
      <q-card-section class="text-center">
        <div :class="titleClass">Admin Dashboard</div>
      </q-card-section>
      <q-card-section>
        <div class="welcome-message">Welcome, {{ username }}!</div>
        <div class="q-gutter-md q-mt-md text-center">
          <q-btn
            class="responsive-btn"
            color="primary"
            label="Lista Partner"
            @click="goToPage('TreeTable_LISTAPARTNER')"
          />
          <q-btn
            class="responsive-btn"
            color="primary"
            label="Inserisci Partner"
            @click="goToPage('TreeTable_INSERISCIPARTNER')"
          />
          <q-btn
            class="responsive-btn"
            color="primary"
            label="Lista Bici"
            @click="goToPage('TreeTable_LISTABICI')"
          />
          <q-btn
            class="responsive-btn"
            color="primary"
            label="Posizioni Bici"
            @click="goToPage('PosizioneBici')"
          />
          <q-btn
            class="responsive-btn"
            color="primary"
            label="Webex"
            @click="goToPage('Webex')"
          />
        </div>
      </q-card-section>
      <q-card-section class="text-center">
        <q-btn
          @click="logout"
          color="negative"
          label="Logout"
          class="responsive-logout-btn"
        />
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script>
export default {
  name: "DashboardAdmin",
  data() {
    return {
      username: localStorage.getItem("username") || "Admin",
      clickedButton: null,
    };
  },
  methods: {
    goToPage(pageName) {
      this.clickedButton = pageName;
      setTimeout(() => {
        this.$router.push({ name: pageName });
      }, 200);
    },
    logout() {
      localStorage.removeItem("username");
      this.$router.push({ name: "LoginAdmin" });
    },
  },
  computed: {
    pageClass() {
      return {
        'bg-dark text-light': this.$q.dark.isActive,
        'bg-light text-dark': !this.$q.dark.isActive,
      };
    },
    cardClass() {
      return {
        'bg-dark text-light': this.$q.dark.isActive,
        'bg-light text-dark': !this.$q.dark.isActive,
      };
    },
    titleClass() {
      return {
        'text-primary': !this.$q.dark.isActive,
        'text-white': this.$q.dark.isActive,
        'title-large': true 
      };
    },
  }
};
</script>

<style scoped>
/* Card responsiva */
.responsive-card {
  max-width: 100%;
  width: 100%;
  box-sizing: border-box;
}

/* Titoli responsivi */
.title-large {
  font-size: 2rem; 
  font-weight: bold;
}

/* Stile per il messaggio di benvenuto */
.welcome-message {
  font-size: 1.2rem; 
  margin-bottom: 1rem;
}

/* Stile per i bottoni */
.responsive-btn {
  width: 100%;
  max-width: 300px; 
  margin-bottom: 0.5rem; 
}

/* Stile per il bottone di logout */
.responsive-logout-btn {
  width: 100%;
  max-width: 300px; 
}

/* Media query per dispositivi più piccoli */
@media (max-width: 600px) {
  .title-large {
    font-size: 1.5rem; 
  }

  .welcome-message {
    font-size: 1rem; 
  }
}
</style>
