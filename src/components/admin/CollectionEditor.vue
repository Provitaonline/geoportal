<template>
  <div class="card">
    <ValidationObserver v-slot="{passes, dirty}">
      <div style="background-color: white; padding: 12px;" class="card-header">
        <p class="card-header-title is-size-4">
          <span v-if="isNew">{{$t('label.newcollection')}}:&nbsp;</span>
          {{metaCollectionFlat['collectionId']}}
        </p>
        <div class="buttons">
          <b-button @click="$parent.close()" style="width: 140px;"><font-awesome :icon="['fas', 'times']"/>&nbsp;{{$t('label.cancel')}}</b-button>
          <b-button @click="passes(acceptChanges)" :disabled="!dirty" style="width: 140px;"><font-awesome :icon="['fas', 'check']"/>&nbsp;{{$t('label.save')}}</b-button>
        </div>
      </div>
      <div class="card-content">
        <div class="content">
          <div>
            <ValidationProvider rules="required|min:4" v-slot="{ errors, valid }">
              <b-field :label="$t('label.collectionid')" :type="{ 'is-danger': errors[0] }" :message="errors">
                <b-input v-model="metaCollectionFlat['collectionId']"></b-input>
              </b-field>
            </ValidationProvider>
          </div>
          <CommonMeta :commonMetaFlat="metaCollectionFlat"/>
          <CommonTileInfo :commonMetaFlat="metaCollectionFlat"/>
        </div>
      </div>

    </ValidationObserver>
  </div>
</template>

<style lang="scss" scoped>

  ::v-deep textarea {
    font-family: monospace;
    font-size: 0.9rem;
  }

</style>

<script>
import { ValidationObserver, ValidationProvider } from 'vee-validate'
import CommonMeta from '~/components/admin/CommonMeta.vue'
import CommonTileInfo from '~/components/admin/CommonTileInfo.vue'

import * as validation from '~/utils/validation'

let flatten = require('flat')
let unflatten = require('flat').unflatten

export default {
  name: 'CollectionEditor',
  props: {
    collection: { type: Object, required: true }
  },
  data() {
    return {
      metaCollectionFlat: flatten(this.collection),
      c: this.collection,
      isNew: false
    }
  },
  components: {
    ValidationObserver,
    ValidationProvider,
    CommonMeta,
    CommonTileInfo
  },
  beforeCreate() {
    validation.localize(this.$i18n.locale.toString().substr(0,2))
  },
  created() {
    if (!this.collection.collectionId) this.isNew = true
  },
  methods: {
    acceptChanges() {
      this.c = unflatten(this.metaCollectionFlat)
      this.$eventBus.$emit('acceptcollectionchanges', this.c)
      this.$parent.close()
    }
  }
}
</script>
