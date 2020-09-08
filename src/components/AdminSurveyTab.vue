<template>
  <div class="container" style="max-width: 900px;">
    <b-loading v-model="isLoading"></b-loading>
    <div class="buttons" style="justify-content: center;">
      <b-button @click="" style="width: 160px;" :disabled="!questionListCheckedRows.length"><font-awesome :icon="['fas', 'trash-alt']"/>&nbsp;{{$t('label.removechecked')}}</b-button>
      <b-button @click="addQuestion()" style="width: 160px;"><font-awesome :icon="['fas', 'plus']"/>&nbsp;{{$t('label.addquestion')}}</b-button>
      <b-button @click="" style="width: 160px;" :disabled="!isChanged" :type="isChanged ? 'is-warning' : ''"><font-awesome :icon="['fas', 'plus']"/>&nbsp;{{$t('label.savechanges')}}</b-button>
    </div>
    <b-table
      checkable
      hoverable
      :header-checkable="false"
      v-if="surveyTemplate"
      :data="surveyTemplate.fields"
      :checked-rows.sync="questionListCheckedRows" 
      draggable
      @dragstart="dragStart"
      @dragover="dragOver"
      @drop="dropRow">
      <b-table-column field="fieldname" :label="$t('label.name')" v-slot="props">
        {{props.row.fieldname}}
      </b-table-column>
      <b-table-column field="label" :label="$t('label.question')" v-slot="props">
        {{props.row.label[$i18n.locale.substr(0, 2)]}}
      </b-table-column>
      <b-table-column label="Info" centered v-slot="props">
        <a @click="editQuestion(props.index)">
          <font-awesome :icon="['far', 'edit']"/>
        </a>
      </b-table-column>
    </b-table>
  </div>

</template>

<script>
  import {getSurveyTemplateFromRepo} from '~/utils/data'
  import SurveyTemplateEditor from '~/components/SurveyTemplateEditor'

  export default {
    name: 'AdminSurveyTab',
    data() {
      return {
        surveyTemplate: null,
        questionListCheckedRows: [],
        isLoading: true,
        currentIndex: 0,
        isNew: false,
        isChanged: false,
        draggingRowIndex: null
      }
    },
    mounted() {
      this.$eventBus.$on('surveytabvisible', this.getSurveyTemplate)
      this.$eventBus.$on('acceptquestionchanges', this.acceptQuestionChanges)
    },
    methods: {
      getSurveyTemplate() {
        if (!this.surveyTemplate) {
          console.log('get survey template')
          getSurveyTemplateFromRepo().then((result) => {
            this.surveyTemplate = result
            this.isLoading = false
          })
        }
      },
      editQuestion(index) {
        this.isNew = false
        this.currentIndex = index
        this.openSurveyTemplateEditor(JSON.parse(JSON.stringify(this.surveyTemplate.fields[index])))
      },
      addQuestion() {
        this.isNew = true
        this.openSurveyTemplateEditor({label:{en: '', es: ''}})
      },
      openSurveyTemplateEditor(question) {
        this.$buefy.modal.open({
          parent: this,
          canCancel: ['escape', 'x'],
          component: SurveyTemplateEditor,
          props: {
            question: question
          }
        })
      },
      acceptQuestionChanges(question) {
        this.isChanged = true
        if (this.isNew) {
          this.surveyTemplate.fields.push(question)
        } else {
          this.$set(this.surveyTemplate.fields, this.currentIndex, question)
        }
        /* saveSurveyTemplate(sessionStorage.githubtoken, question).then(() => {
          let index = this.surveyTemplate.fields.findIndex(item => item.fieldname === question.fieldname)
          if (index != -1) {
            this.$set(this.surveyTemplate.fields, index, question)
          } else {
            this.this.surveyTemplate.fields.push(question)
          }
        }).catch((e) => {
          console.log('error saving news item to s3 ', e)
        }) */
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
        var element = this.surveyTemplate.fields[this.draggingRowIndex]
        this.surveyTemplate.fields.splice(this.draggingRowIndex, 1);
        this.surveyTemplate.fields.splice(payload.index, 0, element);
      }
    }
  }

</script>
