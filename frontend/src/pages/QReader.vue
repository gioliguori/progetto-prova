<template>
    <q-page class="q-pa-md">
      <div class="row justify-center">
        <div class="col-12 col-md-8">
          <q-card>
            <q-card-section>
              <div class="text-h6">Scannerizza il QR Code</div>
            </q-card-section>
  
            <q-card-section>
              <qrcode-stream ref="qrcodeStream" @decode="onDecode" @init="onInit" />
            </q-card-section>
  
            <q-card-section>
              <q-btn color="primary" label="Scansiona QR Code" @click="startScan" />
            </q-card-section>
  
            <q-card-section v-if="decodedText">
              <div>Contenuto del QR Code:</div>
              <q-chip>{{ decodedText }}</q-chip>
            </q-card-section>
  
            <q-card-section v-if="error">
              <q-banner class="bg-red-2 text-red-9">
                Errore: {{ error }}
              </q-banner>
            </q-card-section>
          </q-card>
        </div>
      </div>
    </q-page>
  </template>
  
  <script>
  import { QrcodeStream } from 'vue-qrcode-reader'
  import { Notify } from 'quasar'
  
  export default {
    components: {
      QrcodeStream
    },
    data () {
      return {
        decodedText: '',
        error: null,
        scanning: false
      }
    },
    methods: {
      onDecode (text) {
        if (this.scanning) {
          console.log('QR code decodificato:', text)
          this.decodedText = text
          this.showSuccessNotification()
          this.scanning = false
        } else {
          console.log('Scansione disabilitata.')
        }
      },
      onInit (promise) {
        console.log('Inizializzazione della fotocamera iniziata.')
        promise.then(() => {
          console.log('Fotocamera inizializzata correttamente.')
        }).catch(error => {
          console.error('Errore durante l\'inizializzazione della fotocamera:', error)
          if (error.name === 'NotAllowedError') {
            this.error = 'Accesso alla fotocamera non consentito. Per favore, abilita i permessi.'
          } else if (error.name === 'NotFoundError') {
            this.error = 'Nessuna fotocamera trovata.'
          } else {
            this.error = 'Errore sconosciuto: ' + error.message
          }
        })
      },
      startScan () {
        this.scanning = true
        console.log('Scansione avviata.')
        // Forza una scansione manuale
        this.$refs.qrcodeStream.$el.querySelector('video').click()
      },
      showSuccessNotification () {
        Notify.create({
          type: 'positive',
          message: 'Scansione QR code avvenuta con successo!',
          timeout: 2000, // Durata della notifica in millisecondi
          position: 'top-right' // Posizione della notifica
        })
      }
    }
  }
  </script>
  
  <style>
  .qrcode-stream__inner-wrapper {
    width: 100%;
    padding-bottom: 56.25%; /* 16:9 aspect ratio */
    position: relative;
  }
  
  .qrcode-stream__camera {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }
  </style>
  