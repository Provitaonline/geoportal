<template>
  <article class="media">
    <div class="media-content">
      <div class="content">
        <p>
          <div class="headline is-size-5 has-text-weight-bold">{{item.node.headline[$i18n.locale.substr(0, 2)]}}</div>
          <small>{{$d(new Date(item.node.date), 'long')}}</small>
          <br><br>
          {{item.node.text[$i18n.locale.substr(0, 2)]}}
        </p>
        <p v-if="item.node.reference" class="has-text-weight-semibold">
          <g-link :to="item.node.reference">{{$t('label.readmore')}}</g-link>
        </p>
      </div>
    </div>
    <figure @click="showImageModal(item.node.thumb)" v-if="item.node.thumb" class="media-right">
      <a class="image">
        <g-image :src="item.node.thumb"></g-image>
      </a>
    </figure>
    <b-modal v-if="image" v-model="isImageModalActive">
      <g-image :src="image"></g-image>
    </b-modal>
  </article>
</template>

<style lang="scss" scoped>

  @import "~/assets/style/_variables";

  .image {
    width: 300px;
  }

  ::v-deep .modal .modal-content {
    width: auto !important;
  }

  ::v-deep .modal-close {
    display: block !important;
  }

  .headline {
    color: $site-color
  }

  @media screen and (max-width: 600px) {
    .media {
      flex-direction: column;
    }
    .media-right {
      align-self: center;
      margin-left: 0;
      margin-top: 12px;
    }
  }

</style>

<script>
  export default {
    name: 'DisplayNewsItem',
    props: {
      item: { type: Object, required: true }
    },
    data() {
      return {
        isImageModalActive: false,
        image: null
      }
    },
    methods: {
      showImageModal (image) {
        this.image = image
        this.isImageModalActive = true
      }
    }
  }
</script>
