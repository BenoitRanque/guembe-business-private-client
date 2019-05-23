<template>
  <q-form @submit="submit" @reset="reset">
    <div class="q-gutter-md q-pa-md">
      <div class="text-subtitle2 row">
        Creacion de paquete
        <q-space></q-space>
        Bs {{listing.listing_products.reduce((subtotal, { price, quantity }) => subtotal + ((getPriceAsNumber(price) / 100)* quantity), 0).toFixed(2)}}
      </div>
      <q-input
        filled
        label="Nombre Privado"
        hint="Nombre de uso interno"
        v-model="listing.private_name"
        required
        lazy-rules
        :rules="[]"
      ></q-input>

      <q-input
        filled
        label="Nombre Publico"
        hint="Nombre de uso publico"
        v-model="listing.public_name"
        required
        lazy-rules
        :rules="[]"
      ></q-input>
      <q-input
        filled
        type="textarea"
        label="Descripcion"
        hint="Descripcion detallada. Uso publico & interno"
        v-model="listing.description"
        required
        lazy-rules
        :rules="[]"
      ></q-input>
      <q-input
        filled
        v-model="listing.available_from"
        label="Inicio del tiempo de disponibilidad"
        hint="El paquete estara disponible para compra a partir de esta fecha"
        required
        lazy-rules
        mask="date"
        :rules="[
          value => /^-?[\d]+\/[0-1]\d\/[0-3]\d$/.test(value) ? true : 'Formato invalido'
        ]"
      >
        <template v-slot:append>
          <q-icon name="mdi-calendar" class="cursor-pointer">
            <q-popup-proxy>
              <q-date today-btn v-model="listing.available_from" />
            </q-popup-proxy>
          </q-icon>
        </template>
      </q-input>
      <q-input
        filled
        v-model="listing.available_to"
        label="Fin del tiempo de disponibilidad"
        hint="El paquete esta disponible hasta esta fecha"
        lazy-rules
        required
        mask="date"
        :rules="[
          value => /^-?[\d]+\/[0-1]\d\/[0-3]\d$/.test(value) ? true : 'Formato invalido',
          value => listing.available_to !== null && new Date(value) >= new Date(listing.available_from) ? true : 'Fin de tiempo de disponibilidad debe ser igual o mayor a inicio de tiempo de disponibilidad'
        ]"
      >
        <template v-slot:append>
          <q-icon name="mdi-calendar" class="cursor-pointer">
            <q-popup-proxy>
              <q-date today-btn v-model="listing.available_to" />
            </q-popup-proxy>
          </q-icon>
        </template>
      </q-input>

      <q-input
        filled
        type="number"
        v-model="listing.available_stock"
        clearable
        label="Stock disponible"
        hint="Cantidad maxima de este paquete que podra ser vendida (opcional)"
        lazy-rules
        :rules="[
          value => value === null || value === '' || Number(value) > 0 ? true : 'Stock disponible deber ser nulo o mayor que 0'
        ]"
      ></q-input>
      <q-markup-table flat dense style="table-layout: fixed;">
        <thead>
          <tr>
            <th style="width: 30%" class="text-left">Producto</th>
            <th style="width: 20%" class="text-left">Precio (unitario)</th>
            <th style="width: 20%" class="text-left">Cantidad</th>
            <th style="width: 30%" class="text-left">Tiempo de vida</th>
            <th style="width: auto"></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, index) in listing.listing_products" :key="index">
            <td>
              <q-select
                dense
                filled
                v-model="item.product"
                :options="options.product"
                hide-bottom-space
                required
                lazy-rules
                :rules="[]"
              ></q-select>
            </td>
            <td>
              <q-input
                v-model="item.price"
                type="number"
                step="0.01"
                min="0"
                hide-bottom-space
                lazy-rules
                required
                :rules="[
                  value => value ? true : 'Campo Requerido',
                  value => /^\d+\.?\d?\d?$/.test(value) ? true : 'Valor Invalido'
                ]"
                dense
                filled
              ></q-input>
            </td>
            <td>
              <q-input
                v-model="item.quantity"
                type="number"
                min="1"
                required
                lazy-rules
                hide-bottom-space
                :rules="[]"
                dense
                filled
              ></q-input>
            </td>
            <td>
              <q-select
                v-model="item.lifetime"
                :options="options.lifetime"
                lazy-rules
                required
                hide-bottom-space
                :rules="[]"
                dense
                filled
              ></q-select>
            </td>
            <td class="text-right">
              <q-btn
                icon="mdi-delete-outline"
                color="negative"
                flat
                dense
                @click="listing.listing_products.splice(index, 1)"
              >
                <q-tooltip>
                  Eliminar Producto
                </q-tooltip>
              </q-btn>
            </td>
          </tr>
          <tr>
            <td colspan="5" class="text-center">
              <q-btn
                class="q-ma-sm"
                icon="mdi-plus"
                color="primary"
                flat
                @click="listing.listing_products.push({ product: null, lifetime: null, price: '', quantity: '' })"
              >Aggregar Producto</q-btn>
            </td>
          </tr>
        </tbody>
      </q-markup-table>
    </div>
    <q-separator></q-separator>
    <div class="row justify-around q-pa-md">
      <q-btn color="secondary" flat type="reset">reset</q-btn>
      <q-btn color="primary" type="submit">crear</q-btn>
    </div>
    <q-inner-loading :showing="loading">
      <q-spinner></q-spinner>
    </q-inner-loading>
  </q-form>
</template>

<script>
export default {
  name: 'CreateListing',
  data () {
    return {
      loading: false,
      options: {
        lifetime: [],
        product: []
      },
      listing: {
        public_name: '',
        private_name: '',
        description: '',
        available_from: null,
        available_to: null,
        available_stock: '',
        listing_products: [
          {
            product: null,
            lifetime: null,
            price: '',
            quantity: ''
          }
        ]
      }
    }
  },
  computed: {
    uploadHeaders () {
      return [{
        name: 'Authorization',
        value: `Bearer ${this.$store.state.credentials.token}`
      }]
    },
    uploadUrl () {
      return `http://localhost:3000/upload/listing/image/${this.listing_id}`
    }
  },
  methods: {
    getPriceAsNumber (textPrice) {
      if (textPrice === '') {
        return 0
      }
      const [ , wholes = 0, tens = 0, cents = 0 ] = textPrice.match(/(\d+)\.?(\d)?(\d)?/)
      return (Number(wholes) * 100) + (Number(tens) * 10) + Number(cents)
    },
    reset () {
      this.listing.public_name = ''
      this.listing.private_name = ''
      this.listing.description = ''
      this.listing.available_from = null
      this.listing.available_to = null
      this.listing.available_stock = null
      this.listing.listing_products = [
        {
          product: null,
          lifetime: null,
          price: '',
          quantity: ''
        }
      ]
    },
    submit () {
      this.$q.dialog({
        title: 'Confirmar',
        message: 'Este registro no puede modificicarse luego de la creacion',
        persistent: true,
        cancel: true
      }).onOk(this.createListing)
    },
    async createListing () {
      if (this.listing.listing_products.length === 0) {
        this.$q.notify({ icon: 'mdi-alert', color: 'warning', message: 'Debe incluir por lo menos un producto' })
        return
      }

      const query = /* GraphQL */`mutation ($objects: [store_listing_insert_input!]!) {
        insert: insert_store_listing (objects: $objects) {
          affected_rows
          listings: returning {
            id: listing_id
            name: private_name
          }
        }
      }`

      const variables = {
        objects: {
          ...this.listing,
          available_stock: this.listing.available_stock ? Number(this.listing.available_stock) : null,
          listing_products: {
            data: this.listing.listing_products.map(({ product, lifetime, price, quantity }) => ({
              quantity: Number(quantity),
              price: this.getPriceAsNumber(price),
              lifetime_id: lifetime.value,
              product_id: product.value
            }))
          }
        }
      }

      try {
        this.loading = true

        const { insert: { listings: [ { id, name } ] } } = await this.$gql(query, variables, { role: 'administrator' })

        this.$q.notify({ icon: 'mdi-check', color: 'positive', message: `Paquete ${name} Creado Exitosamente` })
        this.$router.push(`/listing/${id}`)
      } catch (error) {
        this.$gql.handleError(error)
      } finally {
        this.loading = false
      }
    },
    async loadOptions () {
      const query = /* GraphQL */`query {
        lifetime: calendar_lifetime {
          value: lifetime_id
          label: private_name
        }
        product: store_product {
          value: product_id
          label: private_name
        }
      }`
      const variables = {}

      try {
        this.loading = true

        const { lifetime, product } = await this.$gql(query, variables, { role: 'administrator' })

        this.options.lifetime = lifetime
        this.options.product = product
      } catch (error) {
        this.$gql.handleError(error)
      } finally {
        this.loading = false
      }
    }
  },
  mounted () {
    this.loadOptions()
  }
}
</script>
