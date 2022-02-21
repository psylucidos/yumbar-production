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
              <q-select dense v-model="productionDay" :options="productionDayOptions" />
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
                    <q-skeleton v-if="loading" type="QInput" />
                  </div>

                  <div class="col-auto">
                    <q-btn
                      v-if="!loading"
                      flat
                      round
                      icon="delete"
                      @click="deletePackingFlavor(index)"
                    />
                    <q-skeleton v-if="loading" type="QAvatar" />
                  </div>
                </div>

                <div class="col-3 pad-right">
                  <q-input
                    v-if="!loading"
                    label="Slab Batch"
                    required
                    v-model.number="packingData[index].batchNumber"
                    :rules="[ val => val >= 1 || 'Batch must be positive!' ]"
                    type="number"
                    :color="flavorColors[packingData[index].flavor]"
                  />
                  <q-skeleton v-if="loading" type="QInput" />
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
                  <q-skeleton v-if="loading" type="QInput" />
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
                  <q-skeleton v-if="loading" type="QInput" />
                </div>
                <div class="col-3">
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
                  <q-skeleton v-if="loading" type="QInput" />
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
                  <q-skeleton v-if="loading" type="QInput" />
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
              <q-skeleton v-if="loading" type="QBtn" class="full-width" />
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
                    <q-skeleton v-if="loading" type="QInput" />
                  </div>

                  <div class="col-auto">
                    <q-btn
                      v-if="!loading"
                      flat
                      round
                      icon="delete"
                      @click="deleteFlavor(index)"
                    />
                    <q-skeleton v-if="loading" type="QAvatar" />
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
                  <q-skeleton v-if="loading" type="QInput" />
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
                  <q-skeleton v-if="loading" type="QInput" />
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
                  <q-skeleton v-if="loading" type="QInput" />
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
                  <q-skeleton v-if="loading" type="QInput" />
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
                  <q-skeleton v-if="loading" type="QInput" />
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
              <q-skeleton v-if="loading" type="QBtn" class="full-width" />
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
                    <q-skeleton v-if="loading" type="QInput" />
                  </div>

                  <div class="col-auto">
                    <q-btn
                      v-if="!loading"
                      flat
                      round
                      icon="delete"
                      @click="deleteBaseFlavor(index)"
                    />
                    <q-skeleton v-if="loading" type="QAvatar" />
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
                  <q-skeleton v-if="loading" type="QInput" />
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
                  <q-skeleton v-if="loading" type="QInput" />
                </div>
                <div class="col-3 pad-right">
                  <q-input
                    v-if="!loading"
                    label="Number of Small Bases"
                    required
                    v-model.number="baseData[index].smallAmount"
                    :rules="[ val => val >= 0 || 'Amount must not be negative!' ]"
                    type="number"
                    :color="flavorColors[baseData[index].flavor]"
                  />
                  <q-skeleton v-if="loading" type="QInput" />
                </div>
                <div class="col-3">
                  <q-input
                    v-if="!loading"
                    label="Number of Cake Bases"
                    required
                    v-model.number="baseData[index].cakeAmount"
                    :rules="[ val => val >= 0 || 'Amount must not be negative!' ]"
                    type="number"
                    :color="flavorColors[baseData[index].flavor]"
                  />
                  <q-skeleton v-if="loading" type="QInput" />
                </div>
                <div class="row full-width items-center justify-center">
                  <div v-if="!loading" class="text-h6">
                    Total Bases: {{ baseData[index].largeAmount
                                  + baseData[index].smallAmount
                                  + baseData[index].cakeAmount
                                  || 0 }}
                  </div>
                  <q-skeleton class="col-4" v-if="loading" type="QInput" height="3vh" />
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
                  <q-skeleton v-if="loading" type="QInput" />
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
              <q-skeleton v-if="loading" type="QBtn" class="full-width" />
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
                    <q-skeleton v-if="loading" type="QInput" />
                  </div>

                  <div class="col-auto">
                    <q-btn
                      v-if="!loading"
                      flat
                      round
                      icon="delete"
                      @click="deleteIcecreamFlavor(index)"
                    />
                    <q-skeleton v-if="loading" type="QAvatar" />
                  </div>
                </div>

                <div class="col-4 pad-right">
                  <q-input
                    v-if="!loading"
                    label="Batch Number"
                    required
                    v-model.number="icecreamData[index].batchNumber"
                    :rules="[ val => val >= 1 || 'Batch must be positive!' ]"
                    type="number"
                    :color="flavorColors[icecreamData[index].flavor]"
                  />
                  <q-skeleton v-if="loading" type="QInput" />
                </div>
                <div class="col-4 pad-right">
                  <q-input
                    v-if="!loading"
                    label="Number of Jugs"
                    required
                    v-model.number="icecreamData[index].jugsAmount"
                    :rules="[ val => val >= 0 || 'Amount must not be negative!' ]"
                    type="number"
                    :color="flavorColors[icecreamData[index].flavor]"
                  />
                  <q-skeleton v-if="loading" type="QInput" />
                </div>
                <div class="col-4">
                  <q-input
                    v-if="!loading"
                    label="Number of Trays"
                    required
                    v-model.number="icecreamData[index].traysAmount"
                    :rules="[ val => val >= 0 || 'Amount must not be negative!' ]"
                    type="number"
                    :color="flavorColors[icecreamData[index].flavor]"
                  />
                  <q-skeleton v-if="loading" type="QInput" />
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
                  <q-skeleton v-if="loading" type="QInput" />
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
              <q-skeleton v-if="loading" type="QBtn" class="full-width" />
            </q-tab-panel>
          </q-tab-panels>
        </q-card-section>

        <q-card-section id="save-btn-container">
          <q-btn label="Save" class="full-width" :disabled="loading" type="submit" color="primary"/>
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

  .flavor-item {
    padding: 1vw;
    border: 0.5px solid white;
    margin-bottom: 16px;
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

export default defineComponent({
  name: 'PageData',
  data() {
    return {
      date: '',
      loading: true,
      productionDay: 'Select Production Type',
      productionDayOptions: ['Packing Day', 'Base Day', 'Cutting Day', 'Ice Cream Day'],
      flavorOptions: ['Vanilla', 'Chocolate', 'Jaffa', 'Hazelnut'],
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
          batch: '',
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
          notes: '',
        },
      ],
      baseData: [
        {
          flavor: '',
          batchNumber: '',
          smallAmount: '',
          largeAmount: '',
          cakeAmount: '',
          notes: '',
        },
      ],
      icecreamData: [
        {
          flavor: '',
          batchNumber: '',
          jugsAmount: '',
          traysAmount: '',
          notes: '',
        },
      ],
    };
  },
  created() {
    const currentDate = new Date();
    const DD = currentDate.getDate();
    const MM = currentDate.getMonth() < 10 ? `0${currentDate.getMonth()}` : currentDate.getMonth();
    const YYYY = currentDate.getFullYear();
    this.date = `${DD}-${MM}-${YYYY}`;

    const self = this;
    setTimeout(() => {
      self.loading = false;
    }, 3 * 1000);
  },
  methods: {
    onUpdate() {
      if (this.productionDay === 'Packing Day') {
        console.log(this.packingData); // eslint-ignore-line
      }
    },
    addCuttingFlavor() {
      this.cuttingData.push({
        flavor: '',
        batch: '',
        slabBatch: '',
        baseBatch: '',
        slabAmount: '',
        boxAmount: '',
      });
    },
    addPackingFlavor() {
      this.packingData.push({
        flavor: '',
        batchNumber: '',
        slabAmount: '',
        boxAmount: '',
        useByDate: '',
        notes: '',
      });
    },
    addBaseFlavor() {
      this.baseData.push({
        flavor: '',
        batchNumber: '',
        smallAmount: '',
        largeAmount: '',
        cakeAmount: '',
        notes: '',
      });
    },
    addIcecreamFlavor() {
      this.icecreamData.push({
        flavor: '',
        batchNumber: '',
        jugsAmount: '',
        traysAmount: '',
        notes: '',
      });
    },
    deleteCuttingFlavor(index) {
      this.cuttingData.splice(index, 1);
    },
    deletePackingFlavor(index) {
      this.packingData.splice(index, 1);
    },
    deleteBaseFlavor(index) {
      this.baseData.splice(index, 1);
    },
    deleteIcecreamFlavor(index) {
      this.icecreamData.splice(index, 1);
    },
  },
});
</script>
