<template>
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
                v-model="productionDay"
                :options="productionDayOptions"
                :disable="loading"
              />
            </div>
          </div>

        </q-card-section>

        <q-separator />

        <q-card-section class="bg-grey-2">
          <q-tab-panels v-model="productionDay" class="bg-grey-2">
            <q-tab-panel name="Packing Day">
              <q-card
                v-for="(item, index) in packingData"
                v-bind:key="index"
                class="row items-center full-width flavor-item"
              >
                <div class="row full-width items-center no-wrap">
                  <div class="col pad-right">
                    <q-select
                      v-if="!loading"
                      label="Batch Flavor"
                      required
                      v-model="packingData[index].flavor"
                      :rules="[ val => flavorOptions.includes(val) || 'Please select flavor!' ]"
                      :options="flavorOptions"
                      :color="flavorColors[packingData[index].flavor]"
                    />
                  </div>

                  <div class="col-auto pad-right">
                    <q-input
                      v-if="!loading"
                      label="Use by Date"
                      required
                      v-model="packingData[index].useByDate"
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
                            <q-date v-model="packingData[index].useByDate" mask="DD-MM-YYYY">
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
                      @click="deletePackingFlavor(index)"
                    />
                  </div>
                </div>

                <div class="col-3 pad-right">
                  <q-input
                    v-if="!loading"
                    label="Slab Batch #"
                    required
                    v-model.number="packingData[index].batchNumber"
                    :rules="[ val => val >= 1 || 'Batch must be positive!' ]"
                    type="number"
                    :color="flavorColors[packingData[index].flavor]"
                  />
                </div>
                <div class="col-3 pad-right">
                  <q-input
                    v-if="!loading"
                    label="Number of Slabs"
                    required
                    v-model.number="packingData[index].slabAmount"
                    :rules="[ val => val >= 1 || 'Amount must be positive!' ]"
                    type="number"
                    :color="flavorColors[packingData[index].flavor]"
                  />
                </div>
                <div class="col-3 pad-right">
                  <q-input
                    v-if="!loading"
                    label="Number of Boxes"
                    required
                    v-model.number="packingData[index].boxAmount"
                    :rules="[ val => val >= 1 || 'Amount must be positive!' ]"
                    type="number"
                    :color="flavorColors[packingData[index].flavor]"
                  />
                </div>
                <div class="col-3">
                  <q-input
                    v-if="!loading"
                    label="Number of Samples"
                    required
                    v-model.number="packingData[index].sampleAmount"
                    :rules="[ val => val >= 1 || 'Amount must be positive!' ]"
                    type="number"
                    :color="flavorColors[packingData[index].flavor]"
                  />
                </div>

                <div class="col-12">
                  <q-input
                    v-if="!loading"
                    label="Notes"
                    v-model="packingData[index].notes"
                    type="text"
                    autogrow
                    :color="flavorColors[packingData[index].flavor]"
                  />
                </div>
              </q-card>

              <q-btn
                v-if="!loading"
                icon="add"
                id="add-flavor-btn"
                label="Add Flavor"
                class="full-width"
                color="primary"
                @click="addPackingFlavor"
              />
            </q-tab-panel>

            <q-tab-panel name="Cutting Day">
              <q-card
                v-for="(item, index) in cuttingData"
                v-bind:key="index"
                class="row items-center full-width flavor-item"
              >
                <div class="row full-width items-center no-wrap">
                  <div class="col pad-right">
                    <q-select
                      v-if="!loading"
                      label="Batch Flavor"
                      required
                      v-model="cuttingData[index].flavor"
                      :rules="[ val => flavorOptions.includes(val) || 'Please select flavor!' ]"
                      :options="flavorOptions"
                      :color="flavorColors[cuttingData[index].flavor]"
                    />
                  </div>

                  <div class="col-auto">
                    <q-btn
                      v-if="!loading"
                      flat
                      round
                      icon="delete"
                      @click="deleteFlavor(index)"
                    />
                  </div>
                </div>

                <div class="col-3 pad-right">
                  <q-input
                    v-if="!loading"
                    label="Slab Batch"
                    required
                    v-model.number="cuttingData[index].slabBatch"
                    :rules="[ val => val >= 1 || 'Batch must be positive!' ]"
                    type="number"
                    :color="flavorColors[cuttingData[index].flavor]"
                  />
                </div>
                <div class="col-3 pad-right">
                  <q-input
                    v-if="!loading"
                    label="Base Batch"
                    required
                    v-model.number="cuttingData[index].baseBatch"
                    :rules="[ val => val >= 1 || 'Batch must be positive!' ]"
                    type="number"
                    :color="flavorColors[cuttingData[index].flavor]"
                  />
                </div>
                <div class="col-3 pad-right">
                  <q-input
                    v-if="!loading"
                    label="Slab Amount"
                    required
                    v-model.number="cuttingData[index].slabAmount"
                    :rules="[ val => val >= 1 || 'Amount must be positive!' ]"
                    type="number"
                    :color="flavorColors[cuttingData[index].flavor]"
                  />
                </div>
                <div class="col-3">
                  <q-input
                    v-if="!loading"
                    label="Box Amount"
                    required
                    v-model.number="cuttingData[index].boxAmount"
                    :rules="[ val => val >= 1 || 'Amount must be positive!' ]"
                    type="number"
                    :color="flavorColors[cuttingData[index].flavor]"
                  />
                </div>
                <div class="col-12">
                  <q-input
                    v-if="!loading"
                    label="Notes"
                    v-model="cuttingData[index].notes"
                    type="text"
                    autogrow
                    :color="flavorColors[cuttingData[index].flavor]"
                  />
                </div>
              </q-card>

              <q-btn
                v-if="!loading"
                icon="add"
                id="add-flavor-btn"
                label="Add Flavor"
                class="full-width"
                color="primary"
                @click="addCuttingFlavor"
              />
            </q-tab-panel>

            <q-tab-panel name="Base Day">
              <q-card
                v-for="(item, index) in baseData"
                v-bind:key="index"
                class="row items-center full-width flavor-item"
              >
                <div class="row full-width items-center no-wrap">
                  <div class="col pad-right">
                    <q-select
                      v-if="!loading"
                      label="Batch Flavor"
                      required
                      v-model="baseData[index].flavor"
                      :rules="[ val => flavorOptions.includes(val) || 'Please select flavor!' ]"
                      :options="baseFlavorOptions"
                      :color="flavorColors[baseData[index].flavor]"
                    />
                  </div>

                  <div class="col-auto">
                    <q-btn
                      v-if="!loading"
                      flat
                      round
                      icon="delete"
                      @click="deleteBaseFlavor(index)"
                    />
                  </div>
                </div>

                <div class="col-3 pad-right">
                  <q-input
                    v-if="!loading"
                    label="Base Batch"
                    required
                    v-model.number="baseData[index].batchNumber"
                    :rules="[ val => val >= 1 || 'Batch must be positive!' ]"
                    type="number"
                    :color="flavorColors[baseData[index].flavor]"
                  />
                </div>
                <div class="col-3 pad-right">
                  <q-input
                    v-if="!loading"
                    label="Number of Blender Batches"
                    required
                    v-model.number="baseData[index].blenderAmount"
                    :rules="[ val => val >= 1 || 'Amount must be positive!' ]"
                    type="number"
                    :color="flavorColors[baseData[index].flavor]"
                  />
                </div>
                <div class="col-3 pad-right">
                  <q-input
                    v-if="!loading"
                    label="Number of Large Bases"
                    required
                    v-model.number="baseData[index].largeAmount"
                    :rules="[ val => val >= 0 || 'Amount must not be negative!' ]"
                    type="number"
                    :color="flavorColors[baseData[index].flavor]"
                  />
                </div>
                <div class="col-3">
                  <q-input
                    v-if="!loading"
                    label="Number of Small Bases"
                    required
                    v-model.number="baseData[index].smallAmount"
                    :rules="[ val => val >= 0 || 'Amount must not be negative!' ]"
                    type="number"
                    :color="flavorColors[baseData[index].flavor]"
                  />
                </div>
                <div class="col-4 pad-right">
                  <q-input
                    v-if="!loading"
                    label="Number of Small Cake Bases"
                    required
                    v-model.number="baseData[index].smallCakeAmount"
                    :rules="[ val => val >= 0 || 'Amount must not be negative!' ]"
                    type="number"
                    :color="flavorColors[baseData[index].flavor]"
                  />
                </div>
                <div class="col-4 pad-right">
                  <q-input
                    v-if="!loading"
                    label="Number of Medium Cake Bases"
                    required
                    v-model.number="baseData[index].mediumCakeAmount"
                    :rules="[ val => val >= 0 || 'Amount must not be negative!' ]"
                    type="number"
                    :color="flavorColors[baseData[index].flavor]"
                  />
                </div>
                <div class="col-4">
                  <q-input
                    v-if="!loading"
                    label="Number of Large Cake Bases"
                    required
                    v-model.number="baseData[index].largeCakeAmount"
                    :rules="[ val => val >= 0 || 'Amount must not be negative!' ]"
                    type="number"
                    :color="flavorColors[baseData[index].flavor]"
                  />
                </div>
                <div class="col-12">
                  <q-input
                    v-if="!loading"
                    label="Notes"
                    v-model="baseData[index].notes"
                    type="text"
                    autogrow
                    :color="flavorColors[baseData[index].flavor]"
                  />
                </div>
              </q-card>

              <q-btn
                v-if="!loading"
                icon="add"
                id="add-flavor-btn"
                label="Add Flavor"
                class="full-width"
                color="primary"
                @click="addBaseFlavor"
              />
            </q-tab-panel>

            <q-tab-panel name="Ice Cream Day">
              <q-card
                v-for="(item, index) in icecreamData"
                v-bind:key="index"
                class="row items-center full-width flavor-item"
              >
                <div class="row full-width items-center no-wrap">
                  <div class="col pad-right">
                    <q-select
                      v-if="!loading"
                      label="Batch Flavor"
                      required
                      v-model="icecreamData[index].flavor"
                      :rules="[ val => flavorOptions.includes(val) || 'Please select flavor!' ]"
                      :options="flavorOptions"
                      :color="flavorColors[icecreamData[index].flavor]"
                    />
                  </div>

                  <div class="col-auto">
                    <q-btn
                      v-if="!loading"
                      flat
                      round
                      icon="delete"
                      @click="deleteIcecreamFlavor(index)"
                    />
                  </div>
                </div>

                <div class="col-3 pad-right">
                  <q-input
                    v-if="!loading"
                    label="Batch Number"
                    required
                    v-model.number="icecreamData[index].batchNumber"
                    :rules="[ val => val >= 1 || 'Batch must be positive!' ]"
                    type="number"
                    :color="flavorColors[icecreamData[index].flavor]"
                  />
                </div>
                <div class="col-3 pad-right">
                  <q-input
                    v-if="!loading"
                    label="Number of Jugs"
                    required
                    v-model.number="icecreamData[index].jugsAmount"
                    :rules="[ val => val >= 0 || 'Amount must not be negative!' ]"
                    type="number"
                    :color="flavorColors[icecreamData[index].flavor]"
                  />
                </div>
                <div class="col-3 pad-right">
                  <q-input
                    v-if="!loading"
                    label="Number of Trays"
                    required
                    v-model.number="icecreamData[index].traysAmount"
                    :rules="[ val => val >= 0 || 'Amount must not be negative!' ]"
                    type="number"
                    :color="flavorColors[icecreamData[index].flavor]"
                  />
                </div>
                <div class="col-3">
                  <q-input
                    v-if="!loading"
                    label="Number of Unsaleable Trays"
                    required
                    v-model.number="icecreamData[index].unsaleableTraysAmount"
                    :rules="[ val => val >= 0 || 'Amount must not be negative!' ]"
                    type="number"
                    :color="flavorColors[icecreamData[index].flavor]"
                  />
                </div>
                <div class="col-12">
                  <q-input
                    v-if="!loading"
                    label="Notes"
                    v-model="icecreamData[index].notes"
                    type="text"
                    autogrow
                    :color="flavorColors[icecreamData[index].flavor]"
                  />
                </div>
              </q-card>

              <q-btn
                v-if="!loading"
                icon="add"
                id="add-flavor-btn"
                label="Add Flavor"
                class="full-width"
                color="primary"
                @click="addIcecreamFlavor"
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
                  class="row items-center full-width flavor-item"
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

  .flavor-item, .staff-item {
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
      productionDay: 'Select Production Type',
      productionDayOptions: ['Cutting Day', 'Packing Day', 'Base Day', 'Ice Cream Day'],
      staffOptions: ['Bob', 'Jane', 'Januel'],
      flavorOptions: [
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
      baseFlavorOptions: ['Vanilla', 'Chocolate'],
      flavorColors: {
        Vanilla: 'yellow-3',
        Chocolate: 'brown',
        Jaffa: 'orange',
        Hazelnut: 'orange-3',
      },
      cuttingData: [
        {
          flavor: '',
          slabBatch: '',
          baseBatch: '',
          slabAmount: '',
          boxAmount: '',
          notes: '',
        },
      ],
      packingData: [
        {
          flavor: '',
          batchNumber: '',
          slabAmount: '',
          boxAmount: '',
          useByDate: '',
          sampleAmount: '',
          notes: '',
        },
      ],
      baseData: [
        {
          flavor: '',
          blenderAmount: '',
          batchNumber: '',
          smallAmount: '',
          largeAmount: '',
          smallCakeAmount: '',
          mediumCakeAmount: '',
          largeCakeAmount: '',
          notes: '',
        },
      ],
      icecreamData: [
        {
          flavor: '',
          batchNumber: '',
          jugsAmount: '',
          traysAmount: '',
          unsaleableTraysAmount: '',
          notes: '',
        },
      ],
      staffData: [
        {
          name: '',
          startTime: '',
          endTime: '',
          breakLength: '',
        },
      ],
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
          productionType: String(self.productionDay),
        })
        .then((res) => {
          if (this.productionDay === 'Packing Day') {
            this.packingData = res;
          } if (this.productionDay === 'Cutting Day') {
            this.cuttingData = res;
          } if (this.productionDay === 'Icecream Day') {
            this.icecreamData = res;
          } if (this.productionDay === 'Base Day') {
            this.baseData = res;
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
      if (this.productionDay === 'Packing Day') {
        console.log(this.packingData); // eslint-ignore-line
        flavourEntryData = this.packingData;
      } if (this.productionDay === 'Cutting Day') {
        console.log(this.cuttingData); // eslint-ignore-line
        flavourEntryData = this.cuttingData;
      } if (this.productionDay === 'Icecream Day') {
        console.log(this.icecreamData); // eslint-ignore-line
        flavourEntryData = this.icecreamData;
      } if (this.productionDay === 'Base Day') {
        console.log(this.baseData); // eslint-ignore-line
        flavourEntryData = this.baseData;
      }

      const self = this;
      for (let i = 0; i < flavourEntryData.length; i += 1) {
        axios
          .post(`${PATHTOAPI}/flavours/update`, {
            id: String(flavourEntryData[i].id),
            productionType: String(self.productionDay),
            flavourEntryData: flavourEntryData[i], // TODO: send data through JSON maybe
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
    // TODO: homogenise all post requests
    addCuttingFlavor() {
      const self = this;
      axios
        .post(`${PATHTOAPI}/flavours/add`, {
          date: String(self.date),
          productionType: String(self.productionDay),
          flavourEntryData: {
            flavor: '',
            slabBatch: 0,
            baseBatch: 0,
            slabAmount: 0,
            boxAmount: 0,
          },
        })
        .then((res) => {
          this.cuttingData.push(res);
        })
        .catch((err) => {
          // TODO: use $q.prompt to create alert that there was an error
          throw err;
        });
    },
    addPackingFlavor() {
      const self = this;
      axios
        .post(`${PATHTOAPI}/flavours/add`, {
          date: String(self.date),
          productionType: String(self.productionDay),
          flavourEntryData: {
            flavor: '',
            batchNumber: 0,
            slabAmount: 0,
            boxAmount: 0,
            useByDate: '',
            sampleAmount: 0,
            notes: '',
          },
        })
        .then((res) => {
          this.packingData.push(res);
        })
        .catch((err) => {
          // TODO: use $q.prompt to create alert that there was an error
          throw err;
        });
    },
    addBaseFlavor() {
      const self = this;
      axios
        .post(`${PATHTOAPI}/flavours/add`, {
          date: String(self.date),
          productionType: String(self.productionDay),
          flavourEntryData: {
            flavor: '',
            blenderAmount: 0,
            batchNumber: 0,
            smallAmount: 0,
            largeAmount: 0,
            smallCakeAmount: 0,
            mediumCakeAmount: 0,
            largeCakeAmount: 0,
            notes: '',
          },
        })
        .then((res) => {
          this.baseData.push(res);
        })
        .catch((err) => {
          // TODO: use $q.prompt to create alert that there was an error
          throw err;
        });
    },
    addIcecreamFlavor() {
      const self = this;
      axios
        .post(`${PATHTOAPI}/flavours/add`, {
          date: String(self.date),
          productionType: String(self.productionDay),
          flavourEntryData: {
            flavor: '',
            batchNumber: 0,
            jugsAmount: 0,
            traysAmount: 0,
            unsaleableTraysAmount: 0,
            notes: '',
          },
        })
        .then((res) => {
          this.icecreamData.push(res);
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
        })
        .then((res) => {
          this.staffData.push(res);
        })
        .catch((err) => {
          // TODO: use $q.prompt to create alert that there was an error
          throw err;
        });
    },
    deleteCuttingFlavor(index) {
      const self = this;
      axios
        .post(`${PATHTOAPI}/flavours/delete`, {
          id: String(self.cuttingData[index].id),
        })
        .then((res) => {
          console.log('deleted cutting', res);
          this.cuttingData.splice(index, 1);
        })
        .catch((err) => {
          // TODO: use $q.prompt to create alert that there was an error
          throw err;
        });
    },
    deletePackingFlavor(index) {
      const self = this;
      axios
        .post(`${PATHTOAPI}/flavours/delete`, {
          id: String(self.packingData[index].id),
        })
        .then((res) => {
          console.log('deleted cutting', res);
          this.packingData.splice(index, 1);
        })
        .catch((err) => {
          // TODO: use $q.prompt to create alert that there was an error
          throw err;
        });
    },
    deleteBaseFlavor(index) {
      const self = this;
      axios
        .post(`${PATHTOAPI}/flavours/delete`, {
          id: String(self.baseData[index].id),
        })
        .then((res) => {
          console.log('deleted cutting', res);
          this.baseData.splice(index, 1);
        })
        .catch((err) => {
          // TODO: use $q.prompt to create alert that there was an error
          throw err;
        });
    },
    deleteIcecreamFlavor(index) {
      const self = this;
      axios
        .post(`${PATHTOAPI}/flavours/delete`, {
          id: String(self.icecreamData[index].id),
        })
        .then((res) => {
          console.log('deleted cutting', res);
          this.icecreamData.splice(index, 1);
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
          id: String(self.staffData[index].id),
        })
        .then((res) => {
          console.log('deleted cutting', res);
          this.staffData.splice(index, 1);
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
      this.productionDay = 'Select Production Type';
    },
    productionDay(newProductionType) {
      console.log('changed production type', newProductionType); // eslint-ignore-line
      this.getData();
    },
  },
});
</script>
