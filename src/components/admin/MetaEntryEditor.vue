<template>
  <div class="card">
    <b-loading v-model="isLoading" :is-full-page="false"></b-loading>
    <ValidationObserver ref="observer" v-slot="{passes, dirty}">
      <div style="position: sticky; top: 0; z-index: 45; background-color: white; padding: 12px;" class="card-header">
        <p class="card-header-title is-size-4">
          {{metaEntryFlat['file']}}: {{metaEntryFlat['name.' + $i18n.locale.substr(0, 2)]}}
        </p>
        <div class="buttons">
          <b-button @click="$parent.close()" style="width: 140px;"><font-awesome :icon="['fas', 'times']"/>&nbsp;{{$t('label.cancel')}}</b-button>
          <b-button @click="passes(acceptChanges)" :disabled="!dirty" style="width: 140px;"><font-awesome :icon="['fas', 'check']"/>&nbsp;{{$t('label.save')}}</b-button>
        </div>
      </div>
      <div class="card-content">
        <div class="content">
          <b-field>
            <template #label>
              <div class="columns">
                <div class="column is-narrow">
                  <i>{{$t('label.copymeta')}}</i>
                </div>
                <div class="column">
                  <b-field>
                    <b-checkbox v-model="enableCopyModel"></b-checkbox>
                  </b-field>
                </div>
              </div>
            </template>
            <div v-if="enableCopyModel" class="columns">
              <div class="column">
                <b-autocomplete autocomplete="nope" :data="filteredListOfModelCandidates" v-model="selectedMetaModel" field="name" open-on-focus clearable></b-autocomplete>
              </div>
              <div class="column is-2">
                <b-button @click="copyFromModel(selectedMetaModel)" :disabled="!modelFound">{{$t('label.tocopy')}}</b-button>
              </div>
            </div>
          </b-field>
          <hr>
          <ValidationProvider rules="required|min:4" v-slot="{ errors, valid }">
            <b-field :label="$t('label.titlespanish')" :type="{ 'is-danger': errors[0] }" :message="errors">
              <b-input v-model="metaEntryFlat['name.es']"></b-input>
            </b-field>
          </ValidationProvider>
          <ValidationProvider rules="required|min:4" v-slot="{ errors, valid }">
            <b-field :label="$t('label.titleenglish')" :type="{ 'is-danger': errors[0] }" :message="errors">
              <b-input v-model="metaEntryFlat['name.en']"></b-input>
            </b-field>
          </ValidationProvider>
          <div class="columns">
            <div class="column">
              <ValidationProvider rules="required|min:4" v-slot="{ errors, valid }">
                <b-field :label="$t('label.source')" :type="{ 'is-danger': errors[0] }" :message="errors">
                  <b-input v-model="metaEntryFlat['source']"></b-input>
                </b-field>
              </ValidationProvider>
            </div>
            <div class="column">
              <ValidationProvider rules="required" v-slot="{ errors, valid }">
                <b-field :label="$t('label.date')" :type="{ 'is-danger': errors[0] }" :message="errors">
                  <b-datepicker v-model="formDate" :locale="$i18n.locale" icon="calendar" trap-focus></b-datepicker>
                </b-field>
              </ValidationProvider>
            </div>
          </div>
          <ValidationProvider rules="required" v-slot="{ errors, valid }">
            <b-field :label="$t('label.tagsspanish')" :type="{ 'is-danger': errors[0] }" :message="errors">
              <b-taginput v-model="esTags" :placeholder="$t('label.addtag')"></b-taginput>
            </b-field>
          </ValidationProvider>
          <ValidationProvider rules="required" v-slot="{ errors, valid }">
            <b-field :label="$t('label.tagsenglish')" :type="{ 'is-danger': errors[0] }" :message="errors">
              <b-taginput v-model="enTags" :placeholder="$t('label.addtag')"></b-taginput>
            </b-field>
          </ValidationProvider>
          <ValidationProvider rules="required|min:4" v-slot="{ errors, valid }">
            <b-field :label="$t('label.descriptionspanish') + ' (markdown)'" :type="{ 'is-danger': errors[0] }" :message="errors">
              <b-input v-model="metaEntryFlat['description.es']" type="textarea"></b-input>
            </b-field>
          </ValidationProvider>
          <ValidationProvider rules="required|min:4" v-slot="{ errors, valid }">
            <b-field :label="$t('label.descriptionenglish') + ' (markdown)'" :type="{ 'is-danger': errors[0] }" :message="errors">
              <b-input v-model="metaEntryFlat['description.en']" type="textarea"></b-input>
            </b-field>
          </ValidationProvider>
          <br>
          <p class="is-size-5 has-text-weight-bold">{{$t('label.tiledisplay')}}</p>
          <ValidationProvider v-if="isPdf" :rules="'required|oneOf:' + listOfTileSourceFiles.join()" v-slot="{ errors, valid }">
            <b-field :label="$t('label.tilegensrc')" :type="{ 'is-danger': errors[0] }" :message="errors">
              <b-autocomplete autocomplete="nope" :data="filteredListOfTileSourceFiles" :placeholder="$t('label.filename')" v-model="metaEntryFlat['tileGenSrc']" open-on-focus :loading="isTileSourceLoading"></b-autocomplete>
            </b-field>
          </ValidationProvider>
          <div class="columns">
            <div class="column is-narrow">
              <ValidationProvider rules="required" v-slot="{ errors, valid }">
                <b-field :label="$t('label.tiletype')" :type="{ 'is-danger': errors[0] }" :message="errors">
                  <b-select v-model="metaEntryFlat['tileInfo.type']" value="vector">
                    <option value="raster">{{$t('label.raster')}}</option>
                    <option value="vector">{{$t('label.vector')}}</option>
                  </b-select>
                </b-field>
              </ValidationProvider>
            </div>
            <div v-if="!isShapefile" class="column">
              <ValidationProvider>
                <b-field class="field">
                  <template slot="label">&nbsp;</template>
                  <b-checkbox v-model="metaEntryFlat['tileInfo.skipAutoGen']">{{$t('label.skipautogen')}}</b-checkbox>
                </b-field>
              </ValidationProvider>
            </div>
          </div>
          <div v-if="metaEntryFlat['tileInfo.type'] === 'vector'">
            <ValidationProvider rules="required|min:2" v-slot="{ errors, valid }">
              <b-field :label="$t('label.mapdisplayattribute')" :type="{ 'is-danger': errors[0] }" :message="errors">
                <b-input v-model="metaEntryFlat['tileInfo.displayAttribute']"></b-input>
              </b-field>
            </ValidationProvider>
            <ValidationProvider rules="required" v-slot="{ errors, valid }">
              <b-field :label="$t('label.geometry')" :type="{ 'is-danger': errors[0] }" :message="errors">
                <b-select v-model="metaEntryFlat['tileInfo.style.type']">
                  <option value="fill">{{$t('label.polygon')}}</option>
                  <option value="line">{{$t('label.line')}}</option>
                  <option value="circle">{{$t('label.point')}}</option>
                </b-select>
              </b-field>
            </ValidationProvider>
            <div v-if="metaEntryFlat['tileInfo.style.type'] === 'line'">
              <div class="columns">
                <div class="column">
                  <ValidationProvider rules="required|colorhex" v-slot="{ errors, valid }">
                    <b-field :label="$t('label.linecolor')" :type="{ 'is-danger': errors[0] }" :message="errors">
                      <b-input v-model="metaEntryFlat['tileInfo.style.paint.line-color']"></b-input>
                    </b-field>
                  </ValidationProvider>
                </div>
                <div class="column">
                  <b-field>
                    <template slot="label">&nbsp;</template>
                    <div class="input-color-container" style="margin-left: 12px;">
                      <ValidationProvider>
                        <input v-model="metaEntryFlat['tileInfo.style.paint.line-color']" class="input-color" type="color" />
                      </ValidationProvider>
                    </div>
                  </b-field>
                </div>
              </div>
              <ValidationProvider rules="required|numeric" v-slot="{ errors, valid }">
                <b-field :label="$t('label.linewidth')" :type="{ 'is-danger': errors[0] }" :message="errors">
                  <b-input type="number" step="any" v-model.number="metaEntryFlat['tileInfo.style.paint.line-width']"></b-input>
                </b-field>
              </ValidationProvider>
            </div>
            <div v-if="metaEntryFlat['tileInfo.style.type'] === 'circle'">
              <div class="columns">
                <div class="column">
                  <ValidationProvider rules="required|colorhex" v-slot="{ errors, valid }">
                    <b-field :label="$t('label.circlecolor')" :type="{ 'is-danger': errors[0] }" :message="errors">
                      <b-input v-model="metaEntryFlat['tileInfo.style.paint.circle-color']"></b-input>
                    </b-field>
                  </ValidationProvider>
                </div>
                <div class="column">
                  <b-field>
                    <template slot="label">&nbsp;</template>
                    <div class="input-color-container" style="margin-left: 12px;">
                      <ValidationProvider>
                        <input v-model="metaEntryFlat['tileInfo.style.paint.circle-color']" class="input-color" type="color" />
                      </ValidationProvider>
                    </div>
                  </b-field>
                </div>
              </div>
              <ValidationProvider rules="required|numeric" v-slot="{ errors, valid }">
                <b-field :label="$t('label.circleopacity')" :type="{ 'is-danger': errors[0] }" :message="errors">
                  <b-input type="number" step="any" v-model.number="metaEntryFlat['tileInfo.style.paint.circle-opacity']"></b-input>
                </b-field>
              </ValidationProvider>
              <ValidationProvider rules="required|numeric" v-slot="{ errors, valid }">
                <b-field :label="$t('label.circleradius')" :type="{ 'is-danger': errors[0] }" :message="errors">
                  <b-input type="number" step="any" v-model.number="metaEntryFlat['tileInfo.style.paint.circle-radius']"></b-input>
                </b-field>
              </ValidationProvider>
              <ValidationProvider rules="required|numeric" v-slot="{ errors, valid }">
                <b-field :label="$t('label.circlestrokewidth')" :type="{ 'is-danger': errors[0] }" :message="errors">
                  <b-input type="number" step="any" v-model.number="metaEntryFlat['tileInfo.style.paint.circle-stroke-width']"></b-input>
                </b-field>
              </ValidationProvider>
              <div class="columns">
                <div class="column">
                  <ValidationProvider rules="required|colorhex" v-slot="{ errors, valid }">
                    <b-field :label="$t('label.circlestrokecolor')" :type="{ 'is-danger': errors[0] }" :message="errors">
                      <b-input v-model="metaEntryFlat['tileInfo.style.paint.circle-stroke-color']"></b-input>
                    </b-field>
                  </ValidationProvider>
                </div>
                <div class="column">
                  <b-field>
                    <template slot="label">&nbsp;</template>
                    <div class="input-color-container" style="margin-left: 12px;">
                      <ValidationProvider>
                        <input v-model="metaEntryFlat['tileInfo.style.paint.circle-stroke-color']" class="input-color" type="color" />
                      </ValidationProvider>
                    </div>
                  </b-field>
                </div>
              </div>
            </div>
            <div v-if="metaEntryFlat['tileInfo.style.type'] === 'fill'">
              <ValidationProvider rules="required" v-slot="{ errors, valid }">
                <b-field :label="$t('label.colormethod')" :type="{ 'is-danger': errors[0] }" :message="errors">
                  <b-select v-model="colorMethod">
                    <option value="simple">{{$t('label.simplemethod')}}</option>
                    <option value="ramp">{{$t('label.rampmethod')}}</option>
                    <option value="categorical">{{$t('label.categoricalmethod')}}</option>
                  </b-select>
                </b-field>
              </ValidationProvider>
              <div v-if="colorMethod === 'simple'">
                <div class="columns">
                  <div class="column">
                    <ValidationProvider rules="required|colorhex" v-slot="{ errors, valid }">
                      <b-field :label="$t('label.fillcolor')" :type="{ 'is-danger': errors[0] }" :message="errors">
                        <b-input v-model="metaEntryFlat['tileInfo.style.paint.fill-color']"></b-input>
                      </b-field>
                    </ValidationProvider>
                  </div>
                  <div class="column">
                    <b-field>
                      <template slot="label">&nbsp;</template>
                      <div class="input-color-container" style="margin-left: 12px;">
                        <ValidationProvider>
                          <input v-model="metaEntryFlat['tileInfo.style.paint.fill-color']" class="input-color" type="color" />
                        </ValidationProvider>
                      </div>
                    </b-field>
                  </div>
                </div>
              </div>
              <div v-if="colorMethod === 'ramp'">
                <ValidationProvider rules="required" v-slot="{ errors, valid }">
                  <b-field :label="$t('label.drivingattribute')" :type="{ 'is-danger': errors[0] }" :message="errors">
                    <b-input v-model="metaEntryFlat['tileInfo.style.paint.fill-color.2.1']"></b-input>
                  </b-field>
                </ValidationProvider>
                <b-field>
                  <div class="columns">
                    <div class="column">
                      <ValidationProvider rules="required|numeric" v-slot="{ errors, valid }">
                        <b-field :label="$t('label.lowvalue')" expanded :type="{ 'is-danger': errors[0] }" :message="errors">
                          <b-input type="number" step="any" v-model.number="metaEntryFlat['tileInfo.style.paint.fill-color.3']"></b-input>
                        </b-field>
                      </ValidationProvider>
                    </div>
                    <div class="column">
                      <ValidationProvider rules="required|colorhex" v-slot="{ errors, valid }">
                        <b-field :label="$t('label.color')" expanded :type="{ 'is-danger': errors[0] }" :message="errors">
                          <b-input maxlength="7" v-model="metaEntryFlat['tileInfo.style.paint.fill-color.4']"></b-input>
                        </b-field>
                      </ValidationProvider>
                    </div>
                    <div class="column">
                      <b-field>
                        <template slot="label">&nbsp;</template>
                        <div class="input-color-container" style="margin-left: 12px;">
                          <ValidationProvider>
                            <input v-model="metaEntryFlat['tileInfo.style.paint.fill-color.4']" class="input-color" type="color" />
                          </ValidationProvider>
                        </div>
                      </b-field>
                    </div>
                  </div>
                </b-field>
                <b-field>
                  <div class="columns">
                    <div class="column">
                      <ValidationProvider rules="required|numeric" v-slot="{ errors, valid }">
                        <b-field :label="$t('label.highvalue')" expanded :type="{ 'is-danger': errors[0] }" :message="errors">
                          <b-input type="number" step="any" v-model.number="metaEntryFlat['tileInfo.style.paint.fill-color.5']"></b-input>
                        </b-field>
                      </ValidationProvider>
                    </div>
                    <div class="column">
                      <ValidationProvider rules="required|colorhex" v-slot="{ errors, valid }">
                        <b-field :label="$t('label.color')" expanded :type="{ 'is-danger': errors[0] }" :message="errors">
                          <b-input maxlength="7" v-model="metaEntryFlat['tileInfo.style.paint.fill-color.6']"></b-input>
                        </b-field>
                      </ValidationProvider>
                    </div>
                    <div class="column">
                      <b-field>
                        <template slot="label">&nbsp;</template>
                        <div class="input-color-container" style="margin-left: 12px;">
                          <ValidationProvider>
                            <input v-model="metaEntryFlat['tileInfo.style.paint.fill-color.6']" class="input-color" type="color" />
                          </ValidationProvider>
                        </div>
                      </b-field>
                    </div>
                  </div>
                </b-field>
              </div>
              <div v-if="colorMethod === 'categorical'">
                <ValidationProvider rules="required" v-slot="{ errors, valid }">
                  <b-field :label="$t('label.drivingattribute')" :type="{ 'is-danger': errors[0] }" :message="errors">
                    <b-input v-model="metaEntryFlat['tileInfo.style.paint.fill-color.property']"></b-input>
                  </b-field>
                </ValidationProvider>
                <div class="columns">
                  <div class="column">
                    <ValidationProvider rules="required|colorhex" v-slot="{ errors, valid }">
                      <b-field :label="$t('label.defaultcolor')" :type="{ 'is-danger': errors[0] }" :message="errors">
                        <b-input v-model="metaEntryFlat['tileInfo.style.paint.fill-color.default']"></b-input>
                      </b-field>
                    </ValidationProvider>
                  </div>
                  <div class="column">
                    <b-field>
                      <template slot="label">&nbsp;</template>
                      <div class="input-color-container" style="margin-left: 12px;">
                        <ValidationProvider>
                          <input v-model="metaEntryFlat['tileInfo.style.paint.fill-color.default']" class="input-color" type="color" />
                        </ValidationProvider>
                      </div>
                    </b-field>
                  </div>
                </div>
                <label class="label">
                  {{$t('label.categoryassignment')}} <a @click="addTablePair('tileInfo.style.paint.fill-color.stops.')"><font-awesome size="lg" :icon="['far', 'plus-square']"/></a>
                </label>
                <br>
                <div v-for="(key, index) in Object.keys(metaEntryFlat).filter(k => k.includes('tileInfo.style.paint.fill-color.stops.'))">
                  <div v-if="(index%2 == 0)" class="columns">
                    <div class="column is-narrow"><a @click="removeTablePair(key,'tileInfo.style.paint.fill-color.stops.')"><font-awesome size="lg" :icon="['far', 'minus-square']"/></a></div>
                    <div class="column">
                      <ValidationProvider rules="required" v-slot="{ errors, valid }">
                        <b-field :label="$t('label.category')" label-position="on-border" expanded :type="{ 'is-danger': errors[0] }" :message="errors">
                          <b-input expanded v-model.number="metaEntryFlat[key]"></b-input>
                        </b-field>
                      </ValidationProvider>
                    </div>
                    <div class="column">
                      <div class="columns">
                        <div class="column">
                          <ValidationProvider rules="required|colorhex" v-slot="{ errors, valid }">
                            <b-field :label="$t('label.color')" label-position="on-border" expanded :type="{ 'is-danger': errors[0] }" :message="errors">
                              <b-input maxlength="7" expanded v-model="metaEntryFlat[key.slice(0, -1) + '1']"></b-input>
                            </b-field>
                          </ValidationProvider>
                        </div>
                        <div class="column">
                          <div class="input-color-container" style="margin-left: 12px;">
                            <ValidationProvider>
                              <input v-model="metaEntryFlat[key.slice(0, -1) + '1']" class="input-color" type="color" />
                            </ValidationProvider>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <ValidationProvider rules="required|numeric" v-slot="{ errors, valid }">
                <b-field :label="$t('label.fillopacity')" :type="{ 'is-danger': errors[0] }" :message="errors">
                  <b-input type="number" step="any" v-model.number="metaEntryFlat['tileInfo.style.paint.fill-opacity']"></b-input>
                </b-field>
              </ValidationProvider>
              <div class="columns">
                <div class="column">
                  <ValidationProvider rules="required|colorhex" v-slot="{ errors, valid }">
                    <b-field :label="$t('label.filloutlinecolor')" :type="{ 'is-danger': errors[0] }" :message="errors">
                      <b-input v-model="metaEntryFlat['tileInfo.style.paint.fill-outline-color']"></b-input>
                    </b-field>
                  </ValidationProvider>
                </div>
                <div class="column">
                  <b-field>
                    <template slot="label">&nbsp;</template>
                    <div class="input-color-container" style="margin-left: 12px;">
                      <ValidationProvider>
                        <input v-model="metaEntryFlat['tileInfo.style.paint.fill-outline-color']" class="input-color" type="color" />
                      </ValidationProvider>
                    </div>
                  </b-field>
                </div>
              </div>
            </div>
          </div>
          <div v-if="metaEntryFlat['tileInfo.type'] === 'raster' && !metaEntryFlat['tileInfo.skipAutoGen']">
            <b-notification type="is-warning" has-icon aria-close-label="Close notification" role="alert">
              {{$t('message.batchjobwarning')}}
            </b-notification>
            <div class="columns">
              <div class="column is-narrow">
                <label class="label">
                  {{$t('label.colortable')}} <a @click="addTablePair('tileInfo.colorTable.')"><font-awesome size="lg" :icon="['far', 'plus-square']"/></a>
                </label>
              </div>
              <div class="column is-narrow">
                <ValidationProvider>
                  <b-field class="field">
                    <b-checkbox v-model="metaEntryFlat['tileInfo.gradient']">{{$t('label.gradient')}}</b-checkbox>
                  </b-field>
                </ValidationProvider>
              </div>
              <div class="column">
                <ValidationProvider>
                  <b-field class="field">
                    <b-checkbox v-model="metaEntryFlat['tileInfo.hideNoData']">{{$t('label.hidenodata')}}</b-checkbox>
                  </b-field>
                </ValidationProvider>
              </div>
            </div>
            <div v-for="(key, index) in Object.keys(metaEntryFlat).filter(k => k.includes('tileInfo.colorTable.'))">
              <div v-if="(index%2 == 0)" class="columns">
                <div class="column is-narrow"><a @click="removeTablePair(key,'tileInfo.colorTable.', index/2)"><font-awesome size="lg" :icon="['far', 'minus-square']"/></a></div>
                <div class="column is-2">
                  <ValidationProvider rules="required|numeric" v-slot="{ errors, valid }">
                    <b-field :label="$t('label.value')" label-position="on-border" expanded :type="{ 'is-danger': errors[0] }" :message="errors">
                      <b-input type="number" expanded v-model.number="metaEntryFlat[key]"></b-input>
                    </b-field>
                  </ValidationProvider>
                </div>
                <div class="column">
                  <ValidationProvider v-slot="{ errors, valid }">
                    <b-field :label="$t('label.label')" label-position="on-border" expanded :type="{ 'is-danger': errors[0] }" :message="errors">
                      <b-input v-model="metaEntryFlat['tileLabels.' + index/2]"></b-input>
                    </b-field>
                  </ValidationProvider>
                </div>
                <div class="column is-2">
                  <ValidationProvider rules="required|colorhexa" v-slot="{ errors, valid }">
                    <b-field :label="$t('label.color')" label-position="on-border" expanded :type="{ 'is-danger': errors[0] }" :message="errors">
                      <b-input maxlength="9" expanded v-model="metaEntryFlat[key.slice(0, -1) + '1']"></b-input>
                    </b-field>
                  </ValidationProvider>
                </div>
                <div class="column">
                  <div class="columns">
                    <div class="column is-narrow input-color-container" style="margin-left: 12px;">
                      <ValidationProvider>
                        <input @input="inputColor($event, key.slice(0, -1) + '1')" :value="narrowColorValue(metaEntryFlat[key.slice(0, -1) + '1'])" class="input-color" type="color" id="html5colorpicker" />
                      </ValidationProvider>
                    </div>
                    <div class="column">
                      <ValidationProvider>
                        <b-tooltip always type="is-light" :label="getOpacity(metaEntryFlat[key.slice(0, -1) + '1']) + '%'" position="is-right">
                          <input lazy type="range" min="0" max="100" expanded @input="inputOpacity($event, key.slice(0, -1) + '1')" :value="getOpacity(metaEntryFlat[key.slice(0, -1) + '1'])"></input>
                        </b-tooltip>
                      </ValidationProvider>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
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

  .input-color-container {
    margin: auto;
    position: relative;
    overflow: hidden;
    width: 40px;
    height: 30px;
    border: 1px solid #bdbdbd;
    border-radius: 4px;
  }

  .input-color {
    position: absolute;
    right: -8px;
    top: -8px;
    width: 60px;
    height: 56px;
    border: none;
    cursor: pointer;
  }

  ::v-deep .b-tooltip .tooltip-content {
    box-shadow: none;
  }

</style>

<script>
import { ValidationObserver, ValidationProvider } from 'vee-validate'
import * as validation from '~/utils/validation'
import { getMetaFromRepo, saveMetaFromRepo, getListOfStoredFiles } from '~/utils/data'
import {dataConfig} from '~/utils/config'

let flatten = require('flat')
let unflatten = require('flat').unflatten

export default {
  name: 'MetaEntryEditor',
  props: {
    metaEntry: { type: Object, required: true },
    listOfModelCandidates: {type: Array, required: true }
  },
  data() {
    return {
      metaEntryFlat: flatten(this.metaEntry),
      savedTileInfo: null,
      formDate: null,
      isLoading: false,
      isTileSourceLoading: false,
      listOfTileSourceFiles: [],
      selectedMetaModel: '',
      enableCopyModel: false
    }
  },
  components: {
    ValidationObserver,
    ValidationProvider
  },
  beforeCreate() {
    validation.localize(this.$i18n.locale.toString().substr(0,2))
  },
  async created() {
    await this.populateForm(this.metaEntry.file)
    if (this.isPdf) {
      this.isTileSourceLoading = true
      getListOfStoredFiles(false).then((result) => {
        this.listOfTileSourceFiles = result.map(f => f.name)
        this.isTileSourceLoading = false
      })
    }
  },
  methods: {
    async populateForm(file) {
      this.isLoading = true
      let result = await getMetaFromRepo(sessionStorage.githubtoken, file)
      this.metaEntryFlat = flatten(result)
      if (result.date) this.formDate = new Date(result.date)
      if (result.tileInfo) {
        this.savedTileInfo = JSON.stringify(result.tileInfo)
      }
      if (!this.metaEntryFlat.format) this.metaEntryFlat.format = this.metaEntry.format
      this.isLoading = false
    },
    acceptChanges() {
      //this.metaEntryFlat['format'] = (this.isShapefile) ? 'shapefile' : 'geotiff'
      if (this.metaEntryFlat['tileInfo.type'] === 'vector') {
        this.metaEntryFlat['tileInfo.style.id'] = this.metaEntryFlat['tiles']
        this.metaEntryFlat['tileInfo.style.source'] = this.metaEntryFlat['tiles']
        this.metaEntryFlat['tileInfo.style.source-layer'] = this.metaEntryFlat['tiles']
      }
      this.metaEntryFlat.date = this.formDate.toISOString()

      let tileSourceFile = this.isPdf ? this.metaEntryFlat.tileGenSrc : this.metaEntryFlat.file
      this.metaEntryFlat.tiles = (tileSourceFile.replace(/\.[^/.]+$/, '')).toLowerCase()

      // Cleanup tileInfo paint elements
      Object.keys(this.metaEntryFlat).forEach(key => {
        if (key.startsWith('tileInfo.style.paint.')) {
          if (!key.startsWith('tileInfo.style.paint.' + this.metaEntryFlat['tileInfo.style.type'])) {
            delete this.metaEntryFlat[key]
          }
        }
      })

      let updatedMetaEntry = unflatten(this.metaEntryFlat)

      if (updatedMetaEntry.tileInfo === 'vector') {
        delete updatedMetaEntry.tileInfo.colorTable
      } else {
        delete updatedMetaEntry.tileInfo.style
        delete updatedMetaEntry.tileInfo.displayAttribute
      }
      let metaEntry = unflatten(this.metaEntryFlat)
      let job = null
      if (updatedMetaEntry.tileInfo && updatedMetaEntry.tileInfo.type === 'raster' && (!updatedMetaEntry.tileInfo.skipAutoGen) && (JSON.stringify(updatedMetaEntry.tileInfo) !== this.savedTileInfo)) {
        if (updatedMetaEntry.tileInfo.colorTable && updatedMetaEntry.tileInfo.hideNoData) {
          updatedMetaEntry.tileInfo.colorTable.push(['nv', '#ffffff00'])
        }
        job = {tileInfo: updatedMetaEntry.tileInfo}
        if (updatedMetaEntry.tileGenSrc) {
          job.file = updatedMetaEntry.tileGenSrc
          job.directory = dataConfig.privateFilesDirectory
        } else {
          job.file = updatedMetaEntry.file
          job.directory = dataConfig.filesDirectory
        }
      }

      saveMetaFromRepo(sessionStorage.githubtoken, metaEntry).then(() => {
        console.log('saved meta entry')
        this.$store.commit('setPublishIndicator', true)
        this.$eventBus.$emit('acceptmetachanges', {metaEntry: metaEntry, job: job})
        this.$parent.close()
      })
    },
    unflattenTags(lang) {
      let kwds = []
      let i = 0
      while (this.metaEntryFlat['keywords.' + lang + '.' + i]) {
        kwds.push(this.metaEntryFlat['keywords.' + lang + '.' + i++])
      }
      return kwds
    },
    reflattenTags(lang, val) {
      let obj = {}
      obj['keywords.' + lang] = val
      let i = 0
      while (this.metaEntryFlat['keywords.' + lang + '.' + i]) {
        delete (this.metaEntryFlat['keywords.' + lang + '.' + i++])
      }
      let f = flatten(obj)
      Object.keys(f).forEach((key) => {
        this.$set(this.metaEntryFlat, key, f[key])
      })
    },
    addTablePair(tablePrefix) {
      let nCats = Object.keys(this.metaEntryFlat).filter(k => k.includes(tablePrefix)).length/2
      this.$set(this.metaEntryFlat, tablePrefix + nCats + '.0', '')
      this.$set(this.metaEntryFlat, tablePrefix + nCats + '.1', '#00000000')
    },
    removeTablePair(cKey, tablePrefix, idx) {
      // First, delete item
      this.$delete(this.metaEntryFlat, cKey)
      this.$delete(this.metaEntryFlat, cKey.slice(0, -1) + '1')

      // Then compact the list
      let keys = Object.keys(this.metaEntryFlat).filter(k => k.includes(tablePrefix))
      let i = 0
      keys.forEach((key) => {
        let stop = Math.floor((i++)/2)
        let prefix = key.slice(0, -1)
        let sufix = key.substr(key.length -1)
        if (tablePrefix + stop + '.' != prefix) {
          this.$set(this.metaEntryFlat, tablePrefix + stop + '.' + sufix, this.metaEntryFlat[prefix + sufix])
          this.$delete(this.metaEntryFlat, prefix + sufix)
        }
      })

      // Finally, remove associated tileLabels entry
      if (idx != undefined) {
        this.$delete(this.metaEntryFlat, 'tileLabels.' + idx)

        // And compact the list
        keys = Object.keys(this.metaEntryFlat).filter(k => k.includes('tileLabels'))
        keys.forEach((key, i) => {
          let sufix = key.split('.').pop()
          if (i != sufix) {
            this.$set(this.metaEntryFlat, 'tileLabels.' + i, this.metaEntryFlat[key])
            this.$delete(this.metaEntryFlat, key)
          }
        })
      }
    },
    async copyFromModel(model) {
      let savedFileName = this.metaEntryFlat.file
      let savedTiles = this.metaEntryFlat.tiles
      await this.populateForm(model)
      this.metaEntryFlat.file = savedFileName
      this.metaEntryFlat.tiles = savedTiles
      if (this.metaEntryFlat.tileGenSrc) delete this.metaEntryFlat.tileGenSrc
      this.metaEntryFlat['name.es'] += ` (${this.$t('label.copy', 'es-ve').toUpperCase()})`
      this.metaEntryFlat['name.en'] += ` (${this.$t('label.copy', 'en-us').toUpperCase()})`
      this.savedTileInfo = null
      this.$nextTick(() => {
        this.$refs.observer.reset()
      })
    },
    inputColor(e, item) {
      if (this.metaEntryFlat[item].length === 9)
        this.metaEntryFlat[item] = e.target.value + this.metaEntryFlat[item].substr(7,2)
      else
        this.metaEntryFlat[item] = e.target.value + this.metaEntryFlat[item].substr(4,2)
    },
    getOpacity(v) {
      if (v.length === 9) return Math.round(parseInt(v.slice(7, 9), 16) * 100/255)
      if (v.length === 5) return Math.round(parseInt(v.slice(4, 5), 16) * 100/255)
    },
    inputOpacity(event, item) {
      let o = event.target.value
      let v = this.metaEntryFlat[item]
      let oh = Math.round(o*255/100).toString(16)
      if (v.length === 9) {
        this.metaEntryFlat[item] = v.substr(0,7) + oh.padStart(2, '0')
        return
      }
      if (v.length === 5 && oh.length === 1) {
        this.metaEntryFlat[item] = v.substr(0,4) + oh
        return
      }
      if (v.length === 5 && oh.length === 2) {
        this.metaEntryFlat[item] = '#0' + v.substr(1,1) + '0' + v.substr(2,1) + '0' + v.substr(3,1) + oh
      }
    },
    narrowColorValue(v) {
      if (v.length === 9)
        return v.substr(0,7)
      else
        return '#0' + v.substr(1,1) + '0' + v.substr(2,1) + '0' + v.substr(3,1)
    }
  },
  computed: {
    colorMethod: {
      get() {
        if (this.metaEntryFlat['tileInfo.style.paint.fill-color.0']) return 'ramp'
        if (this.metaEntryFlat['tileInfo.style.paint.fill-color.type']) return 'categorical'
        return 'simple'
      },
      set(val) {
        Object.keys(this.metaEntryFlat).filter(k => k.includes('tileInfo.style.paint.fill-color')).forEach(match => {
          this.$delete(this.metaEntryFlat, match)
        })
        if (val === 'ramp') {
          this.$set(this.metaEntryFlat, 'tileInfo.style.paint.fill-color.0', 'interpolate')
          this.$set(this.metaEntryFlat, 'tileInfo.style.paint.fill-color.1.0', 'linear')
          this.$set(this.metaEntryFlat, 'tileInfo.style.paint.fill-color.2.0', 'get')
          return
        }
        if (val === 'categorical') {
          this.$set(this.metaEntryFlat, 'tileInfo.style.paint.fill-color.type', 'categorical')
          return
        }
        this.$set(this.metaEntryFlat, 'tileInfo.style.paint.fill-color', '')
      }
    },
    esTags: {
      get() {
        return this.unflattenTags('es')
      },
      set(val) {
        this.reflattenTags('es', val)
      }
    },
    enTags: {
      get() {
        return this.unflattenTags('en')
      },
      set(val) {
        this.reflattenTags('en', val)
      }
    },
    isShapefile() {
      return this.metaEntryFlat['format'] === 'shapefile'
    },
    isPdf() {
      return this.metaEntryFlat['format'] === 'pdf'
    },
    filteredListOfModelCandidates() {
      return this.listOfModelCandidates.filter(
        item =>
          (item.name !== this.metaEntryFlat.file) &&
          (item.format === this.metaEntryFlat.format) &&
          (item.name.toLowerCase().includes(this.selectedMetaModel.trim().toLowerCase()))
        )
    },
    modelFound() {
      return this.listOfModelCandidates.find(item => item.name === this.selectedMetaModel)
    },
    filteredListOfTileSourceFiles() {
      return this.listOfTileSourceFiles.filter(item => !this.metaEntryFlat.tileGenSrc || item.toLowerCase().includes(this.metaEntryFlat.tileGenSrc.trim().toLowerCase()))
    }
  }
}

</script>
