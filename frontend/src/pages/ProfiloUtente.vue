<template>
  <q-page class="flex flex-center">
    <q-card class="q-mb-md" v-bind:style="$q.screen.lt.sm ? { width: '90%' } : { width: '40%' }">
      <q-card-section class="text-center">
        <q-avatar size="100px" class="q-mb-md">
          <img src="src/assets/action.jpg" style="object-fit: cover; width: 100%; height: 100%;" />
        </q-avatar>
        <div class="text-h6">Welcome, {{ username }}</div>
      </q-card-section>
      <q-card-section>
        <q-btn @click="goToEditProfile" label="MODIFICA PROFILO" color="primary" class="full-width q-mb-sm" />
        
        <q-btn @click="goToHelp" label="ASSISTENZA" color="primary" class="full-width q-mb-sm">
          <template v-slot:append>
            <q-icon>
              <img src="src/assets/Webex.png" alt="Assistenza" class="icon" />
            </q-icon>
          </template>
        </q-btn>
        
        <q-btn @click="contactUs" label="PARLA CON UN OPERATORE" color="primary" class="full-width q-mb-sm">
          <template v-slot:append>
            <q-icon>
              <img src="src/assets/operator-icon.png" alt="Operatore" class="icon" />
            </q-icon>
          </template>
        </q-btn>
        
        <q-btn @click="logout" label="LOGOUT" color="negative" class="full-width" />
      </q-card-section>
      <q-card-section class="text-center q-mt-md">
        <div class="powered-by">
          <span class="powered-by-text">Powered by</span>
          <img src="src/assets/Webex.png" alt="Webex" class="powered-by-icon" />
        </div>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script>
import { defineComponent } from 'vue';
import { useRouter } from 'vue-router';
import helpIcon from 'src/assets/help-icon.png';
import operatorIcon from 'src/assets/operator-icon.png';

export default defineComponent({
  name: 'UserProfile',
  setup() {
    const router = useRouter();
    const username = localStorage.getItem('username') || 'User';

    const goToEditProfile = () => {
      router.push({ name: 'ModificaProfilo' });
    };

    const goToHelp = () => {
      // URL per aprire la chat con il bot su Webex
      const webexChatUrl = 'webex://chat?to=schianogo@webex.bot';
      const fallbackUrl = 'https://webex.com';

      // Crea un iframe invisibile per tentare di aprire l'app Webex
      const iframe = document.createElement('iframe');
      iframe.style.display = 'none';
      iframe.src = webexChatUrl;
      document.body.appendChild(iframe);

      // Mostra un messaggio se l'app non è installata
      setTimeout(() => {
        // Verifica se la finestra ha il focus. Se no, mostra un messaggio di avviso
        if (document.hasFocus()) {
          alert('PER CHATTARE CON IL BOT È NECESSARIO INSTALLARE L\'APP WEBEX');
          window.open(fallbackUrl, '_blank'); // Reindirizza all'URL di fallback
        }
      }, 1000); // Attendi un momento per il tentativo di apertura dell'app
    };

    const contactUs = () => {
      const webexCallUrl = 'webex://meet?url=https://meet1376.webex.com/meet/pr26349809433';

      window.location.href = webexCallUrl;

      setTimeout(() => {
        window.open('https://meet1376.webex.com/meet/pr26349809433', '_blank');
      }, 500);
    };

    const logout = () => {
      localStorage.removeItem('username');
      router.push({ name: 'LoginUtente' });
    };

    return {
      username,
      goToEditProfile,
      goToHelp,
      contactUs,
      logout,
    };
  },
});
</script>

<style scoped>
.q-card {
  max-width: 400px;
}

.q-card-section {
  padding: 20px;
}

.full-width {
  width: 100%;
}

.q-mb-sm {
  margin-bottom: 10px;
}

.q-mb-md {
  margin-bottom: 20px;
}

.q-mt-md {
  margin-top: 20px;
}

.powered-by {
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  font-weight: bold;
}

.powered-by-text {
  margin-right: 8px;
}

.powered-by-icon {
  width: 50px;
  height: 36px;
}

.icon {
  width: 24px;
  height: 24px;
}
</style>
