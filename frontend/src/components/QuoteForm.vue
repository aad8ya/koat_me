<template>
  <n-card
    :title="renderTitle"
    style="
      max-width: 480px;
      margin: 40px auto;
      background-color: rgba(255, 255, 255, 0.95);
    "
    :bordered="false"
    size="large"
    embedded
  >
    <n-form
      :model="form"
      :rules="rules"
      ref="formRef"
      label-width="130"
      size="large"
    >
      <n-form-item label="Contractor Name" path="contractor">
        <n-input
          v-model:value="form.contractor"
          placeholder="Enter full name"
        />
      </n-form-item>

      <n-form-item label="Company" path="company">
        <n-input
          v-model:value="form.company"
          placeholder="Enter company name"
        />
      </n-form-item>

      <n-form-item label="Roof Size" path="roofSize">
        <n-input-number
          v-model:value="form.roofSize"
          :min="0"
          :max="100000"
          :precision="2"
          placeholder="Roof size in sq ft"
          style="width: 100%"
        />
      </n-form-item>

      <n-form-item label="Roof Type" path="roofTypeId">
        <n-select
          v-model:value="form.roofTypeId"
          :options="roofTypeOptions"
          placeholder="Select roof type"
          filterable
        />
      </n-form-item>

      <n-form-item label="City" path="city">
        <n-input v-model:value="form.city" placeholder="Enter city" />
      </n-form-item>

      <n-form-item label="State" path="state">
        <n-select
          v-model:value="form.state"
          :options="stateOptions"
          placeholder="Select state"
          filterable
        />
      </n-form-item>

      <n-form-item label="Project Date" path="projectDate">
        <n-date-picker
          v-model:value="form.projectDate"
          type="date"
          clearable
          style="width: 100%"
        />
      </n-form-item>

      <n-form-item>
        <n-space justify="center" style="width: 100%">
          <n-button
            round
            type="primary"
            @click="handleSubmit"
            :disabled="!isFormComplete"
            style="margin: 5px 10px"
          >
            Submit
          </n-button>

          <n-button
            round
            quaternary
            type="primary"
            @click="resetForm"
            :disabled="isFormEmpty"
            style="margin: 5px 10px"
          >
            Reset
          </n-button>
        </n-space>
      </n-form-item>
    </n-form>
  </n-card>
</template>

<script setup>
import { h, ref, computed, onMounted } from "vue";
import {
  NCard,
  NForm,
  NFormItem,
  NInput,
  NInputNumber,
  NSelect,
  NDatePicker,
  NButton,
  useMessage,
} from "naive-ui";
import { api } from "@/api";

const formRef = ref(null);
const message = useMessage();

const form = ref({
  contractor: "",
  company: "",
  roofSize: null,
  roofTypeId: null,
  city: "",
  state: null,
  projectDate: null,
});

const rules = {
  contractor: { required: true, message: "Required", trigger: "blur" },
  company: { required: true, message: "Required", trigger: "blur" },
  roofSize: {
    required: true,
    type: "number",
    message: "Required",
    trigger: "blur",
  },
  roofTypeId: { required: true, message: "Select a type", trigger: "change" },
  city: { required: true, message: "Required", trigger: "blur" },
  state: { required: true, message: "Select a state", trigger: "change" },
  projectDate: {
    required: true,
    type: "number",
    message: "Pick a date",
    trigger: "change",
  },
};

const roofTypeOptions = ref([]);
const stateOptions = [
  { label: "Alabama", value: "AL" },
  { label: "Alaska", value: "AK" },
  { label: "Arizona", value: "AZ" },
  { label: "Arkansas", value: "AR" },
  { label: "California", value: "CA" },
  { label: "Colorado", value: "CO" },
  { label: "Connecticut", value: "CT" },
  { label: "Delaware", value: "DE" },
  { label: "District Of Columbia", value: "DC" },
  { label: "Florida", value: "FL" },
  { label: "Georgia", value: "GA" },
  { label: "Hawaii", value: "HI" },
  { label: "Idaho", value: "ID" },
  { label: "Illinois", value: "IL" },
  { label: "Indiana", value: "IN" },
  { label: "Iowa", value: "IA" },
  { label: "Kansas", value: "KS" },
  { label: "Kentucky", value: "KY" },
  { label: "Louisiana", value: "LA" },
  { label: "Maine", value: "ME" },
  { label: "Maryland", value: "MD" },
  { label: "Massachusetts", value: "MA" },
  { label: "Michigan", value: "MI" },
  { label: "Minnesota", value: "MN" },
  { label: "Mississippi", value: "MS" },
  { label: "Missouri", value: "MO" },
  { label: "Montana", value: "MT" },
  { label: "Nebraska", value: "NE" },
  { label: "Nevada", value: "NV" },
  { label: "New Hampshire", value: "NH" },
  { label: "New Jersey", value: "NJ" },
  { label: "New Mexico", value: "NM" },
  { label: "New York", value: "NY" },
  { label: "North Carolina", value: "NC" },
  { label: "North Dakota", value: "ND" },
  { label: "Ohio", value: "OH" },
  { label: "Oklahoma", value: "OK" },
  { label: "Oregon", value: "OR" },
  { label: "Pennsylvania", value: "PA" },
  { label: "Rhode Island", value: "RI" },
  { label: "South Carolina", value: "SC" },
  { label: "South Dakota", value: "SD" },
  { label: "Tennessee", value: "TN" },
  { label: "Texas", value: "TX" },
  { label: "Utah", value: "UT" },
  { label: "Vermont", value: "VT" },
  { label: "Virginia", value: "VA" },
  { label: "Washington", value: "WA" },
  { label: "West Virginia", value: "WV" },
  { label: "Wisconsin", value: "WI" },
  { label: "Wyoming", value: "WY" },
];

const isFormEmpty = computed(() => {
  return (
    !form.value.contractor &&
    !form.value.company &&
    !form.value.roofSize &&
    !form.value.roofTypeId &&
    !form.value.city &&
    !form.value.state &&
    !form.value.projectDate
  );
});

const isFormComplete = computed(() => {
  return (
    !!form.value.contractor &&
    !!form.value.company &&
    !!form.value.roofSize &&
    !!form.value.roofTypeId &&
    !!form.value.city &&
    !!form.value.state &&
    !!form.value.projectDate
  );
});

const renderTitle = () =>
  h(
    "div",
    { style: "font-size: 1.75rem; font-weight: bold;" },
    "Roofing Project Quote"
  );

const resetForm = () => {
  Object.keys(form.value).forEach((key) => {
    form.value[key] = null;
  });
  formRef.value?.restoreValidation();
};

const fetchRoofTypes = async () => {
  try {
    const { data } = await api.get("/api/roof-types");
    roofTypeOptions.value = data.map((rt) => ({
      label: rt.name,
      value: String(rt.id),
    }));
  } catch (err) {
    message.error("Failed to load roof types");
    console.error(err);
  }
};

const handleSubmit = async () => {
  try {
    await formRef.value?.validate();
    const payload = {
      ...form.value,
      projectDate: new Date(form.value.projectDate).toISOString(),
    };

    await api.post("/api/submit", payload);
    message.success("Quote submitted!");
    formRef.value.restoreValidation();
    Object.keys(form.value).forEach((k) => (form.value[k] = null));
  } catch (err) {
    console.error(err);
    message.error("Submission failed.");
  }
};

onMounted(fetchRoofTypes);
</script>
