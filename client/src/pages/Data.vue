<template>
  <q-page class="flex flex-center">
    <q-card class="data-card">
      <q-form
        @submit="onUpdate"
        @validation-success="formIsValid = true"
        @validation-error="formIsValid = false"
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
                :rules="[ val => isValidDate(val) || 'Please enter a valid date!']"
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
                :rules="[ val => !!val || 'Please enter a production type!']"
                @update:model-value="productionTypeSelecterUpdate"
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
                      label="Batch Flavour"
                      required
                      v-model="packingFlavourEntries[index].flavour"
                      :rules="[ val =>flavourOptions.concat(packingDayFlavourOptions).includes(val)
                        || 'Please select flavour!' ]"
                      :options="flavourOptions.concat(packingDayFlavourOptions)"
                      :color="flavourColors[packingFlavourEntries[index].flavour]"
                    />
                  </div>

                  <div class="col-auto pad-right">
                    <q-input
                      label="Use by Date (DD-MM-YYYY)"
                      required
                      v-model="packingFlavourEntries[index].usebydate"
                      mask="##-##-####"
                      :rules="[ val => isValidDate(val) || 'Please enter a valid date!']"
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
                              v-model="packingFlavourEntries[index].usebydate"
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
                      flat
                      round
                      icon="delete"
                      @click="deleteFlavourEntry(index)"
                    />
                  </div>
                </div>

                <div class="col-3 pad-right">
                  <q-input
                    label="Slab Batch #"
                    required
                    v-model.number="packingFlavourEntries[index].batchnumber"
                    @focus="$event.target.select()"
                    :rules="[ val => val >= 0 || 'Batch must be positive!' ]"
                    type="number"
                    :color="flavourColors[packingFlavourEntries[index].flavour]"
                  />
                </div>
                <div class="col-3 pad-right">
                  <q-input
                    label="Number of Boxes"
                    required
                    v-model.number="packingFlavourEntries[index].boxamount"
                    @focus="$event.target.select()"
                    @update:model-value="val => packingFlavourEntries[index].slabamount = val * 2"
                    :rules="[ val => val >= 0 || 'Amount must be positive!' ]"
                    type="number"
                    :color="flavourColors[packingFlavourEntries[index].flavour]"
                  />
                </div>
                <div class="col-3 pad-right">
                  <q-input
                    label="Number of Slabs"
                    required
                    v-model.number="packingFlavourEntries[index].slabamount"
                    @focus="$event.target.select()"
                    :rules="[ val => val >= 0 || 'Amount must be positive!' ]"
                    type="number"
                    :color="flavourColors[packingFlavourEntries[index].flavour]"
                  />
                </div>
                <div class="col-3">
                  <q-input
                    label="Number of Samples"
                    required
                    v-model.number="packingFlavourEntries[index].sampleamount"
                    @focus="$event.target.select()"
                    :rules="[ val => val >= 0 || 'amount must be positive!' ]"
                    type="number"
                    :color="flavourColors[packingFlavourEntries[index].flavour]"
                  />
                </div>

                <div class="col-12">
                  <q-input
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
                @click="addFlavourEntry"
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
                      flat
                      round
                      icon="delete"
                      @click="deleteFlavourEntry(index)"
                    />
                  </div>
                </div>

                <div class="col-3 pad-right">
                  <q-input

                    label="Slab Batch #"
                    required
                    v-model.number="cuttingFlavourEntries[index].slabbatch"
                    @focus="$event.target.select()"
                    :rules="[ val => val >= 0 || 'Batch must be positive!' ]"
                    type="number"
                    :color="flavourColors[cuttingFlavourEntries[index].flavour]"
                  />
                </div>
                <div class="col-3 pad-right">
                  <q-input
                    label="Base Batch #"
                    required
                    v-model.number="cuttingFlavourEntries[index].basebatch"
                    @focus="$event.target.select()"
                    :rules="[ val => val >= 0 || 'Batch must be positive!' ]"
                    type="number"
                    :color="flavourColors[cuttingFlavourEntries[index].flavour]"
                  />
                </div>
                <div class="col-3 pad-right">
                  <q-input
                    label="Slab amount"
                    required
                    v-model.number="cuttingFlavourEntries[index].slabamount"
                    @update:model-value="val => cuttingFlavourEntries[index].boxamount = Math.floor(val / 2)"
                    @focus="$event.target.select()"
                    :rules="[ val => val >= 0 || 'amount must be positive!' ]"
                    type="number"
                    :color="flavourColors[cuttingFlavourEntries[index].flavour]"
                  />
                </div>
                <div class="col-3">
                  <q-input
                    label="Box amount"
                    required
                    v-model.number="cuttingFlavourEntries[index].boxamount"
                    @focus="$event.target.select()"
                    :rules="[ val => val >= 0 || 'amount must be positive!' ]"
                    type="number"
                    :color="flavourColors[cuttingFlavourEntries[index].flavour]"
                  />
                </div>
                <div class="col-12">
                  <q-input

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
                @click="addFlavourEntry"
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
                      flat
                      round
                      icon="delete"
                      @click="deleteFlavourEntry(index)"
                    />
                  </div>
                </div>

                <div class="col-3 pad-right">
                  <q-input

                    label="Base Batch #"
                    required
                    v-model.number="baseFlavourEntries[index].batchnumber"
                    @focus="$event.target.select()"
                    :rules="[ val => val >= 0 || 'Batch must be positive!' ]"
                    type="number"
                    :color="flavourColors[baseFlavourEntries[index].flavour]"
                  />
                </div>
                <div class="col-3 pad-right">
                  <q-input
                    label="Number of Blender Batches"
                    required
                    v-model.number="baseFlavourEntries[index].blenderamount"
                    @focus="$event.target.select()"
                    :rules="[ val => val >= 0 || 'amount must be positive!' ]"
                    type="number"
                    :color="flavourColors[baseFlavourEntries[index].flavour]"
                  />
                </div>
                <div class="col-3 pad-right">
                  <q-input
                    label="Number of Large Bases"
                    required
                    v-model.number="baseFlavourEntries[index].largeamount"
                    @focus="$event.target.select()"
                    :rules="[ val => val >= 0 || 'amount must not be negative!' ]"
                    type="number"
                    :color="flavourColors[baseFlavourEntries[index].flavour]"
                  />
                </div>
                <div class="col-3">
                  <q-input
                    label="Number of Small Bases"
                    required
                    v-model.number="baseFlavourEntries[index].smallamount"
                    @focus="$event.target.select()"
                    :rules="[ val => val >= 0 || 'amount must not be negative!' ]"
                    type="number"
                    :color="flavourColors[baseFlavourEntries[index].flavour]"
                  />
                </div>
                <div class="col-4 pad-right">
                  <q-input
                    label="Number of Small Cake Bases"
                    required
                    v-model.number="baseFlavourEntries[index].smallcakeamount"
                    @focus="$event.target.select()"
                    :rules="[ val => val >= 0 || 'amount must not be negative!' ]"
                    type="number"
                    :color="flavourColors[baseFlavourEntries[index].flavour]"
                  />
                </div>
                <div class="col-4 pad-right">
                  <q-input
                    label="Number of Medium Cake Bases"
                    required
                    v-model.number="baseFlavourEntries[index].mediumcakeamount"
                    @focus="$event.target.select()"
                    :rules="[ val => val >= 0 || 'amount must not be negative!' ]"
                    type="number"
                    :color="flavourColors[baseFlavourEntries[index].flavour]"
                  />
                </div>
                <div class="col-4">
                  <q-input
                    label="Number of Large Cake Bases"
                    required
                    v-model.number="baseFlavourEntries[index].largecakeamount"
                    @focus="$event.target.select()"
                    :rules="[ val => val >= 0 || 'amount must not be negative!' ]"
                    type="number"
                    :color="flavourColors[baseFlavourEntries[index].flavour]"
                  />
                </div>
                <div class="col-12">
                  <q-input
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
                @click="addFlavourEntry"
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
                      flat
                      round
                      icon="delete"
                      @click="deleteFlavourEntry(index)"
                    />
                  </div>
                </div>

                <div class="col-3 pad-right">
                  <q-input
                    label="Batch #"
                    required
                    v-model.number="icecreamFlavourEntries[index].batchnumber"
                    @focus="$event.target.select()"
                    :rules="[ val => val >= 0 || 'Batch must be positive!' ]"
                    type="number"
                    :color="flavourColors[icecreamFlavourEntries[index].flavour]"
                  />
                </div>
                <div class="col-3 pad-right">
                  <q-input
                    label="Number of Jugs"
                    required
                    v-model.number="icecreamFlavourEntries[index].jugsamount"
                    @focus="$event.target.select()"
                    :rules="[ val => val >= 0 || 'amount must not be negative!' ]"
                    type="number"
                    :color="flavourColors[icecreamFlavourEntries[index].flavour]"
                  />
                </div>
                <div class="col-3 pad-right">
                  <q-input
                    label="Number of Trays"
                    required
                    v-model.number="icecreamFlavourEntries[index].traysamount"
                    @focus="$event.target.select()"
                    :rules="[ val => val >= 0 || 'amount must not be negative!' ]"
                    type="number"
                    :color="flavourColors[icecreamFlavourEntries[index].flavour]"
                  />
                </div>
                <div class="col-3">
                  <q-input
                    label="Weight of Unsaleable Icecream"
                    required
                    v-model.number="icecreamFlavourEntries[index].unsaleableweight"
                    @focus="$event.target.select()"
                    :rules="[ val => val >= 0 || 'amount must not be negative!' ]"
                    type="number"
                    :color="flavourColors[icecreamFlavourEntries[index].flavour]"
                  />
                </div>
                <div class="col-12">
                  <q-input
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
                @click="addFlavourEntry"
              />
            </q-tab-panel>

            <q-tab-panel name="Select Production Type">
              <div
                v-if="!loading"
                class="full-width text-center text-h6 text-grey"
              >
                Please Select Production Type
              </div>
            </q-tab-panel>
          </q-tab-panels>

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

            <q-skeleton v-if="loading" type="QBtn" class="full-width" />
          </div>

        </q-card-section>

        <q-separator />

        <q-card-section
          class="bg-grey-2"
          v-if="!loading"
        >
          <q-card
            v-for="(item, index) in staffEntries"
            v-bind:key="index"
            class="row items-center full-width staff-item"
          >
            <div class="row full-width items-center no-wrap">
              <div class="col pad-right">
                <q-select
                  label="Staff Member"
                  required
                  v-model="staffEntries[index].name"
                  :rules="[ val => staffOptions.includes(val) || 'Please select staff member!' ]"
                  :options="staffOptions"
                />
              </div>

              <div class="col-3 pad-right">
                <q-input
                  label="Start Time (24h)"
                  v-model="staffEntries[index].starttime"
                  :rules="[ val => val.match(/[0-9][0-9]:[0-9][0-9]$/)
                        || 'Please enter a valid time (HH:MM)!']"
                  required
                  class="q-field--with-bottom"
                >
                  <template v-slot:append>
                    <q-icon name="access_time" class="cursor-pointer">
                      <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                        <q-time v-model="staffEntries[index].starttime">
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
                  label="End Time (24h)"
                  v-model="staffEntries[index].endtime"
                  required
                  :rules="[ val => val.match(/[0-9][0-9]:[0-9][0-9]$/)
                        || 'Please enter a valid time (HH:MM)!']"
                  class="q-field--with-bottom"
                >
                  <template v-slot:append>
                    <q-icon name="access_time" class="cursor-pointer">
                      <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                        <q-time v-model="staffEntries[index].endtime">
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
                  v-model="staffEntries[index].breaklength"
                  @focus="$event.target.select()"
                  :rules="[ val => val >= 0 || 'Please enter a number!']"
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
          <q-btn
            label="Save"
            class="full-width"
            :loading="saveLoading"
            :disable="loading"
            type="submit"
            color="primary"
          />
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
    padding-bottom: 3vh;
    margin-bottom: 16px;
  }

  .staff-item {
    padding-top: 1vh;
    padding-bottom: 3vh;

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

const AUTOUPDATEINTERVAL = 30;

function checkObjectNotNull(obj) {
  const keys = Object.keys(obj);
  for (let i = 0; i < keys.length; i += 1) {
    if (obj[keys[i]] !== null || obj[keys[i]] !== undefined) {
      if (typeof obj[keys[i]] === 'object'
        && !Array.isArray(obj[keys[i]])
        && obj[keys[i]] !== null) {
        const subObject = checkObjectNotNull(obj[keys[i]]);
        if (!subObject) {
          return false;
        }
      }
    } else {
      return false;
    }
  }
  return true;
}

export default defineComponent({
  name: 'PageData',
  data() {
    return {
      date: '',
      loading: true,
      productionType: 'Select Production Type',
      oldProductionType: '',
      productionTypeOptions: ['Cutting Day', 'Packing Day', 'Base Day', 'Ice Cream Day'],
      staffOptions: ['Andoah', 'Alysse', 'Cat', 'Beau', 'Iris', 'Lily', 'Isabelle', 'Nicole', 'Yindi', 'Azalea', 'Kira', 'Satima', 'Lucy',
        'Sutara', 'Sophie', 'Dale'],
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
        'Caramel',
      ],
      packingDayFlavourOptions: [
        'Combo 1',
        'Combo 2',
        'Combo 3',
        'Combo 4',
        'Combo 5',
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
      staffEntries: [],
      dateCreated: false,
      saveLoading: false,
      dayID: null,
      test: 3,
      formIsValid: false,
    };
  },
  mounted() {
    const currentDate = new Date();
    const DD = currentDate.getDate() < 10 ? `0${currentDate.getDate()}` : currentDate.getDate();
    const M = currentDate.getMonth() + 1; // account for dates starting at 0
    const MM = M < 10 ? `0${M}` : M;
    const YYYY = currentDate.getFullYear();
    this.date = `${DD}-${MM}-${YYYY}`;

    const self = this;
    setInterval(() => {
      self.onUpdate();
    }, AUTOUPDATEINTERVAL * 1000);
  },
  methods: {
    getData() {
      console.log('trying to get data on', this.date, 'for', this.productionType);
      this.startLoading();

      this.cuttingFlavourEntries = [];
      this.packingFlavourEntries = [];
      this.baseFlavourEntries = [];
      this.icecreamFlavourEntries = [];
      this.staffEntries = [];

      const self = this;
      if (self.productionType !== 'Select Production Type') {
        this.$api
          .post('/flavours/get', {
            date: String(self.date),
            productionType: String(self.productionType),
          }, {
            headers: {
              Authorization: `Bearer ${self.$store.state.token}`,
            },
          })
          .then((flavoursRes) => {
            console.log('received flavours response', flavoursRes);
            const flavourData = flavoursRes.data;
            if (self.productionType === 'Packing Day') {
              self.packingFlavourEntries = flavourData;
            } else if (self.productionType === 'Cutting Day') {
              self.cuttingFlavourEntries = flavourData;
            } else if (self.productionType === 'Ice Cream Day') {
              self.icecreamFlavourEntries = flavourData;
            } else if (self.productionType === 'Base Day') {
              self.baseFlavourEntries = flavourData;
            } else {
              console.log(self.productionType);
              throw new Error('Cannot get flavour with no local production date!');
            }
          })
          .catch((err) => {
            if (err.response) {
              if (err.response.status === 401) {
                self.$router.push('/');
                throw err;
              } else {
                self.$q.notify({
                  message: `Unexpected Error (${err.response.status})! Please Reload Page!`,
                  icon: 'warning',
                  color: 'red',
                });
                throw err;
              }
            } else {
              self.$q.notify({
                message: 'Unexpected Error! Server May be Down!',
                icon: 'warning',
                color: 'red',
              });
              throw err;
            }
          });
      }

      this.$api
        .post('/staff/get', {
          date: String(self.date),
        }, {
          headers: {
            Authorization: `Bearer ${self.$store.state.token}`,
          },
        })
        .then((staffRes) => {
          console.log('received staff response', staffRes);
          const staffData = staffRes.data;
          self.staffEntries = staffData;
          self.endLoading();
        })
        .catch((err) => {
          if (err.response) {
            if (err.response.status === 401) {
              self.$router.push('/');
              throw err;
            } else {
              self.$q.notify({
                message: `Unexpected Error (${err.response.status})! Please Reload Page!`,
                icon: 'warning',
                color: 'red',
              });
              throw err;
            }
          } else {
            self.$q.notify({
              message: 'Unexpected Error! Server May be Down!',
              icon: 'warning',
              color: 'red',
            });
            throw err;
          }
        });
    },
    onUpdate() {
      console.log('Attempting to save with form validity', this.formIsValid);
      let flavourEntryData = null;
      if (this.productionType === 'Packing Day') {
        console.log(this.packingFlavourEntries);
        flavourEntryData = this.packingFlavourEntries;
      } else if (this.productionType === 'Cutting Day') {
        console.log(this.cuttingFlavourEntries);
        flavourEntryData = this.cuttingFlavourEntries;
      } else if (this.productionType === 'Ice Cream Day') {
        console.log(this.icecreamFlavourEntries);
        flavourEntryData = this.icecreamFlavourEntries;
      } else if (this.productionType === 'Base Day') {
        console.log(this.baseFlavourEntries);
        flavourEntryData = this.baseFlavourEntries;
      } else {
        return;
      }

      // check on data entry page and object data is complete
      if ((window.location.hash !== '#/data' || !checkObjectNotNull(flavourEntryData))
        || !this.formIsValid) {
        console.log('passing over auto save');
        return;
      }

      this.saveLoading = true;

      console.log('Posting update REQ');
      // will not execute if there are no entries
      const self = this;
      for (let i = 0; i < flavourEntryData.length; i += 1) {
        this.$api
          .post('/flavours/update', {
            id: String(flavourEntryData[i].id),
            productionType: String(self.productionType),
            flavourEntryData: flavourEntryData[i], // TODO: send data through JSON maybe
          }, {
            headers: {
              Authorization: `Bearer ${self.$store.state.token}`,
            },
          })
          .then((res) => {
            console.log('saved flavour data', res);
            self.saveLoading = false;
          })
          .catch((err) => {
            if (err.response) {
              if (err.response.status === 401) {
                self.$router.push('/');
                throw err;
              } else {
                self.$q.notify({
                  message: `Unexpected Error (${err.response.status})! Please Reload Page!`,
                  icon: 'warning',
                  color: 'red',
                });
                throw err;
              }
            } else {
              self.$q.notify({
                message: 'Unexpected Error! Server May be Down!',
                icon: 'warning',
                color: 'red',
              });
              throw err;
            }
          });
      }

      for (let i = 0; i < self.staffEntries.length; i += 1) {
        this.$api
          .post('/staff/update', {
            id: String(self.staffEntries[i].id),
            staffEntryData: Object(self.staffEntries[i]), // TODO: send data through JSON maybe
          }, {
            headers: {
              Authorization: `Bearer ${self.$store.state.token}`,
            },
          })
          .then((res) => {
            console.log('saved staff data', res);
          })
          .catch((err) => {
            if (err.response) {
              if (err.response.status === 401) {
                self.$router.push('/');
                throw err;
              } else {
                self.$q.notify({
                  message: `Unexpected Error (${err.response.status})! Please Reload Page!`,
                  icon: 'warning',
                  color: 'red',
                });
                throw err;
              }
            } else {
              self.$q.notify({
                message: 'Unexpected Error! Server May be Down!',
                icon: 'warning',
                color: 'red',
              });
              throw err;
            }
          });
      }
    },
    startLoading() {
      console.log('Begin Loading...');
      this.loading = true;
    },
    endLoading() {
      console.log('End Loading!');
      const self = this;
      setTimeout(() => {
        self.loading = false;
      }, 300);
    },
    addFlavourEntry() {
      let flavourEntryData = null;
      if (this.productionType === 'Packing Day') {
        let previousBatchNumber = 0;
        let previousUseBy = '';
        if (this.packingFlavourEntries.length > 0) {
          const previousEntry = this.packingFlavourEntries[this.packingFlavourEntries.length - 1];
          previousBatchNumber = previousEntry.batchnumber;
          previousUseBy = previousEntry.usebydate;
        }
        flavourEntryData = {
          flavour: '',
          batchnumber: previousBatchNumber,
          slabamount: 0,
          boxamount: 0,
          usebydate: previousUseBy,
          sampleamount: 0,
          notes: '',
        };
      } else if (this.productionType === 'Cutting Day') {
        let previousSlabBatch = 0;
        let previousBaseBatch = 0;
        if (this.cuttingFlavourEntries.length > 0) {
          const previousEntry = this.cuttingFlavourEntries[this.cuttingFlavourEntries.length - 1];
          previousSlabBatch = previousEntry.slabbatch;
          previousBaseBatch = previousEntry.basebatch;
        }
        flavourEntryData = {
          flavour: '',
          slabbatch: previousSlabBatch,
          basebatch: previousBaseBatch,
          slabamount: 0,
          boxamount: 0,
          notes: '',
        };
      } else if (this.productionType === 'Ice Cream Day') {
        let previousBatch = 0;
        if (this.icecreamFlavourEntries.length > 0) {
          const previousEntry = this.icecreamFlavourEntries[this.icecreamFlavourEntries.length - 1];
          previousBatch = previousEntry.batchnumber;
        }
        flavourEntryData = {
          flavour: '',
          batchnumber: previousBatch,
          jugsamount: 0,
          traysamount: 0,
          unsaleableweight: 0,
          notes: '',
        };
      } else if (this.productionType === 'Base Day') {
        let previousBatch = 0;
        if (this.baseFlavourEntries.length > 0) {
          const previousEntry = this.baseFlavourEntries[this.baseFlavourEntries.length - 1];
          previousBatch = previousEntry.batchnumber;
        }
        flavourEntryData = {
          flavour: '',
          blenderamount: 0,
          batchnumber: previousBatch,
          smallamount: 0,
          largeamount: 0,
          smallcakeamount: 0,
          mediumcakeamount: 0,
          largecakeamount: 0,
          notes: '',
        };
      } else {
        throw new Error('Cannot add flavour with no local production date!');
      }

      const self = this;
      this.$api
        .post('/flavours/add', {
          date: String(self.date),
          productionType: String(self.productionType),
          flavourEntryData,
        }, {
          headers: {
            Authorization: `Bearer ${self.$store.state.token}`,
          },
        })
        .then((res) => {
          const { data } = res;
          if (self.productionType === 'Packing Day') {
            self.packingFlavourEntries.push(data);
          } else if (self.productionType === 'Cutting Day') {
            self.cuttingFlavourEntries.push(data);
          } else if (self.productionType === 'Ice Cream Day') {
            self.icecreamFlavourEntries.push(data);
          } else if (self.productionType === 'Base Day') {
            self.baseFlavourEntries.push(data);
          } else {
            throw new Error('Cannot add flavour with no local production date!');
          }
        })
        .catch((err) => {
          if (err.response) {
            if (err.response.status === 401) {
              self.$router.push('/');
              throw err;
            } else {
              self.$q.notify({
                message: `Unexpected Error (${err.response.status})! Please Reload Page!`,
                icon: 'warning',
                color: 'red',
              });
              throw err;
            }
          } else {
            self.$q.notify({
              message: 'Unexpected Error! Server May be Down!',
              icon: 'warning',
              color: 'red',
            });
            throw err;
          }
        });
    },
    deleteFlavourEntry(index) {
      console.log('Deleting flavour entry');
      let flavourEntries = null;
      if (this.productionType === 'Packing Day') {
        flavourEntries = this.packingFlavourEntries;
      } else if (this.productionType === 'Cutting Day') {
        flavourEntries = this.cuttingFlavourEntries;
      } else if (this.productionType === 'Ice Cream Day') {
        flavourEntries = this.icecreamFlavourEntries;
      } else if (this.productionType === 'Base Day') {
        flavourEntries = this.baseFlavourEntries;
      } else {
        throw new Error('Cannot delete flavour with no local production date!');
      }

      console.log('Posting delete REQ! with flavour entry:', flavourEntries[index]);
      const self = this;
      this.$api
        .post('/flavours/delete', {
          id: String(flavourEntries[index].id),
          productionType: String(self.productionType),
        }, {
          headers: {
            Authorization: `Bearer ${self.$store.state.token}`,
          },
        })
        .then((res) => {
          console.log('deleted flavour entry', res);
          if (self.productionType === 'Packing Day') {
            self.packingFlavourEntries.splice(index, 1);
          } else if (self.productionType === 'Cutting Day') {
            self.cuttingFlavourEntries.splice(index, 1);
          } else if (self.productionType === 'Ice Cream Day') {
            self.icecreamFlavourEntries.splice(index, 1);
          } else if (self.productionType === 'Base Day') {
            self.baseFlavourEntries.splice(index, 1);
          } else {
            throw new Error('Cannot delete flavour with no local production date!');
          }
        })
        .catch((err) => {
          if (err.response) {
            if (err.response.status === 401) {
              self.$router.push('/');
              throw err;
            } else {
              self.$q.notify({
                message: `Unexpected Error (${err.response.status})! Please Reload Page!`,
                icon: 'warning',
                color: 'red',
              });
              throw err;
            }
          } else {
            self.$q.notify({
              message: 'Unexpected Error! Server May be Down!',
              icon: 'warning',
              color: 'red',
            });
            throw err;
          }
        });
    },
    addStaffMember() {
      const self = this;
      this.$api
        .post('/staff/add', {
          date: String(self.date),
          staffEntryData: {
            name: '',
            starttime: '',
            endtime: '',
            breaklength: 0,
          },
        }, {
          headers: {
            Authorization: `Bearer ${self.$store.state.token}`,
          },
        })
        .then((res) => {
          const { data } = res;
          self.staffEntries.push(data);
        })
        .catch((err) => {
          if (err.response) {
            if (err.response.status === 401) {
              self.$router.push('/');
              throw err;
            } else {
              self.$q.notify({
                message: `Unexpected Error (${err.response.status})! Please Reload Page!`,
                icon: 'warning',
                color: 'red',
              });
              throw err;
            }
          } else {
            self.$q.notify({
              message: 'Unexpected Error! Server May be Down!',
              icon: 'warning',
              color: 'red',
            });
            throw err;
          }
        });
    },
    deleteStaffMember(index) {
      const self = this;
      this.$api
        .post('/staff/delete', {
          id: String(self.staffEntries[index].id),
        }, {
          headers: {
            Authorization: `Bearer ${self.$store.state.token}`,
          },
        })
        .then((res) => {
          console.log('deleted cutting', res);
          self.staffEntries.splice(index, 1);
        })
        .catch((err) => {
          if (err.response) {
            if (err.response.status === 401) {
              self.$router.push('/');
              throw err;
            } else {
              self.$q.notify({
                message: `Unexpected Error (${err.response.status})! Please Reload Page!`,
                icon: 'warning',
                color: 'red',
              });
              throw err;
            }
          } else {
            self.$q.notify({
              message: 'Unexpected Error! Server May be Down!',
              icon: 'warning',
              color: 'red',
            });
            throw err;
          }
        });
    },
    updateLocalProductionType(newProductionType, oldProductionType, updateFromUser) {
      console.log('update local production type to', newProductionType, 'from', oldProductionType);
      console.log('from user', updateFromUser, 'date created?', this.dateCreated);

      if (!updateFromUser) {
        this.productionType = newProductionType;
        this.oldProductionType = newProductionType;
      }

      if (!this.dateCreated && newProductionType !== 'Select Production Type') {
        const self = this;
        this.$api
          .post('/days/add', {
            date: String(self.date),
            productionType: String(newProductionType),
          }, {
            headers: {
              Authorization: `Bearer ${self.$store.state.token}`,
            },
          })
          .then((res) => {
            const { data } = res;
            self.endLoading();
            self.dateCreated = true;
            console.log('add day data', data);
          })
          .catch((err) => {
            if (err.response) {
              if (err.response.status === 401) {
                self.$router.push('/');
                throw err;
              } else {
                self.$q.notify({
                  message: `Unexpected Error (${err.response.status})! Please Reload Page!`,
                  icon: 'warning',
                  color: 'red',
                });
                throw err;
              }
            } else {
              self.$q.notify({
                message: 'Unexpected Error! Server May be Down!',
                icon: 'warning',
                color: 'red',
              });
              throw err;
            }
          });
      } else if (this.dateCreated && newProductionType !== 'Select Production Type'
              && oldProductionType !== 'Select Production Type'
              && updateFromUser) {
        const self = this;
        this.$q.dialog({
          title: 'Confirm',
          message: `Would you like to change the production type on the ${this.date} to a ${newProductionType}? This will delete all previously created data entries on this date.`,
          cancel: true,
          persistent: true,
        }).onOk(() => {
          console.log('updating day production type');
          self.$api
            .post('/days/update', {
              id: String(self.dayID),
              productionType: String(newProductionType),
            }, {
              headers: {
                Authorization: `Bearer ${self.$store.state.token}`,
              },
            })
            .then((res) => {
              const { data } = res;
              console.log('update day data', data);
              self.getData();
            })
            .catch((err) => {
              if (err.response) {
                if (err.response.status === 401) {
                  self.$router.push('/');
                  throw err;
                } else {
                  self.$q.notify({
                    message: `Unexpected Error (${err.response.status})! Please Reload Page!`,
                    icon: 'warning',
                    color: 'red',
                  });
                  throw err;
                }
              } else {
                self.$q.notify({
                  message: 'Unexpected Error! Server May be Down!',
                  icon: 'warning',
                  color: 'red',
                });
                throw err;
              }
            });
        }).onCancel(() => {
          console.log('cancelling to', oldProductionType);
          self.productionType = oldProductionType;
          self.endLoading();
        });
      } else {
        this.getData();
      }
    },
    productionTypeSelecterUpdate(newValue) {
      console.log('User changed production type!');
      this.startLoading();
      this.updateLocalProductionType(newValue, String(this.oldProductionType), true);
      this.oldProductionType = newValue;
    },
    isValidDate(date) {
      const [dd, mm, yyyy] = date.split('-');
      if (dd.length !== 2
      || mm.length !== 2
      || yyyy.length !== 4) {
        return false;
      }
      const parsedDate = new Date(`${yyyy}/${mm}/${dd}`);
      console.log(parsedDate);
      if (parsedDate.getTime() > 0) {
        return true;
      }
      return false;
    },
  },
  watch: {
    date(newDate) {
      this.startLoading();
      console.log('User changed date to', newDate);
      const self = this;
      this.$api
        .post('/days/get', {
          date: String(self.date),
        }, {
          headers: {
            Authorization: `Bearer ${self.$store.state.token}`,
          },
        })
        .then((res) => {
          const { data } = res;
          console.log('get day', data);
          if (data.id) {
            self.dayID = data.id;
            self.dateCreated = true;
            self.updateLocalProductionType(data.productiontype, String(self.productionType), false);
          } else {
            self.dateCreated = false;
            self.updateLocalProductionType('Select Production Type', String(self.productionType), false);
          }
        })
        .catch((err) => {
          if (err.response) {
            if (err.response.status === 401) {
              self.$router.push('/');
              throw err;
            } else {
              self.$q.notify({
                message: `Unexpected Error (${err.response.status})! Please Reload Page!`,
                icon: 'warning',
                color: 'red',
              });
              self.updateLocalProductionType('Select Production Type', String(self.productionType), false);
              throw err;
            }
          } else {
            self.$q.notify({
              message: 'Unexpected Error! Server May be Down!',
              icon: 'warning',
              color: 'red',
            });
            self.updateLocalProductionType('Select Production Type', String(self.productionType), false);
            throw err;
          }
        });
    },
  },
});
</script>
