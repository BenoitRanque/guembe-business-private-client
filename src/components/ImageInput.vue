<template>
  <q-field v-bind="$attrs" :value="value" @input="$event  => $emit('input', $event)" @click.native="showImageSelectDialog = true">
    <template v-slot:prepend>
      <q-avatar rounded color="grey-4" :class="image ? 'cursor-pointer' : ''" @click.stop="showImagePreviewDialog = true">
        <q-img v-if="image" :src="$img.src(image.image_id, 'xs')" :placeholder="value.placeholder"></q-img>
      </q-avatar>
    </template>
    <template v-slot:control>
      <div class="cursor-pointer col self-stretch row items-center">
        {{image ? image.name : null}}
      </div>
    </template>
    <template v-slot:append>
      <q-icon name="mdi-image-search">
        <q-tooltip>
          {{ image ? 'Cambiar' : 'Seleccionar'}} Imagen
        </q-tooltip>
      </q-icon>
    </template>
    <dialog-window v-model="showImageSelectDialog" title="Selecionar Imagen">
      <image-select @done="imageSelected" :format="format">
        <template v-slot:upload>
          <q-btn icon="mdi-upload" class="q-mx-sm" dense color="accent" @click="showImageUploadDialog = true">
            <q-tooltip>
              Cargar Imagen Nueva
            </q-tooltip>
          </q-btn>
        </template>
      </image-select>
    </dialog-window>
    <q-dialog v-model="showImageUploadDialog" minimized>
      <q-card>
        <q-bar>
          Subir Imagen
          <q-space></q-space>
          <q-btn flat dense icon="mdi-close" v-close-popup></q-btn>
        </q-bar>
        <image-upload @done="imageUploaded" :format="format"></image-upload>
      </q-card>
    </q-dialog>
    <q-dialog v-model="showImagePreviewDialog" v-if="image">
      <q-card style="width: 60vw">
        <q-bar>
          {{image ? image.name : null}}
          <q-space></q-space>
          <q-btn flat dense icon="mdi-close" v-close-popup></q-btn>
        </q-bar>
        <q-img
          v-if="image"
          :src="$img.src(image.image_id)"
          :srcset="$img.srcset(image)"
          :placeholder="image.placeholder"
        ></q-img>
      </q-card>
    </q-dialog>
  </q-field>
</template>

<script>
import DialogWindow from 'components/DialogWindow'
import ImageSelect from 'components/ImageSelect'
import ImageUpload from 'components/ImageUpload'
export default {
  name: 'ImageInput',
  components: { DialogWindow, ImageSelect, ImageUpload },
  props: {
    value: {
      type: String,
      required: false
    },
    format: {
      type: String,
      required: false
    }
  },
  data () {
    return {
      image: null,
      showImageSelectDialog: false,
      showImageUploadDialog: false,
      showImagePreviewDialog: false
    }
  },
  watch: {
    value () {
      this.loadImage()
    }
  },
  methods: {
    async loadImage () {
      if (this.value) {
        try {
          this.image = await this.$store.dispatch('website/IMAGE', this.value)
        } catch (error) {
          this.$gql.handleError(error)
        }
      } else {
        this.image = null
      }
    },
    imageUploaded (image) {
      this.showImageSelectDialog = false
      this.showImageUploadDialog = false
      this.$emit('input', image)
    },
    imageSelected (image) {
      this.showImageSelectDialog = false
      this.showImageUploadDialog = false
      this.$emit('input', image)
    }
  },
  mounted () {
    this.loadImage()
  }
}
</script>
