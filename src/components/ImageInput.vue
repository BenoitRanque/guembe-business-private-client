<template>
  <div>
    <!-- table with extra row for the currently selected image -->
    <q-item @click="value ? showImageSelectDialog = true : null">
      <q-item-section avatar :class="value ? 'cursor-pointer' : ''" @click="showImagePreviewDialog = true">
        <q-avatar rounded color="grey-4">
          <q-img v-if="value" style="width: 80px" :src="$img.src(value.image_id, 'xs')" :placeholder="value.placeholder"></q-img>
        </q-avatar>
      </q-item-section>
      <q-item-section>
        {{value ? value.name : null}}
      </q-item-section>
      <q-item-section side>
        <q-btn icon="mdi-image-search" dense flat @click="showImageSelectDialog = true">
          <q-tooltip>
            {{ value ? 'Cambiar' : 'Seleccionar'}} Imagen
          </q-tooltip>
        </q-btn>
      </q-item-section>
    </q-item>
    <dialog-window v-model="showImageSelectDialog">
      <template v-slot:title>
        Selecionar Imagen
      </template>
      <image-select @done="imageSelected" :format="format">
        <template v-slot:upload>
          <q-btn icon="mdi-upload" dense flat @click="showImageUploadDialog = true">
            <q-tooltip>
              Subir Imagen
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
    <q-dialog v-model="showImagePreviewDialog">
      <q-card style="min-width: 80vw">
        <q-bar>
          {{value ? value.name : null}}
          <q-space></q-space>
          <q-btn flat dense icon="mdi-close" v-close-popup></q-btn>
        </q-bar>
        <q-img
          v-if="value"
          :src="$img.src(value.image_id)"
          :srcset="$img.srcset(value)"
          :placeholder="value.placeholder"
        ></q-img>
      </q-card>
    </q-dialog>
  </div>
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
      type: Object,
      required: false
    },
    format: {
      type: String,
      required: true
    }
  },
  data () {
    return {
      showImageSelectDialog: false,
      showImageUploadDialog: false,
      showImagePreviewDialog: false
    }
  },
  methods: {
    imageUploaded (image) {
      this.showImageSelectDialog = false
      this.showImageUploadDialog = false
      this.$emit('input', image)
    },
    imageSelected (image) {
      console.log(image)
      this.showImageSelectDialog = false
      this.showImageUploadDialog = false
      this.$emit('input', image)
    }
  }
}
</script>
