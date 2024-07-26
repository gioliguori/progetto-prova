<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          @click="toggleLeftDrawer"
          icon="menu"
          aria-label="Menu"
        />
        <q-toolbar-title class="title-font"> Schiano.GO </q-toolbar-title>
        <q-space />

        <div class="q-gutter-sm row items-center no-wrap">
          <q-btn
            round
            dense
            flat
            color="white"
            :icon="$q.fullscreen.isActive ? 'fullscreen_exit' : 'fullscreen'"
            @click="$q.fullscreen.toggle()"
            v-if="$q.screen.gt.sm"
          >
          </q-btn>

          <q-btn round flat @click="goToLogin">
            <q-avatar size="26px">
              <img src="src/assets/shutdown.png" />
            </q-avatar>
          </q-btn>
        </div>
      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="leftDrawerOpen"
      show-if-above
      bordered
      class="bg-primary text-white"
    >
      <q-list>
        <q-item to="/DashboardAdmin" active-class="q-item-no-link-highlighting">
          <q-item-section avatar>
            <q-icon name="dashboard" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Dashboard</q-item-label>
          </q-item-section>
        </q-item>

        <q-item
          to="/TreeTable_LISTAPARTNER"
          active-class="q-item-no-link-highlighting"
        >
          <q-item-section avatar>
            <q-icon name="list" />
          </q-item-section>
          <q-item-section>
            <q-item-label>LISTA PARTNER</q-item-label>
          </q-item-section>
        </q-item>

        <q-item
          to="/TreeTable_LISTABICI"
          active-class="q-item-no-link-highlighting"
        >
          <q-item-section avatar>
            <q-icon name="list" />
          </q-item-section>
          <q-item-section>
            <q-item-label>LISTA BICI</q-item-label>
          </q-item-section>
        </q-item>

        <q-item
          to="/TreeTable_INSERISCIPARTNER"
          active-class="q-item-no-link-highlighting"
        >
          <q-item-section avatar>
            <q-icon name="list" />
          </q-item-section>
          <q-item-section>
            <q-item-label>INSERISCI PARTNER</q-item-label>
          </q-item-section>
        </q-item>

        <!-- Modified WEBEX item with custom icon -->
        <q-item clickable @click="redirectToWebex" active-class="q-item-no-link-highlighting">
          <q-item-section avatar>
            <q-img src="src/assets/Webex.png" />
          </q-item-section>
          <q-item-section>
            <q-item-label>ASSISTENZA (WEBEX)</q-item-label>
          </q-item-section>
        </q-item>

        <q-item to="/Lock" active-class="q-item-no-link-highlighting">
          <q-item-section avatar>
            <q-icon name="lock" />
          </q-item-section>
          <q-item-section>
            <q-item-label>LOCK SCREEN</q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
    </q-drawer>

    <q-page-container class="bg-grey-2">
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import { defineComponent, ref } from "vue";
import { useQuasar } from "quasar";
import { useRouter } from "vue-router";

export default defineComponent({
  name: "MainLayout",

  setup() {
    const leftDrawerOpen = ref(false);
    const $q = useQuasar();
    const router = useRouter();
    
    const goToLogin = () => {
      router.push("/LoginAdmin");
    };

    const redirectToWebex = () => {
      $q.dialog({
        title: 'ATTENZIONE!',
        message: 'Sarai reindirizzato alla pagina di login di webex!',
        ok: {
          label: 'OK',
          color: 'primary'
        },
      }).onOk(() => {
        window.location.href = 'https://signin.webex.com/signin?surl=https%3A%2F%2Fsignin.webex.com%2Fcollabs%2Fauth%3F';
      });
    };

    return {
      $q,
      leftDrawerOpen,
      toggleLeftDrawer() {
        leftDrawerOpen.value = !leftDrawerOpen.value;
      },
      goToLogin,
      redirectToWebex
    };
  },
});
</script>
