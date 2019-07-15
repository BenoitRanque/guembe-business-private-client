<template>
  <q-layout view="hHh Lpr lFf">
    <q-header elevated>
      <q-toolbar class="bg-white text-primary">
        <q-btn
          stretch
          flat
          dense
          @click="$router.push('/')"
        >
          <q-avatar rounded>
            <img src="statics/icons/icon-256x256.png">
          </q-avatar>
        </q-btn>
        <q-separator vertical inset />
        <q-btn flat dense stretch icon="mdi-menu" @click="showLeftDrawer = !showLeftDrawer"></q-btn>
        <q-separator vertical inset />
        <!-- <q-space></q-space> -->
        <q-toolbar-title>
          Biocentro Guembe {{$route.path}}
        </q-toolbar-title>

        <q-separator vertical inset />
        <template v-if="isAuthenticated">
          <q-btn-dropdown
            v-model="showUserSessionDropdown"
            flat stretch
            auto-close
            label="Mi Cuenta"
          >
            <q-list>
              <q-item clickable @click="$store.commit('website/LOCALE', $store.state.website.locale === 'es' ? 'en' : 'es')">
                <q-item-section side>
                  <q-icon name="mdi-flag"></q-icon>
                </q-item-section>
                <q-item-section>
                  Cambiar Idioma {{$store.state.website.locale}}
                </q-item-section>
              </q-item>
              <q-item clickable @click="showUserPasswordDialog = true">
                <q-item-section side>
                  <q-icon name="mdi-lock-reset"></q-icon>
                </q-item-section>
                <q-item-section>
                  Cambiar Contraseña
                </q-item-section>
              </q-item>
              <q-separator></q-separator>
              <q-item clickable @click="logout">
                <q-item-section side>
                  <q-icon name="mdi-logout"></q-icon>
                </q-item-section>
                <q-item-section>
                  Cerrar Session
                </q-item-section>
              </q-item>
            </q-list>
          </q-btn-dropdown>
        </template>
        <template v-else>
          <q-btn-dropdown flat stretch label="Iniciar Session" v-model="showLoginDropdown">
            <user-authentication></user-authentication>
          </q-btn-dropdown>
        </template>
      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="showLeftDrawer"
      bordered
      content-class="bg-grey-2"
    >
      <q-list>
        <q-item-label header>Menu principal</q-item-label>
        <!-- <q-item to="/holidays">
          <q-item-section>
            <q-item-label>
              Feriados
            </q-item-label>
          </q-item-section>
        </q-item>
        <q-item to="/lifetimes">
          <q-item-section>
            <q-item-label>
              Vigencias
            </q-item-label>
          </q-item-section>
        </q-item>
        <q-item to="/products">
          <q-item-section>
            <q-item-label>
              Productos
            </q-item-label>
          </q-item-section>
        </q-item>
        <q-item to="/listings">
          <q-item-section>
            <q-item-label>
              Paquetes
            </q-item-label>
          </q-item-section>
        </q-item>
        <q-item to="/invoices">
          <q-item-section>
            <q-item-label>
              Facturas
            </q-item-label>
          </q-item-section>
        </q-item>
        <q-item to="/purchases">
          <q-item-section>
            <q-item-label>
              Compras
            </q-item-label>
          </q-item-section>
        </q-item>
        <q-item to="/clients">
          <q-item-section>
            <q-item-label>
              Clientes
            </q-item-label>
          </q-item-section>
        </q-item>
        <q-item to="/purchasedproducts" exact>
          <q-item-section>
            <q-item-label>
              Productos Comprados
            </q-item-label>
          </q-item-section>
        </q-item>
        <q-item to="/purchasedproducts/use">
          <q-item-section>
            <q-item-label>
              Uso de productos Comprados
            </q-item-label>
          </q-item-section>
        </q-item> -->
        <q-item to="/website">
          <q-item-section>
            <q-item-label>
              Sitio Web
            </q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
    </q-drawer>

    <router-view name="background"></router-view>

    <q-page-container>
      <router-view />
    </q-page-container>

    <q-dialog v-model="showLoginDialog">
      <user-authentication></user-authentication>
    </q-dialog>

    <q-dialog v-model="showUserPasswordDialog">
      <user-password></user-password>
    </q-dialog>
  </q-layout>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import UserAuthentication from 'components/UserAuthentication'
import UserPassword from 'components/UserPassword'

export default {
  name: 'UserLayout',
  components: {
    UserAuthentication,
    UserPassword
  },
  data () {
    return {
      showLeftDrawer: false,
      showLoginDialog: false,
      showUserPasswordDialog: false,
      showLoginDropdown: false,
      showUserSessionDropdown: false
    }
  },
  watch: {
    isAuthenticated () {
      this.showLoginDropdown = false
      this.showUserSessionDropdown = false
    }
  },
  computed: {
    ...mapGetters(['isAuthenticated'])
  },
  methods: {
    ...mapActions({ storeLogout: 'LOGOUT' }),
    async logout () {
      try {
        await this.storeLogout()
        this.$router.push('/')
      } catch (error) {
        this.$api.handleError(error)
      }
    },
    authenticationRequested () {
      this.showLoginDialog = true
    }
  },
  created () {
    this.$root.$on('AUTHENTICATION_REQUIRED', this.authenticationRequested)
  },
  beforeDestroy () {
    this.$root.$off('AUTHENTICATION_REQUIRED', this.authenticationRequested)
  }
}
</script>
