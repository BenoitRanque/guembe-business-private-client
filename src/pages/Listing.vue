<template>
  <q-page padding>
    <div class="row q-col-gutter-md">
      <div class="col-8">
        <div class="text-h6">
          {{listing.private_name}}
        </div>
        <div class="text-subtitle1">
          {{listing.public_name}}
        </div>
        <div class="text-subtitle2">
          {{listing.description}}
        </div>
        <div class="text-subtitle2">
          Disponible Desde: {{listing.available_from}}
        </div>
        <div class="text-subtitle2">
          Disponible Hasta: {{listing.available_to}}
        </div>
        <template v-if="listing.listing_stock">
          <div class="text-subtitle2">
            Stock Disponible: {{listing.listing_stock.available_stock}}
          </div>
          <div class="text-subtitle2">
            Stock Utilizado: {{listing.listing_stock.used_stock}}
          </div>
          <div class="text-subtitle2">
            Stock Restante: {{listing.listing_stock.remaining_stock}}
          </div>
        </template>
        <q-markup-table flat class="relative-position">
          <thead>
            <tr>
              <th style="width: 30%" class="text-left">Producto</th>
              <th style="width: 20%" class="text-left">Precio (unitario)</th>
              <th style="width: 20%" class="text-left">Cantidad</th>
              <th style="width: 30%" class="text-left">Tiempo de vida</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, index) in listing.listing_products" :key="index">
              <td>
                {{item.product.private_name}}
              </td>
              <td>
                {{(item.price / 100).toFixed(2)}}
              </td>
              <td>
                {{item.quantity}}
              </td>
              <td>
                {{item.lifetime.private_name}}
              </td>
            </tr>
          </tbody>
        </q-markup-table>
      </div>
      <q-list class="col-4">
        <q-item v-for="(image, index) in listing.listing_images" :key="index">
          <q-item-section>
            <q-img class="rounded-borders" :src="`http://localhost:3000/image/listing/${image.image_id}`">
              <span class="absolute-bottom q-py-sm q-px-md text-white row items-center absolute-position" style="background: rgba(0, 0, 0, 0.47)">
                <div class="col text-caption">
                  {{image.name}}
                </div>
                <div class="col-auto q-mr-xs">
                  <q-btn dense icon="mdi-star" flat size="sm" :color="image.highlighted ? 'yellow' : 'grey'" @click="highlightImage(image)">
                    <q-tooltip>
                      {{image.highlighted ? 'Esta imagen es resaltada' : 'Marcar como imagen resaltada'}}
                    </q-tooltip>
                  </q-btn>
                </div>
                <div class="col-auto">
                  <q-btn dense icon="mdi-delete-outline" size="sm" color="negative" @click="confirmRemoveImage(image.image_id)">
                    <q-tooltip>
                      Eliminar esta imagen
                    </q-tooltip>
                  </q-btn>
                </div>
              </span>
            </q-img>
          </q-item-section>
        </q-item>
        <q-item>
          <q-item-section>
            <q-uploader
              multiple
              hide-upload-btn
              auto-upload
              label="Aggregar Imagenes"
              class="full-width"
              bordered
              flat
              ref="uploader"
              @finish="loadData"
              :url="`http://localhost:3000/image/listing/upload/${listingId}`"
              accept=".jpg, .png, image/*"
              field-name="image"
              :headers="[{
                name: 'Authorization',
                value: `Bearer ${$store.state.credentials.token}`
              }]"
            >
            </q-uploader>
          </q-item-section>
        </q-item>
      </q-list>
    </div>
    <q-inner-loading :showing="loading">
      <q-spinner></q-spinner>
    </q-inner-loading>
  </q-page>
</template>

<script>
export default {
  name: 'Listing',
  props: {
    listingId: {
      required: true,
      type: String
    }
  },
  data () {
    return {
      loading: false,
      listing: null
    }
  },
  methods: {
    async highlightImage ({ highlighted, image_id }) {
      const query = /* GraphQL */`mutation ($where: store_listing_image_bool_exp! $set: store_listing_image_set_input) {
        update_store_listing_image (where: $where _set: $set) {
          affected_rows
        }
      }`

      const variables = {
        where: {
          image_id: {
            _eq: image_id
          }
        },
        set: {
          highlighted: !highlighted
        }
      }

      try {
        await this.$gql(query, variables, { role: 'administrator' })
        this.loadData()
      } catch (error) {
        this.$gql.handleError(error)
      }
    },
    confirmRemoveImage (imageId) {
      this.$q.dialog({
        title: 'Eliminar imagen?',
        message: 'Esta imagen sera eliminada de manera permanente',
        persistent: true,
        cancel: true
      }).onOk(() => this.removeImage(imageId))
    },
    async removeImage (imageId) {
      const query = /* GraphQL */`mutation ($where: store_listing_image_bool_exp!) {
        image: delete_store_listing_image (where: $where) {
          removed: affected_rows
        }
      }`

      const variables = {
        where: {
          image_id: {
            _eq: imageId
          }
        }
      }

      try {
        this.loading = true

        const { image: { removed } } = await this.$gql(query, variables, { role: 'administrator' })

        this.$q.notify({ icon: 'mdi-check', color: 'positive', message: `${removed} Imagen eliminada` })
      } catch (error) {
        this.$gql.handleError(error)
      } finally {
        this.loading = false
        this.loadData()
      }
    },
    async loadData () {
      const query = /* GraphQL */`query ($listing_id: uuid!) {
        data: store_listing_by_pk (listing_id: $listing_id) {
          listing_id
          public_name
          private_name
          description
          available_from
          available_to
          available_stock
          listing_stock {
            available_stock
            remaining_stock
            used_stock
          }
          listing_products {
            product {
              private_name
            }
            price
            quantity
            lifetime {
              private_name
            }
          }
          listing_images (order_by: { created_at: desc }) {
            image_id
            name
            highlighted
          }
        }
      }`

      const variables = {
        listing_id: this.listingId
      }

      try {
        this.loading = true

        const { data } = await this.$gql(query, variables, { role: 'administrator' })

        this.listing = data
      } catch (error) {
        this.$gql.handleError(error)
      } finally {
        this.loading = false
      }
    }
  },
  mounted () {
    this.loadData()
  }
}
</script>
