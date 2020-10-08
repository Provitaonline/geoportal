<template>
  <div class="container" style="max-width: 900px;">
    <b-loading v-model="isLoading"></b-loading>
    <div class="buttons" style="justify-content: center;">
      <b-button @click="confirmDelete()" style="width: 160px;" :disabled="!questionListCheckedRows.length"><font-awesome :icon="['fas', 'trash-alt']"/>&nbsp;{{$t('label.removechecked')}}</b-button>
      <b-button @click="addFAQQuestion()" style="width: 160px;"><font-awesome :icon="['fas', 'plus']"/>&nbsp;{{$t('label.addquestion')}}</b-button>
      <b-button @click="saveChanges()" style="width: 160px;" :disabled="!isChanged" :type="isChanged ? 'is-warning' : ''"><font-awesome :icon="['fas', 'cloud-upload-alt']"/>&nbsp;{{$t('label.savechanges')}}</b-button>
    </div>
    <b-table
      checkable
      hoverable
      :header-checkable="false"
      v-if="FAQ"
      :data="FAQ"
      :checked-rows.sync="questionListCheckedRows"
      draggable
      @dragstart="dragStart"
      @dragover="dragOver"
      @drop="dropRow">
      <b-table-column field="question" :label="$t('label.question')" v-slot="props">
        {{props.row.question[$i18n.locale.substr(0, 2)]}}
      </b-table-column>
      <b-table-column field="subject" :label="$t('label.subject')" v-slot="props">
        {{$t('label.faqsubjects')[props.row.subject]}}
      </b-table-column>
      <b-table-column label="Info" centered v-slot="props">
        <a @click="editFAQQuestion(props.index)">
          <font-awesome :icon="['far', 'edit']"/>
        </a>
      </b-table-column>
    </b-table>
  </div>

</template>

<script>
  import {getFAQFromRepo, saveFAQ} from '~/utils/data'
  import FAQEditor from '~/components/FAQEditor'

  export default {
    name: 'AdminFAQTab',
    data() {
      return {
        FAQ: null,
        questionListCheckedRows: [],
        isLoading: true,
        currentIndex: 0,
        isNew: false,
        isChanged: false,
        draggingRowIndex: null
      }
    },
    mounted() {
      this.$eventBus.$on('faqtabvisible', this.getFAQ)
      this.$eventBus.$on('acceptfaqquestionchanges', this.acceptFAQQuestionChanges)
    },
    methods: {
      getFAQ() {
        if (!this.FAQ) {
          console.log('get faq')
          getFAQFromRepo(sessionStorage.githubtoken).then((result) => {
            this.FAQ = result
            this.isLoading = false
          }).catch((err) => {
            this.FAQ = []
            this.isLoading = false
            if (err.response.status != 404) {
              console.log('error getting faq from repo')
            }
          })
        }
      },
      editFAQQuestion(index) {
        this.isNew = false
        this.currentIndex = index
        this.openFAQEditor(JSON.parse(JSON.stringify(this.FAQ[index])))
      },
      addFAQQuestion() {
        this.isNew = true
        this.openFAQEditor({question:{en: '', es: ''}, answer:{en: '', es: ''}})
      },
      openFAQEditor(question) {
        this.$buefy.modal.open({
          parent: this,
          canCancel: ['escape', 'x'],
          component: FAQEditor,
          props: {
            faqQuestion: question
          }
        })
      },
      acceptFAQQuestionChanges(question) {
        this.isChanged = true
        if (this.isNew) {
          this.FAQ.push(question)
        } else {
          this.$set(this.FAQ, this.currentIndex, question)
        }
      },
      confirmDelete() {
        console.log('confirm delete')
        this.$buefy.dialog.confirm({
          title: this.$t('message.removequestions'),
          message: this.$t('message.removequestionswarning'),
          confirmText: this.$t('label.confirm'),
          cancelText: this.$t('label.cancel'),
          type: 'none',
          focusOn: 'cancel',
          onConfirm: () => {this.deleteFAQQuestions()}
        })
      },
      saveChanges() {
        saveFAQ(sessionStorage.githubtoken, this.FAQ).then(() => {
          console.log('saved FAQ')
          this.isChanged = false
          this.$store.commit('setPublishIndicator', true)
        }).catch((e) => {
          console.log('error saving FAQ to github ', e)
        })
      },
      deleteFAQQuestions() {
        this.FAQ = this.FAQ.filter(x => !this.questionListCheckedRows.includes(x))
        this.isChanged = true
      },
      dragStart(payload) {
        this.draggingRowIndex = payload.index
        payload.event.dataTransfer.effectAllowed = 'move'
      },
      dragOver(payload) {
        payload.event.dataTransfer.dropEffect = 'move'
        payload.event.preventDefault()
      },
      dropRow(payload) {
        var element = this.FAQ[this.draggingRowIndex]
        this.FAQ.splice(this.draggingRowIndex, 1)
        this.FAQ.splice(payload.index, 0, element)
        this.isChanged = true
      }
    }
  }

</script>
