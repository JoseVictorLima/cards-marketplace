<script setup lang="ts">
import { ref, watch } from 'vue';
import type { ValidationRule } from 'quasar';
interface props {
  modelValue: string | number | null | undefined;
  type?: 'text' | 'password' | 'textarea' | 'email';
  label?: string;
  lazyRules?: boolean;
  rules?: ValidationRule[];
  disable?: boolean;
  required?: boolean;
  maxlength?: string | number;
  hint?: string;
}

const props = withDefaults(defineProps<props>(), {
  modelValue: '',
  type: 'text',
  lazyRules: false,
  rules: () => {
    return [];
  },
  disable: false,
  loading: false,
  required: false,
  maxlength: '',
  hint: '',
});

const $emit = defineEmits<{
  (e: 'update:modelValue', value: string | number | null | undefined): void;
}>();
const inputValue = ref(props.modelValue);
const inputType = ref(props.type);
const isPwd = ref(true);

// Show or hide password.
function showHidePassword() {
  isPwd.value = !isPwd.value;
  if (isPwd.value) inputType.value = 'password';
  else inputType.value = 'text';
}

watch(
  () => props.modelValue,
  (newValue) => {
    if (newValue != null && props.modelValue != inputValue.value) {
      inputValue.value = props.modelValue;
    }
  },
);

watch(
  () => props.type,
  (newValue) => {
    if (newValue != null && props.modelValue != inputValue.value) {
      inputType.value = props.type;
    }
  },
);

watch(
  () => inputValue.value,
  () => {
    $emit('update:modelValue', inputValue.value);
  },
);
</script>
<template>
  <div>
    <q-input
      :disable="props.disable"
      v-model="inputValue"
      outlined
      :type="inputType"
      :label="props.label"
      :lazy-rules="props.lazyRules"
      :rules="props.rules"
      :maxlength="props.maxlength"
      :hint="props.hint"
    >
      <template v-slot:label v-if="props.required && props.label"> {{ props.label }} * </template>
      <template v-slot:append v-if="props.type === 'password'">
        <q-icon
          class="cursor-pointer text-primary"
          :name="isPwd ? 'fa-solid fa-eye-slash' : 'fa-solid fa-eye'"
          @click="showHidePassword()"
        />
      </template>
    </q-input>
  </div>
</template>
