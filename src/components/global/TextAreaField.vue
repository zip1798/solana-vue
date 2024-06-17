<script setup lang="ts">
    import { computed } from 'vue'

    const props = defineProps<{ 
        title: string,
        id: string,
        name: string,
        autocomplete?: string,
        textError: string,
        modelValue: string
        isValid: boolean
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

    const classObject = computed(() => ({
        'block': true, 'w-full': true, 'rounded-md': true, 'border-0': true, 'py-1.5': true,
        'text-gray-900': props.isValid, 'ring-gray-300': props.isValid, 'placeholder:text-gray-400': props.isValid, 'focus:ring-indigo-600': props.isValid,
        'text-red-900': !props.isValid, 'ring-red-300': !props.isValid, 'placeholder:text-red-300': !props.isValid, 'focus:ring-red-500': !props.isValid,
        'shadow-sm ring-1': true, 'ring-inset': true, 'focus:ring-2': true, 
        'focus:ring-inset': true, 'sm:text-sm': true, 'sm:leading-6': true, 'z-0': true
    }))

</script>

<template>
    <div class="col-span-full">
        <label for="title" :class="['block', 'text-sm', 'font-medium', 'leading-6', isValid?'text-gray-900':'text-red-600']">{{ title }}</label>
        <div class="mt-2">
            <textarea 
                v-model="selected"  :name="name" :id="id" :autocomplete="autocomplete"
                rows="3" 
                :class="classObject" 
                />
        </div>
        <p class="mt-2 text-sm text-red-600" id="title-error" v-if="!isValid">{{ textError }}</p>
        <p class="mt-3 text-sm leading-6 text-gray-600">Write a few sentences about this card.</p>
    </div>
</template>