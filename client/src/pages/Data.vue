Flavour<template>
  <q-page class="flex flex-center">
    <q-card class="data-card">
      <q-form
        @submit="onUpdate"
        class="q-pa-md"
      >
        <q-card-section>
          <div class="row items-center no-wrap">
            <div class="col-6">
              <div class="text-h4">Data Entry</div>
            </div>

            <div class="col-3" id="date-input">
              <q-input
                dense
                v-model="date"
                mask="##-##-####"
              >
                <template v-slot:append>
                  <q-icon name="event" class="cursor-pointer">
                    <q-popup-proxy
                      ref="qDateProxy"
                      cover
                      transition-show="scale"
                      transition-hide="scale"
                    >
                      <q-date v-model="date" mask="DD-MM-YYYY">
                        <div class="row items-center justify-end">
                          <q-btn v-close-popup label="Close" color="primary" flat />
                        </div>
                      </q-date>
                    </q-popup-proxy>
                  </q-icon>
                </template>
              </q-input>
            </div>

            <div class="col-3">
              <q-select
                dense
                v-model="productionType"
                :options="productionTypeOptions"
                :disable="loading"
              />
            </div>
          </div>

        </q-card-section>

        <q-separator />

        <q-card-section class="bg-grey-2">
          <q-tab-panels v-model="productionType" class="bg-grey-2">
            <q-tab-panel name="Packing Day">
              <q-card
                v-for="(item, index) in packingFlavourEntries"
                v-bind:key="index"
                class="row items-center full-width flavour-item"
              >
                <div class="row full-width items-center no-wrap">
                  <div class="col pad-right">
                    <q-select
                      v-if="!loading"
                      label="Batch Flavour"
                      required
                      v-model="packingFlavourEntries[index].flavour"
                      :rules="[ val => flavourOptions.includes(val) || 'Please select flavour!' ]"
                      :options="flavourOptions"
                      :color="flavourColors[packingFlavourEntries[index].flavour]"
                    />
                  </div>

                  <div class="col-auto pad-right">
                    <q-input
                      v-if="!loading"
                      label="Use by Date"
                      required
                      v-model="packingFlavourEntries[index].useByDate"
                      mask="##-##-####"
                      class="q-field--with-bottom"
                    >
                      <template v-slot:append>
                        <q-icon name="event" class="cursor-pointer">
                          <q-popup-proxy
                            ref="qDateProxy"
                            cover
                            transition-show="scale"
                            transition-hide="scale"
                          >
                            <q-date
                              v-model="packingFlavourEntries[index].useByDate"
                              mask="DD-MM-YYYY"
                            >
                              <div class="row items-center justify-end">
                                <q-btn v-close-popup label="Close" color="primary" flat />
                              </div>
                            </q-date>
                          </q-popup-proxy>
                        </q-icon>
                      </template>
                    </q-input>
                  </div>

                  <div class="col-auto">
                    <q-btn
                      v-if="!loading"
                      flat
                      round
                      icon="delete"
                      @click="deletePackingFlavour(index)"
                    />
                  </div>
                </div>

                <div class="col-3 pad-right">
                  <q-input
                    v-if="!loading"
                    label="Slab Batch #"
                    required
                    v-model.number="packingFlavourEntries[index].batchNumber"
                    :rules="[ val => val >= 1 || 'Batch must be positive!' ]"
                    type="number"
                    :color="flavourColors[packingFlavourEntries[index].flavour]"
                  />
                </div>
                <div class="col-3 pad-right">
                  <q-input
                    v-if="!loading"
                    label="Number of Slabs"
                    required
                    v-model.number="packingFlavourEntries[index].slabAmount"
                    :rules="[ val => val >= 1 || 'Amount must be positive!' ]"
                    type="number"
                    :color="flavourColors[packingFlavourEntries[index].flavour]"
                  />
                </div>
                <div class="col-3 pad-right">
                  <q-input
                    v-if="!loading"
                    label="Number of Boxes"
                    required
                    v-model.number="packingFlavourEntries[index].boxAmount"
                    :rules="[ val => val >= 1 || 'Amount must be positive!' ]"
                    type="number"
                    :color="flavourColors[packingFlavourEntries[index].flavour]"
                  />
                </div>
                <div class="col-3">
                  <q-input
                    v-if="!loading"
                    label="Number of Samples"
                    required
                    v-model.number="packingFlavourEntries[index].sampleAmount"
                    :rules="[ val => val >= 1 || 'Amount must be positive!' ]"
                    type="number"
                    :color="flavourColors[packingFlavourEntries[index].flavour]"
                  />
                </div>

                <div class="col-12">
                  <q-input
                    v-if="!loading"
                    label="Notes"
                    v-model="packingFlavourEntries[index].notes"
                    type="text"
                    autogrow
                    :color="flavourColors[packingFlavourEntries[index].flavour]"
                  />
                </div>
              </q-card>

              <q-btn
                v-if="!loading"
                icon="add"
                id="add-flavour-btn"
                label="Add Flavour"
                class="full-width"
                color="primary"
                @click="addPackingFlavour"
              />
            </q-tab-panel>

            <q-tab-panel name="Cutting Day">
              <q-card
                v-for="(item, index) in cuttingFlavourEntries"
                v-bind:key="index"
                class="row items-center full-width flavour-item"
              >
                <div class="row full-width items-center no-wrap">
                  <div class="col pad-right">
                    <q-select
                      v-if="!loading"
                      label="Batch Flavour"
                      required
                      v-model="cuttingFlavourEntries[index].flavour"
                      :rules="[ val => flavourOptions.includes(val) || 'Please select flavour!' ]"
                      :options="flavourOptions"
                      :color="flavourColors[cuttingFlavourEntries[index].flavour]"
                    />
                  </div>

                  <div class="col-auto">
                    <q-btn
                      v-if="!loading"
                      flat
                      round
                      icon="delete"
                      @click="deleteFlavour(index)"
                    />
                  </div>
                </div>

                <div class="col-3 pad-right">
                  <q-input
                    v-if="!loading"
                    label="Slab Batch"
                    required
                    v-model.number="cuttingFlavourEntries[index].slabBatch"
                    :rules="[ val => val >= 1 || 'Batch must be positive!' ]"
                    type="number"
                    :color="flavourColors[cuttingFlavourEntries[index].flavour]"
                  />
                </div>
                <div class="col-3 pad-right">
                  <q-input
                    v-if="!loading"
                    label="Base Batch"
                    required
                    v-model.number="cuttingFlavourEntries[index].baseBatch"
                    :rules="[ val => val >= 1 || 'Batch must be positive!' ]"
                    type="number"
                    :color="flavourColors[cuttingFlavourEntries[index].flavour]"
                  />
                </div>
                <div class="col-3 pad-right">
                  <q-input
                    v-if="!loading"
                    label="Slab Amount"
                    required
                    v-model.number="cuttingFlavourEntries[index].slabAmount"
                    :rules="[ val => val >= 1 || 'Amount must be positive!' ]"
                    type="number"
                    :color="flavourColors[cuttingFlavourEntries[index].flavour]"
                  />
                </div>
                <div class="col-3">
                  <q-input
                    v-if="!loading"
                    label="Box Amount"
                    required
                    v-model.number="cuttingFlavourEntries[index].boxAmount"
                    :rules="[ val => val >= 1 || 'Amount must be positive!' ]"
                    type="number"
                    :color="flavourColors[cuttingFlavourEntries[index].flavour]"
                  />
                </div>
                <div class="col-12">
                  <q-input
                    v-if="!loading"
                    label="Notes"
                    v-model="cuttingFlavourEntries[index].notes"
                    type="text"
                    autogrow
                    :color="flavourColors[cuttingFlavourEntries[index].flavour]"
                  />
                </div>
              </q-card>

              <q-btn
                v-if="!loading"
                icon="add"
                id="add-flavour-btn"
                label="Add Flavour"
                class="full-width"
                color="primary"
                @click="addCuttingFlavour"
              />
            </q-tab-panel>

            <q-tab-panel name="Base Day">
              <q-card
                v-for="(item, index) in baseFlavourEntries"
                v-bind:key="index"
                class="row items-center full-width flavour-item"
              >
                <div class="row full-width items-center no-wrap">
                  <div class="col pad-right">
                    <q-select
                      v-if="!loading"
                      label="Batch Flavour"
                      required
                      v-model="baseFlavourEntries[index].flavour"
                      :rules="[ val => flavourOptions.includes(val) || 'Please select flavour!' ]"
                      :options="baseFlavourOptions"
                      :color="flavourColors[baseFlavourEntries[index].flavour]"
                    />
                  </div>

                  <div class="col-auto">
                    <q-btn
                      v-if="!loading"
                      flat
                      round
                      icon="delete"
                      @click="deleteBaseFlavour(index)"
                    />
                  </div>
                </div>

                <div class="col-3 pad-right">
                  <q-input
                    v-if="!loading"
                    label="Base Batch"
                    required
                    v-model.number="baseFlavourEntries[index].batchNumber"
                    :rules="[ val => val >= 1 || 'Batch must be positive!' ]"
                    type="number"
                    :color="flavourColors[baseFlavourEntries[index].flavour]"
                  />
                </div>
                <div class="col-3 pad-right">
                  <q-input
                    v-if="!loading"
                    label="Number of Blender Batches"
                    required
                    v-model.number="baseFlavourEntries[index].blenderAmount"
                    :rules="[ val => val >= 1 || 'Amount must be positive!' ]"
                    type="number"
                    :color="flavourColors[baseFlavourEntries[index].flavour]"
                  />
                </div>
                <div class="col-3 pad-right">
                  <q-input
                    v-if="!loading"
                    label="Number of Large Bases"
                    required
                    v-model.number="baseFlavourEntries[index].largeAmount"
                    :rules="[ val => val >= 0 || 'Amount must not be negative!' ]"
                    type="number"
                    :color="flavourColors[baseFlavourEntries[index].flavour]"
                  />
                </div>
                <div class="col-3">
                  <q-input
                    v-if="!loading"
                    label="Number of Small Bases"
                    required
                    v-model.number="baseFlavourEntries[index].smallAmount"
                    :rules="[ val => val >= 0 || 'Amount must not be negative!' ]"
                    type="number"
                    :color="flavourColors[baseFlavourEntries[index].flavour]"
                  />
                </div>
                <div class="col-4 pad-right">
                  <q-input
                    v-if="!loading"
                    label="Number of Small Cake Bases"
                    required
                    v-model.number="baseFlavourEntries[index].smallCakeAmount"
                    :rules="[ val => val >= 0 || 'Amount must not be negative!' ]"
                    type="number"
                    :color="flavourColors[baseFlavourEntries[index].flavour]"
                  />
                </div>
                <div class="col-4 pad-right">
                  <q-input
                    v-if="!loading"
                    label="Number of Medium Cake Bases"
                    required
                    v-model.number="baseFlavourEntries[index].mediumCakeAmount"
                    :rules="[ val => val >= 0 || 'Amount must not be negative!' ]"
                    type="number"
                    :color="flavourColors[baseFlavourEntries[index].flavour]"
                  />
                </div>
                <div class="col-4">
                  <q-input
                    v-if="!loading"
                    label="Number of Large Cake Bases"
                    required
                    v-model.number="baseFlavourEntries[index].largeCakeAmount"
                    :rules="[ val => val >= 0 || 'Amount must not be negative!' ]"
                    type="number"
                    :color="flavourColors[baseFlavourEntries[index].flavour]"
                  />
                </div>
                <div class="col-12">
                  <q-input
                    v-if="!loading"
                    label="Notes"
                    v-model="baseFlavourEntries[index].notes"
                    type="text"
                    autogrow
                    :color="flavourColors[baseFlavourEntries[index].flavour]"
                  />
                </div>
              </q-card>

              <q-btn
                v-if="!loading"
                icon="add"
                id="add-flavour-btn"
                label="Add Flavour"
                class="full-width"
                color="primary"
                @click="addBaseFlavour"
              />
            </q-tab-panel>

            <q-tab-panel name="Ice Cream Day">
              <q-card
                v-for="(item, index) in icecreamFlavourEntries"
                v-bind:key="index"
                class="row items-center full-width flavour-item"
              >
                <div class="row full-width items-center no-wrap">
                  <div class="col pad-right">
                    <q-select
                      v-if="!loading"
                      label="Batch Flavour"
                      required
                      v-model="icecreamFlavourEntries[index].flavour"
                      :rules="[ val => flavourOptions.includes(val) || 'Please select flavour!' ]"
                      :options="flavourOptions"
                      :color="flavourColors[icecreamFlavourEntries[index].flavour]"
                    />
                  </div>

                  <div class="col-auto">
                    <q-btn
                      v-if="!loading"
                      flat
                      round
                      icon="delete"
                      @click="deleteIcecreamFlavour(index)"
                    />
                  </div>
                </div>

                <div class="col-3 pad-right">
                  <q-input
                    v-if="!loading"
                    label="Batch Number"
                    required
                    v-model.number="icecreamFlavourEntries[index].batchNumber"
                    :rules="[ val => val >= 1 || 'Batch must be positive!' ]"
                    type="number"
                    :color="flavourColors[icecreamFlavourEntries[index].flavour]"
                  />
                </div>
                <div class="col-3 pad-right">
                  <q-input
                    v-if="!loading"
                    label="Number of Jugs"
                    required
                    v-model.number="icecreamFlavourEntries[index].jugsAmount"
                    :rules="[ val => val >= 0 || 'Amount must not be negative!' ]"
                    type="number"
                    :color="flavourColors[icecreamFlavourEntries[index].flavour]"
                  />
                </div>
                <div class="col-3 pad-right">
                  <q-input
                    v-if="!loading"
                    label="Number of Trays"
                    required
                    v-model.number="icecreamFlavourEntries[index].traysAmount"
                    :rules="[ val => val >= 0 || 'Amount must not be negative!' ]"
                    type="number"
                    :color="flavourColors[icecreamFlavourEntries[index].flavour]"
                  />
                </div>
                <div class="col-3">
                  <q-input
                    v-if="!loading"
                    label="Number of Unsaleable Trays"
                    required
                    v-model.number="icecreamFlavourEntries[index].unsaleableTraysAmount"
                    :rules="[ val => val >= 0 || 'Amount must not be negative!' ]"
                    type="number"
                    :color="flavourColors[icecreamFlavourEntries[index].flavour]"
                  />
                </div>
                <div class="col-12">
                  <q-input
                    v-if="!loading"
                    label="Notes"
                    v-model="icecreamFlavourEntries[index].notes"
                    type="text"
                    autogrow
                    :color="flavourColors[icecreamFlavourEntries[index].flavour]"
                  />
                </div>
              </q-card>

              <q-btn
                v-if="!loading"
                icon="add"
                id="add-flavour-btn"
                label="Add Flavour"
                class="full-width"
                color="primary"
                @click="addIcecreamFlavour"
              />
            </q-tab-panel>

            <q-tab-panel name="Select Production Type">
              <div
                v-if="!loading"
                class="full-width text-center text-h6 text-grey"
              >
                Please Select Production Type
              </div>

              <div v-if="loading">
                <q-card
                  v-for="index in 3"
                  v-bind:key="index"
                  class="row items-center full-width flavour-item"
                >
                  <div class="row full-width items-center no-wrap">
                    <div class="col pad-right">
                      <q-skeleton type="QInput" />
                    </div>

                    <div class="col-auto">
                      <q-skeleton type="QAvatar" />
                    </div>
                  </div>

                  <div class="col-3 pad-right">
                    <q-skeleton type="QInput" />
                  </div>
                  <div class="col-3 pad-right">
                    <q-skeleton type="QInput" />
                  </div>
                  <div class="col-3 pad-right">
                    <q-skeleton type="QInput" />
                  </div>
                  <div class="col-3">
                    <q-skeleton type="QInput" />
                  </div>

                  <div class="col-12">
                    <q-skeleton type="QInput" />
                  </div>
                </q-card>
              </div>

              <q-skeleton v-if="loading" type="QBtn" class="full-width" />
            </q-tab-panel>
          </q-tab-panels>
        </q-card-section>

        <q-separator />

        <q-card-section
          class="bg-grey-2"
          v-if="!loading"
        >
          <q-card
            v-for="(item, index) in staffData"
            v-bind:key="index"
            class="row items-center full-width staff-item"
          >
            <div class="row full-width items-center no-wrap">
              <div class="col pad-right">
                <q-select
                  label="Staff Member"
                  required
                  v-model="staffData[index].name"
                  :rules="[ val => staffOptions.includes(val) || 'Please select staff member!' ]"
                  :options="staffOptions"
                />
              </div>

              <div class="col-3 pad-right">
                <q-input
                  label="Start Time"
                  v-model="staffData[index].startTime"
                  required
                  mask="##:##"
                  class="q-field--with-bottom"
                >
                  <template v-slot:append>
                    <q-icon name="access_time" class="cursor-pointer">
                      <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                        <q-time v-model="staffData[index].startTime">
                          <div class="row items-center justify-end">
                            <q-btn v-close-popup label="Close" color="primary" flat />
                          </div>
                        </q-time>
                      </q-popup-proxy>
                    </q-icon>
                  </template>
                </q-input>
              </div>

              <div class="col-3 pad-right">
                <q-input
                  label="End Time"
                  v-model="staffData[index].endTime"
                  required
                  mask="##:##"
                  class="q-field--with-bottom"
                >
                  <template v-slot:append>
                    <q-icon name="access_time" class="cursor-pointer">
                      <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                        <q-time v-model="staffData[index].endTime">
                          <div class="row items-center justify-end">
                            <q-btn v-close-popup label="Close" color="primary" flat />
                          </div>
                        </q-time>
                      </q-popup-proxy>
                    </q-icon>
                  </template>
                </q-input>
              </div>

              <div class="col-3 pad-right">
                <q-input
                  label="Break Length (Minutes)"
                  v-model="staffData[index].breakLength"
                  required
                  type="number"
                  class="q-field--with-bottom"
                >
                </q-input>
              </div>

              <div class="col-auto">
                <q-btn
                  flat
                  round
                  icon="delete"
                  @click="deleteStaffMember(index)"
                />
              </div>
            </div>
          </q-card>

          <q-btn
            v-if="!loading"
            icon="add"
            id="add-staff-btn"
            label="Add Staff Member"
            class="full-width"
            color="primary"
            @click="addStaffMember"
          />
        </q-card-section>

        <q-card-section
          class="bg-grey-2"
          v-if="loading"
        >
          <q-card
            class="row items-center full-width staff-item"
          >
            <div class="row full-width items-center no-wrap">
              <div class="col pad-right">
                <q-skeleton type="QInput" />
              </div>

              <div class="col-3 pad-right">
                <q-skeleton type="QInput" />
              </div>

              <div class="col-3 pad-right">
                <q-skeleton type="QInput" />
              </div>

              <div class="col-auto">
                <q-skeleton type="QAvatar" />
              </div>

              <div class="col-auto">
                <q-skeleton type="QAvatar" />
              </div>
            </div>
          </q-card>

          <q-skeleton v-if="loading" type="QBtn" class="full-width" />
        </q-card-section>

        <q-card-section id="save-btn-container">
          <q-btn label="Save" class="full-width" :disable="loading" type="submit" color="primary"/>
        </q-card-section>
      </q-form>
    </q-card>
  </q-page>
</template>

<style media="screen" lang="scss" scoped>
  .data-card {
    width: 80vw;
    min-height: calc(100vh - 50px);
  }

  #date-input {
    padding-right: 1vw;
  }

  .q-skeleton {
    margin: 5px;
  }

  .q-tab-panel {
    padding: 0;
  }

  .flavour-item, .staff-item {
    padding: 1vw;
    margin-bottom: 16px;
  }

  .staff-item {
    .q-field {
      padding-bottom: 0;
    }
  }

  .pad-right {
    padding-right: 1vw;
  }

  #save-btn-container {
    margin-top: 16px;
    padding: 0;
  }

  @media only screen and (max-width: 600px) {
    .data-card {
      width: 100%;
    }
  }
</style>

<script>
import { defineComponent } from 'vue';
import axios from 'axios';

const AUTOUPDATEINTERVAL = 30;
const PATHTOAPI = 'http://localhost:8888/api'; // TODO: Convert to ENV system

export default defineComponent({
  name: 'PageData',
  data() {
    return {
      date: '',
      loading: true,
      productionType: 'Select Production Type',
      productionTypeOptions: ['Cutting Day', 'Packing Day', 'Base Day', 'Ice Cream Day'],
      staffOptions: ['Bob', 'Jane', 'Januel'],
      flavourOptions: [
        'Vanilla',
        'Chocolate',
        'Jaffa',
        'Hazelnut',
        'Mint',
        'Mango',
        'Strawberry',
        'Blueberry',
        'Raspberry',
        'Coffee',
      ],
      baseFlavourOptions: ['Vanilla', 'Chocolate'],
      flavourColors: {
        Vanilla: 'yellow-3',
        Chocolate: 'brown',
        Jaffa: 'orange',
        Hazelnut: 'orange-3',
      },
      cuttingFlavourEntries: [],
      packingFlavourEntries: [],
      baseFlavourEntries: [],
      icecreamFlavourEntries: [],
      staffData: [],
    };
  },
  mounted() {
    const currentDate = new Date();
    const DD = currentDate.getDate();
    const MM = currentDate.getMonth() < 10 ? `0${currentDate.getMonth()}` : currentDate.getMonth();
    const YYYY = currentDate.getFullYear();
    this.date = `${DD}-${MM}-${YYYY}`;

    const self = this;
    setInterval(() => {
      self.onUpdate();
    }, AUTOUPDATEINTERVAL * 1000);
  },
  methods: {
    getData() {
      this.startLoading();
      const self = this;
      axios
        .post(`${PATHTOAPI}/flavours/get`, {
          date: String(self.date),
          productionType: String(self.productionType),
        }, {
          headers: {
            'Access-Control-Allow-Origin': '*',
          },
        })
        .then((res) => {
          if (this.productionType === 'Packing Day') {
            this.packingFlavourEntries = res;
          } if (this.productionType === 'Cutting Day') {
            this.cuttingFlavourEntries = res;
          } if (this.productionType === 'Icecream Day') {
            this.icecreamFlavourEntries = res;
          } if (this.productionType === 'Base Day') {
            this.baseFlavourEntries = res;
          }
          self.endLoading();
        })
        .catch((err) => {
          // TODO: use $q.prompt to create alert that there was an error
          throw err;
        });
    },
    onUpdate() {
      console.log('Auto Update'); // eslint-ignore-line
      let flavourEntryData = null;
      if (this.productionType === 'Packing Day') {
        console.log(this.packingFlavourEntries); // eslint-ignore-line
        flavourEntryData = this.packingFlavourEntries;
      } if (this.productionType === 'Cutting Day') {
        console.log(this.cuttingFlavourEntries); // eslint-ignore-line
        flavourEntryData = this.cuttingFlavourEntries;
      } if (this.productionType === 'Icecream Day') {
        console.log(this.icecreamFlavourEntries); // eslint-ignore-line
        flavourEntryData = this.icecreamFlavourEntries;
      } if (this.productionType === 'Base Day') {
        console.log(this.baseFlavourEntries); // eslint-ignore-line
        flavourEntryData = this.baseFlavourEntries;
      }

      const self = this;
      for (let i = 0; i < flavourEntryData.length; i += 1) {
        axios
          .post(`${PATHTOAPI}/flavours/update`, {
            id: String(flavourEntryData[i].id),
            productionType: String(self.productionType),
            flavourEntryData: flavourEntryData[i], // TODO: send data through JSON maybe
          }, {
            headers: {
              'Access-Control-Allow-Origin': '*',
            },
          })
          .then((res) => {
            console.log('saved flavour data', res); // eslint-ignore-line
            // TODO: handle this somehow
          })
          .catch((err) => {
            // TODO: use $q.prompt to create alert that there was an error
            throw err;
          });
      }

      for (let i = 0; i < self.staffData.length; i += 1) {
        axios
          .post(`${PATHTOAPI}/staff/update`, {
            id: String(self.staffData[i].id),
            staffEntryData: Object(self.staffData[i]), // TODO: send data through JSON maybe
          }, {
            headers: {
              'Access-Control-Allow-Origin': '*',
            },
          })
          .then((res) => {
            console.log('saved staff data', res); // eslint-ignore-line
            // TODO: handle this somehow
          })
          .catch((err) => {
            // TODO: use $q.prompt to create alert that there was an error
            throw err;
          });
      }
    },
    startLoading() {
      console.log('Begin Loading...');
      this.loading = true;
    },
    endLoading() {
      console.log('End Loading!');
      this.loading = false;
    },
    // TODO: for adding flavours and all requests, create loading feedback
    addFlavourEntry() {
      let flavourEntryData = null;
      if (this.productionType === 'Packing Day') {
        flavourEntryData = {
          flavour: '',
          batchNumber: 0,
          slabAmount: 0,
          boxAmount: 0,
          useByDate: '',
          sampleAmount: 0,
          notes: '',
        };
      } if (this.productionType === 'Cutting Day') {
        flavourEntryData = {
          flavour: '',
          slabBatch: 0,
          baseBatch: 0,
          slabAmount: 0,
          boxAmount: 0,
        };
      } if (this.productionType === 'Icecream Day') {
        flavourEntryData = {
          flavour: '',
          blenderAmount: 0,
          batchNumber: 0,
          smallAmount: 0,
          largeAmount: 0,
          smallCakeAmount: 0,
          mediumCakeAmount: 0,
          largeCakeAmount: 0,
          notes: '',
        };
      } if (this.productionType === 'Base Day') {
        flavourEntryData = {
          flavour: '',
          blenderAmount: 0,
          batchNumber: 0,
          smallAmount: 0,
          largeAmount: 0,
          smallCakeAmount: 0,
          mediumCakeAmount: 0,
          largeCakeAmount: 0,
          notes: '',
        };
      }

      const self = this;
      axios
        .post(`${PATHTOAPI}/flavours/add`, {
          date: String(self.date),
          productionType: String(self.productionType),
          flavourEntryData,
        }, {
          headers: {
            'Access-Control-Allow-Origin': '*',
          },
        })
        .then((res) => {
          if (this.productionType === 'Packing Day') {
            this.packingFlavourEntries.push(res);
          } if (this.productionType === 'Cutting Day') {
            this.cuttingFlavourEntries.push(res);
          } if (this.productionType === 'Icecream Day') {
            this.icecreamFlavourEntries.push(res);
          } if (this.productionType === 'Base Day') {
            this.baseFlavourEntries.push(res);
          }
        })
        .catch((err) => {
          // TODO: use $q.prompt to create alert that there was an error
          throw err;
        });
    },
    deleteFlavourEntry(index) {
      let flavourEntries = null;
      if (this.productionType === 'Packing Day') {
        flavourEntries = this.packingFlavourEntries;
      } if (this.productionType === 'Cutting Day') {
        flavourEntries = this.cuttingFlavourEntries;
      } if (this.productionType === 'Icecream Day') {
        flavourEntries = this.icecreamFlavourEntries;
      } if (this.productionType === 'Base Day') {
        flavourEntries = this.baseFlavourEntries;
      }

      const self = this;
      axios
        .post(`${PATHTOAPI}/flavours/delete`, {
          id: String(flavourEntries[index].id),
        }, {
          headers: {
            'Access-Control-Allow-Origin': '*',
          },
        })
        .then((res) => {
          console.log('deleted cutting', res);
          if (self.productionType === 'Packing Day') {
            self.packingFlavourEntries.splice(index, 1);
          } if (self.productionType === 'Cutting Day') {
            self.cuttingFlavourEntries.splice(index, 1);
          } if (self.productionType === 'Icecream Day') {
            self.icecreamFlavourEntries.splice(index, 1);
          } if (self.productionType === 'Base Day') {
            self.baseFlavourEntries.splice(index, 1);
          }
        })
        .catch((err) => {
          // TODO: use $q.prompt to create alert that there was an error
          throw err;
        });
    },
    addStaffMember() {
      const self = this;
      axios
        .post(`${PATHTOAPI}/staff/add`, {
          date: String(self.date),
          flavourEntryData: {
            name: '',
            startTime: '',
            endTime: '',
            breakLength: 0,
          },
        }, {
          headers: {
            'Access-Control-Allow-Origin': '*',
          },
        })
        .then((res) => {
          this.staffFlavour.push(res);
        })
        .catch((err) => {
          // TODO: use $q.prompt to create alert that there was an error
          throw err;
        });
    },
    deleteStaffMember(index) {
      const self = this;
      axios
        .post(`${PATHTOAPI}/staff/delete`, {
          id: String(self.staffFlavour[index].id),
        }, {
          headers: {
            'Access-Control-Allow-Origin': '*',
          },
        })
        .then((res) => {
          console.log('deleted cutting', res);
          this.staffFlavour.splice(index, 1);
        })
        .catch((err) => {
          // TODO: use $q.prompt to create alert that there was an error
          throw err;
        });
    },
  },
  watch: {
    date(newDate) {
      console.log('changed Date', newDate);
      this.productionType = 'Select Production Type';
    },
    productionType(newProductionType) {
      console.log('changed production type', newProductionType); // eslint-ignore-line
      this.getData();
    },
  },
});
</script>
