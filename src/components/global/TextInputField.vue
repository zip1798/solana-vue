<script setup lang="ts">
    import { computed } from 'vue'
    import { ExclamationCircleIcon } from '@heroicons/vue/20/solid'

    const props = defineProps<{ 
        title: string,
        id: string,
        name: string,
        autocomplete?: string,
        textError: string,
        modelValue: string
        isValid: boolean,
        prefix?: string,
        suffix?: string,
        placeholder?: string,
        width?: string
     }>()

    const emit = defineEmits(['update:modelValue'])

    const selected = computed({
        get() {
            return props.modelValue
        },
        set(value) {
            emit('update:modelValue', value)
        }
    })

    const fieldWidthClass = computed(() => {
        switch(props.width) {
            case "1": return 'sm:col-span-1';
            case "3": return 'sm:col-span-3';
        }

        return 'col-span-full';
    })

    const classObject = computed(() => ({
        'block': true, 'w-full': true, 'rounded-md': true, 'border-0': true, 'py-1.5': true,
        'pl-12': !!props.prefix,  'pr-12': !!props.suffix,
        'text-gray-900': props.isValid, 'ring-gray-300': props.isValid, 'placeholder:text-gray-400': props.isValid, 'focus:ring-indigo-600': props.isValid,
        'text-red-900': !props.isValid, 'ring-red-300': !props.isValid, 'placeholder:text-red-300': !props.isValid, 'focus:ring-red-500': !props.isValid,
        'shadow-sm ring-1': true, 'ring-inset': true, 'focus:ring-2': true, 
        'focus:ring-inset': true, 'sm:text-sm': true, 'sm:leading-6': true, 'z-0': true
    }))

</script>

<template>
    <div :class="fieldWidthClass">
        <label for="title" :class="['block', 'text-sm', 'font-medium', 'leading-6', isValid?'text-gray-900':'text-red-600']">{{ title }}</label>
        <div class="relative mt-2">
            <div v-if="prefix" class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <span class="text-gray-500 sm:text-sm">{{ prefix }}</span>
            </div>

            <input v-model="selected" type="text" :name="name" :id="id" :autocomplete="autocomplete" 
                :class="classObject" 
                :placeholder="placeholder"
                aria-invalid="true" aria-describedby="title-error" />
            <div v-if="!isValid && !suffix" class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                <ExclamationCircleIcon class="h-5 w-5 text-red-500" aria-hidden="true" />
            </div>
            <div v-if="suffix" class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                <span class="text-gray-500 sm:text-sm">{{ suffix }}</span>
            </div>
        </div>

        <p class="mt-2 text-sm text-red-600" id="title-error" v-if="!isValid">{{ textError }}</p>
        </div>
</template>